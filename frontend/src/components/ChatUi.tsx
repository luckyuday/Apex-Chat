import { ChatHistory } from "./ChatHistory";
import { socket } from "../../services/socket";
import { useGetUserQuery } from "../../store/api/userApi";
import { useEffect, useState, type FormEvent } from "react";
import type { Message } from "../../types/message";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { selectChat } from "../../store/slices/chatIdSlice";
import { messageApi } from "../../store/api/messageApi";

export const ChatUi = () => {
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
          console.log("UPDATER RUNNING");
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
  console.log(messages);
  return (
    <main className="flex flex-col px-10 pt-10 pb-5 w-full justify-end gap-5 h-full">
      <ChatHistory activeMessages={messages} />
      <form
        className="w-full flex justify-center items-center py-2 px-5 border rounded-full"
        onSubmit={submitHandler}
      >
        <input
          type="text"
          name="prompt"
          className="w-full text-[.7rem] md:text-[.6rem]"
          placeholder={
            !user.currentData ? "Please Login to chat" : "Enter text..."
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
