// components/screens/ProfilePage.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/layouts/inputs/header";
import AnnonceCard from "../../components/layouts/inputs/annonceCard";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSpinner,
  FaPencilAlt,
  FaAd,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileAndAnnonces = async () => {
      setLoading(true);
      setError(null);
      try {
        const userResponse = await axiosInstance.post(
          API_PATHS.AUTH.GET_USER_INFO
        );
        setUser(userResponse.data);

        // Fetch user's announcements
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
      <Navbar/>
      <ToastContainer /> 
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
        <div className="bg-white shadow rounded-md p-6 mb-4 relative">
          {/* Edit Profile Button */}
          <Link
            to="/updateProfile"
            className="absolute top-4 right-4 bg-white text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white font-semibold py-2 px-4 rounded text-sm focus:outline-none transition duration-150 ease-in-out"
          >
            <FaPencilAlt className="inline-block mr-2" /> Edit Profile
          </Link>

          <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
          <div className="mb-2 flex items-center">
            <FaUser className="inline-block mr-2 text-gray-500" />
            <strong>Full Name:</strong>{" "}
            <span className="ml-2">{user?.fullName }</span>
          </div>
          <div className="mb-2 flex items-center">
            <FaPhone className="inline-block mr-2 text-gray-500" />
            <strong>Phone:</strong>{" "}
            <span className="ml-2">{user?.phone || "N/A"}</span>
          </div>
        </div>

        {/* User's Announcements */}
        <div className="bg-white shadow rounded-md p-6">
          <h3 className="text-lg font-semibold mb-2">
            <FaAd className="inline-block mr-2 text-gray-500" /> My
            Announcements
          </h3>
          {annonces.length === 0 ? (
            <p>You haven't posted any announcements yet.</p>
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
  );
};

export default ProfilePage;
