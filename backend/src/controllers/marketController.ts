import { Request, Response } from 'express';
import { store } from '../data/mockStore.js';

export const getProducts = (req: Request, res: Response) => {
  return res.status(200).json({ success: true, count: store.products.length, data: store.products });
};

export const createProduct = (req: Request, res: Response) => {
  const { name, price, category, stock } = req.body;

  if (!name || !price) {
    return res.status(400).json({ success: false, error: 'Product name and price are required' });
  }

  const newProd = {
    id: `prod-${Date.now()}`,
    name,
    seller: store.users[0]?.name || 'HerRise Artisan',
    price: Number(price),
    rating: 5.0,
    salesCount: 0,
    category: category || 'Handcraft & Artisan',
    stock: Number(stock) || 10
  };

  store.products.unshift(newProd);

  return res.status(201).json({
    success: true,
    message: 'Product listed on HerMarket marketplace successfully',
    data: newProd
  });
};

export const getSellerDashboard = (req: Request, res: Response) => {
  const totalRev = store.products.reduce((acc, p) => acc + (p.price * (p.salesCount || 0)), 0);
  const totalOrders = store.products.reduce((acc, p) => acc + (p.salesCount || 0), 0);

  return res.status(200).json({
    success: true,
    data: {
      totalSalesRevenue: `₹${totalRev.toLocaleString()}`,
      ordersDelivered: totalOrders,
      storeRating: store.products.length > 0 ? 5.0 : 0,
      activeListings: store.products.length
    }
  });
};

