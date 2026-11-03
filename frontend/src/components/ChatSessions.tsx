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
  const [optionsChat, setOptionsChat] = useState<chat | null>(null);
  const optionsHandler = (e: React.MouseEvent<SVGSVGElement>, target: chat) => {
    // Position the menu under this chat's ellipsis on every open,
    // and close it otherwise.
    const rect = e.currentTarget.getBoundingClientRect();
    setChatOptionsPosition({ x: rect.left, y: rect.top });
    setOptionsChat(target);
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
                      optionsHandler={(e) => optionsHandler(e, chat)}
                    />
                  );
                })
              : ""}
          </div>
          <ChatOptions
            isOptionsOpen={isOptionsOpen}
            setIsOptionsOpen={setIsOptionsopen}
            chatOptionsPosition={chatOptionsPosition}
            optionsChat={optionsChat}
          />
        </>
      ) : (
        ""
      )}
    </>
  );
};
