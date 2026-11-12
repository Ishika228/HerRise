import React from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  PieChart as PieIcon,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useHerFinance } from '../../../context/HerFinanceContext';
import { HerFinanceTab } from '../HerFinanceLayout';

interface HerFinanceDashboardViewProps {
  onNavigateTab: (tab: HerFinanceTab) => void;
  onOpenAddExpense: () => void;
  onOpenAddIncome: () => void;
}

export const HerFinanceDashboardView: React.FC<HerFinanceDashboardViewProps> = ({
  onNavigateTab,
  onOpenAddExpense,
  onOpenAddIncome
}) => {
  const {
    totalIncome,
    totalExpenses,
    totalSavings,
    netBalance,
    remainingBudget,
    budget,
    goals,
    filteredTransactions,
    emergencyFundCoverageMonths,
    profile
  } = useHerFinance();

  // Pie chart data
  const pieData = budget.categories
    .filter((c) => c.spent > 0)
    .map((c) => ({
      name: c.categoryName,
      value: c.spent,
      color: c.color
    }));

  // Bar chart monthly comparison
  const monthlyTrendData = [
    { month: 'Jul', income: 55000, expenses: 32000, savings: 23000 },
    { month: 'Aug', income: 58000, expenses: 34500, savings: 23500 },
    { month: 'Sep', income: 62000, expenses: 36000, savings: 26000 },
    { month: 'Oct', income: 65000, expenses: 38000, savings: 27000 },
    { month: 'Nov (Current)', income: totalIncome, expenses: totalExpenses, savings: Math.max(0, netBalance) }
  ];

  // AI Generated Financial Insights based on active ledger
  const categorySpends: Record<string, number> = {};
  filteredTransactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categorySpends[t.category] = (categorySpends[t.category] || 0) + t.amount;
    });

  const sortedSpends = Object.entries(categorySpends).sort((a, b) => b[1] - a[1]);
  const topExpenseCategory = sortedSpends[0] || ['Living', 0];
  const savingsRate = totalIncome > 0 ? Math.round((netBalance / totalIncome) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 4 Top Summary Cards (Fintech Palette: Navy, Teal, Emerald, Slate) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Monthly Income */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Total Monthly Inflow</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{totalIncome.toLocaleString()}
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 inline-flex items-center gap-1">
              ✓ Verified Inflow
            </span>
          </div>
        </div>

        {/* 2. Total Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Total Expenses</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{totalExpenses.toLocaleString()}
            </h3>
            <span className="text-[11px] font-medium text-slate-500 mt-1 block">
              Budget Cap: ₹{budget.totalBudget.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 3. Total Savings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Accumulated Savings</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-teal-900 tracking-tight">
              ₹{totalSavings.toLocaleString()}
            </h3>
            <span className="text-[11px] font-semibold text-teal-700 mt-1 inline-flex items-center gap-1">
              {goals.length} Dedicated Goals
            </span>
          </div>
        </div>

        {/* 4. Remaining Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Remaining Net Surplus</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className={`text-2xl font-black tracking-tight ${netBalance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
              ₹{netBalance.toLocaleString()}
            </h3>
            <span className="text-[11px] font-medium text-slate-500 mt-1 block">
              Savings Rate: <strong>{savingsRate}%</strong>
            </span>
          </div>
        </div>
      </div>

      {/* AI Financial Insights Banner (Context-aware based on active data) */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f766e] text-white p-6 rounded-3xl shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                HerFinance AI Intelligence Insight
              </span>
            </div>
            <p className="text-sm font-semibold text-white leading-snug">
              {totalExpenses > 0
                ? `Your largest outlay this period is in ${topExpenseCategory[0]} (₹${topExpenseCategory[1].toLocaleString()}). You have a net investable surplus of ₹${netBalance.toLocaleString()}.`
                : `You currently have zero logged outflows. Begin by logging your recurring bills to unlock predictive budgeting.`}
            </p>
            <p className="text-xs text-slate-300">
              Emergency runway stands at <strong>{emergencyFundCoverageMonths} months</strong> of liquid reserves against the target 6-month safety threshold.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('assistant')}
            className="bg-teal-500 hover:bg-teal-400 text-[#0f172a] px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>Ask Copilot Advice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Visualizations Row: Monthly Inflow vs Outflow & Category Doughnut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Income vs Expense Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Income vs. Expense Trend</h3>
              <p className="text-xs text-slate-500">Historical Cashflow Stability</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-[#0f766e]" /> Inflow
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-[#f43f5e]" /> Outflow
              </span>
            </div>
          </div>

          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
                <Bar dataKey="income" fill="#0f766e" radius={[6, 6, 0, 0]} name="Income" />
                <Bar dataKey="expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Breakdown Pie Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Category Outflow Breakdown</h3>
              <p className="text-xs text-slate-500">Actual Spending per Sector</p>
            </div>
            <PieIcon className="w-4 h-4 text-teal-600" />
          </div>

          <div className="h-64 mt-2 w-full">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, 'Spent']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '11px' }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No expense records logged in this timeframe.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Savings Goals & Recent Transactions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Goals (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Active Savings Goals</h3>
            <button
              onClick={() => onNavigateTab('goals')}
              className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
            >
              All Goals →
            </button>
          </div>

          <div className="space-y-3">
            {goals.slice(0, 3).map((g) => {
              const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
              return (
                <div key={g.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900 truncate max-w-[200px]">{g.title}</span>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: g.color || '#0d9488' }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>₹{g.currentAmount.toLocaleString()} saved</span>
                    <span>Target: ₹{g.targetAmount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions Ledger Preview (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Recent Transactions</h3>
            <button
              onClick={() => onNavigateTab('history')}
              className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
            >
              Full Ledger ({filteredTransactions.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredTransactions.slice(0, 4).map((tx) => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{tx.title}</h4>
                  <span className="text-[11px] text-slate-500">
                    {tx.category} • {tx.date} • {tx.paymentMethod}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`font-black text-sm block ${
                      tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
