import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useFavorites } from '../../../context/FavoritesContext';
import { Link } from 'react-router-dom';
import './annonceCard.css';

const AnnonceCard = ({ annonce }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  
  const handleFavoriteClick = async (e) => {
    e.preventDefault(); // Prevent card click/navigation when clicking the heart
    e.stopPropagation();
    
    try {
      if (isFavorite(annonce._id)) {
        await removeFromFavorites(annonce._id);
      } else {
        await addToFavorites(annonce._id);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      // You can add a toast notification here if you have one
    }
  };

  return (
    <Link to={`/annonces/${annonce._id}`} className="annonce-card-link">
      <div className="annonce-card">
        <div className="favorite-wrapper">
          <button 
            className="favorite-button"
            onClick={handleFavoriteClick}
            aria-label={isFavorite(annonce._id) ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite(annonce._id) ? (
              <FaHeart className="heart-icon filled" />
            ) : (
              <FaRegHeart className="heart-icon" />
            )}
          </button>
        </div>
        
        <div className="annonce-image">
          <img 
            src={annonce.images?.[0] || '/default-annonce-image.jpg'} 
            alt={annonce.title} 
            className="card-image"
          />
        </div>

        <div className="annonce-details">
          <h3 className="annonce-title">{annonce.title}</h3>
          <p className="annonce-price">{annonce.price} DH</p>
          <p className="annonce-date">
            {new Date(annonce.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default AnnonceCard; 