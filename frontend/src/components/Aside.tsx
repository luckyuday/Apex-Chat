import { Link } from "react-router-dom";
import navicon from "../assets/navicon.png";
import { ChatSessions } from "./ChatSessions";
import { Menu } from "lucide-react";
import { useRef, useState } from "react";

export const Aside = () => {
  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuClick = () => {
    if (isMenuOpen) {
      menuRef.current.style.left = "-100%";
      setTimeout(() => {
        menuRef.current.style.position = "absolute";
      }, 75);
      setIsMenuOpen(false);
    } else {
      menuRef.current.style.left = 0;
      menuRef.current.style.position = "relative";
      setIsMenuOpen(true);
    }
  };
  return (
    <aside className="min-h-screen bg-secondary-background  flex flex-col gap-5 lg:w-1/3 lg:px-3 lg:py-5  lg:max-w-48 ">
      <Menu
        className="lg:hidden text-primary mx-3 mt-5 lg:m-0  min-h-fit"
        onClick={menuClick}
      />
      <div
        ref={menuRef}
        className="flex absolute flex-col w-screen gap-5 px-3 py-5  -left-full lg:w-fit lg:p-0  lg:left-0   md:relative duration-75"
      >
        <div className="w-full">
          <Link to={"/"}>
            <img src={navicon} className="w-20"></img>
          </Link>
        </div>
        <button className="rounded-full max-w-40 lg:max-w-none md:text-[.6rem] text-center font-heading border-primary border p-2 hover:cursor-pointer active:scale-95 hover:scale-105 duration-95">
          Create New chat
        </button>
        <ChatSessions />
      </div>
    </aside>
  );
};
