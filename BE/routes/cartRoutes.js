import express from 'express';
import { addToCart, getCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js';

const router = express.Router();

router.post('/add', addToCart);
router.get('/:userId', getCart);    
router.put('/update/:itemId', updateCartItem);
router.delete('/:userId/:itemId', removeFromCart);
router.delete('/:userId', clearCart); // New route to clear entire cart

export default router;