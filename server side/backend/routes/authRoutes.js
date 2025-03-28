import express from "express";
import  protect  from "../middleware/authMiddleware.js";
import { registeringUser, loginUser, getUserInfo } from "../controllers/authController.js";
import upload from "../middleware/uploadMiddleware.js";


const router = express.Router();

router.post("/register", registeringUser);
router.post("/login", loginUser);
router.post("/getuser", protect, getUserInfo);

router.post("upload-image", upload.single("image"),(req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const imageUrl = '${req.protocol}://${req.get("host")}/uploads/${req.file.filename}';

  res.status(200).json({ imageUrl });

});

export default router;
