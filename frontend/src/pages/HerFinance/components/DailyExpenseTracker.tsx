import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  CreditCard,
  DollarSign,
  Tag,
  CheckCircle2,
  Trash2,
  ShoppingBag,
  Home,
  Coffee,
  HeartPulse,
  Car,
  PiggyBank,
  TrendingDown,
  Sparkles,
  Zap,
  Gift
} from 'lucide-react';
import { useHerFinance } from '../../../context/HerFinanceContext';
import { useAuth } from '../../../context/AuthContext';
import { PaymentMethod } from '../../../types/finance';
import { useToast } from '../../../context/ToastContext';

interface DailyExpenseTrackerProps {
  onSuccess?: () => void;
}

export const DailyExpenseTracker: React.FC<DailyExpenseTrackerProps> = ({ onSuccess }) => {
  const { logDailyExpense, transactions, deleteTransaction } = useHerFinance();
  const { user } = useAuth();
  const { showToast } = useToast();

  const userName = user?.name ? `${user.name}'s Ledger` : 'Daily Ledger';

  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(todayStr);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Groceries & Essentials');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Grouped Categories
  const categoryGroups = [
    {
      group: '50% Needs (Essentials)',
      color: 'text-blue-700 font-bold',
      items: [
        'Groceries & Essentials',
        'Rent & Housing',
        'Bills & Utilities',
        'Healthcare & Wellness',
        'Transport & Fuel',
        'Education & Courses'
      ]
    },
    {
      group: '30% Wants (Lifestyle)',
      color: 'text-purple-700 font-bold',
      items: [
        'Dining & Lifestyle',
        'Shopping',
        'Travel & Entertainment',
        'Personal Care & Salon',
        'Subscriptions & OTT'
      ]
    },
    {
      group: '20% Savings (Wealth & Cushion)',
      color: 'text-emerald-700 font-bold',
      items: [
        'SIP & Investments',
        'Emergency Fund Deposit',
        'Gold & Fixed Deposit'
      ]
    }
  ];

  // Quick Preset Actions
  const handleQuickAdd = (pTitle: string, pAmount: number, pCategory: string) => {
    logDailyExpense({
      title: pTitle,
      amount: pAmount,
      category: pCategory,
      date,
      paymentMethod: 'UPI',
      notes: 'Quick logged expense'
    });
    showToast('Daily Expense Logged', `₹${pAmount} recorded for "${pTitle}"`, 'success');
    if (onSuccess) onSuccess();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim()) {
      showToast('Validation Error', 'Please describe your expense (e.g. Vegetables, Milk, Coffee)', 'warning');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast('Validation Error', 'Please enter a valid expense amount in ₹', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      logDailyExpense({
        title: title.trim(),
        amount: parsedAmount,
        category,
        date,
        paymentMethod,
        notes: notes.trim()
      });

      setTitle('');
      setAmount('');
      setNotes('');
      showToast('Expense Recorded! 💸', `₹${parsedAmount.toLocaleString()} added to your daily ledger`, 'success');
      if (onSuccess) onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter expenses logged for the selected date
  const selectedDayExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.date === date
  );
  const selectedDayTotal = selectedDayExpenses.reduce((sum, t) => sum + t.amount, 0);

  // Category badge helper
  const getCategoryBadge = (cat: string) => {
    const isNeed = [
      'Groceries & Essentials',
      'Rent & Housing',
      'Bills & Utilities',
      'Healthcare & Wellness',
      'Transport & Fuel',
      'Education & Courses'
    ].includes(cat);

    const isWant = [
      'Dining & Lifestyle',
      'Shopping',
      'Travel & Entertainment',
      'Personal Care & Salon',
      'Subscriptions & OTT',
      'General'
    ].includes(cat);

    if (isNeed) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
          50% Need
        </span>
      );
    }
    if (isWant) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
          30% Want
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
        20% Saving
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-pink-600 to-indigo-600 text-white shadow-xs">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900">
                Daily Expense Tracker
              </h2>
              <span className="text-[11px] font-bold text-slate-400">
                • {userName}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Log daily purchases in real-time to track against your 50/30/20 monthly targets.
            </p>
          </div>
        </div>

        {/* Selected Date Summary Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-semibold text-slate-600">
            {date === todayStr ? "Today's Spent:" : 'Day Total:'}
          </span>
          <span className="font-black text-rose-600">₹{selectedDayTotal.toLocaleString()}</span>
          <span className="text-[11px] text-slate-400">({selectedDayExpenses.length} entries)</span>
        </div>
      </div>

      {/* Quick 1-Click Common Presets */}
      <div>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-pink-600" />
          <span>Quick 1-Click Add:</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleQuickAdd('Vegetables & Milk', 250, 'Groceries & Essentials')}
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>🥦 Veggies & Milk (₹250)</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd('Metro & Cab Commute', 120, 'Transport & Fuel')}
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>🚇 Metro / Auto (₹120)</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd('Chai & Snacks', 60, 'Dining & Lifestyle')}
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>☕ Chai & Snack (₹60)</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd('Lunch / Food Delivery', 350, 'Dining & Lifestyle')}
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>🍱 Lunch / Swiggy (₹350)</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickAdd('Medicine & Pharmacy', 400, 'Healthcare & Wellness')}
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>💊 Medicine (₹400)</span>
          </button>
        </div>
      </div>

      {/* Main Expense Form */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-2xs"
            />
          </div>

          {/* 2. Expense Description / Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Expense Description *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Groceries at Supermarket"
              className="w-full bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-2xs font-medium"
            />
          </div>

          {/* 3. Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹) *</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-black text-slate-400">₹</span>
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="450"
                className="w-full bg-white pl-7 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-2xs"
              />
            </div>
          </div>

          {/* 4. Category with 50-30-20 Classification */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category (50/30/20 Tag) *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-2xs"
            >
              {categoryGroups.map((grp) => (
                <optgroup key={grp.group} label={grp.group}>
                  {grp.items.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Payment method, optional notes, and Add button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              <span>Paid Via:</span>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-2xs"
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !amount}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isSubmitting ? 'Recording...' : '+ Log Daily Expense'}</span>
          </button>
        </div>
      </form>

      {/* Today's / Selected Day's Logged Transactions List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Expenses Logged for {date === todayStr ? 'Today' : date}:
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Total: <strong className="text-slate-900">₹{selectedDayTotal.toLocaleString()}</strong>
          </span>
        </div>

        {selectedDayExpenses.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              No expenses recorded for this date yet. Fill the form above or click a quick preset to log an expense.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden bg-white">
            {selectedDayExpenses.map((tx) => (
              <div
                key={tx.id}
                className="p-3 sm:px-4 flex items-center justify-between text-xs hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                    <TrendingDown className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{tx.title}</span>
                      {getCategoryBadge(tx.category)}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {tx.category} • {tx.paymentMethod} {tx.notes ? `• ${tx.notes}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-black text-sm text-rose-600">
                    -₹{tx.amount.toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteTransaction(tx.id)}
                    title="Remove entry"
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
