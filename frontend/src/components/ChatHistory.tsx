import { memo } from "react";
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
        skip: chatID.length == 0 || chatID == null,
      },
    );

    return (
      <section className="overflow-y-scroll pr-5">
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
