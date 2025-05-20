/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { Link } from "react-router-dom";
import { FaSpinner, FaExclamationTriangle, FaTrash } from "react-icons/fa";
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
        await axiosInstance.put(API_PATHS.ORDER.UPDATE_ORDER_STATUS(orderId), {
          status: "cancelled",
        });
        toast.success("Order cancelled successfully.");

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "cancelled" } : order
          )
        );
      } catch (err) {
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
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <FaSpinner className="animate-spin text-4xl mb-4 text-indigo-500" />
        <p className="text-lg">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600 p-4 text-center">
        <FaExclamationTriangle className="text-5xl mb-4" />
        <p className="text-xl font-semibold mb-2">
          Oops! Something went wrong.
        </p>
        <p className="mb-4">{error}</p>
        <Link to="/" className="text-indigo-600 hover:underline">
          Go back to Home
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <p className="text-xl">You haven't placed any orders yet.</p>
        <Link to="/home" className="mt-4 text-indigo-600 hover:underline">
          Explore Announcements
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">My Orders</h1>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Item
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Order Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {order.annonce &&
                      order.annonce.images &&
                      order.annonce.images.length > 0 ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={parseImages(order.annonce.images[0])}
                          alt={order.annonce.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder-image.png";
                          }}
                        />
                      ) : (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src="/placeholder-image.png"
                          alt="No Image"
                        />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {order.annonce ? order.annonce.title : "N/A"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.annonce ? formatPrice(order.annonce.price) : "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : order.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800" // For 'cancelled' or other unknown statuses
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {order.status === "pending" && ( // Only show cancel button if status is 'pending'
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="text-red-600 hover:text-red-900 focus:outline-none flex items-center justify-end"
                    >
                      <FaTrash className="h-4 w-4 mr-1" />
                      <span>Cancel</span>
                    </button>
                  )}
                  {order.status !== "pending" && (
                    <span className="text-gray-500 italic">No action</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrdersPage;
