import React, { useState, useEffect, useCallback } from "react";
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
  const [noResults, setNoResults] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [allAnnonces, setAllAnnonces] = useState([]);
  // Add viewType state, defaulting to 'grid'
  const [viewType, setViewType] = useState("grid");

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "type-sale", label: "Type: For Sale" },
    { value: "type-trade", label: "Type: For Trade" },
    { value: "type-rent", label: "Type: For Rent" },
  ];

  // Fetch all announcements once
  useEffect(() => {
    const fetchAllAnnonces = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.ANNONCE.ADD_GET_ANNONCE
        );
        if (Array.isArray(response.data)) {
          setAllAnnonces(response.data);
        }
      } catch (err) {
        console.error("Error fetching all announcements:", err);
      }
    };

    fetchAllAnnonces();
  }, []);

  // Filter and sort announcements based on search query
  const filterAndSortAnnonces = useCallback(() => {
    if (!query.trim() || !allAnnonces.length) {
      setLoading(false); // Set loading to false if query is empty or no data
      setNoResults(true); // Indicate no results if query is empty
      setResults([]); // Clear results
      return;
    }

    setLoading(true);
    setError(null);
    setNoResults(false);

    try {
      // Filter announcements that match the search query (title contains query)
      const lowercaseQuery = query.toLowerCase();
      let filteredResults = allAnnonces.filter(
        (annonce) =>
          annonce.title?.toLowerCase().includes(lowercaseQuery) || // Changed to includes for broader search
          annonce.description?.toLowerCase().includes(lowercaseQuery) ||
          annonce.location?.toLowerCase().includes(lowercaseQuery)
      );

      // Sort the filtered results
      if (filteredResults.length > 0) {
        switch (sortOption) {
          case "newest":
            filteredResults.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            break;
          case "oldest":
            filteredResults.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
            break;
          case "price-high":
            filteredResults.sort((a, b) => (b.price || 0) - (a.price || 0)); // Handle undefined price
            break;
          case "price-low":
            filteredResults.sort((a, b) => (a.price || 0) - (b.price || 0)); // Handle undefined price
            break;
          case "type-sale":
            filteredResults = filteredResults.filter(
              (item) => item.type === "sale"
            );
            break;
          case "type-trade":
            filteredResults = filteredResults.filter(
              (item) => item.type === "trade"
            );
            break;
          case "type-rent":
            filteredResults = filteredResults.filter(
              (item) => item.type === "rent"
            );
            break;
          default:
            break;
        }

        setResults(filteredResults);
      } else {
        setResults([]);
        setNoResults(true);
      }
    } catch (err) {
      console.error("Error filtering announcements:", err);
      setError("Failed to filter search results");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, sortOption, allAnnonces]);

  useEffect(() => {
    filterAndSortAnnonces();
  }, [filterAndSortAnnonces]);

  // Handle sort change
  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <MultiLevelNavbar />

      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Search Header and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center mb-2">
              <Search className="h-5 w-5 text-teal-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">
                Search Results for "{query}"
              </h1>
            </div>
            <p className="text-gray-600">
              {!loading && !error && results.length > 0
                ? `${results.length} ${
                    results.length === 1 ? "result" : "results"
                  } found`
                : "Searching for matching announcements..."}
            </p>
          </div>

          {/* Sort & View Type Controls */}
          {!loading &&
            !error &&
            (results.length > 0 || noResults) && ( // Show controls if results found or no results but not error
              <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Type Buttons (Grid/List) */}
                <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
                  <button
                    onClick={() => setViewType("grid")}
                    className={`p-1.5 rounded ${
                      viewType === "grid"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    aria-label="Grid view"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewType("list")}
                    className={`p-1.5 rounded ${
                      viewType === "list"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    aria-label="List view"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
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
              <button
                onClick={filterAndSortAnnonces}
                className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && noResults && (
          <div className="text-center py-12 px-4 bg-white rounded-lg shadow-sm">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Results Found
            </h3>
            <p className="text-gray-500 mb-6">
              We couldn't find any announcements matching "{query}"
            </p>
            <p className="text-gray-600 text-sm">
              Try checking your spelling or using more general terms.
            </p>
          </div>
        )}

        {/* Results Grid/List Display */}
        {!loading && !error && results.length > 0 && (
          <div
            className={
              viewType === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {results.map((annonce) => (
              <AnnonceCard
                key={annonce._id}
                annonce={annonce}
                viewType={viewType} // Pass viewType to AnnonceCard
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
