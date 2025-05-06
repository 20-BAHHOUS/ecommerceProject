import express from "express";
import {
  addAnnonce,
  getAllAnnonces,
  getAnnonceById,
  deleteAnnonceById,
  updateAnnonceById,
} from "../controllers/annonceController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addAnnonce);
router.get("/", getAllAnnonces);
router.get("/:id", getAnnonceById);
router.put("/:id", protect, updateAnnonceById);
router.delete("/:id", protect, deleteAnnonceById);

export default router;
