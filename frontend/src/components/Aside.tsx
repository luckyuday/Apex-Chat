import { Link } from "react-router-dom";
import navicon from "../assets/navicon.png";
import { ChatSessions } from "./ChatSessions";
import { Menu, X } from "lucide-react";
import { useRef, useState } from "react";
import {
  useGetUserQuery,
  useLogoutUserMutation,
} from "../../store/api/userApi";
import { toast } from "react-toastify";

export const Aside = () => {
  const menuRef = useRef(null);

  const user = useGetUserQuery();
  console.log(user.isError);
  const [logout] = useLogoutUserMutation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuClick = () => {
    if (isMenuOpen) {
      menuRef.current.style.left = "-100%";
      setIsMenuOpen(false);
    } else {
      menuRef.current.style.left = 0;
      setIsMenuOpen(true);
    }
  };
  const logoutHandler = async () => {
    try {
      const result = await logout().unwrap();
      toast.success(result.message);
    } catch (err) {
      toast.error("Some error occurred");
      console.log(err);
    }
  };
  return (
    <aside
      ref={menuRef}
      className="min-h-screen absolute flex flex-col px-3   py-5 items-center justify-between gap-5 bg-secondary-background w-full -left-full duration-200 md:w-3/5 md:px-10 lg:relative lg:left-0 lg:px-3 lg:w-1/3  lg:max-w-48 "
    >
      <Menu
        className={`fixed top-8 left-5 z-20 duration-200  lg:hidden text-primary  ${isMenuOpen ? "hidden" : "block"}`}
        onClick={menuClick}
      />
      <X
        className={`absolute top-8 right-5 z-20  lg:hidden text-primary  ${!isMenuOpen ? "hidden" : "block"}`}
        onClick={menuClick}
      />
      <div className="flex  flex-col w-full  justify-center gap-5 px-3 py-5">
        <div className="w-full">
          <Link to={"/"}>
            <img src={navicon} className="w-20"></img>
          </Link>
        </div>
        <button className="rounded-full w-full max-w-60 lg:max-w-none text-[.8rem] md:text-[.6rem] text-center font-heading border-primary border p-2 hover:cursor-pointer active:scale-95 hover:scale-105 duration-95">
          Create New chat
        </button>
        <ChatSessions />
      </div>
      {!user.currentData ? (
        <div className="flex flex-col gap-3 w-full px-3 py-5">
          <Link
            to={"/login"}
            className="rounded-full w-full  max-w-60 lg:max-w-none text-[.8rem] md:text-[.6rem] text-center font-heading border-primary border p-2 hover:cursor-pointer active:scale-95 hover:scale-105 duration-95"
          >
            Login
          </Link>{" "}
          <Link
            to={"/register"}
            className="rounded-full w-full max-w-60 lg:max-w-none text-[.8rem] md:text-[.6rem] text-center font-heading border-primary border p-2 hover:cursor-pointer active:scale-95 hover:scale-105 duration-95"
          >
            Register
          </Link>
        </div>
      ) : (
        <div className="flex  flex-col w-full justify-center gap-5 px-3 py-5">
          <button
            onClick={logoutHandler}
            className="rounded-full  max-w-60 lg:max-w-none text-[.8rem] md:text-[.6rem] text-center font-heading border-primary border p-2 hover:cursor-pointer active:scale-95 hover:scale-105 duration-95"
          >
            Logout
          </button>
        </div>
      )}
    </aside>
  );
};
