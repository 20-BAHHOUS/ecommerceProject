import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, AlertCircle } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { toast } from "react-toastify";
import AnnonceCard from "../layouts/inputs/annonceCard";
import Navbar from "../layouts/inputs/header";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavorites();
    
    // Listen for custom events from AnnonceCard components
    const handleRemoveFavorite = (event) => {
      const { annonceId } = event.detail;
      if (annonceId) {
        setFavorites(currentFavorites => 
          currentFavorites.filter(favorite => favorite._id !== annonceId)
        );
      }
    };
    
    window.addEventListener('removeFavorite', handleRemoveFavorite);
    
    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('removeFavorite', handleRemoveFavorite);
    };
  }, []);
  
  // Also listen for localStorage changes for favorites updates
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "favoritesUpdated") {
        fetchFavorites();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_FAVORITES);
      setFavorites(response.data.favorites || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setError("Failed to load favorites. Please try again later.");
      setIsLoading(false);
      toast.error("Failed to load favorites");
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 bg-gray-100">
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchFavorites}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  if (favorites.length === 0) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-2xl font-bold mb-8 text-gray-800">My Favorites</h1>
          <div className="flex flex-col items-center justify-center h-64 text-center bg-gray-50 rounded-lg border border-gray-100 p-8">
            <Heart className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-4">You haven't added any announcements to your favorites.</p>
            <Link
              to="/home"
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Browse Announcements
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">My Favorites</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((favorite) => (
            <AnnonceCard key={favorite._id} annonce={favorite} viewType="grid" />
          ))}
        </div>
      </div>
    </>
  );
};

export default FavoritesPage; 