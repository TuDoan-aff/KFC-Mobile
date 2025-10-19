import express from 'express';
import { 
    getAllProduct, 
    createProduct, 
    getProductById, 
    updateProduct, 
    deleteProduct
} from '../controllers/productController.js'

const router = express.Router();

// Get all Product and search/filter
router.get('/', getAllProduct);

// CRUD operations
router.post('/add', createProduct);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;