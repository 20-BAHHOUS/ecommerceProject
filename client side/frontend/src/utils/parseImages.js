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

    // Handle the server's image path format
    let imageUrl;
    
    // If it starts with 'uploads/' or '/uploads/', append to backend URL
    if (filename.startsWith('uploads/') || filename.startsWith('/uploads/')) {
      const cleanPath = filename.startsWith('/') ? filename : `/${filename}`;
      imageUrl = `${BACKEND_URL}${cleanPath}`;
    } 
    // If it has a specific format used by the server (path with timestamp and ID)
    else if (filename.includes('images-')) {
      // Make sure we handle the correct path
      if (!filename.startsWith('/')) {
        imageUrl = `${BACKEND_URL}/uploads/annonces/${filename.split('/').pop()}`;
      } else {
        imageUrl = `${BACKEND_URL}${filename}`;
      }
    }
    // For Windows-style paths, extract the filename and use the annonce-images directory
    else if (filename.includes('\\')) {
      const cleanFilename = filename.split('\\').pop().split('?')[0].split('#')[0];
      imageUrl = `${BACKEND_URL}/annonce-images/${encodeURIComponent(cleanFilename)}`;
    } 
    // For other paths, try direct access or fallback to annonce-images
    else {
      // Remove any query parameters or hashes
      const cleanFilename = filename.split('/').pop().split('?')[0].split('#')[0];
      
      // If the filename looks like a server path (e.g., contains timestamp format)
      if (filename.startsWith('/')) {
        imageUrl = `${BACKEND_URL}${filename}`;
      } else {
        imageUrl = `${BACKEND_URL}/annonce-images/${encodeURIComponent(cleanFilename)}`;
      }
    }

    // Cache the result
    imagePathCache.set(filename, imageUrl);
    
    return imageUrl;
  } catch (error) {
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