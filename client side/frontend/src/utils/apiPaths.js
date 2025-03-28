export const BASE_URL = "http://localhost:4000";
// utils/apiPaths.js
export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    GET_USER_INFO: "/api/v1/auth/getuser",
  },
  HOME: {
    GET_DATA: "/api/v1/home",
  },
  PRODUCT: {
    ADD_PRODUCT: "/api/v1/annonce/addannonce",
    GET_ALL_PRODUCT: "/api/v1/annonce/getallannonces",
    DELET_PRODUCT: (annonceId) => `/api/v1/annonce/deleteannonce/${annonceId}`,
    UPDATE_PRODUCT: `/api/v1/annonce/updateannonce/:id`,
    GET_PRODUCT: `/api/v1/annonce/getannonce/:id`,
    SEARCH_PRODUCT: `/api/v1/annonce/searchannonces/:query`,
    GET_PRODUCT_BY_CATEGORY: `api/v1/annonce/getannoncesbycategory`,
    GET_PRODUCT_BY_TYPE: `api/v1/annonce/getannoncesbytype`,
    GET_PRODUCT_BY_LOCATION: "api/annonce/getannoncesbylocation",
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/v1/image/upload",
  },

};

export default API_PATHS;
