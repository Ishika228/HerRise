import React, { useState, ReactNode } from 'react';
import { Sidebar } from '../common/Sidebar';
import { DashboardHeader } from '../common/DashboardHeader';
import { ShieldAlert } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf9fd] flex">
      {/* Sidebar (Desktop & Mobile) */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Global Dashboard Header */}
        <DashboardHeader onMenuClick={() => setMobileOpen(true)} />

        {/* Persistent Demo Warning Ribbon */}
        <div className="bg-purple-950 text-purple-200 text-[11px] py-1.5 px-4 sm:px-6 flex items-center justify-between border-b border-purple-900/60">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-semibold text-white">Interactive Demo Platform:</span>
            <span className="truncate hidden sm:inline">
              All financial stats, loan schemes, job postings, products, and mentor bookings are illustrative.
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-pink-300 shrink-0 ml-2">
            HerRise AI v2.6
          </span>
        </div>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

