/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
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
  const [sortBy, setSortBy] = useState('newest');

  const fetchAnnoncesUser = useCallback(async () => {
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
        API_PATHS.ANNONCE.GET_ANNONCES_BY_USER(userId),
        {
          params: { sort: sortBy }
        }
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
  }, [navigate, sortBy]);

  useEffect(() => {
    fetchAnnoncesUser();
  }, [fetchAnnoncesUser]);

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

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'type-sale', label: 'Type: For Sale' },
    { value: 'type-trade', label: 'Type: For Trade' },
    { value: 'type-wanted', label: 'Type: Wanted' },
    { value: 'type-rent', label: 'Type: For Rent' }
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Your Announcements
            </h1>
            <p className="text-gray-500">{AnnoncesUser.length} {AnnoncesUser.length === 1 ? 'announcement' : 'announcements'} published</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Link
              to="/postad"
              className="bg-gray-900 hover:bg-black text-white font-medium py-2.5 px-5 rounded-md shadow-sm transition-all duration-200 flex items-center gap-2 hover:translate-y-[-2px]"
            >
              <FaPlusCircle /> Create New
            </Link>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col justify-center items-center h-60 bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <FaSpinner className="animate-spin text-3xl text-gray-400 mb-4" />
            <p className="text-gray-500">Loading your announcements...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col justify-center items-center bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center max-w-lg mx-auto">
            <div className="bg-red-50 p-3 rounded-full mb-4">
              <FaExclamationTriangle className="text-2xl text-red-500" />
            </div>
            <h3 className="font-medium text-lg text-gray-900 mb-2">Unable to load announcements</h3>
            <p className="text-gray-500 mb-5">{error}</p>
            <button
              onClick={fetchAnnoncesUser}
              className="bg-gray-900 hover:bg-black text-white font-medium py-2 px-4 rounded-md shadow-sm transition-all duration-200"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {AnnoncesUser.length === 0 ? (
              <div className="flex flex-col justify-center items-center bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="font-medium text-xl text-gray-900 mb-2">
                  No announcements yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start selling by creating your first announcement
                </p>
                <Link
                  to="/postad"
                  className="bg-gray-900 hover:bg-black text-white font-medium py-2.5 px-5 rounded-md shadow-sm transition-all duration-200 inline-flex items-center gap-2 hover:translate-y-[-2px]"
                >
                  <FaPlusCircle /> Create Announcement
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {AnnoncesUser.map((annonce) =>
                  annonce._id ? (
                    <div key={annonce._id} className="group relative bg-white rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md border border-gray-100">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                      <AnnonceCard annonce={annonce} />
                      <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                        <Link
                          to={`/edit-annonce/${annonce._id}`}
                          className="bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-full shadow-sm transition-all duration-200"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDeleteAnnonce(annonce._id)}
                          className="bg-white hover:bg-red-50 text-red-500 p-2 rounded-full shadow-sm transition-all duration-200"
                          title="Delete"
                        >
                          <FaTrash />
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