// HerFinance Comprehensive Data Layer & Storage Service (CRUD & Local Storage Database)
import {
  TransactionRecord,
  BudgetRecord,
  SavingsGoalRecord,
  FinancialProfile,
  NotificationItem,
  UserPreferences,
  AIChatRecord,
  ExpenseCategoryItem
} from '../types/finance';
import { comprehensiveFinancialLessons } from '../data/mockData/financialLessonsData';

const STORAGE_KEYS = {
  PROFILE: 'herfinance_profile',
  TRANSACTIONS: 'herfinance_transactions',
  BUDGETS: 'herfinance_budgets',
  GOALS: 'herfinance_goals',
  LESSONS: 'herfinance_lessons',
  NOTIFICATIONS: 'herfinance_notifications',
  PREFERENCES: 'herfinance_preferences',
  AI_CHAT: 'herfinance_aichat'
};

export const defaultCategories: ExpenseCategoryItem[] = [
  { id: 'cat-rent', name: 'Rent & Housing', isCustom: false, allocatedLimit: 18000, color: '#1e3a8a', iconName: 'Home' },
  { id: 'cat-groceries', name: 'Groceries & Staples', isCustom: false, allocatedLimit: 8000, color: '#0d9488', iconName: 'ShoppingBag' },
  { id: 'cat-transport', name: 'Transport & Fuel', isCustom: false, allocatedLimit: 4000, color: '#059669', iconName: 'Car' },
  { id: 'cat-bills', name: 'Utilities & Bills', isCustom: false, allocatedLimit: 4500, color: '#d97706', iconName: 'Zap' },
  { id: 'cat-health', name: 'Healthcare & Wellness', isCustom: false, allocatedLimit: 3500, color: '#e11d48', iconName: 'Heart' },
  { id: 'cat-shopping', name: 'Shopping & Lifestyle', isCustom: false, allocatedLimit: 6000, color: '#9333ea', iconName: 'Gift' },
  { id: 'cat-education', name: 'Education & Upskilling', isCustom: false, allocatedLimit: 4000, color: '#2563eb', iconName: 'GraduationCap' },
  { id: 'cat-dining', name: 'Dining & Entertainment', isCustom: false, allocatedLimit: 5000, color: '#f59e0b', iconName: 'Coffee' }
];

export const initialFinancialProfile: FinancialProfile = {
  userId: 'usr-clean',
  fullName: '',
  email: '',
  monthlyIncome: 0,
  incomeSources: [],
  emergencyFundTargetMonths: 6,
  monthlySavingsTarget: 0,
  riskTolerance: 'moderate',
  financialScore: 0,
  currency: 'INR',
  updatedAt: new Date().toISOString()
};

// Clean initial empty state - populated dynamically upon user input
export const initialTransactionsList: TransactionRecord[] = [];
const _legacyDummyTransactions: TransactionRecord[] = [
  {
    id: 'tx-101',
    userId: 'usr-101',
    title: 'Consulting Retainer Payout',
    amount: 45000,
    type: 'income',
    category: 'Consulting / Salary',
    date: '2026-11-02',
    paymentMethod: 'Bank Transfer',
    notes: 'November client retainer direct credit',
    createdAt: '2026-11-02T10:00:00Z'
  },
  {
    id: 'tx-102',
    userId: 'usr-101',
    title: 'HerMarket Product Sales (Artisan Infusions)',
    amount: 20000,
    type: 'income',
    category: 'Business Revenue',
    date: '2026-11-05',
    paymentMethod: 'UPI',
    notes: 'Bimonthly marketplace settlement',
    createdAt: '2026-11-05T14:30:00Z'
  },
  {
    id: 'tx-103',
    userId: 'usr-101',
    title: 'Apartment Rent & Society Maintenance',
    amount: 16500,
    type: 'expense',
    category: 'Rent & Housing',
    date: '2026-11-03',
    paymentMethod: 'Net Banking',
    notes: 'Monthly residence lease payment',
    isRecurring: true,
    recurringFrequency: 'monthly',
    createdAt: '2026-11-03T09:15:00Z'
  },
  {
    id: 'tx-104',
    userId: 'usr-101',
    title: "Nature's Basket Organic Groceries",
    amount: 5800,
    type: 'expense',
    category: 'Groceries & Staples',
    date: '2026-11-06',
    paymentMethod: 'UPI',
    notes: 'Monthly pantry restock, cold-pressed oils & grains',
    createdAt: '2026-11-06T18:20:00Z'
  },
  {
    id: 'tx-105',
    userId: 'usr-101',
    title: 'WeWork Coworking Desk & High-Speed Fiber',
    amount: 4500,
    type: 'expense',
    category: 'Utilities & Bills',
    date: '2026-11-04',
    paymentMethod: 'Credit Card',
    notes: 'Dedicated desk access and 500Mbps broadband',
    createdAt: '2026-11-04T11:45:00Z'
  },
  {
    id: 'tx-106',
    userId: 'usr-101',
    title: 'Nifty 50 Index Mutual Fund SIP',
    amount: 10000,
    type: 'expense',
    category: 'Education & Upskilling',
    date: '2026-11-07',
    paymentMethod: 'Net Banking',
    notes: 'Automated wealth accumulator SIP',
    isRecurring: true,
    recurringFrequency: 'monthly',
    createdAt: '2026-11-07T08:00:00Z'
  },
  {
    id: 'tx-107',
    userId: 'usr-101',
    title: 'Annual Health & Preventive Care Checkup',
    amount: 2800,
    type: 'expense',
    category: 'Healthcare & Wellness',
    date: '2026-11-09',
    paymentMethod: 'Credit Card',
    notes: 'Comprehensive diagnostic blood panel and consult',
    createdAt: '2026-11-09T16:10:00Z'
  },
  {
    id: 'tx-108',
    userId: 'usr-101',
    title: 'Weekend Social Dinner & Cafe Work',
    amount: 2150,
    type: 'expense',
    category: 'Dining & Entertainment',
    date: '2026-11-10',
    paymentMethod: 'UPI',
    notes: 'Dinner with peer founders',
    createdAt: '2026-11-10T21:00:00Z'
  }
];

export const initialSavingsGoalsList: SavingsGoalRecord[] = [];
const _legacyDummyGoals: SavingsGoalRecord[] = [
  {
    id: 'goal-emergency',
    userId: 'usr-101',
    title: '6-Month Liquid Emergency Reserve',
    targetAmount: 180000,
    currentAmount: 135000,
    targetDate: '2027-04-30',
    startDate: '2026-05-01',
    category: 'Emergency Fund',
    status: 'active',
    color: '#0d9488', // Teal
    contributions: [
      { id: 'c1', goalId: 'goal-emergency', amount: 25000, date: '2026-09-01', notes: 'Quarterly bonus deposit' },
      { id: 'c2', goalId: 'goal-emergency', amount: 15000, date: '2026-10-01', notes: 'Monthly automated transfer' },
      { id: 'c3', goalId: 'goal-emergency', amount: 10000, date: '2026-11-05', notes: 'Consulting surplus allocation' }
    ],
    createdAt: '2026-05-01T00:00:00Z'
  },
  {
    id: 'goal-startup',
    userId: 'usr-101',
    title: 'Micro-Enterprise Seed Capital (Packaging & Raw Stock)',
    targetAmount: 100000,
    currentAmount: 68000,
    targetDate: '2027-06-30',
    startDate: '2026-08-01',
    category: 'Starting a Business',
    status: 'active',
    color: '#1e3a8a', // Navy
    contributions: [
      { id: 'c4', goalId: 'goal-startup', amount: 20000, date: '2026-10-15', notes: 'HerMarket early profits' }
    ],
    createdAt: '2026-08-01T00:00:00Z'
  },
  {
    id: 'goal-tech',
    userId: 'usr-101',
    title: 'MacBook Pro M3 for Design & Marketing Workflow',
    targetAmount: 85000,
    currentAmount: 85000,
    targetDate: '2026-10-31',
    startDate: '2026-04-01',
    category: 'New Laptop',
    status: 'completed',
    color: '#059669', // Emerald
    contributions: [
      { id: 'c5', goalId: 'goal-tech', amount: 85000, date: '2026-10-25', notes: 'Goal fully achieved!' }
    ],
    createdAt: '2026-04-01T00:00:00Z'
  },
  {
    id: 'goal-upskilling',
    userId: 'usr-101',
    title: 'Executive Financial Coaching & NISM Certification',
    targetAmount: 35000,
    currentAmount: 22000,
    targetDate: '2027-02-28',
    startDate: '2026-09-15',
    category: 'Education',
    status: 'active',
    color: '#d97706',
    contributions: [],
    createdAt: '2026-09-15T00:00:00Z'
  }
];

export const initialBudget: BudgetRecord = {
  id: 'budget-2026-11',
  userId: 'usr-101',
  month: '2026-11',
  totalBudget: 53000,
  categories: defaultCategories.map((c) => ({
    categoryId: c.id,
    categoryName: c.name,
    limit: c.allocatedLimit,
    spent: 0,
    color: c.color
  })),
  createdAt: '2026-11-01T00:00:00Z',
  updatedAt: new Date().toISOString()
};

export const initialNotifications: NotificationItem[] = [];
const _legacyDummyNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'usr-101',
    title: 'Emergency Fund Milestone Reached! 🛡️',
    message: 'Congratulations! Your Emergency Reserve reached ₹1,35,000 (75% of your 6-month independence target).',
    type: 'goal_achieved',
    isRead: false,
    date: '2026-11-08'
  },
  {
    id: 'notif-2',
    userId: 'usr-101',
    title: 'Category Budget Warning: Rent & Housing',
    message: 'Your Rent & Housing spend reached ₹16,500 of ₹18,000 limit (91.6% allocated).',
    type: 'budget_warning',
    isRead: false,
    date: '2026-11-04'
  },
  {
    id: 'notif-3',
    userId: 'usr-101',
    title: 'Monthly Cashflow Digest',
    message: 'Inflow of ₹65,000 exceeds outgoings by ₹33,250 this month. Great savings pace!',
    type: 'monthly_summary',
    isRead: true,
    date: '2026-11-01'
  }
];

export const initialPreferences: UserPreferences = {
  userId: 'usr-101',
  notifyAt80Percent: true,
  notifyAt100Percent: true,
  monthlySummaryEmail: true,
  goalDeadlinesAlert: true,
  autoDetectRecurring: true,
  theme: 'fintech-navy'
};

// --- Storage API Helpers ---

export function isFinanceSetupCompleted(): boolean {
  return localStorage.getItem('herfinance_setup_completed') === 'true';
}

export const blankFinancialProfile: FinancialProfile = {
  userId: 'usr-new',
  fullName: '',
  email: '',
  monthlyIncome: 0,
  incomeSources: [],
  emergencyFundTargetMonths: 6,
  monthlySavingsTarget: 0,
  riskTolerance: 'moderate',
  financialScore: 0,
  currency: 'INR',
  updatedAt: new Date().toISOString()
};

export function getStoredProfile(): FinancialProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.fullName?.includes('Ananya') || parsed?.email?.includes('ananya') || parsed?.monthlyIncome === 145000) {
        localStorage.removeItem(STORAGE_KEYS.PROFILE);
        return blankFinancialProfile;
      }
      return parsed;
    }
    return blankFinancialProfile;
  } catch {
    return blankFinancialProfile;
  }
}

export function saveStoredProfile(profile: FinancialProfile): void {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function getStoredTransactions(): TransactionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (raw) {
      if (raw.includes('tx-101') || raw.includes('Consulting Retainer') || raw.includes('Artisan Infusions')) {
        localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
        return [];
      }
      return JSON.parse(raw);
    }
    return [];
  } catch {
    return [];
  }
}

export function saveStoredTransactions(transactions: TransactionRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
}

export function getStoredBudget(): BudgetRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (raw) {
      if (raw.includes('usr-101') || raw.includes('53000')) {
        localStorage.removeItem(STORAGE_KEYS.BUDGETS);
      } else {
        return JSON.parse(raw);
      }
    }

    return {
      id: 'b-new',
      userId: 'usr-new',
      totalBudget: 0,
      month: 'Current Month',
      categories: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch {
    return {
      id: 'b-new',
      userId: 'usr-new',
      totalBudget: 0,
      month: 'Current Month',
      categories: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}

export function saveStoredBudget(budget: BudgetRecord): void {
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budget));
}

export function getStoredGoals(): SavingsGoalRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (raw) {
      if (raw.includes('goal-emergency') || raw.includes('MacBook') || raw.includes('180000')) {
        localStorage.removeItem(STORAGE_KEYS.GOALS);
        return [];
      }
      return JSON.parse(raw);
    }
    return [];
  } catch {
    return [];
  }
}

export function saveStoredGoals(goals: SavingsGoalRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
}

export function getStoredLessons(): typeof comprehensiveFinancialLessons {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LESSONS);
    return raw ? JSON.parse(raw) : comprehensiveFinancialLessons;
  } catch {
    return comprehensiveFinancialLessons;
  }
}

export function saveStoredLessons(lessons: typeof comprehensiveFinancialLessons): void {
  localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
}

export function getStoredNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (raw) return JSON.parse(raw);
    return [];
  } catch {
    return [];
  }
}

export function saveStoredNotifications(notifs: NotificationItem[]): void {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
}

export function getStoredPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return raw ? JSON.parse(raw) : initialPreferences;
  } catch {
    return initialPreferences;
  }
}

export function saveStoredPreferences(prefs: UserPreferences): void {
  localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
}
