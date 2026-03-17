import type { Message } from "../../types/message";
import Markdown from "react-markdown";
interface ChatMessageprops {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageprops) => {
  return (
    <article
      className={`p-2 gap-3 flex w-full items-center text-[.65rem]  ${message.role === "user" ? "justify-self-end flex-row-reverse" : "justify-self-start"} `}
    >
      <div
        className={`border select-none border-transparent rounded-full aspect-square flex justify-center items-center text-[0.55rem] px-3 py-2 lg:px-2 lg:py-1 font-heading  ${message.role == "user" ? "bg-purple-800" : "bg-purple-900"} `}
      >
        {message.role.charAt(0).toUpperCase()}
      </div>
      <div
        className={`py-2 px-3 min-w-0  md:max-w-3/4 rounded-sm ${message.role == "user" ? "bg-stone-800" : "bg-tertiary-background"}`}
      >
        <Markdown>{message.content}</Markdown>
      </div>
    </article>
  );
};
