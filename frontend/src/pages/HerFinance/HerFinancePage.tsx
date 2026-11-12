import React, { useState } from 'react';
import {
  PlusCircle,
  Wallet,
  PiggyBank,
  Receipt,
  DollarSign,
  Calendar,
  Tag,
  CreditCard,
  AlertCircle,
  Sliders,
  Sparkles
} from 'lucide-react';
import { HerFinanceProvider, useHerFinance } from '../../context/HerFinanceContext';
import { HerFinanceLayout, HerFinanceTab } from './HerFinanceLayout';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { FinancialSetupWizard } from './components/FinancialSetupWizard';

// 10 Core Views
import { HerFinanceDashboardView } from './views/HerFinanceDashboardView';
import { BudgetManagementView } from './views/BudgetManagementView';
import { SavingsGoalsView } from './views/SavingsGoalsView';
import { ExpenseTrackerView } from './views/ExpenseTrackerView';
import { TransactionHistoryView } from './views/TransactionHistoryView';
import { FinancialLearningView } from './views/FinancialLearningView';
import { HerFinanceAIAssistantView } from './views/HerFinanceAIAssistantView';
import { FinancialReportsView } from './views/FinancialReportsView';
import { NotificationsView } from './views/NotificationsView';
import { FinancialProfileView } from './views/FinancialProfileView';
import { PaymentMethod, TransactionType } from '../../types/finance';

const HerFinanceContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HerFinanceTab>('dashboard');
  const {
    addTransaction,
    addSavingsGoal,
    budget,
    profile,
    setupModalOpen,
    setSetupModalOpen,
    setupFinancialBaseline,
    isSetupCompleted
  } = useHerFinance();
  const { showToast } = useToast();

  // Modals state
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [goalModalOpen, setGoalModalOpen] = useState(false);

  // Income form state
  const [incomeForm, setIncomeForm] = useState({
    title: '',
    amount: '',
    category: 'Consulting / Freelance',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Transfer' as PaymentMethod,
    notes: ''
  });

  // Expense form state
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    category: 'Groceries & Essentials',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI' as PaymentMethod,
    notes: ''
  });

  // Goal form state
  const [goalForm, setGoalForm] = useState({
    title: '',
    targetAmount: '',
    targetDate: '2026-12-31',
    category: 'Emergency Fund' as
      | 'Emergency Fund'
      | 'Education'
      | 'New Laptop'
      | 'Travel'
      | 'Starting a Business'
      | 'Home Purchase'
      | 'General',
    priority: 'high' as 'high' | 'medium' | 'low'
  });

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(incomeForm.amount);
    if (!incomeForm.title || isNaN(amountNum) || amountNum <= 0) {
      showToast('Please provide a valid income title and amount', 'error');
      return;
    }

    addTransaction({
      title: incomeForm.title,
      amount: amountNum,
      type: 'income',
      category: incomeForm.category,
      date: incomeForm.date,
      paymentMethod: incomeForm.paymentMethod,
      notes: incomeForm.notes
    });

    setIncomeForm({
      title: '',
      amount: '',
      category: 'Consulting / Freelance',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer',
      notes: ''
    });

    setIncomeModalOpen(false);
    showToast(`Added income ₹${amountNum.toLocaleString()} successfully!`, 'success');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(expenseForm.amount);
    if (!expenseForm.title || isNaN(amountNum) || amountNum <= 0) {
      showToast('Please provide a valid expense title and amount', 'error');
      return;
    }

    addTransaction({
      title: expenseForm.title,
      amount: amountNum,
      type: 'expense',
      category: expenseForm.category,
      date: expenseForm.date,
      paymentMethod: expenseForm.paymentMethod,
      notes: expenseForm.notes
    });

    setExpenseForm({
      title: '',
      amount: '',
      category: 'Groceries & Essentials',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI',
      notes: ''
    });

    setExpenseModalOpen(false);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const targetNum = Number(goalForm.targetAmount);
    if (!goalForm.title || isNaN(targetNum) || targetNum <= 0) {
      showToast('Please enter a valid goal name and target amount', 'error');
      return;
    }

    addSavingsGoal({
      title: goalForm.title,
      targetAmount: targetNum,
      targetDate: goalForm.targetDate,
      startDate: new Date().toISOString().split('T')[0],
      category: goalForm.category,
      color: '#0d9488',
      priority: goalForm.priority
    });

    setGoalForm({
      title: '',
      targetAmount: '',
      targetDate: '2026-12-31',
      category: 'Emergency Fund',
      priority: 'high'
    });

    setGoalModalOpen(false);
    showToast(`Created savings goal "${goalForm.title}" for ₹${targetNum.toLocaleString()}!`, 'success');
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <HerFinanceDashboardView
            onNavigateTab={setActiveTab}
            onOpenAddExpense={() => setExpenseModalOpen(true)}
            onOpenAddIncome={() => setIncomeModalOpen(true)}
          />
        );
      case 'budget':
        return <BudgetManagementView />;
      case 'goals':
        return <SavingsGoalsView />;
      case 'expenses':
        return <ExpenseTrackerView />;
      case 'history':
        return <TransactionHistoryView />;
      case 'learn':
        return <FinancialLearningView />;
      case 'assistant':
        return <HerFinanceAIAssistantView onNavigateTab={setActiveTab} />;
      case 'reports':
        return <FinancialReportsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <FinancialProfileView />;
      default:
        return (
          <HerFinanceDashboardView
            onNavigateTab={setActiveTab}
            onOpenAddExpense={() => setExpenseModalOpen(true)}
            onOpenAddIncome={() => setIncomeModalOpen(true)}
          />
        );
    }
  };

  return (
    <HerFinanceLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onOpenAddExpenseModal={() => setExpenseModalOpen(true)}
      onOpenAddIncomeModal={() => setIncomeModalOpen(true)}
      onOpenAddGoalModal={() => setGoalModalOpen(true)}
      onOpenSetupBaseline={() => setSetupModalOpen(true)}
    >
      {/* Dynamic Profile Intake Prompt Banner if incomplete */}
      {!isSetupCompleted && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900">Personalized Financial Baseline Needed</h4>
              <p className="text-xs text-amber-700 leading-relaxed mt-0.5">
                HerFinance requires your real income streams, monthly obligations, and savings targets to compute your
                ledger without static demo numbers.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSetupModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0f172a] hover:bg-slate-800 text-teal-400 font-bold text-xs rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Complete Setup Wizard</span>
          </button>
        </div>
      )}

      {renderActiveView()}

      {/* Interactive Financial Registration & Setup Intake Wizard */}
      <FinancialSetupWizard
        isOpen={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        onSubmitSetup={setupFinancialBaseline}
        initialData={{
          fullName: profile.fullName,
          email: profile.email,
          currency: profile.currency
        }}
      />

      {/* Global Add Income Modal */}
      <Modal
        isOpen={incomeModalOpen}
        onClose={() => setIncomeModalOpen(false)}
        title="Record New Income Inflow"
      >
        <form onSubmit={handleAddIncome} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Income Source / Description
            </label>
            <input
              type="text"
              placeholder="e.g. Client Retainer, Monthly Salary, Product Sale"
              value={incomeForm.title}
              onChange={(e) => setIncomeForm({ ...incomeForm, title: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                placeholder="25000"
                value={incomeForm.amount}
                onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                required
                min={1}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Category
              </label>
              <select
                value={incomeForm.category}
                onChange={(e) => setIncomeForm({ ...incomeForm, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="Monthly Salary">Monthly Salary</option>
                <option value="Consulting / Freelance">Consulting / Freelance</option>
                <option value="HerMarket Store Revenue">HerMarket Store Revenue</option>
                <option value="Investment Dividend">Investment Dividend</option>
                <option value="Grant & Fellowship">Grant & Fellowship</option>
                <option value="Other Inflow">Other Inflow</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Date</label>
              <input
                type="date"
                value={incomeForm.date}
                onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Payment Channel
              </label>
              <select
                value={incomeForm.paymentMethod}
                onChange={(e) =>
                  setIncomeForm({
                    ...incomeForm,
                    paymentMethod: e.target.value as PaymentMethod
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="Bank Transfer">Bank Transfer (NEFT / IMPS)</option>
                <option value="UPI">UPI</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash">Cash</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Milestone 2 payment from client"
              value={incomeForm.notes}
              onChange={(e) => setIncomeForm({ ...incomeForm, notes: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={() => setIncomeModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              Save Inflow
            </button>
          </div>
        </form>
      </Modal>

      {/* Global Add Expense Modal */}
      <Modal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        title="Record New Outgoing Expense"
      >
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Expense Item / Merchant
            </label>
            <input
              type="text"
              placeholder="e.g. Fresh Produce, WeWork Desk, Electric Bill"
              value={expenseForm.title}
              onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                placeholder="1500"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                required
                min={1}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Category
              </label>
              <select
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                {budget.categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryName}>
                    {c.categoryName}
                  </option>
                ))}
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Date</label>
              <input
                type="date"
                value={expenseForm.date}
                onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Payment Channel
              </label>
              <select
                value={expenseForm.paymentMethod}
                onChange={(e) =>
                  setExpenseForm({
                    ...expenseForm,
                    paymentMethod: e.target.value as PaymentMethod
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="UPI">UPI (Google Pay / PhonePe)</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash">Cash</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Business tax deductible expense"
              value={expenseForm.notes}
              onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={() => setExpenseModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              Record Outflow
            </button>
          </div>
        </form>
      </Modal>

      {/* Global Add Savings Goal Modal */}
      <Modal
        isOpen={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        title="Launch New Savings Goal"
      >
        <form onSubmit={handleAddGoal} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Goal Purpose / Title
            </label>
            <input
              type="text"
              placeholder="e.g. 6-Month Emergency Cushion, Laptop Upgrade, Seed Capital"
              value={goalForm.title}
              onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Target Capital (₹)
              </label>
              <input
                type="number"
                placeholder="100000"
                value={goalForm.targetAmount}
                onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
                required
                min={500}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={goalForm.targetDate}
                onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Category
              </label>
              <select
                value={goalForm.category}
                onChange={(e) =>
                  setGoalForm({
                    ...goalForm,
                    category: e.target.value as
                      | 'Emergency Fund'
                      | 'Education'
                      | 'New Laptop'
                      | 'Travel'
                      | 'Starting a Business'
                      | 'Home Purchase'
                      | 'General'
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="Emergency Fund">Emergency Fund</option>
                <option value="Education">Education</option>
                <option value="New Laptop">New Laptop</option>
                <option value="Travel">Travel</option>
                <option value="Starting a Business">Starting a Business</option>
                <option value="Home Purchase">Home Purchase</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Pacing Priority
              </label>
              <select
                value={goalForm.priority}
                onChange={(e) =>
                  setGoalForm({
                    ...goalForm,
                    priority: e.target.value as 'high' | 'medium' | 'low'
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="high">High (Core Safety / Top Urgency)</option>
                <option value="medium">Medium (Steady Growth)</option>
                <option value="low">Low (Flexible Milestone)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={() => setGoalModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0f172a] hover:bg-slate-800 text-teal-400 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              Initiate Goal
            </button>
          </div>
        </form>
      </Modal>
    </HerFinanceLayout>
  );
};

export const HerFinancePage: React.FC = () => {
  return (
    <HerFinanceProvider>
      <HerFinanceContent />
    </HerFinanceProvider>
  );
};

export default HerFinancePage;
