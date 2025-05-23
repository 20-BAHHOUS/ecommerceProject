import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from "../controllers/notificationController.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all notifications for the current user
router.get("/", getNotifications);

// Mark a notification as read
router.put("/:notificationId/read", markAsRead);

// Mark all notifications as read
router.put("/mark-all-read", markAllAsRead);

// Delete a notification
router.delete("/:notificationId", deleteNotification);

// Get unread notification count
router.get("/unread-count", getUnreadCount);

export default router; 