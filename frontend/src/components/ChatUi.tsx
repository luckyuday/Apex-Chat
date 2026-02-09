import { ChatHistory } from "./ChatHistory";
import { socket } from "../../services/socket";
import { useGetUserQuery } from "../../store/api/userApi";
import { useEffect, useState, type FormEvent } from "react";
import type { Message } from "../../types/message";
import { useAppSelector } from "../hooks/hooks";
import { selectChat } from "../../store/slices/chatIdSlice";

export const ChatUi = () => {
  const user = useGetUserQuery();
  const [userMessage, setUserMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const chat = useAppSelector(selectChat);
  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    setUserMessage("");
    console.log("Submitted");
    socket.emit("aiMessage", { chat, content: userMessage });
    const activeMessage: Message = {
      content: userMessage,
      role: "user",
      createdAt: new Date().toISOString(),
      _id: Date.now().toString(),
      chat: chat,
    };
    setMessages((prev) => [...prev, activeMessage]);

    const responseMessage: Message = {
      _id: "pending",
      content: "Loading....",
      role: "model",
      createdAt: "pending",
      chat: chat,
    };
    setMessages((prev) => [...prev, responseMessage]);
  };
  console.log(messages);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected : ", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
    socket.on("aiResponse", ({ chat, content }) => {
      setMessages((prev) =>
        prev.map((elem) =>
          elem._id == "pending" ? { ...elem, chat, content } : elem,
        ),
      );
    });
  }, []);

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
          disabled={!user.currentData || !chat}
          onChange={(e) => {
            setUserMessage(e.target.value);
          }}
        ></input>
      </form>
    </main>
  );
};
