import React from "react";
import { Link } from "react-router-dom";
import { Search, User, Heart, Bell, MessageSquare } from "lucide-react"; // Import icons
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { FaCaretDown } from "react-icons/fa";
import axiosInstance from "../../../utils/axiosInstance";
import API_PATHS from "../../../utils/apiPaths";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    if (token) {
      fetchNotifications();
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      
      // Update order status
      const orderResponse = await axiosInstance.put(`/orders/${orderId}/status`, {
        orderId: orderId,
        status: action
      });

      if (orderResponse.data.success) {
        // Mark notification as read only if order update was successful
        await axiosInstance.put(`/notifications/${notificationId}/read`);
        
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
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-300">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between h-15">
        {/* Logo */}
        <Link to="/home" className="text-2xl font-bold text-teal-500">
          Loopify
        </Link>

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
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={toggleNotifications}
                  className="relative focus:outline-none"
                >
                  <Bell className="h-6 w-6 text-gray-700 hover:text-teal-500" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                              !notification.isRead ? 'bg-teal-50' : ''
                            }`}
                          >
                            <p className="text-sm text-gray-800 mb-2">
                              {notification.message}
                            </p>
                            {notification.type === 'ORDER_REQUEST' && !notification.isRead && (
                              <div className="flex space-x-2 mt-2">
                                <button
                                  onClick={() => handleOrderAction(notification._id, notification.relatedOrder._id || notification.relatedOrder, 'accepted')}
                                  className="px-3 py-1 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 transition-colors duration-200"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleOrderAction(notification._id, notification.relatedOrder._id || notification.relatedOrder, 'rejected')}
                                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors duration-200"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Link to="/messages" className="relative">
                <MessageSquare className="h-6 w-6 text-gray-700 hover:text-teal-500" />
              </Link>
              <div className="relative" ref={dropdownRef}>
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
                      to="/userannonces"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      My Announcements
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Display login/register when not logged in
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-teal-500 font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-200"
              >
                Sign Up
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
