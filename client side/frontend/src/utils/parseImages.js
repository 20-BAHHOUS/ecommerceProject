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

    // Clean up the filename
    let cleanFilename = filename;
    
    // Handle different path formats
    if (filename.includes('\\')) {
      // Windows-style path
      cleanFilename = filename.split('\\').pop();
    } else if (filename.includes('/')) {
      // Unix-style path
      cleanFilename = filename.split('/').pop();
    }

    // Remove any query parameters or hashes
    cleanFilename = cleanFilename.split('?')[0].split('#')[0];
    
    // Ensure the filename is properly encoded
    const encodedFile = encodeURIComponent(cleanFilename);
    
    // Build the URL with the correct base path
    let imageUrl;
    if (filename.startsWith('/')) {
      // If it starts with /, append to backend URL directly
      imageUrl = `${BACKEND_URL}${filename}`;
    } else {
      // Otherwise, use the annonce-images directory
      imageUrl = `${BACKEND_URL}/annonce-images/${encodedFile}`;
    }

    // Cache the result
    imagePathCache.set(filename, imageUrl);
    
    return imageUrl;
  } catch (error) {
    console.error('Error parsing image path:', error, 'Filename:', filename);
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