import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order } from '../types';
import { useAuth } from './AuthContext';

interface MarketContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  wishlist: string[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  addProduct: (product: Omit<Product, 'id' | 'sellerRating' | 'rating' | 'reviewsCount'>) => void;
  placeOrder: (shippingDetails: { name: string; address: string; paymentMethod: string }) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userKey = user?.email ? user.email.toLowerCase() : (user?.id ? user.id.toLowerCase() : 'guest');

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('herrise_market_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Keep only user-created products, filter out mock initial catalog
          return parsed.filter((p: any) => !p.id?.startsWith('prod-') || Number(p.id?.replace('prod-', '') || 0) > 100);
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(`herrise_market_${userKey}_cart`) || localStorage.getItem('herrise_market_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(`herrise_market_${userKey}_orders`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Reload user-scoped data whenever active user switches
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`herrise_market_${userKey}_orders`);
      setOrders(stored ? JSON.parse(stored) : []);
    } catch {
      setOrders([]);
    }
  }, [userKey]);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('herrise_market_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('herrise_market_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`herrise_market_${userKey}_cart`, JSON.stringify(cart));
  }, [cart, userKey]);

  useEffect(() => {
    localStorage.setItem(`herrise_market_${userKey}_orders`, JSON.stringify(orders));
  }, [orders, userKey]);

  useEffect(() => {
    localStorage.setItem('herrise_market_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const addProduct = (prodData: Omit<Product, 'id' | 'sellerRating' | 'rating' | 'reviewsCount'>) => {
    const newProduct: Product = {
      ...prodData,
      id: 'prod-' + Date.now().toString(36),
      sellerRating: 5.0,
      rating: 5.0,
      reviewsCount: 1,
      badge: 'New Launch'
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const placeOrder = (shippingDetails: { name: string; address: string; paymentMethod: string }) => {
    const productTitles = cart.map((c) => `${c.product.title} (x${c.quantity})`).join(', ');
    const newOrder: Order = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      customerName: shippingDetails.name || user?.name || 'Customer',
      productTitle: productTitles || 'Marketplace Item',
      amount: cartTotal,
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
      paymentMethod: shippingDetails.paymentMethod || 'UPI'
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord)));
  };

  return (
    <MarketContext.Provider
      value={{
        products,
        cart,
        orders,
        wishlist,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        addProduct,
        placeOrder,
        updateOrderStatus
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};

