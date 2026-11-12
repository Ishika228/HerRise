import React, { ReactNode, useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  Sliders,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Target
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
  onOpenSetupBaseline?: () => void;
}

export const HerFinanceLayout: React.FC<HerFinanceLayoutProps> = ({
  activeTab,
  setActiveTab,
  children,
  onOpenAddExpenseModal,
  onOpenAddIncomeModal,
  onOpenAddGoalModal,
  onOpenSetupBaseline
}) => {
  const { dateFilter, setDateFilter, unreadNotificationsCount } = useHerFinance();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 5 Primary Simple Navigation Tabs
  const primaryTabs: { id: HerFinanceTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Overview', icon: Wallet },
    { id: 'expenses', label: 'Expenses & Income', icon: Receipt },
    { id: 'budget', label: 'Monthly Budget', icon: PieIcon },
    { id: 'goals', label: 'Savings Goals', icon: PiggyBank },
    { id: 'assistant', label: 'AI Money Helper', icon: Sparkles }
  ];

  // Secondary items tucked neatly inside "More"
  const secondaryTabs: { id: HerFinanceTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'history', label: 'All Transactions History', icon: History },
    { id: 'learn', label: 'Financial Guides & Tips', icon: GraduationCap },
    { id: 'reports', label: 'Monthly Reports', icon: FileBarChart2 },
    { id: 'notifications', label: 'Alerts & Reminders', icon: Bell },
    { id: 'settings', label: 'Finance Settings', icon: Settings }
  ];

  const isSecondaryActive = secondaryTabs.some((t) => t.id === activeTab);

  return (
    <DashboardLayout>
      <div className="space-y-5 text-slate-800">
        {/* Simple & Friendly Header Banner */}
        <div className="bg-gradient-to-r from-[#1e1b4b] via-[#3b0764] to-[#047857] text-white p-6 sm:p-7 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold text-emerald-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>HerFinance • Simple Money Tracker</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Simple & Easy Money Management
              </h1>
              <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
                See what you earn, track what you spend, set simple monthly limits, and grow your savings.
              </p>
            </div>

            {/* Simple Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onOpenAddIncomeModal}
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-emerald-950" />
                <span>+ Add Income</span>
              </button>

              <button
                type="button"
                onClick={onOpenAddExpenseModal}
                className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-400 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <TrendingDown className="w-4 h-4 text-rose-100" />
                <span>- Add Expense</span>
              </button>

              <button
                type="button"
                onClick={onOpenAddGoalModal}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Target className="w-4 h-4 text-teal-300" />
                <span>New Goal</span>
              </button>

              {onOpenSetupBaseline && (
                <button
                  type="button"
                  onClick={onOpenSetupBaseline}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-purple-200 border border-white/15 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  title="Set or update your monthly budget limits"
                >
                  <Sliders className="w-4 h-4 text-purple-300" />
                  <span>Set Budget</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Clean, Simple Navigation Tabs & Filter Bar */}
        <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          {/* 5 Clear Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 text-xs font-bold text-slate-600">
            {primaryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#1e1b4b] text-white shadow-xs'
                      : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* "More Tools" Dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                  isSecondaryActive
                    ? 'bg-[#1e1b4b] text-white shadow-xs'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{isSecondaryActive ? secondaryTabs.find((t) => t.id === activeTab)?.label : 'More'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {moreMenuOpen && (
                <div className="absolute left-0 mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in slide-in-from-top-2">
                  {secondaryTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(tab.id);
                          setMoreMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                          activeTab === tab.id
                            ? 'bg-purple-50 text-[#4A154B] font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Simple Date Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 shrink-0 self-start md:self-auto">
            <span className="px-2 text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-500" />
              View:
            </span>
            {(['this_month', 'last_month', 'all'] as const).map((filterKey) => (
              <button
                key={filterKey}
                type="button"
                onClick={() => setDateFilter(filterKey as DateFilterType)}
                className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer text-xs ${
                  dateFilter === filterKey
                    ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filterKey === 'this_month' ? 'This Month' : filterKey === 'last_month' ? 'Last Month' : 'All Time'}
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
