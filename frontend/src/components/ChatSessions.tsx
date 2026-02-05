import { useGetChatsQuery } from "../../store/api/chatApi";
import { ChatTab } from "./ChatTab";
import type { chat } from "../../types/chat";
import { useGetUserQuery } from "../../store/api/userApi";
export const ChatSessions = () => {
  const user = useGetUserQuery();
  const { currentData, isFetching } = useGetChatsQuery(undefined, {
    skip: !user.currentData,
  });

  return (
    <>
      {user ? (
        <>
          <h1 className="font-heading ">Recent Chats</h1>
          <div className="overflow-y-auto max-h-80">
            {!isFetching
              ? currentData?.map((chatList: chat) => {
                  return <ChatTab key={chatList._id} chat={chatList} />;
                })
              : ""}
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
};
