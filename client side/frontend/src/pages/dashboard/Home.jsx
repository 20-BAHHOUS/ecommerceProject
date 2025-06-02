import React, { useState, useEffect, useCallback } from "react";
import { Link} from "react-router-dom";
import { AlertCircle, Package, PlusCircle } from "lucide-react";
import MultiLevelNavbar from "../../components/layouts/inputs/navBarCategories";
import AnnonceCard from "../../components/layouts/inputs/annonceCard";
import API_PATHS from "../../utils/apiPaths";
import Header from "../../components/layouts/inputs/header";
import Hero from "../../components/layouts/inputs/hero";
import Footer from "../../components/layouts/inputs/footer";
import axiosInstance from "../../utils/axiosInstance";

const Home = () => {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [viewType, setViewType] = useState('grid');

  // Memoize the fetch function to avoid unnecessary re-renders
  const fetchAnnonces = useCallback(async () => {
    setLoading(true);
    setError(null);
   
    try {
      const response = await axiosInstance.get(API_PATHS.ANNONCE.ADD_GET_ANNONCE, {
        params: { sort: sortBy }
      });

      if (Array.isArray(response.data)) {
        setAnnonces(response.data);
      } else {
        setAnnonces([]);
        setError("Received unexpected data format from server.");
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchAnnonces();
  }, [fetchAnnonces]);

  const handleError = (err) => {
    if (err.response) {
      // Don't redirect to login for 401 errors, just show error message
      setError(err.response.data?.message || "Failed to load announcements.");
    } else if (err.request) {
      setError("Network Error: Could not connect to the server.");
    } else {
      setError(err.message || "Failed to load announcements.");
    }
    setAnnonces([]);
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'type-sale', label: 'Type: For Sale' },
    { value: 'type-trade', label: 'Type: For Trade' },
    { value: 'type-rent', label: 'Type: For Rent' }
  ];

  // Validate annonces data before rendering
  const validAnnonces = annonces.filter(annonce => 
    annonce && typeof annonce === 'object' && annonce._id
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <MultiLevelNavbar />

      <main className="container mx-auto px-4 py-8 flex-grow">
       
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Browse Listings
            </h1>
          
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

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500"></div>
            <p className="mt-4 text-gray-500">Loading listings...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-start gap-4 p-6 bg-red-50 border border-red-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Listings</h3>
              <p className="text-red-600 mt-1">{error}</p>
              <button
                onClick={fetchAnnonces}
                className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && validAnnonces.length === 0 && (
          <div className="text-center py-12 px-4 bg-white rounded-lg shadow-sm">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Listings Found</h3>
            <p className="text-gray-500 mb-6">Be the first to post a listing in our marketplace!</p>
            <Link
              to="/postad"
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Create Listing
            </Link>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && !error && validAnnonces.length > 0 && (
          <div className={
            viewType === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          }>
            {validAnnonces.map((annonce) => (
              <AnnonceCard 
                key={annonce._id} 
                annonce={annonce} 
                viewType={viewType}
              />
            ))}
           
          </div>
          
        )}
        
       
      </main>
      <Hero />
      <Footer />
    </div>
  );
};

export default Home;
