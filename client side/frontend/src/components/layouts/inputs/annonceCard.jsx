import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaImage, FaHeart, FaClock } from "react-icons/fa";
import { parseImages, markImageAsFailed } from "../../../utils/parseImages";
import moment from 'moment';

const formatPrice = (price) => {
  const numericPrice = Number(price);
  if (isNaN(numericPrice)) {
    console.warn(`Invalid price value received: ${price}`);
    return "N/A";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericPrice);
};

const AnnonceCard = ({ annonce }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    // Add your favorite logic here
  };

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
        {!hasValidImages ? (
          <div className="h-full w-full flex items-center justify-center bg-gray-50">
            <FaImage className="text-4xl text-gray-300" />
          </div>
        ) : (
          <img
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            src={parseImages(annonce.images[0])}
            alt={annonce.title || "Announcement image"}
            onError={(e) => {
              e.target.onerror = null;
              markImageAsFailed(annonce.images[0]);
              e.target.parentElement.innerHTML = '<div class="h-full w-full flex items-center justify-center bg-gray-50"><svg class="text-4xl text-gray-300" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v12H4z"/><path d="M18 18H6v-4l3-3 2 2 6-6"/><circle cx="8" cy="9" r="2"/></svg></div>';
            }}
            loading="lazy"
          />
        )}
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white'
          } transition-all duration-300 shadow-sm hover:shadow`}
        >
          <FaHeart className={isFavorite ? 'fill-current' : 'stroke-current'} size={16} />
        </button>

        {/* Category Badge */}
        {annonce.category && (
          <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full capitalize shadow-sm">
            {annonce.category}
          </span>
        )}
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
};

AnnonceCard.propTypes = {
  annonce: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    category: PropTypes.string,
    type: PropTypes.string,
    location: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.string,
  }).isRequired,
};

export default AnnonceCard;
