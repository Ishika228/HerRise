import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  TransactionRecord,
  BudgetRecord,
  SavingsGoalRecord,
  FinancialProfile,
  NotificationItem,
  UserPreferences,
  FinancialLessonItem
} from '../types/finance';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredTransactions,
  saveStoredTransactions,
  getStoredBudget,
  saveStoredBudget,
  getStoredGoals,
  saveStoredGoals,
  getStoredLessons,
  saveStoredLessons,
  getStoredNotifications,
  saveStoredNotifications,
  getStoredPreferences,
  saveStoredPreferences,
  initialTransactionsList,
  initialFinancialProfile,
  initialBudget,
  initialSavingsGoalsList,
  initialNotifications,
  initialPreferences
} from '../services/financeStorage';
import { comprehensiveFinancialLessons } from '../data/mockData/financialLessonsData';
import { useToast } from './ToastContext';

export type DateFilterType = 'this_month' | 'last_month' | 'last_3_months' | 'all';

interface HerFinanceContextType {
  profile: FinancialProfile;
  transactions: TransactionRecord[];
  budget: BudgetRecord;
  goals: SavingsGoalRecord[];
  lessons: FinancialLessonItem[];
  notifications: NotificationItem[];
  preferences: UserPreferences;
  dateFilter: DateFilterType;
  setDateFilter: (filter: DateFilterType) => void;

  // Filtered & computed metrics
  filteredTransactions: TransactionRecord[];
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  totalSavings: number;
  remainingBudget: number;
  emergencyFundCoverageMonths: number;
  unreadNotificationsCount: number;

  // CRUD & actions
  addTransaction: (data: Omit<TransactionRecord, 'id' | 'userId' | 'createdAt'>) => TransactionRecord;
  editTransaction: (id: string, data: Partial<TransactionRecord>) => void;
  deleteTransaction: (id: string) => void;

  updateBudgetCategoryLimit: (categoryId: string, limit: number) => void;
  addCustomCategory: (name: string, limit: number, color?: string) => void;
  deleteCategory: (categoryId: string) => void;

  addSavingsGoal: (data: Omit<SavingsGoalRecord, 'id' | 'userId' | 'currentAmount' | 'contributions' | 'createdAt' | 'status'>) => void;
  editSavingsGoal: (id: string, data: Partial<SavingsGoalRecord>) => void;
  deleteSavingsGoal: (id: string) => void;
  togglePauseGoal: (id: string) => void;
  contributeToGoal: (goalId: string, amount: number, notes?: string) => void;

  updateProfile: (data: Partial<FinancialProfile>) => void;
  updatePreferences: (data: Partial<UserPreferences>) => void;
  markLessonComplete: (lessonId: string, quizScore?: number) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetAllFinanceData: () => void;
}

const HerFinanceContext = createContext<HerFinanceContextType | undefined>(undefined);

export const HerFinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [profile, setProfile] = useState<FinancialProfile>(getStoredProfile);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(getStoredTransactions);
  const [budget, setBudget] = useState<BudgetRecord>(getStoredBudget);
  const [goals, setGoals] = useState<SavingsGoalRecord[]>(getStoredGoals);
  const [lessons, setLessons] = useState<FinancialLessonItem[]>(getStoredLessons);
  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications);
  const [preferences, setPreferences] = useState<UserPreferences>(getStoredPreferences);
  const [dateFilter, setDateFilter] = useState<DateFilterType>('this_month');

  // Sync to localStorage
  useEffect(() => { saveStoredProfile(profile); }, [profile]);
  useEffect(() => { saveStoredTransactions(transactions); }, [transactions]);
  useEffect(() => { saveStoredBudget(budget); }, [budget]);
  useEffect(() => { saveStoredGoals(goals); }, [goals]);
  useEffect(() => { saveStoredLessons(lessons); }, [lessons]);
  useEffect(() => { saveStoredNotifications(notifications); }, [notifications]);
  useEffect(() => { saveStoredPreferences(preferences); }, [preferences]);

  // Recalculate budget spent dynamically when transactions change
  useEffect(() => {
    setBudget((prev) => {
      const updatedCategories = prev.categories.map((cat) => {
        const spent = transactions
          .filter((t) => t.type === 'expense' && (t.category === cat.categoryName || cat.categoryName.includes(t.category) || t.category.includes(cat.categoryName)))
          .reduce((sum, t) => sum + t.amount, 0);
        return { ...cat, spent };
      });
      const totalBudget = updatedCategories.reduce((sum, c) => sum + c.limit, 0);
      return { ...prev, categories: updatedCategories, totalBudget, updatedAt: new Date().toISOString() };
    });
  }, [transactions]);

  // Date filtering logic
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    return transactions.filter((t) => {
      if (dateFilter === 'all') return true;
      const tDate = new Date(t.date);
      const tYear = tDate.getFullYear();
      const tMonth = tDate.getMonth();

      if (dateFilter === 'this_month') {
        return tYear === currentYear && tMonth === currentMonth;
      }
      if (dateFilter === 'last_month') {
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return tYear === prevYear && tMonth === prevMonth;
      }
      if (dateFilter === 'last_3_months') {
        const threeMonthsAgo = new Date(currentYear, currentMonth - 2, 1);
        return tDate >= threeMonthsAgo;
      }
      return true;
    });
  }, [transactions, dateFilter]);

  // Financial calculations
  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) || (dateFilter === 'this_month' ? profile.monthlyIncome : 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;
  const totalSavings = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const remainingBudget = Math.max(0, budget.totalBudget - totalExpenses);

  const monthlyMandatoryNeeds = Math.max(1, totalExpenses > 0 ? totalExpenses * 0.75 : 25000);
  const emergencyFundCoverageMonths = Number((totalSavings / monthlyMandatoryNeeds).toFixed(1));
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // Add Transaction with automated Budget Threshold Notifications
  const addTransaction = (data: Omit<TransactionRecord, 'id' | 'userId' | 'createdAt'>): TransactionRecord => {
    const newTx: TransactionRecord = {
      ...data,
      id: 'tx-' + Date.now().toString(36),
      userId: profile.userId,
      createdAt: new Date().toISOString()
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Check budget alert if expense
    if (data.type === 'expense') {
      const categoryMatch = budget.categories.find(
        (c) => c.categoryName === data.category || data.category.includes(c.categoryName)
      );
      if (categoryMatch) {
        const newTotalSpent = categoryMatch.spent + data.amount;
        const percent = Math.round((newTotalSpent / categoryMatch.limit) * 100);

        if (percent >= 100 && preferences.notifyAt100Percent) {
          const alertNotif: NotificationItem = {
            id: 'notif-' + Date.now().toString(36),
            userId: profile.userId,
            title: `Budget Limit Exceeded: ${categoryMatch.categoryName} (100%)`,
            message: `Spending reached ₹${newTotalSpent.toLocaleString()} of ₹${categoryMatch.limit.toLocaleString()} budget limit.`,
            type: 'budget_limit',
            isRead: false,
            date: new Date().toISOString().split('T')[0]
          };
          setNotifications((prev) => [alertNotif, ...prev]);
          showToast('Budget Limit Exceeded!', `${categoryMatch.categoryName} is at ${percent}% of budget.`, 'error');
        } else if (percent >= 80 && preferences.notifyAt80Percent) {
          const warnNotif: NotificationItem = {
            id: 'notif-' + Date.now().toString(36),
            userId: profile.userId,
            title: `Budget Warning: ${categoryMatch.categoryName} (${percent}%)`,
            message: `You have utilized 80%+ of your ${categoryMatch.categoryName} budget limit.`,
            type: 'budget_warning',
            isRead: false,
            date: new Date().toISOString().split('T')[0]
          };
          setNotifications((prev) => [warnNotif, ...prev]);
          showToast('Budget Threshold Warning', `${categoryMatch.categoryName} reached ${percent}% of limit.`, 'warning');
        }
      }
    }

    return newTx;
  };

  const editTransaction = (id: string, data: Partial<TransactionRecord>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    showToast('Transaction Updated', 'Changes saved to your financial ledger', 'success');
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaction Deleted', 'Entry removed from records', 'info');
  };

  const updateBudgetCategoryLimit = (categoryId: string, limit: number) => {
    setBudget((prev) => {
      const categories = prev.categories.map((c) =>
        c.categoryId === categoryId ? { ...c, limit } : c
      );
      return {
        ...prev,
        categories,
        totalBudget: categories.reduce((sum, c) => sum + c.limit, 0),
        updatedAt: new Date().toISOString()
      };
    });
    showToast('Budget Limit Updated', `New allocation set to ₹${limit.toLocaleString()}`, 'success');
  };

  const addCustomCategory = (name: string, limit: number, color = '#0d9488') => {
    const newCatId = 'cat-custom-' + Date.now().toString(36);
    setBudget((prev) => {
      const categories = [
        ...prev.categories,
        {
          categoryId: newCatId,
          categoryName: name,
          limit,
          spent: 0,
          color
        }
      ];
      return {
        ...prev,
        categories,
        totalBudget: categories.reduce((sum, c) => sum + c.limit, 0),
        updatedAt: new Date().toISOString()
      };
    });
    showToast('Category Created', `${name} with ₹${limit.toLocaleString()} budget added`, 'success');
  };

  const deleteCategory = (categoryId: string) => {
    setBudget((prev) => {
      const categories = prev.categories.filter((c) => c.categoryId !== categoryId);
      return {
        ...prev,
        categories,
        totalBudget: categories.reduce((sum, c) => sum + c.limit, 0),
        updatedAt: new Date().toISOString()
      };
    });
    showToast('Category Removed', 'Category removed from budget tracking', 'info');
  };

  const addSavingsGoal = (
    data: Omit<SavingsGoalRecord, 'id' | 'userId' | 'currentAmount' | 'contributions' | 'createdAt' | 'status'>
  ) => {
    const newGoal: SavingsGoalRecord = {
      ...data,
      id: 'goal-' + Date.now().toString(36),
      userId: profile.userId,
      currentAmount: 0,
      contributions: [],
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setGoals((prev) => [...prev, newGoal]);
    showToast('Savings Goal Created', `Target ₹${data.targetAmount.toLocaleString()} added`, 'success');
  };

  const editSavingsGoal = (id: string, data: Partial<SavingsGoalRecord>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)));
    showToast('Goal Updated', 'Changes saved successfully', 'success');
  };

  const deleteSavingsGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    showToast('Goal Deleted', 'Removed from savings roadmap', 'info');
  };

  const togglePauseGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const nextStatus = g.status === 'paused' ? 'active' : 'paused';
          showToast(`Goal ${nextStatus === 'paused' ? 'Paused' : 'Resumed'}`, g.title, 'info');
          return { ...g, status: nextStatus };
        }
        return g;
      })
    );
  };

  const contributeToGoal = (goalId: string, amount: number, notes?: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const nextAmount = g.currentAmount + amount;
          const isCompleted = nextAmount >= g.targetAmount;
          const contribution = {
            id: 'c-' + Date.now().toString(36),
            goalId,
            amount,
            date: new Date().toISOString().split('T')[0],
            notes: notes || 'Deposit'
          };

          if (isCompleted && g.status !== 'completed') {
            const achNotif: NotificationItem = {
              id: 'notif-' + Date.now().toString(36),
              userId: profile.userId,
              title: `🎉 Goal Achieved: ${g.title}`,
              message: `Congratulations! You have reached your ₹${g.targetAmount.toLocaleString()} target!`,
              type: 'goal_achieved',
              isRead: false,
              date: new Date().toISOString().split('T')[0]
            };
            setNotifications((p) => [achNotif, ...p]);
            showToast('Goal 100% Achieved! 🎉', g.title, 'success');
          }

          return {
            ...g,
            currentAmount: nextAmount,
            status: isCompleted ? 'completed' : g.status,
            contributions: [contribution, ...g.contributions]
          };
        }
        return g;
      })
    );
  };

  const updateProfile = (data: Partial<FinancialProfile>) => {
    setProfile((prev) => ({ ...prev, ...data, updatedAt: new Date().toISOString() }));
    showToast('Financial Profile Updated', 'Income & baseline preferences saved', 'success');
  };

  const updatePreferences = (data: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...data }));
    showToast('Preferences Saved', 'Notification thresholds updated', 'success');
  };

  const markLessonComplete = (lessonId: string, quizScore?: number) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === lessonId ? { ...l, completed: true, quizScore } : l))
    );
    showToast('Lesson Completed! 🎓', 'Your learning record has been updated', 'success');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('Notifications Cleared', 'All alerts cleared', 'info');
  };

  const resetAllFinanceData = () => {
    setProfile(initialFinancialProfile);
    setTransactions(initialTransactionsList);
    setBudget(initialBudget);
    setGoals(initialSavingsGoalsList);
    setLessons(comprehensiveFinancialLessons);
    setNotifications(initialNotifications);
    setPreferences(initialPreferences);
    localStorage.clear();
    showToast('Data Reset', 'Restored to clean demo fintech state', 'info');
  };

  return (
    <HerFinanceContext.Provider
      value={{
        profile,
        transactions,
        budget,
        goals,
        lessons,
        notifications,
        preferences,
        dateFilter,
        setDateFilter,
        filteredTransactions,
        totalIncome,
        totalExpenses,
        netBalance,
        totalSavings,
        remainingBudget,
        emergencyFundCoverageMonths,
        unreadNotificationsCount,
        addTransaction,
        editTransaction,
        deleteTransaction,
        updateBudgetCategoryLimit,
        addCustomCategory,
        deleteCategory,
        addSavingsGoal,
        editSavingsGoal,
        deleteSavingsGoal,
        togglePauseGoal,
        contributeToGoal,
        updateProfile,
        updatePreferences,
        markLessonComplete,
        markNotificationAsRead,
        clearAllNotifications,
        resetAllFinanceData
      }}
    >
      {children}
    </HerFinanceContext.Provider>
  );
};

export const useHerFinance = () => {
  const context = useContext(HerFinanceContext);
  if (!context) {
    throw new Error('useHerFinance must be used within a HerFinanceProvider');
  }
  return context;
};
