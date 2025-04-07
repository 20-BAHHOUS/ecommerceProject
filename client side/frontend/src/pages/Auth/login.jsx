import React, { useContext } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/layouts/inputs/input";
import  {validateEmail} from "../../utils/helper"
import axiosInstance from "../../utils/axiosInstance";
import  API_PATHS  from "../../utils/apiPaths";
import  {UserContext}  from "../../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const updateUser  = useContext(UserContext);
  const Navigate = useNavigate();

  // Handle Login form Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 8) {
      setError("Please enter a valid password");
      return;
    }

    setError("");

    //Login API call


    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email,
        password,
      });
      const { token, user} = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user)
        Navigate("/home");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Somthing went wrong. Please try again.");
      }
    }
  }

  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="relative flex p-4 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="w-full flex flex-col justify-center items-center p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Login</h2>
            <form onSubmit={handleLogin}>
              <Input
                type="email"
                placeholder="name@example.com"
                className="w-full p-2 border rounded-md"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                label="Email Address"
              />

              <Input
                type="password"
                placeholder="Min 8 Caracters"
                autocomplete = "current-password"
                className="w-full p-2 border rounded-md"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
              />
            </form>
            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-500 text-sm py-2 font-medium mt-0.5 text-white shadow-lg shadow-blue-500/5 p-[10px] rounded-md my-1 hover:bg-blue-500/15 hover:text-blue-500"
            >
              LOGIN
            </button>
            <p className="text-[13px] text-slate-800 mt-3">
              Don't have an account?{" "}
              <Link
                className="font-medium text-blue-500 underline "
                to="/signup"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
