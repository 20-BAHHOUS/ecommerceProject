import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, Package, Search } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import Header from "../../components/layouts/inputs/header";
import MultiLevelNavbar from "../../components/layouts/inputs/navBarCategories";
import AnnonceCard from "../../components/layouts/inputs/annonceCard";
import Footer from "../../components/layouts/inputs/footer";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("grid");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setNoResults(false);

      try {
        // Make an API call to search for announcements
        const response = await axiosInstance.get(`${API_PATHS.ANNONCE.ADD_GET_ANNONCE}/search`, {
          params: { query }
        });

        if (Array.isArray(response.data) && response.data.length > 0) {
          setResults(response.data);
        } else {
          setResults([]);
          setNoResults(true);
        }
      } catch (err) {
        console.error("Search error:", err);
        setError(err.response?.data?.message || "Failed to perform search");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <MultiLevelNavbar />

      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Search className="h-5 w-5 text-teal-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">
              Search Results for "{query}"
            </h1>
          </div>
          <p className="text-gray-600">
            {!loading && !error && results.length > 0 
              ? `${results.length === 1 ? '' : ''}`
              : 'Searching for matching announcements...'}
          </p>
        </div>

        {/* View Controls */}
        <div className="flex justify-end mb-6">
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

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500"></div>
            <p className="mt-4 text-gray-500">Searching...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-start gap-4 p-6 bg-red-50 border border-red-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-800">Error Searching</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && noResults && (
          <div className="text-center py-12 px-4 bg-white rounded-lg shadow-sm">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-500 mb-6">
              We couldn't find any announcements matching "{query}"
            </p>
            <p className="text-gray-600 text-sm">
              Try checking your spelling or using more general terms.
            </p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && results.length > 0 && (
          <div className={
            viewType === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          }>
            {results.map((annonce) => (
              <AnnonceCard 
                key={annonce._id} 
                annonce={annonce} 
                viewType={viewType}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults; 