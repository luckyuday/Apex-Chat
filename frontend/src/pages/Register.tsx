import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { authResponse, UserForm } from "../../types/user";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { useRegisterUserMutation } from "../../store/api/userApi";
import { ArrowBigLeft } from "lucide-react";
const Register = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const {
    register,
    handleSubmit,
    trigger,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserForm>();
  const password = watch("password");
  const submitFunction: SubmitHandler<UserForm> = async (data) => {
    try {
      const result: authResponse = await registerUser(data).unwrap();
      toast.success(result.message);
      reset();
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error("Some error occured");
    }
  };

  return (
    <div className="w-full min-h-fit h-screen flex justify-center items-center text-sm">
      <div className="bg-secondary-background text-sm flex flex-col px-10 py-8 rounded-xl gap-10 min-w-fit w-full md:w-1/3">
        <ArrowBigLeft className="scale-130" onClick={() => navigate("/")} />
        <h2 className="text-4xl font-heading text-center font-semibold ">
          Register
        </h2>
        <form
          onSubmit={handleSubmit(submitFunction)}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col md:flex-row justify-between gap-5 md:gap-10">
            <div>
              <label htmlFor="firstName">First Name</label>
              <div className="border-b border-primary">
                <input
                  {...register("fullName.firstName", {
                    required: "First Name Cannot be empty",
                    maxLength: {
                      value: 20,
                      message: "Too long first name!",
                    },
                  })}
                  type="text"
                  id="firstName"
                  className="w-full mt-1 p-2 rounded-t-lg  focus:bg-primary-background duration-75 "
                  placeholder="John"
                />
              </div>
              {errors.fullName?.firstName && (
                <h6 className="text-[.5rem] text-red-400 mt-2 font-semibold">
                  {errors.fullName.firstName.message}
                </h6>
              )}
            </div>
            <div>
              <label htmlFor="lastName">Last Name</label>
              <div className="border-b border-primary">
                <input
                  {...register("fullName.lastName", {
                    required: "Last Name Cannot be empty",
                    maxLength: {
                      value: 20,
                      message: "Too long last name!",
                    },
                  })}
                  type="text"
                  id="lastName"
                  className="w-full mt-1 p-2 rounded-t-lg  focus:bg-primary-background duration-75 "
                  placeholder="Doe"
                />
              </div>
              {errors.fullName?.lastName && (
                <h6 className="text-[.5rem] text-red-400 mt-2 font-semibold">
                  {errors.fullName.lastName.message}
                </h6>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <div className="border-b border-primary w-full">
              <input
                {...register("email", {
                  required: "Email cannot be empty",
                  maxLength: {
                    value: 30,
                    message: "Too long email!",
                  },
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter valid email address.",
                  },
                })}
                type="email"
                id="email"
                className="w-full mt-1 p-2 rounded-t-lg  focus:bg-primary-background duration-75"
                placeholder="xyz@mail.com"
              />
            </div>
            {errors.email && (
              <h6 className="text-[.5rem] text-red-400 mt-2 font-semibold">
                {errors.email.message}
              </h6>
            )}
          </div>
          <div className="flex justify-between  flex-col md:flex-row gap-5 md:gap-10">
            <div>
              <label htmlFor="password">Password</label>
              <div className="border-b border-primary">
                <input
                  {...register("password", {
                    required: "Password cannot be empty",
                    maxLength: {
                      value: 30,
                      message: "Too long password!",
                    },
                    onChange: () => {
                      trigger("confirmPassword");
                    },
                  })}
                  type="password"
                  id="password"
                  placeholder="••••••"
                  className="w-full mt-1 p-2 rounded-t-lg focus:bg-primary-background duration-75"
                />
              </div>
              {errors?.password && (
                <h6 className="text-[.5rem] text-red-400 mt-2 font-semibold">
                  {errors.password.message}
                </h6>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="border-b border-primary">
                <input
                  type="password"
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    onChange: () => {
                      trigger("confirmPassword");
                    },
                    maxLength: {
                      value: 20,
                      message: "Too long first name!",
                    },
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  placeholder="••••••"
                  className="w-full mt-1 p-2 rounded-t-lg focus:bg-primary-background duration-75"
                />
              </div>
              {errors?.confirmPassword && (
                <h6 className="text-[.5rem] text-red-400 mt-2 font-semibold">
                  {errors.confirmPassword.message}
                </h6>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="bg-accent w-full p-2 rounded-lg hover:cursor-pointer hover:scale-105 hover:opacity-95 active:scale-100 duration-75"
            disabled={isLoading}
          >
            {!isLoading ? "Register" : "Registering...."}
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
