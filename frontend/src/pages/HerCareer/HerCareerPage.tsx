import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Bookmark,
  Send,
  FileText,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Download,
  Building,
  MapPin,
  Clock,
  Laptop,
  Check,
  Award,
  ChevronRight,
  TrendingUp,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Modal } from '../../components/common/Modal';
import { StatCard } from '../../components/cards/StatCard';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { ModuleRegistrationGate } from '../../components/common/ModuleRegistrationGate';
import {
  initialJobs,
  initialResumeData,
  interviewQuestions,
  skillGapTargetRoles
} from '../../data/mockData/careerData';
import { Job, ResumeData } from '../../types';

export const HerCareerPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Registration Gate at Starting
  const [isSetupCompleted, setIsSetupCompleted] = useState<boolean>(() => {
    return localStorage.getItem('herrise_career_setup_completed') === 'true';
  });
  const [gateOpen, setGateOpen] = useState<boolean>(() => {
    return localStorage.getItem('herrise_career_setup_completed') !== 'true';
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<'jobs' | 'resume' | 'restart' | 'interview' | 'gap'>('jobs');

  // Jobs state
  const [jobsList, setJobsList] = useState<Job[]>(initialJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [returneeOnly, setReturneeOnly] = useState(false);

  // Resume builder state - dynamically customized to user
  const [resume, setResume] = useState<ResumeData>(() => ({
    ...initialResumeData,
    summary: user?.careerProfile?.targetRole
      ? `Goal-oriented professional targeting ${user.careerProfile.targetRole} roles with proven capability.`
      : initialResumeData.summary,
    personalInfo: {
      ...initialResumeData.personalInfo,
      fullName: user?.name || 'HerRise Member',
      email: user?.email || 'member@herrise.org',
      phone: user?.phone || '+91 98765 43210',
      location: user?.location || 'Bengaluru, India'
    },
    skills: user?.careerProfile?.skills || initialResumeData.skills
  }));
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'minimal' | 'executive'>('modern');

  // Dynamic Readiness Score
  const [readinessScore, setReadinessScore] = useState<number>(user?.careerProfile?.readinessScore || 85);

  const handleGateComplete = (data: any) => {
    setIsSetupCompleted(true);
    setGateOpen(false);
    if (data.readinessScore) setReadinessScore(data.readinessScore);
    if (data.workMode) setSelectedWorkMode(data.workMode);
    setResume((prev) => ({
      ...prev,
      summary: data.targetRole ? `Driven ${data.targetRole} professional with verified competencies.` : prev.summary,
      personalInfo: {
        ...prev.personalInfo,
        fullName: user?.name || prev.personalInfo.fullName,
        email: user?.email || prev.personalInfo.email,
        phone: user?.phone || prev.personalInfo.phone,
        location: user?.location || prev.personalInfo.location
      },
      skills: data.skills || prev.skills
    }));
  };

  // Job Application Modal
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [applyCoverNote, setApplyCoverNote] = useState('');
  const [appliedJobsCount, setAppliedJobsCount] = useState(2);

  // Skill Gap role selector
  const [selectedTargetRole, setSelectedTargetRole] = useState(skillGapTargetRoles[0]);

  // Filters calculation
  const filteredJobs = jobsList.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMode = selectedWorkMode === 'All' || job.workMode === selectedWorkMode;
    const matchesType = selectedType === 'All' || job.employmentType === selectedType;
    const matchesReturnee = !returneeOnly || job.returneeFriendly;

    return matchesSearch && matchesMode && matchesType && matchesReturnee;
  });

  const toggleSaveJob = (id: string) => {
    setJobsList((prev) =>
      prev.map((j) => (j.id === id ? { ...j, isSaved: !j.isSaved } : j))
    );
    const target = jobsList.find((j) => j.id === id);
    if (target?.isSaved) {
      showToast('Removed from Saved Jobs', target.title, 'info');
    } else {
      showToast('Job Saved!', target?.title, 'success');
    }
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForApply) return;
    setJobsList((prev) =>
      prev.map((j) => (j.id === selectedJobForApply.id ? { ...j, hasApplied: true } : j))
    );
    setAppliedJobsCount((prev) => prev + 1);
    setSelectedJobForApply(null);
    setApplyCoverNote('');
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {}
    showToast('Application Submitted!', `Applied to ${selectedJobForApply.company} successfully`, 'success');
  };

  const handlePrintResume = () => {
    showToast('Resume Downloaded', 'Demo PDF generated with your customized template', 'success');
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Dynamic Setup Intake Prompt Banner */}
        {!isSetupCompleted ? (
          <div className="bg-pink-50 border border-pink-200 p-4 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-pink-100 text-[#be185d] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Personalized Career Intake Required</h4>
                <p className="text-xs text-gray-600 leading-relaxed mt-0.5">
                  Complete your registration details, sabbatical context, and target roles to calculate your live Career Readiness Score.
                </p>
              </div>
            </div>
            <button
              onClick={() => setGateOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#4A154B] hover:bg-[#350c36] text-white font-bold text-xs rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-pink-300" />
              <span>Complete Career Registration</span>
            </button>
          </div>
        ) : (
          <div className="bg-purple-50/60 border border-purple-100 px-4 py-2 rounded-2xl flex items-center justify-between text-xs text-purple-900">
            <span>✓ Verified Member Profile Active: <strong>{user?.careerProfile?.targetRole || 'Career Track'}</strong></span>
            <button
              onClick={() => setGateOpen(true)}
              className="font-bold text-[#4A154B] hover:underline cursor-pointer"
            >
              Edit Intake Profile
            </button>
          </div>
        )}

        {/* Top Header Card */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-pink-100 text-[#be185d]">
                <Briefcase className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                HerCareer — Career Acceleration & Returnships
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Find flexible WFH jobs, build your returnship-optimized resume, bridge skill gaps, and interview with authority.
            </p>
          </div>

          {/* Tab Navigation Buttons */}
          <div className="flex flex-wrap gap-1.5 bg-purple-50/70 p-1.5 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'jobs' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              Job Discovery
            </button>
            <button
              onClick={() => setActiveTab('resume')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'resume' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              Resume Builder
            </button>
            <button
              onClick={() => setActiveTab('restart')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'restart' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Career Restart</span>
            </button>
            <button
              onClick={() => setActiveTab('gap')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'gap' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              Skill Gap
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'interview' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              Interview Prep
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Jobs Available"
            value={filteredJobs.length}
            subtitle="Curated female-friendly"
            icon={Briefcase}
            iconColor="text-[#4A154B]"
            bgColor="bg-purple-50"
          />
          <StatCard
            title="Applications Submitted"
            value={appliedJobsCount}
            subtitle="1 In Technical Review"
            icon={Send}
            iconColor="text-emerald-700"
            bgColor="bg-emerald-50"
          />
          <StatCard
            title="Saved Opportunities"
            value={jobsList.filter((j) => j.isSaved).length}
            subtitle="Pinned for later"
            icon={Bookmark}
            iconColor="text-[#be185d]"
            bgColor="bg-pink-50"
          />
          <StatCard
            title="Resume Match Index"
            value={`${readinessScore}%`}
            subtitle={`Target: ${user?.careerProfile?.targetRole || 'Growth Track'}`}
            icon={TrendingUp}
            iconColor="text-indigo-700"
            bgColor="bg-indigo-50"
          />
        </div>

        {/* TAB 1: JOB DISCOVERY */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by role, company, or skill (e.g. React, SQL, Marketing)..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-xs outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto text-xs">
                {/* Work Mode Filter */}
                <select
                  value={selectedWorkMode}
                  onChange={(e) => setSelectedWorkMode(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none cursor-pointer"
                >
                  <option value="All">All Work Modes</option>
                  <option value="Remote">Remote Only (WFH)</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>

                {/* Employment Type */}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none cursor-pointer"
                >
                  <option value="All">All Job Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time (Flexible)</option>
                  <option value="Returnship">Career Returnship</option>
                  <option value="Contract">Contract</option>
                </select>

                {/* Returnee toggle */}
                <button
                  type="button"
                  onClick={() => setReturneeOnly(!returneeOnly)}
                  className={`px-3 py-2 rounded-xl border font-bold transition-all cursor-pointer ${
                    returneeOnly
                      ? 'bg-pink-100 border-pink-300 text-[#be185d]'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  🌸 Returnee Friendly Only
                </button>
              </div>
            </div>

            {/* Jobs Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-2xl flex items-center justify-center border border-purple-100 shadow-2xs">
                          {job.logo}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#4A154B] transition-colors">
                            {job.title}
                          </h3>
                          <span className="text-xs font-semibold text-gray-600">{job.company}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          job.isSaved ? 'text-pink-600 bg-pink-50' : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title={job.isSaved ? 'Unsave Job' : 'Save Job'}
                      >
                        <Bookmark className="w-4 h-4" fill={job.isSaved ? '#db2777' : 'none'} />
                      </button>
                    </div>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap gap-2 text-[11px] mb-3">
                      <span className="bg-purple-50 text-purple-900 font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Laptop className="w-3 h-3 text-[#4A154B]" />
                        {job.workMode}
                      </span>
                      <span className="bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded-full">
                        {job.employmentType}
                      </span>
                      <span className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                        {job.salaryRange}
                      </span>
                      {job.returneeFriendly && (
                        <span className="bg-pink-100 text-[#be185d] font-bold px-2 py-0.5 rounded-full">
                          🌸 Career Returnee Friendly
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                      {job.description}
                    </p>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium bg-gray-50 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Apply Action */}
                  <div className="pt-3 border-t border-purple-50 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">Posted {job.postedDate}</span>

                    {job.hasApplied ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <Check className="w-3.5 h-3.5" />
                        Application Submitted
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedJobForApply(job)}
                        className="bg-[#4A154B] hover:bg-[#350c36] text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Apply Now</span>
                        <Send className="w-3.5 h-3.5 text-pink-300" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: RESUME BUILDER WITH LIVE PREVIEW */}
        {activeTab === 'resume' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive Form Editor (6 cols) */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-6 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Resume Content Editor</h3>
                  <p className="text-xs text-gray-500">Live preview updates automatically on the right</p>
                </div>
                <div className="flex gap-1 text-xs font-semibold">
                  {(['modern', 'minimal', 'executive'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTemplate(t)}
                      className={`px-2.5 py-1 rounded-lg capitalize ${
                        selectedTemplate === t ? 'bg-[#4A154B] text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">1. Contact & Identity</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resume.personalInfo.fullName}
                      onChange={(e) =>
                        setResume({
                          ...resume,
                          personalInfo: { ...resume.personalInfo, fullName: e.target.value }
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Email</label>
                    <input
                      type="email"
                      value={resume.personalInfo.email}
                      onChange={(e) =>
                        setResume({
                          ...resume,
                          personalInfo: { ...resume.personalInfo, email: e.target.value }
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Phone</label>
                    <input
                      type="text"
                      value={resume.personalInfo.phone}
                      onChange={(e) =>
                        setResume({
                          ...resume,
                          personalInfo: { ...resume.personalInfo, phone: e.target.value }
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Location</label>
                    <input
                      type="text"
                      value={resume.personalInfo.location}
                      onChange={(e) =>
                        setResume({
                          ...resume,
                          personalInfo: { ...resume.personalInfo, location: e.target.value }
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none"
                    />
                  </div>
                </div>

                {/* Sabbatical / Career Break Highlight Box */}
                <div className="p-3 bg-pink-50/70 border border-pink-200 rounded-2xl">
                  <label className="text-[11px] font-bold text-[#be185d] block mb-1">
                    🌸 Dedicated Career Sabbatical & Upskilling Statement
                  </label>
                  <textarea
                    rows={2}
                    value={resume.personalInfo.careerBreakReason || ''}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        personalInfo: { ...resume.personalInfo, careerBreakReason: e.target.value }
                      })
                    }
                    className="w-full p-2 text-xs bg-white border border-pink-200 rounded-lg outline-none"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Framing your sabbatical with pride directly builds recruiter trust!
                  </p>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">2. Professional Summary</h4>
                <textarea
                  rows={3}
                  value={resume.summary}
                  onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                  className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none leading-relaxed"
                />
              </div>

              {/* Experience */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">3. Work Experience</h4>
                {resume.experiences.map((exp, idx) => (
                  <div key={exp.id} className="p-3 border border-gray-200 rounded-xl space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...resume.experiences];
                          updated[idx].role = e.target.value;
                          setResume({ ...resume, experiences: updated });
                        }}
                        className="px-2 py-1 text-xs bg-gray-50 border rounded"
                        placeholder="Role Title"
                      />
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...resume.experiences];
                          updated[idx].company = e.target.value;
                          setResume({ ...resume, experiences: updated });
                        }}
                        className="px-2 py-1 text-xs bg-gray-50 border rounded"
                        placeholder="Company"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={exp.description}
                      onChange={(e) => {
                        const updated = [...resume.experiences];
                        updated[idx].description = e.target.value;
                        setResume({ ...resume, experiences: updated });
                      }}
                      className="w-full p-2 text-xs bg-gray-50 border rounded leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Formatted Resume Live Preview Pane (6 cols) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Live Formatted Preview ({selectedTemplate.toUpperCase()} Template)
                </span>
                <button
                  onClick={handlePrintResume}
                  className="flex items-center gap-1.5 bg-[#4A154B] text-white px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-[#350c36] cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-pink-300" />
                  <span>Download / Print</span>
                </button>
              </div>

              {/* Printable Paper Card */}
              <div
                id="resume-printable"
                className={`bg-white rounded-3xl p-8 shadow-xl border border-purple-100 min-h-[700px] text-xs text-gray-800 space-y-5 ${
                  selectedTemplate === 'executive' ? 'border-t-8 border-t-[#3b0764]' : ''
                }`}
              >
                {/* Header */}
                <div className={`pb-4 border-b ${selectedTemplate === 'modern' ? 'border-purple-200' : 'border-gray-200'}`}>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                    {resume.personalInfo.fullName}
                  </h2>
                  <p className="text-xs text-[#4A154B] font-semibold mt-0.5">
                    {resume.personalInfo.location} • {resume.personalInfo.email} • {resume.personalInfo.phone}
                  </p>
                </div>

                {/* Sabbatical Callout if present */}
                {resume.personalInfo.careerBreakReason && (
                  <div className="p-3 bg-purple-50/70 border-l-4 border-[#4A154B] rounded-r-xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A154B] block mb-0.5">
                      Professional Sabbatical & Intentional Upskilling
                    </span>
                    <p className="text-[11px] text-gray-700 leading-relaxed italic">
                      "{resume.personalInfo.careerBreakReason}"
                    </p>
                  </div>
                )}

                {/* Summary */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-purple-900 mb-1 border-b border-purple-50 pb-0.5">
                    Executive Summary
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
                </div>

                {/* Experience */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-purple-900 mb-2 border-b border-purple-50 pb-0.5">
                    Professional Experience
                  </h4>
                  <div className="space-y-3">
                    {resume.experiences.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline font-bold text-gray-900">
                          <span>{exp.role} — <span className="text-[#4A154B] font-semibold">{exp.company}</span></span>
                          <span className="text-[10px] text-gray-500 font-normal">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <p className="text-gray-600 mt-1 leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-purple-900 mb-1.5 border-b border-purple-50 pb-0.5">
                    Core Competencies & Tools
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {resume.skills.map((s, idx) => (
                      <span key={idx} className="bg-purple-50 text-purple-900 font-medium px-2 py-0.5 rounded text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education & Certs */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-purple-900 mb-1.5 border-b border-purple-50 pb-0.5">
                    Education & Certifications
                  </h4>
                  <div className="space-y-1">
                    {resume.education.map((edu) => (
                      <div key={edu.id} className="flex justify-between text-gray-700">
                        <span className="font-semibold">{edu.degree} — {edu.institution}</span>
                        <span className="text-gray-400">{edu.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CAREER RESTART PROGRAMME */}
        {activeTab === 'restart' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#4A154B] to-[#be185d] text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="max-w-2xl space-y-3 relative z-10">
                <span className="text-[11px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full text-pink-200">
                  Specialized Returnship Cohorts
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome Back: Re-entering the Workforce on Your Terms
                </h2>
                <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
                  Career gaps are not deficiencies — they are seasons of life that foster adaptability, crisis management, and empathy. Our partner companies offer 90-day structured returnships with dedicated peer buddies and full-time conversion rates exceeding 88%.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#4A154B] flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-bold text-sm text-gray-900">Dedicated Returnship Search</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Filter for employers explicitly seeking women returning from 1 to 7-year sabbaticals with guaranteed equal pay.
                </p>
                <button
                  onClick={() => {
                    setReturneeOnly(true);
                    setActiveTab('jobs');
                  }}
                  className="text-xs font-bold text-[#4A154B] hover:underline"
                >
                  View Returnship Roles →
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-100 text-[#be185d] flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-bold text-sm text-gray-900">1:1 Returnee Mentor Guidance</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Connect with mentors like Meenakshi Sundaram, who has guided 400+ women through tech and leadership relaunches.
                </p>
                <a href="#network" onClick={() => (window.location.href = '/network')} className="text-xs font-bold text-[#be185d] hover:underline">
                  Book Strategy Session →
                </a>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-bold text-sm text-gray-900">Refresher Skill Bootcamps</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Catch up on modern cloud tools, asynchronous Slack collaboration, and AI productivity in 14 days.
                </p>
                <a href="#learn" onClick={() => (window.location.href = '/learn')} className="text-xs font-bold text-emerald-700 hover:underline">
                  Explore Learning Tracks →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SKILL-GAP ANALYSIS */}
        {activeTab === 'gap' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Target Role Benchmark</h3>
                <p className="text-xs text-gray-500">Compare your current profile with market demands</p>
              </div>

              <div className="space-y-3">
                {skillGapTargetRoles.map((role) => (
                  <div
                    key={role.role}
                    onClick={() => setSelectedTargetRole(role)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedTargetRole.role === role.role
                        ? 'border-[#4A154B] bg-purple-50/50 shadow-xs'
                        : 'border-gray-100 hover:border-purple-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-xs text-gray-900">{role.role}</h4>
                      <span className="font-extrabold text-xs text-[#4A154B]">{role.matchedPercentage}% Match</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#4A154B] h-full rounded-full"
                        style={{ width: `${role.matchedPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Gap Analysis: {selectedTargetRole.role}
                </h3>
                <p className="text-xs text-gray-500">
                  Your profile fulfills {selectedTargetRole.matchedPercentage}% of top industry requirements.
                </p>
              </div>

              {/* Owned Skills */}
              <div>
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Skills You Already Possess
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTargetRole.ownedSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-semibold"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div>
                <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-rose-600" />
                  High-Impact Skills to Acquire (Bridging the Gap)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTargetRole.missingSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 rounded-xl text-xs font-semibold"
                    >
                      + {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs text-[#4A154B]">Fast-Track Course Recommendation</h5>
                  <p className="text-[11px] text-gray-600">Close this skill gap with a certified 4-hour module.</p>
                </div>
                <button
                  onClick={() => (window.location.href = '/learn')}
                  className="bg-[#4A154B] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#350c36] cursor-pointer"
                >
                  Start Course →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: INTERVIEW PREPARATION */}
        {activeTab === 'interview' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
              <div className="pb-3 border-b border-purple-50 mb-4">
                <h3 className="text-base font-bold text-gray-900">STAR-Method Interview Master Guide</h3>
                <p className="text-xs text-gray-500">
                  Proven sample answers for answering career gaps and high-stakes behavioral questions.
                </p>
              </div>

              <div className="space-y-4">
                {interviewQuestions.map((q) => (
                  <div key={q.id} className="p-5 rounded-2xl border border-purple-100 bg-[#faf9fd] space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full">
                        {q.category} Question
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-gray-900 leading-snug">
                      "{q.question}"
                    </h4>

                    <div className="bg-white p-4 rounded-xl border border-purple-100 text-xs text-gray-700 leading-relaxed space-y-2">
                      <span className="font-bold text-[#4A154B] block">Recommended Answer Framework:</span>
                      <p className="italic">{q.recommendedAnswer}</p>
                    </div>

                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-gray-700 text-[11px]">Key Delivery Tips:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-gray-600 text-[11px]">
                        {q.keyTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Job Application Confirmation */}
      {selectedJobForApply && (
        <Modal
          isOpen={!!selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          title={`Apply to ${selectedJobForApply.title}`}
          subtitle={`Company: ${selectedJobForApply.company} • ${selectedJobForApply.location}`}
        >
          <form onSubmit={handleApply} className="space-y-4">
            <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100 text-xs text-purple-950">
              <span className="font-bold">Attaching Your Saved Resume:</span>
              <p className="text-[11px] text-gray-600 mt-0.5">
                {resume.personalInfo.fullName} • {selectedTemplate.toUpperCase()} Template with Career Sabbatical Note.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Short Cover Note / Why You are a Great Fit
              </label>
              <textarea
                rows={3}
                required
                value={applyCoverNote}
                onChange={(e) => setApplyCoverNote(e.target.value)}
                placeholder="Highlight your relevant experience, excitement for the company mission, and readiness..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#4A154B]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#4A154B] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#350c36] cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-pink-300" />
              <span>Submit Demo Application</span>
            </button>
          </form>
        </Modal>
      )}

      {/* Module Registration Gate at Starting */}
      <ModuleRegistrationGate
        module="career"
        isOpen={gateOpen}
        onClose={() => setGateOpen(false)}
        onComplete={handleGateComplete}
      />
    </DashboardLayout>
  );
};

