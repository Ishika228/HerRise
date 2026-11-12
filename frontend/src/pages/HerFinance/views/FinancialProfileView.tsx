import React, { useState } from 'react';
import {
  User,
  Shield,
  Wallet,
  Settings,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Sliders,
  DollarSign
} from 'lucide-react';
import { useHerFinance } from '../../../context/HerFinanceContext';
import { useToast } from '../../../context/ToastContext';
import { Modal } from '../../../components/common/Modal';

export const FinancialProfileView: React.FC = () => {
  const { profile, updateProfile, resetAllFinanceData, setSetupModalOpen } = useHerFinance();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: profile.fullName || 'Ananya Sharma',
    email: profile.email || 'ananya.sharma@herrise.org',
    monthlyIncome: profile.monthlyIncome.toString(),
    emergencyFundTargetMonths: profile.emergencyFundTargetMonths,
    riskTolerance: profile.riskTolerance,
    currency: profile.currency || 'INR'
  });

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const incomeNum = Number(formData.monthlyIncome) || 0;
    if (incomeNum <= 0) {
      showToast('Please enter a valid monthly baseline income', 'error');
      return;
    }

    updateProfile({
      fullName: formData.fullName,
      email: formData.email,
      monthlyIncome: incomeNum,
      emergencyFundTargetMonths: formData.emergencyFundTargetMonths,
      riskTolerance: formData.riskTolerance as any,
      currency: formData.currency
    });

    showToast('Financial profile and risk preferences updated successfully', 'success');
  };

  const handleConfirmReset = () => {
    resetAllFinanceData();
    setConfirmResetOpen(false);
    showToast('All financial records restored to fresh realistic demo state', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Financial Profile & Risk Configuration</h2>
          <p className="text-xs text-slate-500">
            Define your income baseline, liquid emergency horizons, and risk tolerance profile
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSetupModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-teal-600" />
            <span>Rerun Setup Wizard</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Core Personal & Income Settings */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Account & Inflow Baseline</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Baseline Net Monthly Income (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-xs sm:text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                    required
                    min={1000}
                    step={500}
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Used by the HerFinance AI Copilot to calculate your 50/30/20 budgets and surplus potential.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Preferred Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                >
                  <option value="INR">₹ INR - Indian Rupee</option>
                  <option value="USD">$ USD - US Dollar</option>
                  <option value="EUR">€ EUR - Euro</option>
                  <option value="GBP">£ GBP - British Pound</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Risk Profile & Emergency Targets */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Capital Protection & Risk Tier</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Target Emergency Fund Runway
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 6, 9, 12].map((months) => (
                    <button
                      key={months}
                      type="button"
                      onClick={() => setFormData({ ...formData, emergencyFundTargetMonths: months })}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        formData.emergencyFundTargetMonths === months
                          ? 'bg-[#0f172a] text-teal-400 border-slate-800 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {months} Months
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Standard recommendation is 6 months of mandatory living expenses for entrepreneurs & freelancers.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Investment Risk Profile
                </label>
                <div className="space-y-2.5">
                  {[
                    {
                      id: 'conservative',
                      title: 'Conservative (Capital Preservation)',
                      desc: 'Focus on FDs, Sweep-in Accounts, and Liquid Debt Mutual Funds. Low volatility, guaranteed security.'
                    },
                    {
                      id: 'moderate',
                      title: 'Moderate (Balanced Wealth Growth)',
                      desc: 'Mix of 50% Equity Index SIPs and 50% Debt instruments. Steady compounding with moderate fluctuations.'
                    },
                    {
                      id: 'aggressive',
                      title: 'Aggressive (High-Growth Equity)',
                      desc: '70%+ allocation to Flexi-cap equities and emerging startup equity. Higher short-term swings for maximum long-term upside.'
                    }
                  ].map((tier) => (
                    <label
                      key={tier.id}
                      onClick={() => setFormData({ ...formData, riskTolerance: tier.id as any })}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.riskTolerance === tier.id
                          ? 'border-teal-500 bg-teal-50/40 ring-1 ring-teal-500'
                          : 'border-slate-200 bg-slate-50 hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="riskTolerance"
                        checked={formData.riskTolerance === tier.id}
                        onChange={() => {}}
                        className="mt-1 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{tier.title}</span>
                        <span className="text-[11px] text-slate-500 block leading-relaxed">
                          {tier.desc}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#0f172a] hover:bg-slate-800 text-teal-400 px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Settings</span>
          </button>
        </div>
      </form>

      {/* Confirmation Modal for Reset */}
      <Modal
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        title="Reset All Financial Demo Records"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 p-4 rounded-2xl text-rose-900">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold">Are you sure you want to reset?</span>
              <p className="mt-1">
                This will reset your local transactions ledger, budgets, active savings goals, and
                quiz progress back to the default realistic seed dataset. Any newly added transactions
                will be replaced.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setConfirmResetOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmReset}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              Confirm & Reset
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
