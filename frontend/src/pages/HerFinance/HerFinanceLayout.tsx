import React, { ReactNode } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export type HerFinanceTab = 'dashboard';

interface HerFinanceLayoutProps {
  children: ReactNode;
}

export const HerFinanceLayout: React.FC<HerFinanceLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const displayName = user?.name || 'Member';
  const displayRole = user?.role || user?.currentStatus || 'Personal Account';

  return (
    <DashboardLayout>
      <div className="space-y-6 text-slate-800">
        {/* Simple & Modern Header Banner */}
        <div className="bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#047857] text-white p-6 sm:p-7 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  HerFinance
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-300 border border-white/15 backdrop-blur-xs">
                  {displayName}'s Private Vault
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
                Personalized financial ledger calibrated for <span className="font-bold text-white">{displayName}</span>. Log your daily purchases and track your 50/30/20 monthly targets.
              </p>
            </div>

            {/* User Identity Chip */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 shrink-0 self-start md:self-auto shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-black text-base shadow-xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-white">{displayName}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[11px] text-purple-200 block truncate max-w-[160px]">
                  {user?.email || displayRole}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {children}
      </div>
    </DashboardLayout>
  );
};
