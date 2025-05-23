import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFavorites } from '../context/FavoritesContext';
import AnnonceCard from '../components/layouts/inputs/annonceCard.new';

const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const [favoriteAnnonces, setFavoriteAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteAnnonces = async () => {
      try {
        setLoading(true);
        const promises = favorites.map(id => 
          axios.get(`/api/annonces/${id}`).then(res => res.data)
        );
        const annonces = await Promise.all(promises);
        setFavoriteAnnonces(annonces);
      } catch (error) {
        console.error('Error fetching favorite annonces:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteAnnonces();
  }, [favorites]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="favorites-page">
      <h1>My Favorite Announcements</h1>
      {favoriteAnnonces.length === 0 ? (
        <p>You haven't added any announcements to your favorites yet.</p>
      ) : (
        <div className="favorites-grid">
          {favoriteAnnonces.map(annonce => (
            <AnnonceCard key={annonce._id} annonce={annonce} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage; 