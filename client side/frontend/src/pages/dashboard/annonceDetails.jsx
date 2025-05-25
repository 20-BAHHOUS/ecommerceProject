/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  FaMapMarkerAlt,
  FaTag,
  FaBoxOpen,
  FaSpinner,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaClock,
  FaUser,
  FaShoppingCart,
  FaImage
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { parseImages, markImageAsFailed } from "../../utils/parseImages";
import { toast } from "react-toastify";
import moment from 'moment';
import Navbar from "../../components/layouts/inputs/header";
import AnnouncementOrderModal from "../../components/common/AnnouncementOrderModal";
import NegotiablePriceModal from "../../components/common/NegotiablePriceModal";

const formatPrice = (price) => {
  const numericPrice = Number(price);
  if (isNaN(numericPrice)) {
    return "Invalid Price";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "DZD", // Assuming Algerian Dinar based on previous context
  }).format(numericPrice);
};

const AnnonceDetail = () => {
  const { id: annonceId } = useParams();
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [hasPlacedOrder, setHasPlacedOrder] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [mainImageError, setMainImageError] = useState(false);
  const [thumbnailErrors, setThumbnailErrors] = useState({});
  const [userInfo, setUserInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNegotiablePriceModalOpen, setIsNegotiablePriceModalOpen] = useState(false);

  // Add function to check existing order
  const checkExistingOrder = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.ORDER.GET_ORDERS_BY_BUYER);
      const orders = response.data.data;
      const existingOrder = orders.find(order => order.annonce?._id === annonceId);
      
      if (existingOrder) {
        setHasPlacedOrder(true);
        setOrderStatus(existingOrder.status);
      }
    } catch (error) {
      // Silently handle error
    }
  };
  
  // Check if announcement is in favorites
  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axiosInstance.get(API_PATHS.AUTH.CHECK_FAVORITE(annonceId));
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  // Fetch user info for location comparison
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const userResponse = await axiosInstance.post(API_PATHS.AUTH.GET_USER_INFO);
      if (userResponse && userResponse.data) {
        console.log("User location:", userResponse.data.location);
        setUserInfo(userResponse.data);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    if (!annonceId) {
      setError("Announcement ID is missing.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(
          API_PATHS.ANNONCE.ANNONCE_BY_ID(annonceId)
        );
        
        // Debug the images array
        if (response.data.images) {
          console.log("Image paths from API:", response.data.images);
        }
        
        setAnnonce(response.data);
        console.log("Annonce location:", response.data.location);
        
        // Check for existing order if user is logged in
        if (localStorage.getItem("token")) {
          await checkExistingOrder();
          await checkFavoriteStatus();
          // Fetch user info to compare locations
          await fetchUserInfo();
        }
      } catch (err) {
        if (err.response) {
          // Don't handle 401 errors specially - allow viewing without login
          setError(
            `Error ${err.response.status}: ${
              err.response.data?.message ||
              err.response.data?.error ||
              "Failed to load announcement."
            }`
          );
        } else if (err.request) {
          setError("Network Error: Could not connect to the server.");
        } else {
          setError(`Error: ${err.message || "Failed to load announcement."}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [annonceId]);

  const handlePlaceOrder = () => {
    // Check if user is logged in first
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to place an order");
      // Redirect to login page with return URL
      const returnUrl = encodeURIComponent(window.location.pathname);
      window.location.href = `/login?redirect=${returnUrl}`;
      return;
    }

    // Check if user is trying to order their own announcement
    const userId = localStorage.getItem("userId");
    if (annonce.createdBy && userId && annonce.createdBy.toString() === userId.toString()) {
      setIsModalOpen(true);
      return;
    }

    // Open the negotiable price modal
    setIsNegotiablePriceModalOpen(true);
  };

  const handleSubmitOrder = async (negotiablePrice = null) => {
    setIsOrderLoading(true);
    try {      
      // Create order payload
      const orderPayload = {
        annonceId,
        buyerId: localStorage.getItem("userId"),
        sellerId: annonce.createdBy
      };
      
      // Add negotiable price if provided
      if (negotiablePrice) {
        orderPayload.negotiablePrice = negotiablePrice;
      }
      
      const response = await axiosInstance.post(
        API_PATHS.ORDER.PLACE_ORDER,
        orderPayload
      );

      if (response.data.success) {
        toast.success(response.data.message || "Order placed successfully!");
        // Redirect to orders page after successful order placement
        window.location.href = "/user-orders";
      } else {
        throw new Error(response.data.message || "Failed to place order");
      }
    } catch (error) {
      // Handle specific error cases
      if (error.response?.data?.errorCode === "SELF_ORDER") {
        setIsModalOpen(true);
      } else if (error.response?.data?.errorCode === "DUPLICATE_ORDER") {
        toast.error("You have already placed an order for this announcement");
      } else if (error.response?.data?.errorCode === "MISSING_SELLER") {
        toast.error("This announcement cannot be ordered at this time");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Could not place order. Please try again later.");
      }
    } finally {
      setIsOrderLoading(false);
    }
  };

  // Handle main image error
  const handleMainImageError = () => {
    console.error('Main image failed to load:', annonce?.images?.[currentImageIndex]);
    setMainImageError(true);
    if (annonce?.images && annonce.images.length > 0) {
      markImageAsFailed(annonce.images[currentImageIndex]);
    }
  };

  // Handle thumbnail image error
  const handleThumbnailError = (index) => {
    setThumbnailErrors(prev => ({
      ...prev,
      [index]: true
    }));
    if (annonce?.images && annonce.images[index]) {
      markImageAsFailed(annonce.images[index]);
    }
  };

  // Using useMemo to avoid recalculating these values on every render
  const { isOwner, displayImage, hasImages, imagesArray, isLocationMatch } = useMemo(() => {
    // Check if the current user is the owner of the annonce
    const userId = localStorage.getItem("userId");
    const hasCreatedBy = !!annonce?.createdBy;
    const hasUserId = !!userId;

    // Only consider the user the owner if both values exist and are equal
    const isOwnerValue = hasCreatedBy && hasUserId && annonce?.createdBy.toString() === userId.toString();

    // Check if location matches user's location - with better comparison
    const isLocationMatchValue = userInfo?.location && 
                                annonce?.location && 
                                userInfo.location.toLowerCase().trim() === annonce.location.toLowerCase().trim();

    // Validate images array
    const validImages = annonce?.images &&
                        Array.isArray(annonce.images) &&
                        annonce.images.length > 0;

    // Create safe image display path - use placeholder if there's an error
    let currentImage = '/placeholder-image.png';
    if (!mainImageError && validImages && typeof annonce.images[currentImageIndex] === 'string') {
      currentImage = parseImages(annonce.images[currentImageIndex]);
    }

    return {
      isOwner: isOwnerValue,
      displayImage: currentImage,
      hasImages: validImages,
      imagesArray: validImages ? annonce.images : [],
      isLocationMatch: isLocationMatchValue
    };
  }, [annonce, currentImageIndex, mainImageError, userInfo]);

  const handleNextImage = () => {
    if (imagesArray.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesArray.length);
      setMainImageError(false); // Reset error state when changing image
    }
  };

  const handlePrevImage = () => {
    if (imagesArray.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imagesArray.length) % imagesArray.length);
      setMainImageError(false); // Reset error state when changing image
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
    setMainImageError(false); // Reset error state when changing image
  };

  const handleFavoriteToggle = async () => {
    // Check if user is logged in first
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to save favorites");
      // Redirect to login page with return URL
      const returnUrl = encodeURIComponent(window.location.pathname);
      window.location.href = `/login?redirect=${returnUrl}`;
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.TOGGLE_FAVORITE, {
        annonceId
      });
      
      setIsFavorite(response.data.isFavorite);
      toast.success(response.data.isFavorite ? "Added to favorites" : "Removed from favorites");
      
      // Notify other components about the favorites update
      localStorage.setItem("favoritesUpdated", Date.now().toString());
      localStorage.removeItem("favoritesUpdated"); // Immediately remove to allow future updates
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Could not update favorites. Please try again later.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
          <FaSpinner className="animate-spin text-4xl mb-4 text-teal-600" />
          <p className="text-lg text-gray-700 font-medium">Loading announcement details...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
          <FaExclamationTriangle className="text-5xl mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all duration-200">
            Return to Home
          </Link>
        </div>
      </>
    );
  }

  if (!annonce) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
          <FaExclamationTriangle className="text-5xl mb-4 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Announcement not found</h2>
          <Link to="/" className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all duration-200">
            Return to Home
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Navigation */}
          <nav className="mb-8">
            <Link to="/" className="text-teal-600 hover:text-teal-700 font-medium flex items-center">
              <FaChevronLeft className="mr-2" />
              Back to Listings
            </Link>
          </nav>

          {/* Main Content */}
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Gallery Section */}
              <div className="p-6 space-y-4">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                  {mainImageError ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <FaImage className="text-6xl text-gray-300" />
                    </div>
                  ) : (
                    <img
                      src={displayImage}
                      alt={annonce.title}
                      className="w-full h-full object-contain"
                      onError={handleMainImageError}
                      loading="lazy"
                    />
                  )}
                  {hasImages && imagesArray.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
                      >
                        <FaChevronRight />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {hasImages && imagesArray.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {imagesArray.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                          currentImageIndex === index
                            ? 'ring-2 ring-teal-500'
                            : 'ring-1 ring-gray-200'
                        }`}
                      >
                        {thumbnailErrors[index] ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-50">
                            <FaImage className="text-2xl text-gray-300" />
                          </div>
                        ) : (
                          <img
                            src={parseImages(img)}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={() => handleThumbnailError(index)}
                            loading="lazy"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Information Section */}
              <div className="p-6 lg:p-8 flex flex-col h-full">
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                      {annonce.title}
                    </h1>
                    <button
                      onClick={handleFavoriteToggle}
                      className={`p-2 rounded-full ${
                        isFavorite
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      } transition-all duration-300`}
                    >
                      <FaHeart className={isFavorite ? 'fill-current' : ''} />
                    </button>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-teal-600">
                      {formatPrice(annonce.price)}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {annonce.description || "No description provided."}
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <DetailItem
                        icon={<FaTag />}
                        label="Category"
                        value={annonce.category && annonce.subcategory 
                          ? `${annonce.category.name} › ${annonce.subcategory.name}`
                          : "Not specified"}
                      />
                      <DetailItem
                        icon={<FaBoxOpen />}
                        label="Condition"
                        value={annonce.condition}
                      />
                      <DetailItem
                        icon={<FaMapMarkerAlt />}
                        label="Location"
                        value={annonce.location || "Not specified"}
                        highlight={isLocationMatch}
                      />
                      <DetailItem
                        icon={<FaClock />}
                        label="Posted"
                        value={moment(annonce.createdAt).fromNow()}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-4">
                  {!isOwner && (
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isOrderLoading || hasPlacedOrder}
                      className={`w-full flex items-center justify-center gap-3 px-8 py-4 
                        ${isOrderLoading 
                          ? 'bg-teal-400 cursor-not-allowed' 
                          : hasPlacedOrder
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800'
                        } 
                        text-white rounded-xl transition-all duration-300 transform hover:scale-[1.02]
                        relative overflow-hidden group`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r 
                        ${!hasPlacedOrder ? 'from-teal-600/0 via-teal-500/30 to-teal-600/0' : ''} 
                        transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000`}>
                      </div>
                      <div className="relative flex items-center gap-3">
                        {isOrderLoading ? (
                          <>
                            <FaSpinner className="animate-spin text-xl" />
                            <span className="font-medium">Processing...</span>
                          </>
                        ) : hasPlacedOrder ? (
                          <>
                            <FaShoppingCart className="text-xl" />
                            <span className="font-medium">
                              {orderStatus === 'pending' ? 'Order Pending' :
                               orderStatus === 'accepted' ? 'Order Accepted' :
                               orderStatus === 'rejected' ? 'Order Rejected' :
                               'Order Placed'}
                            </span>
                          </>
                        ) : (
                          <>
                            <FaShoppingCart className="text-xl" />
                            <span className="font-medium">Place Order</span>
                          </>
                        )}
                      </div>
                    </button>
                  )}
                  {annonce.phone && (
                    <a
                      href={`tel:${annonce.phone}`}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 
                        bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 
                        transition-all duration-200 font-medium"
                    >
                      Contact Seller
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal component positioned outside of other containers */}
      <AnnouncementOrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Negotiable Price Modal */}
      <NegotiablePriceModal
        isOpen={isNegotiablePriceModalOpen}
        onClose={() => setIsNegotiablePriceModalOpen(false)}
        onSubmit={handleSubmitOrder}
        originalPrice={annonce?.price || 0}
      />
    </>
  );
};

const DetailItem = ({ icon, label, value, highlight = false }) => (
  <div className={`flex items-start gap-3 p-3 rounded-lg ${
    highlight ? 'bg-teal-50 border border-teal-200' : 'bg-gray-50'
  } transition-colors duration-300`}>
    <div className={highlight ? 'text-teal-600' : 'text-teal-600'}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`font-medium ${highlight ? 'text-teal-700' : 'text-gray-900'}`}>
        {value}
        {highlight && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800">
            Your location
          </span>
        )}
      </p>
    </div>
  </div>
);

DetailItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  highlight: PropTypes.bool,
};

export default AnnonceDetail;