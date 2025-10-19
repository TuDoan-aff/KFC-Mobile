    import mongoose from 'mongoose';
    import Cart from '../models/Cart.js';

    export const addToCart = async (req, res) => {
        try {
            console.log("📦 Dữ liệu nhận từ FE:", req.body); // 👉 Thêm dòng này
            const { userId, productId, name, price, img, quantity, category } = req.body;

            const cartItem = new Cart({
                userId: new mongoose.Types.ObjectId(userId),
                productId: new mongoose.Types.ObjectId(productId),  
                name,
                price,
                img,
                quantity,
                category: category || 'Không xác định',
            });

            await cartItem.save();
            res.status(201).json(cartItem);
        } catch (error) {
            console.error('❌ Lỗi khi thêm vào giỏ hàng:', error);
            res.status(500).json({ message: error.message || 'Internal server error' });
        }
    };

    export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("🔍 userId nhận từ FE:", userId);

    // Ép kiểu ObjectId để tránh lỗi CastError
    const cartItems = await Cart.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).select('productId name price img quantity category');

    res.status(200).json(cartItems);
  } catch (error) {
    console.error('❌ Lỗi khi lấy giỏ hàng:', error);
    res.status(500).json({ message: error.message });
  }
};

    export const updateCartItem = async (req, res) => {
        try {
            const { itemId } = req.params;
            const { quantity } = req.body;
            const updatedItem = await Cart.findByIdAndUpdate(
                itemId,
                { quantity },
                { new: true }
            );
            res.json(updatedItem);
        } catch (error) {
            console.error('❌ Lỗi khi cập nhật giỏ hàng:', error);
            res.status(500).json({ message: error.message });
        }
    };

    export const removeFromCart = async (req, res) => {
        try {
            const { userId, itemId } = req.params;
            await Cart.findOneAndDelete({ userId, _id: itemId });
            res.json({ message: 'Item removed from cart' });
        } catch (error) {
            console.error('❌ Lỗi khi xoá sản phẩm khỏi giỏ hàng:', error);
            res.status(500).json({ message: error.message });
        }
    };

    export const clearCart = async (req, res) => {
        try {
            const { userId } = req.params;
            await Cart.deleteMany({ userId });
            res.json({ message: 'Cart cleared successfully' });
        } catch (error) {
            console.error('❌ Lỗi khi xoá toàn bộ giỏ hàng:', error);
            res.status(500).json({ message: error.message });
        }
    };
