import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaSpinner, 
  FaTrash, 
  FaPhone, 
  FaImage, 
  FaCheck, 
  FaTimes, 
  FaCalendar,
  FaTag,
  FaShoppingBag,
  FaExclamationTriangle,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPaths';
import Navbar from '../../components/layouts/inputs/header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { parseImages } from '../../utils/parseImages';
import MultiLevelNavbar from "../../components/layouts/inputs/navBarCategories";
import Footer from "../../components/layouts/inputs/footer";
import moment from 'moment';

const formatPrice = (price) => {
  if (price === undefined || price === null) return "0 DZD";
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (date) => {
  return moment(date).format('MMMM D, YYYY [at] h:mm A');
};

const ORDER_STATUS_COLORS = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
  accepted: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  rejected: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' }
};

const ITEMS_PER_PAGE = 5;

const SoldItems = () => {
  const [soldItems, setSoldItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date-desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  useEffect(() => {
    fetchSoldItems();
  }, []);

  const fetchSoldItems = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.ORDER.GET_SOLD_ITEMS);
      console.log('Sold items response:', response.data);
      
      const items = Array.isArray(response.data?.data) ? response.data.data : [];
      setSoldItems(items);
      setError(null);
    } catch (err) {
      console.error('Error fetching sold items:', err);
      setSoldItems([]); 
      setError('Failed to load sold items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axiosInstance.delete(API_PATHS.ORDER.DELETE_ORDER(orderId));
        toast.success("Order deleted successfully");
        // Remove the deleted order from the state
        setSoldItems(prevItems => prevItems.filter(item => item._id !== orderId));
      } catch (err) {
        console.error("Error deleting order:", err);
        toast.error(
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete the order."
        );
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await axiosInstance.put(API_PATHS.ORDER.UPDATE_ORDER_STATUS(orderId), { status });
      
      if (status === 'rejected') {
        // Delete the order if it's rejected
        await axiosInstance.delete(API_PATHS.ORDER.DELETE_ORDER(orderId));
        toast.success("Order rejected and removed");
        // Remove the rejected order from the state
        setSoldItems(prevItems => prevItems.filter(item => item._id !== orderId));
      } else {
        toast.success(`Order ${status} successfully`);
        // Update the order status in the state
        setSoldItems(prevItems => prevItems.map(item => 
          item._id === orderId ? { ...item, status } : item
        ));
      }
    } catch (err) {
      console.error(`Error updating order status:`, err);
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.error ||
        `Failed to update the order status.`
      );
    }
  };
  
  const items = Array.isArray(soldItems) ? soldItems : [];
  
  const filteredAndSortedItems = items
    .filter(item => {
      if (!item) return false;
      if (filterStatus === 'all') return true;
      return item.status === filterStatus;
    })
    .filter(item => {
      if (!item || (!item.annonce && !item.buyer)) return false;
      const titleMatch = item.annonce?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const buyerMatch = item.buyer?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      return searchQuery === '' || titleMatch || buyerMatch;
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'price-desc':
          return (b.annonce?.price || 0) - (a.annonce?.price || 0);
        case 'price-asc':
          return (a.annonce?.price || 0) - (b.annonce?.price || 0);
        case 'date-desc':
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

  const totalPages = Math.ceil(filteredAndSortedItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredAndSortedItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleContactBuyer = (buyer) => {
    setSelectedBuyer(buyer);
    setContactModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <MultiLevelNavbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading sold items...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <MultiLevelNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg border border-gray-200 max-w-md w-full text-center">
              <FaExclamationTriangle className="text-5xl mb-4 text-gray-500 mx-auto" />
              <p className="text-xl font-semibold mb-2 text-gray-800">Oops! Something went wrong.</p>
              <p className="mb-6 text-gray-600">{error}</p>
              <button
                onClick={fetchSoldItems}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <MultiLevelNavbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-100">
          <div className="bg-white p-8 rounded-lg border border-gray-200 max-w-md w-full text-center">
            <FaShoppingBag className="text-5xl mb-4 text-teal-500 mx-auto" />
            <p className="text-xl font-semibold mb-4 text-gray-800">No Sold Items Yet</p>
            <p className="text-gray-600 mb-6">You haven't sold any items yet.</p>
            <Link 
              to="/user/dashboard" 
              className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <MultiLevelNavbar />
      <ToastContainer />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-gray-600 flex items-center">
                  <FaShoppingBag className="mr-2 text-teal-600" />
                  <span className="font-medium text-gray-700">Sold Items</span>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by title or buyer name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="accepted">Accepted</option>
                    <option value="pending">Pending</option>
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
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {paginatedItems.map((item, index) => (
                <div key={item._id || `sold-item-${index}`} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-200 mt-3">
                        {item.annonce?.images && item.annonce.images.length > 0 ? (
                          <Link to={`/annonces/${item.annonce._id}`}>
                            <img
                              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              src={parseImages(item.annonce.images[0])}
                              alt={item.annonce?.title || 'Item image'}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder-image.png";
                              }}
                            />
                          </Link>
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <FaImage className="text-gray-400 text-3xl" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            <Link to={`/annonces/${item.annonce?._id}`} className="hover:text-teal-600 transition-colors">
                              {item.annonce?.title || 'N/A'}
                            </Link>
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold mt-1
                            ${ORDER_STATUS_COLORS[item.status]?.bg || 'bg-gray-100'} 
                            ${ORDER_STATUS_COLORS[item.status]?.text || 'text-gray-800'}`}
                          >
                            {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Unknown'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                          <div className="flex flex-col space-y-2.5">
                            <div className="flex items-center text-sm text-gray-600">
                              <FaCalendar className="mr-2 text-teal-600 flex-shrink-0" />
                              <span>Ordered: {formatDate(item.createdAt)}</span>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600">
                              <FaTag className="mr-2 text-teal-600 flex-shrink-0" />
                              <span>Price: {formatPrice(item.annonce?.price)}</span>
                            </div>
                            
                            {item.negotiablePrice && (
                              <div className="flex items-center text-sm font-medium text-teal-700">
                                <FaTag className="mr-2 text-teal-600 flex-shrink-0" />
                                <span>Buyer offer: {formatPrice(item.negotiablePrice)}</span>
                              </div>
                            )}
                            
                            {item.annonce?.location && (
                              <div className="flex items-center text-sm text-gray-600">
                                <FaMapMarkerAlt className="mr-2 text-teal-600 flex-shrink-0" />
                                <span>{item.annonce.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 lg:mt-3 flex flex-col items-end space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleContactBuyer(item.buyer)}
                          className="inline-flex items-center px-3 py-2 border border-teal-200 rounded-md text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100"
                        >
                          <FaEnvelope className="mr-2 text-teal-600" />
                          Contact Buyer
                        </button>
                        
                        {item.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateOrderStatus(item._id, 'accepted')}
                              className="inline-flex items-center px-3 py-2 border border-green-200 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100"
                            >
                              <FaCheck className="mr-2 text-green-600" />
                              Accept Order
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(item._id, 'rejected')}
                              className="inline-flex items-center px-3 py-2 border border-red-200 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100"
                            >
                              <FaTimes className="mr-2 text-red-600" />
                              Reject Order
                            </button>
                          </>
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
      {contactModalOpen && selectedBuyer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full border border-gray-200 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Buyer Information</h3>
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
                  <h4 className="font-medium text-gray-900">{selectedBuyer.fullName}</h4>
                  <p className="text-sm text-gray-500">Buyer</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {selectedBuyer.email && (
                <div className="p-3 border border-gray-200 rounded-lg bg-white">
                  <div className="flex items-center mb-2">
                    <FaEnvelope className="text-blue-600 mr-2" />
                    <p className="font-medium text-gray-700">Email</p>
                  </div>
                  <p className="text-gray-800 break-all pl-6">
                    {selectedBuyer.email}
                  </p>
                </div>
              )}
              
              {selectedBuyer.phone && (
                <div className="p-3 border border-gray-200 rounded-lg bg-white">
                  <div className="flex items-center mb-2">
                    <FaPhone className="text-green-600 mr-2" />
                    <p className="font-medium text-gray-700">Phone</p>
                  </div>
                  <p className="text-gray-800 pl-6">
                    {selectedBuyer.phone}
                  </p>
                </div>
              )}
              
              {!selectedBuyer.email && !selectedBuyer.phone && (
                <div className="text-center py-6">
                  <div className="bg-yellow-50 p-3 rounded-lg inline-block mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">No contact information available for this buyer.</p>
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
      <Footer />
    </>
  );
};

export default SoldItems;