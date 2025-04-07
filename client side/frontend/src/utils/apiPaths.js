const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
// utils/apiPaths.js
const API_PATHS = {
  AUTH: {
    LOGIN: `${BASE_URL}/api/v1/auth/login`,
    REGISTER: `${BASE_URL}/api/v1/auth/register`,
    GET_USER_INFO: `${BASE_URL}/api/v1/auth/getuser`,
  },
  HOME: {
    GET_DATA: `${BASE_URL}/api/v1/home`,
  },
  ANNONCE: {
    ADD_ANNONCE: `${BASE_URL}/api/v1/annonce/addannonce`,
    GET_ALL_ANNONCES: `${BASE_URL}/api/v1/annonce/getallannonces`,
    DELET_ANNONCE: (annonceId) => `${BASE_URL}/api/v1/annonce/deleteannonce/${annonceId}`,
    UPDATE_ANNONCE: `${BASE_URL}/api/v1/annonce/updateannonce/:id`,
    GET_ANNONCE: `${BASE_URL}/api/v1/annonce/getannonce/:id`,
    SEARCH_ANNONCE: `${BASE_URL}/api/v1/annonce/searchannonces/:query`,
    GET_ANNONCE_BY_CATEGORY: `${BASE_URL}api/v1/annonce/getannoncesbycategory`,
    GET_ANNONCE_BY_TYPE: `${BASE_URL}api/v1/annonce/getannoncesbytype`,
    
  },
  IMAGE: {
    UPLOAD_IMAGE: `${BASE_URL}/api/v1/image/upload`,
  },

};

export default API_PATHS;
