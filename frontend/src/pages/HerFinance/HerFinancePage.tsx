import React, { useState } from 'react';
import {
  Sparkles,
  AlertCircle,
  Plus,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { HerFinanceProvider, useHerFinance } from '../../context/HerFinanceContext';
import { HerFinanceLayout, HerFinanceTab } from './HerFinanceLayout';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { FinancialSetupWizard } from './components/FinancialSetupWizard';

import { HerFinanceDashboardView } from './views/HerFinanceDashboardView';
import { TransactionHistoryView } from './views/TransactionHistoryView';
import { FinancialLearningView } from './views/FinancialLearningView';
import { FinancialProfileView } from './views/FinancialProfileView';
import { PaymentMethod, TransactionType } from '../../types/finance';

const HerFinanceContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HerFinanceTab>('dashboard');
  const {
    addTransaction,
    profile,
    setupModalOpen,
    setSetupModalOpen,
    setupFinancialBaseline,
    isSetupCompleted
  } = useHerFinance();
  const { showToast } = useToast();

  // Minimal Fallback Modal state
  const [quickModalOpen, setQuickModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    type: 'expense' as TransactionType,
    title: '',
    amount: '',
    category: 'Groceries & Essentials',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI' as PaymentMethod,
    notes: ''
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(manualForm.amount);
    if (!manualForm.title.trim() || isNaN(amountNum) || amountNum <= 0) {
      showToast('Please provide a valid title and positive amount', 'error');
      return;
    }

    addTransaction({
      title: manualForm.title.trim(),
      amount: amountNum,
      type: manualForm.type,
      category: manualForm.category,
      date: manualForm.date,
      paymentMethod: manualForm.paymentMethod,
      notes: manualForm.notes || 'Manual Entry'
    });

    setManualForm({
      type: 'expense',
      title: '',
      amount: '',
      category: 'Groceries & Essentials',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI',
      notes: ''
    });

    setQuickModalOpen(false);
    showToast(
      manualForm.type === 'income' ? 'Income Added' : 'Expense Logged',
      `₹${amountNum.toLocaleString()} recorded`,
      'success'
    );
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'history':
        return <TransactionHistoryView />;
      case 'learn':
        return <FinancialLearningView />;
      case 'settings':
        return <FinancialProfileView />;
      case 'dashboard':
      default:
        return (
          <HerFinanceDashboardView
            onNavigateTab={setActiveTab}
            onOpenQuickManual={() => setQuickModalOpen(true)}
          />
        );
    }
  };

  return (
    <HerFinanceLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* Dynamic Profile Intake Prompt Banner if incomplete */}
      {!isSetupCompleted && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900">Personalize Your AI Budget Baseline</h4>
              <p className="text-xs text-amber-700 leading-relaxed mt-0.5">
                Set your monthly income and savings target so the AI can calibrate your 50/30/20 budget automatically.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSetupModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1e1b4b] hover:bg-slate-800 text-emerald-300 font-bold text-xs rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Set Monthly Baseline</span>
          </button>
        </div>
      )}

      {renderActiveView()}

      {/* Interactive Financial Setup Wizard */}
      <FinancialSetupWizard
        isOpen={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        onSubmitSetup={setupFinancialBaseline}
        initialData={{
          fullName: profile.fullName,
          email: profile.email,
          monthlyIncome: profile.monthlyIncome,
          incomeSources: profile.incomeSources,
          monthlyExpenses: [
            { category: 'Groceries & Essentials', amount: Math.round(profile.monthlyIncome * 0.15) },
            { category: 'Rent & Housing', amount: Math.round(profile.monthlyIncome * 0.25) },
            { category: 'Bills & Utilities', amount: Math.round(profile.monthlyIncome * 0.08) },
            { category: 'Dining & Lifestyle', amount: Math.round(profile.monthlyIncome * 0.12) }
          ],
          currentSavings: 0,
          primaryGoal: {
            title: 'Emergency Cushion',
            targetAmount: profile.monthlyIncome * 3,
            currentAmount: 0,
            targetDate: '2026-12-31',
            category: 'Emergency Fund'
          },
          riskTolerance: profile.riskTolerance,
          emergencyFundTargetMonths: profile.emergencyFundTargetMonths,
          currency: profile.currency || 'INR'
        }}
      />

      {/* Discreet Simple Manual Entry Fallback Modal */}
      <Modal
        isOpen={quickModalOpen}
        onClose={() => setQuickModalOpen(false)}
        title="Quick Manual Entry"
      >
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() =>
                setManualForm({
                  ...manualForm,
                  type: 'expense',
                  category: 'Groceries & Essentials'
                })
              }
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                manualForm.type === 'expense'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Expense</span>
            </button>
            <button
              type="button"
              onClick={() =>
                setManualForm({
                  ...manualForm,
                  type: 'income',
                  category: 'Monthly Salary'
                })
              }
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                manualForm.type === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Income</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Title / Description</label>
            <input
              type="text"
              required
              value={manualForm.title}
              onChange={(e) => setManualForm({ ...manualForm, title: e.target.value })}
              placeholder={manualForm.type === 'expense' ? 'e.g. Supermarket Grocery' : 'e.g. Consulting Freelance'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                required
                min="1"
                value={manualForm.amount}
                onChange={(e) => setManualForm({ ...manualForm, amount: e.target.value })}
                placeholder="500"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={manualForm.category}
                onChange={(e) => setManualForm({ ...manualForm, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                {manualForm.type === 'expense' ? (
                  <>
                    <option value="Groceries & Essentials">Groceries & Essentials</option>
                    <option value="Rent & Housing">Rent & Housing</option>
                    <option value="Bills & Utilities">Bills & Utilities</option>
                    <option value="Dining & Lifestyle">Dining & Lifestyle</option>
                    <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                    <option value="Education & Courses">Education & Courses</option>
                    <option value="General">General</option>
                  </>
                ) : (
                  <>
                    <option value="Monthly Salary">Monthly Salary</option>
                    <option value="Freelance / Consulting">Freelance / Consulting</option>
                    <option value="Business Revenue">Business Revenue</option>
                    <option value="Investments">Investments</option>
                    <option value="Other Inflow">Other Inflow</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setQuickModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1e1b4b] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Save Entry
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
