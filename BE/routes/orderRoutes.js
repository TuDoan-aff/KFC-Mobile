import express from 'express';
import { getAllOrders, createOrder, getOrderById, updateOrderStatus, getMyOrders } from '../controllers/orderController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllOrders);
router.get('/my', verifyToken, getMyOrders); // Đơn hàng của user
router.post('/', verifyToken, createOrder); // ⚡ Thêm verifyToken
router.get('/:id', getOrderById);
router.put('/update/:id', updateOrderStatus);

export default router;
