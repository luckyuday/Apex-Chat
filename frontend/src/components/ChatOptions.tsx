import { useRef } from "react";
import { useMenuChecker } from "../hooks/useMenuChecker";

const ChatOptions = ({
  isOptionsOpen,
  setIsOptionsOpen,
}: {
  isOptionsOpen: boolean;
  setIsOptionsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const optionRef = useRef<HTMLDivElement | null>(null);

  useMenuChecker(optionRef, () => {
    setIsOptionsOpen(false);
  });
  return (
    <article
      ref={optionRef}
      className={`${isOptionsOpen ? "block" : "hidden"} absolute z-52`}
    >
      <button>Rename Chat</button>
      <button>Delete Chat</button>
    </article>
  );
};

export default ChatOptions;
