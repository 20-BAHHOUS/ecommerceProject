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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favorites</h1>
        {favoriteAnnonces.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">You haven't added any announcements to your favorites yet.</p>
            <a href="/annonces" className="inline-flex items-center text-teal-600 hover:text-teal-700">
              Browse announcements
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteAnnonces.map(annonce => (
              <AnnonceCard key={annonce._id} annonce={annonce} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage; 