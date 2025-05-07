import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa'; 
import { parseImages } from '../../../utils/parseImages';

const formatPrice = (price) => {
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
        console.warn(`Invalid price value received: ${price}`);
        return 'N/A';
    }
    return new Intl.NumberFormat('en-US', { 
        style: 'currency',
        currency: 'DZD', 
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(numericPrice);
};

const AnnonceCard = ({ annonce }) => {
    if (!annonce) {
        return null; 
    }

   
    const displayImage = annonce.images && annonce.images.length > 0
        ? annonce.images[0] 
        : '/images/placeholder-image.jpg'; 

   
    const detailLink = annonce._id ? `/annonces/${annonce._id}` : '#'; 

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl border border-gray-100 flex flex-col h-full">
          
            <Link to={detailLink} className="block relative h-48 w-full overflow-hidden group">
                <img
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    src={parseImages(displayImage)}
                    alt={annonce.title || 'Announcement image'}
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = '/placeholder-image.png';
                    }}
                    loading="lazy" 
                />
            </Link>

         
            <div className="p-4 flex flex-col flex-grow">
              
                {annonce.category && (
                    <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full mb-2 self-start capitalize">
                        {annonce.category}
                    </span>
                )}

                
                <Link to={detailLink} className="block mb-2">
                    <h3
                        className="text-md font-semibold text-gray-800 hover:text-i-600 line-clamp-2" // Limit title to 2 lines
                        title={annonce.title} 
                    >
                        {annonce.title || 'Untitled Announcement'}
                    </h3>
                </Link>

              
                <div className="mt-auto pt-2"> 
                    <p className="text-lg font-bold text-indigo-600 mb-2">
                        {formatPrice(annonce.price)}
                    </p>
                    {annonce.location && (
                        <div className="flex items-center text-sm text-gray-500">
                            <FaMapMarkerAlt className="mr-1.5 text-gray-400 flex-shrink-0" size="0.85em" />
                            <span className="truncate" title={annonce.location}>{annonce.location}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

AnnonceCard.propTypes = {
    annonce: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        category: PropTypes.string, 
        location: PropTypes.string, 
        images: PropTypes.arrayOf(PropTypes.string), 
    }).isRequired,
};

export default AnnonceCard;
