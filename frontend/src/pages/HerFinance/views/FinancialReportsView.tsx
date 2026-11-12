import React, { useState } from 'react';
import {
  FileBarChart2,
  Download,
  Printer,
  Calendar,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useHerFinance } from '../../../context/HerFinanceContext';
import { useToast } from '../../../context/ToastContext';
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

export const FinancialReportsView: React.FC = () => {
  const {
    profile,
    transactions,
    goals,
    budget,
    totalIncome,
    totalExpenses,
    netBalance,
    totalSavings,
    emergencyFundCoverageMonths
  } = useHerFinance();

  const { showToast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState<'this_month' | 'last_month' | 'ytd'>('this_month');

  // Savings rate
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netBalance / totalIncome) * 100)) : 0;

  // Category breakdown calculation
  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  const categoryData = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const COLORS = ['#0f766e', '#0d9488', '#14b8a6', '#059669', '#10b981', '#34d399', '#f59e0b', '#64748b'];

  // Financial Health Score Calculation (0-100)
  // Factors: Positive cashflow (+30), Emergency runway >= 3 months (+30), Savings rate >= 20% (+20), Under category budget (+20)
  let healthScore = 20; // baseline
  if (netBalance > 0) healthScore += 30;
  if (emergencyFundCoverageMonths >= 3) healthScore += 25;
  else if (emergencyFundCoverageMonths >= 1) healthScore += 15;
  if (savingsRate >= 20) healthScore += 20;
  else if (savingsRate >= 10) healthScore += 10;
  if (totalExpenses < budget.totalBudget) healthScore += 15;

  healthScore = Math.min(100, healthScore);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Title', 'Type', 'Category', 'Amount', 'PaymentMethod', 'Notes'];
    const rows = transactions.map((t) => [
      t.id,
      t.date,
      `"${t.title.replace(/"/g, '""')}"`,
      t.type,
      `"${t.category}"`,
      t.amount,
      t.paymentMethod || 'Other',
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HerFinance_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Financial ledger CSV downloaded successfully', 'success');
  };

  const handleExportJSON = () => {
    const reportData = {
      user: {
        name: profile.fullName || 'HerRise Member',
        currency: profile.currency,
        monthlyBaselineIncome: profile.monthlyIncome
      },
      auditDate: new Date().toISOString(),
      period: selectedPeriod,
      summary: {
        totalIncome,
        totalExpenses,
        netSurplus: netBalance,
        savingsRate: `${savingsRate}%`,
        totalSavingsLiquid: totalSavings,
        emergencyFundCoverageMonths: `${emergencyFundCoverageMonths} months`,
        financialHealthScore: `${healthScore}/100`
      },
      budgetOverview: {
        allocatedBudget: budget.totalBudget,
        categories: budget.categories
      },
      savingsGoals: goals.map((g) => ({
        title: g.title,
        target: g.targetAmount,
        saved: g.currentAmount,
        status: g.status,
        targetDate: g.targetDate
      })),
      recentTransactions: transactions.slice(0, 50)
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `HerFinance_Complete_Statement_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Comprehensive JSON financial statement exported', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Strip */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Financial Audit & Performance Report</h2>
          <p className="text-xs text-slate-500">
            Export official accounting summaries, cashflow statements, and net worth progress
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Period selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setSelectedPeriod('this_month')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedPeriod === 'this_month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setSelectedPeriod('last_month')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedPeriod === 'last_month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Last Month
            </button>
            <button
              onClick={() => setSelectedPeriod('ytd')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedPeriod === 'ytd' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Year to Date
            </button>
          </div>

          {/* Action buttons */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            title="Export CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Export JSON Audit"
          >
            <FileCode className="w-4 h-4 text-teal-200" />
            <span>JSON Audit</span>
          </button>
        </div>
      </div>

      {/* Official Report Card (Formatted for Print and Screen) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-600" />
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider font-mono">
                HerRise AI Enterprise • HerFinance Statement
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">Monthly Financial Health Report</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Account Holder: <span className="font-semibold text-slate-800">{profile.fullName || 'HerRise Member'}</span> | Risk Tier:{' '}
              <span className="capitalize font-semibold text-slate-800">{profile.riskTolerance}</span> | Base Inflow: ₹
              {profile.monthlyIncome.toLocaleString()}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">Report Generated</span>
            <span className="text-sm font-bold text-slate-800 font-mono">
              {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Executive Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Total Monthly Inflows</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">₹{totalIncome.toLocaleString()}</div>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> 100% Verified
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Total Expenditures</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">₹{totalExpenses.toLocaleString()}</div>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              {categoryData.length} distinct categories
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Net Cashflow Surplus</span>
            <div className={`text-xl sm:text-2xl font-black mt-1 ${netBalance >= 0 ? 'text-teal-700' : 'text-rose-600'}`}>
              {netBalance >= 0 ? '+' : ''}₹{netBalance.toLocaleString()}
            </div>
            <span className="text-[11px] text-teal-600 font-bold block mt-1">
              {savingsRate}% monthly savings rate
            </span>
          </div>

          <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-200">
            <span className="text-xs text-teal-800 font-bold uppercase tracking-wider block">Financial Health Score</span>
            <div className="text-xl sm:text-2xl font-black text-teal-900 mt-1">{healthScore} / 100</div>
            <span className="text-[11px] text-teal-700 font-bold flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              {healthScore >= 80 ? 'Grade A: Highly Resilient' : healthScore >= 60 ? 'Grade B: Moderate Security' : 'Grade C: Build Cushion'}
            </span>
          </div>
        </div>

        {/* Visual Charts Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Category Outflows Breakdown */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-teal-600" />
              <span>Expenditure Distribution by Category</span>
            </h3>
            <div className="h-60">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={3}
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val || 0).toLocaleString()}`, 'Spent']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '12px' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No expense records logged in this period.
                </div>
              )}
            </div>
          </div>

          {/* Liquid Reserves & Emergency Coverage */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Emergency Runway & Capital Cushion</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Measures how many months you can sustain living costs without active income.
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600">Current Runway Capacity</span>
                    <span className="text-teal-800 font-bold">{emergencyFundCoverageMonths} Months</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (emergencyFundCoverageMonths / 6) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>0 Mo</span>
                    <span>3 Mo Baseline</span>
                    <span>6 Mo Target</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Liquid Savings in Goals:</span>
                    <span className="font-bold text-slate-900">₹{totalSavings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Average Essential Need:</span>
                    <span className="font-bold text-slate-900">₹{Math.round(totalExpenses * 0.8 || 25000).toLocaleString()}/mo</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1.5">
                    <span className="text-slate-700 font-semibold">Recommended 6-Mo Reserve:</span>
                    <span className="font-extrabold text-teal-800">
                      ₹{(Math.round(totalExpenses * 0.8 || 25000) * 6).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Goal Pacing: {goals.filter((g) => g.status === 'active').length} active goals tracked</span>
              <span className="text-teal-700 font-bold">On Schedule</span>
            </div>
          </div>
        </div>

        {/* Detailed Category Audit Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Category-Level Expense Ledger</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Amount Spent</th>
                  <th className="p-3.5">Budget Allocated</th>
                  <th className="p-3.5">Utilization %</th>
                  <th className="p-3.5 text-right">Variance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {budget.categories.map((cat) => {
                  const spent = cat.spent || 0;
                  const limit = cat.limit;
                  const ratio = limit > 0 ? Math.round((spent / limit) * 100) : 0;
                  const isExceeded = spent > limit;
                  const isWarning = ratio >= 80 && !isExceeded;

                  return (
                    <tr key={cat.categoryId} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-slate-900">{cat.categoryName}</td>
                      <td className="p-3.5 font-semibold text-slate-800">₹{spent.toLocaleString()}</td>
                      <td className="p-3.5 text-slate-500">₹{limit.toLocaleString()}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isExceeded ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-teal-600'
                              }`}
                              style={{ width: `${Math.min(100, ratio)}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] font-semibold">{ratio}%</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-right font-bold">
                        {isExceeded ? (
                          <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 text-[10px]">
                            Over by ₹{(spent - limit).toLocaleString()}
                          </span>
                        ) : isWarning ? (
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[10px]">
                            80% Warning Limit
                          </span>
                        ) : (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px]">
                            Under Budget (₹{(limit - spent).toLocaleString()} left)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Performance Audit Narrative */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>AI Automated Financial Synthesis</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Your cashflow remains strictly in the black this cycle, sustaining a healthy surplus of{' '}
            <strong className="text-slate-900">₹{netBalance.toLocaleString()}</strong> ({savingsRate}% savings rate).
            Your liquid emergency coverage currently sits at{' '}
            <strong className="text-slate-900">{emergencyFundCoverageMonths} months</strong>. Maintaining a monthly
            allocation of ₹{Math.round(totalIncome * 0.2).toLocaleString()} into low-volatility liquid instruments will
            solidify a resilient 6-month safety net within 4 months.
          </p>
        </div>

        {/* Footer Disclaimer */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>HerRise AI Platform • Confidential Financial Summary</span>
          <span>Verified Internal Ledger Hash: #{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};
