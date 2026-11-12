import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, SavingsGoal, BudgetCategory } from '../types';

interface FinanceContextType {
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  budgetCategories: BudgetCategory[];
  totalIncome: number;
  totalExpenses: number;
  currentSavings: number;
  monthlyBudget: number;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => void;
  depositToGoal: (goalId: string, amount: number) => void;
  updateMonthlyBudget: (amount: number) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const hfTxs = localStorage.getItem('herfinance_transactions');
      if (hfTxs) {
        const parsed = JSON.parse(hfTxs);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const stored = localStorage.getItem('herrise_finance_transactions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    try {
      const hfGoals = localStorage.getItem('herfinance_goals');
      if (hfGoals) {
        const parsed = JSON.parse(hfGoals);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const stored = localStorage.getItem('herrise_finance_goals');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(() => {
    try {
      const hfBudgets = localStorage.getItem('herfinance_budgets');
      if (hfBudgets) {
        const parsed = JSON.parse(hfBudgets);
        if (parsed?.categories && Array.isArray(parsed.categories) && parsed.categories.length > 0) {
          return parsed.categories.map((c: any) => ({
            category: c.categoryName,
            allocated: c.limit,
            spent: c.spent,
            color: c.color
          }));
        }
      }
      const stored = localStorage.getItem('herrise_finance_budget_categories');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    try {
      const hfBudgets = localStorage.getItem('herfinance_budgets');
      if (hfBudgets) {
        const parsed = JSON.parse(hfBudgets);
        if (parsed?.totalBudget) return Number(parsed.totalBudget);
      }
      const stored = localStorage.getItem('herrise_finance_budget_total');
      return stored ? Number(stored) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    localStorage.setItem('herrise_finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('herrise_finance_goals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem('herrise_finance_budget_categories', JSON.stringify(budgetCategories));
  }, [budgetCategories]);

  useEffect(() => {
    localStorage.setItem('herrise_finance_budget_total', monthlyBudget.toString());
  }, [monthlyBudget]);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentSavings = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: 'tx-' + Date.now().toString(36)
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Update budget category spent if expense
    if (tx.type === 'expense') {
      setBudgetCategories((prev) =>
        prev.map((cat) => {
          if (cat.category.toLowerCase().includes(tx.category.toLowerCase()) || tx.category.toLowerCase().includes(cat.category.toLowerCase())) {
            return { ...cat, spent: cat.spent + tx.amount };
          }
          return cat;
        })
      );
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: 'goal-' + Date.now().toString(36),
      currentAmount: 0
    };
    setSavingsGoals((prev) => [...prev, newGoal]);
  };

  const depositToGoal = (goalId: string, amount: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) } : g))
    );
  };

  const updateMonthlyBudget = (amount: number) => {
    setMonthlyBudget(amount);
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        savingsGoals,
        budgetCategories,
        totalIncome,
        totalExpenses,
        currentSavings,
        monthlyBudget,
        addTransaction,
        deleteTransaction,
        addSavingsGoal,
        depositToGoal,
        updateMonthlyBudget
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

