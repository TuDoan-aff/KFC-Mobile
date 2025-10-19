import User from "../models/User.js"; // đảm bảo bạn có model User trong /models


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // không trả về password
    res.json(users);
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách user:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
// 🔹 Lấy thông tin người dùng
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(user);
  } catch (error) {
    console.error("❌ Lỗi lấy thông tin user:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 🔹 Cập nhật thông tin người dùng
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(updatedUser);
  } catch (error) {
    console.error("❌ Lỗi cập nhật user:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};


