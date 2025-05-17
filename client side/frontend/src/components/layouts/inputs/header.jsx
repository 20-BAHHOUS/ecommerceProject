import React from "react";
import { Link } from "react-router-dom";
import { Search, User, Heart, Bell, MessageSquare } from "lucide-react"; // Import icons
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { FaCaretDown } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
              <div ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-gray-700 hover:text-teal-500 focus:outline-none"
                >
                  <User className="h-6 w-6" />
                  <FaCaretDown className="ml-1 h-4 w-4" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <Link
                      to="/personalisation"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Personalisation
                    </Link>
                   
                    <Link
                      to="/userorders"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      My orders
                    </Link>
                    <Link
                      to="/userannonces"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      My announcements
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 focus:outline-none"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
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
