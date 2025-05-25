import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  deleteAllNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);


router.get("/", getNotifications);
router.put("/:notificationId/read", markAsRead);
router.put("/mark-all-read", markAllAsRead);

// Delete a notification
router.delete("/:notificationId", deleteNotification);
// Delete all notifications
router.delete("/", deleteAllNotifications);
router.get("/unread-count", getUnreadCount);

export default router; 