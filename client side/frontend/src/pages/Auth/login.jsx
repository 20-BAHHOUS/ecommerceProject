import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/layouts/inputs/input";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginValidator } from "../../lib/validators/auth.validator";
import { useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(LoginValidator),
  });

  const Navigate = useNavigate();

  // Handle Login form Submit
  async function onSubmit(data) {
    setIsLoading(true);
    setLoginError("");
    
    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, data);
      
      if (res.status === 200) {
        const { token, _id, user } = res.data;
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("userId", _id || (user && user._id));
          toast.success("Login successful!");
          Navigate("/home");
        }
      }
    } catch (err) {
      console.error("Error in login", err);
      
      if (err?.response?.status === 400) {
        setError("email", { message: err.response.data.error });
      } else if (err?.response?.status === 401) {
        setError("password", { message: "Invalid email or password" });
        setLoginError("Invalid email or password. Please try again.");
      } else {
        setLoginError("Login failed. Please try again later.");
      }
      
      toast.error(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Formulaire SignUp

  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form
          className="h-full w-1/4 flex flex-col items-center gap-8 p-8 bg-white border border-gray-300 rounded-lg"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* title */}
          <h2 className="text-2xl font-semibold">Login</h2>
          
          {/* Error message */}
          {loginError && (
            <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {loginError}
            </div>
          )}
          
          {/* inputs */}
          <div className="flex flex-col gap-4 h-full w-full">
            <Input
              label="Email Address"
              placeholder="name@example.com"
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              placeholder="Your password"
              type="password"
              autocomplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>
          {/* submit button */}
          <div className="w-full">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-medium inline-block rounded-sm bg-blue-600 px-8 py-3 text-sm text-white transition hover:scale-110 hover:shadow-xl focus:ring-3 focus:outline-hidden ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "LOGGING IN..." : "LOGIN"}
            </button>
            <p className="text-sm text-slate-800 mt-2">
              Don't have an account?{" "}
              <Link
                className="font-semibold text-blue-500 underline hover:text-blue-600"
                to="/signup"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};
export default Login;