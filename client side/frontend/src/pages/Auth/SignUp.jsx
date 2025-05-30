import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/layouts/inputs/input";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupValidator } from "../../lib/validators/auth.validator";


const SignUp = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(SignupValidator),
  });

  const Navigate = useNavigate();

  // Handle SignUp form Submit
  async function onSubmit(data) {
    try {
      await axiosInstance.post(API_PATHS.AUTH.REGISTER, data).then((res) => {
        if (res.status === 200) {
          Navigate("/login");
        }
      });
    } catch (err) {
      if (err?.response?.status === 400) {
        setError("email", { message: err.response.data.error });
      }
      console.log("Error in signup", err);
    }
  }
  // Formulaire SignUp

  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form
          className="h-full w-1/4 flex flex-col items-center gap-8 p-8 bg-white border border-gray-300 rounded-lg"
          action=""
          method="POST"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* title */}
          <h2 className="text-2xl font-semibold">SignUp</h2>
          {/* inputs */}
          <div className="flex flex-col gap-4 h-full w-full">
            <Input
              label="Full Name"
              placeholder="your name"
              error={errors.fullName?.message}
              {...register("fullName")}
            />
            <Input
              label="Email Address"
              placeholder="name@example.com"
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              placeholder="Min 8 Caracters"
              type="password"
              autocomplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              type="Phone"
              placeholder="your phone number"
              label="Phone"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>
          {/* submit button */}
          <div className="w-full">
            <button
              type="submit"

              className="w-full py-3 font-medium text-white rounded-lg inline-block  bg-teal-600 px-8  text-sm transition hover:scale-110 hover:shadow-xl focus:ring-3 focus:outline-hidden
              "
            >
              SIGN UP
            </button>
            <p className="text-sm text-slate-800 mt-2">
              Alredy have an account?{" "}
              <Link
                className="font-semibold text-teal-500 underline hover:text-teal-600"
                to="/login"
              >
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
