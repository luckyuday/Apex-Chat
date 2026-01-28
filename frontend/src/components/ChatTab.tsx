import type { chat } from "../../types/chat";

export const ChatTab = ({ chat }: { chat: chat }) => {
  return (
    <div>
      <input
        type="text"
        disabled
        value={chat.title}
        className="text-[.7rem] p-2  rounded-xl text-ellipsis w-full hover:cursor-pointer hover:bg-primary-background active:scale-95 duration-75"
      ></input>
    </div>
  );
};
