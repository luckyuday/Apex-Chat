import { useEffect, useRef } from "react";
import { useMenuChecker } from "../hooks/useMenuChecker";
import type { chat } from "../../types/chat";
import { useDeleteChatMutation } from "../../store/api/chatApi";
import { toast } from "react-toastify";

const ChatOptions = ({
  isOptionsOpen,
  setIsOptionsOpen,
  chatOptionsPosition,
  optionsChat,
}: {
  isOptionsOpen: boolean;
  setIsOptionsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chatOptionsPosition: { x: number; y: number };
  optionsChat: chat | null;
}) => {
  const [deleteChat, { isSuccess, isError }] = useDeleteChatMutation();
  const optionRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (isSuccess) toast.success("Chat Deleted");
    if (isError) toast.error("Couldn't delete chat");
  }, [isSuccess, isError]);
  const deleteHandler = async () => {
    // Delete the chat whose menu was clicked, not whichever is active.
    if (!optionsChat || optionsChat._id.trim() == "") return;
    // Destructive and irreversible — require an explicit confirmation.
    const confirmed = window.confirm(
      "Delete this chat and all of its messages? This cannot be undone.",
    );
    if (!confirmed) return;
    await deleteChat(optionsChat._id);
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
