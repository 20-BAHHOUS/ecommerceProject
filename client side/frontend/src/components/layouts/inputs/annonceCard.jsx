import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaImage, FaHeart, FaClock } from "react-icons/fa";
import { parseImages, markImageAsFailed } from "../../../utils/parseImages";
import moment from 'moment';
import axiosInstance from "../../../utils/axiosInstance";
import API_PATHS from "../../../utils/apiPaths";
import { toast } from "react-toastify";

const formatPrice = (price) => {
  const numericPrice = Number(price);
  if (isNaN(numericPrice)) {
    return "N/A";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericPrice);
};

const AnnonceCard = ({ annonce, viewType = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Check if this announcement is in user's favorites when component mounts
    const checkFavoriteStatus = async () => {
      if (!annonce || !annonce._id) return;
      
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.CHECK_FAVORITE(annonce._id));
        setIsFavorite(response.data.isFavorite);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    const token = localStorage.getItem("token");
    if (token && annonce && annonce._id) {
      checkFavoriteStatus();
    }
  }, [annonce]);

  // Skip rendering "wanted" announcements in regular listing view
  if (!annonce || annonce.type === "wanted") {
    return null;
  }

  if (!annonce) {
    return null;
  }

  const hasValidImages = annonce.images && 
                        Array.isArray(annonce.images) && 
                        annonce.images.length > 0 && 
                        typeof annonce.images[0] === 'string';

  const detailLink = annonce._id ? `/annonces/${annonce._id}` : "#";
  
  const timeAgo = annonce.createdAt 
    ? moment(annonce.createdAt).fromNow()
    : null;

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!localStorage.getItem("token")) {
      toast.error("Please login to add items to favorites");
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.TOGGLE_FAVORITE, {
        annonceId: annonce._id
      });
      
      setIsFavorite(response.data.isFavorite);
      toast.success(response.data.message);
      
      // Notify other components about the favorites update
      localStorage.setItem("favoritesUpdated", Date.now().toString());
      localStorage.removeItem("favoritesUpdated"); // Immediately remove to allow future updates
      
      // If we're in the favorites page and we're removing from favorites, dispatch a custom event
      if (!response.data.isFavorite) {
        const event = new CustomEvent('removeFavorite', { 
          detail: { annonceId: annonce._id } 
        });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Could not update favorites. Please try again later.");
    }
  };

  const handleImageError = () => {
    // Use React state to track image errors instead of DOM manipulation
    if (hasValidImages) {
      markImageAsFailed(annonce.images[0]);
    }
    setImageError(true);
  };

  // Grid view card (default)
  if (viewType === 'grid') {
    return (
      <div 
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Section */}
        <Link
          to={detailLink}
          className="block relative aspect-[4/3] w-full overflow-hidden"
        >
          {(!hasValidImages || imageError) ? (
            <div className="h-full w-full flex items-center justify-center bg-gray-50">
              <FaImage className="text-4xl text-gray-300" />
            </div>
          ) : (
            <img
              className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
              src={parseImages(annonce.images[0])}
              alt={annonce.title || "Announcement image"}
              onError={handleImageError}
              loading="lazy"
            />
          )}
          
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex space-x-2">
            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full ${
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white'
              } transition-all duration-300 shadow-sm hover:shadow`}
            >
              <FaHeart className={isFavorite ? 'fill-current' : 'stroke-current'} size={16} />
            </button>
          </div>
        </Link>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Title */}
          <Link to={detailLink} className="block mb-2 group">
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-teal-600 line-clamp-2 transition-colors duration-200">
              {annonce.title || "Untitled Announcement"}
            </h3>
          </Link>

          {/* Price and Type */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xl font-bold text-teal-600">
              {formatPrice(annonce.price)}
            </p>
            {annonce.type && (
              <span className="inline-flex items-center bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                {annonce.type}
              </span>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            {annonce.location && (
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-1.5 text-gray-400" size={14} />
                <span className="truncate max-w-[150px]" title={annonce.location}>
                  {annonce.location}
                </span>
              </div>
            )}
            {timeAgo && (
              <div className="flex items-center">
                <FaClock className="mr-1.5 text-gray-400" size={14} />
                <span>{timeAgo}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List view card
  return (
    <div 
      className="bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row h-auto md:h-[280px] relative overflow-hidden w-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section - List View */}
      <Link
        to={detailLink}
        className="block relative w-1/3 min-w-[120px] overflow-hidden"
      >
        {(!hasValidImages || imageError) ? (
          <div className="h-full w-full flex items-center justify-center bg-gray-50">
            <FaImage className="text-4xl text-gray-300" />
          </div>
        ) : (
          <img
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            src={parseImages(annonce.images[0])}
            alt={annonce.title || "Announcement image"}
            onError={handleImageError}
            loading="lazy"
          />
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white'
            } transition-all duration-300 shadow-sm hover:shadow`}
          >
            <FaHeart className={isFavorite ? 'fill-current' : 'stroke-current'} size={16} />
          </button>
        </div>
      </Link>

      {/* Content Section - List View */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between">
          {/* Title and Description */}
          <div className="flex-grow pr-4">
            <Link to={detailLink} className="block mb-2 group">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-teal-600 transition-colors duration-200">
                {annonce.title || "Untitled Announcement"}
              </h3>
            </Link>
            
            {annonce.description && (
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                {annonce.description}
              </p>
            )}
            
            {/* Location and Time */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
              {annonce.location && (
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-1.5 text-gray-400" size={14} />
                  <span className="truncate max-w-[150px]" title={annonce.location}>
                    {annonce.location}
                  </span>
                </div>
              )}
              {timeAgo && (
                <div className="flex items-center">
                  <FaClock className="mr-1.5 text-gray-400" size={14} />
                  <span>{timeAgo}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Price and Type */}
          <div className="flex flex-col items-end">
            <p className="text-xl font-bold text-teal-600 mb-2">
              {formatPrice(annonce.price)}
            </p>
            {annonce.type && (
              <span className="inline-flex items-center bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                {annonce.type}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

AnnonceCard.propTypes = {
  annonce: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string,
    location: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  viewType: PropTypes.oneOf(['grid', 'list']),
};

export default AnnonceCard;
