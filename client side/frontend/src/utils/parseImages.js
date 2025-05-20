// Create a simple cache to avoid recomputing the same paths multiple times
const imagePathCache = new Map();

/**
 * Convert image filename to proper URL path
 * @param {string} filename - The image filename/path from the server
 * @returns {string} - The full URL to the image or placeholder if invalid
 */
export const parseImages = (filename) => {
  // Return placeholder for null or undefined filenames
  if (!filename) return '/placeholder-image.png';
  
  // Check cache first to avoid redundant processing
  if (imagePathCache.has(filename)) {
    return imagePathCache.get(filename);
  }
  
  try {
    // Check if the filename is already a URL
    if (filename.startsWith('http')) {
      imagePathCache.set(filename, filename);
      return filename;
    }
    
    // Handle different path formats
    let file;
    if (filename.includes('\\')) {
      // Windows-style path
      file = filename.split('\\').reverse()[0];
    } else if (filename.includes('/')) {
      // Unix-style path
      file = filename.split('/').reverse()[0];
    } else {
      // Already just the filename
      file = filename;
    }
    
    // Build the URL
    const imageUrl = `http://localhost:4000/annonce-images/${file}`;
    
    // Cache the result
    imagePathCache.set(filename, imageUrl);
    
    return imageUrl;
  } catch {
    // In case of any errors, return placeholder
    return '/placeholder-image.png';
  }
};