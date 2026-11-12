import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  PiggyBank,
  ShieldCheck,
  FileText,
  BookOpen,
  Sparkles,
  PieChart as PieIcon,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Download,
  Filter
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
import confetti from 'canvas-confetti';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/cards/StatCard';
import { Modal } from '../../components/common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { useToast } from '../../context/ToastContext';
import { financialLessons, monthlyFinancialTrend } from '../../data/mockData/financeData';
import { FinancialLesson } from '../../types';

export const HerFinancePage: React.FC = () => {
  const {
    transactions,
    savingsGoals,
    budgetCategories,
    totalIncome,
    totalExpenses,
    currentSavings,
    monthlyBudget,
    addTransaction,
    deleteTransaction,
    addSavingsGoal,
    depositToGoal,
    updateMonthlyBudget
  } = useFinance();

  const { showToast } = useToast();

  // Modals state
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState(2000);
  const [activeLesson, setActiveLesson] = useState<FinancialLesson | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // New Income Form State
  const [incomeForm, setIncomeForm] = useState({
    title: '',
    amount: '',
    category: 'Consulting / Freelance',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // New Expense Form State
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    category: 'Workspace / Utilities',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // New Goal Form State
  const [goalForm, setGoalForm] = useState({
    title: '',
    targetAmount: '',
    targetDate: '2027-06-30',
    category: 'Emergency',
    color: '#4A154B'
  });

  // Table Filter
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTx, setSearchTx] = useState('');

  // AI Assistant Chat State inside HerFinance
  const [financeChatInput, setFinanceChatInput] = useState('');
  const [financeChatLog, setFinanceChatLog] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I am your HerFinance money coach. Ask me about tax deductions under Section 44ADA, setting up SIPs, or optimizing your 50/30/20 budget.'
    }
  ]);

  // Calculations
  const budgetUtilization = Math.round((totalExpenses / (monthlyBudget || 1)) * 100);
  const monthlyMandatoryExpenses = 28000;
  const recommendedEmergencyTarget = monthlyMandatoryExpenses * 6; // ₹1,68,000
  const emergencyCoverageMonths = (currentSavings / monthlyMandatoryExpenses).toFixed(1);

  // Chart data
  const pieData = budgetCategories.map((c) => ({
    name: c.category,
    value: c.spent,
    color: c.color
  }));

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeForm.title || !incomeForm.amount) return;
    addTransaction({
      title: incomeForm.title,
      amount: Number(incomeForm.amount),
      type: 'income',
      category: incomeForm.category,
      date: incomeForm.date,
      notes: incomeForm.notes
    });
    setIncomeModalOpen(false);
    setIncomeForm({ title: '', amount: '', category: 'Consulting / Freelance', date: new Date().toISOString().split('T')[0], notes: '' });
    showToast('Income Added', `₹${Number(incomeForm.amount).toLocaleString()} credited to cashflow`, 'success');
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.title || !expenseForm.amount) return;
    addTransaction({
      title: expenseForm.title,
      amount: Number(expenseForm.amount),
      type: 'expense',
      category: expenseForm.category,
      date: expenseForm.date,
      notes: expenseForm.notes
    });
    setExpenseModalOpen(false);
    setExpenseForm({ title: '', amount: '', category: 'Workspace / Utilities', date: new Date().toISOString().split('T')[0], notes: '' });
    showToast('Expense Recorded', `₹${Number(expenseForm.amount).toLocaleString()} debited`, 'info');
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalForm.title || !goalForm.targetAmount) return;
    addSavingsGoal({
      title: goalForm.title,
      targetAmount: Number(goalForm.targetAmount),
      targetDate: goalForm.targetDate,
      category: goalForm.category,
      color: goalForm.color
    });
    setGoalModalOpen(false);
    setGoalForm({ title: '', targetAmount: '', targetDate: '2027-06-30', category: 'Emergency', color: '#4A154B' });
    showToast('Savings Goal Created', 'New goal added to your wealth dashboard', 'success');
  };

  const handleDeposit = () => {
    if (!selectedGoalId || depositAmount <= 0) return;
    depositToGoal(selectedGoalId, depositAmount);
    setDepositModalOpen(false);
    try {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
    } catch {}
    showToast('Deposit Recorded!', `₹${depositAmount.toLocaleString()} added towards your savings goal`, 'success');
  };

  const handleFinanceChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!financeChatInput.trim()) return;
    const query = financeChatInput;
    const userMsg = { sender: 'user', text: query };
    let reply = 'According to sound wealth planning, separating your personal emergency fund from your business working capital is vital. We recommend an index SIP in broad-market funds like Nifty 50 or S&P BSE Sensex for long-term compound wealth.';

    if (query.toLowerCase().includes('budget') || query.toLowerCase().includes('50/30/20')) {
      reply = `For your monthly inflow of ₹${totalIncome.toLocaleString()}, 50% needs is ₹${(totalIncome * 0.5).toLocaleString()}, 30% lifestyle is ₹${(totalIncome * 0.3).toLocaleString()}, and 20% savings/SIP is ₹${(totalIncome * 0.2).toLocaleString()}.`;
    } else if (query.toLowerCase().includes('tax') || query.toLowerCase().includes('deduction')) {
      reply = 'Under Section 44ADA, eligible freelance professionals and consultants can declare 50% of gross receipts as taxable profit, dramatically simplifying compliance without cumbersome auditing.';
    }

    setFinanceChatLog((prev) => [...prev, userMsg, { sender: 'assistant', text: reply }]);
    setFinanceChatInput('');
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = filterType === 'all' || tx.type === filterType;
    const matchesSearch = tx.title.toLowerCase().includes(searchTx.toLowerCase()) || tx.category.toLowerCase().includes(searchTx.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Header & Quick Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-100 text-[#4A154B]">
                <Wallet className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                HerFinance — Financial Management
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Track cashflow, automate liquid emergency buffers, and conquer your wealth independence goals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIncomeModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#4A154B] hover:bg-[#350c36] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Income</span>
            </button>
            <button
              onClick={() => setExpenseModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#be185d] hover:bg-[#9d174d] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
            <button
              onClick={() => setGoalModalOpen(true)}
              className="flex items-center gap-1.5 bg-purple-100 hover:bg-purple-200 text-[#4A154B] px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <PiggyBank className="w-4 h-4" />
              <span>New Goal</span>
            </button>
            <button
              onClick={() => setReportModalOpen(true)}
              className="flex items-center gap-1.5 border border-purple-200 hover:bg-purple-50 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Monthly Report</span>
            </button>
          </div>
        </div>

        {/* 4 Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Monthly Inflow"
            value={`₹${totalIncome.toLocaleString()}`}
            change="+14.2% MoM"
            isPositive={true}
            subtitle="Verified deposits"
            icon={TrendingUp}
            iconColor="text-emerald-700"
            bgColor="bg-emerald-50"
          />
          <StatCard
            title="Total Monthly Outflow"
            value={`₹${totalExpenses.toLocaleString()}`}
            change={`${budgetUtilization}% of budget`}
            isPositive={budgetUtilization <= 90}
            subtitle={`Cap: ₹${monthlyBudget.toLocaleString()}`}
            icon={TrendingDown}
            iconColor="text-rose-700"
            bgColor="bg-rose-50"
          />
          <StatCard
            title="Current Savings Total"
            value={`₹${currentSavings.toLocaleString()}`}
            change="Across 4 goals"
            isPositive={true}
            subtitle="Emergency & Seed Fund"
            icon={PiggyBank}
            iconColor="text-[#4A154B]"
            bgColor="bg-purple-50"
          />
          <StatCard
            title="Net Cashflow Surplus"
            value={`₹${(totalIncome - totalExpenses).toLocaleString()}`}
            change="Investable surplus"
            isPositive={totalIncome >= totalExpenses}
            subtitle="Available for SIPs"
            icon={ShieldCheck}
            iconColor="text-indigo-700"
            bgColor="bg-indigo-50"
          />
        </div>

        {/* Emergency Fund & Budget Progress Bar Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-[#4A154B] to-[#701a75] text-white p-6 rounded-3xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-base">Emergency Fund Health Indicator</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  {emergencyCoverageMonths} Months Cushion
                </span>
              </div>
              <p className="text-xs text-purple-100 leading-relaxed">
                Your liquid emergency reserve currently stands at <strong>₹{currentSavings.toLocaleString()}</strong> out of the recommended 6-month buffer of <strong>₹{recommendedEmergencyTarget.toLocaleString()}</strong> (based on ₹{monthlyMandatoryExpenses.toLocaleString()}/mo essential living costs).
              </p>
              <div className="pt-2">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Progress to 6 Months Financial Independence</span>
                  <span className="text-emerald-300">
                    {Math.min(100, Math.round((currentSavings / recommendedEmergencyTarget) * 100))}%
                  </span>
                </div>
                <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.round((currentSavings / recommendedEmergencyTarget) * 100))}%`
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
              <span className="text-[11px] font-medium text-purple-200">Financial Resilience Score</span>
              <div className="text-3xl font-black text-white mt-1">88 <span className="text-sm font-normal text-purple-300">/ 100</span></div>
              <p className="text-[10px] text-emerald-300 font-semibold mt-1">
                ✓ Low Debt-to-Income • Healthy Savings Habit
              </p>
            </div>
          </div>
        </div>

        {/* Charts Row: Income vs Expenses & Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Income vs Expenses Bar Chart */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-purple-50">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Income vs. Expense History</h3>
                <p className="text-[11px] text-gray-500">Monthly Cashflow Performance</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#4A154B]" />
                  <span className="text-gray-600">Income</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-[#fb7185]" />
                  <span className="text-gray-600">Expense</span>
                </div>
              </div>
            </div>

            <div className="h-64 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyFinancialTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3e8ff" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <Tooltip
                    formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, '']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e9d5ff', fontSize: '12px' }}
                  />
                  <Bar dataKey="income" fill="#4A154B" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expenses" fill="#fb7185" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense Category Pie Chart */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-purple-50">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Expense Allocation</h3>
                <p className="text-[11px] text-gray-500">Category-Wise Breakdown</p>
              </div>
              <PieIcon className="w-4 h-4 text-purple-700" />
            </div>

            <div className="h-64 mt-2 w-full">
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
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e9d5ff', fontSize: '11px' }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Savings Goals Grid */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-purple-50">
            <div>
              <h3 className="text-base font-bold text-gray-900">Dedicated Savings Goals</h3>
              <p className="text-xs text-gray-500">Track milestones and deposit simulated funds</p>
            </div>
            <button
              onClick={() => setGoalModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#4A154B] bg-purple-50 px-3 py-1.5 rounded-xl hover:bg-purple-100 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Goal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {savingsGoals.map((goal) => {
              const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return (
                <div
                  key={goal.id}
                  className="p-4 rounded-2xl border border-purple-100 bg-[#faf9fd] hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-gray-800 truncate">{goal.title}</span>
                      <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        {goal.category}
                      </span>
                    </div>

                    <div className="text-lg font-black text-gray-900">
                      ₹{goal.currentAmount.toLocaleString()}
                      <span className="text-xs font-normal text-gray-500 ml-1">
                        / ₹{goal.targetAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] font-semibold text-gray-600 mb-1">
                        <span>Progress</span>
                        <span className="text-[#4A154B] font-bold">{percent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${percent}%`, backgroundColor: goal.color }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-purple-100 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">Target: {goal.targetDate}</span>
                    <button
                      onClick={() => {
                        setSelectedGoalId(goal.id);
                        setDepositModalOpen(true);
                      }}
                      className="text-xs font-bold text-[#4A154B] bg-white border border-purple-200 px-2.5 py-1 rounded-lg hover:bg-[#4A154B] hover:text-white transition-colors cursor-pointer"
                    >
                      + Deposit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-50">
            <div>
              <h3 className="text-base font-bold text-gray-900">Recent Transactions</h3>
              <p className="text-xs text-gray-500">Live ledger of all recorded inflows and outflows</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchTx}
                onChange={(e) => setSearchTx(e.target.value)}
                placeholder="Search transactions..."
                className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4A154B]"
              />

              <div className="flex bg-purple-50 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded-lg ${filterType === 'all' ? 'bg-[#4A154B] text-white' : 'text-gray-600'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('income')}
                  className={`px-2.5 py-1 rounded-lg ${filterType === 'income' ? 'bg-[#4A154B] text-white' : 'text-gray-600'}`}
                >
                  Income
                </button>
                <button
                  onClick={() => setFilterType('expense')}
                  className={`px-2.5 py-1 rounded-lg ${filterType === 'expense' ? 'bg-[#4A154B] text-white' : 'text-gray-600'}`}
                >
                  Expenses
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Transaction</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50 text-gray-700">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-gray-900">
                      <div>
                        {tx.title}
                        {tx.notes && <p className="text-[10px] text-gray-400 font-normal">{tx.notes}</p>}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-purple-50 text-purple-900 px-2 py-0.5 rounded-full text-[10px] font-medium border border-purple-100">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-500">{tx.date}</td>
                    <td className="py-3 px-3 text-right font-bold">
                      <span className={tx.type === 'income' ? 'text-emerald-700' : 'text-rose-700'}>
                        {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="text-gray-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Literacy & Conversational Coach Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Literacy Lessons (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-50">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#4A154B]" />
                <h3 className="text-base font-bold text-gray-900">Financial Literacy Lessons</h3>
              </div>
              <span className="text-xs text-purple-700 font-bold bg-purple-50 px-2.5 py-0.5 rounded-full">
                Beginner Friendly
              </span>
            </div>

            <div className="space-y-3">
              {financialLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className="p-4 rounded-2xl border border-purple-100 bg-[#faf9fd] hover:bg-purple-50/60 transition-all cursor-pointer flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                        {lesson.category}
                      </span>
                      <span className="text-[10px] text-gray-400">• {lesson.duration}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">{lesson.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{lesson.summary}</p>
                  </div>
                  <span className="text-xs font-bold text-[#4A154B] shrink-0 mt-1">Read →</span>
                </div>
              ))}
            </div>
          </div>

          {/* Conversational Assistant Widget (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-purple-50 mb-3">
                <Sparkles className="w-5 h-5 text-[#fb7185]" />
                <h3 className="text-base font-bold text-gray-900">HerFinance AI Coach</h3>
              </div>

              {/* Chat Log */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
                {financeChatLog.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-2xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#4A154B] text-white ml-6 text-right'
                        : 'bg-purple-50/80 text-gray-800 mr-4 border border-purple-100'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Suggested Questions */}
              <div className="pt-3 flex flex-wrap gap-1.5">
                {[
                  'How does 50/30/20 apply to me?',
                  'Section 44ADA tax rules?',
                  'Index SIP vs Fixed Deposit'
                ].map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setFinanceChatInput(q);
                    }}
                    className="text-[10px] bg-purple-50 hover:bg-purple-100 text-[#4A154B] font-semibold px-2 py-1 rounded-lg cursor-pointer transition-colors"
                  >
                    💡 {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleFinanceChat} className="mt-4 flex gap-2">
              <input
                type="text"
                value={financeChatInput}
                onChange={(e) => setFinanceChatInput(e.target.value)}
                placeholder="Ask any financial question..."
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#4A154B]"
              />
              <button
                type="submit"
                className="bg-[#4A154B] hover:bg-[#350c36] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal: Add Income */}
      <Modal
        isOpen={incomeModalOpen}
        onClose={() => setIncomeModalOpen(false)}
        title="Record Income"
        subtitle="Add a new income stream or client payout"
      >
        <form onSubmit={handleAddIncome} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Income Source / Title</label>
            <input
              type="text"
              required
              value={incomeForm.title}
              onChange={(e) => setIncomeForm({ ...incomeForm, title: e.target.value })}
              placeholder="e.g. Design Consulting Retainer"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#4A154B]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Amount (₹)</label>
              <input
                type="number"
                required
                value={incomeForm.amount}
                onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                placeholder="25000"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#4A154B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
              <select
                value={incomeForm.category}
                onChange={(e) => setIncomeForm({ ...incomeForm, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#4A154B]"
              >
                <option value="Consulting / Freelance">Consulting / Freelance</option>
                <option value="Business Revenue">HerMarket / Store Revenue</option>
                <option value="Salary / Retainer">Salary / Retainer</option>
                <option value="Investments / Dividends">Investments / Dividends</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Notes / Client</label>
            <input
              type="text"
              value={incomeForm.notes}
              onChange={(e) => setIncomeForm({ ...incomeForm, notes: e.target.value })}
              placeholder="Optional transaction reference"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#4A154B]"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 bg-[#4A154B] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#350c36] cursor-pointer"
          >
            Record Inflow
          </button>
        </form>
      </Modal>

      {/* Modal: Add Expense */}
      <Modal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        title="Record Expense"
        subtitle="Log a business expense or living expenditure"
      >
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Expense Title</label>
            <input
              type="text"
              required
              value={expenseForm.title}
              onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
              placeholder="e.g. Eco packaging boxes"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#4A154B]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Amount (₹)</label>
              <input
                type="number"
                required
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                placeholder="4500"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#4A154B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
              <select
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#4A154B]"
              >
                <option value="Workspace / Utilities">Workspace / Utilities</option>
                <option value="Business Operations">Business Operations</option>
                <option value="Living & Healthcare">Living & Healthcare</option>
                <option value="Investments">Investments / SIP</option>
                <option value="Education / Learning">Education / Learning</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Notes</label>
            <input
              type="text"
              value={expenseForm.notes}
              onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
              placeholder="Vendor name or receipt note"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#4A154B]"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 bg-[#be185d] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#9d174d] cursor-pointer"
          >
            Record Outflow
          </button>
        </form>
      </Modal>

      {/* Modal: New Savings Goal */}
      <Modal
        isOpen={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        title="Create Savings Goal"
        subtitle="Set up a structured reserve with target date and visual tracking"
      >
        <form onSubmit={handleAddGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Goal Name</label>
            <input
              type="text"
              required
              value={goalForm.title}
              onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
              placeholder="e.g. Angel Seed Capital"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#4A154B]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Amount (₹)</label>
              <input
                type="number"
                required
                value={goalForm.targetAmount}
                onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
                placeholder="100000"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#4A154B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Date</label>
              <input
                type="date"
                required
                value={goalForm.targetDate}
                onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#4A154B]"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-2 bg-[#4A154B] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#350c36] cursor-pointer"
          >
            Create Goal
          </button>
        </form>
      </Modal>

      {/* Modal: Deposit Funds to Goal */}
      <Modal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        title="Deposit Towards Savings Goal"
        subtitle="Simulate transferring funds from your monthly surplus into this goal"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Deposit Amount (₹)</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-[#4A154B]"
            />
          </div>
          <div className="flex gap-2">
            {[1000, 2000, 5000, 10000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setDepositAmount(amt)}
                className="flex-1 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#4A154B] font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                +₹{amt}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleDeposit}
            className="w-full bg-[#4A154B] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#350c36] cursor-pointer mt-2"
          >
            Confirm Deposit
          </button>
        </div>
      </Modal>

      {/* Modal: Read Financial Lesson */}
      {activeLesson && (
        <Modal
          isOpen={!!activeLesson}
          onClose={() => setActiveLesson(null)}
          title={activeLesson.title}
          subtitle={`${activeLesson.category} • ${activeLesson.duration}`}
          maxWidth="2xl"
        >
          <div className="prose prose-purple max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4 whitespace-pre-line">
            {activeLesson.content}
          </div>
          <div className="mt-6 pt-4 border-t border-purple-100 flex justify-end">
            <button
              onClick={() => {
                showToast('Lesson Completed!', 'Your knowledge badge has been refreshed', 'success');
                setActiveLesson(null);
              }}
              className="bg-[#4A154B] text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-[#350c36] cursor-pointer"
            >
              Mark Lesson as Understood
            </button>
          </div>
        </Modal>
      )}

      {/* Modal: Monthly Financial Report */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Monthly Financial Health Report"
        subtitle="November 2026 Summary Statement"
        maxWidth="xl"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex justify-between items-center">
            <div>
              <span className="font-bold text-sm text-[#4A154B]">Net Cashflow Balance</span>
              <p className="text-gray-500">Total Inflow minus Outflow</p>
            </div>
            <span className="text-xl font-extrabold text-emerald-700">
              ₹{(totalIncome - totalExpenses).toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 border border-gray-100 rounded-xl">
              <span className="text-gray-400 block">Total Income</span>
              <strong className="text-gray-900 text-sm">₹{totalIncome.toLocaleString()}</strong>
            </div>
            <div className="p-3 border border-gray-100 rounded-xl">
              <span className="text-gray-400 block">Total Outflow</span>
              <strong className="text-rose-700 text-sm">₹{totalExpenses.toLocaleString()}</strong>
            </div>
            <div className="p-3 border border-gray-100 rounded-xl">
              <span className="text-gray-400 block">Savings Allocated</span>
              <strong className="text-[#4A154B] text-sm">₹{currentSavings.toLocaleString()}</strong>
            </div>
          </div>

          <div className="pt-2 text-center text-gray-500 text-[11px]">
            This summary is generated for your personal demo records.
          </div>

          <button
            onClick={() => {
              showToast('Report Downloaded', 'Demo financial report saved to browser', 'info');
              setReportModalOpen(false);
            }}
            className="w-full bg-[#4A154B] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#350c36] cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Summary</span>
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

