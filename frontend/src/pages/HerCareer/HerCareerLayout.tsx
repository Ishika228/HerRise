import React, { ReactNode } from 'react';
import {
  Briefcase,
  FileText,
  Sparkles,
  Search,
  CheckCircle2,
  Mic,
  TrendingUp,
  RotateCcw,
  Bot,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useHerCareer } from '../../context/HerCareerContext';

export type HerCareerTab =
  | 'dashboard'
  | 'builder'
  | 'analyzer'
  | 'jobs'
  | 'tracker'
  | 'interview'
  | 'roadmap'
  | 'restart'
  | 'assistant';

interface HerCareerLayoutProps {
  activeTab: HerCareerTab;
  setActiveTab: (tab: HerCareerTab) => void;
  children: ReactNode;
}

export const HerCareerLayout: React.FC<HerCareerLayoutProps> = ({
  activeTab,
  setActiveTab,
  children
}) => {
  const { profile, stats } = useHerCareer();

  const tabs: { id: HerCareerTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Overview', icon: Briefcase },
    { id: 'builder', label: 'Resume Builder', icon: FileText },
    { id: 'analyzer', label: 'Resume Analyzer', icon: Sparkles },
    { id: 'jobs', label: 'Job Matching', icon: Search },
    { id: 'tracker', label: 'Applications', icon: CheckCircle2 },
    { id: 'interview', label: 'Interview Prep', icon: Mic },
    { id: 'roadmap', label: 'Career Roadmap', icon: TrendingUp },
    { id: 'restart', label: 'Career Restart', icon: RotateCcw },
    { id: 'assistant', label: 'AI Copilot', icon: Bot }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5 text-slate-800">
        {/* Professional Navy & Teal Header Banner */}
        <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f766e] text-white p-6 sm:p-7 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold text-teal-300 border border-teal-500/20">
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                <span>HerCareer • AI-Powered Career Platform</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Empowering Your Professional Journey
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Discover curated opportunities, craft ATS-optimized resumes, simulate interviews with AI, and navigate your career path with confidence.
              </p>
            </div>

            {/* User Readiness Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex items-center gap-4 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 font-black text-lg">
                {stats.readinessScore}%
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-[11px] font-bold text-teal-300 uppercase tracking-wider">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Profile Readiness</span>
                </div>
                <h4 className="text-sm font-bold text-white truncate max-w-[160px]">{profile.targetRole}</h4>
                <p className="text-[11px] text-slate-300">{stats.applicationsSubmitted} active applications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Clean, Streamlined Navigation Bar */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0f172a] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content View */}
        {children}
      </div>
    </DashboardLayout>
  );
};

