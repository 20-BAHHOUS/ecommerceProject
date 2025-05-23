export const BASE_URL = "http://localhost:4000";

// utils/apiPaths.js
export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    GET_USER_INFO: "/auth/getuser",
    UPDATE_PROFILE: "/auth/profile", 
    UPDATE_PASSWORD: "/auth/password", 
  },
  HOME: {
    GET_DATA: "/home",
  },
  ANNONCE: {
    ADD_GET_ANNONCE: "/annonce",
    ANNONCE_BY_ID: (annonceId) => `/annonce/${annonceId}`,
    GET_ANNONCES_BY_USER: (userId) => `/annonce/getByUser/${userId}`,
  },
  IMAGE: {
    UPLOAD_IMAGE: "/image/upload",
  },
  ORDER: {
    PLACE_ORDER: "/orders",
    GET_ORDERS_BY_SELLER: "/orders/seller",
    GET_ORDERS_BY_BUYER: "/orders/user",
    UPDATE_ORDER_STATUS: (orderId) => `/orders/${orderId}/status`,
    DELETE_ORDER: (orderId) => `/orders/${orderId}`,
  },
};

export default API_PATHS;
