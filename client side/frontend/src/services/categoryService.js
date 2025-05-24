
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const getCategories = async () => {
  try {
    console.log('Initiating categories fetch request');
    const response = await axiosInstance.get(API_PATHS.CATEGORIES.GET_ALL);
    console.log('Raw categories response:', response);
    
    // Detailed response validation
    if (!response) {
      throw new Error('No response received from server');
    }

    if (!response.data) {
      throw new Error('No data received in the response');
    }

    if (!response.data.success) {
      throw new Error(response.data.message || 'Server returned unsuccessful response');
    }

    if (!response.data.data || !Array.isArray(response.data.data)) {
      console.error('Invalid data structure:', response.data);
      throw new Error('Invalid data structure received from server');
    }

    console.log('Successfully fetched categories:', response.data.data.length, 'categories found');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });

    if (error.response?.status === 404) {
      throw new Error('Categories endpoint not found');
    }
    if (error.response?.status === 401) {
      throw new Error('Unauthorized access to categories');
    }
    if (error.response?.status === 500) {
      throw new Error('Server error while fetching categories');
    }
    throw new Error(`Failed to load categories: ${error.message}`);
  }
};

const getCategoryById = async (categoryId) => {
  try {
    const response = await axiosInstance.get(API_PATHS.CATEGORIES.GET_BY_ID(categoryId));
    return response.data.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

const getAnnoncesByMainCategory = async (category, subcategory = null) => {
  try {
    if (!category) {
      throw new Error('Category parameter is required');
    }

    const url = API_PATHS.CATEGORIES.GET_ANNOUNCEMENTS(category, subcategory);
    
    console.log('Making API request to:', url);
    const response = await axiosInstance.get(url);
    console.log('Category announcements response:', response.data);
    
    // More detailed response validation
    if (!response.data) {
      throw new Error('No data received from server');
    }

    if (!response.data.success) {
      throw new Error(response.data.message || 'Server returned unsuccessful response');
    }
    
    if (!response.data.data || !Array.isArray(response.data.data)) {
      throw new Error('Invalid data format received');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching category announcements:', {
      error: error.message,
      category,
      subcategory,
      response: error.response?.data,
      status: error.response?.status
    });

    if (error.response?.status === 404) {
      throw new Error(`Category ${subcategory ? 'or subcategory ' : ''}not found`);
    }
    if (error.response?.status === 401) {
      throw new Error('Unauthorized access');
    }
    if (error.response?.status === 500) {
      throw new Error('Server error occurred');
    }
    throw error;
  }
};

const getCategoryStats = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.CATEGORIES.GET_STATS);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching category statistics:', error);
    throw error;
  }
};

export {
  getCategories,
  getCategoryById,
  getAnnoncesByMainCategory,
  getCategoryStats
}; 