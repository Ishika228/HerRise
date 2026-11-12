import React, { ReactNode } from 'react';
import {
  Wallet,
  PieChart as PieIcon,
  PiggyBank,
  Receipt,
  History,
  GraduationCap,
  Sparkles,
  FileBarChart2,
  Bell,
  Settings,
  PlusCircle,
  Calendar,
  ShieldCheck,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useHerFinance, DateFilterType } from '../../context/HerFinanceContext';

export type HerFinanceTab =
  | 'dashboard'
  | 'budget'
  | 'goals'
  | 'expenses'
  | 'history'
  | 'learn'
  | 'assistant'
  | 'reports'
  | 'notifications'
  | 'settings';

interface HerFinanceLayoutProps {
  activeTab: HerFinanceTab;
  setActiveTab: (tab: HerFinanceTab) => void;
  children: ReactNode;
  onOpenAddExpenseModal: () => void;
  onOpenAddIncomeModal: () => void;
  onOpenAddGoalModal: () => void;
}

export const HerFinanceLayout: React.FC<HerFinanceLayoutProps> = ({
  activeTab,
  setActiveTab,
  children,
  onOpenAddExpenseModal,
  onOpenAddIncomeModal,
  onOpenAddGoalModal
}) => {
  const { dateFilter, setDateFilter, unreadNotificationsCount, netBalance } = useHerFinance();

  const navigationTabs: { id: HerFinanceTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Overview', icon: Wallet },
    { id: 'budget', label: 'Budget Planner', icon: PieIcon },
    { id: 'goals', label: 'Savings Goals', icon: PiggyBank },
    { id: 'expenses', label: 'Expense Tracker', icon: Receipt },
    { id: 'history', label: 'Ledger History', icon: History },
    { id: 'learn', label: 'Financial Academy', icon: GraduationCap },
    { id: 'assistant', label: 'AI Copilot', icon: Sparkles },
    { id: 'reports', label: 'Reports & Export', icon: FileBarChart2 },
    { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined },
    { id: 'settings', label: 'Profile & Settings', icon: Settings }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5 text-slate-800">
        {/* Fintech Professional Top Header Strip */}
        <div className="bg-[#0f172a] text-white p-6 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
          {/* Subtle teal decorative ambient glow */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-teal-400">
                  HerFinance Enterprise Fintech Module
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700 font-mono">
                  v2.6 Secure
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Financial Management & Wealth Security
              </h1>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Autonomous personal finance engine. Track multi-channel income, enforce category budgets, simulate liquid emergency runways, and get context-aware AI recommendations.
              </p>
            </div>

            {/* Quick Actions & Net Balance Pill */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={onOpenAddIncomeModal}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-emerald-200" />
                <span>Add Income</span>
              </button>

              <button
                onClick={onOpenAddExpenseModal}
                className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-teal-200" />
                <span>Add Expense</span>
              </button>

              <button
                onClick={onOpenAddGoalModal}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <PiggyBank className="w-4 h-4" />
                <span>New Goal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs & Date Filter Controls */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Scrollable Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-semibold text-slate-600">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#0f172a] text-white shadow-xs'
                      : 'hover:bg-slate-100 hover:text-[#0f172a]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Date Filter Segmented Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 shrink-0 self-start md:self-auto">
            <span className="px-2 text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-500" />
              Filter:
            </span>
            {(['this_month', 'last_month', 'last_3_months', 'all'] as const).map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setDateFilter(filterKey)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer text-[11px] ${
                  dateFilter === filterKey
                    ? 'bg-white text-[#0f172a] shadow-xs'
                    : 'hover:text-[#0f172a]'
                }`}
              >
                {filterKey.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Tab View Content Container */}
        <div>{children}</div>
      </div>
    </DashboardLayout>
  );
};

