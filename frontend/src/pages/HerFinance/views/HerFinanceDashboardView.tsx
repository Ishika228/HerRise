import React, { useState } from 'react';
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Trash2,
  ShieldCheck,
  Calendar,
  Layers,
  Plus
} from 'lucide-react';
import { useHerFinance } from '../../../context/HerFinanceContext';
import { HerFinanceTab } from '../HerFinanceLayout';

interface HerFinanceDashboardViewProps {
  onNavigateTab: (tab: HerFinanceTab) => void;
  onOpenQuickManual?: () => void;
}

export const HerFinanceDashboardView: React.FC<HerFinanceDashboardViewProps> = ({
  onNavigateTab,
  onOpenQuickManual
}) => {
  const {
    totalIncome,
    totalExpenses,
    totalSavings,
    netBalance,
    filteredTransactions,
    deleteTransaction,
    processAiCommand
  } = useHerFinance();

  const [aiPrompt, setAiPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAiResponse, setLastAiResponse] = useState<{
    action?: string;
    message: string;
    amount?: number;
    category?: string;
  } | null>(null);

  // Quick prompt suggestions
  const quickPrompts = [
    { label: '+ 💼 Log ₹25,000 Salary', text: 'Got 25000 salary credited to bank account' },
    { label: '- 🛒 Spent ₹650 Groceries', text: 'Spent 650 on groceries via UPI' },
    { label: '- ⚡ Paid ₹1,200 Electricity', text: 'Paid 1200 electricity bill via UPI' },
    { label: '- ☕ Spent ₹180 Coffee', text: 'Spent 180 on coffee and snacks' },
    { label: '🎯 Save ₹5,000 Emergency', text: 'Save 5000 for emergency fund' },
    { label: '💡 Can I afford dinner out?', text: 'Can I afford to spend 1500 on dinner tonight?' }
  ];

  // Handle AI Command Submission
  const handleExecuteAi = async (textToRun?: string) => {
    const promptToSubmit = (textToRun || aiPrompt).trim();
    if (!promptToSubmit) return;

    setIsProcessing(true);
    setAiPrompt('');
    try {
      const result = await processAiCommand(promptToSubmit);
      setLastAiResponse({
        action: result.action,
        message: result.message,
        amount: result.data?.amount,
        category: result.data?.category
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Automated 50/30/20 Smart Budget Calculations
  const effectiveIncome = totalIncome > 0 ? totalIncome : 20000;
  const needsBudget = Math.round(effectiveIncome * 0.5);
  const wantsBudget = Math.round(effectiveIncome * 0.3);
  const savingsBudget = Math.round(effectiveIncome * 0.2);

  // Categorize expenses into Needs vs Wants
  const needsCategories = [
    'Groceries & Essentials',
    'Rent & Housing',
    'Bills & Utilities',
    'Healthcare & Wellness',
    'Education & Courses'
  ];
  const wantsCategories = ['Dining & Lifestyle', 'Shopping', 'Travel & Entertainment', 'General'];

  const needsSpent = filteredTransactions
    .filter((t) => t.type === 'expense' && needsCategories.includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0);

  const wantsSpent = filteredTransactions
    .filter((t) => t.type === 'expense' && !needsCategories.includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0);

  const needsPct = Math.min(100, Math.round((needsSpent / (needsBudget || 1)) * 100));
  const wantsPct = Math.min(100, Math.round((wantsSpent / (wantsBudget || 1)) * 100));

  // Days left in current month for Daily Safe-to-Spend
  const now = new Date();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = Math.max(1, lastDayOfMonth - now.getDate());
  const dailySafeSpend = Math.max(0, Math.round(netBalance / daysRemaining));

  // Emergency runway coverage in months
  const monthlyBurn = totalExpenses > 0 ? totalExpenses : needsBudget;
  const emergencyCoverageMonths = (totalSavings / (monthlyBurn || 1)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* 1. Simplified 4 Key Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Total Income</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{totalIncome.toLocaleString()}
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
              Across all categories
            </p>
          </div>
        </div>

        {/* Available Balance (Money Left) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Money Left</span>
            <div className="p-2 rounded-xl bg-purple-100 text-purple-900">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className={`text-2xl font-black tracking-tight ${netBalance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
              ₹{netBalance.toLocaleString()}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">
              Available to spend or save
            </p>
          </div>
        </div>

        {/* Daily Safe Spend (Calculated by AI) */}
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

      {/* 2. Central Autonomous AI Command Bar */}
      <div className="bg-gradient-to-br from-white to-purple-50/40 p-6 sm:p-7 rounded-3xl border-2 border-purple-200 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#1e1b4b] to-[#4338ca] text-emerald-300 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                AI Financial Command Bar
              </h2>
              <p className="text-xs text-slate-500">
                Just type what you spent, earned, or want to save — Groq AI does the rest.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Fully AI-Automated
          </span>
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecuteAi();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            disabled={isProcessing}
            placeholder="Type anything (e.g. 'Spent 450 on groceries via UPI', 'Got 35000 salary', 'Can I afford dinner?')..."
            className="w-full bg-white pl-4 pr-32 py-3.5 rounded-2xl border border-purple-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent shadow-2xs transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isProcessing || !aiPrompt.trim()}
            className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-[#1e1b4b] to-[#4338ca] hover:from-[#312e81] hover:to-[#4f46e5] text-white px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Run with AI</span>
              </>
            )}
          </button>
        </form>

        {/* 1-Tap Quick Action Chips */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span>1-Tap Quick Actions:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isProcessing}
                onClick={() => handleExecuteAi(q.text)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-purple-100/70 border border-purple-100 text-slate-700 text-xs font-semibold transition-all shadow-2xs hover:border-purple-300 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>{q.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Response Banner */}
        {lastAiResponse && (
          <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xs space-y-2 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-900">
                  AI Action Completed: {lastAiResponse.action?.toUpperCase()}
                </span>
              </div>
              {lastAiResponse.amount ? (
                <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg">
                  ₹{lastAiResponse.amount.toLocaleString()}
                </span>
              ) : null}
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              {lastAiResponse.message}
            </p>
          </div>
        )}
      </div>

      {/* 3. AI Automated 50/30/20 Smart Budget (No Manual Sliders Needed) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-900">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                AI Automated 50 / 30 / 20 Smart Budget
              </h3>
              <p className="text-xs text-slate-500">
                Auto-calculated from your ₹{effectiveIncome.toLocaleString()} monthly income
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full self-start sm:self-auto">
            ⚡ 100% Auto-Managed by AI
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* 50% Needs */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">50% Needs & Essentials</span>
              <span className="text-[11px] font-bold text-slate-600">{needsPct}% spent</span>
            </div>
            <p className="text-[11px] text-slate-500">Groceries, rent, bills & medicine</p>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  needsPct > 90 ? 'bg-rose-500' : 'bg-blue-600'
                }`}
                style={{ width: `${needsPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-600 font-semibold">
              <span>₹{needsSpent.toLocaleString()} spent</span>
              <span>Target: ₹{needsBudget.toLocaleString()}</span>
            </div>
          </div>

          {/* 30% Wants */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">30% Wants & Lifestyle</span>
              <span className="text-[11px] font-bold text-slate-600">{wantsPct}% spent</span>
            </div>
            <p className="text-[11px] text-slate-500">Dining, shopping & entertainment</p>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  wantsPct > 90 ? 'bg-rose-500' : 'bg-purple-600'
                }`}
                style={{ width: `${wantsPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-600 font-semibold">
              <span>₹{wantsSpent.toLocaleString()} spent</span>
              <span>Target: ₹{wantsBudget.toLocaleString()}</span>
            </div>
          </div>

          {/* 20% Savings */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">20% Savings & Cushion</span>
              <span className="text-[11px] font-bold text-emerald-700">Auto-routed</span>
            </div>
            <p className="text-[11px] text-slate-500">Emergency fund & wealth growth</p>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: '100%' }} />
            </div>
            <div className="flex justify-between text-[11px] text-slate-600 font-semibold">
              <span>₹{totalSavings.toLocaleString()} saved</span>
              <span>Target: ₹{savingsBudget.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. AI Live Activity Feed (Recent Transactions) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Live AI Activity Feed</h3>
            <p className="text-xs text-slate-500">
              Transactions parsed and recorded automatically by Groq AI
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('history')}
            className="text-xs font-bold text-purple-700 hover:underline cursor-pointer"
          >
            View Full Ledger ({filteredTransactions.length}) →
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredTransactions.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-xs text-slate-400">No activity yet.</p>
              <p className="text-xs text-slate-500">
                Try clicking one of the <strong>1-Tap Quick Actions</strong> above or type your first expense.
              </p>
            </div>
          ) : (
            filteredTransactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between text-xs hover:bg-slate-50/70 px-2 rounded-xl transition-all">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      tx.type === 'income'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {tx.type === 'income' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{tx.title}</h4>
                    <p className="text-[11px] text-slate-500">
                      {tx.category} • {tx.paymentMethod} • {tx.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-black text-sm ${
                      tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteTransaction(tx.id)}
                    title="Undo / Delete"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Discreet Manual Fallback Link */}
        {onOpenQuickManual && (
          <div className="pt-2 text-center border-t border-slate-100">
            <button
              type="button"
              onClick={onOpenQuickManual}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 underline cursor-pointer"
            >
              Need manual entry? Click here to open simple input form
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
