import React, { useState } from 'react';
import {
  ShieldCheck,
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CheckCircle2,
  DollarSign,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Sliders,
  AlertCircle,
  HelpCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { Modal } from '../../../components/common/Modal';
import { FinancialSetupData } from '../../../context/HerFinanceContext';
import { useToast } from '../../../context/ToastContext';

interface FinancialSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSetup: (data: FinancialSetupData) => Promise<any>;
  initialData?: Partial<FinancialSetupData>;
}

export const FinancialSetupWizard: React.FC<FinancialSetupWizardProps> = ({
  isOpen,
  onClose,
  onSubmitSetup,
  initialData
}) => {
  const { showToast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [location, setLocation] = useState(initialData?.location || 'Bengaluru, India');
  const [currency, setCurrency] = useState(initialData?.currency || 'INR');

  // Income Sources
  const [primaryIncomeName, setPrimaryIncomeName] = useState('Monthly Professional Salary');
  const [primaryIncomeAmount, setPrimaryIncomeAmount] = useState('50000');
  const [secondaryIncomes, setSecondaryIncomes] = useState<{ name: string; amount: string; type: string }[]>([
    { name: 'Freelance & Consulting', amount: '15000', type: 'freelance' }
  ]);

  // Monthly Expenses
  const [expenses, setExpenses] = useState<{ category: string; amount: string }[]>([
    { category: 'Rent & Housing', amount: '18000' },
    { category: 'Groceries & Essentials', amount: '7500' },
    { category: 'Utilities & Bills', amount: '3500' },
    { category: 'Transport & Fuel', amount: '3000' },
    { category: 'Healthcare & Wellness', amount: '2000' },
    { category: 'Dining & Lifestyle', amount: '4000' },
    { category: 'Education & Courses', amount: '2500' }
  ]);

  // Existing Capital & Primary Goal
  const [currentSavings, setCurrentSavings] = useState('45000');
  const [goalTitle, setGoalTitle] = useState('6-Month Emergency Cushion');
  const [goalTargetAmount, setGoalTargetAmount] = useState('120000');
  const [goalInitialAmount, setGoalInitialAmount] = useState('30000');
  const [goalTargetDate, setGoalTargetDate] = useState('2027-03-31');
  const [goalCategory, setGoalCategory] = useState<
    'Emergency Fund' | 'Education' | 'New Laptop' | 'Travel' | 'Starting a Business' | 'Home Purchase' | 'General'
  >('Emergency Fund');

  // Risk & Runway
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [emergencyTargetMonths, setEmergencyTargetMonths] = useState(6);

  // Live Calculations
  const totalIncomeNum =
    (Number(primaryIncomeAmount) || 0) +
    secondaryIncomes.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const totalExpenseNum = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const netSurplusNum = totalIncomeNum - totalExpenseNum;
  const savingsRate = totalIncomeNum > 0 ? Math.max(0, Math.round((netSurplusNum / totalIncomeNum) * 100)) : 0;
  const currentSavingsNum = Number(currentSavings) || 0;
  const calculatedRunwayMonths = totalExpenseNum > 0 ? Number((currentSavingsNum / totalExpenseNum).toFixed(1)) : 0;

  const handleAddSecondaryIncome = () => {
    setSecondaryIncomes([...secondaryIncomes, { name: '', amount: '', type: 'freelance' }]);
  };

  const handleRemoveSecondaryIncome = (index: number) => {
    setSecondaryIncomes(secondaryIncomes.filter((_, i) => i !== index));
  };

  const handleUpdateExpense = (index: number, val: string) => {
    const updated = [...expenses];
    updated[index].amount = val;
    setExpenses(updated);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!fullName.trim() || !email.trim()) {
        showToast('Please enter your full name and email address', 'error');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (totalIncomeNum <= 0) {
        showToast('Please specify at least one valid income stream', 'error');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalIncomeNum <= 0) {
      showToast('Monthly income must be greater than zero', 'error');
      return;
    }

    const payload: FinancialSetupData = {
      fullName,
      email,
      location,
      currency,
      monthlyIncome: totalIncomeNum,
      incomeSources: [
        { name: primaryIncomeName, amount: Number(primaryIncomeAmount) || 0, type: 'salary' },
        ...secondaryIncomes
          .filter((item) => item.name && Number(item.amount) > 0)
          .map((item) => ({ name: item.name, amount: Number(item.amount), type: item.type }))
      ],
      monthlyExpenses: expenses
        .filter((item) => Number(item.amount) > 0)
        .map((item) => ({ category: item.category, amount: Number(item.amount) })),
      currentSavings: Number(currentSavings) || 0,
      primaryGoal: {
        title: goalTitle || 'Emergency Cushion',
        targetAmount: Number(goalTargetAmount) || 100000,
        currentAmount: Number(goalInitialAmount) || 0,
        targetDate: goalTargetDate || '2027-06-30',
        category: goalCategory
      },
      riskTolerance,
      emergencyFundTargetMonths: emergencyTargetMonths
    };

    setIsSubmitting(true);
    try {
      await onSubmitSetup(payload);
      showToast('Personalized financial baseline created successfully!', 'success');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to initialize baseline', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="HerFinance Profile Setup & Financial Baseline"
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Progress Tracker Strip */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          {[
            { num: 1, label: 'Identity & Currency' },
            { num: 2, label: 'Income Streams' },
            { num: 3, label: 'Monthly Commitments' },
            { num: 4, label: 'Goals & Runway' }
          ].map((item) => (
            <div key={item.num} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === item.num
                    ? 'bg-[#0f172a] text-teal-400 ring-2 ring-teal-500'
                    : step > item.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step > item.num ? <CheckCircle2 className="w-4 h-4" /> : item.num}
              </div>
              <span
                className={`text-xs font-semibold hidden sm:inline ${
                  step === item.num ? 'text-slate-900 font-bold' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Live Calculation Snapshot Ticker */}
        <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Monthly Inflow</span>
            <span className="text-sm font-extrabold text-white">₹{totalIncomeNum.toLocaleString()}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Commitments</span>
            <span className="text-sm font-extrabold text-slate-200">₹{totalExpenseNum.toLocaleString()}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Calculated Net Surplus</span>
            <span
              className={`text-sm font-black ${
                netSurplusNum >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {netSurplusNum >= 0 ? '+' : ''}₹{netSurplusNum.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Savings Capacity</span>
            <span className="text-sm font-extrabold text-teal-400">{savingsRate}% Rate</span>
          </div>
        </div>

        {/* Step 1: Identity & Currency */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-teal-50/70 border border-teal-200 p-3.5 rounded-2xl text-xs text-teal-900">
              <span className="font-bold">Zero Static Data Guarantee:</span> All figures, budgets, charts, and AI advice
              will be computed directly from the details you submit below.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Legal / Preferred Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ishika Bhatia"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. ishikabhatia@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">City / Region</label>
                <input
                  type="text"
                  placeholder="e.g. Delhi NCR, Mumbai, Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Accounting Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                >
                  <option value="INR">₹ INR (Indian Rupee)</option>
                  <option value="USD">$ USD (US Dollar)</option>
                  <option value="EUR">€ EUR (Euro)</option>
                  <option value="GBP">£ GBP (British Pound)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Income Architecture */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Primary Inflow Stream</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Stream Name (e.g. TechCorp Salary, Primary Consulting)"
                  value={primaryIncomeName}
                  onChange={(e) => setPrimaryIncomeName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                />
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    placeholder="Monthly Amount"
                    value={primaryIncomeAmount}
                    onChange={(e) => setPrimaryIncomeAmount(e.target.value)}
                    required
                    min={1}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Secondary Inflows (Freelancing, Business, Investments)
                </h4>
                <button
                  type="button"
                  onClick={handleAddSecondaryIncome}
                  className="flex items-center gap-1 text-xs text-teal-700 hover:text-teal-900 font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Stream
                </button>
              </div>

              {secondaryIncomes.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Stream Name"
                    value={item.name}
                    onChange={(e) => {
                      const updated = [...secondaryIncomes];
                      updated[idx].name = e.target.value;
                      setSecondaryIncomes(updated);
                    }}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                  <div className="relative w-36">
                    <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={item.amount}
                      onChange={(e) => {
                        const updated = [...secondaryIncomes];
                        updated[idx].amount = e.target.value;
                        setSecondaryIncomes(updated);
                      }}
                      className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSecondaryIncome(idx)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Monthly Expenses */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Enter your estimated or typical monthly living commitments. These will directly configure your category
              budgets and 80%/100% warning thresholds.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {expenses.map((exp, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-800">{exp.category}</span>
                  <div className="relative w-32 shrink-0">
                    <span className="absolute left-2.5 top-1.5 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      value={exp.amount}
                      onChange={(e) => handleUpdateExpense(idx, e.target.value)}
                      className="w-full pl-6 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 text-right"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Existing Capital, Goal & Risk */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Current Liquid Savings in Bank (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <span className="text-[10px] text-teal-700 font-semibold block mt-1">
                  Yields ~{calculatedRunwayMonths} months of emergency runway right now.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Primary Savings Goal Purpose</label>
                <input
                  type="text"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. 6-Month Emergency Cushion, Laptop Upgrade"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Goal Target (₹)</label>
                <input
                  type="number"
                  value={goalTargetAmount}
                  onChange={(e) => setGoalTargetAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Initial Saved (₹)</label>
                <input
                  type="number"
                  value={goalInitialAmount}
                  onChange={(e) => setGoalInitialAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Date</label>
                <input
                  type="date"
                  value={goalTargetDate}
                  onChange={(e) => setGoalTargetDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Risk Tolerance Tier</label>
                <select
                  value={riskTolerance}
                  onChange={(e) => setRiskTolerance(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 cursor-pointer"
                >
                  <option value="conservative">Conservative (Sweep-ins & FDs)</option>
                  <option value="moderate">Moderate (Index Mutual Funds & Debt)</option>
                  <option value="aggressive">Aggressive (High-Growth Equities)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Emergency Cushion</label>
                <select
                  value={emergencyTargetMonths}
                  onChange={(e) => setEmergencyTargetMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 cursor-pointer"
                >
                  <option value={3}>3 Months of living costs</option>
                  <option value={6}>6 Months (Recommended)</option>
                  <option value={9}>9 Months (Extended cushion)</option>
                  <option value={12}>12 Months (Maximum safety)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 bg-[#0f172a] hover:bg-slate-800 text-teal-400 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Syncing to MongoDB Atlas...' : 'Build My Live Financial Dashboard'}</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
