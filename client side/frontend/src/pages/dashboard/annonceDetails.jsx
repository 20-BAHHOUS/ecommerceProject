// client side/frontend/src/pages/dashboard/annonceDetails.jsx
import React from "react";
import PropTypes from "prop-types";
import {
    FaMapMarkerAlt,
    FaTag,
    FaInfoCircle,
    FaBoxOpen,
    FaUser,
    FaImage, // Icon for image gallery/placeholder
    FaCalendarAlt // Added for date
} from "react-icons/fa";

// Helper function to format price
const formatPrice = (price) => {
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
        return 'Invalid Price';
    }
    // Use Algerian locale and currency
    return new Intl.NumberFormat("fr-DZ", { // Or "ar-DZ"
        style: "currency",
        currency: "DZD",
        minimumFractionDigits: 0, // Optional: remove decimals if not needed
        maximumFractionDigits: 2,
    }).format(numericPrice);
};

// *** Helper to construct full image URL ***
const getImageUrl = (imagePath) => {
    // imagePath is stored like 'uploads/image-name.jpg'
    // Get the backend base URL (ensure it doesn't have a trailing slash)
    // Use Vite env variable or default to localhost
    const backendUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:4000").replace(/\/$/, '');
    // Combine base URL and path (ensure no double slashes)
    return `${backendUrl}/${imagePath.replace(/^\//, '')}`;
};


const AnnonceDetail = ({ annonce }) => {
    if (!annonce) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 text-lg">Announcement details loading or not found...</p>
            </div>
        );
    }

    // Check if images array exists and has items
    const hasImages = annonce.images && Array.isArray(annonce.images) && annonce.images.length > 0;
    // Use the first image or a placeholder
    const displayImage = hasImages ? getImageUrl(annonce.images[0]) : "/placeholder-image.png"; // Ensure placeholder exists in public folder

    // State for image carousel/modal (optional enhancement)
    // const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden my-8">
            <div className="md:flex">
                {/* Image Section */}
                <div className="md:w-1/2 p-4 bg-gray-50"> {/* Added padding & subtle bg */}
                    <img
                        className="h-64 w-full object-contain md:h-96 rounded-md bg-gray-100" // Use object-contain, adjust height, add rounded corners and bg
                        src={displayImage}
                        alt={annonce.title || "Announcement image"}
                        onError={(e) => {
                            console.warn(`Failed to load image: ${e.target.src}`);
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = "/placeholder-image.png"; // Fallback placeholder
                        }}
                    />
                    {/* Thumbnail gallery */}
                    {hasImages && annonce.images.length > 1 && (
                        <div className="mt-4 flex space-x-2 overflow-x-auto p-1">
                            {annonce.images.map((imgPath, index) => (
                                <img
                                    key={index}
                                    src={getImageUrl(imgPath)}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-16 h-16 object-cover rounded cursor-pointer border-2 border-transparent hover:border-indigo-500 transition"
                                    // onClick={() => setSelectedImageIndex(index)} // Optional: For selecting main image
                                    onError={(e) => { e.target.style.display = 'none'; }} // Hide broken thumbnails quietly
                                />
                            ))}
                        </div>
                    )}
                    {!hasImages && (
                        <div className="mt-4 text-center text-gray-500 flex items-center justify-center h-full py-10">
                            <FaImage className="inline-block mr-2 w-8 h-8 text-gray-400" /> No images provided.
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 break-words">
                            {annonce.title}
                        </h1>

                        <p className="text-gray-600 mb-4 text-base whitespace-pre-wrap break-words"> {/* Preserve whitespace and wrap */}
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
                                // *** Use correct spelling 'conditon' if that's in the DB ***
                                value={annonce.conditon || 'N/A'}
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
                                    label="Seller ID" // Consider fetching/displaying Seller Name instead if populated
                                    value={typeof annonce.createdBy === 'object' ? annonce.createdBy._id : annonce.createdBy}
                                />
                            )}
                            {annonce.createdAt && ( // Display creation date from timestamps
                                <DetailItem
                                    icon={<FaCalendarAlt className="text-indigo-500" />}
                                    label="Posted"
                                    value={new Date(annonce.createdAt).toLocaleDateString('en-GB')} // Format date as needed
                                />
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
                            Contact Seller (Action Placeholder)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper component for detail items
const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start space-x-2"> {/* Use items-start for long values */}
        <span className="flex-shrink-0 w-5 h-5 mt-0.5">{icon}</span>
        <span className="font-semibold">{label}:</span>
        <span className="capitalize break-words">{value || 'N/A'}</span> {/* Capitalize value, allow wrapping */}
    </div>
);

// PropTypes - Ensure they match the model structure
AnnonceDetail.propTypes = {
    annonce: PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string, // Make optional only if handling loading state explicitly
        description: PropTypes.string,
        price: PropTypes.number,
        category: PropTypes.string,
        conditon: PropTypes.string, // *** Ensure spelling matches model ***
        type: PropTypes.string,
        location: PropTypes.string,
        images: PropTypes.arrayOf(PropTypes.string), // Expecting array of strings (paths)
        createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        createdAt: PropTypes.string, // Add createdAt from timestamps
        updatedAt: PropTypes.string, // Add updatedAt from timestamps
    }),
};

AnnonceDetail.defaultProps = {
    annonce: null,
};

export default AnnonceDetail;
