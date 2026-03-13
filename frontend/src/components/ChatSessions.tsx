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
  const [chatOptionsPosition, setChatOptionsPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isOptionsOpen, setIsOptionsopen] = useState(false);
  const optionsHandler = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isOptionsOpen) {
      const rect = e.currentTarget.getBoundingClientRect();
      setChatOptionsPosition((prev) => {
        prev.x = rect.left;
        prev.y = rect.top;
        return prev;
      });
    }
    setIsOptionsopen((prev) => !prev);
  };
  return (
    <>
      {user ? (
        <>
          <h1 className="font-heading text-sm md:text-[.7rem] lg:text-[.6rem]">
            Recent Chats
          </h1>
          <div className="overflow-y-auto  flex flex-col gap-1">
            {!isFetching
              ? currentData?.map((chat: chat) => {
                  return (
                    <ChatTab
                      key={chat._id}
                      chat={chat}
                      optionsHandler={optionsHandler}
                    />
                  );
                })
              : ""}
          </div>
          <ChatOptions
            isOptionsOpen={isOptionsOpen}
            setIsOptionsOpen={setIsOptionsopen}
            chatOptionsPosition={chatOptionsPosition}
          />
        </>
      ) : (
        ""
      )}
    </>
  );
};
