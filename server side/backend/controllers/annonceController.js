import User from "../models/user.js";
import Annonce from "../models/annonce.js";
import validator from "../validators/annonce.validator.js";

//add product source *
 const addAnnonce = async (req, res, next) => {
  try {
    const { body } = req;
    const userId = req.user.id;

    await validator.validateAnnonceBody(...body, userId);
    const newAnnonce = new Annonce({
      ...body,
      userId,
    });

    const data = await newAnnonce.save();
    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

//Get all annonces
const getAllAnnonces = async (req, res) => {
  const userId = req.user.id;
  try {
    const annonces = await Annonce.find({ userId }).sort({ date: -1 });
    res.json(annonces);
  } catch (error) {
    res.status(500).json({
      message: "Error getting annonces",
    });
  }
};

//Get annonce by id
const getannonceById = async (req, res) => {
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

//Search annonces by title
const searchAnnonces = async (req, res) => {
  try {
    const annonces = await Annonce.find({
      title: { $regex: req.params.query, $options: "i" },
    }).sort({ date: -1 });
    res.status(200).json(annonces);
  } catch (error) {
    res.status(500).json({
      message: "Error searching annonces",
    });
  }
};

//Get annonces by category
const getAnnoncesByCategory = async (req, res) => {
  try {
    const annonces = await Annonce.find({ category: req.params.category }).sort(
      {
        date: -1,
      }
    );
    res.status(200).json(annonces);
  } catch (error) {
    res.status(500).json({
      message: "Error getting annonces by category",
    });
  }
};

//Get annonces by location
const getAnnoncesByLocation = async (req, res) => {
  try {
    const annonces = await Annonce.find({ location: req.params.location }).sort(
      {
        date: -1,
      }
    );
    res.status(200).json(annonces);
  } catch (error) {
    res.status(500).json({
      message: "Error getting annonces by location",
    });
  }
};

//get products by type
const getAnnoncesByType = async (req, res) => {
  try {
    const products = await Annonce.find({ ProductType: req.params.type }).sort({
      date: -1,
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error getting annonces by type",
    });
  }
};

export {
  addAnnonce,
  getAllAnnonces,
  getannonceById,
  deleteAnnonceById,
  updateAnnonceById,
  searchAnnonces,
  getAnnoncesByCategory,
  getAnnoncesByLocation,
  getAnnoncesByType,
};