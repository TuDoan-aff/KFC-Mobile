import express from "express";
import { getUserById, updateUser, getAllUsers } from "../controllers/userController.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Route mới: lấy tất cả user (chỉ admin)
router.get("/", verifyToken, verifyAdmin, getAllUsers);

// Lấy user theo ID
router.get("/:id", getUserById);

// Cập nhật user
router.put("/:id", updateUser);

export default router;
