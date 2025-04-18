import React from "react";
import { Link } from "react-router-dom";
import Baner from "../../components/layouts/inputs/baner";
import StyleSearch from "../../components/layouts/inputs/styleSearch";
import CategoryDropdown from "../../components/layouts/inputs/CategoryDropdown";

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md fixed top-0 left-0 w-full z-10">
        <div className="container mx-auto py-4 px-6 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-teal-600">
            LoopShop
          </Link>
          
          <CategoryDropdown />

          <div className="flex items-center w-full max-w-md mx-auto">
            <StyleSearch />
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-teal-600 hover:text-teal-700 font-medium py-2 px-6 rounded-md border border-teal-600 transition-colors hidden sm:inline-block"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto mt-20 py-8 px-6">
        <Baner />
        {/* You can add more content below the banner */}
        <div className="mt-12 text-center text-gray-700">
          <p className="text-lg">
            Explore a wide range of items and find amazing deals within our
            community.
          </p>
          {/* Add featured categories or products here */}
        </div>
      </main>
      <footer className="bg-gray-200 py-6 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} LoopShop. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;