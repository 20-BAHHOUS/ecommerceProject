/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  FaMapMarkerAlt,
  FaTag,
  FaInfoCircle,
  FaBoxOpen,
  FaSpinner,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaClock,
  FaUser,
  FaShoppingCart,
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { parseImages } from "../../utils/parseImages";
import { toast } from "react-toastify";
import moment from 'moment';

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
      console.error("Error checking existing order:", error);
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
        setAnnonce(response.data);
        
        // Check for existing order if user is logged in
        if (localStorage.getItem("token")) {
          await checkExistingOrder();
        }
      } catch (err) {
        if (err.response) {
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

  const handlePlaceOrder = async () => {
    // Check if user is logged in first
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to place an order");
      // Redirect to login page with return URL
      const returnUrl = encodeURIComponent(window.location.pathname);
      window.location.href = `/login?redirect=${returnUrl}`;
      return;
    }

    setIsOrderLoading(true);
    try {
      // Log the auth token before making the request
      console.log("Auth Token:", localStorage.getItem("token"));
      
      // Create a more complete order payload
      const orderPayload = {
        annonceId,
        buyerId: localStorage.getItem("userId"),
        sellerId: annonce.createdBy,
        price: annonce.price,
        status: "pending"
      };

      console.log("Sending order payload:", orderPayload);
      
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
      // Enhanced error logging
      console.error("Detailed Error Information:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestConfig: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });

      // Handle specific error cases
      if (error.response?.data?.errorCode === "SELF_ORDER") {
        toast.error("You cannot place an order on your own announcement");
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

  // Using useMemo to avoid recalculating these values on every render
  const { isOwner, displayImage, hasImages, imagesArray } = useMemo(() => {
    // Check if the current user is the owner of the annonce
    const userId = localStorage.getItem("userId");
    const hasCreatedBy = !!annonce?.createdBy;
    const hasUserId = !!userId;

    // Only consider the user the owner if both values exist and are equal
    const isOwnerValue = hasCreatedBy && hasUserId && annonce?.createdBy.toString() === userId.toString();

    // Validate images array
    const validImages = annonce?.images &&
                        Array.isArray(annonce.images) &&
                        annonce.images.length > 0;

    // Create safe image display path
    let currentImage = "/placeholder-image.png";
    if (validImages && typeof annonce.images[currentImageIndex] === 'string') {
      try {
        currentImage = parseImages(annonce.images[currentImageIndex]);
      } catch (err) {
        currentImage = "/placeholder-image.png";
      }
    }

    return {
      isOwner: isOwnerValue,
      displayImage: currentImage,
      hasImages: validImages,
      imagesArray: validImages ? annonce.images : []
    };
  }, [annonce, currentImageIndex]);

  const handleNextImage = () => {
    if (imagesArray.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesArray.length);
    }
  };

  const handlePrevImage = () => {
    if (imagesArray.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imagesArray.length) % imagesArray.length);
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    // Add your favorite logic here
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-blue-50 flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-4xl mb-4 text-teal-600" />
        <p className="text-lg text-gray-700 font-medium">Loading announcement details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-blue-50 flex flex-col items-center justify-center p-4 text-center">
        <FaExclamationTriangle className="text-5xl mb-4 text-red-500" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link to="/" className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all duration-200">
          Return to Home
        </Link>
      </div>
    );
  }

  if (!annonce) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-blue-50 flex flex-col items-center justify-center">
        <FaExclamationTriangle className="text-5xl mb-4 text-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Announcement not found</h2>
        <Link to="/" className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all duration-200">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <nav className="mb-8">
          <Link to="/" className="text-teal-600 hover:text-teal-700 font-medium flex items-center">
            <FaChevronLeft className="mr-2" />
            Back to Listings
          </Link>
        </nav>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery Section */}
            <div className="p-6 space-y-4">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={displayImage}
                  alt={annonce.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.png";
                  }}
                />
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
                      <img
                        src={parseImages(img)}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
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
                      shadow-lg hover:shadow-xl
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
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
    <div className="text-teal-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

DetailItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default AnnonceDetail;