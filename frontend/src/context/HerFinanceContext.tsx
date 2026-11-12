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

export interface FinancialSetupData {
  fullName: string;
  email: string;
  location?: string;
  currency: string;
  monthlyIncome: number;
  incomeSources: { name: string; amount: number; type: string }[];
  monthlyExpenses: { category: string; amount: number }[];
  currentSavings: number;
  primaryGoal: {
    title: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    category: 'Emergency Fund' | 'Education' | 'New Laptop' | 'Travel' | 'Starting a Business' | 'Home Purchase' | 'General';
  };
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  emergencyFundTargetMonths: number;
}

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

  // Onboarding & Setup state
  isSetupCompleted: boolean;
  setupModalOpen: boolean;
  setSetupModalOpen: (open: boolean) => void;
  setupFinancialBaseline: (setupData: FinancialSetupData) => Promise<boolean>;

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

  const [isSetupCompleted, setIsSetupCompleted] = useState<boolean>(() => {
    return localStorage.getItem('herfinance_setup_completed') === 'true';
  });

  const [setupModalOpen, setSetupModalOpen] = useState<boolean>(() => {
    return localStorage.getItem('herfinance_setup_completed') !== 'true';
  });

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

  const setupFinancialBaseline = async (setupData: FinancialSetupData): Promise<boolean> => {
    // 1. Sync to backend MongoDB Atlas
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      await fetch(`${backendUrl}/api/finance/setup-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setupData)
      });
    } catch (err) {
      console.warn('[HerFinance] Atlas sync notice:', err);
    }

    // 2. Profile
    const updatedProfile: FinancialProfile = {
      userId: 'usr-101',
      fullName: setupData.fullName,
      email: setupData.email,
      monthlyIncome: setupData.monthlyIncome,
      incomeSources: setupData.incomeSources as any,
      emergencyFundTargetMonths: setupData.emergencyFundTargetMonths,
      monthlySavingsTarget: Math.round(setupData.monthlyIncome * 0.2),
      riskTolerance: setupData.riskTolerance,
      financialScore: 85,
      currency: setupData.currency,
      updatedAt: new Date().toISOString()
    };
    setProfile(updatedProfile);

    // 3. Category Budgets
    const colors = ['#1e3a8a', '#0d9488', '#059669', '#d97706', '#e11d48', '#9333ea', '#2563eb', '#f59e0b'];
    const totalExpenseBudget = setupData.monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const newCategories = setupData.monthlyExpenses
      .filter((e) => e.amount > 0)
      .map((e, idx) => ({
        categoryId: `cat-${e.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        categoryName: e.category,
        limit: e.amount,
        spent: 0,
        color: colors[idx % colors.length]
      }));

    setBudget({
      id: `budget-${Date.now()}`,
      userId: 'usr-101',
      month: new Date().toISOString().substring(0, 7),
      totalBudget: totalExpenseBudget,
      categories: newCategories,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // 4. Savings Goals
    const newGoalsList: SavingsGoalRecord[] = [];

    // A. Liquid Emergency Cushion Reserve if savings entered
    if (setupData.currentSavings > 0) {
      const totalPlannedExpenses = setupData.monthlyExpenses.reduce((s, e) => s + e.amount, 0);
      const targetRunwayAmt = totalPlannedExpenses * (setupData.emergencyFundTargetMonths || 6);
      newGoalsList.push({
        id: `goal-emergency-${Date.now()}`,
        userId: 'usr-101',
        title: 'Liquid Emergency Cushion',
        targetAmount: targetRunwayAmt > 0 ? targetRunwayAmt : setupData.currentSavings * 1.5,
        currentAmount: setupData.currentSavings,
        targetDate: '2027-06-30',
        startDate: new Date().toISOString().split('T')[0],
        category: 'Emergency Fund',
        status: 'active',
        color: '#1e3a8a',
        priority: 'high',
        contributions: [
          {
            id: `contrib-em-${Date.now()}`,
            goalId: `goal-emergency-${Date.now()}`,
            amount: setupData.currentSavings,
            date: new Date().toISOString().split('T')[0],
            notes: 'Current liquid bank balance'
          }
        ],
        createdAt: new Date().toISOString()
      });
    }

    // B. User's Primary Savings Goal
    if (setupData.primaryGoal && setupData.primaryGoal.title) {
      newGoalsList.push({
        id: `goal-primary-${Date.now()}`,
        userId: 'usr-101',
        title: setupData.primaryGoal.title,
        targetAmount: setupData.primaryGoal.targetAmount,
        currentAmount: setupData.primaryGoal.currentAmount || 0,
        targetDate: setupData.primaryGoal.targetDate,
        startDate: new Date().toISOString().split('T')[0],
        category: setupData.primaryGoal.category,
        status: 'active',
        color: '#0d9488',
        priority: 'high',
        contributions: setupData.primaryGoal.currentAmount > 0 ? [
          {
            id: `contrib-pr-${Date.now()}`,
            goalId: `goal-primary-${Date.now()}`,
            amount: setupData.primaryGoal.currentAmount,
            date: new Date().toISOString().split('T')[0],
            notes: 'Initial opening deposit'
          }
        ] : [],
        createdAt: new Date().toISOString()
      });
    }

    setGoals(newGoalsList);

    // 5. Inflow Opening Transactions
    const openingTxs: TransactionRecord[] = setupData.incomeSources.map((inc, i) => ({
      id: `tx-inflow-${i + 1}-${Date.now()}`,
      userId: 'usr-101',
      title: inc.name || 'Verified Monthly Inflow',
      amount: inc.amount,
      type: 'income',
      category: inc.name.toLowerCase().includes('salary') ? 'Monthly Salary' : 'Consulting / Freelance',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer',
      notes: 'User registered verified monthly inflow',
      createdAt: new Date().toISOString()
    }));
    setTransactions(openingTxs);

    // 6. Complete
    localStorage.setItem('herfinance_setup_completed', 'true');
    setIsSetupCompleted(true);
    setSetupModalOpen(false);
    return true;
  };

  const resetAllFinanceData = () => {
    localStorage.removeItem('herfinance_setup_completed');
    setIsSetupCompleted(false);
    setSetupModalOpen(true);
    setProfile(initialFinancialProfile);
    setTransactions([]);
    setBudget(initialBudget);
    setGoals([]);
    setLessons(comprehensiveFinancialLessons);
    setNotifications(initialNotifications);
    setPreferences(initialPreferences);
    showToast('Financial Profile Reset', 'Please enter your actual financial baseline', 'info');
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
        isSetupCompleted,
        setupModalOpen,
        setSetupModalOpen,
        setupFinancialBaseline,
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

