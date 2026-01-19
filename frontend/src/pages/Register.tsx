import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="w-full min-h-fit h-screen flex justify-center items-center">
      <div className="bg-secondary-background flex flex-col px-10 py-8 rounded-xl gap-2 min-w-fit w-1/3">
        <h2 className="text-xl font-heading font-semibold">Register</h2>
        <form action="" method="" className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row justify-between gap-5 md:gap-10">
            <div>
              <label htmlFor="firstName" className="text-sm">
                First Name
              </label>
              <div className="border-b border-white">
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  className="w-full mt-1 p-2  focus:bg-primary-background duration-75 "
                />
              </div>
            </div>
            <div>
              <label htmlFor="lastName" className="text-sm">
                Last Name
              </label>
              <div className="border-b border-white">
                <input
                  type="text"
                  name="lastName"
                  id="firstName"
                  className="w-full mt-1 p-2  focus:bg-primary-background duration-75 "
                />
              </div>
            </div>
          </div>
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
          <div className="flex justify-between  flex-col md:flex-row gap-5 md:gap-10">
            <div>
              <label htmlFor="password" className="text-sm">Password</label>
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
            <div>
              <label htmlFor="confirmPassword" className="text-sm">Confirm Password</label>
              <div className="border-b border-white">
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="w-full mt-1 p-2  focus:bg-primary-background duration-75"
                  required
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-accent w-full p-2 rounded-lg hover:cursor-pointer hover:scale-105 hover:opacity-95 active:scale-100 duration-75"
          >
            Register
          </button>
          <p className="text-[.75rem] text-right">
            Already registered?{" "}
            <Link to={"/login"} className="underline text-accent font-semibold">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
