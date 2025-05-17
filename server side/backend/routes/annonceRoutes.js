import express from "express";
import {
  addAnnonce,
  getAllAnnonces,
  getAnnonceById,
  deleteAnnonceById,
  updateAnnonceById,
  getUserAnnonces,
} from "../controllers/annonceController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";


const router = express.Router();

router.post("/", upload.array('images'),addAnnonce);
router.get("/getByUser/:id",getUserAnnonces);
router.post("/", protect, addAnnonce);
router.get("/", getAllAnnonces);
router.get("/:id", getAnnonceById);
router.put("/:id", protect, updateAnnonceById);
router.delete("/:id", protect, deleteAnnonceById);

export default router;
