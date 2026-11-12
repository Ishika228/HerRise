import { Product, Order } from '../../types';

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'Himalayan Organic Chamomile & Blue Pea Tea Blend',
    sellerName: 'Himalayan Botanicals (Pooja Verma)',
    sellerLocation: 'Dehradun, Uttarakhand',
    sellerRating: 4.9,
    price: 499,
    originalPrice: 650,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Whole leaf loose herbs sourced from high-altitude women farmer collectives. 100g in reusable airtight embossed tin. Rich in calming antioxidants, caffeine-free.',
    features: ['100% Organic certified', 'Zero plastic packaging', 'Supports women farmers', 'Naturally caffeine free'],
    rating: 4.9,
    reviewsCount: 84,
    inStock: true,
    badge: 'Bestseller'
  },
  {
    id: 'prod-2',
    title: 'Handloom Pure Mulberry Silk Scarf with Ajrakh Block Print',
    sellerName: 'Maya Weaves (Maya Patel)',
    sellerLocation: 'Kutch, Gujarat',
    sellerRating: 5.0,
    price: 1850,
    originalPrice: 2200,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Naturally dyed with madder root and indigo by generational master women artisans. Breathable, hypoallergenic silk with hand-rolled hems.',
    features: ['100% Mulberry Silk', 'Natural plant dyes', 'Hand block printed', 'GI Tagged Art'],
    rating: 5.0,
    reviewsCount: 52,
    inStock: true,
    badge: 'Artisanal GI-Tag'
  },
  {
    id: 'prod-3',
    title: 'French Lavender & Vanilla Soy Wax Aromatherapy Candle',
    sellerName: 'Lumina Studio (Kavita Iyer)',
    sellerLocation: 'Bengaluru, Karnataka',
    sellerRating: 4.8,
    price: 699,
    originalPrice: 850,
    category: 'Home Decor',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Hand-poured into handmade terracotta ceramic tumblers using natural soy wax and crackling wooden wicks. 45 hours clean burn time.',
    features: ['45+ Hours Burn Time', 'Clean soy wax', 'Crackling wood wick', 'Reusable pottery cup'],
    rating: 4.8,
    reviewsCount: 116,
    inStock: true,
    badge: 'Trending'
  },
  {
    id: 'prod-4',
    title: 'Cold-Pressed Wild Apricot Kernel Facial Elixir (30ml)',
    sellerName: 'WildFlora Organics (Dr. Meera Joshi)',
    sellerLocation: 'Shimla, Himachal Pradesh',
    sellerRating: 4.9,
    price: 890,
    originalPrice: 1100,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1608248597359-5f2128a3f87b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1608248597359-5f2128a3f87b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Traditional wood-pressed chuli seed oil packed with natural Vitamin E and Oleic acid. Deep cellular hydration for glowing skin without greasiness.',
    features: ['100% Cold-Pressed', 'Chemical-Free', 'Cruelty-Free', 'Sustainable harvest'],
    rating: 4.9,
    reviewsCount: 67,
    inStock: true,
    badge: 'Clean Beauty'
  },
  {
    id: 'prod-5',
    title: 'Macramé Hand-Knotted Bohemian Wall Hanging',
    sellerName: 'KnotCraft Collective (Suman Lata)',
    sellerLocation: 'Jaipur, Rajasthan',
    sellerRating: 4.7,
    price: 1250,
    originalPrice: 1600,
    category: 'Handmade',
    image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Crafted with 100% recycled unbleached cotton cord mounted on driftwood branches. Adds warm texture and bohemian elegance to living spaces.',
    features: ['100% Recycled Cotton', 'Unique driftwood branch', 'Hand-knotted by rural women'],
    rating: 4.7,
    reviewsCount: 39,
    inStock: true
  },
  {
    id: 'prod-6',
    title: 'Comprehensive Startup Financial Model & Pitch Kit (Notion & Excel)',
    sellerName: 'FinCoach Pro (Rhea Shenoy, CA)',
    sellerLocation: 'Mumbai, Maharashtra',
    sellerRating: 5.0,
    price: 1499,
    originalPrice: 2499,
    category: 'Digital',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Plug-and-play dynamic 3-statement financial model, break-even calculator, valuation tracker, and investor-ready Notion dashboard.',
    features: ['Instant Digital Download', 'Video walkthrough included', 'Pre-built formulas', 'Free future updates'],
    rating: 5.0,
    reviewsCount: 94,
    inStock: true,
    badge: 'Digital Instant'
  }
];

export const initialOrders: Order[] = [];

export const sellerSalesAnalytics: { month: string; sales: number; orders: number }[] = [];

