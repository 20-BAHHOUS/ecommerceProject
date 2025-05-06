import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MultiLevelNavbar from "../../components/layouts/inputs/navBarCategories";
import AnnonceCard from "../../components/layouts/inputs/annonceCard";

import API_PATHS from "../../utils/apiPaths";
import Header from "../../components/layouts/inputs/header";
import Banner from "../../components/layouts/inputs/banner";
import Hero from "../../components/layouts/inputs/hero";
import axiosInstance from "../../utils/axiosInstance";

const Home = () => {
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnonces = async () => {
      setLoading(true);
      setError(null);
      // Fetch annonces from the server
      try {
        console.log(
          "Fetching annonces from relative path:",
          API_PATHS.ANNONCE.ADD_GET_ANNONCE
        );
        const response = await axiosInstance.get(
          API_PATHS.ANNONCE.ADD_GET_ANNONCE
        );
        console.log("Response data:", response.data);

        if (Array.isArray(response.data)) {
          setAnnonces(response.data);
        } else {
          console.warn(
            "Received non-array response for annonces:",
            response.data
          );
          setAnnonces([]);
          setError("Received unexpected data format from server.");
        }
      } catch (err) {
        console.error("Error fetching annonces:", err);
        if (err.response) {
          setError(
            `Error ${err.response.status}: ${
              err.response.data?.message || "Failed to load announcements."
            }`
          );
          if (err.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
          }
        } else if (err.request) {
          setError("Network Error: Could not connect to the server.");
        } else {
          setError(`Error: ${err.message || "Failed to load announcements."}`);
        }
        setAnnonces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonces();
  }, []);

  return (
    <div>
      <Header />
      <MultiLevelNavbar />
      <Banner />
      <Hero />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {" "}
            Listings
          </h1>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          </div>
        )}

        {error && (
          <div className="text-center p-6 bg-red-100 border border-red-400 text-red-700 rounded-md shadow-sm">
            <p className="font-semibold text-lg mb-2">
              Oops! Something went wrong.
            </p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {annonces.length === 0 ? (
              // Empty State
              <div className="text-center p-10 text-gray-500">
                <p className="text-xl mb-4">No announcements found.</p>
                <p>
                  Be the first to{" "}
                  <Link
                    to="/postad"
                    className="text-teal-700 hover:underline font-medium"
                  >
                    post an ad
                  </Link>
                  !
                </p>
              </div>
            ) : (
              //Grid of Announcement Cards
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {annonces.map((annonce) =>
                  // Render AnnonceCard for each item, passing the data and a unique key
                  annonce._id ? (
                    <AnnonceCard key={annonce._id} annonce={annonce} />
                  ) : (
                    // Log warning and skip rendering if _id is missing
                    (console.warn("Announcement missing _id:", annonce), null)
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
