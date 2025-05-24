import Annonce from "../models/annonce.js";
import validateAnnonceBody from "../validators/annonce.validator.js";

//add product source *
const addAnnonce = async (req, res, next) => {
  try {
    // Get other form data from req.body
    const { body } = req;

    // Add the user ID from the authentication middleware
    body.createdBy = req.user._id;

    //Get the file paths
    body.images = req.files.map((file) => file.path);

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
    const annonces = await Annonce.find().sort({ date: -1 });
    res.json(annonces);
  } catch (error) {
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
      .populate("createdBy", "_id fullName")
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
      const newImagePaths = req.files.map(file => file.path);
      
      // Handle existing images if provided
      if (req.body.existingImages) {
        // Parse the JSON string of existing images to keep
        const existingImages = JSON.parse(req.body.existingImages);
        // Combine existing and new images
        updateData.images = [...existingImages, ...newImagePaths];
      } else {
        // If no existing images specified, use only new uploads
        updateData.images = newImagePaths;
      }
    } else if (req.body.existingImages) {
      // If no new uploads but existing images are specified
      updateData.images = JSON.parse(req.body.existingImages);
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
    const annonces = await Annonce.find({ createdBy: id })
      .sort({
        date: -1,
      })
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

export {
  addAnnonce,
  getAllAnnonces,
  getAnnonceById,
  deleteAnnonceById,
  updateAnnonceById,
  getUserAnnonces,
};
