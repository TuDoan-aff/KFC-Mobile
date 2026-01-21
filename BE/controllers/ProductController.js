import Product from '../models/Product.js';

export const createProduct = async (req, res) =>    {   
    try {
        // Cách gọn nhất: dùng trực tiếp req.body
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("❌ Error creating product:", error.message);
        console.error("❌ Full details:", error.errors); // Giúp debug chính xác lỗi
        res.status(400).json({ message: error.message });
    }
};


export const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📥 Nhận ID từ FE:', id);

    // Kiểm tra ID hợp lệ
    if (!id || id === 'undefined') {
      return res.status(400).json({ message: 'Thiếu ID sản phẩm' });
    }

    const product = await Product.findById(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
  } catch (error) {
    console.error('❌ Lỗi BE khi lấy sản phẩm:', error.message);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};


export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id); 
        res.json({ message: 'Product deleted successfully' });          
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};