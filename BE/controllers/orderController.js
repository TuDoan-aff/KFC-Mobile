import Order from '../models/Oder.js';

// Tạo đơn hàng
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Items are required' });
    }

    const order = new Order({
      customer: {
        id: req.user.userId,      // ⚡ gán id từ token
        username: req.user.username || '', // nếu muốn
        phone: req.user.phone || '',
        address: address || '',
      },
      items,
      totalAmount,
      status: 'processing',
      createdAt: new Date(),
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Lấy tất cả đơn hàng
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product', 'name price') // Nếu items.product là ObjectId ref
      .sort({ createdAt: -1 });

    // Trả về cả thông tin customer đã lưu trong order
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy đơn hàng theo id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name price'); // Nếu product là reference

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Thông tin customer đã nằm trong order.customer
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      req.body, // body có thể chứa { status: 'completed' }
      { new: true }
    ).populate('items.product', 'name price'); // populate để trả về thông tin product nếu cần

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Trả về order sau khi update, customer info vẫn giữ nguyên
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    console.log('req.user:', req.user);
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const orders = await Order.find({ 'customer.id': userId })
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    console.log('Orders found:', orders.length);
    res.json(orders);
  } catch (error) {
    console.error('❌ Lỗi getMyOrders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
