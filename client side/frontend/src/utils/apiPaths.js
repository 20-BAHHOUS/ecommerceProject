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
  CATEGORIES: {
    GET_ALL: "/categories",
    GET_BY_ID: (id) => `/categories/${id}`,
    GET_ANNOUNCEMENTS: (category, subcategory) => 
      subcategory 
        ? `/categories/${category}/${subcategory}/announcements`
        : `/categories/${category}/announcements`,
    GET_STATS: "/categories/stats/counts"
  },
  ANNONCE: {
    ADD_GET_ANNONCE: "/annonce",
    ANNONCE_BY_ID: (annonceId) => `/annonce/${annonceId}`,
    GET_ANNONCES_BY_USER: (userId) => `/annonce/getByUser/${userId}`,
  },
  IMAGE: {
    UPLOAD_IMAGE: "/auth/upload-image",
  },
  ORDER: {
    PLACE_ORDER: "/orders",
    GET_ORDERS_BY_SELLER: "/orders/seller",
    GET_ORDERS_BY_BUYER: "/orders/user",
    UPDATE_ORDER_STATUS: (orderId) => `/orders/${orderId}/status`,
    DELETE_ORDER: (orderId) => `/orders/${orderId}`,
    GET_SOLD_ITEMS: "/orders/seller",
  },
  NOTIFICATIONS: {
    GET_NOTIFICATIONS: "/notifications",
    MARK_AS_READ: (notificationId) => `/notifications/${notificationId}/read`,
    MARK_ALL_AS_READ: "/notifications/mark-all-read",
    DELETE_NOTIFICATION: (notificationId) => `/notifications/${notificationId}`,
    GET_UNREAD_COUNT: "/notifications/unread-count",
  },
};

export default API_PATHS;
