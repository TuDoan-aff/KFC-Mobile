import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    img: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    hot: { type: Boolean, default: false }
});

export default mongoose.model("Product", productSchema, "Product");
