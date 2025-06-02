import express from "express";
import {
  addAnnonce,
  getAllAnnonces,
  getAnnonceById,
  deleteAnnonceById,
  updateAnnonceById,
  getUserAnnonces,
  searchAnnonces,
} from "../controllers/annonceController.js";
import protect from "../middleware/authMiddleware.js";
import optionalAuth from "../middleware/optionalAuthMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.array('images'), addAnnonce);
router.get("/getByUser/:id", getUserAnnonces);
router.get("/search", optionalAuth, searchAnnonces);
router.get("/", optionalAuth, getAllAnnonces);
router.get("/:id", getAnnonceById);
router.put("/:id", protect, upload.array('images'), updateAnnonceById);
router.delete("/:id", protect, deleteAnnonceById);

export default router;
