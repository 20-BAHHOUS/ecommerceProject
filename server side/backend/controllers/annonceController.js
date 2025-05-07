import Annonce from "../models/annonce.js";
import validateAnnonceBody from "../validators/annonce.validator.js";

//add product source *
const addAnnonce = async (req, res, next) => {
  try {
    // Get other form data from req.body
    const { body } = req;

    //Get the file paths

    body.images = req.files.map(file => file.path);

    //create a new annonce in database 
    const newAnnonce = new Annonce(body);

    await newAnnonce.save();

    res.status(201).json({
      success: true,
      data: newAnnonce
    });
  } catch (error) {
    console.error("Error creating annonce:", error);
    res.status(500).json({
      success: false,
      message: "Error creating annonce",
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
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) {
      return res.status(404).json({ error: "Annonce not found" });
    }
    res.status(200).json(product);
  } catch (error) {
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
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) {
      return res.status(404).json({ error: "Annonce not found" });
    }
    const updatedAnnonce = await Annonce.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedAnnonce);
  } catch (error) {
    res.status(500).json({
      message: "Error updating annonce",
    });
  }
};

export {
  addAnnonce,
  getAllAnnonces,
  getAnnonceById,
  deleteAnnonceById,
  updateAnnonceById,
};
