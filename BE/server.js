// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";

// Import routes
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/productsRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

// Import User model
import User from "./models/User.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/chat", chatRoutes);

// MongoDB connection
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(async () => {
    console.log("✅ MongoDB connected successfully");


    // 🔹 Tạo admin mặc định nếu chưa có
    try {
      const existingAdmin = await User.findOne({ username: "admin" });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("Admin123!", 10);
        const admin = new User({
          username: "admin",
          email: "admin@gmail.com",
          password: hashedPassword,
          role: "admin",
          phone: "",
          address: "",
        });
        await admin.save();
        console.log("✅ Admin mặc định đã được tạo: username=admin, password=Admin123!");
      } else {
        console.log("Admin mặc định đã tồn tại.");
      }
    } catch (err) {
      console.error("❌ Lỗi khi tạo admin mặc định:", err);
    }

    app.listen(port, "0.0.0.0", () => console.log(`🚀 Server is running on port ${port}`));
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
  });
