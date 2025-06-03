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
  const [sortOption, setSortOption] = useState('newest');

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'type-sale', label: 'Type: For Sale' },
    { value: 'type-trade', label: 'Type: For Trade' },
    { value: 'type-rent', label: 'Type: For Rent' }
  ];

  useEffect(() => {
    const fetchCategoryListings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching listings for:', { category, subcategory, sort: sortOption });
        const response = await getAnnoncesByMainCategory(category, subcategory, sortOption);
        
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
  }, [category, subcategory, navigate, sortOption]);

  const formatTitle = () => {
    let title = category ? category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ') : '';
    if (subcategory) {
      title += ' › ' + subcategory.charAt(0).toUpperCase() + subcategory.slice(1).replace(/-/g, ' ');
    }
    return title;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <MultiLevelNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {formatTitle()}
            </h1>
            <p className="text-gray-600">
              Browse all listings in {subcategory ? 'this subcategory' : 'this category'}
            </p>
          </div>
          
          {/* Sort Controls */}
          <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
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