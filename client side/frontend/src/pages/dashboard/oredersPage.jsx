/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { Link } from "react-router-dom";
import { 
  FaSpinner, 
  FaExclamationTriangle, 
  FaTrash, 
  FaShoppingBag, 
  FaUser, 
  FaCalendar, 
  FaTag, 
  FaMapMarkerAlt,
  FaSearch,
  FaEye,
  FaPhoneAlt,
  FaEnvelope
} from "react-icons/fa";
import { toast } from "react-toastify";
import { parseImages } from "../../utils/parseImages";
import moment from 'moment';
import Navbar from "../../components/layouts/inputs/header";

const formatPrice = (price) => {
  const numericPrice = Number(price);
  if (isNaN(numericPrice)) {
    return "Invalid Price";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "DZD",
  }).format(numericPrice);
};

const formatDate = (date) => {
  return moment(date).format('MMMM D, YYYY [at] h:mm A');
};

const ORDER_STATUS_COLORS = {
  pending: { bg: 'bg-gray-200', text: 'text-gray-700', border: 'border-gray-300' },
  accepted: { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' }
};

const ITEMS_PER_PAGE = 5;

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        API_PATHS.ORDER.GET_ORDERS_BY_BUYER
      );
      setOrders(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to fetch your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await axiosInstance.delete(API_PATHS.ORDER.DELETE_ORDER(orderId));
        toast.success("Order cancelled successfully.");
        setOrders((prevOrders) => prevOrders.filter(order => order._id !== orderId));
      } catch (err) {
        console.error("Error cancelling order:", err);
        toast.error(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to cancel the order."
        );
      }
    }
  };

  const handleDeleteAllOrders = async () => {
    if (filteredOrders.length === 0) return;
    
    if (window.confirm("Are you sure you want to delete ALL your orders? This action cannot be undone.")) {
      try {
        // Delete each order one by one
        const deletePromises = filteredOrders.map(order => 
          axiosInstance.delete(API_PATHS.ORDER.DELETE_ORDER(order._id))
        );
        
        await Promise.all(deletePromises);
        
        // Clear orders from state
        setOrders(prevOrders => prevOrders.filter(order => 
          !filteredOrders.some(filtered => filtered._id === order._id)
        ));
        
        toast.success("All orders deleted successfully");
      } catch (err) {
        console.error("Error deleting all orders:", err);
        toast.error("Failed to delete all orders");
      }
    }
  };

  const handleContactSeller = (seller) => {
    setSelectedSeller(seller);
    setContactModalOpen(true);
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = order.annonce?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.seller?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "price-desc":
          return (b.annonce?.price || 0) - (a.annonce?.price || 0);
        case "price-asc":
          return (a.annonce?.price || 0) - (b.annonce?.price || 0);
        case "date-desc":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <FaSpinner className="animate-spin text-4xl mb-4 text-teal-600" />
          <p className="text-lg text-gray-700">Loading your orders...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="bg-white p-8 rounded-lg border border-gray-200 max-w-md w-full text-center">
            <FaExclamationTriangle className="text-5xl mb-4 text-gray-500 mx-auto" />
            <p className="text-xl font-semibold mb-2 text-gray-800">
              Oops! Something went wrong.
            </p>
            <p className="mb-6 text-gray-600">{error}</p>
            <Link to="/home" className="text-teal-600 hover:text-teal-700 font-medium hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (orders.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg border border-gray-200 max-w-md w-full text-center">
            <FaShoppingBag className="text-5xl mb-4 text-teal-500 mx-auto" />
            <p className="text-xl font-semibold mb-4 text-gray-800">No Orders Yet</p>
            <p className="text-gray-600 mb-6">Start shopping and place your first order!</p>
            <Link 
              to="/home" 
              className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
    
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-gray-600 flex items-center">
                  <FaShoppingBag className="mr-2 text-teal-600" />
                  <span className="font-medium text-gray-700">My Orders</span>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="price-asc">Price: Low to High</option>
                  </select>
                  
                  {filteredOrders.length > 1 && (
                    <button
                      onClick={handleDeleteAllOrders}
                      className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center shadow-sm"
                    >
                      <FaTrash className="mr-2" />
                      DELETE ALL
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                        {order.annonce && order.annonce.images && order.annonce.images.length > 0 ? (
                          <Link to={`/annonces/${order.annonce?._id}`}>
                            <img
                              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              src={parseImages(order.annonce.images[0])}
                              alt={order.annonce.title}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder-image.png";
                              }}
                            />
                          </Link>
                        ) : (
                          <Link to={`/annonces/${order.annonce?._id}`} className="w-full h-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                            <FaShoppingBag className="text-gray-400 text-3xl" />
                          </Link>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {order.annonce ? order.annonce.title : "N/A"}
                          </h3>
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            ORDER_STATUS_COLORS[order.status]?.bg || 'bg-gray-100'
                          } ${ORDER_STATUS_COLORS[order.status]?.text || 'text-gray-800'}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <FaCalendar className="mr-2 text-teal-600" />
                            <span>Ordered: {formatDate(order.createdAt)}</span>
                          </div>
                          {order.annonce && order.annonce.location && (
                            <div className="flex items-center text-sm text-gray-600">
                              <FaMapMarkerAlt className="mr-2 text-teal-600" />
                              <span>{order.annonce.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 lg:mt-0 flex flex-col items-end space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleContactSeller(order.seller)}
                          className="inline-flex items-center px-3 py-2 border border-teal-200 rounded-md text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100"
                        >
                          <FaEnvelope className="mr-2 text-teal-600" />
                          Contact Seller
                        </button>

                        {order.status === "pending" && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100"
                          >
                            <FaTrash className="mr-2 text-gray-600" />
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                          currentPage === page
                            ? 'bg-teal-600 text-white border border-teal-600'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {contactModalOpen && selectedSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full border border-gray-200 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Contact Seller</h3>
              <button 
                onClick={() => setContactModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-center">
                <div className="bg-teal-100 p-3 rounded-full">
                  <FaUser className="text-teal-600 text-xl" />
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">{selectedSeller.fullName}</h4>
                  <p className="text-sm text-gray-500">Seller</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {selectedSeller.email && (
                <div className="p-3 border border-gray-200 rounded-lg bg-white">
                  <div className="flex items-center mb-2">
                    <FaEnvelope className="text-blue-600 mr-2" />
                    <p className="font-medium text-gray-700">Email</p>
                  </div>
                  <p className="text-gray-800 break-all pl-6">
                    {selectedSeller.email}
                  </p>
                </div>
              )}
              
              {selectedSeller.phone && (
                <div className="p-3 border border-gray-200 rounded-lg bg-white">
                  <div className="flex items-center mb-2">
                    <FaPhoneAlt className="text-green-600 mr-2" />
                    <p className="font-medium text-gray-700">Phone</p>
                  </div>
                  <p className="text-gray-800 pl-6">
                    {selectedSeller.phone}
                  </p>
                </div>
              )}
              
              {!selectedSeller.email && !selectedSeller.phone && (
                <div className="text-center py-6">
                  <div className="bg-yellow-50 p-3 rounded-lg inline-block mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">No contact information available for this seller.</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setContactModalOpen(false)}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrdersPage;
