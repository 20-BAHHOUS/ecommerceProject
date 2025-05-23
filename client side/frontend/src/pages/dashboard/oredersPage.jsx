import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { Link } from "react-router-dom";
import { FaSpinner, FaExclamationTriangle, FaTrash, FaShoppingBag, FaUser, FaCalendar, FaTag, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { parseImages } from "../../utils/parseImages";

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
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchUserOrders();
  }, []);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-4xl mb-4 text-teal-600" />
        <p className="text-lg text-gray-700">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <FaExclamationTriangle className="text-5xl mb-4 text-red-500 mx-auto" />
          <p className="text-xl font-semibold mb-2 text-gray-800">
            Oops! Something went wrong.
          </p>
          <p className="mb-6 text-gray-600">{error}</p>
          <Link to="/home" className="text-teal-600 hover:text-teal-700 font-medium hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <FaShoppingBag className="text-5xl mb-4 text-gray-400 mx-auto" />
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
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaShoppingBag className="mr-3 text-teal-600" />
              My Orders
            </h1>
          </div>

          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                      {order.annonce && order.annonce.images && order.annonce.images.length > 0 ? (
                        <img
                          className="w-full h-full object-cover"
                          src={parseImages(order.annonce.images[0])}
                          alt={order.annonce.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder-image.png";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <FaShoppingBag className="text-gray-400 text-3xl" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {order.annonce ? order.annonce.title : "N/A"}
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <FaUser className="mr-2 text-teal-600" />
                          <span>Seller: {order.seller ? order.seller.fullName : "N/A"}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FaCalendar className="mr-2 text-teal-600" />
                          <span>Ordered: {formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FaTag className="mr-2 text-teal-600" />
                          <span>Price: {order.annonce ? formatPrice(order.annonce.price) : "N/A"}</span>
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
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : order.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>

                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="flex items-center text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        <FaTrash className="mr-2" />
                        <span>Cancel Order</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
