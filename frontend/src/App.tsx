import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes";
const App = () => {
  return (
    <div className="bg-primary-background  font-content text-primary select-none">
      <AppRoutes />
      <ToastContainer
        theme="dark"
        closeOnClick
        autoClose={1500}
        hideProgressBar
        className={"text-[.6rem]"}
      />
    </div>
  );
};

export default App;
