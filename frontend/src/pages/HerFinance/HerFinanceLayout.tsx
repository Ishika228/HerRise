import React, { ReactNode } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export type HerFinanceTab = 'dashboard';

interface HerFinanceLayoutProps {
  children: ReactNode;
}

export const HerFinanceLayout: React.FC<HerFinanceLayoutProps> = ({ children }) => {
  return (
    <DashboardLayout>
      <div className="space-y-6 text-slate-800">
        {/* Simple & Modern Header Banner */}
        <div className="bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#047857] text-white p-6 sm:p-7 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                HerFinance
              </h1>
              <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
                Log what you spend daily, manage your income, and get an automated 50/30/20 rule audit at the end of the month.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {children}
      </div>
    </DashboardLayout>
  );
};
