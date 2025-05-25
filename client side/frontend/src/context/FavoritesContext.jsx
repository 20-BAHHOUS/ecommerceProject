import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from localStorage on initial mount
  useEffect(() => {
    const loadFavorites = () => {
      const storedFavorites = localStorage.getItem('userFavorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
      setLoading(false);
    };

    loadFavorites();
  }, []);

  // Update localStorage whenever favorites change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('userFavorites', JSON.stringify(favorites));
    }
  }, [favorites, loading]);

  const addToFavorites = async (annonceId) => {
    try {
      // First update the UI optimistically
      setFavorites(prev => [...prev, annonceId]);

      // Then update the backend
      await axios.post(API_PATHS.FAVORITES.ADD_FAVORITE, { 
        annonceId,
        userId: localStorage.getItem('userId') // Assuming you store userId in localStorage
      });
    } catch (error) {
      // If the backend update fails, revert the UI change
      console.error('Error adding to favorites:', error);
      setFavorites(prev => prev.filter(id => id !== annonceId));
      throw error;
    }
  };

  const removeFromFavorites = async (annonceId) => {
    try {
      // First update the UI optimistically
      setFavorites(prev => prev.filter(id => id !== annonceId));

      // Then update the backend
      await axios.delete(API_PATHS.FAVORITES.REMOVE_FAVORITE, {
        data: { userId: localStorage.getItem('userId') }
      });
    } catch (error) {
      // If the backend update fails, revert the UI change
      console.error('Error removing from favorites:', error);
      setFavorites(prev => [...prev, annonceId]);
      throw error;
    }
  };

  const isFavorite = (annonceId) => {
    return favorites.includes(annonceId);
  };

  const getFavoritesCount = () => {
    return favorites.length;
  };

  // Sync favorites with backend
  const syncFavorites = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const response = await axios.get(API_PATHS.FAVORITES.GET_FAVORITES, {
        params: { userId }
      });
      const serverFavorites = response.data.favorites || [];
      
      // Update local state with server state
      setFavorites(serverFavorites);
      localStorage.setItem('userFavorites', JSON.stringify(serverFavorites));
    } catch (error) {
      console.error('Error syncing favorites:', error);
    }
  };

  // Sync with backend when user logs in
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      syncFavorites();
    }
  }, []);

  return (
    <FavoritesContext.Provider 
      value={{ 
        favorites,
        loading,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        getFavoritesCount,
        syncFavorites
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}; 