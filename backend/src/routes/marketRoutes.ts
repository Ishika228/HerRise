import { Router } from 'express';
import { getProducts, createProduct, getSellerDashboard } from '../controllers/marketController.js';

const router = Router();

router.get('/products', getProducts);
router.post('/products', createProduct);
router.get('/seller-dashboard', getSellerDashboard);

export default router;
