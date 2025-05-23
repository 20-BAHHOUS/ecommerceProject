import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  FaMapMarkerAlt,
  FaTag,
  FaInfoCircle,
  FaBoxOpen,
  FaSpinner,
  FaExclamationTriangle,
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
        console.error("Error fetching announcement details:", err);
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
    try {
      const response = await axiosInstance.post(
        API_PATHS.ORDER.ADD_GET_ORDER,
        { annonceId: annonceId }
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.response?.data?.message || "Could not place order.");
    }
  };

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

  const hasImages = annonce.images && annonce.images.length > 0;
  const displayImage = hasImages
    ? parseImages(annonce.images[currentImageIndex])
    : "/placeholder-image.png";

  const handleNextImage = () =>
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % annonce.images.length
    );
  const handlePrevImage = () =>
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + annonce.images.length) % annonce.images.length
    );

  return (
    <div className="max-w-7xl mx-auto bg-gray-50 shadow-xl rounded-lg overflow-hidden my-10 ">
      <div className="md:flex">
        {/* Image Section */}
        <div className="md:w-1/2 relative">
          <img
            className="h-64 w-full object-cover md:h-full"
            src={displayImage}
            alt={annonce.title || "Announcement image"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-image.png";
            }}
          />
          {hasImages && annonce.images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
              >
                &#10094;
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
              >
                &#10095;
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {currentImageIndex + 1} / {annonce.images.length}
              </div>
            </>
          )}
        </div>

        <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {annonce.title}
            </h1>

            <p className="text-gray-600 mb-4 text-base">
              {annonce.description || "No description provided."}
            </p>

            <div className="mb-5">
              <span className="text-3xl font-extrabold text-indigo-600">
                {formatPrice(annonce.price)}
              </span>
            </div>


            <div className="space-y-3 text-sm text-gray-700">
              <DetailItem
                icon={<FaTag className="text-indigo-500" />}
                label="Category"
                value={annonce.category}
              />
              <DetailItem
                icon={<FaInfoCircle className="text-indigo-500" />}
                label="Condition"
                value={annonce.condition}
              />
              <DetailItem
                icon={<FaBoxOpen className="text-indigo-500" />}
                label="Type"
                value={annonce.type}
              />
              <DetailItem
                icon={<FaMapMarkerAlt className="text-indigo-500" />}
                label="Location"
                value={annonce.location}
              />
             
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
              Contact Seller
            </button>
            <button
              onClick={handlePlaceOrder}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
            >
              Place an order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2">
    <span className="flex-shrink-0 w-5 h-5">{icon}</span>
    <span className="font-semibold">{label}:</span>
    <span>{value}</span>
  </div>
);

export default AnnonceDetail;

DetailItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
