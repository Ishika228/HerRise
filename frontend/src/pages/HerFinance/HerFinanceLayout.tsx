import React, { ReactNode } from 'react';
import {
  Sparkles,
  Zap,
  BookOpen,
  Receipt,
  Settings as SettingsIcon,
  Bot
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export type HerFinanceTab = 'dashboard' | 'history' | 'learn' | 'settings';

interface HerFinanceLayoutProps {
  activeTab: HerFinanceTab;
  setActiveTab: (tab: HerFinanceTab) => void;
  children: ReactNode;
}

export const HerFinanceLayout: React.FC<HerFinanceLayoutProps> = ({
  activeTab,
  setActiveTab,
  children
}) => {
  const tabs: { id: HerFinanceTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'AI Finance Hub', icon: Zap },
    { id: 'history', label: 'Activity Ledger', icon: Receipt },
    { id: 'learn', label: 'Financial Guide', icon: BookOpen }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5 text-slate-800">
        {/* Simple & Modern AI Header Banner */}
        <div className="bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#047857] text-white p-6 sm:p-7 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold text-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>AI Financial Autopilot • Autonomous Mode Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                HerFinance • AI Automated Finance
              </h1>
              <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
                Zero manual bookkeeping. Just tell the AI what you earned, spent, or want to save — AI auto-categorizes, manages your 50/30/20 budget, and provides live guidance.
              </p>
            </div>

            {/* AI Status Badge */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-emerald-200 self-start md:self-center shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <Bot className="w-4 h-4 text-emerald-300" />
              <span>Groq AI Online</span>
            </div>
          </div>
        </div>

        {/* Streamlined Navigation Bar: 3 Clean Options */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1e1b4b] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#1e1b4b] text-white'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Finance Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Main Content Area */}
        {children}
      </div>
    </DashboardLayout>
  );
};
