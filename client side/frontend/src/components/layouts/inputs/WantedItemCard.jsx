import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaImage, FaClock, FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope, FaExclamationCircle } from "react-icons/fa";
import { parseImages } from "../../../utils/parseImages";
import moment from 'moment';
import axiosInstance from "../../../utils/axiosInstance";
import API_PATHS from "../../../utils/apiPaths";
import { toast } from "react-toastify";

const WantedItemCard = ({ annonce, viewType = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [userError, setUserError] = useState(null);
  const [imageError, setImageError] = useState(false);
  
  // Early return if announcement is invalid or not a wanted type
  if (!annonce || annonce.type !== "wanted") {
    console.log("Card skipped - not a wanted item or invalid", annonce?.type);
    return null;
  }

  // Effect to fetch user info when modal opens
  useEffect(() => {
    if (contactModalOpen && annonce._id) {
      fetchUserInfo();
    }
  }, [contactModalOpen]);

  // Function to fetch user info
  const fetchUserInfo = async () => {
    setLoadingUser(true);
    setUserError(null);
    
    try {
      const response = await axiosInstance.get(API_PATHS.ANNONCE.ANNONCE_BY_ID(annonce._id));
      
      if (response.data && response.data.createdBy) {
        setUserInfo(response.data.createdBy);
      } else {
        setUserError("User information not available");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUserError("Failed to load user information");
    } finally {
      setLoadingUser(false);
    }
  };

  const hasValidImages = annonce.images && 
                       Array.isArray(annonce.images) && 
                       annonce.images.length > 0;

  const detailLink = annonce._id ? `/annonces/${annonce._id}` : "#";
  
  const timeAgo = annonce.createdAt 
    ? moment(annonce.createdAt).fromNow()
    : "Recently";

  const handleContactClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setContactModalOpen(true);
  };
  
  const handleImageError = () => {
    setImageError(true);
  };

  // Contact modal component
  const ContactModal = () => {
    if (!contactModalOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-6 max-w-md w-full border border-gray-200 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-gray-800">Contact Information</h3>
            <button 
              onClick={() => setContactModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {loadingUser ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent"></div>
              <p className="mt-3 text-gray-600 font-medium">Loading contact information...</p>
            </div>
          ) : userError ? (
            <div className="text-center py-8">
              <div className="bg-yellow-50 p-5 rounded-lg">
                <FaExclamationCircle className="text-yellow-500 text-4xl mx-auto mb-3" />
                <p className="text-gray-700 font-medium">{userError}</p>
              </div>
            </div>
          ) : userInfo ? (
            <>
              <div className="bg-teal-50 p-5 rounded-xl mb-5">
                <div className="flex items-center">
                  <div className="bg-teal-100 p-3 rounded-full shadow-sm">
                    <FaUser className="text-teal-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 text-lg">{userInfo.fullName || "N/A"}</h4>
                    <p className="text-sm text-teal-600 font-medium">Item Seeker</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-5">
                {/* Item information */}
                <div className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Looking for:
                  </div>
                  <p className="text-gray-800 pl-2 font-medium">{annonce.title}</p>
                  {annonce.description && (
                    <p className="text-gray-600 pl-2 mt-1 text-sm line-clamp-2">{annonce.description}</p>
                  )}
                </div>
                
                {/* Email section */}
                <div className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex items-center mb-2">
                    <FaEnvelope className="text-blue-600 mr-2" />
                    <p className="font-medium text-gray-700">Email</p>
                  </div>
                  {userInfo.email ? (
                    <p className="text-gray-800 break-all pl-6">
                      <a href={`mailto:${userInfo.email}`} className="text-teal-600 hover:underline font-medium">
                        {userInfo.email}
                      </a>
                    </p>
                  ) : (
                    <p className="text-gray-500 italic pl-6">Not available</p>
                  )}
                </div>
                
                {/* Phone section */}
                <div className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex items-center mb-2">
                    <FaPhone className="text-green-600 mr-2" />
                    <p className="font-medium text-gray-700">Phone</p>
                  </div>
                  {userInfo.phone ? (
                    <p className="text-gray-800 pl-6">
                      <a href={`tel:${userInfo.phone}`} className="text-teal-600 hover:underline font-medium">
                        {userInfo.phone}
                      </a>
                    </p>
                  ) : (
                    <p className="text-gray-500 italic pl-6">Not available</p>
                  )}
                </div>
                
                {!userInfo.email && !userInfo.phone && (
                  <div className="text-center py-5 px-4 bg-yellow-50 rounded-lg">
                    <FaExclamationCircle className="text-yellow-500 text-2xl mx-auto mb-2" />
                    <p className="text-gray-700 font-medium">This user has not provided any contact information.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">User contact information is unavailable.</p>
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setContactModalOpen(false)}
              className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Grid view card
  if (viewType === 'grid') {
    return (
      <>
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
                alt={annonce.title || "Wanted item"}
                onError={handleImageError}
                loading="lazy"
              />
            )}
            
            {/* Timestamp badge */}
            {timeAgo && (
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {timeAgo}
              </div>
            )}
          </Link>

          {/* Content Section */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Title */}
            <Link to={detailLink} className="block mb-2 group">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-teal-600 line-clamp-2 transition-colors duration-200">
                {annonce.title || "Untitled Request"}
              </h3>
            </Link>

            {/* Description (only in grid view) */}
            {annonce.description && (
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                {annonce.description}
              </p>
            )}

            {/* Type badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                Wanted
              </span>
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
              
              <button
                onClick={handleContactClick}
                className="inline-flex items-center px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap text-xs font-medium shadow-sm"
              >
                <FaPhone className="mr-1" size={12} />
                <span>Contact</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Render contact modal */}
        <ContactModal />
      </>
    );
  }

  // List view card
  return (
    <>
      <div 
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-row h-full relative overflow-hidden w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Section - List View */}
        <div className="relative w-full sm:w-1/4 min-w-[120px] overflow-hidden">
          <Link to={detailLink} className="block h-full">
            {(!hasValidImages || imageError) ? (
              <div className="flex items-center justify-center h-full w-full bg-gray-50" style={{ minHeight: '140px' }}>
                <FaImage className="text-4xl text-gray-300" />
              </div>
            ) : (
              <img
                className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
                src={parseImages(annonce.images[0])}
                alt={annonce.title || "Wanted item"}
                onError={handleImageError}
                loading="lazy"
                style={{ height: '100%', minHeight: '140px' }}
              />
            )}
            
            {/* Timestamp badge */}
            {timeAgo && (
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {timeAgo}
              </div>
            )}
          </Link>
        </div>
        
        {/* Content - List View */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-start justify-between w-full">
            {/* Title and Description */}
            <div className="flex-grow pr-4">
              <Link to={detailLink} className="block mb-2 group">
                <h3 className={`text-lg font-semibold text-gray-800 group-hover:text-teal-600 transition-colors duration-200`}>
                  {annonce.title || "Untitled Request"}
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
              </div>
            </div>
            
            {/* Type badge and Contact Button */}
            <div className="flex flex-col items-end">
              <span className="inline-flex items-center bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full capitalize mb-3">
                Wanted
              </span>
              
              <button
                onClick={handleContactClick}
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap text-sm font-medium shadow-sm mt-auto"
              >
                <FaPhone className="mr-2" size={14} />
                <span>Contact</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Render contact modal */}
      <ContactModal />
    </>
  );
};

WantedItemCard.propTypes = {
  annonce: PropTypes.object.isRequired,
  viewType: PropTypes.oneOf(['grid', 'list'])
};

export default WantedItemCard; 