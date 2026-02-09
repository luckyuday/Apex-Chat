import { setChatId } from "../../store/slices/chatIdSlice";
import type { chat } from "../../types/chat";
import { useAppDispatch } from "../hooks/hooks";

export const ChatTab = ({ chat }: { chat: chat }) => {
  const dispatch = useAppDispatch();
  return (
    <div
      onClick={() => {
        console.log("Button pressed");
        dispatch(setChatId(chat._id));
      }}
    >
      <h4 className="text-[.85rem] md:text-[.7rem] w-full  p-2  rounded-xl text-ellipsis hover:cursor-pointer hover:bg-primary-background active:scale-95 duration-75">
        {chat.title}
      </h4>
    </div>
  );
};
