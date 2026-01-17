import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
const App = () => {
  return <div className="bg-background text-white font-content min-h-screen p-5 ">
  <Navbar/>
  <AppRoutes/>
  <ToastContainer/>
  </div>;
};

export default App;
