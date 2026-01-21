import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes";
const App = () => {
  return (
    <div className="bg-primary-background  font-content text-primary min-h-fit h-screen  flex flex-col">
      <AppRoutes />
      <ToastContainer />
    </div>
  );
};

export default App;
