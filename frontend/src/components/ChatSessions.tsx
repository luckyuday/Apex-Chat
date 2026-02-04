import { useGetChatsQuery } from "../../store/api/chatApi";
import { ChatTab } from "./ChatTab";
import type { chat } from "../../types/chat";
import { useGetUserQuery } from "../../store/api/userApi";
export const ChatSessions = () => {
  const user = useGetUserQuery();
  const { currentData, isSuccess, isFetching } = useGetChatsQuery(undefined, {
    skip: !user.currentData,
  });
  if (isSuccess) console.log(currentData);

  return (
    <>
      {user ? (
        <>
          <h1 className="font-heading max-h-1/3">Recent Chats</h1>
          <div className="overflow-y-auto">
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
