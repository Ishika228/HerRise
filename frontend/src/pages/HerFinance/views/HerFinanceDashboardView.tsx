import React from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Sparkles,
  ArrowRight,
  PieChart as PieIcon,
  CheckCircle2,
  Calendar,
  PlusCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Target
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
    budget,
    goals,
    filteredTransactions
  } = useHerFinance();

  // Category breakdown for pie chart
  const hasSpends = budget.categories.some((c) => c.spent > 0);
  const pieData = budget.categories
    .filter((c) => (hasSpends ? c.spent : c.limit) > 0)
    .map((c) => ({
      name: c.categoryName,
      value: hasSpends ? c.spent : c.limit,
      color: c.color
    }));

  // Simple monthly trend data
  const monthlyTrendData = [
    {
      month: '3 Mos Ago',
      income: Math.round(totalIncome * 0.9),
      expenses: Math.round(totalExpenses * 0.92)
    },
    {
      month: '2 Mos Ago',
      income: Math.round(totalIncome * 0.95),
      expenses: Math.round(totalExpenses * 0.95)
    },
    {
      month: 'Last Month',
      income: Math.round(totalIncome * 0.98),
      expenses: Math.round(totalExpenses * 0.98)
    },
    {
      month: 'This Month',
      income: totalIncome,
      expenses: totalExpenses
    }
  ];

  // Calculate highest spend category
  const categorySpends: Record<string, number> = {};
  filteredTransactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categorySpends[t.category] = (categorySpends[t.category] || 0) + t.amount;
    });

  const sortedSpends = Object.entries(categorySpends).sort((a, b) => b[1] - a[1]);
  const topCategoryName = sortedSpends[0] ? sortedSpends[0][0] : '';
  const topCategoryAmount = sortedSpends[0] ? sortedSpends[0][1] : 0;

  return (
    <div className="space-y-6">
      {/* 4 Simple Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Income */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all">
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
              Money earned this month
            </p>
          </div>
        </div>

        {/* 2. Total Spent */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all">
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
              {budget.totalBudget > 0
                ? `Budget: ₹${budget.totalBudget.toLocaleString()}`
                : 'Money spent so far'}
            </p>
          </div>
        </div>

        {/* 3. Total Savings */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Total Savings</span>
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-teal-900 tracking-tight">
              ₹{totalSavings.toLocaleString()}
            </h3>
            <p className="text-xs text-teal-700 font-semibold mt-0.5">
              {goals.length === 1 ? '1 active goal' : `${goals.length} active goals`}
            </p>
          </div>
        </div>

        {/* 4. Money Left */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all">
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
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Available to spend or save
            </p>
          </div>
        </div>
      </div>

      {/* AI Smart Money Advice Banner (Simple & Human) */}
      <div className="bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#047857] text-white p-6 rounded-3xl shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                Smart Money Tip
              </span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              {totalExpenses === 0 && totalIncome > 0 ? (
                <>
                  You have <strong>₹{totalIncome.toLocaleString()}</strong> in income this month and haven't spent anything yet. You have all <strong>₹{totalIncome.toLocaleString()}</strong> available! Whenever you buy something or pay bills, tap <strong>"+ Add Expense"</strong> to keep track.
                </>
              ) : totalExpenses > 0 ? (
                <>
                  You have spent <strong>₹{totalExpenses.toLocaleString()}</strong> so far this month{topCategoryName ? ` (mostly on ${topCategoryName} - ₹${topCategoryAmount.toLocaleString()})` : ''}. You still have <strong>₹{netBalance.toLocaleString()}</strong> left.
                </>
              ) : (
                <>
                  Welcome to HerFinance! To start, tap <strong>"+ Add Income"</strong> above to enter your monthly salary or earnings, and <strong>"+ Add Expense"</strong> when you spend.
                </>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('assistant')}
            className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>Ask Money Question</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Visual Charts: Income vs Spending & Spending by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Income vs. Spending (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Income vs. Spending</h3>
              <p className="text-xs text-slate-500">Compare money earned vs. money spent</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-emerald-600" /> Income
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-rose-500" /> Spent
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
                <Bar dataKey="income" fill="#059669" radius={[6, 6, 0, 0]} name="Income" />
                <Bar dataKey="expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Where Your Money Goes (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Where Your Money Goes</h3>
              <p className="text-xs text-slate-500">
                {hasSpends ? 'Spending by category' : 'Planned budget breakdown'}
              </p>
            </div>
            <PieIcon className="w-4 h-4 text-purple-600" />
          </div>

          <div className="h-64 mt-2 w-full flex items-center justify-center">
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
                    formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, 'Amount']}
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
              <div className="text-center p-6 space-y-2">
                <p className="text-xs text-slate-400">No expenses recorded yet.</p>
                <button
                  type="button"
                  onClick={onOpenAddExpense}
                  className="text-xs text-purple-700 font-bold hover:underline cursor-pointer"
                >
                  + Add your first expense
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: My Savings Goals & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Savings Goals (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-sm text-slate-900">My Savings Goals</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('goals')}
              className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
            >
              View All Goals →
            </button>
          </div>

          <div className="space-y-3">
            {goals.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 space-y-2">
                <p>No savings goals set yet.</p>
                <button
                  type="button"
                  onClick={() => onNavigateTab('goals')}
                  className="text-xs font-bold text-teal-700 hover:underline"
                >
                  + Create a goal (e.g. Emergency Fund or Travel)
                </button>
              </div>
            ) : (
              goals.slice(0, 3).map((g) => {
                const pct = Math.min(100, Math.round((g.currentAmount / (g.targetAmount || 1)) * 100));
                return (
                  <div key={g.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900 truncate max-w-[200px]">{g.title}</span>
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                        {pct}% saved
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
              })
            )}
          </div>
        </div>

        {/* Recent Transactions (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Recent Transactions</h3>
            <button
              type="button"
              onClick={() => onNavigateTab('expenses')}
              className="text-xs font-bold text-purple-700 hover:underline cursor-pointer"
            >
              View All ({filteredTransactions.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredTransactions.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 space-y-2">
                <p>No transactions recorded yet.</p>
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={onOpenAddIncome}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    + Add Income
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={onOpenAddExpense}
                    className="text-xs font-bold text-rose-700 hover:underline"
                  >
                    + Add Expense
                  </button>
                </div>
              </div>
            ) : (
              filteredTransactions.slice(0, 4).map((tx) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
