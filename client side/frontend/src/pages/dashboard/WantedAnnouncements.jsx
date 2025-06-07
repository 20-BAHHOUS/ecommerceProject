import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaSearch, FaShoppingBag, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import { AlertCircle, Package, PlusCircle } from "lucide-react";
import Navbar from "../../components/layouts/inputs/header";
import MultiLevelNavbar from "../../components/layouts/inputs/navBarCategories";
import Footer from "../../components/layouts/inputs/footer";
import WantedItemCard from "../../components/layouts/inputs/WantedItemCard";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";

const WantedAnnouncements = () => {
  const [wantedAnnouncements, setWantedAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // Always use list view
  const viewType = "list";
  
  // Adjust items per page
  const ITEMS_PER_PAGE = 6;

  // Memoize the fetch function to avoid unnecessary re-renders
  const fetchWantedAnnouncements = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching announcements...");
      const response = await axiosInstance.get(API_PATHS.ANNONCE.ADD_GET_ANNONCE);
      console.log("API response:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        // Filter out only wanted announcements
        const wantedItems = response.data.filter(item => item && item.type === "wanted");
        console.log("Wanted items found:", wantedItems.length, wantedItems);
        
        setWantedAnnouncements(wantedItems);
      } else {
        console.error("Invalid response format:", response.data);
        setWantedAnnouncements([]);
        setError("Failed to load wanted announcements: Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching wanted announcements:", err);
      if (err.response) {
        setError(err.response.data?.message || "Failed to load wanted announcements.");
      } else if (err.request) {
        setError("Network Error: Could not connect to the server.");
      } else {
        setError(err.message || "Failed to load wanted announcements.");
      }
      setWantedAnnouncements([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWantedAnnouncements();
  }, [fetchWantedAnnouncements]);

  // Filter announcements based on search term
  const filteredAnnouncements = wantedAnnouncements.filter((announcement) => {
    // Ensure the item exists and is a wanted item
    if (!announcement || announcement.type !== "wanted") {
      return false;
    }
    
    // Then apply the search filter
    return (
      announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort announcements by newest first
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Paginate announcements
  const totalPages = Math.ceil(sortedAnnouncements.length / ITEMS_PER_PAGE);
  const paginatedAnnouncements = sortedAnnouncements.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Validate wantedAnnouncements data before rendering
  const validAnnouncements = paginatedAnnouncements.filter(announcement => 
    announcement && typeof announcement === 'object' && announcement._id
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <MultiLevelNavbar />
        <div className="flex flex-col items-center justify-center flex-grow py-12">
          <FaSpinner className="animate-spin text-4xl mb-4 text-teal-600" />
          <p className="text-lg text-gray-700">Loading wanted items...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <MultiLevelNavbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="flex items-start gap-4 p-6 bg-red-50 border border-red-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Wanted Items</h3>
              <p className="text-red-600 mt-1">{error}</p>
              <button
                onClick={fetchWantedAnnouncements}
                className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <MultiLevelNavbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Wanted Items
            </h1>
            <p className="text-gray-600 mt-1">
              Browse items that people are looking for
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                placeholder="Search wanted items..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <Link
              to="/postad"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 transition-colors"
            >
              <FaPlus className="mr-2" />
              Post Wanted Ad
            </Link>
          </div>
        </div>

        {/* Empty State */}
        {wantedAnnouncements.length === 0 && (
          <div className="text-center py-12 px-4 bg-white rounded-lg shadow-sm">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Wanted Items Found</h3>
            <Link
              to="/postad"
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Post Wanted Ad
            </Link>
          </div>
        )}

        {/* No Search Results */}
        {wantedAnnouncements.length > 0 && validAnnouncements.length === 0 && (
          <div className="text-center py-12 px-4 bg-white rounded-lg shadow-sm">
            <FaSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Items Match Your Search</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search criteria</p>
            <button
              onClick={() => setSearchTerm('')}
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Listings List */}
        {wantedAnnouncements.length > 0 && validAnnouncements.length > 0 && (
          <>
            <div className="flex flex-col gap-4 max-w-4xl mx-auto">
              {validAnnouncements.map((announcement) => (
                <WantedItemCard 
                  key={announcement._id} 
                  annonce={announcement} 
                  viewType={viewType}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center">
                <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-3xl">
                  <div className="mb-4 sm:mb-0">
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to{" "}
                      <span className="font-medium">
                        {Math.min(currentPage * ITEMS_PER_PAGE, filteredAnnouncements.length)}
                      </span>{" "}
                      of <span className="font-medium">{filteredAnnouncements.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === index + 1
                              ? "z-10 bg-teal-50 border-teal-500 text-teal-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default WantedAnnouncements; 