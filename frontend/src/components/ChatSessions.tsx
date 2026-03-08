import { useGetChatsQuery } from "../../store/api/chatApi";
import { ChatTab } from "./ChatTab";
import type { chat } from "../../types/chat";
import { useGetUserQuery } from "../../store/api/userApi";
import ChatOptions from "./ChatOptions";
import { useState } from "react";
export const ChatSessions = () => {
  const user = useGetUserQuery();
  const { currentData, isFetching } = useGetChatsQuery(undefined, {
    skip: !user.currentData,
  });

  const [isOptionsOpen, setIsOptionsopen] = useState(false);
  return (
    <>
      {user ? (
        <>
          <h1 className="font-heading text-sm md:text-[.7rem] lg:text-[.6rem]">
            Recent Chats
          </h1>
          <div className="overflow-y-auto max-h-80 flex flex-col gap-1">
            {!isFetching
              ? currentData?.map((chat: chat) => {
                  return <ChatTab key={chat._id} chat={chat} />;
                })
              : ""}
          </div>
          <ChatOptions
            isOptionsOpen={isOptionsOpen}
            setIsOptionsOpen={setIsOptionsopen}
          />
        </>
      ) : (
        ""
      )}
    </>
  );
};
