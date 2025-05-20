// components/screens/ProfilePage.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/layouts/inputs/header";
import AnnonceCard from "../../components/layouts/inputs/annonceCard";
import {
  FaUser,
  FaSpinner,
  FaEdit,
  FaBullhorn,
  FaKey,
  FaCog,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchProfileAndAnnonces = async () => {
      setLoading(true);
      setError(null);
      try {
        const userResponse = await axiosInstance.post(
          API_PATHS.AUTH.GET_USER_INFO
        );
        setUser(userResponse.data);
        setUpdatedInfo({
          fullName: userResponse.data.fullName || "",
          email: userResponse.data.email || "",
          phone: userResponse.data.phone || "",
        });

        const annoncesResponse = await axiosInstance.get(
          API_PATHS.ANNONCE.GET_ANNONCES_BY_USER(userResponse.data._id)
        );
        setAnnonces(annoncesResponse.data.data || []);
      } catch (err) {
        console.error("Error fetching profile and announcements:", err);
        setError(
          err.response?.data?.error ||
            "Failed to load profile and announcements."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndAnnonces();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo({ ...updatedInfo, [name]: value });
  };

  const toggleEditPersonal = () => {
    setIsEditingPersonal(!isEditingPersonal);
    if (isEditingPersonal) {
      // Revert changes if canceling edit
      setUpdatedInfo({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: user?.phone || "",
      });
    }
  };

  const handleSavePersonal = async () => {
    try {
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        updatedInfo
      );
      setUser(response.data.user);
      setIsEditingPersonal(false);
      toast.success("Personal details updated successfully!");
    } catch (error) {
      console.error("Error updating personal information:", error);
      toast.error(
        error.response?.data?.error || "Failed to update personal information."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-5xl text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-8 text-center bg-white shadow-lg rounded-lg mx-auto max-w-xl mt-20">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Summary & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Summary Card */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-lg">
              <div className="flex flex-col items-center mb-6">
                <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-gray-600 text-7xl overflow-hidden border-4 border-white shadow-sm mb-4">
                  {/* You'd display user.profileImageUrl here */}
                  <FaUser />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {user?.fullName}
                </h2>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <FaCog className="mr-2 text-blue-500" /> Account Settings
                </h3>
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={toggleEditPersonal}
                      className="w-full flex items-center justify-between text-gray-600 hover:text-blue-800 font-medium py-2 px-3 rounded-md hover:bg-blue-50 transition duration-200 ease-in-out group"
                    >
                      <span>
                        <FaEdit className="inline mr-2 group-hover:rotate-6 transition" />{" "}
                        Edit Personal Info
                      </span>
                      <span className="text-xs text-gray-400 group-hover:text-blue-600">
                        {isEditingPersonal ? "Active" : "Edit"}
                      </span>
                    </button>
                  </li>
                  <li>
                    <Link
                      to="/change-pass"
                      className="w-full flex items-center justify-between text-gray-600 hover:text-blue-800 font-medium py-2 px-3 rounded-md hover:bg-blue-50 transition duration-200 ease-in-out group"
                    >
                      <span>
                        <FaKey className="inline mr-2 group-hover:scale-110 transition" />{" "}
                        Change Password
                      </span>
                      <span className="text-xs text-gray-400 group-hover:text-blue-600">
                        Secure
                      </span>
                    </Link>
                  </li>
                  {/* Add more settings links here */}
                  {/* <li>
                    <Link to="/settings/privacy" className="w-full flex items-center justify-between text-gray-700 hover:text-blue-600 font-medium py-2 px-3 rounded-md hover:bg-gray-50 transition duration-200 ease-in-out">
                      <span><FaShieldAlt className="inline mr-2" /> Privacy Settings</span>
                    </Link>
                  </li> */}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Personal Info Details & Announcements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Details Card */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaUser className="mr-3 text-blue-600" /> Your Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Full Name
                  </label>
                  {isEditingPersonal ? (
                    <input
                      type="text"
                      name="fullName"
                      value={updatedInfo.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-lg">
                      {user?.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email Address
                  </label>
                  {isEditingPersonal ? (
                    <input
                      type="email"
                      name="email"
                      value={updatedInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-lg">
                      {user?.email}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  {" "}
                  {/* Span full width for phone */}
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Phone Number
                  </label>
                  {isEditingPersonal ? (
                    <input
                      type="text"
                      name="phone"
                      value={updatedInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-lg">
                      {user?.phone || "N/A"}
                    </p>
                  )}
                </div>
              </div>

              {isEditingPersonal && (
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    onClick={handleSavePersonal}
                    className="flex items-center px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                  >
                    Save
                  </button>
                  <button
                    onClick={toggleEditPersonal}
                    className="flex items-center px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* My Announcements Card */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaBullhorn className="mr-3 text-indigo-600" /> My Announcements
              </h2>
              {annonces.length === 0 ? (
                <p className="text-gray-600 text-center py-8 text-lg">
                  You haven't posted any announcements yet.
                  <br />
                  <Link
                    to="/post-annonce"
                    className="text-indigo-600 hover:underline font-medium mt-3 inline-block"
                  >
                    Create your first announcement!
                  </Link>
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {annonces.map((annonce) => (
                    <AnnonceCard key={annonce._id} annonce={annonce} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
