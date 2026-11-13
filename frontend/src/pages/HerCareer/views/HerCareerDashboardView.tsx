import React from 'react';
import {
  FileText,
  Briefcase,
  CheckCircle2,
  Mic,
  Award,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  MapPin,
  Building,
  Calendar,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Search,
  ExternalLink
} from 'lucide-react';
import { useHerCareer } from '../../../context/HerCareerContext';
import { HerCareerTab } from '../HerCareerLayout';

interface HerCareerDashboardViewProps {
  onNavigateTab: (tab: HerCareerTab) => void;
}

export const HerCareerDashboardView: React.FC<HerCareerDashboardViewProps> = ({ onNavigateTab }) => {
  const { stats, jobs, applications, activeResume, profile } = useHerCareer();

  return (
    <div className="space-y-6">
      {/* 1. Four Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Resumes */}
        <div
          onClick={() => onNavigateTab('builder')}
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Resumes</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stats.totalResumes}</h3>
            <p className="text-[11px] text-teal-600 font-semibold mt-0.5">ATS-Optimized</p>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div
          onClick={() => onNavigateTab('jobs')}
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Recommended</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-all">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stats.recommendedJobs}</h3>
            <p className="text-[11px] text-teal-600 font-semibold mt-0.5">Verified & Returnee</p>
          </div>
        </div>

        {/* Applications Submitted */}
        <div
          onClick={() => onNavigateTab('tracker')}
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Applications</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stats.applicationsSubmitted}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Tracked Active</p>
          </div>
        </div>

        {/* Interview Prep Progress */}
        <div
          onClick={() => onNavigateTab('interview')}
          className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Interview Prep</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Mic className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stats.interviewPrepProgress}%</h3>
            <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">Simulations Ready</p>
          </div>
        </div>
      </div>

      {/* 2. Quick Actions Section */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <h3 className="font-extrabold text-sm text-slate-900">Career Quick Actions</h3>
          </div>
          <span className="text-[11px] text-slate-500">Select an action to launch</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          <button
            type="button"
            onClick={() => onNavigateTab('builder')}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-teal-50/70 border border-slate-200/80 hover:border-teal-300 text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Create Resume</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">AI-crafted format</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('analyzer')}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-teal-50/70 border border-slate-200/80 hover:border-teal-300 text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Analyze Resume</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Score & feedback</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('jobs')}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-teal-50/70 border border-slate-200/80 hover:border-teal-300 text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Search className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Find Jobs</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Curated openings</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('interview')}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-teal-50/70 border border-slate-200/80 hover:border-teal-300 text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Mic className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Interview Prep</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Simulate answers</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('restart')}
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-teal-50/70 border border-slate-200/80 hover:border-teal-300 text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <RotateCcw className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Career Restart</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Returnee support</p>
          </button>
        </div>
      </div>

      {/* 3. AI-Generated Career Insights Banner */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f766e] text-white p-5 sm:p-6 rounded-3xl shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-teal-300">
                AI Career Intelligence
              </span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              Your profile matches <strong>92%</strong> of the core qualifications for <strong>{profile.targetRole}</strong>. 
              Adding 1 quantified metric to your primary resume and practicing technical communication can boost your interview callback rate significantly.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('assistant')}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4.5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>Ask AI Copilot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Middle Row: Recommended Jobs & Resume Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recommended Jobs (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Personalized Job Matches</h3>
              <p className="text-xs text-slate-500">Based on your skills & work mode preferences</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('jobs')}
              className="text-xs font-bold text-teal-700 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Explore All ({jobs.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {jobs.slice(0, 3).map((job) => (
              <div
                key={job.jobId}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{job.title}</span>
                    {job.returneeFriendly && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                        Returnee Friendly
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="font-semibold text-teal-700">{job.salaryRange}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onNavigateTab('jobs')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    View & Match
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resume Completion & Readiness (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Active Resume Status</h3>
                <p className="text-xs text-slate-500">ATS formatting & readiness index</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('builder')}
                className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
              >
                Edit Resume →
              </button>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{activeResume.title}</h4>
                  <p className="text-[11px] text-slate-500">
                    {activeResume.template.toUpperCase()} Template • {activeResume.experience.length} experiences
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-teal-600 text-white text-xs font-black">
                  {activeResume.qualityScore || 88}/100
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                  <span>ATS Readability Assessment</span>
                  <span className="text-teal-800 font-bold">Strong</span>
                </div>
                <div className="w-full bg-teal-200/60 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full"
                    style={{ width: `${activeResume.qualityScore || 88}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-slate-600">
                <span>Professional Summary</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-slate-600">
                <span>Technical Skills Count</span>
                <span className="font-bold text-slate-900">{activeResume.skills.technical.length} Skills</span>
              </div>
              <div className="flex items-center justify-between py-1.5 text-slate-600">
                <span>Portfolio & GitHub Links</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Attached
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('analyzer')}
            className="w-full py-2.5 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-teal-300 font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Run Deep AI Resume Analysis</span>
          </button>
        </div>
      </div>

      {/* 5. Bottom Row: Upcoming Interviews & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upcoming Interviews (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h3 className="font-extrabold text-sm text-slate-900">Upcoming Interviews</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('interview')}
              className="text-xs font-bold text-indigo-700 hover:underline cursor-pointer"
            >
              Practice AI Simulation →
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-200 text-indigo-900">
                Technical Round
              </span>
              <span className="text-[11px] font-bold text-indigo-800">Nov 15, 2:00 PM IST</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Fintech Spark India</h4>
              <p className="text-xs text-slate-600">Senior Frontend Engineer Role</p>
            </div>
            <p className="text-[11px] text-slate-500">Interviewer: Priya Raman (Director of Engineering)</p>

            <button
              type="button"
              onClick={() => onNavigateTab('interview')}
              className="w-full mt-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Simulate Questions for this Role</span>
            </button>
          </div>
        </div>

        {/* Recent Applications Tracker (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-sm text-slate-900">Recent Applications</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('tracker')}
              className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
            >
              View Full Board ({applications.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {applications.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">No applications tracked yet.</p>
            ) : (
              applications.slice(0, 3).map((app) => (
                <div key={app.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{app.title}</h4>
                    <span className="text-[11px] text-slate-500">
                      {app.company} • Applied on {app.appliedDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold px-2.5 py-1 rounded-full text-[11px] ${
                        app.status === 'Interview Scheduled'
                          ? 'bg-indigo-100 text-indigo-800'
                          : app.status === 'Applied'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

