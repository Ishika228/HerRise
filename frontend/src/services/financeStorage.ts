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

export const initialSavingsGoalsList: SavingsGoalRecord[] = [];

export const initialBudget: BudgetRecord = {
  id: 'budget-user',
  userId: 'usr-new',
  month: 'Current Month',
  totalBudget: 0,
  categories: defaultCategories.map((c) => ({
    categoryId: c.id,
    categoryName: c.name,
    limit: 0,
    spent: 0,
    color: c.color
  })),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const initialNotifications: NotificationItem[] = [];

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
