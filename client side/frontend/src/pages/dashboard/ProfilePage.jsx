// components/screens/ProfilePage.js
import React, { useState, useEffect, useRef } from "react";
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
  FaCamera,

  FaUpload,
  FaEnvelope,
  FaPhone,
  FaPlus,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [updatedInfo, setUpdatedInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    profileImageUrl: "",
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
          profileImageUrl: userResponse.data.profileImageUrl || "",
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setImageLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // First upload the image
      const uploadResponse = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!uploadResponse.data || !uploadResponse.data.imageUrl) {
        throw new Error('Invalid response from server');
      }

      const imageUrl = uploadResponse.data.imageUrl;

      // Then update the profile with the new image URL
      const updateResponse = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        ...updatedInfo,
        profileImageUrl: imageUrl,
      });

      if (!updateResponse.data || !updateResponse.data.user) {
        throw new Error('Failed to update profile');
      }

      setUser(updateResponse.data.user);
      setUpdatedInfo(prev => ({
        ...prev,
        profileImageUrl: imageUrl,
      }));
      
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.response?.data?.error || 'Failed to upload profile picture');
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setImageLoading(false);
    }
  };

  const toggleEditPersonal = () => {
    setIsEditingPersonal(!isEditingPersonal);
    if (isEditingPersonal) {
      // Revert changes if canceling edit
      setUpdatedInfo({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        profileImageUrl: user?.profileImageUrl || "",
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-50 to-gray-100">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
          <FaSpinner className="animate-spin text-6xl text-teal-600 mx-auto mb-4" />
          <p className="text-gray-700 text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-blue-50 font-sans">
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Summary & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Summary Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20 transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6 transform transition-transform duration-300 group-hover:scale-105">
                    {imageLoading ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <FaSpinner className="animate-spin text-3xl text-teal-600" />
                      </div>
                    ) : (
                      <div className="w-full h-full relative group">
                        {updatedInfo.profileImageUrl ? (
                          <img
                            src={updatedInfo.profileImageUrl}
                            alt={user?.fullName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/150";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
                            <FaUser className="text-4xl text-teal-600/60" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 bg-white rounded-full text-teal-600 hover:text-teal-700 transform hover:scale-110 transition-all duration-300"
                          >
                            <FaCamera className="text-xl" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
                  {user?.fullName}
                </h2>
                <div className="flex flex-col items-center space-y-2">
                  <p className="text-gray-600 flex items-center">
                    <FaEnvelope className="mr-2 text-teal-600" />
                    {user?.email}
                  </p>
                  {user?.phone && (
                    <p className="text-gray-600 flex items-center">
                      <FaPhone className="mr-2 text-teal-600" />
                      {user?.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200/50 pt-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                  <FaCog className="mr-3 text-teal-600" /> Account Settings
                </h3>
                <ul className="space-y-3">
                  <li>
                    <button
                      onClick={toggleEditPersonal}
                      className="w-full flex items-center justify-between text-gray-600 hover:text-teal-800 font-medium py-3 px-4 rounded-xl hover:bg-teal-50/50 transition-all duration-300 group"
                    >
                      <span className="flex items-center">
                        <FaEdit className="mr-3 text-lg group-hover:rotate-12 transition-transform duration-300" />
                        Edit Personal Info
                      </span>
                      <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors duration-300">
                        {isEditingPersonal ? "Active" : "Edit"}
                      </span>
                    </button>
                  </li>
                  <li>
                    <Link
                      to="/change-pass"
                      className="w-full flex items-center justify-between text-gray-600 hover:text-teal-800 font-medium py-3 px-4 rounded-xl hover:bg-teal-50/50 transition-all duration-300 group"
                    >
                      <span className="flex items-center">
                        <FaKey className="mr-3 text-lg group-hover:scale-110 transition-transform duration-300" />
                        Change Password
                      </span>
                      <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600 group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors duration-300">
                        Secure
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Personal Info Details & Announcements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Details Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FaUser className="mr-3 text-teal-600" /> Your Details
                </h2>
                {!isEditingPersonal && (
                  <button
                    onClick={toggleEditPersonal}
                    className="p-2 text-teal-600 hover:text-teal-700 transition-colors duration-200 rounded-full hover:bg-teal-50"
                  >
                    <FaEdit className="text-xl" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Full Name
                  </label>
                  {isEditingPersonal ? (
                    <input
                      type="text"
                      name="fullName"
                      value={updatedInfo.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-lg py-3">
                      {user?.fullName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Email Address
                  </label>
                  {isEditingPersonal ? (
                    <input
                      type="email"
                      name="email"
                      value={updatedInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-lg py-3">
                      {user?.email}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Phone Number
                  </label>
                  {isEditingPersonal ? (
                    <input
                      type="text"
                      name="phone"
                      value={updatedInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white/50"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-lg py-3">
                      {user?.phone || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              {isEditingPersonal && (
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={handleSavePersonal}
                    className="flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
                  >
                    <FaUpload className="mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={toggleEditPersonal}
                    className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* My Announcements Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FaBullhorn className="mr-3 text-teal-600" /> My Announcements
                </h2>
                <Link
                  to="/postad"
                  className="flex items-center px-5 py-2.5 bg-teal-600 text-white font-semibold rounded-xl shadow-md hover:bg-teal-700 transition-all duration-300 transform hover:scale-105"
                >
                  <FaPlus className="mr-2" />
                  New Post
                </Link>
              </div>
              
              {annonces.length === 0 ? (
                <div className="text-center py-16 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
                  <FaBullhorn className="text-6xl text-gray-300 mx-auto mb-4 transform -rotate-12" />
                  <p className="text-gray-600 text-lg mb-6">
                    You haven't posted any announcements yet
                  </p>
                  <Link
                    to="/postad"
                    className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium text-lg hover:underline transition-colors duration-200"
                  >
                    Create your first announcement
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
