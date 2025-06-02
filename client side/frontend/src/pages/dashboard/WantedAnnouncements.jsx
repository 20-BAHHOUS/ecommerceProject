import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaSearch, FaShoppingBag, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
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
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  // Always use row view
  const viewType = "row";
  
  // Adjust items per page based on view type
  const ITEMS_PER_PAGE = 6;

  // Create a hardcoded set of sample data for testing if the API fails
  const sampleWantedData = [
    {
      _id: "sample1",
      title: "Looking for Gaming Laptop",
      description: "I'm looking for a gaming laptop with RTX 3070 or better, 16GB RAM minimum.",
      location: "Algiers",
      type: "wanted",
      createdAt: new Date().toISOString(),
      images: []
    },
    {
      _id: "sample2",
      title: "Want to buy Used iPhone",
      description: "Looking for iPhone 12 or newer in good condition.",
      location: "Oran",
      type: "wanted",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      images: []
    }
  ];

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
        
        if (wantedItems.length > 0) {
          setWantedAnnouncements(wantedItems);
        } else {
          console.log("No wanted items in API response, using sample data");
          setWantedAnnouncements(sampleWantedData);
        }
      } else {
        console.error("Invalid response format:", response.data);
        setWantedAnnouncements(sampleWantedData);
        setError("Failed to load wanted announcements: Using sample data instead");
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
      console.log("Using sample data due to error");
      setWantedAnnouncements(sampleWantedData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWantedAnnouncements();
  }, [fetchWantedAnnouncements]);

  // Filter announcements based on search term
  const filteredAnnouncements = wantedAnnouncements.filter((announcement) => {
    // Debug the announcement
    console.log("Filtering announcement:", announcement);
    
    // Ensure the item exists and is a wanted item
    if (!announcement || announcement.type !== "wanted") {
      console.log("Filtered out - not a wanted item or invalid", announcement?.type);
      return false;
    }
    
    // Then apply the search filter
    return (
      announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort announcements
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (sortBy === "date-desc") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "date-asc") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
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
  
  console.log("Final valid announcements to display:", validAnnouncements.length, validAnnouncements);

  if (loading) {
    return (
      <>
        <Navbar />
        <MultiLevelNavbar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <FaSpinner className="animate-spin text-4xl mb-4 text-teal-600" />
          <p className="text-lg text-gray-700">Loading wanted items...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <MultiLevelNavbar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="bg-white p-8 rounded-lg border border-gray-200 max-w-md w-full text-center">
            <FaExclamationTriangle className="text-5xl mb-4 text-gray-500 mx-auto" />
            <p className="text-xl font-semibold mb-2 text-gray-800">
              Oops! Something went wrong.
            </p>
            <p className="mb-6 text-gray-600">{error}</p>
            <button
              onClick={fetchWantedAnnouncements}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <MultiLevelNavbar />
      
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="Search wanted items..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>

              <select
                className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
              </select>

              <Link
                to="/postad"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                <FaPlus className="mr-2" />
                Post Wanted Ad
              </Link>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {wantedAnnouncements.length === 0 ? (
              <div className="text-center py-12">
                <FaShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No wanted items</h3>
                <p className="mt-1 text-sm text-gray-500">
                  There are currently no wanted listings.
                </p>
                <div className="mt-6">
                  <Link
                    to="/postad"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    <FaPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Post Wanted Ad
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Announcement List */}
                <div className="p-6">
                  {validAnnouncements.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No items match your search criteria.</p>
                    </div>
                  ) : (
                    <div className="max-w-3xl mx-auto">
                      {validAnnouncements.map((announcement) => (
                        <div key={announcement._id} className="mb-4">
                          <WantedItemCard 
                            annonce={announcement} 
                            viewType={viewType}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-center border-t border-gray-200 sm:px-6">
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
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default WantedAnnouncements; 