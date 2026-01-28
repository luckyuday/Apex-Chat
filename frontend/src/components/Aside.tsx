import { Link } from "react-router-dom";
import navicon from "../assets/navicon.png";
import { ChatSessions } from "./ChatSessions";
export const Aside = () => {
  return (
    <aside className="min-h-screen w-1/3 px-3 py-5 max-w-48 bg-secondary-background flex flex-col gap-5">
      <div className="w-full ">
        <Link to={"/"}>
          <img src={navicon} className="w-20"></img>
        </Link>
      </div>
      <button className="rounded-full text-[.6rem] text-center font-heading border-primary border p-2 hover:cursor-pointer active:scale-95 hover:scale-105 duration-95">
        Create New chat
      </button>
      <ChatSessions />
    </aside>
  );
};
