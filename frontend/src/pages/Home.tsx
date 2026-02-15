import { lazy } from "react";

const Aside = lazy(() => import("../components/Aside"));
const ChatUi = lazy(() => import("../components/ChatUi"));

const Home = () => {
  return (
    <div className="flex w-full h-screen min-h-40">
      <Aside />
      <ChatUi />
    </div>
  );
};

export default Home;
