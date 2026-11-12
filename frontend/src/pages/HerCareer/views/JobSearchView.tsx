import React, { useState } from 'react';
import {
  Search,
  Filter,
  Bookmark,
  Building,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Check,
  Send,
  Loader2,
  DollarSign
} from 'lucide-react';
import { useHerCareer } from '../../../context/HerCareerContext';
import { useToast } from '../../../context/ToastContext';
import { JobListing } from '../../../types/career';
import { Modal } from '../../../components/common/Modal';

export const JobSearchView: React.FC = () => {
  const { jobs, savedJobIds, toggleSaveJob, matchJobWithProfile, applyToJob } = useHerCareer();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [returneeOnly, setReturneeOnly] = useState(false);

  // Active Selected Job Modal for AI Match Breakdown & Quick Apply
  const [activeJobModal, setActiveJobModal] = useState<JobListing | null>(null);
  const [jobMatchResult, setJobMatchResult] = useState<any | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const filteredJobs = jobs.filter((job) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.skills.some((s) => s.toLowerCase().includes(q));

    const matchesMode = selectedWorkMode === 'All' || job.workMode.toLowerCase() === selectedWorkMode.toLowerCase();
    const matchesType = selectedType === 'All' || job.employmentType.toLowerCase() === selectedType.toLowerCase();
    const matchesReturnee = !returneeOnly || job.returneeFriendly;

    return matchesSearch && matchesMode && matchesType && matchesReturnee;
  });

  const handleOpenJobModal = async (job: JobListing) => {
    setActiveJobModal(job);
    setJobMatchResult(null);
    setIsMatching(true);
    try {
      const match = await matchJobWithProfile(job);
      setJobMatchResult(match);
    } finally {
      setIsMatching(false);
    }
  };

  const handleApply = async () => {
    if (!activeJobModal) return;
    setIsApplying(true);
    try {
      await applyToJob(activeJobModal.jobId, coverNote);
      setActiveJobModal(null);
      setCoverNote('');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by job title, company name, or skills (e.g. React, Python, Product)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2.5">
            {/* Work Mode */}
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white cursor-pointer"
            >
              <option value="All">All Work Modes</option>
              <option value="Remote">Remote Only</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>

            {/* Employment Type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white cursor-pointer"
            >
              <option value="All">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>

            {/* Returnee Friendly Filter */}
            <button
              type="button"
              onClick={() => setReturneeOnly(!returneeOnly)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                returneeOnly
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Returnee Friendly</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Showing <strong>{filteredJobs.length}</strong> opportunities • Verified & Returnship Openings
          </span>
          <span className="text-[11px] text-teal-700 font-semibold">
            All positions clearly labeled with employer verification
          </span>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.map((job) => {
          const isSaved = savedJobIds.includes(job.jobId);
          return (
            <div
              key={job.jobId}
              className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900">{job.title}</h3>
                      {job.returneeFriendly && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                          Returnee Friendly
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.company}</span>
                      <span>•</span>
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSaveJob(job.jobId)}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      isSaved ? 'bg-teal-50 text-teal-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                    title={isSaved ? 'Saved to favorites' : 'Save job'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-teal-700' : ''}`} />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{job.description}</p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                    {job.workMode}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                    {job.employmentType}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-[11px] font-bold">
                    {job.salaryRange}
                  </span>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.skills.slice(0, 4).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md border border-slate-200 text-slate-600 text-[10px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 4 && (
                    <span className="text-[10px] text-slate-400 self-center">+{job.skills.length - 4} more</span>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Posted {job.postedDate}</span>
                <button
                  type="button"
                  onClick={() => handleOpenJobModal(job)}
                  className="px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                  <span>AI Match & Apply</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Job Match & Quick Apply Modal */}
      {activeJobModal && (
        <Modal
          isOpen={!!activeJobModal}
          onClose={() => setActiveJobModal(null)}
          title={`Job Matching & Application: ${activeJobModal.title}`}
        >
          <div className="space-y-4 text-slate-800">
            {/* Header info */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{activeJobModal.company}</h4>
                  <p className="text-xs text-slate-500">{activeJobModal.location} • {activeJobModal.workMode}</p>
                </div>
                <span className="font-black text-xs text-teal-800 bg-teal-100 px-2.5 py-1 rounded-lg">
                  {activeJobModal.salaryRange}
                </span>
              </div>
            </div>

            {/* AI Match Card */}
            <div className="p-4.5 rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-300" />
                  <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                    AI Profile Match Score
                  </span>
                </div>
                {isMatching ? (
                  <Loader2 className="w-4 h-4 text-teal-300 animate-spin" />
                ) : (
                  <span className="text-lg font-black text-teal-300">
                    {jobMatchResult?.matchPercentage || 88}%
                  </span>
                )}
              </div>

              {jobMatchResult && (
                <div className="space-y-2 text-xs">
                  <p className="text-slate-200 leading-relaxed">{jobMatchResult.suitabilityReason}</p>
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    <span className="text-[11px] font-bold text-teal-300">Matching Skills:</span>
                    {jobMatchResult.matchingSkills?.map((ms: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-200 text-[10px]">
                        ✓ {ms}
                      </span>
                    ))}
                  </div>
                  {jobMatchResult.missingSkills?.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      <span className="text-[11px] font-bold text-amber-300">Recommended to Learn:</span>
                      {jobMatchResult.missingSkills?.map((ms: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 text-[10px]">
                          + {ms}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Application Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Cover Note / Message to Recruiter (Optional):
              </label>
              <textarea
                rows={3}
                placeholder="Mention why you are enthusiastic about this specific role..."
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* External link notice */}
            {activeJobModal.applyUrl && (
              <p className="text-[11px] text-slate-500 italic">
                * Clicking Submit will log this application to your <strong>HerCareer Application Tracker</strong> and open the verified hiring portal.
              </p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setActiveJobModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={isApplying}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isApplying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Submit Application & Track</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

