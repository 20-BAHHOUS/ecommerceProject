// components/screens/UserAnnonces.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnnonceCard from "../../components/layouts/inputs/annonceCard";
import API_PATHS from "../../utils/apiPaths";
import Header from "../../components/layouts/inputs/header";
import axiosInstance from "../../utils/axiosInstance";
import { FaPlusCircle, FaExclamationTriangle, FaSpinner, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const UserAnnonces = () => {
  const navigate = useNavigate();
  const [AnnoncesUser, setAnnoncesUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnnoncesUser = async () => { // Declared outside useEffect
    setLoading(true);
    setError(null);
    try {
      // Get the current user ID from localStorage
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("User not authenticated. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axiosInstance.get(
        API_PATHS.ANNONCE.GET_ANNONCES_BY_USER(userId)
      );

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setAnnoncesUser(response.data.data);
      } else if (Array.isArray(response.data)) {
        setAnnoncesUser(response.data);
      } else {
        console.warn(
          "Received non-array response for my annonces:",
          response.data
        );
        setAnnoncesUser([]);
        setError("Received unexpected data format from server.");
      }
    } catch (err) {
      console.error("Error fetching my annonces:", err);
      if (err.response) {
        setError(
          `Error ${err.response.status}: ${
            err.response.data?.message || "Failed to load your announcements."
          }`
        );
        if (err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } else if (err.request) {
        setError("Network Error: Could not connect to the server.");
      } else {
        setError(`Error: ${err.message || "Failed to load your announcements."}`);
      }
      setAnnoncesUser([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnoncesUser();
  }, [navigate]);

  const handleDeleteAnnonce = async (annonceIdToDelete) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await axiosInstance.delete(API_PATHS.ANNONCE.ANNONCE_BY_ID(annonceIdToDelete));
        toast.success("Announcement deleted successfully!");
        // Refresh the list of announcements
        fetchAnnoncesUser(); // Now accessible
      } catch (error) {
        console.error("Error deleting announcement:", error);
        toast.error("Failed to delete announcement. Please try again.");
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Your Announcements
          </h1>
          <Link
            to="/postad"
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center transition duration-150 ease-in-out"
          >
            <FaPlusCircle className="mr-2" /> Post New Ad
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-4xl text-indigo-500" />
          </div>
        )}

        {error && (
          <div className="text-center p-6 bg-red-100 border border-red-400 text-red-700 rounded-md shadow-sm">
            <FaExclamationTriangle className="text-3xl mx-auto mb-2" />
            <p className="font-semibold text-lg mb-1">Oops! Something went wrong.</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {AnnoncesUser.length === 0 ? (
              <div className="text-center p-10 text-gray-500">
                <p className="text-xl mb-4">You haven't posted any announcements yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {AnnoncesUser.map((annonce) =>
                  annonce._id ? (
                    <div key={annonce._id} className="relative">
                      <AnnonceCard annonce={annonce} />
                      <div className="absolute top-2 right-2 flex flex-col items-end">
                        <Link
                          to={`/edit-annonce/${annonce._id}`}
                          className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-md shadow-sm mb-1 inline-flex items-center"
                        >
                          <FaEdit className="mr-1" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteAnnonce(annonce._id)}
                          className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-md shadow-sm inline-flex items-center"
                        >
                          <FaTrash className="mr-1" /> Delete
                        </button>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserAnnonces;
