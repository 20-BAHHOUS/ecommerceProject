import express from 'express';
import  protect  from '../middleware/authMiddleware.js';
import { placeOrder, getSellerOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/seller',protect, getSellerOrders);
router.put('/:orderId',protect,updateOrderStatus);

export default router;