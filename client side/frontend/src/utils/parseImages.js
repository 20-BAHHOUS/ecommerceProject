// Create a simple cache to avoid recomputing the same paths multiple times
const imagePathCache = new Map();
const imageLoadCache = new Map();

// Base URL for the backend server
const BACKEND_URL = 'http://localhost:4000';

/**
 * Convert image filename to proper URL path
 * @param {string} filename - The image filename/path from the server
 * @returns {string} - The full URL to the image or placeholder if invalid
 */
export const parseImages = (filename) => {
  // Return placeholder for null, undefined, or empty filenames
  if (!filename || filename === '') {
    return '/placeholder-image.png';
  }
  
  // Check if this image has already failed to load
  if (imageLoadCache.get(filename) === false) {
    return '/placeholder-image.png';
  }

  // Check cache first to avoid redundant processing
  if (imagePathCache.has(filename)) {
    return imagePathCache.get(filename);
  }
  
  try {
    // Check if the filename is already a full URL
    if (filename.startsWith('http') || filename.startsWith('data:')) {
      imagePathCache.set(filename, filename);
      return filename;
    }

    // Normalize path - replace Windows backslashes with forward slashes
    const normalizedPath = filename.replace(/\\/g, '/');
    
    // Simple and direct approach to handle all image paths
    let imageUrl;
    
    // If path already starts with 'uploads/', just append to backend URL
    if (normalizedPath.startsWith('uploads/')) {
      imageUrl = `${BACKEND_URL}/${normalizedPath}`;
    } 
    // For filenames that might just have the filename portion
    else if (!normalizedPath.includes('/')) {
      imageUrl = `${BACKEND_URL}/uploads/annonces/${normalizedPath}`;
    }
    // For any other path format
    else {
      // Remove any leading ./ from the path
      const cleanPath = normalizedPath.replace(/^\.\//, '');
      imageUrl = `${BACKEND_URL}/${cleanPath}`;
    }

    // Cache the result
    imagePathCache.set(filename, imageUrl);
    
    // For debugging
    console.log('Original path:', filename);
    console.log('Parsed URL:', imageUrl);
    
    return imageUrl;
  } catch (error) {
    console.error('Error parsing image path:', error, filename);
    // Silently handle errors
    markImageAsFailed(filename);
    return '/placeholder-image.png';
  }
};

/**
 * Mark an image as failed to load to prevent future attempts
 * @param {string} filename - The original filename that failed to load
 */
export const markImageAsFailed = (filename) => {
  if (filename) {
    imageLoadCache.set(filename, false);
  }
};

/**
 * Clear the image caches (useful when testing or debugging)
 */
export const clearImageCaches = () => {
  imagePathCache.clear();
  imageLoadCache.clear();
};