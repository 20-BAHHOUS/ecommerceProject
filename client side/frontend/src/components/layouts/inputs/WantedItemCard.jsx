import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaImage, FaClock, FaUser, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { parseImages } from "../../../utils/parseImages";
import moment from 'moment';

const WantedItemCard = ({ annonce, viewType = 'row' }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Early return if announcement is invalid or not a wanted type
  if (!annonce || annonce.type !== "wanted") {
    console.log("Card skipped - not a wanted item or invalid", annonce?.type);
    return null;
  }

  const hasValidImages = annonce.images && 
                       Array.isArray(annonce.images) && 
                       annonce.images.length > 0;

  const detailLink = annonce._id ? `/annonces/${annonce._id}` : "#";
  
  const timeAgo = annonce.createdAt 
    ? moment(annonce.createdAt).fromNow()
    : "Recently";

  // Simplified row view - always use this for wanted items
  return (
    <div 
      className="bg-white rounded-lg shadow hover:shadow-md transition-all duration-300 border border-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center w-full p-3">
        {/* Image Thumbnail */}
        <div className="relative w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 border border-gray-200 rounded overflow-hidden">
          {hasValidImages ? (
            <img
              className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
              src={parseImages(annonce.images[0])}
              alt={annonce.title || "Wanted item"}
              onError={() => console.log("Image error")}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <FaImage className="text-3xl text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-grow px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          {/* Title and Description */}
          <div className="flex-grow min-w-0 mb-3 sm:mb-0"> 
            <Link to={detailLink} className="group block">
              <h3 className={`text-base sm:text-lg font-semibold text-gray-800 group-hover:text-teal-600 transition-colors duration-200 ${isHovered ? 'text-teal-600' : ''}`}>
                {annonce.title || "Untitled Request"}
              </h3>
            </Link>
            
            {annonce.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2 max-w-lg">
                {annonce.description}
              </p>
            )}
            
            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
              {timeAgo && (
                <div className="flex items-center">
                  <FaClock className="mr-1.5 text-teal-500 flex-shrink-0" size={14} />
                  <span>{timeAgo}</span>
                </div>
              )}
              {annonce.location && (
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-1.5 text-gray-500 flex-shrink-0" size={14} />
                  <span>{annonce.location}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Contact Button */}
          <div className="flex-shrink-0">
            <button
              className="inline-flex items-center px-4 py-2 border border-teal-300 rounded-md text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors whitespace-nowrap transform hover:scale-105 active:scale-95 duration-200 shadow-sm"
            >
              <FaPhone className="mr-2 text-teal-600" size={14} />
              <span>Contact</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

WantedItemCard.propTypes = {
  annonce: PropTypes.object.isRequired,
  viewType: PropTypes.string
};

export default WantedItemCard; 