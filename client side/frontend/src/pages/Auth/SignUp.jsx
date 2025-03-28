import React, { useState, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/layouts/inputs/input";
import  validateEmail  from "../../utils/helper";
import ProfilePhotoSelector from "../../components/layouts/inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import  API_PATHS  from "../../utils/apiPaths";
import  uploadImage  from "../../utils/uploadimage";
import  {UserContext}  from "../../context/UserContext";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState(null);

  const updateUser  = useContext(UserContext);
  const Navigate = useNavigate();

  // Handle SignUp form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    // SignUp API Call
    try {
      //Upload image if present
      if (profilePic) {
        const imgUploadResponse = await uploadImage(profilePic);
        profileImageUrl = imgUploadResponse.imageUrl || "";
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        phone,
        profileImageUrl
      });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        Navigate("/home");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  // Formulaire SignUp
  return (
    <AuthLayout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="relative flex p-4 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="w-full flex flex-col justify-center items-center p-6 space-y-4">
            <h2 className="text-2xl font-semibold">SignUp</h2>

            <form onSubmit={handleSignUp}>
              <ProfilePhotoSelector
                image={profilePic}
                setImage={setProfilePic}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
              {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
              <Input
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
                label="Full Name"
                placeholder="your name"
                type="Text"
              />
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
                className="w-full p-2 border rounded-md"
                autocomplete = "current-password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
              />

              <Input
                type="Phone"
                placeholder="your phone number"
                className="w-full p-2 border rounded-md"
                value={phone}
                onChange={({ target }) => setPhone(target.value)}
                label="Phone"
              />

              <button
                type="submit"
                className="w-full bg-green-500 text-sm py-2 mt-3 font-medium text-white shadow-lg shadow-green-500/5 p-[10px] rounded-md my-1 hover:bg-green-500/15 hover:text-green-500"
              >
                SIGN UP
              </button>
              <p className="text-[13px] text-slate-800 mt-3">
                Alredy have an account?{" "}
                <Link
                  className="font-medium text-green-500 underline "
                  to="/login"
                >
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
