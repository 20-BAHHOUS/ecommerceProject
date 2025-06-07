import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaImage, FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope, FaExclamationCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { parseImages } from "../../../utils/parseImages";
import moment from 'moment';
import axiosInstance from "../../../utils/axiosInstance";
import API_PATHS from "../../../utils/apiPaths";

const WantedItemCard = ({ annonce = {} }) => { // Changed default to empty object for safety
  const [isHovered, setIsHovered] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [userError, setUserError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Early return if announcement is invalid or not a wanted type
  if (!annonce || annonce.type !== "wanted") {
    console.log("Card skipped - not a wanted item or invalid", annonce?.type);
    return null;
  }

  // Effect to fetch user info when modal opens
  useEffect(() => {
    if (contactModalOpen) {
      // If createdBy is already populated with user data, use it directly
      if (annonce.createdBy && typeof annonce.createdBy === 'object' && annonce.createdBy.fullName) {
        console.log("Using populated user data:", annonce.createdBy);
        setUserInfo(annonce.createdBy);
      } 
      // Otherwise fetch user data if we have the ID
      else if (annonce.createdBy) {
        const userId = typeof annonce.createdBy === 'object' ? annonce.createdBy._id : annonce.createdBy;
        if (userId) {
          fetchUserInfo(userId);
        } else {
          setUserError("User ID not available");
        }
      } else {
        setUserError("No user information available");
      }
    }
  }, [contactModalOpen, annonce.createdBy]);

  // Function to fetch user info
  const fetchUserInfo = async (userId) => {
    setLoadingUser(true);
    setUserError(null);

    try {
      console.log("Fetching user info for ID:", userId);
      // Try to get the announcement with populated user data
      const response = await axiosInstance.get(API_PATHS.ANNONCE.ANNONCE_BY_ID(annonce._id));
      
      if (response.data && response.data.createdBy) {
        console.log("Got user data from announcement:", response.data.createdBy);
        setUserInfo(response.data.createdBy);
      } else {
        setUserError("User information not available");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUserError("Failed to load user information");
      
      // If we already have some basic user info from the annonce object, use that
      if (annonce.createdBy && typeof annonce.createdBy === 'object') {
        setUserInfo({
          _id: annonce.createdBy._id,
          fullName: annonce.createdBy.fullName || "Unknown User",
        });
      }
    } finally {
      setLoadingUser(false);
    }
  };

  const hasValidImages = annonce.images &&
    Array.isArray(annonce.images) &&
    annonce.images.length > 0;

  const images = hasValidImages ? annonce.images : [];

  const detailLink = annonce._id ? `/annonces/${annonce._id}` : "#";

  const timeAgo = annonce.createdAt
    ? moment(annonce.createdAt).fromNow()
    : "Recently";

  const formattedDate = annonce.createdAt
    ? moment(annonce.createdAt).format('MMMM D, YYYY [at] h:mm A')
    : "Unknown date";

  const handleContactClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setContactModalOpen(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }
  };

  // Contact modal component
  const ContactModal = () => {
    if (!contactModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full border border-gray-200 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">User Information</h3>
            <button 
              onClick={() => setContactModalOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {loadingUser ? (
            <div className="text-center py-6">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading user information...</p>
            </div>
          ) : userError ? (
            <div className="text-center py-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <FaExclamationCircle className="text-red-500 text-3xl mx-auto mb-2" />
                <p className="text-gray-800">{userError}</p>
              </div>
            </div>
          ) : userInfo ? (
            <>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-center">
                  <div className="bg-teal-100 p-3 rounded-full">
                    <FaUser className="text-teal-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">{userInfo.fullName}</h4>
                    <p className="text-sm text-gray-500">User</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {userInfo.email && (
                  <div className="p-3 border border-gray-200 rounded-lg bg-white">
                    <div className="flex items-center mb-2">
                      <FaEnvelope className="text-blue-600 mr-2" />
                      <p className="font-medium text-gray-700">Email</p>
                    </div>
                    <p className="text-gray-800 break-all pl-6">
                      {userInfo.email}
                    </p>
                  </div>
                )}
                
                {userInfo.phone && (
                  <div className="p-3 border border-gray-200 rounded-lg bg-white">
                    <div className="flex items-center mb-2">
                      <FaPhone className="text-green-600 mr-2" />
                      <p className="font-medium text-gray-700">Phone</p>
                    </div>
                    <p className="text-gray-800 pl-6">
                      {userInfo.phone}
                    </p>
                  </div>
                )}
                
                {!userInfo.email && !userInfo.phone && (
                  <div className="text-center py-6">
                    <div className="bg-yellow-50 p-3 rounded-lg inline-block mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <p className="text-gray-600">No contact information available for this user.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600">User information is unavailable.</p>
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setContactModalOpen(false)}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row h-auto md:h-[280px] relative overflow-hidden w-full group" // Added group for hover effects
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Section */}
        <div className="relative w-full md:w-2/5 overflow-hidden flex-shrink-0 rounded-t-2xl md:rounded-l-2xl md:rounded-t-none">
          <div className="h-full relative">
            {(!hasValidImages || imageError) ? (
              <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-t-2xl md:rounded-l-2xl md:rounded-t-none">
                <FaImage className="text-6xl text-gray-300" />
              </div>
            ) : (
              <>
                <img
                  className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
                  src={parseImages(images[currentImageIndex])}
                  alt={annonce.title || "Wanted item"}
                  onError={handleImageError}
                  loading="lazy"
                />

                {/* Image Navigation - Only show if multiple images */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-label="Previous image"
                    >
                      <FaChevronLeft size={18} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-label="Next image"
                    >
                      <FaChevronRight size={18} />
                    </button>

                    {/* Image counter */}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}

                {/* Time badge on image bottom corner */}
                {timeAgo && (
                  <div className="absolute top-3 right-3 bg-teal-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-md">
                    {timeAgo}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow w-full md:w-3/5">
          <div className="flex flex-col h-full">
            {/* Title and Contact Button Row */}
            <div className="flex justify-between items-start mb-4">
              <Link to={detailLink} className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 hover:text-teal-700 transition-colors duration-200 leading-tight pr-4">
                  {annonce.title || "Untitled Request"}
                </h3>
              </Link>

              {/* Contact Button */}
              <button
                onClick={handleContactClick}
                className="inline-flex items-center px-5 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all duration-300 whitespace-nowrap text-md font-semibold shadow-md transform hover:scale-105 flex-shrink-0"
              >
                <FaPhone className="mr-2 text-lg" />
                <span>Contact</span>
              </button>
            </div>

            {/* Description */}
            {annonce.description && (
              <div className="mb-4 flex-grow">
                <p className="text-gray-600 text-base line-clamp-3"> {/* Added line-clamp for truncation */}
                  {annonce.description}
                </p>
              </div>
            )}

            <div className="mt-auto pt-4 border-t border-gray-100">
              {/* Location */}
              {annonce.location && (
                <div className="flex items-center text-gray-600 text-sm">
                  <FaMapMarkerAlt className="mr-2 text-teal-500" size={16} />
                  <span className="font-medium">{annonce.location}</span>
                </div>
              )}
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
};

export default WantedItemCard;