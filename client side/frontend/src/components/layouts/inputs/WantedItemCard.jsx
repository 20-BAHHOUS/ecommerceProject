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
    if (contactModalOpen && annonce.createdBy?._id) { // Fetch user info from annonce.createdBy
      fetchUserInfo(annonce.createdBy._id);
    }
  }, [contactModalOpen, annonce.createdBy?._id]); // Add annonce.createdBy._id to dependency array

  // Function to fetch user info
  const fetchUserInfo = async (userId) => {
    setLoadingUser(true);
    setUserError(null);

    try {
      // Assuming there's an API endpoint to fetch user by ID
      const response = await axiosInstance.get(API_PATHS.USER.GET_USER_BY_ID(userId));

      if (response.data) {
        setUserInfo(response.data);
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
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-7 max-w-md w-full border border-gray-200 shadow-2xl transform transition-all duration-300 scale-95 animate-zoom-in-bounce">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-extrabold text-gray-800">Contact Details</h3>
            <button
              onClick={() => setContactModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors duration-200"
              aria-label="Close contact modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loadingUser ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600 font-medium text-lg">Loading contact information...</p>
            </div>
          ) : userError ? (
            <div className="text-center py-8">
              <div className="bg-red-50 p-6 rounded-xl flex flex-col items-center">
                <FaExclamationCircle className="text-red-500 text-5xl mx-auto mb-4" />
                <p className="text-gray-800 font-semibold text-lg">{userError}</p>
                <p className="text-gray-600 mt-2">Please try again later or check your internet connection.</p>
              </div>
            </div>
          ) : userInfo ? (
            <div className="space-y-4">
              <div className="flex items-center pb-4 border-b border-gray-100">
                <div className="bg-teal-100 p-3 rounded-full shadow-md">
                  <FaUser className="text-teal-600 text-2xl" />
                </div>
                <div className="ml-5">
                  <h4 className="font-bold text-gray-900 text-xl">{userInfo.fullName || "N/A"}</h4>
                  {userInfo.username && <p className="text-gray-500 text-sm">@{userInfo.username}</p>}
                </div>
              </div>

              {userInfo.email && (
                <div className="flex items-center bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaEnvelope className="text-blue-600" size={18} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-700">Email Address</p>
                    <a href={`mailto:${userInfo.email}`} className="text-blue-600 hover:underline break-all text-lg font-semibold">
                      {userInfo.email}
                    </a>
                  </div>
                </div>
              )}

              {userInfo.phone && (
                <div className="flex items-center bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FaPhone className="text-green-600" size={18} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-700">Phone Number</p>
                    <a href={`tel:${userInfo.phone}`} className="text-green-600 hover:underline font-semibold text-lg">
                      {userInfo.phone}
                    </a>
                  </div>
                </div>
              )}

              {userInfo.location && (
                <div className="flex items-center bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FaMapMarkerAlt className="text-purple-600" size={18} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p className="text-gray-800 text-lg font-semibold">
                      {userInfo.location}
                    </p>
                  </div>
                </div>
              )}

              {!userInfo.email && !userInfo.phone && !userInfo.location && (
                <div className="text-center py-6 px-4 bg-yellow-50 rounded-xl mt-4">
                  <FaExclamationCircle className="text-yellow-500 text-3xl mx-auto mb-3" />
                  <p className="text-gray-700 font-medium text-md">This user has not provided any public contact information.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">User contact information is unavailable.</p>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setContactModalOpen(false)}
              className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all duration-300 font-bold shadow-lg transform hover:scale-105"
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