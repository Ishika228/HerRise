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

// Initial In-Memory State (Starts empty - populated only by database & live API data)
export const store = {
  users: [] as User[],
  transactions: [] as Transaction[],
  budgetCategories: [] as BudgetCategory[],
  goals: [] as SavingsGoal[],
  jobs: [] as any[],
  grants: [] as any[],
  products: [] as any[],
  courses: [] as any[],
  mentors: [] as any[]
};

