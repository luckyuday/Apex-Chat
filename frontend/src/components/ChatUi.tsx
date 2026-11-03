import ChatHistory from "./ChatHistory";
import { connectSocket, getSocket } from "../../services/socket";
import { useGetUserQuery } from "../../store/api/userApi";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Message } from "../../types/message";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { selectChat } from "../../store/slices/chatIdSlice";
import { messageApi, useGetMessagesQuery } from "../../store/api/messageApi";
import { ArrowRight } from "lucide-react";
import { toast } from "react-toastify";

const ChatUi = () => {
  const user = useGetUserQuery();
  const socketRef = useRef<ReturnType<typeof getSocket>>(null);
  const [messageLock, setMessageLock] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const chatId = useAppSelector(selectChat);
  const dispatch = useAppDispatch();
  // Mirror the RTK Query cache for this chat (RTK dedupes the request) so
  // the socket handler can read the freshest list without a second fetch.
  const { currentData: cachedMessages } = useGetMessagesQuery(chatId, {
    skip: !chatId,
  });
  const cacheRef = useRef<Message[]>([]);
  useEffect(() => {
    cacheRef.current = cachedMessages ?? [];
  }, [cachedMessages]);
  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (!userMessage || userMessage.trim() == "") {
      toast.error("Message should not be empty");
      return;
    }
    if (!socketRef.current?.connected) {
      toast.error("Connection to the server is lost. Please refresh the page.");
      return;
    }
    setMessageLock(true);
    const activeMessage: Message = {
      content: userMessage,
      role: "user",
      createdAt: new Date().toISOString(),
      _id: Date.now().toString(),
      chat: chatId,
    };
    setUserMessage("");
    const responseMessage: Message = {
      _id: "pending",
      content: "Loading....",
      role: "model",
      createdAt: "pending",
      chat: chatId,
    };
    setMessages((prev) => [...prev, activeMessage, responseMessage]);

    socketRef.current?.emit("aiMessage", {
      chat: chatId,
      content: userMessage,
    });
  };
  useEffect(() => {
    if (user.currentData && !socketRef.current) {
      socketRef.current = connectSocket();
      socketRef.current?.on("disconnect", () => {
        // Connection dropped mid-response: release the lock and drop the
        // pending "Loading...." bubble so the input doesn't stick disabled.
        setMessageLock(false);
        setMessages((prev) => prev.filter((m) => m._id !== "pending"));
      });
    }
  }, [user.currentData]);
  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);
  useEffect(() => {
    // Drop any pending messages/lock belonging to the previous chat
    setMessages([]);
    setMessageLock(false);
  }, [chatId]);
  useEffect(() => {
    if (!socketRef.current) return;
    const handler = (message: Message) => {
      if (message.chat && message.chat !== chatId) return;
      if (message.role == "model") {
        setMessageLock(false);
      }
      if (!chatId) return;
      // upsert instead of updateQueryData: the cache entry may not exist
      // yet (query still fetching / skipped), and updateQueryData throws
      // on a missing entry, which would abort the handler and stick the
      // "Loading...." bubble. Dedupe by _id so a concurrent refetch that
      // already contains the message can't create a duplicate.
      dispatch(
        messageApi.util.upsertQueryData(
          "getMessages",
          chatId,
          [
            ...cacheRef.current.filter((m) => m._id !== message._id),
            message,
          ],
        ),
      );
      setMessages((prev) => prev.filter((e) => e.role != message.role));
    };
    // Streaming deltas: grow the pending "Loading...." bubble in place as
    // the answer is generated. The final aiResponse event replaces it with
    // the persisted copy (the local optimistic bubbles are dropped, and the
    // RTK cache drives rendering from then on).
    const chunkHandler = (payload: { chat: string; delta: string }) => {
      if (payload.chat && payload.chat !== chatId) return;
      setMessages((prev) =>
        prev.map((m) =>
          m._id === "pending"
            ? {
                ...m,
                content:
                  (m.content === "Loading...." ? "" : m.content) +
                  payload.delta,
              }
            : m,
        ),
      );
    };
    socketRef.current.off("aiResponse");
    socketRef.current.on("aiResponse", handler);
    socketRef.current.off("aiResponseChunk");
    socketRef.current.on("aiResponseChunk", chunkHandler);
    return () => {
      socketRef.current?.off("aiResponse", handler);
      socketRef.current?.off("aiResponseChunk", chunkHandler);
    };
  }, [chatId, dispatch]);

  return (
    <main className="flex flex-col pb-5 flex-1 min-w-0 justify-end  items-center gap-5 h-full px-3 lg:px-10 pt-5 lg:pt-10 select-text">
      <ChatHistory activeMessages={messages} />
      <form
        className="flex justify-center items-center w-full max-w-4xl gap-2 lg:gap-5 mx-2 md:mx-6 lg:mx-10  relative"
        onSubmit={submitHandler}
      >
        <input
          type="text"
          name="prompt"
          autoComplete="off"
          className="w-full border-b border-primary py-2 px-4 text-[.7rem] md:text-[.6rem] duration-100  focus:rounded-md focus:border-b-transparent focus:bg-secondary-background"
          placeholder={
            !user.currentData
              ? "Please Login to chat"
              : chatId
                ? "Enter text..."
                : "Please select a chat to talk"
          }
          value={userMessage}
          disabled={!user.currentData || !chatId || messageLock}
          onChange={(e) => {
            setUserMessage(e.target.value);
          }}
        ></input>
        <button
          className="relative z-0 rounded-full p-1  bg-indigo-700 hover:cursor-pointer"
          type="submit"
        >
          <ArrowRight className="w-full" size={20} />
        </button>
      </form>
    </main>
  );
};

export default ChatUi;
