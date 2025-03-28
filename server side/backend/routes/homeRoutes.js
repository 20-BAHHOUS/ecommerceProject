import express from "express";
import protect from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/", protect);

export default router;


