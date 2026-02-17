import { memo, useEffect, useRef } from "react";
import { useGetMessagesQuery } from "../../store/api/messageApi";
import { selectChat } from "../../store/slices/chatIdSlice";
import { useAppSelector } from "../hooks/hooks";
import { ChatMessage } from "./ChatMessage";
import type { Message } from "../../types/message";

const ChatHistory = memo(
  ({ activeMessages }: { activeMessages: Message[] }) => {
    const chatID = useAppSelector(selectChat);
    const { currentData, isFetching, isSuccess } = useGetMessagesQuery(chatID, {
      skip: !chatID,
    });
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
      <section
        className="overflow-y-auto min-h-0 px-2 lg:px-5 xl:px-10 w-full h-full"
        ref={chatHistoryRef}
      >
        {isSuccess && currentData && currentData?.length > 0 ? (
          currentData.map((message) => (
            <ChatMessage key={message._id} message={message} />
          ))
        ) : (
          <div className="flex flex-col  justify-center gap-2  h-full overflow-hidden">
            <h1 className="text-lg capitalize font-semibold text-center bg-linear-to-r from-primary  to-stone-400  text-transparent bg-clip-text">
              How may I Help you today?
            </h1>
          </div>
        )}

        {activeMessages.map((activeMessage) => (
          <ChatMessage key={activeMessage._id} message={activeMessage} />
        ))}
      </section>
    );
  },
);

export default ChatHistory;
