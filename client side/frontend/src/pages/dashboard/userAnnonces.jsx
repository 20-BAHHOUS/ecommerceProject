
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnnonceCard from "../../components/layouts/inputs/annonceCard";
import API_PATHS from "../../utils/apiPaths";
import Header from "../../components/layouts/inputs/header";
import axiosInstance from "../../utils/axiosInstance";
import { FaPlusCircle, FaExclamationTriangle, FaSpinner, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import MultiLevelNavbar from "../../components/layouts/inputs/navBarCategories";

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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <MultiLevelNavbar />
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
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-5 rounded-md shadow-sm transition-all duration-200 flex items-center gap-2 hover:translate-y-[-2px]"
            >
              <FaPlusCircle /> Create New
            </Link>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center h-60 bg-gray-100">
            <FaSpinner className="animate-spin text-4xl mb-4 text-teal-600" />
            <p className="text-lg text-gray-700">Loading your announcements...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg border border-gray-200 max-w-md w-full text-center">
              <FaExclamationTriangle className="text-5xl mb-4 text-gray-500 mx-auto" />
              <p className="text-xl font-semibold mb-2 text-gray-800">
                Oops! Something went wrong.
              </p>
              <p className="mb-6 text-gray-600">{error}</p>
              <button
                onClick={fetchAnnoncesUser}
                className="text-teal-600 hover:text-teal-700 font-medium hover:underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {AnnoncesUser.length === 0 ? (
              <div className="text-center py-12 px-4">
                <p className="text-lg font-medium text-gray-700 mb-2">You don't have any announcements yet.</p>
               
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