import ChatHistory from "./ChatHistory";
import { socket } from "../../services/socket";
import { useGetUserQuery } from "../../store/api/userApi";
import { useEffect, useState, type FormEvent } from "react";
import type { Message } from "../../types/message";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { selectChat } from "../../store/slices/chatIdSlice";
import { messageApi } from "../../store/api/messageApi";

const ChatUi = () => {
  const user = useGetUserQuery();
  const [messageLock, setMessageLock] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const chatId = useAppSelector(selectChat);
  const dispatch = useAppDispatch();
  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
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
    socket.emit("aiMessage", { chat: chatId, content: userMessage });
  };
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected : ", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }, []);
  useEffect(() => {
    const handler = (message: Message) => {
      if (message.role == "model") {
        setMessageLock(false);
      }
      dispatch(
        messageApi.util.updateQueryData("getMessages", chatId, (draft) => {
          draft.push(message);
        }),
      );
      setMessages((prev) => prev.filter((e) => e.role != message.role));
    };
    socket.on("aiResponse", handler);
    return () => {
      socket.off("aiResponse", handler);
    };
  }, [chatId, dispatch]);

  return (
    <main className="flex flex-col pb-5 flex-1 min-w-0 justify-end  gap-5 h-full px-3 lg:px-10 pt-5 lg:pt-10 ">
      <ChatHistory activeMessages={messages} />
      <form
        className="flex justify-center items-center py-1 px-2 mx-2 md:mx-6 lg:mx-10 border-b border-primary"
        onSubmit={submitHandler}
      >
        <input
          type="text"
          name="prompt"
          className="w-full text-[.7rem] md:text-[.6rem]"
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
      </form>
    </main>
  );
};

export default ChatUi;
