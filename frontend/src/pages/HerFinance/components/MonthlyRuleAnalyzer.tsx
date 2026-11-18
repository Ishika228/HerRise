import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Layers,
  PieChart,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Info,
  Calendar,
  PiggyBank,
  Download,
  Printer,
  FileText
} from 'lucide-react';
import { useHerFinance } from '../../../context/HerFinanceContext';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

export const MonthlyRuleAnalyzer: React.FC = () => {
  const { totalIncome, profile, transactions } = useHerFinance();
  const { user } = useAuth();
  const { showToast } = useToast();

  const userName = user?.name ? `Calibrated for ${user.name}` : 'Personalized';

  // Effective base income (strictly derived from user's verified income)
  const effectiveIncome = totalIncome > 0 ? totalIncome : (profile.monthlyIncome || 0);

  // 50/30/20 Targets in ₹
  const targetNeeds = Math.round(effectiveIncome * 0.50);
  const targetWants = Math.round(effectiveIncome * 0.30);
  const targetSavings = Math.round(effectiveIncome * 0.20);

  // Categorize Needs vs Wants
  const needsCategories = [
    'Groceries & Essentials',
    'Rent & Housing',
    'Bills & Utilities',
    'Healthcare & Wellness',
    'Transport & Fuel',
    'Education & Courses'
  ];

  // Active month transactions
  const currentMonthKey = new Date().toISOString().slice(0, 7); // e.g. "2026-11"
  const currentMonthTxs = transactions.filter((t) => t.date.startsWith(currentMonthKey));

  const needsSpent = currentMonthTxs
    .filter((t) => t.type === 'expense' && needsCategories.includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0);

  const wantsSpent = currentMonthTxs
    .filter((t) => t.type === 'expense' && !needsCategories.includes(t.category) && !t.category.includes('Savings') && !t.category.includes('SIP'))
    .reduce((sum, t) => sum + t.amount, 0);

  const actualExpenses = needsSpent + wantsSpent;
  const actualSavings = Math.max(0, effectiveIncome - actualExpenses);

  const needsPct = effectiveIncome > 0 ? Math.round((needsSpent / effectiveIncome) * 100) : 0;
  const wantsPct = effectiveIncome > 0 ? Math.round((wantsSpent / effectiveIncome) * 100) : 0;
  const savingsPct = effectiveIncome > 0 ? Math.round((actualSavings / effectiveIncome) * 100) : 0;

  // 50-30-20 Rule Compliance Logic
  const isNeedsCompliant = needsPct <= 50;
  const isWantsCompliant = wantsPct <= 30;
  const isSavingsCompliant = savingsPct >= 20;
  const isOverallFollowed = isNeedsCompliant && isWantsCompliant && isSavingsCompliant;

  // Dynamic AI Advice Generator based on compliance
  const generateDiagnosis = () => {
    if (effectiveIncome <= 0) {
      return 'Please enter your monthly income above to activate your 50/30/20 rule audit.';
    }

    if (isOverallFollowed) {
      return `Outstanding discipline! You have respected all three financial pillars: Needs are within 50% (${needsPct}%), Wants are controlled within 30% (${wantsPct}%), and your monthly savings cushion is ${savingsPct}% (≥20% target). You are steadily building financial independence!`;
    }

    const issues: string[] = [];
    if (!isNeedsCompliant) {
      issues.push(`Needs consumed ${needsPct}% of your income (₹${(needsSpent - targetNeeds).toLocaleString()} over the 50% ceiling)`);
    }
    if (!isWantsCompliant) {
      issues.push(`Lifestyle wants accounted for ${wantsPct}% (₹${(wantsSpent - targetWants).toLocaleString()} over the 30% cap)`);
    }
    if (!isSavingsCompliant) {
      issues.push(`Net savings reached only ${savingsPct}% (short of the 20% target by ₹${(targetSavings - actualSavings).toLocaleString()})`);
    }

    let recommendation = '';
    if (!isWantsCompliant) {
      recommendation = ` Try trimming dining, impulsive shopping, or subscriptions by ₹${(wantsSpent - targetWants).toLocaleString()} in upcoming weeks to protect your 20% savings cushion.`;
    } else if (!isNeedsCompliant) {
      recommendation = ` Fixed necessities took over half your inflow. Consider auditing utilities, bulk purchasing staples, or evaluating secondary income opportunities to widen your savings cushion.`;
    } else {
      recommendation = ` Direct ₹${(targetSavings - actualSavings).toLocaleString()} into an automated recurring SIP or liquid emergency deposit on salary day before allocating for discretionary spending.`;
    }

    return `${issues.join('. ')}. ${recommendation}`;
  };

  // Group all transactions by month for End-of-Month Columns
  const monthlyLedger = useMemo(() => {
    const monthMap: Record<
      string,
      {
        monthKey: string;
        monthLabel: string;
        income: number;
        expenses: number;
        needs: number;
        wants: number;
        savings: number;
        savingsRate: number;
        followed: boolean;
      }
    > = {};

    // Ensure current month is always present
    const now = new Date();
    const currKey = now.toISOString().slice(0, 7);
    const currLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + ' (Current)';

    monthMap[currKey] = {
      monthKey: currKey,
      monthLabel: currLabel,
      income: 0,
      expenses: 0,
      needs: 0,
      wants: 0,
      savings: 0,
      savingsRate: 0,
      followed: false
    };

    // Iterate through all transactions exactly once
    transactions.forEach((tx) => {
      const mKey = tx.date.slice(0, 7);
      if (!monthMap[mKey]) {
        const d = new Date(tx.date + 'T00:00:00');
        const mLabel = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        monthMap[mKey] = {
          monthKey: mKey,
          monthLabel: mLabel,
          income: 0,
          expenses: 0,
          needs: 0,
          wants: 0,
          savings: 0,
          savingsRate: 0,
          followed: false
        };
      }

      if (tx.type === 'income') {
        monthMap[mKey].income += tx.amount;
      } else {
        monthMap[mKey].expenses += tx.amount;
        if (needsCategories.includes(tx.category)) {
          monthMap[mKey].needs += tx.amount;
        } else {
          monthMap[mKey].wants += tx.amount;
        }
      }
    });

    // Recalculate savings & rule compliance for each month
    return Object.values(monthMap)
      .map((m) => {
        // Use logged income; if none was logged as a transaction, fallback to verified profile income for current month
        const baseInc = m.income > 0 ? m.income : (m.monthKey === currKey ? effectiveIncome : 0);
        const netSave = Math.max(0, baseInc - m.expenses);
        const rate = baseInc > 0 ? Math.round((netSave / baseInc) * 100) : 0;
        const nPct = baseInc > 0 ? (m.needs / baseInc) * 100 : 0;
        const wPct = baseInc > 0 ? (m.wants / baseInc) * 100 : 0;
        const sPct = baseInc > 0 ? (netSave / baseInc) * 100 : 0;
        const ruleMet = baseInc > 0 && nPct <= 50 && wPct <= 30 && sPct >= 20;

        return {
          ...m,
          income: baseInc,
          savings: netSave,
          savingsRate: rate,
          followed: ruleMet
        };
      })
      .sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  }, [transactions, effectiveIncome, needsCategories]);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* ── 1. 50-30-20 Rule Compliance Analysis Card ── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#1e1b4b] to-[#4338ca] text-white shadow-xs">
              <Layers className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">
                  End-of-Month 50 / 30 / 20 Rule Analysis
                </h2>
                <span className="text-[11px] font-bold text-slate-400">
                  • {userName}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluates whether your spending followed the standard rule: 50% Needs, 30% Wants, and 20% Savings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrintReport}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Report</span>
            </button>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Monthly Inflow
              </span>
              <span className="text-sm sm:text-base font-black text-slate-900">
                ₹{effectiveIncome.toLocaleString()}
              </span>
            </div>
          </div>
        </div>


        {/* 3 Pillar Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. 50% Needs */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isNeedsCompliant
                ? 'bg-blue-50/60 border-blue-200'
                : 'bg-rose-50/80 border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">50% Needs & Essentials</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  isNeedsCompliant
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isNeedsCompliant ? '✅ Followed' : '⚠️ Exceeded'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Rent, groceries, health & bills</p>

            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <span className="text-xl font-black text-slate-900">
                  ₹{needsSpent.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-slate-500 ml-1">
                  ({needsPct}%)
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Target: ₹{targetNeeds.toLocaleString()}
              </span>
            </div>

            <div className="mt-2 w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  needsPct > 50 ? 'bg-rose-500' : 'bg-blue-600'
                }`}
                style={{ width: `${Math.min(100, needsPct * 2)}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-slate-500 font-medium">
              <span>Cap: 50%</span>
              <span className={needsPct > 50 ? 'text-rose-700 font-bold' : 'text-blue-700 font-bold'}>
                Actual: {needsPct}%
              </span>
            </div>
          </div>

          {/* 2. 30% Wants */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isWantsCompliant
                ? 'bg-purple-50/60 border-purple-200'
                : 'bg-rose-50/80 border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">30% Wants & Lifestyle</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  isWantsCompliant
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isWantsCompliant ? '✅ Followed' : '⚠️ Exceeded'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Dining out, shopping & entertainment</p>

            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <span className="text-xl font-black text-slate-900">
                  ₹{wantsSpent.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-slate-500 ml-1">
                  ({wantsPct}%)
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Target: ₹{targetWants.toLocaleString()}
              </span>
            </div>

            <div className="mt-2 w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  wantsPct > 30 ? 'bg-rose-500' : 'bg-purple-600'
                }`}
                style={{ width: `${Math.min(100, (wantsPct / 30) * 100)}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-slate-500 font-medium">
              <span>Cap: 30%</span>
              <span className={wantsPct > 30 ? 'text-rose-700 font-bold' : 'text-purple-700 font-bold'}>
                Actual: {wantsPct}%
              </span>
            </div>
          </div>

          {/* 3. 20% Savings */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isSavingsCompliant
                ? 'bg-emerald-50/60 border-emerald-200'
                : 'bg-amber-50/80 border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">20% Savings & Wealth</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  isSavingsCompliant
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isSavingsCompliant ? '✅ Target Met' : '⚠️ Shortfall'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Emergency buffer, SIPs & wealth creation</p>

            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <span className="text-xl font-black text-emerald-700">
                  ₹{actualSavings.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-emerald-800 ml-1">
                  ({savingsPct}%)
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Target: ₹{targetSavings.toLocaleString()}
              </span>
            </div>

            <div className="mt-2 w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  savingsPct >= 20 ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, (savingsPct / 20) * 100)}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-slate-500 font-medium">
              <span>Target: 20%</span>
              <span className={savingsPct >= 20 ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                Actual: {savingsPct}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Analyzed End-of-Month Report Table (Savings & Expenses Column) ── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-900">
                Analyzed End-of-Month Report &amp; Savings Ledger
              </h3>
              <span className="text-[11px] font-bold text-slate-400">
                • {user?.name ? `${user.name}'s Records` : 'Private User Records'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive report analyzing monthly savings, expenses, and whether the 50/30/20 rule was followed.
            </p>
          </div>
        </div>

        {/* Columns Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Month</th>
                <th className="py-3 px-3">Monthly Income</th>
                <th className="py-3 px-3 text-rose-700">Total Expenses Column</th>
                <th className="py-3 px-3">Needs (50%)</th>
                <th className="py-3 px-3">Wants (30%)</th>
                <th className="py-3 px-3 text-emerald-700 font-black">Net Savings Column</th>
                <th className="py-3 px-3">Savings Rate</th>
                <th className="py-3 px-3 text-right">50-30-20 Rule Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {monthlyLedger.map((row) => (
                <tr key={row.monthKey} className="hover:bg-slate-50/70 transition-colors">
                  {/* Month */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold text-slate-900">{row.monthLabel}</span>
                    </div>
                  </td>

                  {/* Monthly Income */}
                  <td className="py-3.5 px-3 font-semibold text-slate-800">
                    ₹{row.income.toLocaleString()}
                  </td>

                  {/* Total Expenses Column */}
                  <td className="py-3.5 px-3 font-bold text-rose-600">
                    ₹{row.expenses.toLocaleString()}
                  </td>

                  {/* Needs */}
                  <td className="py-3.5 px-3 text-slate-600">
                    ₹{row.needs.toLocaleString()}
                    <span className="text-[10px] text-slate-400 ml-1">
                      ({row.income > 0 ? Math.round((row.needs / row.income) * 100) : 0}%)
                    </span>
                  </td>

                  {/* Wants */}
                  <td className="py-3.5 px-3 text-slate-600">
                    ₹{row.wants.toLocaleString()}
                    <span className="text-[10px] text-slate-400 ml-1">
                      ({row.income > 0 ? Math.round((row.wants / row.income) * 100) : 0}%)
                    </span>
                  </td>

                  {/* Net Savings Column */}
                  <td className="py-3.5 px-3 font-black text-emerald-700">
                    +₹{row.savings.toLocaleString()}
                  </td>

                  {/* Savings Rate */}
                  <td className="py-3.5 px-3">
                    <span
                      className={`font-bold ${
                        row.savingsRate >= 20 ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {row.savingsRate}%
                    </span>
                  </td>

                  {/* 50-30-20 Verdict */}
                  <td className="py-3.5 px-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl border ${
                        row.followed
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {row.followed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Rule Followed</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Not Followed</span>
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
