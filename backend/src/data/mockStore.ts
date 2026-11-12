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
  users: [] as User[],
  transactions: [] as Transaction[],
  budgetCategories: [] as BudgetCategory[],
  goals: [] as SavingsGoal[],

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

