import axios from "axios";
import {BASE_URL} from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// request Intercepton
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors globelly
    if (error.response) {
      if (error.response.status === 401) {
        // Don't redirect if we're on the login page
        const currentPath = window.location.pathname;
        if (currentPath !== "/login" && currentPath !== "/signup") {
          // Clear token if unauthorized
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          // Redirect to login page instead of home
          window.location.href = "/login";
        }
      } else if (error.response.status === 500) {
        console.error("Server error. Please try later.");
      }
    } else if (error.code === "ECONNABOTED") {
      console.error("Request timeout. Please try again.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
