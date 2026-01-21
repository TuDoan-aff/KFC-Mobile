import express from 'express';
import { register, login, getEmployees } from '../controllers/authController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js'; // middleware bảo vệ route

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Route lấy danh sách nhân viên (chỉ admin mới được)
router.get('/employees', verifyToken, verifyAdmin, getEmployees);

export default router;
