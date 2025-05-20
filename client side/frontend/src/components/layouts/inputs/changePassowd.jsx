// components/screens/ProfilePage.js
import React, { useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import API_PATHS from "../../../utils/apiPaths";
import { toast } from "react-toastify";
import Input from "./input";

const ChangePassword = () => {
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const handleUpdatePassword = async () => {
    const { oldPassword, newPassword, confirmNewPassword } = passwordForm;
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    try {
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PASSWORD, {
        oldPassword,
        newPassword,
      });
      toast.success(response.data.message);
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }); // Clear form
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(error.response?.data?.error || "Failed to update password.");
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="h-full w-1/3 flex flex-col items-center gap-8 p-8 bg-white border border-gray-300 rounded-lg"
        onSubmit={handleUpdatePassword}
      >
        {/* title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Change Password
        </h1>
        <div className="flex flex-col gap-4 h-full w-full">
          <Input
            label={"Old Password"}
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={passwordForm.oldPassword}
            onChange={handlePasswordChange}
          />

          <Input
            label={"New Password"}
            type="password"
            id="newPassword"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
          />

          <Input
            label={"Confirm New Password"}
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            value={passwordForm.confirmNewPassword}
            onChange={handlePasswordChange}
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 font-medium text-white rounded-lg inline-block  bg-teal-600 px-8  text-sm transition hover:scale-110 hover:shadow-xl focus:ring-3 focus:outline-hidden
              "
        >
          SAVE
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
