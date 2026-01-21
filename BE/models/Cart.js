import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    img: { type: String, required: true },
    productId: { type: mongoose.Types.ObjectId, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 }
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);