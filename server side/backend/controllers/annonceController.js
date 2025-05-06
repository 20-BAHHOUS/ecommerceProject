import Annonce from "../models/annonce.js";
import validateAnnonceBody from "../validators/annonce.validator.js";

//add product source *
const addAnnonce = async (req, res, next) => {
  try {
    const { body } = req;
    const userId = req.user.id;

    await validateAnnonceBody({ ...body, createdBy: userId });
    const newAnnonce = new Annonce({
      ...body,
      createdBy: userId,
    });

    const data = await newAnnonce.save();
    return res.status(200).json({ data });
  } catch (error) {
    next(error);
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
