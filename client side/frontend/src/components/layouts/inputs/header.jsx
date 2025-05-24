import React from "react";
import { Link } from "react-router-dom";
import { Search, User, Heart, Bell, MessageSquare } from "lucide-react"; 
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { FaCaretDown } from "react-icons/fa";
import axiosInstance from "../../../utils/axiosInstance";
import API_PATHS from "../../../utils/apiPaths";
import { toast } from "react-toastify";

// Add animation keyframes
const fadeInAnimation = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px) translateX(-50%);
    }
    to {
      opacity: 1;
      transform: translateY(0) translateX(-50%);
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;

// Add style tag to head
if (!document.getElementById('header-animations')) {
  const style = document.createElement('style');
  style.id = 'header-animations';
  style.innerHTML = fadeInAnimation;
  document.head.appendChild(style);
}

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    if (token) {
      fetchNotifications();
      fetchUserInfo();
      fetchFavoritesCount();
    }

    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    // Listen for storage events (for profile updates from other components)
    const handleStorageChange = (e) => {
      if (e.key === "profileUpdated" && token) {
        fetchUserInfo();
      }
      if (e.key === "favoritesUpdated" && token) {
        fetchFavoritesCount();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Add a second useEffect to refresh user info when component mounts
  useEffect(() => {
    // This will help fetch user info when returning from profile page
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserInfo();
      fetchFavoritesCount();
    }
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.GET_USER_INFO);
      if (response.data) {
        setUserInfo(response.data);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchFavoritesCount = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_FAVORITES_COUNT);
      if (response.data) {
        setFavoritesCount(response.data.count);
      }
    } catch (error) {
      console.error("Error fetching favorites count:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.NOTIFICATIONS.GET_NOTIFICATIONS);
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.pagination?.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to fetch notifications");
    }
  };

  const handleOrderAction = async (notificationId, orderId, action) => {
    try {
      console.log('Updating order:', orderId, 'with action:', action);
      
      // Update order status using the correct API path
      const orderResponse = await axiosInstance.put(API_PATHS.ORDER.UPDATE_ORDER_STATUS(orderId), {
        status: action
      });

      if (orderResponse.data.success) {
        // Mark notification as read only if order update was successful
        await axiosInstance.put(API_PATHS.NOTIFICATIONS.MARK_AS_READ(notificationId));
        
        // Refresh notifications
        await fetchNotifications();
        
        toast.success(`Order ${action} successfully`);
      } else {
        throw new Error(orderResponse.data.message || 'Failed to update order');
      }
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
      toast.error(error.response?.data?.message || `Failed to ${action} order`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const toggleDropdown = () => {
    // When dropdown is toggled, refresh user info to ensure we have the latest profile image
    if (!isDropdownOpen && isAuthenticated) {
      fetchUserInfo();
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleFavoritesClick = () => {
    navigate("/favourites");
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm backdrop-blur-sm bg-white/90">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/home" 
            className="flex items-center space-x-2"
          >
            <span className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors duration-200">Loopify</span>
          </Link>

          {/* Search Bar (for larger screens) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="relative flex items-center w-full h-12 rounded-full focus-within:shadow-lg bg-gray-50 overflow-hidden group border border-gray-200 focus-within:border-teal-500 hover:border-teal-400 transition-all duration-200">
                <div className="grid place-items-center h-full w-12 text-gray-400 group-hover:text-teal-500 transition-colors duration-200">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search for announcements..."
                  className="peer h-full w-full outline-none text-sm text-gray-700 bg-gray-50 px-2 group-focus-within:bg-white transition-colors duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="h-full px-2 text-gray-400 hover:text-gray-600 transition-all duration-200"
                    aria-label="Clear search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  className="h-full px-5 bg-teal-500 text-white font-medium hover:bg-teal-600 transition-all duration-200 flex items-center gap-2"
                  aria-label="Search"
                >
                  <span>Search</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                <button 
                  onClick={handleFavoritesClick}
                  className="relative p-2 text-gray-600 hover:text-teal-600 transition-colors duration-200 rounded-full hover:bg-gray-100"
                  aria-label="Favorites"
                >
                  <Heart className="h-5 w-5" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                      {favoritesCount}
                    </span>
                  )}
                </button>
                
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={toggleNotifications}
                    className="relative p-2 text-gray-600 hover:text-teal-600 transition-colors duration-200 rounded-full hover:bg-gray-100 focus:outline-none"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-lg border border-gray-100 z-20 max-h-[32rem] overflow-y-auto">
                      <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      </div>
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {notifications.map((notification) => (
                            <div
                              key={notification._id}
                              className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                                !notification.isRead ? 'bg-teal-50/60' : ''
                              }`}
                            >
                              <p className="text-sm text-gray-800 mb-2">
                                {notification.message}
                              </p>
                              {notification.type === 'ORDER_REQUEST' && !notification.isRead && (
                                <div className="flex space-x-2 mt-2">
                                  <button
                                    onClick={() => handleOrderAction(notification._id, notification.relatedOrder._id || notification.relatedOrder, 'accepted')}
                                    className="flex-1 px-3 py-1.5 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 transition-colors duration-200"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleOrderAction(notification._id, notification.relatedOrder._id || notification.relatedOrder, 'rejected')}
                                    className="flex-1 px-3 py-1.5 bg-white text-red-600 text-sm rounded-md hover:bg-red-50 border border-red-200 transition-colors duration-200"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                              <p className="text-xs text-gray-400 mt-2">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Link 
                  to="/messages" 
                  className="relative p-2 text-gray-600 hover:text-teal-600 transition-colors duration-200 rounded-full hover:bg-gray-100"
                >
                  <MessageSquare className="h-5 w-5" />
                </Link>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 focus:outline-none group"
                  >
                    <div className="flex items-center">
                      {userInfo?.profileImageUrl ? (
                        <div className="relative">
                          <img
                            src={userInfo.profileImageUrl}
                            alt={userInfo.fullName}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-offset-2 ring-teal-500 transition-all duration-200 group-hover:ring-teal-600"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/32";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center ring-2 ring-offset-2 ring-teal-500 transition-all duration-200 group-hover:ring-teal-600">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                      )}
                      <FaCaretDown className="ml-3 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                    </div>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-8 w-56 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors duration-200"
                        >
                          <User className="h-4 w-4 mr-3" />
                          Profile Settings
                        </Link>
                        <Link
                          to="/userannonces"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                          My Announcements
                        </Link>
                        <Link
                          to="/user-orders"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                            <path d="M16 11a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          My Orders
                        </Link>
                        <Link
                          to="/favourites"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors duration-200"
                        >
                          <Heart className="h-4 w-4 mr-3" />
                          My Favorites
                        </Link>
                        <Link
                          to="/sold-items"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                          </svg>
                          Sold Items
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10 3a1 1 0 00-1.707-.707L8.586 8l-2.293-2.293a1 1 0 00-1.414 1.414L7.586 9l-2.707 2.707a1 1 0 101.414 1.414L8.586 10l2.707 2.707a1 1 0 001.414-1.414L10 8.414l2.293-2.293A1 1 0 0013 5z" clipRule="evenodd" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-teal-600 font-medium text-sm transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors duration-200 shadow-sm hover:shadow"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar (for smaller screens) */}
      <div className="md:hidden px-4 py-3 border-t border-gray-100">
        <form onSubmit={handleSearch} className="relative w-full">
          <div className="relative flex items-center w-full h-12 rounded-full focus-within:shadow-lg bg-gray-50 overflow-hidden group border border-gray-200 focus-within:border-teal-500 hover:border-teal-400 transition-all duration-200">
            <div className="grid place-items-center h-full w-12 text-gray-400 group-hover:text-teal-500 transition-colors duration-200">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search for announcements..."
              className="peer h-full w-full outline-none text-sm text-gray-700 bg-gray-50 px-2 group-focus-within:bg-white transition-colors duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="h-full px-2 text-gray-400 hover:text-gray-600 transition-all duration-200"
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              className="h-full px-5 bg-teal-500 text-white font-medium hover:bg-teal-600 transition-all duration-200 flex items-center gap-2"
              aria-label="Search"
            >
              <span>Search</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
