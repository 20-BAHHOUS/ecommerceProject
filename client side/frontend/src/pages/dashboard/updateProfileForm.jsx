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
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import ProfilePhotoSelector from "../../components/layouts/inputs/ProfilePhotoSelector";
import { Link } from "react-router-dom";

const UpdateProfileForm = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editFields, setEditFields] = useState({
    fullName: false,
    email: false,
    phone: false,
  });
  const [updatedInfo, setUpdatedInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    profileImageUrl: "",
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-primary-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto py-10 px-4 md:px-0">
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Your Profile
          </h2>

          {/* Full Name Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaUser className="text-gray-500 mr-3" />
                <label className="block text-gray-700 text-sm font-bold">
                  Full Name
                </label>
              </div>
              {!editFields.fullName ? (
                <button
                  onClick={() => handleEditClick("fullName")}
                  className="text-teal-500 focus:outline-none transition duration-150 ease-in-out"
                >
                  <FaPencilAlt className="inline-block mr-1" /> Edit
                </button>
              ) : (
                <div className="flex items-center">
                  <input
                    type="text"
                    name="fullName"
                    value={updatedInfo.fullName}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-48 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-2"
                  />
                  <button
                    onClick={() => handleSaveEdit("fullName")}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded ml-2 focus:outline-none focus:shadow-outline text-sm"
                  >
                    <FaCheck /> Save
                  </button>
                  <button
                    onClick={() => handleCancelEdit("fullName")}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded ml-2 focus:outline-none focus:shadow-outline text-sm"
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-600 mt-1">{user?.fullName}</p>
          </div>

          {/* Email Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaEnvelope className="text-gray-500 mr-3" />
                <label className="block text-gray-700 text-sm font-bold">
                  Email
                </label>
              </div>
              {!editFields.email ? (
                <button
                  onClick={() => handleEditClick("email")}
                  className="text-teal-500 hover:text-indigo-700 focus:outline-none transition duration-150 ease-in-out"
                >
                  <FaPencilAlt className="inline-block mr-1" /> Edit
                </button>
              ) : (
                <div className="flex items-center">
                  <input
                    type="email"
                    name="email"
                    value={updatedInfo.email}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-48 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-2"
                  />
                  <button
                    onClick={() => handleSaveEdit("email")}
                    className="bg-green-500  text-white font-bold py-1.5 px-2 rounded ml-2 focus:outline-none focus:shadow-outline text-sm"
                  >
                    <FaCheck /> Save
                  </button>
                  <button
                    onClick={() => handleCancelEdit("email")}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded ml-2 focus:outline-none focus:shadow-outline text-sm"
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-600 mt-1">{user?.email}</p>
          </div>

          {/* Phone Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaPhone className="text-gray-500 mr-3" />
                <label className="block text-gray-700 text-sm font-bold">
                  Phone Number
                </label>
              </div>
              {!editFields.phone ? (
                <button
                  onClick={() => handleEditClick("phone")}
                  className="text-teal-500 focus:outline-none transition duration-150 ease-in-out"
                >
                  <FaPencilAlt className="inline-block mr-1" /> Edit
                </button>
              ) : (
                <div className="flex items-center">
                  <input
                    type="text"
                    name="phone"
                    value={updatedInfo.phone}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-48 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-2"
                  />
                  <button
                    onClick={() => handleSaveEdit("phone")}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded ml-2 focus:outline-none focus:shadow-outline text-sm"
                  >
                    <FaCheck /> Save
                  </button>
                  <button
                    onClick={() => handleCancelEdit("phone")}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded ml-2 focus:outline-none focus:shadow-outline text-sm"
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-600 mt-1">{user?.phone}</p>
          </div>

          {/* Password Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <label className="block text-gray-700 text-sm font-bold">
                  Password
                </label>
              </div>
              <Link
                to="/change-pass"
                className="inline-flex items-center bg-teal-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm transition duration-150 ease-in-out"
              >
                <FaPencilAlt className="mr-2" /> Change Password
              </Link>
            </div>
          </div>

          {/* Profile Photo Selector (assuming you have this component) */}
          {/* <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Profile Photo
            </label>
            <ProfilePhotoSelector />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileForm;