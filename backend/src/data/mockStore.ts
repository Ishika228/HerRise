// HerRise In-Memory Mock Data Store

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  preferredLanguage?: string;
  goals: string[];
  education?: string;
  professionalStatus?: string;
  skills: string[];
  experienceYears?: number;
  profileCompleted: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
}

export interface BudgetCategory {
  categoryId: string;
  categoryName: string;
  limit: number;
  spent: number;
  color: string;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  status: 'active' | 'paused' | 'completed';
  color: string;
}

// Initial In-Memory State
export const store = {
  users: [
    {
      id: 'usr-101',
      name: 'Ananya Sharma',
      email: 'ananya.sharma@herrise.org',
      phone: '+91 98765 43210',
      location: 'Bengaluru, India',
      preferredLanguage: 'English',
      goals: ['I want to manage my finances', 'I want to start a business', 'I want to learn new skills'],
      education: "Bachelor's in Design & Business Administration",
      professionalStatus: 'Freelance Growth Strategist & Entrepreneur',
      skills: ['Financial Planning', 'D2C Marketing', 'Brand Identity', 'Product Management'],
      experienceYears: 4,
      profileCompleted: 85,
      createdAt: '2026-01-15T09:00:00Z'
    }
  ] as User[],

  transactions: [
    {
      id: 'tx-001',
      userId: 'usr-101',
      title: 'Consulting Retainer - TechCorp',
      amount: 45000,
      type: 'income',
      category: 'Consulting / Freelance',
      date: '2026-11-01',
      paymentMethod: 'Bank Transfer',
      notes: 'Monthly strategic advisory retainer',
      createdAt: '2026-11-01T10:00:00Z'
    },
    {
      id: 'tx-002',
      userId: 'usr-101',
      title: 'HerMarket Handcraft D2C Payout',
      amount: 20000,
      type: 'income',
      category: 'HerMarket Store Revenue',
      date: '2026-11-03',
      paymentMethod: 'UPI',
      notes: 'Net proceeds from 18 orders',
      createdAt: '2026-11-03T14:30:00Z'
    },
    {
      id: 'tx-003',
      userId: 'usr-101',
      title: 'Studio Apartment Rental',
      amount: 18000,
      type: 'expense',
      category: 'Rent & Housing',
      date: '2026-11-02',
      paymentMethod: 'Net Banking',
      notes: 'November studio rent',
      createdAt: '2026-11-02T11:00:00Z'
    },
    {
      id: 'tx-004',
      userId: 'usr-101',
      title: 'Nature Basket Organic Groceries',
      amount: 4250,
      type: 'expense',
      category: 'Groceries & Staples',
      date: '2026-11-04',
      paymentMethod: 'UPI',
      notes: 'Verified monthly grocery refill via OCR',
      createdAt: '2026-11-04T17:15:00Z'
    },
    {
      id: 'tx-005',
      userId: 'usr-101',
      title: 'WeWork Flexible Desk Pass',
      amount: 3200,
      type: 'expense',
      category: 'Utilities & Bills',
      date: '2026-11-05',
      paymentMethod: 'Credit Card',
      notes: 'Hot desk pass for client meetings',
      createdAt: '2026-11-05T09:45:00Z'
    }
  ] as Transaction[],

  budgetCategories: [
    { categoryId: 'cat-rent', categoryName: 'Rent & Housing', limit: 20000, spent: 18000, color: '#1e3a8a' },
    { categoryId: 'cat-groceries', categoryName: 'Groceries & Staples', limit: 8000, spent: 4250, color: '#0d9488' },
    { categoryId: 'cat-transport', categoryName: 'Transport & Fuel', limit: 4000, spent: 1800, color: '#059669' },
    { categoryId: 'cat-bills', categoryName: 'Utilities & Bills', limit: 4500, spent: 3200, color: '#d97706' },
    { categoryId: 'cat-health', categoryName: 'Healthcare & Wellness', limit: 3500, spent: 1200, color: '#e11d48' },
    { categoryId: 'cat-shopping', categoryName: 'Shopping & Lifestyle', limit: 5000, spent: 2100, color: '#9333ea' },
    { categoryId: 'cat-dining', categoryName: 'Dining & Entertainment', limit: 4000, spent: 1950, color: '#f59e0b' }
  ] as BudgetCategory[],

  goals: [
    {
      id: 'goal-001',
      userId: 'usr-101',
      title: '6-Month Emergency Cushion',
      targetAmount: 150000,
      currentAmount: 95000,
      targetDate: '2027-04-30',
      category: 'Emergency Fund',
      status: 'active',
      color: '#0d9488'
    },
    {
      id: 'goal-002',
      userId: 'usr-101',
      title: 'M3 Pro Laptop for Design Work',
      targetAmount: 180000,
      currentAmount: 120000,
      targetDate: '2026-12-31',
      category: 'New Laptop',
      status: 'active',
      color: '#2563eb'
    },
    {
      id: 'goal-003',
      userId: 'usr-101',
      title: 'HerRise Micro-Enterprise Seed Fund',
      targetAmount: 250000,
      currentAmount: 75000,
      targetDate: '2027-09-30',
      category: 'Starting a Business',
      status: 'active',
      color: '#059669'
    }
  ] as SavingsGoal[],

  jobs: [
    {
      id: 'job-1',
      title: 'Senior Product Designer',
      company: 'Fintech Spark',
      location: 'Remote / Bengaluru',
      type: 'Full-time',
      salary: '₹18,00,000 - ₹24,00,000 / yr',
      tags: ['Figma', 'Fintech', 'Design Systems', 'Women In Tech'],
      description: 'Lead consumer financial health experiences for next-generation women investors.',
      postedDate: '2 days ago'
    },
    {
      id: 'job-2',
      title: 'D2C Growth Marketing Lead',
      company: 'Aura Sustainable Goods',
      location: 'Hybrid / Mumbai',
      type: 'Full-time',
      salary: '₹14,00,000 - ₹18,00,000 / yr',
      tags: ['Performance Marketing', 'SEO', 'Brand Storytelling'],
      description: 'Drive high-conversion organic and paid funnels for women-owned ethical apparel brand.',
      postedDate: 'Yesterday'
    }
  ],

  grants: [
    {
      id: 'grant-1',
      name: 'Stand-Up India Scheme',
      provider: 'Ministry of Finance & SIDBI',
      amount: '₹10 Lakh - ₹1 Crore',
      category: 'Government Initiative',
      deadline: '2026-12-31',
      eligibility: 'Women entrepreneurs setting up a greenfield enterprise in manufacturing or services.',
      status: 'Open for Applications'
    },
    {
      id: 'grant-2',
      name: 'HerRise Catalyst Micro-Grant',
      provider: 'HerRise Foundation',
      amount: '₹1,50,000',
      category: 'Non-Dilutive Grant',
      deadline: 'Rolling Monthly',
      eligibility: 'Early-stage women founders launching their first physical or digital product.',
      status: 'Active'
    }
  ],

  products: [
    {
      id: 'prod-1',
      name: 'Handwoven Mulberry Silk Stole',
      seller: 'Priya Handlooms (Varanasi)',
      price: 2450,
      rating: 4.9,
      salesCount: 142,
      category: 'Textiles & Apparel',
      stock: 28
    },
    {
      id: 'prod-2',
      name: 'Cold-Pressed Ayurvedic Almond Oil (200ml)',
      seller: 'Veda Essentials',
      price: 680,
      rating: 4.8,
      salesCount: 310,
      category: 'Wellness & Beauty',
      stock: 65
    }
  ],

  courses: [
    {
      id: 'crs-1',
      title: 'Foundations of Equity Investing & SIPs',
      instructor: 'Radhika Gupta (Fintech Mentor)',
      duration: '4.5 Hours',
      level: 'Beginner',
      rating: 4.9,
      enrolledCount: 1240,
      category: 'HerFinance'
    },
    {
      id: 'crs-2',
      title: 'Pitching for Venture Debt & Angel Rounds',
      instructor: 'Meera Chawla (Angel Investor)',
      duration: '6 Hours',
      level: 'Intermediate',
      rating: 4.8,
      enrolledCount: 890,
      category: 'HerFund'
    }
  ],

  mentors: [
    {
      id: 'mnt-1',
      name: 'Dr. Sunita Rao',
      role: 'Partner at Horizon Ventures',
      expertise: ['Venture Capital', 'Fintech', 'Scale Strategy'],
      sessionsCompleted: 184,
      rating: 4.9,
      availability: 'Next slot: Tomorrow at 4:00 PM'
    },
    {
      id: 'mnt-2',
      name: 'Kavita Menon',
      role: 'Founder & CEO, GreenRoots D2C',
      expertise: ['E-Commerce', 'Brand Building', 'Bootstrapping'],
      sessionsCompleted: 142,
      rating: 5.0,
      availability: 'Next slot: Thursday at 6:00 PM'
    }
  ]
};

