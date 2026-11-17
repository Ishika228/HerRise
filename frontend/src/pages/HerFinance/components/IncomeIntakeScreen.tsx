import React, { useState } from 'react';
import {
  Wallet,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  PieChart
} from 'lucide-react';
import { useHerFinance } from '../../../context/HerFinanceContext';
import { useToast } from '../../../context/ToastContext';

interface IncomeIntakeScreenProps {
  onComplete: () => void;
}

export const IncomeIntakeScreen: React.FC<IncomeIntakeScreenProps> = ({ onComplete }) => {
  const { setMonthlyIncome, profile } = useHerFinance();
  const { showToast } = useToast();

  const [incomeInput, setIncomeInput] = useState(
    profile.monthlyIncome > 0 ? profile.monthlyIncome.toString() : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presets = [20000, 35000, 50000, 75000, 100000, 150000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(incomeInput);
    if (isNaN(parsed) || parsed <= 0) {
      showToast('Validation Error', 'Please enter a valid monthly income greater than ₹0', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await setMonthlyIncome(parsed);
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 sm:py-12 px-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white rounded-3xl border border-purple-100 shadow-xl p-6 sm:p-9 space-y-6">
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#1e1b4b] via-[#312e81] to-[#047857] text-white flex items-center justify-center mx-auto shadow-md">
            <Wallet className="w-8 h-8 text-emerald-300" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome to HerFinance
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Please enter your monthly income to personalize your dashboard and calibrate your automated 50 / 30 / 20 budget.
          </p>
        </div>

        {/* Income Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
              Your Monthly Take-Home Income (₹) *
            </label>
            <div className="relative max-w-sm mx-auto">
              <span className="absolute left-4 top-3 text-lg font-black text-slate-400">₹</span>
              <input
                type="number"
                min="1"
                step="500"
                required
                value={incomeInput}
                onChange={(e) => setIncomeInput(e.target.value)}
                placeholder="e.g. 40,000"
                className="w-full bg-slate-50 pl-10 pr-4 py-3 rounded-2xl border-2 border-purple-200 text-lg sm:text-xl font-black text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white shadow-2xs text-center transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Quick 1-Click Presets */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 block text-center mb-2">
              Or pick a quick preset:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {presets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setIncomeInput(val.toString())}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    incomeInput === val.toString()
                      ? 'bg-[#1e1b4b] text-emerald-300 shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-purple-100 hover:text-purple-900'
                  }`}
                >
                  ₹{val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* 50-30-20 Rule Preview Box */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
              <PieChart className="w-4 h-4 text-pink-600" />
              <span>How your 50 / 30 / 20 rule will be analyzed:</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-white border border-purple-100">
                <span className="font-extrabold text-blue-700 block">50% Needs</span>
                <span className="text-[10px] text-slate-500">Groceries, rent, bills</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-purple-100">
                <span className="font-extrabold text-purple-700 block">30% Wants</span>
                <span className="text-[10px] text-slate-500">Dining, outings, shopping</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-purple-100">
                <span className="font-extrabold text-emerald-700 block">20% Savings</span>
                <span className="text-[10px] text-slate-500">Emergency fund & wealth</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !incomeInput}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#047857] hover:opacity-95 text-white font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Saving Income...' : 'Continue to Dashboard'}</span>
            <ArrowRight className="w-4 h-4 text-emerald-300" />
          </button>
        </form>
      </div>
    </div>
  );
};
