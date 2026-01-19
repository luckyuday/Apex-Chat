import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="w-full min-h-fit h-screen flex justify-center items-center">
      <div className="bg-secondary-background flex flex-col px-10 py-8 rounded-xl gap-2 min-w-fit w-1/3">
        <h2 className="text-xl font-heading font-semibold">Welcome Back</h2>
        <h5 className="text-sm font-heading opacity-80">
          Continue your conversation
        </h5>
        <form action="" method="" className="flex flex-col gap-5">
          <div className="border-b border-white">
            <label htmlFor="email" className="text-sm">
              Email
            </label>
            <br></br>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full mt-1 p-2  focus:bg-primary-background duration-75 "
              required
            />
          </div>
          <div>
            <div className="text-sm flex justify-between">
              <label htmlFor="password">Password</label>
              <h5 className="text-accent underline font-semibold">
                Forgot Password?
              </h5>
            </div>
            <div className="border-b border-white">
              <input
                type="password"
                name="password"
                id="password"
                className="w-full mt-1 p-2  focus:bg-primary-background duration-75"
                required
              />
            </div>
          </div>
          <button type="submit" className="bg-accent w-full p-2 rounded-lg hover:cursor-pointer hover:scale-105 hover:opacity-95 active:scale-100 duration-75">
            Login
          </button>
          <p className="text-[.75rem] text-right">New User? <Link to={"/register"} className="underline text-accent font-semibold">Register</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
