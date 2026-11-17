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
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Search,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { useHerCareer } from '../../../context/HerCareerContext';
import { useAuth } from '../../../context/AuthContext';
import { calculateQualificationFit } from '../../../utils/qualificationMatcher';
import { HerCareerTab } from '../HerCareerLayout';

interface HerCareerDashboardViewProps {
  onNavigateTab: (tab: HerCareerTab) => void;
}

export const HerCareerDashboardView: React.FC<HerCareerDashboardViewProps> = ({ onNavigateTab }) => {
  const { stats, jobs, applications, activeResume, profile, resumes, interviewQuestions } = useHerCareer();
  const { user } = useAuth();

  const candidateQualification =
    activeResume?.education?.[0]?.degree ||
    user?.education ||
    user?.resumeData?.education?.[0]?.degree ||
    '';

  const scheduledInterviews = React.useMemo(() => {
    return applications.filter(
      (app) => app.status === 'Interview Scheduled' || app.status === 'Interview Completed'
    );
  }, [applications]);

  const matchedJobs = React.useMemo(() => {
    return [...jobs]
      .map((job) => ({
        ...job,
        fit: calculateQualificationFit(candidateQualification, job)
      }))
      .sort((a, b) => b.fit.score - a.fit.score);
  }, [jobs, candidateQualification]);

  // 1. Dynamic user resume count (unique valid user resumes)
  const userValidResumesCount = React.useMemo(() => {
    const list = Array.isArray(resumes) ? resumes : [];
    const unique = Array.from(new Map(list.map((r) => [r.id || r.title, r])).values());
    const valid = unique.filter(
      (r) =>
        (r.personalInfo?.fullName && r.personalInfo.fullName.trim() !== '') ||
        (r.experience && r.experience.length > 0) ||
        (r.education && r.education.length > 0)
    );
    return valid.length > 0 ? valid.length : (activeResume?.personalInfo?.fullName ? 1 : 0);
  }, [resumes, activeResume]);

  // 2. Truly recommended jobs matching candidate qualification & skills
  const candidateRecommendedJobsCount = React.useMemo(() => {
    if (!candidateQualification || candidateQualification.trim() === '') {
      return jobs.length;
    }
    const highMatch = matchedJobs.filter((j) => j.fit.score >= 70);
    return highMatch.length > 0 ? highMatch.length : matchedJobs.length;
  }, [matchedJobs, candidateQualification, jobs.length]);

  // 3. Dynamic interview prep simulation progress
  const interviewQuestionsAnswered = Array.isArray(interviewQuestions)
    ? interviewQuestions.filter((q) => q.userAnswer && q.score).length
    : 0;
  const interviewProgress = Array.isArray(interviewQuestions) && interviewQuestions.length > 0
    ? Math.round((interviewQuestionsAnswered / interviewQuestions.length) * 100)
    : 0;

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
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{userValidResumesCount}</h3>
            <p className="text-[11px] text-teal-600 font-semibold mt-0.5">
              {userValidResumesCount > 0 ? 'Active & ATS-Optimized' : 'No Resume Uploaded'}
            </p>
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
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{candidateRecommendedJobsCount}</h3>
            <p className="text-[11px] text-teal-600 font-semibold mt-0.5">
              {candidateQualification
                ? `Matched to ${candidateQualification.split('(')[0].trim()}`
                : 'Verified Opportunities'}
            </p>
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
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{applications.length}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              {applications.length > 0 ? 'Tracked Active' : '0 Applied Yet'}
            </p>
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
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{interviewProgress}%</h3>
            <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">
              {interviewQuestionsAnswered > 0 ? `${interviewQuestionsAnswered} Questions Completed` : 'Simulations Ready'}
            </p>
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

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
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
        </div>
      </div>

      {/* 3. Middle Row: Recommended Jobs & Resume Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recommended Jobs (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Personalized Job Matches</h3>
              <p className="text-xs text-slate-500">
                Tailored for qualification:{' '}
                <span className="font-bold text-teal-800">
                  {candidateQualification || 'All Backgrounds'}
                </span>
              </p>
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
            {matchedJobs.slice(0, 3).map((job) => (
              <div
                key={job.jobId}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">{job.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${job.fit?.badgeClass || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {job.fit?.badgeText}
                    </span>
                    {job.returneeFriendly && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                        Returnee Friendly
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-purple-900 font-semibold">
                    <GraduationCap className="w-3 h-3 text-[#4A154B] shrink-0" />
                    <span className="truncate">{job.qualification || 'Relevant Degree'}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
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
    </div>
  );
};

