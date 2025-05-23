import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { placeOrder, getSellerOrders, updateOrderStatus, getByUser, deleteOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/seller", protect, getSellerOrders);
router.put("/:orderId/status", protect, updateOrderStatus);
router.get("/user", protect, getByUser);
router.delete("/:orderId", protect, deleteOrder);

export default router;