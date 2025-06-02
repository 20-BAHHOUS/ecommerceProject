import express from "express";
import { reportAnnouncement, getAllReports } from "../controllers/reportController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Submit a report for an announcement (requires authentication)
router.post("/", protect, reportAnnouncement);

// Get all reports (requires authentication only)
router.get("/", protect, getAllReports);

export default router; 