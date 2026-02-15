import type { Message } from "../../types/message";
import Markdown from "react-markdown";
interface ChatMessageprops {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageprops) => {
  return (
    <article
      className={`p-2 gap-3 flex w-full items-center text-[.65rem] md:max-w-3/4 ${message.role === "user" ? "justify-self-end flex-row-reverse" : "justify-self-start"} `}
    >
      <div
        className={`border rounded-full aspect-square flex justify-center items-center px-3 py-2 font-heading  ${message.role == "user" ? "bg-indigo-700" : "bg-indigo-800"} `}
      >
        {message.role.charAt(0)}
      </div>
      <div
        className={`py-2 px-3 min-w-0  rounded-sm ${message.role == "user" ? "bg-neutral-600" : "bg-neutral-800"}`}
      >
        <Markdown>{message.content}</Markdown>
      </div>
    </article>
  );
};
