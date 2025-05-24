import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useFavorites } from '../../../context/FavoritesContext';
import { Link } from 'react-router-dom';

const AnnonceCard = ({ annonce }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  
  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isFavorite(annonce._id)) {
        await removeFromFavorites(annonce._id);
      } else {
        await addToFavorites(annonce._id);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  return (
    <Link to={`/annonces/${annonce._id}`} className="block">
      <div className="relative rounded-lg shadow-lg bg-white overflow-hidden transition-transform duration-200 hover:scale-105">
        <div className="absolute top-3 right-3 z-10">
          <button 
            className="flex items-center gap-2 p-2 cursor-pointer transition-transform duration-200 hover:scale-110"
            onClick={handleFavoriteClick}
            aria-label={isFavorite(annonce._id) ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite(annonce._id) ? (
              <FaHeart className="text-2xl text-red-500" />
            ) : (
              <FaRegHeart className="text-2xl text-gray-600 hover:text-red-500" />
            )}
          </button>
        </div>
        
        <div className="relative aspect-w-16 aspect-h-9">
          <img 
            src={annonce.images?.[0] || '/default-annonce-image.jpg'} 
            alt={annonce.title} 
            className="w-full h-48 object-cover"
          />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{annonce.title}</h3>
          <p className="text-xl font-bold text-teal-600 mb-2">{annonce.price} DH</p>
          <p className="text-sm text-gray-500">
            {new Date(annonce.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default AnnonceCard; 