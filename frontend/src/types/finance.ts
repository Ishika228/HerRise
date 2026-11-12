// HerFinance - Complete Database & Domain Entity Types (Section 10)

export type TransactionType = 'income' | 'expense';

export type PaymentMethod =
  | 'UPI'
  | 'Credit Card'
  | 'Debit Card'
  | 'Net Banking'
  | 'Cash'
  | 'Bank Transfer';

export interface FinancialProfile {
  userId: string;
  fullName?: string;
  email?: string;
  monthlyIncome: number;
  incomeSources: { name: string; amount: number; type: 'salary' | 'freelance' | 'business' | 'other' }[];
  emergencyFundTargetMonths: number;
  monthlySavingsTarget: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  financialScore: number;
  currency: string;
  updatedAt: string;
}

export interface ExpenseCategoryItem {
  id: string;
  name: string;
  isCustom: boolean;
  allocatedLimit: number;
  color: string;
  iconName: string;
}

export interface TransactionRecord {
  id: string;
  userId: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
  receiptUrl?: string;
  receiptOcrData?: {
    merchant: string;
    amount: number;
    date: string;
    confidence: number;
  };
  isRecurring?: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'yearly';
  createdAt: string;
}

export interface BudgetRecord {
  id: string;
  userId: string;
  month: string; // e.g. "2026-11"
  totalBudget: number;
  categories: {
    categoryId: string;
    categoryName: string;
    limit: number;
    spent: number;
    color: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface SavingsContribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface SavingsGoalRecord {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  startDate: string;
  category: 'Emergency Fund' | 'Education' | 'New Laptop' | 'Travel' | 'Starting a Business' | 'Home Purchase' | 'General';
  status: 'active' | 'paused' | 'completed';
  color: string;
  priority?: 'high' | 'medium' | 'low';
  contributions: SavingsContribution[];
  createdAt: string;
}

export interface FinancialLessonItem {
  id: string;
  title: string;
  category:
    | 'Budgeting Basics'
    | 'Saving Money'
    | 'Banking Fundamentals'
    | 'Understanding Interest'
    | 'Loans and Debt Management'
    | 'Credit Scores'
    | 'Emergency Funds'
    | 'Financial Planning'
    | 'Personal Finance for Beginners'
    | 'Financial Independence';
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  content: string;
  keyTakeaways: string[];
  quiz: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  completed?: boolean;
  quizScore?: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'budget_limit' | 'budget_warning' | 'goal_achieved' | 'goal_reminder' | 'monthly_summary' | 'info';
  category?: string;
  isRead: boolean;
  date: string;
  actionUrl?: string;
}

export interface UserPreferences {
  userId: string;
  notifyAt80Percent: boolean;
  notifyAt100Percent: boolean;
  monthlySummaryEmail: boolean;
  goalDeadlinesAlert: boolean;
  autoDetectRecurring: boolean;
  theme: 'fintech-navy';
}

export interface AIChatRecord {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  contextUsed?: {
    incomeAnalyzed?: number;
    expensesAnalyzed?: number;
    topCategory?: string;
  };
}
