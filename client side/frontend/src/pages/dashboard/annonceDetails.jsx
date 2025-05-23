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
  FaChevronLeft, // Added for image navigation
  FaChevronRight, // Added for image navigation
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { parseImages } from "../../utils/parseImages";
import { toast } from "react-toastify";

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

  useEffect(() => {
    if (!annonceId) {
      setError("Announcement ID is missing.");
      setLoading(false);
      return;
    }
    const fetchAnnonceDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(
          API_PATHS.ANNONCE.ANNONCE_BY_ID(annonceId)
        );
        setAnnonce(response.data);
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

    fetchAnnonceDetails();
  }, [annonceId]);

  const handlePlaceOrder = async () => {
    // Check if user is logged in first
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to place an order");
      // Redirect to login page
      window.location.href = "/login";
      return;
    }

    try {
      const response = await axiosInstance.post(
        API_PATHS.ORDER.PLACE_ORDER,
        { annonceId: annonceId }
      );
      toast.success(response.data.message);
      // Redirect to orders page after successful order placement
      window.location.href = "/user-orders";
    } catch (error) {
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <FaSpinner className="animate-spin text-4xl mb-4 text-indigo-500" />
        <p className="text-lg">Loading announcement details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600 p-4 text-center">
        <FaExclamationTriangle className="text-5xl mb-4" />
        <p className="text-xl font-semibold mb-2">
          Oops! Something went wrong.
        </p>
        <p className="mb-4">{error}</p>
        <Link to="/" className="text-indigo-600 hover:underline">
          Go back to Home
        </Link>
      </div>
    );
  }

  if (!annonce) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <FaExclamationTriangle className="text-5xl mb-4" />
        <p className="text-xl">Announcement not found.</p>
        <Link to="/" className="mt-4 text-indigo-600 hover:underline">
          Go back to Home
        </Link>
      </div>
    );
  }

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

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden my-10 border border-gray-200">
      <div className="md:flex">
        {/* Image Section */}
        <div className="md:w-1/2 relative bg-gray-100 flex items-center justify-center">
          <img
            className="h-96 w-full object-contain md:h-full rounded-l-xl" // object-contain ensures image fits without cropping
            src={displayImage}
            alt={annonce.title || "Announcement image"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-image.png";
            }}
            loading="lazy"
          />
          {hasImages && imagesArray.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-3 rounded-full hover:bg-opacity-60 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 z-10"
                aria-label="Previous image"
              >
                <FaChevronLeft className="text-lg" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-3 rounded-full hover:bg-opacity-60 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 z-10"
                aria-label="Next image"
              >
                <FaChevronRight className="text-lg" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white text-sm px-3 py-1.5 rounded-full font-medium">
                {currentImageIndex + 1} / {imagesArray.length}
              </div>
            </>
          )}
        </div>

        <div className="p-8 md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {annonce.title}
            </h1>

            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              {annonce.description || "No description provided."}
            </p>

            <div className="mb-6">
              <span className="text-4xl font-extrabold text-indigo-700">
                {formatPrice(annonce.price)}
              </span>
            </div>

            <div className="space-y-4 text-base text-gray-800">
              <DetailItem
                icon={<FaTag className="text-indigo-600 text-xl" />}
                label="Category"
                value={annonce.category}
              />
              <DetailItem
                icon={<FaInfoCircle className="text-indigo-600 text-xl" />}
                label="Condition"
                value={annonce.condition}
              />
              <DetailItem
                icon={<FaBoxOpen className="text-indigo-600 text-xl" />}
                label="Type"
                value={annonce.type}
              />
              <DetailItem
                icon={<FaMapMarkerAlt className="text-indigo-600 text-xl" />}
                label="Location"
                value={annonce.location}
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Contact Seller
            </button>
            {!isOwner && (
              <button
                onClick={handlePlaceOrder}
                className="w-full mt-4 bg-teal-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Place an Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <span className="flex-shrink-0">{icon}</span>
    <span className="font-semibold">{label}:</span>
    <span className="text-gray-600">{value}</span>
  </div>
);

export default AnnonceDetail;

DetailItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};