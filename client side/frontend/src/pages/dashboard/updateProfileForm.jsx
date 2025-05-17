// components/screens/ProfilePage.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { toast } from "react-toastify";
import Navbar from "../../components/layouts/inputs/header";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSpinner,
  FaPencilAlt,
} from "react-icons/fa";

const UpdateProfileForm = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editFields, setEditFields] = useState({
    fullName: false,
    email: false,
    phone: false,
    // profileImageUrl: false, // You might handle image upload separately
  });
  const [updatedInfo, setUpdatedInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    profileImageUrl: "", // You might handle image upload separately
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.post(API_PATHS.AUTH.GET_USER_INFO);
        setUser(response.data);
        setUpdatedInfo({
          fullName: response.data.fullName || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          profileImageUrl: response.data.profileImageUrl || "",
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(
          err.response?.data?.error || "Failed to load profile information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo({ ...updatedInfo, [name]: value });
  };

  const handleEditClick = (fieldName) => {
    setEditFields({ ...editFields, [fieldName]: true });
  };

  const handleCancelEdit = (fieldName) => {
    setEditFields({ ...editFields, [fieldName]: false });
    // Optionally, reset the updatedInfo for this field
    setUpdatedInfo((prevInfo) => ({
      ...prevInfo,
      [fieldName]: user?.[fieldName] || "",
    }));
  };

  const handleSaveEdit = async (fieldName) => {
    try {
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        [fieldName]: updatedInfo[fieldName],
      });
      setUser((prevUser) => ({
        ...prevUser,
        [fieldName]: response.data.user[fieldName],
      }));
      setEditFields({ ...editFields, [fieldName]: false });
      toast.success("Information updated successfully.");
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error);
      toast.error(
        error.response?.data?.error || `Failed to update ${fieldName}.`
      );
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-semibold mb-4">Profile</h2>

        {/* Display and Edit User Information */}
        <div className="bg-white shadow rounded-md p-6 mb-4">
          <h3 className="text-lg font-semibold mb-2">Personal Information</h3>

          <div className="mb-2 flex items-center justify-between">
            <div>
              <FaUser className="inline-block mr-2 text-gray-500" />
              <strong>Full Name:</strong>
            </div>
            {editFields.fullName ? (
              <div className="flex items-center">
                <input
                  type="text"
                  name="fullName"
                  value={updatedInfo.fullName}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 ml-2 w-48"
                />
                <button
                  onClick={() => handleSaveEdit("fullName")}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-2 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => handleCancelEdit("fullName")}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded ml-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <span>{user?.fullName || "N/A"}</span>
                <button
                  onClick={() => handleEditClick("fullName")}
                  className="text-blue-500 hover:text-blue-700 ml-2 focus:outline-none"
                >
                  <FaPencilAlt className="inline-block" /> Change
                </button>
              </div>
            )}
          </div>

          <div className="mb-2 flex items-center justify-between">
            <div>
              <FaEnvelope className="inline-block mr-2 text-gray-500" />
              <strong>Email:</strong>
            </div>
            {editFields.email ? (
              <div className="flex items-center">
                <input
                  type="email"
                  name="email"
                  value={updatedInfo.email}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 ml-2 w-48"
                />
                <button
                  onClick={() => handleSaveEdit("email")}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-2 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => handleCancelEdit("email")}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded ml-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <span>{user?.email || "N/A"}</span>
                <button
                  onClick={() => handleEditClick("email")}
                  className="text-blue-500 hover:text-blue-700 ml-2 focus:outline-none"
                >
                  <FaPencilAlt className="inline-block" /> Change
                </button>
              </div>
            )}
          </div>

          <div className="mb-2 flex items-center justify-between">
            <div>
              <FaPhone className="inline-block mr-2 text-gray-500" />
              <strong>Phone:</strong>
            </div>
            {editFields.phone ? (
              <div className="flex items-center">
                <input
                  type="text"
                  name="phone"
                  value={updatedInfo.phone}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 ml-2 w-48"
                />
                <button
                  onClick={() => handleSaveEdit("phone")}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-2 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => handleCancelEdit("phone")}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded ml-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <span>{user?.phone || "N/A"}</span>
                <button
                  onClick={() => handleEditClick("phone")}
                  className="text-blue-500 hover:text-blue-700 ml-2 focus:outline-none"
                >
                  <FaPencilAlt className="inline-block" /> Change
                </button>
              </div>
            )}
          </div>

          {/* You can add similar logic for profileImageUrl if you implement direct editing here */}
        </div>

        {/* Change Password Form */}
        <div className="bg-white shadow rounded-md p-6">
          <h3 className="text-lg font-semibold mb-2">Change Password</h3>
          <div className="mb-2">
            <label
              htmlFor="oldPassword"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Old Password:
            </label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="newPassword"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              New Password:
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmNewPassword"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Confirm New Password:
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={passwordForm.confirmNewPassword}
              onChange={handlePasswordChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            onClick={handleUpdatePassword}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileForm;
