import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  Filter,
  Star,
  PlusCircle,
  TrendingUp,
  Package,
  ShoppingCart,
  CheckCircle2,
  Trash2,
  CreditCard,
  Eye,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import confetti from 'canvas-confetti';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/cards/StatCard';
import { Modal } from '../../components/common/Modal';
import { useMarket } from '../../context/MarketContext';
import { useToast } from '../../context/ToastContext';
import { sellerSalesAnalytics } from '../../data/mockData/marketData';
import { Product } from '../../types';

export const HerMarketPage: React.FC = () => {
  const {
    products,
    cart,
    orders,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    toggleWishlist,
    isWishlisted,
    addProduct,
    placeOrder,
    updateOrderStatus
  } = useMarket();

  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'shop' | 'seller' | 'cart'>('shop');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  // New Product Form State
  const [productForm, setProductForm] = useState({
    title: '',
    sellerName: 'VedaBotanica (Pooja Verma)',
    sellerLocation: 'Dehradun, Uttarakhand',
    price: '',
    originalPrice: '',
    category: 'Food' as Product['category'],
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    description: '',
    featuresText: '100% Handcrafted, Eco-friendly, Clean Sourcing'
  });

  // Checkout Form State
  const [shippingDetails, setShippingDetails] = useState({
    name: 'Ananya Sharma',
    address: '42 Orchid Residency, Indiranagar, Bengaluru - 560038',
    paymentMethod: 'UPI'
  });

  const categories = [
    'All',
    'Fashion',
    'Handmade',
    'Beauty',
    'Home Decor',
    'Food',
    'Services',
    'Digital'
  ];

  const filteredProducts = products.filter((prod) => {
    const matchesCat = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch =
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddToCart = (prod: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(prod, 1);
    showToast('Added to Cart', `${prod.title} added to your shopping bag`, 'success');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price) return;
    addProduct({
      title: productForm.title,
      sellerName: productForm.sellerName,
      sellerLocation: productForm.sellerLocation,
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
      category: productForm.category,
      image: productForm.image,
      images: [productForm.image],
      description: productForm.description || 'Artisanal high-quality item handcrafted with care.',
      features: productForm.featuresText.split(',').map((f) => f.trim()),
      inStock: true
    });
    setAddProductModalOpen(false);
    showToast('Product Published!', `${productForm.title} is now live in HerMarket`, 'success');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    const newOrder = placeOrder(shippingDetails);
    setCheckoutModalOpen(false);
    setActiveTab('seller');
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {}
    showToast('Order Placed Successfully!', `Order ${newOrder.id} confirmed with demo ${shippingDetails.paymentMethod}`, 'success');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-[#059669]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                HerMarket — Products & Services Marketplace
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Buy directly from verified women-owned brands and list your own handcrafted goods or digital offerings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'shop' ? 'bg-[#4A154B] text-white shadow-xs' : 'bg-purple-50 text-gray-700 hover:bg-purple-100'
              }`}
            >
              Marketplace Storefront
            </button>
            <button
              onClick={() => setActiveTab('seller')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'seller' ? 'bg-[#4A154B] text-white shadow-xs' : 'bg-purple-50 text-gray-700 hover:bg-purple-100'
              }`}
            >
              Seller Dashboard
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'cart' ? 'bg-[#4A154B] text-white shadow-xs' : 'bg-purple-50 text-gray-700 hover:bg-purple-100'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Cart ({cartCount})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: STOREFRONT */}
        {activeTab === 'shop' && (
          <div className="space-y-6">
            {/* Search & Categories Bar */}
            <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search silk scarves, tea blends, candles, or digital tools..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-xs outline-none"
                  />
                </div>
                <div className="text-xs text-gray-500 font-semibold">
                  Showing {filteredProducts.length} Women-Made Products
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-purple-50">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#4A154B] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-purple-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => {
                const wishlisted = isWishlisted(prod.id);
                return (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProductDetails(prod)}
                    className="bg-white rounded-3xl border border-purple-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer"
                  >
                    <div>
                      {/* Image Frame */}
                      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {prod.badge && (
                          <span className="absolute top-3 left-3 bg-[#4A154B] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                            {prod.badge}
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(prod.id);
                          }}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                            wishlisted ? 'bg-white text-rose-500' : 'bg-black/30 text-white hover:bg-white hover:text-gray-900'
                          }`}
                        >
                          <Heart className="w-4 h-4" fill={wishlisted ? '#f43f5e' : 'none'} />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-gray-500">
                          <span className="font-semibold text-purple-900">{prod.category}</span>
                          <span className="flex items-center gap-1 font-bold text-gray-800">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {prod.rating} ({prod.reviewsCount})
                          </span>
                        </div>

                        <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug group-hover:text-[#4A154B] transition-colors">
                          {prod.title}
                        </h3>

                        <p className="text-[11px] text-gray-500">{prod.sellerName}</p>

                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="text-lg font-black text-gray-900">₹{prod.price}</span>
                          {prod.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">₹{prod.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-5 pb-5 pt-2">
                      <button
                        onClick={(e) => handleAddToCart(prod, e)}
                        className="w-full flex items-center justify-center gap-2 bg-purple-50 hover:bg-[#4A154B] hover:text-white text-[#4A154B] py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SELLER DASHBOARD */}
        {activeTab === 'seller' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
              <div>
                <h3 className="text-base font-bold text-gray-900">Storefront Owner Analytics</h3>
                <p className="text-xs text-gray-500">
                  Manage inventory, monitor sales growth, and publish new products without seller commissions.
                </p>
              </div>
              <button
                onClick={() => setAddProductModalOpen(true)}
                className="flex items-center gap-1.5 bg-[#4A154B] hover:bg-[#350c36] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-pink-300" />
                <span>Add Product</span>
              </button>
            </div>

            {/* 4 Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Gross Store Sales"
                value="₹41,800"
                change="+28% MoM"
                isPositive={true}
                subtitle="November Inflow"
                icon={TrendingUp}
                iconColor="text-emerald-700"
                bgColor="bg-emerald-50"
              />
              <StatCard
                title="Total Fulfilled Orders"
                value="62 Orders"
                subtitle="99.4% On-time delivery"
                icon={Package}
                iconColor="text-[#4A154B]"
                bgColor="bg-purple-50"
              />
              <StatCard
                title="Active Store Listings"
                value={products.length}
                subtitle="Across 3 categories"
                icon={ShoppingBag}
                iconColor="text-[#be185d]"
                bgColor="bg-pink-50"
              />
              <StatCard
                title="Customer Review Rating"
                value="4.92 / 5.0"
                subtitle="Verified buyer reviews"
                icon={Star}
                iconColor="text-amber-600"
                bgColor="bg-amber-50"
              />
            </div>

            {/* Sales Chart & Orders Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Chart (7 cols) */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                  <h3 className="text-sm font-bold text-gray-900">Revenue Growth Trend</h3>
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    Positive Growth
                  </span>
                </div>
                <div className="h-64 mt-4 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sellerSalesAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3e8ff" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                      <Tooltip
                        formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Sales']}
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e9d5ff', fontSize: '12px' }}
                      />
                      <Bar dataKey="sales" fill="#4A154B" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Orders Table (5 cols) */}
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-gray-900 pb-2 border-b border-purple-50">
                  Recent Customer Orders
                </h3>
                <div className="divide-y divide-purple-50 max-h-72 overflow-y-auto">
                  {orders.map((ord) => (
                    <div key={ord.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-gray-900 block truncate max-w-[160px]">{ord.productTitle}</strong>
                        <span className="text-[10px] text-gray-400">{ord.customerName} • {ord.paymentMethod}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-gray-900">₹{ord.amount}</span>
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                          className="block text-[10px] font-bold text-purple-900 bg-purple-50 rounded px-1.5 py-0.5 mt-0.5 outline-none cursor-pointer"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SHOPPING CART & CHECKOUT */}
        {activeTab === 'cart' && (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl border border-purple-100 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-purple-100">
              <h3 className="text-xl font-bold text-gray-900">Your Shopping Bag ({cartCount} items)</h3>
              <button
                onClick={() => setActiveTab('shop')}
                className="text-xs font-semibold text-[#4A154B] hover:underline"
              >
                ← Continue Browsing
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto" />
                <h4 className="font-bold text-sm text-gray-800">Your Cart is Currently Empty</h4>
                <p className="text-xs text-gray-500">Discover authentic products crafted by women entrepreneurs.</p>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="bg-[#4A154B] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#350c36] cursor-pointer"
                >
                  Explore Storefront
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="divide-y divide-purple-50">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-4 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-gray-900">{item.product.title}</h4>
                          <span className="text-[11px] text-gray-500">{item.product.sellerName}</span>
                          <div className="font-bold text-[#4A154B] mt-1">₹{item.product.price} each</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer font-bold"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer font-bold"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-extrabold text-sm text-gray-900 w-20 text-right">
                          ₹{item.product.price * item.quantity}
                        </span>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal & Checkout Trigger */}
                <div className="p-5 bg-purple-50/70 rounded-2xl border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-gray-600">Total Amount:</span>
                    <div className="text-2xl font-black text-gray-900">₹{cartTotal.toLocaleString()}</div>
                    <span className="text-[10px] text-emerald-700 font-semibold">Free Delivery on Demo Orders</span>
                  </div>

                  <button
                    onClick={() => setCheckoutModalOpen(true)}
                    className="w-full sm:w-auto bg-[#4A154B] text-white px-8 py-3 rounded-xl font-bold text-xs hover:bg-[#350c36] shadow-md transition-all cursor-pointer"
                  >
                    Proceed to Demo Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Product Details */}
      {selectedProductDetails && (
        <Modal
          isOpen={!!selectedProductDetails}
          onClose={() => setSelectedProductDetails(null)}
          title={selectedProductDetails.title}
          subtitle={`Seller: ${selectedProductDetails.sellerName} • ${selectedProductDetails.sellerLocation}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <img
                src={selectedProductDetails.image}
                alt={selectedProductDetails.title}
                className="w-full h-56 rounded-2xl object-cover"
              />
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-gray-900">₹{selectedProductDetails.price}</span>
                  {selectedProductDetails.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{selectedProductDetails.originalPrice}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{selectedProductDetails.rating} Star Rating ({selectedProductDetails.reviewsCount} reviews)</span>
                </div>

                <p className="text-gray-600 leading-relaxed">{selectedProductDetails.description}</p>

                <div className="space-y-1">
                  <span className="font-bold text-gray-700 block">Product Features:</span>
                  {selectedProductDetails.features.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-gray-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-purple-50 flex gap-3">
              <button
                onClick={() => {
                  addToCart(selectedProductDetails, 1);
                  setSelectedProductDetails(null);
                  showToast('Added to Cart', 'Product added to your bag', 'success');
                }}
                className="flex-1 bg-[#4A154B] text-white py-3 rounded-xl font-bold hover:bg-[#350c36] cursor-pointer"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Add Product to Seller Storefront */}
      <Modal
        isOpen={addProductModalOpen}
        onClose={() => setAddProductModalOpen(false)}
        title="Publish Product on HerMarket"
        subtitle="List your handcrafted goods or services for thousands of buyers"
      >
        <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Product Title</label>
            <input
              type="text"
              required
              value={productForm.title}
              onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
              placeholder="e.g. Handcrafted Botanical Soap Trio"
              className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none focus:border-[#4A154B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Selling Price (₹)</label>
              <input
                type="number"
                required
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                placeholder="499"
                className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none focus:border-[#4A154B]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Category</label>
              <select
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
              >
                <option value="Food">Food Products</option>
                <option value="Fashion">Fashion & Apparel</option>
                <option value="Handmade">Handmade & Crafts</option>
                <option value="Beauty">Beauty & Wellness</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Services">Professional Services</option>
                <option value="Digital">Digital Products</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Image URL</label>
            <input
              type="url"
              required
              value={productForm.image}
              onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
            />
            {productForm.image && (
              <div className="mt-2 h-24 w-24 rounded-xl overflow-hidden border border-purple-200">
                <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Description</label>
            <textarea
              rows={2}
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              placeholder="Describe materials, sizing, and origin story..."
              className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#4A154B] text-white py-3 rounded-xl font-bold hover:bg-[#350c36] cursor-pointer mt-2"
          >
            Publish Product Live
          </button>
        </form>
      </Modal>

      {/* Modal: Simulated Checkout */}
      <Modal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        title="Simulated Demo Checkout"
        subtitle="No actual payment card charged"
      >
        <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Recipient Name</label>
            <input
              type="text"
              required
              value={shippingDetails.name}
              onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Shipping Address</label>
            <textarea
              rows={2}
              required
              value={shippingDetails.address}
              onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Payment Method (Demo)</label>
            <select
              value={shippingDetails.paymentMethod}
              onChange={(e) => setShippingDetails({ ...shippingDetails, paymentMethod: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
            >
              <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
              <option value="Credit Card">Credit / Debit Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>

          <div className="p-3 bg-purple-50 rounded-xl flex justify-between items-center font-bold">
            <span>Total Payable:</span>
            <span className="text-base text-[#4A154B]">₹{cartTotal.toLocaleString()}</span>
          </div>

          <button
            type="submit"
            className="w-full bg-[#4A154B] text-white py-3 rounded-xl font-bold hover:bg-[#350c36] cursor-pointer"
          >
            Confirm & Place Demo Order
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

