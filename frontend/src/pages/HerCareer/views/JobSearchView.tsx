import React, { useState, useMemo } from 'react';
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
  DollarSign,
  GraduationCap,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useHerCareer } from '../../../context/HerCareerContext';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { JobListing } from '../../../types/career';
import { Modal } from '../../../components/common/Modal';
import { JobApplicationModal } from '../../../components/career/JobApplicationModal';
import {
  QUALIFICATION_CATEGORIES,
  calculateQualificationFit,
  inferCategoryFromEducation
} from '../../../utils/qualificationMatcher';

export const JobSearchView: React.FC = () => {
  const {
    jobs,
    savedJobIds,
    toggleSaveJob,
    matchJobWithProfile,
    applyToJob,
    applications,
    activeResume,
    profile,
    candidateQualification,
    setCandidateQualification
  } = useHerCareer();
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  // User's default detected qualification from profile/resume
  const detectedQualification = useMemo(() => {
    return (
      activeResume?.education?.[0]?.degree ||
      user?.education ||
      user?.resumeData?.education?.[0]?.degree ||
      profile?.targetRole ||
      ''
    );
  }, [activeResume, user, profile]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Qualifications');
  const [customQualification, setCustomQualification] = useState<string>('');
  const [isEditingQual, setIsEditingQual] = useState(false);
  const [onlyMatchingQual, setOnlyMatchingQual] = useState(false);
  const [returneeOnly, setReturneeOnly] = useState(false);

  // Effective qualification being matched against
  const effectiveQualification = customQualification.trim() || candidateQualification || detectedQualification;

  // Active Selected Job Modal for AI Match Breakdown & Quick Apply
  const [activeJobModal, setActiveJobModal] = useState<JobListing | null>(null);
  const [applicationModalJob, setApplicationModalJob] = useState<JobListing | null>(null);
  const [jobMatchResult, setJobMatchResult] = useState<any | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const isJobApplied = (jobId: string) => applications.some((a) => a.jobId === jobId);

  // Compute matched jobs with scores & sort by qualification match
  const processedJobs = useMemo(() => {
    const q = searchTerm.toLowerCase();

    return jobs
      .filter((job) => {
        const matchesSearch =
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          (job.qualification && job.qualification.toLowerCase().includes(q)) ||
          job.skills.some((s) => s.toLowerCase().includes(q));

        const matchesMode =
          selectedWorkMode === 'All' || job.workMode.toLowerCase() === selectedWorkMode.toLowerCase();
        const matchesType =
          selectedType === 'All' || job.employmentType.toLowerCase() === selectedType.toLowerCase();
        const matchesReturnee = !returneeOnly || job.returneeFriendly;

        const matchesCategory =
          selectedCategory === 'All Qualifications' ||
          (job.qualificationCategory &&
            job.qualificationCategory.toLowerCase().includes(selectedCategory.toLowerCase()));

        // If "Only Matching" filter is active, check fit
        if (onlyMatchingQual && effectiveQualification) {
          const fit = calculateQualificationFit(effectiveQualification, job);
          if (!fit.isMatch) return false;
        }

        return matchesSearch && matchesMode && matchesType && matchesReturnee && matchesCategory;
      })
      .map((job) => {
        const fit = calculateQualificationFit(effectiveQualification, job);
        return {
          ...job,
          fit
        };
      })
      .sort((a, b) => b.fit.score - a.fit.score);
  }, [
    jobs,
    searchTerm,
    selectedWorkMode,
    selectedType,
    selectedCategory,
    returneeOnly,
    onlyMatchingQual,
    effectiveQualification
  ]);

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

  const handleSaveQualification = (val: string) => {
    setCustomQualification(val);
    setCandidateQualification(val);
    setIsEditingQual(false);
    if (val.trim()) {
      updateProfile({ education: val.trim() });
      showToast('Qualification Updated', `Matching jobs to "${val.trim()}"`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* ── 1. Qualification Customization & Alert Bar ── */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#4A154B] text-white p-5 sm:p-6 rounded-3xl shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md text-pink-300 border border-white/20 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-300">
                  Target Qualification Matcher
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Live Australian Market
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-0.5">
                Jobs Matched to Your Educational Background
              </h2>
              <p className="text-xs text-purple-200 mt-0.5">
                {effectiveQualification ? (
                  <>
                    Currently showing jobs tailored for:{' '}
                    <strong className="text-white underline decoration-pink-400 decoration-2">
                      {effectiveQualification}
                    </strong>
                  </>
                ) : (
                  'No qualification set yet. Select or enter your degree to filter matching Australian jobs.'
                )}
              </p>
            </div>
          </div>

          {/* Quick Edit Qualification Button & Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsEditingQual(!isEditingQual)}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-pink-300" />
              <span>{isEditingQual ? 'Close Selector' : 'Change Qualification'}</span>
            </button>
            <button
              type="button"
              onClick={() => setOnlyMatchingQual(!onlyMatchingQual)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                onlyMatchingQual
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{onlyMatchingQual ? 'Showing Only Matches' : 'Filter Direct Matches'}</span>
            </button>
          </div>
        </div>

        {/* Inline Qualification Quick Selector */}
        {isEditingQual && (
          <div className="pt-3 border-t border-white/15 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Type your degree (e.g. B.Tech Computer Science, Registered Nurse, B.Com, MBA, Early Childhood...)"
                defaultValue={effectiveQualification}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveQualification((e.target as HTMLInputElement).value);
                }}
                id="custom-qual-input"
                className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/30 text-white text-xs placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('custom-qual-input') as HTMLInputElement;
                  if (input) handleSaveQualification(input.value);
                }}
                className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                Apply Qualification
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-purple-200">Or pick a common qualification:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'B.Tech / Computer Science',
                  'Registered Nurse (AHPRA RN)',
                  'B.Com / Accounting & Finance',
                  'Data Science & Analytics',
                  'Diploma in Early Childhood',
                  'Digital Marketing & Media',
                  'UI/UX & Product Design',
                  'Human Resources / People',
                  'Law & Compliance',
                  'Retail & Operations'
                ].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => handleSaveQualification(sample)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-medium text-purple-100 transition-all cursor-pointer"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 2. Search & Filter Bar ── */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by job title, company name, qualification, or skills (e.g. React, Nursing, Finance)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2.5">
            {/* Qualification Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white cursor-pointer"
            >
              {QUALIFICATION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

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

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 font-bold text-[11px] border border-teal-200">
              🇦🇺 Australian Market (AUD)
            </span>
            <span>
              Showing <strong>{processedJobs.length}</strong> opportunities
            </span>
            {effectiveQualification && (
              <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                Sorted by qualification relevance
              </span>
            )}
          </div>
          <span className="text-[11px] text-teal-700 font-semibold">
            All positions clearly labeled with qualification prerequisites & AUD packages
          </span>
        </div>
      </div>

      {/* ── 3. Job Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {processedJobs.map((job) => {
          const isSaved = savedJobIds.includes(job.jobId);
          const { fit } = job;

          return (
            <div
              key={job.jobId}
              className={`bg-white p-5 rounded-3xl border shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4 ${
                fit.isMatch
                  ? 'border-emerald-200 hover:border-emerald-400 ring-1 ring-emerald-100/50'
                  : 'border-slate-200/90 hover:border-teal-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
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

                {/* Qualification Badge & Required Education */}
                <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-purple-900">
                      <GraduationCap className="w-4 h-4 text-[#4A154B] shrink-0" />
                      <span>Prerequisite Qualification:</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${fit.badgeClass}`}>
                      {fit.badgeText} ({fit.score}%)
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold leading-snug">
                    {job.qualification || 'Bachelor Degree or Equivalent Relevant Experience'}
                  </p>
                  <p className="text-[11px] text-slate-500 italic">{fit.explanation}</p>
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
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">Posted {job.postedDate}</span>
                <div className="flex items-center gap-2">
                  {isJobApplied(job.jobId) ? (
                    <button
                      type="button"
                      disabled
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 font-bold text-xs flex items-center gap-1.5 cursor-default shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Application Sent</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setApplicationModalJob(job)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Review auto-filled application details & submit"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Apply</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleOpenJobModal(job)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                    <span>AI Qualification Match</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 4. AI Job Match & Quick Apply Modal ── */}
      {activeJobModal && (
        <Modal
          isOpen={!!activeJobModal}
          onClose={() => setActiveJobModal(null)}
          title={`Qualification & Role Assessment: ${activeJobModal.title}`}
        >
          <div className="space-y-4 text-slate-800">
            {/* Header info */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{activeJobModal.company}</h4>
                  <p className="text-xs text-slate-500">
                    {activeJobModal.location} • {activeJobModal.workMode}
                  </p>
                </div>
                <span className="font-black text-xs text-teal-800 bg-teal-100 px-2.5 py-1 rounded-lg">
                  {activeJobModal.salaryRange}
                </span>
              </div>
            </div>

            {/* Qualification Comparison Card */}
            <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-purple-900 font-extrabold text-xs">
                <GraduationCap className="w-4 h-4 text-[#4A154B]" />
                <span>Qualification Eligibility Verification</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-white p-3 rounded-xl border border-purple-100">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Your Qualification:</span>
                  <span className="font-extrabold text-slate-900 block mt-0.5">
                    {effectiveQualification || 'General Experience / Any Degree'}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-purple-100">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Employer Requirement:</span>
                  <span className="font-extrabold text-[#4A154B] block mt-0.5">
                    {activeJobModal.qualification || 'Relevant Degree'}
                  </span>
                </div>
              </div>

              {jobMatchResult?.qualificationEligibility && (
                <div className="pt-2 border-t border-purple-100 text-[11px] text-purple-950 font-medium">
                  <strong className="text-emerald-800 font-bold">
                    [{jobMatchResult.qualificationEligibility.status}]:
                  </strong>{' '}
                  {jobMatchResult.qualificationEligibility.details}
                </div>
              )}
            </div>

            {/* AI Match Card */}
            <div className="p-4.5 rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-300" />
                  <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                    Overall Candidate Fit Score
                  </span>
                </div>
                {isMatching ? (
                  <Loader2 className="w-4 h-4 text-teal-300 animate-spin" />
                ) : (
                  <span className="text-lg font-black text-teal-300">
                    {jobMatchResult?.matchPercentage || 90}%
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
                placeholder="Mention why you are enthusiastic about this specific role and your educational alignment..."
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveJobModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              {isJobApplied(activeJobModal.jobId) ? (
                <button
                  type="button"
                  disabled
                  className="px-5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-bold shadow-xs flex items-center gap-2 cursor-default"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Application Sent</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setApplicationModalJob(activeJobModal)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Review Details &amp; Apply</span>
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* ── 5. Review & Auto-Filled Application Submission Modal ── */}
      <JobApplicationModal
        isOpen={!!applicationModalJob}
        onClose={() => setApplicationModalJob(null)}
        job={applicationModalJob}
        onSuccess={() => {
          if (activeJobModal && applicationModalJob && activeJobModal.jobId === applicationModalJob.jobId) {
            setActiveJobModal(null);
          }
        }}
      />
    </div>
  );
};

