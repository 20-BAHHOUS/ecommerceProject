// c:\Users\Dell P106f\Desktop\pfe commmerce\ecommerceProject\server side\backend\routes\annonceRoutes.js
import express from "express";
import {
  addAnnonce,
  getAllAnnonces,
  getAnnonceById,
  deleteAnnonceById,
  updateAnnonceById,
} from "../controllers/annonceController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.array("images", 10), addAnnonce);

router.get("/", protect, getAllAnnonces);
router.get("/:id", protect, getAnnonceById);

router.put("/:id", protect, updateAnnonceById);
router.put("/:id", protect, upload.array("images", 10), updateAnnonceById);

router.delete("/:id", protect, deleteAnnonceById);

export default router;
