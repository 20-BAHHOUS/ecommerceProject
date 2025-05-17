import React from "react";
import { Link } from "react-router-dom";
import { Search, User, Heart, Bell, MessageSquare } from "lucide-react"; // Import icons
import { useState, useEffect } from "react";
import ProfilePage from "../../../pages/dashboard/ProfilePage";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication

  useEffect(() => {
   
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    setIsAuthenticated(false); 
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-300">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between h-15">
        {/* Logo */}
        <div className="text-2xl font-bold text-teal-500">Loopify</div>

        {/* Search Bar (for larger screens) */}
        <div className="hidden md:flex items-center rounded-lg border border-gray-300 focus-within:border-teal-500">
          <input
            type="text"
            placeholder="Search for items..."
            className="py-2 px-4 w-96 rounded-l-lg focus:outline-none"
          />
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 px-4 rounded-r-lg">
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            // Display user icons when logged in
            <div className="flex items-center space-x-4">
              <Link to="/favourites" className="relative">
                <Heart className="h-6 w-6 text-gray-700 hover:text-teal-500" />
              </Link>
              <Link to="/notifications" className="relative">
                <Bell className="h-6 w-6 text-gray-700 hover:text-teal-500" />
              </Link>
              <Link to="/messages" className="relative">
                <MessageSquare className="h-6 w-6 text-gray-700 hover:text-teal-500" />
              </Link>
              <Link to="/profile">
                <User className="h-6 w-6 text-gray-700 hover:text-teal-500" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-teal-500 focus:outline-none"
              >
                Logout
              </button>
            </div>
          ) : (
            // Display login/signup buttons when not logged in
            <div className="flex items-center gap-4">
              <button className="bg-white text-teal-600 font-medium py-2 px-4 rounded-md focus:outline-none border border-teal-600 ">
                <Link to="/signup">Sign up</Link> |{" "}
                <Link to="/login">Log in</Link>
              </button>
              <Link
                to="/postad"
                className="hidden md:block text-gray-700 hover:text-teal-500"
              >
                Sell now
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar (for smaller screens) */}
      <div className="md:hidden px-6 py-2">
        <div className="flex items-center rounded-lg border border-gray-300 focus-within:border-teal-500">
          <input
            type="text"
            placeholder="Search for items..."
            className="py-2 px-4 w-full rounded-l-lg focus:outline-none"
          />
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 px-4 rounded-r-lg">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
