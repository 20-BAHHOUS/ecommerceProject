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
  const [sortBy, setSortBy] = useState('newest');
  const [viewType, setViewType] = useState('grid');

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'type-sale', label: 'Type: For Sale' },
    { value: 'type-trade', label: 'Type: For Trade' },
    { value: 'type-wanted', label: 'Type: Wanted' },
    { value: 'type-rent', label: 'Type: For Rent' }
  ];

  useEffect(() => {
    const fetchCategoryListings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching listings for:', { category, subcategory, sortBy });
        const response = await getAnnoncesByMainCategory(category, subcategory, sortBy);
        
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
  }, [category, subcategory, navigate, sortBy]);

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {formatTitle()}
            </h1>
            <p className="text-gray-600">
              Browse all listings in {subcategory ? 'this subcategory' : 'this category'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewType('grid')}
                className={`p-1.5 rounded ${viewType === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`p-1.5 rounded ${viewType === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
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
          <div className={
            viewType === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          }>
            {listings.map((listing) => (
              <AnnonceCard key={listing._id} annonce={listing} viewType={viewType} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryListings; 