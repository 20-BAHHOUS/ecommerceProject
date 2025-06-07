import Annonce from "../models/annonce.js";
import Order from "../models/order.js";

const addAnnonce = async (req, res, next) => {
  try {

    const { body } = req;

   
    body.createdBy = req.user._id;

   
    body.images = req.files.map((file) => {

      return file.path.replace(/\\/g, '/').replace(/^\.\//, '');
    });

    //create a new annonce in database
    const newAnnonce = new Annonce(body);

    await newAnnonce.save();
    res.status(201).json({
      success: true,
      data: newAnnonce,
    });
  } catch (error) {
    console.error("Error creating annonce:", error);
    
    // Provide more detailed validation errors if available
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      
      // Extract validation error messages for each field
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error creating annonce",
      error: error.message
    });
  }
};

//Get all annonces
const getAllAnnonces = async (req, res) => {
  try {
    const { sort } = req.query;
    let sortOptions = { createdAt: -1 }; // Default sort: newest first
    let filterOptions = {}; // Default: no filter
    
    // Handle different sort options
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 }; // Oldest first
    } else if (sort === 'price-high') {
      sortOptions = { price: -1 }; // Price high to low
    } else if (sort === 'price-low') {
      sortOptions = { price: 1 }; // Price low to high
    } else if (sort === 'type-sale') {
      filterOptions = { type: 'sale' }; // Filter by sale type
    } else if (sort === 'type-trade') {
      filterOptions = { type: 'trade' }; // Filter by trade type
    } else if (sort === 'type-rent') {
      filterOptions = { type: 'rent' }; // Filter by rent type
    }
    
    // Find all announcements that don't have accepted orders
    const annoncesWithAcceptedOrders = await Order.find({ status: 'accepted' }).distinct('annonce');
    
    // Add filter to exclude announcements with accepted orders
    filterOptions._id = { $nin: annoncesWithAcceptedOrders };
    
    // If user is logged in, exclude their own announcements
    if (req.user && req.user._id) {
      // Add current user's ID to filter (exclude their announcements)
      filterOptions.createdBy = { $ne: req.user._id };
    }
    
    const annonces = await Annonce.find(filterOptions).sort(sortOptions);
    res.json(annonces);
  } catch (error) {
    console.error("Error getting annonces:", error);
    res.status(500).json({
      message: "Error getting annonces",
    });
  }
};

//Get annonce by id
const getAnnonceById = async (req, res) => {
  try {
    // Find the annonce and populate necessary fields
    const annonce = await Annonce.findById(req.params.id)
      .populate("createdBy", "_id fullName email phone location")
      .populate("category", "name")
      .populate("subcategory", "name");
    
    if (!annonce) {
      return res.status(404).json({ error: "Annonce not found" });
    }
    
    res.status(200).json(annonce);
  } catch (error) {
    console.error("Error getting annonce by ID:", error);
    res.status(500).json({
      message: "Error getting annonce",
    });
  }
};

//Delete annonce by id
const deleteAnnonceById = async (req, res) => {
  try {
    const annonce = await Annonce.findByIdAndDelete(req.params.id);
    if (!annonce) {
      return res.status(404).json({ error: "Annonce not found" });
    }
    res.status(200).json({ message: "Annonce deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting annonce",
    });
  }
};

//Update Annonce by id
const updateAnnonceById = async (req, res) => {
  try {
    // Check if the annonce exists and belongs to the user
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) {
      return res.status(404).json({ 
        success: false,
        message: "Annonce not found" 
      });
    }

    // Check if user has permission to update this annonce
    if (annonce.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: "You are not authorized to update this annonce" 
      });
    }

    // Prepare the update data
    const updateData = { ...req.body };
    
    // Handle image updates
    if (req.files && req.files.length > 0) {
      // If there are new uploaded files
      const newImagePaths = req.files.map(file => file.path.replace(/\\/g, '/').replace(/^\.\//, ''));
      
      // Handle existing images if provided
      if (req.body.existingImages) {
        try {
          // Parse the JSON string of existing images to keep
          const existingImages = JSON.parse(req.body.existingImages);
          // Combine existing and new images
          updateData.images = [...existingImages, ...newImagePaths];
        } catch (e) {
          console.error("Error parsing existingImages:", e);
          // Fallback to just using new images if parsing fails
          updateData.images = newImagePaths;
        }
      } else {
        // If no existing images specified, use only new uploads
        updateData.images = newImagePaths;
      }
    } else if (req.body.existingImages) {
      // If no new uploads but existing images are specified
      try {
        updateData.images = JSON.parse(req.body.existingImages);
      } catch (e) {
        console.error("Error parsing existingImages:", e);
        // If parsing fails, keep the original images
        updateData.images = annonce.images;
      }
    }
    
    // Remove unnecessary fields from updateData that were only needed for processing
    delete updateData.existingImages;
    delete updateData.removedImages;

    // Update the annonce with the new data
    const updatedAnnonce = await Annonce.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedAnnonce
    });
  } catch (error) {
    console.error("Error updating annonce:", error);
    res.status(500).json({
      success: false,
      message: "Error updating annonce",
      error: error.message
    });
  }
};

const getUserAnnonces = async (req, res) => {
  try {
    const { id } = req.params;
    const { sort } = req.query;
    
    // Determine sort options
    let sortOptions = { createdAt: -1 }; // Default sort: newest first
    let filterOptions = { createdBy: id }; // Base filter by user ID
    
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 }; // Oldest first
    } else if (sort === 'price-high') {
      sortOptions = { price: -1 }; // Price high to low
    } else if (sort === 'price-low') {
      sortOptions = { price: 1 }; // Price low to high
    } else if (sort === 'type-sale') {
      filterOptions = { createdBy: id, type: 'sale' }; // Filter by sale type
    } else if (sort === 'type-trade') {
      filterOptions = { createdBy: id, type: 'trade' }; // Filter by trade type
    } else if (sort === 'type-rent') {
      filterOptions = { createdBy: id, type: 'rent' }; // Filter by rent type
    }
    
    const annonces = await Annonce.find(filterOptions)
      .sort(sortOptions)
      .lean();
    if (!annonces) {
      return res.status(404).json({ message: "No annonces found ." });
    }
    res.status(201).json({ success: true, data: annonces });
  } catch (error) {
    res.status(500).json({
      message: "Error getting annonces",
    });
  }
};

// Search for annonces based on a query string
const searchAnnonces = async (req, res) => {
  try {
    const { query, sort } = req.query;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: "Search query is required" 
      });
    }

    // Create a regex pattern for case-insensitive search
    const searchRegex = new RegExp(query, 'i');

    // Determine sort options
    let sortOptions = { createdAt: -1 }; // Default sort: newest first
    let filterOptions = {
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { type: searchRegex },
        { condition: searchRegex },
      ]
    };
    
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 }; // Oldest first
    } else if (sort === 'price-high') {
      sortOptions = { price: -1 }; // Price high to low
    } else if (sort === 'price-low') {
      sortOptions = { price: 1 }; // Price low to high
    } else if (sort === 'type-sale') {
      filterOptions = {
        $and: [
          { type: 'sale' },
          {
            $or: [
              { title: searchRegex },
              { description: searchRegex },
              { condition: searchRegex },
            ]
          }
        ]
      };
    } else if (sort === 'type-trade') {
      filterOptions = {
        $and: [
          { type: 'trade' },
          {
            $or: [
              { title: searchRegex },
              { description: searchRegex },
              { condition: searchRegex },
            ]
          }
        ]
      };
    } else if (sort === 'type-rent') {
      filterOptions = {
        $and: [
          { type: 'rent' },
          {
            $or: [
              { title: searchRegex },
              { description: searchRegex },
              { condition: searchRegex },
            ]
          }
        ]
      };
    }

    // Find all announcements that don't have accepted orders
    const annoncesWithAcceptedOrders = await Order.find({ status: 'accepted' }).distinct('annonce');
    
    // Build combined filters
    let combinedFilters = [];
    
    // 1. Add filter to exclude announcements with accepted orders
    combinedFilters.push({ _id: { $nin: annoncesWithAcceptedOrders } });
    
    // 2. If user is logged in, exclude their own announcements
    if (req.user && req.user._id) {
      combinedFilters.push({ createdBy: { $ne: req.user._id } });
    }
    
    // 3. Add the search filters
    if (filterOptions.$and) {
      // If we already have an $and array, add it to our combinedFilters
      combinedFilters = [...combinedFilters, ...filterOptions.$and];
      
      // Create a new filter with our combined conditions
      filterOptions = { $and: combinedFilters };
    } else if (filterOptions.$or) {
      // If we have an $or condition, wrap it and our filters in an $and
      filterOptions = {
        $and: [
          ...combinedFilters,
          { $or: filterOptions.$or }
        ]
      };
    }

    // Search with filters
    const searchResults = await Annonce.find(filterOptions)
      .sort(sortOptions)
      .populate("createdBy", "_id fullName")
      .populate("category", "name")
      .populate("subcategory", "name");

    res.status(200).json(searchResults);
  } catch (error) {
    console.error("Error searching annonces:", error);
    res.status(500).json({
      success: false,
      message: "Error searching annonces",
      error: error.message
    });
  }
};

export {
  addAnnonce,
  getAllAnnonces,
  getAnnonceById,
  deleteAnnonceById,
  updateAnnonceById,
  getUserAnnonces,
  searchAnnonces,
};
