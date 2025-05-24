import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  registeringUser,
  loginUser,
  getUserInfo,
  updateUserProfile,
  updateUserPassword,
  getUserFavorites,
  toggleFavorite,
  checkFavorite,
  getFavoritesCount
} from "../controllers/authController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registeringUser);
router.post("/login", loginUser);
router.post("/getuser", protect, getUserInfo);
router.put("/profile", protect, updateUserProfile);
router.put("/password", protect, updateUserPassword);

// Favorites routes
router.get("/favorites", protect, getUserFavorites);
router.post("/favorites", protect, toggleFavorite);
router.get("/favorites/:annonceId", protect, checkFavorite);
router.get("/favorites-count", protect, getFavoritesCount);

router.post("/upload-image", protect, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/profile/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

export default router;
