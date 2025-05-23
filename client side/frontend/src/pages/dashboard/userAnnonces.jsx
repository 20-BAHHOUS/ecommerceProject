/* eslint-disable react-hooks/exhaustive-deps */
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

  const fetchAnnoncesUser = async () => {
    setLoading(true);
    setError(null);
    try {
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
        fetchAnnoncesUser();
      } catch (error) {
        console.error("Error deleting announcement:", error);
        toast.error("Failed to delete announcement. Please try again.");
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center gap-6 mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Your Announcements
          </h1>
          <Link
            to="/postad"
            className="bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center"
          >
            <FaPlusCircle className="mr-3 text-lg" /> Post New Ad
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-80">
            <FaSpinner className="animate-spin text-5xl text-teal-600" />
            <p className="ml-4 text-lg text-gray-600">Loading your announcements...</p>
          </div>
        )}

        {error && (
          <div className="text-center p-8 bg-red-50 border border-red-300 text-red-700 rounded-lg shadow-md max-w-lg mx-auto">
            <FaExclamationTriangle className="text-4xl mx-auto mb-4 text-red-500" />
            <p className="font-bold text-xl mb-2">Error!</p>
            <p className="text-lg">{error}</p>
            <button
              onClick={fetchAnnoncesUser}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-lg transition duration-200"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {AnnoncesUser.length === 0 ? (
              <div className="text-center p-12 bg-gray-50 rounded-lg shadow-inner max-w-xl mx-auto">
                <p className="text-2xl text-gray-600 font-semibold mb-4">
                  No announcements found!
                </p>
                <p className="text-lg text-gray-500 mb-6">
                  It looks like you haven't posted any ads yet.
                </p>
                <Link
                  to="/postad"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105 inline-flex items-center"
                >
                  <FaPlusCircle className="mr-2" /> Start Posting Now
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {AnnoncesUser.map((annonce) =>
                  annonce._id ? (
                    <div key={annonce._id} className="relative group">
                      <AnnonceCard annonce={annonce} />
                      <div className="absolute top-3 right-3 flex flex-col items-end space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Link
                          to={`/edit-annonce/${annonce._id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full shadow-lg transition duration-200 transform hover:scale-110 tooltip"
                          data-tooltip="Edit"
                        >
                          <FaEdit className="text-lg" />
                        </Link>
                        <button
                          onClick={() => handleDeleteAnnonce(annonce._id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full shadow-lg transition duration-200 transform hover:scale-110 tooltip"
                          data-tooltip="Delete"
                        >
                          <FaTrash className="text-lg" />
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