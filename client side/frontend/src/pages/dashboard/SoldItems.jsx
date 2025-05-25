import React, { useState, useEffect } from 'react';
import { FaSearch, FaSpinner, FaTrash, FaPhone, FaImage, FaCheck, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPaths';
import Navbar from '../../components/layouts/inputs/header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { parseImages } from '../../utils/parseImages';

const SoldItems = () => {
  const [soldItems, setSoldItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
      toast.success(`Order ${status} successfully`);
      // Update the order status in the state
      setSoldItems(prevItems => prevItems.map(item => 
        item._id === orderId ? { ...item, status } : item
      ));
    } catch (err) {
      console.error(`Error updating order status:`, err);
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.error ||
        `Failed to update the order status.`
      );
    }
  };
  
  const formatPrice = (price) => {
    if (price === undefined || price === null) return "0 DZD";
    
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
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
        case 'date':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'price':
          return (b.annonce?.price || 0) - (a.annonce?.price || 0);
        case 'title':
          return (a.annonce?.title || '').localeCompare(b.annonce?.title || '');
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100">
        <Navbar />
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
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchSoldItems}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100">
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Sold Items</h1>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title or buyer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="price">Sort by Price</option>
                <option value="title">Sort by Title</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="accepted">Accepted</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Items List */}
          {filteredAndSortedItems.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No sold items found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedItems.filter(item => item != null).map((item, index) => (
                    <tr key={item._id || `sold-item-${index}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.annonce?.images && item.annonce.images.length > 0 ? (
                            <Link to={`/annonces/${item.annonce._id}`}>
                              <img
                                src={parseImages(item.annonce.images[0])}
                                alt={item.annonce?.title || 'Item image'}
                                className="h-10 w-10 rounded-md object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                onError={(e) => {
                                  e.target.src = '/placeholder-image.jpg';
                                  e.target.onerror = null;
                                }}
                              />
                            </Link>
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                              <FaImage className="text-gray-400" />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              <Link to={`/annonces/${item.annonce?._id}`} className="hover:text-teal-600 transition-colors">
                                {item.annonce?.title || 'N/A'}
                              </Link>
                            </div>
                            <div className="text-sm text-gray-500">{item.annonce?.description || 'No description'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.buyer?.fullName || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{item.buyer?.email || 'N/A'}</div>
                        {item.buyer?.phone && (
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <FaPhone className="mr-1 text-xs text-teal-600" />
                            {item.buyer.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatPrice(item.annonce?.price)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-sm font-medium rounded-md
                          ${item.status === 'accepted' ? 'bg-green-100 text-green-800' : ''}
                          ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${item.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                          ${item.status === 'cancelled' ? 'bg-gray-100 text-gray-800' : ''}
                          ${!item.status ? 'bg-gray-100 text-gray-800' : ''}
                        `}>
                          {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {item.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateOrderStatus(item._id, 'accepted')}
                                className="text-green-600 hover:text-green-800 transition-colors p-1 bg-green-50 rounded-full"
                                title="Accept order"
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={() => handleUpdateOrderStatus(item._id, 'rejected')}
                                className="text-red-600 hover:text-red-800 transition-colors p-1 bg-red-50 rounded-full"
                                title="Reject order"
                              >
                                <FaTimes />
                              </button>
                            </>
                          )}
                          {item.status === 'accepted' && (
                            <button
                              onClick={() => handleDeleteOrder(item._id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Delete order"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoldItems; 