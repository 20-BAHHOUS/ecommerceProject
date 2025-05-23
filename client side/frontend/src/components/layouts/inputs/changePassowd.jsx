// components/screens/ProfilePage.js
import React, { useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import API_PATHS from "../../../utils/apiPaths";
import { toast } from "react-toastify";
import Input from "./input";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
    setError(""); // Clear error when user types
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    const { oldPassword, newPassword, confirmNewPassword } = passwordForm;
    
   
    setError("");
    
    // Validate form
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setError("All fields are required.");
      toast.error("All fields are required.");
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      toast.error("New passwords do not match.");
      return;
    }
    
    // Password strength check
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PASSWORD, {
        oldPassword,
        newPassword,
      });
      
      toast.success(response.data.message || "Password updated successfully!");
      
      // Reset form
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      
      // Inform user to use new password on next login
      toast.info("Please use your new password on your next login.");
      
      // Redirect to profile page
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
      
    } catch (error) {
      console.error("Error updating password:", error);
      const errorMessage = error.response?.data?.error || "Failed to update password.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="h-full w-1/3 flex flex-col items-center gap-8 p-8 bg-white border border-gray-300 rounded-lg shadow-md"
        onSubmit={handleUpdatePassword}
      >
        {/* title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Change Password
        </h1>
        
        {/* Error message */}
        {error && (
          <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="flex flex-col gap-4 h-full w-full">
          <Input
            label={"Old Password"}
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={passwordForm.oldPassword}
            onChange={handlePasswordChange}
            required
          />

          <Input
            label={"New Password"}
            type="password"
            id="newPassword"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            required
          />

          <Input
            label={"Confirm New Password"}
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            value={passwordForm.confirmNewPassword}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 font-medium text-white rounded-lg inline-block bg-teal-600 px-8 text-sm transition hover:scale-110 hover:shadow-xl focus:ring-3 focus:outline-hidden ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "UPDATING..." : "SAVE"}
        </button>
        
        <div className="mt-4 text-center">
          <button 
            type="button" 
            onClick={() => navigate("/profile")}
            className="text-teal-600 hover:underline"
          >
            Back to Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
