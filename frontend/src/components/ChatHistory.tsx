import { memo, useEffect, useLayoutEffect, useRef } from "react";
import { useGetMessagesQuery } from "../../store/api/messageApi";
import { selectChat } from "../../store/slices/chatIdSlice";
import { useAppSelector } from "../hooks/hooks";
import { ChatMessage } from "./ChatMessage";
import type { Message } from "../../types/message";

export const ChatHistory = memo(
  ({ activeMessages }: { activeMessages: Message[] }) => {
    const chatID = useAppSelector(selectChat);
    const { currentData, isError, isFetching, isSuccess } = useGetMessagesQuery(
      chatID,
      {
        skip: !chatID,
      },
    );
    const chatHistoryRef = useRef<HTMLElement | null>(null);
    useEffect(() => {
      console.log(chatHistoryRef.current.scrollHeight);
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }, [isFetching, chatID]);
    useEffect(() => {
      if (activeMessages.length > 0) {
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
      }
    }, [activeMessages]);
    return (
      <section className="overflow-y-auto  w-full h-full" ref={chatHistoryRef}>
        {isSuccess && currentData
          ? currentData.map((message) => (
              <ChatMessage key={message._id} message={message} />
            ))
          : ""}
        {activeMessages.map((activeMessage) => (
          <ChatMessage key={activeMessage._id} message={activeMessage} />
        ))}
      </section>
    );
  },
);
