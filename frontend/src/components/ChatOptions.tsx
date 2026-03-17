import { useEffect, useRef } from "react";
import { useMenuChecker } from "../hooks/useMenuChecker";
import { useAppSelector } from "../hooks/hooks";
import { selectChat } from "../../store/slices/chatIdSlice";
import { useDeleteChatMutation } from "../../store/api/chatApi";
import { toast } from "react-toastify";

const ChatOptions = ({
  isOptionsOpen,
  setIsOptionsOpen,
  chatOptionsPosition,
}: {
  isOptionsOpen: boolean;
  setIsOptionsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chatOptionsPosition: { x: number; y: number };
}) => {
  const chatId = useAppSelector(selectChat);
  const [deleteChat, { isSuccess, isError }] = useDeleteChatMutation();
  const optionRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (isSuccess) toast.success("Chat Deleted");
    if (isError) toast.error("Couldn't delete chat");
  }, [isSuccess, isError]);
  const deleteHandler = async () => {
    if (!chatId || chatId.trim() == "") return;
    await deleteChat(chatId);
    setIsOptionsOpen(false);
  };
  useMenuChecker(optionRef, () => {
    setIsOptionsOpen(false);
  });
  return (
    <article
      ref={optionRef}
      style={{ top: chatOptionsPosition.y, left: chatOptionsPosition.x }}
      className={`fixed overflow-hidden z-52 bg-secondary-background rounded-lg  text-[.85rem] md:text-[.65rem] gap-1 ${isOptionsOpen ? "block" : "hidden"}`}
    >
      <button
        className="block text-left p-3   w-full duration-75 hover:bg-tertiary-background hover:cursor-pointer"
        onClick={deleteHandler}
      >
        Delete Chat
      </button>
    </article>
  );
};

export default ChatOptions;
