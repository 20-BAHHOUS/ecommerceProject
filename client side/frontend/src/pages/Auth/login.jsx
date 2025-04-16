import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/layouts/inputs/input";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginValidator } from "../../lib/validators/auth.validator";

const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
    setError,
  } = useForm({
    resolver: zodResolver(LoginValidator),
  });

  const Navigate = useNavigate();

  // Handle Login form Submit
  async function onSubmit(data) {
    try {
      await axiosInstance.post(API_PATHS.AUTH.LOGIN, data).then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          const { token } = res.data;
          if (token) {
            localStorage.setItem("token", token);
            Navigate("/home");
          }
        }
      });
    } catch (err) {
      if (err.response.status === 400) {
        setError("email", { message: err.response.data.error });
      }
      console.log("Error in login");
    }
  }

  // Formulaire SignUp

  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form
          className="h-full w-1/4 flex flex-col items-center gap-8 p-8 bg-white border border-gray-200 rounded-lg"
          action=""
          method="POST"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* title */}
          <h2 className="text-2xl font-semibold">Login</h2>
          {/* inputs */}
          <div className="flex flex-col gap-4 h-full w-full">
            <Input
              label="Email Address"
              placeholder="name@example.com"
              type="email"
              error={errors.email?.message}
              {...register("email", { required: true })}
            />

            <Input
              label="Password"
              placeholder="Min 8 Caracters"
              type="password"
              autocomplete="current-password"
              {...register("password", { required: true })}
            />
          </div>
          {/* submit button */}
          <div className="w-full">
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`w-full font-medium  inline-block rounded-sm bg-blue-600 px-8 py-3 text-sm text-white transition hover:scale-110 hover:shadow-xl focus:ring-3 focus:outline-hidden
                ${
                  !isValid || isSubmitting
                    ? "opacity-50"
                    : "cursor-pointer hover:bg-blue-700"
                }`}
            >
              
              LOGIN
            </button>
            <p className="text-sm text-slate-800 mt-2">
              Alredy have an account?{" "}
              <Link
                className="font-semibold text-blue-500 underline hover:text-blue-600"
                to="/signup"
              >
                sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};
export default Login;
