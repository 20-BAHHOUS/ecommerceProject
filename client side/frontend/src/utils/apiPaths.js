export const BASE_URL = "http://localhost:4000";

// utils/apiPaths.js
export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    GET_USER_INFO: "/auth/getuser",
  },
  HOME: {
    GET_DATA: "/home",
  },
  ANNONCE: {
    ADD_GET_ANNONCE: "/annonce",
    ANNONCE_BY_ID: (annonceId) => `/annonce/${annonceId}`,
  },
  IMAGE: {
    UPLOAD_IMAGE: "/image/upload",
  },
};

export default API_PATHS;
