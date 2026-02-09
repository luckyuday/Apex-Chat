import { Aside } from "../components/Aside";
import { ChatUi } from "../components/ChatUi";

const Home = () => {
  return (
    <div className="flex w-full items-start h-screen min-h-40">
      <Aside />
      <ChatUi />
    </div>
  );
};

export default Home;
