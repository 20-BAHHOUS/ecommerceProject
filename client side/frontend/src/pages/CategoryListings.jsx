import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnnoncesByMainCategory } from '../services/categoryService';
import AnnonceCard from '../components/layouts/inputs/annonceCard';
import Header from '../components/layouts/inputs/header';
import MultiLevelNavbar from '../components/layouts/inputs/navBarCategories';

const CategoryListings = () => {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryListings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching listings for:', { category, subcategory });
        const response = await getAnnoncesByMainCategory(category, subcategory);
        
        if (response && response.success) {
          console.log('Received listings:', response.data);
          setListings(response.data);
        } else {
          console.log('No data received from API');
          setListings([]);
        }
      } catch (err) {
        console.error('Error fetching category listings:', err);
        if (err.response?.status === 404) {
          setError('Category not found. Please select a valid category.');
          // Redirect to home after 3 seconds if category not found
          setTimeout(() => navigate('/'), 3000);
        } else {
          setError('Failed to load listings. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchCategoryListings();
    }
  }, [category, subcategory, navigate]);

  const formatTitle = () => {
    let title = category ? category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ') : '';
    if (subcategory) {
      title += ' › ' + subcategory.charAt(0).toUpperCase() + subcategory.slice(1).replace(/-/g, ' ');
    }
    return title;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MultiLevelNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {formatTitle()}
          </h1>
          <p className="text-gray-600">
            Browse all listings in {subcategory ? 'this subcategory' : 'this category'}
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
          </div>
        )}

        {error && (
          <div className="text-center p-6 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && listings.length === 0 && (
          <div className="text-center p-6">
            <p className="text-xl text-gray-600">No listings found in this category.</p>
            <p className="mt-2 text-gray-500">Be the first to post an item here!</p>
          </div>
        )}

        {!loading && !error && listings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <AnnonceCard key={listing._id} annonce={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryListings; 