// client side/frontend/src/pages/dashboard/annonceDetails.jsx

import React from "react";
import PropTypes from "prop-types";
// Removed motion import
import {
  FaMapMarkerAlt,
  FaTag,
  FaInfoCircle,
  FaBoxOpen,
  FaUser,
} from "react-icons/fa"; // Example icons

// Helper function to format price (customize as needed)
const formatPrice = (price) => {
  // Added a check for valid number input
  const numericPrice = Number(price);
  if (isNaN(numericPrice)) {
    return 'Invalid Price';
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "DZD", // Assuming Algerian Dinar based on previous context
  }).format(numericPrice);
};

const AnnonceDetail = ({ annonce }) => {
  if (!annonce) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-lg">Announcement not found</p>
      </div>
    );
  }

  // Removed animation variants variables

  const hasImages = annonce.images && annonce.images.length > 0;
  const displayImage = hasImages ? annonce.images[0] : "/placeholder-image.png"; // Provide a fallback placeholder image path

  return (
    // Replaced motion.div with div, removed animation props
    <div
      className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden my-8"
    >
      <div className="md:flex">
        {/* Image Section */}
        {/* Replaced motion.div with div, removed animation props */}
        <div className="md:w-1/2">
          <img
            className="h-64 w-full object-cover md:h-full" // Adjust height as needed
            src={displayImage}
            alt={annonce.title || "Announcement image"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-image.png";
            }} // Handle image load error
          />
          {/* Optional: Add image carousel controls here if multiple images */}
        </div>

        {/* Details Section */}
        {/* Replaced motion.div with div, removed animation props */}
        <div
          className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between"
        >
          <div>
            {/* Replaced motion.h1 with h1, removed animation props */}
            <h1
              className="text-3xl font-bold text-gray-900 mb-3"
            >
              {annonce.title}
            </h1>

            {/* Replaced motion.p with p, removed animation props */}
            <p
              className="text-gray-600 mb-4 text-base"
            >
              {annonce.description || "No description provided."}
            </p>

            {/* Replaced motion.div with div, removed animation props */}
            <div className="mb-5">
              <span className="text-3xl font-extrabold text-indigo-600">
                {formatPrice(annonce.price)}
              </span>
            </div>

            {/* Replaced motion.div with div, removed animation props */}
            <div
              className="space-y-3 text-sm text-gray-700"
            >
              {/* DetailItem component updated below */}
              <DetailItem
                icon={<FaTag className="text-indigo-500" />}
                label="Category"
                value={annonce.category}
              />
              <DetailItem
                icon={<FaInfoCircle className="text-indigo-500" />}
                label="Condition"
                // Use correct spelling 'condition' based on previous fixes
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
              {annonce.createdBy && (
                <DetailItem
                  icon={<FaUser className="text-indigo-500" />}
                  // Displaying createdBy ID. Consider populating user info on backend if needed.
                  label="Seller ID"
                  value={typeof annonce.createdBy === 'object' ? annonce.createdBy._id : annonce.createdBy}
                />
              )}
            </div>
          </div>

          {/* Action Buttons (Example) */}
          {/* Replaced motion.div with div, removed animation props */}
          <div
            className="mt-6 pt-4 border-t border-gray-200"
          >
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
              Contact Seller
            </button>
            {/* Add other actions like 'Add to Wishlist' if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for detail items - Updated
const DetailItem = ({ icon, label, value }) => (
  // Replaced motion.div with div, removed animation props
  <div
    className="flex items-center space-x-2"
  >
    <span className="flex-shrink-0 w-5 h-5">{icon}</span>
    <span className="font-semibold">{label}:</span>
    <span>{value || 'N/A'}</span> {/* Added fallback for missing values */}
  </div>
);

// PropTypes for type checking
AnnonceDetail.propTypes = {
  annonce: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    condition: PropTypes.string.isRequired, // Use correct spelling
    type: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    // createdBy could be string ID or populated object
    createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
};

// Default props for fallback
AnnonceDetail.defaultProps = {
  annonce: null,
};

export default AnnonceDetail;
