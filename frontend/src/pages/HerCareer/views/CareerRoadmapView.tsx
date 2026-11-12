import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  Loader2,
  CheckSquare,
  Square,
  Tag
} from 'lucide-react';
import { useHerCareer } from '../../../context/HerCareerContext';
import { useToast } from '../../../context/ToastContext';

export const CareerRoadmapView: React.FC = () => {
  const {
    roadmapPhases,
    skillGaps,
    isGeneratingRoadmap,
    generateCareerRoadmap,
    toggleMilestoneTask,
    profile,
    activeResume
  } = useHerCareer();
  const { showToast } = useToast();

  const [targetRole, setTargetRole] = useState(profile.targetRole || 'Data Analyst');

  const popularRoles = [
    'Data Analyst',
    'Senior Frontend Engineer',
    'Full Stack Developer',
    'AI Solutions Engineer',
    'Product Manager',
    'Cloud DevOps Architect'
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateCareerRoadmap(targetRole);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <span>AI Career Roadmap & Skill Gap Engine</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Personalized Learning Milestones for {targetRole}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare your verified competencies against industry expectations and follow a structured path to job readiness.
          </p>
        </div>

        {/* Role Quick Selector */}
        <form onSubmit={handleGenerate} className="flex gap-2 w-full md:w-auto shrink-0">
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="Enter target role..."
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isGeneratingRoadmap}
            className="px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shrink-0"
          >
            {isGeneratingRoadmap ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-teal-300" />}
            <span>Recalibrate</span>
          </button>
        </form>
      </div>

      {/* Popular Role Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="font-bold text-slate-500 shrink-0">Quick Target Roles:</span>
        {popularRoles.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => {
              setTargetRole(r);
              generateCareerRoadmap(r);
            }}
            className={`px-3 py-1 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              targetRole === r
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Skill Gap Analysis Grid */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Skill Gap Diagnosis</h3>
            <p className="text-xs text-slate-500">
              Your resume currently lists {activeResume.skills.technical.length} technical skills. Here are the top gaps for {targetRole}.
            </p>
          </div>
          <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
            AI Market Benchmark
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skillGaps.map((sg, idx) => (
            <div
              key={idx}
              className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      sg.priority === 'high'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {sg.priority} Priority Gap
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    ~{sg.estimatedHours} hrs
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">{sg.skill}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                  <BookOpen className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Recommended: {sg.recommendedCourse}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-xs">
                <span className={sg.completed ? 'font-bold text-emerald-700' : 'text-slate-500'}>
                  {sg.completed ? '✓ Mastered' : 'Pending Study'}
                </span>
                <span className="text-[11px] font-bold text-teal-700">Course Linked</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phased Roadmap Timeline */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-sm text-slate-900">Structured 3-Phase Roadmap</h3>
          <p className="text-xs text-slate-500">
            Check off milestones as you build projects and master concepts.
          </p>
        </div>

        <div className="space-y-6">
          {roadmapPhases.map((phase, pIdx) => (
            <div
              key={pIdx}
              className={`p-5 rounded-2xl border transition-all ${
                phase.completed
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-slate-50/70 border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0f172a] text-white text-xs font-black flex items-center justify-center">
                    {pIdx + 1}
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900">{phase.phase}</h4>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {phase.durationWeeks} Weeks
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleMilestoneTask(pIdx, 0)}
                    className={`text-xs font-bold px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                      phase.completed
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{phase.completed ? 'Phase Completed' : 'Mark Complete'}</span>
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <p className="text-xs font-bold text-teal-800">
                  Target Milestone: {phase.milestone}
                </p>

                <div className="space-y-1.5 pt-1">
                  {phase.tasks.map((task, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
