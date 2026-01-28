import { Aside } from "../components/Aside";
import { ChatUi } from "../components/ChatUi";

const Home = () => {
  return (
    <div className="flex  min-h-screen">
      <Aside />
      <ChatUi />
    </div>
  );
};

export default Home;
