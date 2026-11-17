import React, { useState } from 'react';
import {
  Wallet,
  TrendingDown,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Pencil
} from 'lucide-react';
import { useHerFinance } from '../../../context/HerFinanceContext';
import { Modal } from '../../../components/common/Modal';
import { DailyExpenseTracker } from '../components/DailyExpenseTracker';
import { MonthlyRuleAnalyzer } from '../components/MonthlyRuleAnalyzer';

export const HerFinanceDashboardView: React.FC = () => {
  const {
    totalIncome,
    totalExpenses,
    profile,
    setMonthlyIncome,
    filteredTransactions
  } = useHerFinance();

  // Income Edit Modal State
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [tempIncome, setTempIncome] = useState(
    (totalIncome > 0 ? totalIncome : profile.monthlyIncome || 0).toString()
  );

  // User-specific effective income
  const effectiveIncome = totalIncome > 0 ? totalIncome : (profile.monthlyIncome || 0);
  const effectiveBalance = effectiveIncome - totalExpenses;

  // Days left in current month for Daily Safe-to-Spend
  const now = new Date();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = Math.max(1, lastDayOfMonth - now.getDate());
  const dailySafeSpend = Math.max(0, Math.round(effectiveBalance / daysRemaining));

  // Today's total spent
  const todayStr = now.toISOString().split('T')[0];
  const todaySpent = filteredTransactions
    .filter((t) => t.type === 'expense' && t.date === todayStr)
    .reduce((sum, t) => sum + t.amount, 0);

  const handleSaveIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(tempIncome);
    if (!isNaN(val) && val >= 0) {
      await setMonthlyIncome(val);
      setIsIncomeModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── 1. The 4 Dynamic Key Financial Metrics Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Monthly Income</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setTempIncome(effectiveIncome.toString());
                  setIsIncomeModalOpen(true);
                }}
                title="Edit your monthly income"
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{effectiveIncome.toLocaleString()}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">
              Verified monthly inflow
            </p>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Total Spent</span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-800">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{totalExpenses.toLocaleString()}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {todaySpent > 0 ? `₹${todaySpent.toLocaleString()} spent today` : 'Across all categories this month'}
            </p>
          </div>
        </div>

        {/* Available Balance (Money Left / Savings) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Money Left (Savings)</span>
            <div className="p-2 rounded-xl bg-purple-100 text-purple-900">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className={`text-2xl font-black tracking-tight ${effectiveBalance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
              ₹{effectiveBalance.toLocaleString()}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">
              Available to save or cushion
            </p>
          </div>
        </div>

        {/* Daily Safe Spend */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Daily Safe Spend</span>
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-teal-900 tracking-tight">
              ₹{dailySafeSpend.toLocaleString()} <span className="text-xs font-normal text-slate-500">/day</span>
            </h3>
            <p className="text-xs text-teal-700 font-semibold mt-0.5">
              {daysRemaining} days remaining in month
            </p>
          </div>
        </div>
      </div>

      {/* ── 2. Daily Expense Tracker (How much she spend & on which things) ── */}
      <DailyExpenseTracker />

      {/* ── 3. End-of-Month 50-30-20 Rule Analysis & Analyzed Report ── */}
      <MonthlyRuleAnalyzer />

      {/* ── Modal to Update Monthly Income ── */}
      <Modal
        title="Update Monthly Income"
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        maxWidth="md"
      >
        <form onSubmit={handleSaveIncome} className="space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            Update your expected monthly income. HerRise will immediately recalibrate your 50/30/20 target budgets and savings calculations.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Monthly Inflow Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-black text-slate-400">₹</span>
              <input
                type="number"
                min="0"
                step="500"
                value={tempIncome}
                onChange={(e) => setTempIncome(e.target.value)}
                placeholder="35000"
                className="w-full bg-white pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                autoFocus
              />
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-500 block mb-1.5">Quick Presets:</span>
            <div className="flex flex-wrap gap-2">
              {[20000, 35000, 50000, 75000, 100000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTempIncome(preset.toString())}
                  className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  ₹{preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsIncomeModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Save Income
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
