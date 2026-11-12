import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  Heart,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Briefcase,
  BookOpen,
  MessageSquare,
  Copy,
  Users2
} from 'lucide-react';
import { useHerCareer } from '../../../context/HerCareerContext';
import { useToast } from '../../../context/ToastContext';

export const CareerRestartView: React.FC = () => {
  const { restartNarrative, isGeneratingRestart, generateRestartPlan, jobs, profile } = useHerCareer();
  const { showToast } = useToast();

  const [breakYears, setBreakYears] = useState(3);
  const [breakReason, setBreakReason] = useState('Childcare & Family Caregiving');
  const [previousRole, setPreviousRole] = useState(profile.targetRole || 'Software Developer');
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [newSkills, setNewSkills] = useState('React, Modern TypeScript, Cloud REST APIs');

  const returneeJobs = jobs.filter((j) => j.returneeFriendly);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateRestartPlan({
      breakDurationYears: breakYears,
      breakReason,
      previousRole,
      targetRole,
      newSkills
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to Clipboard! 📋', `${label} is ready to paste`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f766e] text-white p-6 sm:p-7 rounded-3xl shadow-xl space-y-2 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold text-teal-300">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Women's Career Comeback & Returnship Track</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight">
          Turn Your Career Break into a Source of Confidence & Strength
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Breaks are natural chapters of life. We help you identify transferable leadership competencies, articulate your sabbatical with dignity, and connect with inclusive organizations welcoming returners.
        </p>
      </div>

      {/* Career Break Formulation Form */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-sm text-slate-900">1. Share Your Relaunch Context</h3>
          <p className="text-xs text-slate-500">
            Tell the AI about your past role, your time away, and refreshed skills.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Break Duration (Years)</label>
              <input
                type="number"
                min={1}
                max={15}
                value={breakYears}
                onChange={(e) => setBreakYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Reason</label>
              <select
                value={breakReason}
                onChange={(e) => setBreakReason(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
              >
                <option value="Childcare & Family Caregiving">Childcare & Family Caregiving</option>
                <option value="Elderly Care & Family Support">Elderly Care & Family Support</option>
                <option value="Personal Health & Recovery">Personal Health & Recovery</option>
                <option value="Higher Education & Sabbatical">Higher Education & Sabbatical</option>
                <option value="Relocation & Transition">Relocation & Transition</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Previous Role Held</label>
              <input
                type="text"
                value={previousRole}
                onChange={(e) => setPreviousRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Comeback Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Refreshed or Recent Skills Learned:
            </label>
            <input
              type="text"
              value={newSkills}
              onChange={(e) => setNewSkills(e.target.value)}
              placeholder="e.g. Modern React, TypeScript, Cloud APIs, Agile Project Coordination"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isGeneratingRestart}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isGeneratingRestart ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-teal-300" />}
            <span>{isGeneratingRestart ? 'Generating Comeback Strategy...' : 'Generate Career Comeback Plan with AI'}</span>
          </button>
        </form>
      </div>

      {/* AI Comeback Strategy Results */}
      {restartNarrative && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
          {/* 1. Resume Phrasing Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 text-teal-800 font-extrabold text-sm">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Empowering Resume Summary Phrasing</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(restartNarrative.resumeSummaryNarrative, 'Resume Summary')}
                className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy to Resume</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80 font-medium">
              "{restartNarrative.resumeSummaryNarrative}"
            </p>
          </div>

          {/* 2. Interview Talking Points */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm border-b border-slate-100 pb-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>How to Address Your Break in Interviews Confidently</span>
            </div>
            <div className="space-y-2.5">
              {restartNarrative.interviewTalkingPoints.map((tp, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{tp}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Transferable Skills & Recruiter Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Your Highlighted Transferable Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {restartNarrative.transferableSkillsIdentified.map((ts, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                    ✓ {ts}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Recommended Recruiter Approach
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {restartNarrative.recommendedComebackStrategy}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Returnee-Friendly Job Opportunities */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Curated Returnship & Flexible Openings</h3>
            <p className="text-xs text-slate-500">
              Verified organizations offering dedicated onboarding ramp-ups and mentorship
            </p>
          </div>
          <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
            {returneeJobs.length} Verified Roles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {returneeJobs.map((job) => (
            <div key={job.jobId} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{job.title}</h4>
                  <p className="text-xs text-slate-500">{job.company} • {job.location}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                  Returnship
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{job.description}</p>
              <div className="flex justify-between items-center pt-1 text-xs">
                <span className="font-bold text-teal-700">{job.salaryRange}</span>
                <span className="text-slate-400">{job.workMode}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
