import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaImage, FaClock, FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope, FaExclamationCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { parseImages } from "../../../utils/parseImages";
import moment from 'moment';
import axiosInstance from "../../../utils/axiosInstance";
import API_PATHS from "../../../utils/apiPaths";


const WantedItemCard = ({ annonce= 'grid' }) => {
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
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-6 max-w-md w-full border border-gray-200 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-gray-800">Contact Buyer</h3>
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
              {/* Item Details */}
              <div className="mb-5 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Looking for:</h4>
                <p className="text-gray-900 font-semibold">{annonce.title}</p>
                {annonce.description && (
                  <p className="text-gray-600 mt-2 text-sm">{annonce.description}</p>
                )}
              </div>
              
              {/* User Info Card */}
              <div className="bg-white border border-gray-200 rounded-xl mb-5 overflow-hidden">
                <div className="bg-teal-600 p-4 text-white">
                  <h4 className="font-semibold text-lg">Contact Information</h4>
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-4">
                    <div className="bg-teal-100 p-3 rounded-full shadow-sm">
                      <FaUser className="text-teal-600 text-xl" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-900 text-lg">{userInfo.fullName || "N/A"}</h4>
                      <p className="text-sm text-gray-600">Member since {userInfo.createdAt ? moment(userInfo.createdAt).format('MMMM YYYY') : 'N/A'}</p>
                    </div>
                  </div>

                  {/* Contact Methods */}
                  <div className="space-y-3 mt-4">
                    {/* Email section */}
                    {userInfo.email && (
                      <div className="flex items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <FaEnvelope className="text-blue-600" size={16} />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-700">Email</p>
                          <a href={`mailto:${userInfo.email}`} className="text-blue-600 hover:underline break-all">
                            {userInfo.email}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {/* Phone section */}
                    {userInfo.phone && (
                      <div className="flex items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="bg-green-100 p-2 rounded-full">
                          <FaPhone className="text-green-600" size={16} />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-700">Phone</p>
                          <a href={`tel:${userInfo.phone}`} className="text-green-600 hover:underline font-medium">
                            {userInfo.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {/* Location section */}
                    {annonce.location && (
                      <div className="flex items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="bg-teal-100 p-2 rounded-full">
                          <FaMapMarkerAlt className="text-teal-600" size={16} />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-700">Location</p>
                          <p className="text-gray-800">
                            {annonce.location}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {!userInfo.email && !userInfo.phone && (
                    <div className="text-center py-5 px-4 bg-yellow-50 rounded-lg mt-4">
                      <FaExclamationCircle className="text-yellow-500 text-2xl mx-auto mb-2" />
                      <p className="text-gray-700 font-medium">This user has not provided any contact information.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                <p>Posted on {formattedDate}</p>
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

  // List view card (default for wanted items)
  return (
    <>
      <div 
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row h-[220px] relative overflow-hidden w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Section - Larger size */}
        <div className="relative w-full md:w-2/5 overflow-hidden">
          <div className="h-full relative">
            {(!hasValidImages || imageError) ? (
              <div className="flex items-center justify-center h-full w-full bg-gray-50">
                <FaImage className="text-5xl text-gray-300" />
              </div>
            ) : (
              <>
                <img
                  className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
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
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10"
                    >
                      <FaChevronLeft size={16} />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10"
                    >
                      <FaChevronRight size={16} />
                    </button>
                    
                    {/* Image counter */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </>
            )}
            
            {/* Time badge on image bottom corner */}
            {timeAgo && (
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {timeAgo}
              </div>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex flex-col h-full">
            {/* Title and Contact Button Row */}
            <div className="flex justify-between items-start mb-3">
              <Link to={detailLink} className="group flex-1">
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-teal-600 transition-colors duration-200 pr-3">
                  {annonce.title || "Untitled Request"}
                </h3>
              </Link>
              
              {/* Contact Button - Right aligned */}
              <button
                onClick={handleContactClick}
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap text-sm font-medium shadow-sm flex-shrink-0"
              >
                <FaPhone className="mr-2" size={14} />
                <span>Contact</span>
              </button>
            </div>
            
            {/* Description */}
            {annonce.description && (
              <div className="mb-4">
                <p className="text-gray-600">
                  {annonce.description}
                </p>
              </div>
            )}
            
            <div className="mt-auto pt-3 border-t border-gray-100">
              {/* Location */}
              {annonce.location && (
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2 text-teal-500" size={16} />
                  <span>{annonce.location}</span>
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
  viewType: PropTypes.oneOf(['grid', 'list'])
};

export default WantedItemCard; 