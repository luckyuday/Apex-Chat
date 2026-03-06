import { Ellipsis } from "lucide-react";
import { setChatId } from "../../store/slices/chatIdSlice";
import type { chat } from "../../types/chat";
import { useAppDispatch } from "../hooks/hooks";

export const ChatTab = ({ chat }: { chat: chat }) => {
  const dispatch = useAppDispatch();
  return (
    <div
      onClick={() => {
        dispatch(setChatId(chat._id));
      }}
      className="flex items-center justify-between hover:cursor-pointer hover:bg-primary-background rounded-xl py-2 px-3"
      title={chat.title}
    >
      <h4 className="text-[.85rem] md:text-[.65rem] w-full  text-ellipsis  active:scale-95 duration-75">
        {chat.title}
      </h4>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="rounded-xl   hover:bg-secondary-background aspect-square p-[.1rem]"
      >
        <Ellipsis className="hover:scale-110 active:scale-90 duration-50" />
      </div>
    </div>
  );
};
