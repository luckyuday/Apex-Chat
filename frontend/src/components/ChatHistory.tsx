import { memo, useEffect, useRef } from "react";
import { useGetMessagesQuery } from "../../store/api/messageApi";
import { selectChat } from "../../store/slices/chatIdSlice";
import { useAppSelector } from "../hooks/hooks";
import { ChatMessage } from "./ChatMessage";
import type { Message } from "../../types/message";
import { ChatHistorySkeleton } from "./skeletons/ChatHistorySkeletion";

export const ChatHistory = memo(
  ({ activeMessages }: { activeMessages: Message[] }) => {
    const chatID = useAppSelector(selectChat);
    const { currentData, isError, isFetching, isSuccess } = useGetMessagesQuery(
      chatID,
      {
        skip: !chatID,
      },
    );
    console.log(currentData);
    const chatHistoryRef = useRef<HTMLElement | null>(null);
    useEffect(() => {
      if (chatHistoryRef.current) {
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
      }
    }, [isFetching, chatID]);
    useEffect(() => {
      if (activeMessages.length > 0 && chatHistoryRef.current) {
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
      }
    }, [activeMessages]);
    return (
      <section className="overflow-y-auto  w-full h-full" ref={chatHistoryRef}>
        {isSuccess && currentData && currentData?.length > 0 ? (
          currentData.map((message) => (
            <ChatMessage key={message._id} message={message} />
          ))
        ) : (
          <ChatHistorySkeleton />
        )}

        {activeMessages.map((activeMessage) => (
          <ChatMessage key={activeMessage._id} message={activeMessage} />
        ))}
      </section>
    );
  },
);
