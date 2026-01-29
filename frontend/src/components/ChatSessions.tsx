import { useGetChatsQuery } from "../../store/api/chatApi";
import { ChatTab } from "./ChatTab";
import type { chat } from "../../types/chat";
export const ChatSessions = () => {
  const { currentData, isSuccess, isFetching } = useGetChatsQuery();
  if (isSuccess) console.log(currentData);
  return (
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
  );
};
