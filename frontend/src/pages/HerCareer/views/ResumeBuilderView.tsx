import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
  Eye,
  Edit3,
  Layers,
  ArrowRight,
  Loader2,
  Globe,
  Mail,
  Phone,
  MapPin,
  FileDown
} from 'lucide-react';
import { useHerCareer, isProjectEntry, separateExperienceAndProjects } from '../../../context/HerCareerContext';
import { useToast } from '../../../context/ToastContext';
import { ResumeData } from '../../../types/career';
import { downloadAtsPdf, downloadAtsWord, AtsResumeData } from '../../../services/resumeExportService';

export const ResumeBuilderView: React.FC = () => {
  const {
    activeResume,
    setActiveResume,
    resumes,
    saveResumeData,
    aiEnhanceBullet,
    aiSuggestSkillsForRole,
    aiGenerateSummaries,
    profile
  } = useHerCareer();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isPolishing, setIsPolishing] = useState<string | null>(null);
  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Auto-separate any projects that are mistakenly in the experience column and move them to projects
  React.useEffect(() => {
    if (activeResume?.experience && activeResume.experience.some(isProjectEntry)) {
      const cleaned = separateExperienceAndProjects(activeResume);
      setActiveResume(cleaned);
      saveResumeData(cleaned);
      showToast('Projects Moved', 'Removed projects from Experience column and added them to Projects column', 'success');
    }
  }, [activeResume?.experience]);

  // New item inputs
  const [newSkill, setNewSkill] = useState('');
  const [newSoftSkill, setNewSoftSkill] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  // Handle saving
  const handleSave = async () => {
    await saveResumeData(activeResume);
  };

  // Convert active resume to AtsResumeData payload for PDF & Word export
  const getExportPayload = (): AtsResumeData => ({
    fullName: activeResume.personalInfo.fullName,
    email: activeResume.personalInfo.email,
    phone: activeResume.personalInfo.phone,
    location: activeResume.personalInfo.location,
    linkedin: activeResume.personalInfo.linkedinUrl,
    portfolio: activeResume.personalInfo.portfolioUrl,
    headline: activeResume.title,
    summary: activeResume.summary,
    skills: activeResume.skills.technical,
    experience: (activeResume.experience || []).map((e) => ({
      role: e.title,
      company: e.company,
      location: e.location || 'India',
      duration: `${e.startDate} - ${e.current ? 'Present' : e.endDate}`,
      bullets: e.highlights
    })),
    projects: (activeResume.projects || []).map((p) => ({
      title: p.title,
      role: p.role || 'Full Stack Developer',
      technologies: p.technologies,
      link: p.link,
      description: p.description,
      highlights: p.highlights
    })),
    education: activeResume.education.map((edu) => ({
      degree: edu.degree,
      institution: edu.institution,
      year: edu.year,
      grade: edu.grade
    })),
    certifications: activeResume.certifications.map((c) => c.name),
    achievements: activeResume.achievements,
    languages: activeResume.languages
  });

  const handleDownloadPdf = () => {
    downloadAtsPdf(getExportPayload());
    showToast('PDF Exported', 'Clean single-column ATS format downloaded', 'success');
  };

  const handleDownloadWord = () => {
    downloadAtsWord(getExportPayload());
    showToast('Word Document Exported', 'Editable .docx file generated', 'success');
  };

  // AI Polish a specific bullet point for experience
  const handlePolishBullet = async (expId: string, bulletIndex: number, currentText: string) => {
    setIsPolishing(`${expId}-${bulletIndex}`);
    try {
      const suggestions = await aiEnhanceBullet(currentText, activeResume.title);
      if (suggestions && suggestions.length > 0) {
        const nextExp = activeResume.experience.map((exp) => {
          if (exp.id === expId) {
            const nextHighlights = [...exp.highlights];
            nextHighlights[bulletIndex] = suggestions[0];
            return { ...exp, highlights: nextHighlights };
          }
          return exp;
        });
        setActiveResume({ ...activeResume, experience: nextExp });
        showToast('AI Bullet Enhanced! ✨', 'Updated with quantifiable impact metrics', 'success');
      }
    } finally {
      setIsPolishing(null);
    }
  };

  // AI Polish a specific bullet point for projects
  const handlePolishProjectBullet = async (projId: string, bulletIndex: number, currentText: string) => {
    setIsPolishing(`proj-${projId}-${bulletIndex}`);
    try {
      const suggestions = await aiEnhanceBullet(currentText, activeResume.title);
      if (suggestions && suggestions.length > 0) {
        const nextProjects = (activeResume.projects || []).map((proj) => {
          if (proj.id === projId) {
            const nextHighlights = [...(proj.highlights || [])];
            nextHighlights[bulletIndex] = suggestions[0];
            return { ...proj, highlights: nextHighlights };
          }
          return proj;
        });
        setActiveResume({ ...activeResume, projects: nextProjects });
        showToast('AI Project Highlight Enhanced! ✨', 'Updated with quantifiable technical achievements', 'success');
      }
    } finally {
      setIsPolishing(null);
    }
  };

  // AI Suggest Skills
  const handleAutoSuggestSkills = async () => {
    setIsSuggestingSkills(true);
    try {
      const suggested = await aiSuggestSkillsForRole(profile.targetRole);
      if (suggested) {
        const combinedTech = Array.from(new Set([...activeResume.skills.technical, ...suggested.technical]));
        const combinedSoft = Array.from(new Set([...activeResume.skills.soft, ...suggested.soft]));
        setActiveResume({
          ...activeResume,
          skills: {
            ...activeResume.skills,
            technical: combinedTech,
            soft: combinedSoft
          }
        });
        showToast('Skills Injected! 🎯', `Added in-demand skills for ${profile.targetRole}`, 'success');
      }
    } finally {
      setIsSuggestingSkills(false);
    }
  };

  // AI Generate Summary
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const summaries = await aiGenerateSummaries({
        headline: activeResume.title,
        targetRole: profile.targetRole,
        skills: activeResume.skills.technical,
        experienceYears: profile.yearsOfExperience
      });
      if (summaries && summaries.length > 0) {
        setActiveResume({ ...activeResume, summary: summaries[0] });
        showToast('Summary Generated! ✍️', 'Applied high-impact executive summary', 'success');
      }
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#0f172a] text-teal-300">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900">{activeResume.title}</h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                Score: {activeResume.qualityScore || 90}/100
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Template: <span className="font-semibold capitalize text-slate-700">{activeResume.template}</span> • Multiple versions supported
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Editor / Preview Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'editor' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Form</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="px-3.5 py-2 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-teal-300" />
            <span>PDF</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadWord}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <FileDown className="w-4 h-4 text-blue-600" />
            <span>Word</span>
          </button>
        </div>
      </div>

      {/* Template Chooser Bar */}
      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
        <span className="font-bold text-slate-600">Choose Layout Template:</span>
        <div className="flex gap-2">
          {(['modern', 'minimal', 'executive'] as const).map((tmpl) => (
            <button
              key={tmpl}
              type="button"
              onClick={() => setActiveResume({ ...activeResume, template: tmpl })}
              className={`px-3 py-1 rounded-lg font-bold transition-all capitalize cursor-pointer ${activeResume.template === tmpl
                  ? 'bg-[#0f172a] text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
            >
              {tmpl}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'editor' ? (
        /* ==================== EDITOR MODE ==================== */
        <div className="space-y-6">
          {/* Section 1: Contact Information */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
              1. Contact & Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={activeResume.personalInfo.fullName}
                  onChange={(e) =>
                    setActiveResume({
                      ...activeResume,
                      personalInfo: { ...activeResume.personalInfo, fullName: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={activeResume.personalInfo.email}
                  onChange={(e) =>
                    setActiveResume({
                      ...activeResume,
                      personalInfo: { ...activeResume.personalInfo, email: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={activeResume.personalInfo.phone}
                  onChange={(e) =>
                    setActiveResume({
                      ...activeResume,
                      personalInfo: { ...activeResume.personalInfo, phone: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={activeResume.personalInfo.location}
                  onChange={(e) =>
                    setActiveResume({
                      ...activeResume,
                      personalInfo: { ...activeResume.personalInfo, location: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={activeResume.personalInfo.linkedinUrl || ''}
                  onChange={(e) =>
                    setActiveResume({
                      ...activeResume,
                      personalInfo: { ...activeResume.personalInfo, linkedinUrl: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">GitHub URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={activeResume.personalInfo.githubUrl || ''}
                  onChange={(e) =>
                    setActiveResume({
                      ...activeResume,
                      personalInfo: { ...activeResume.personalInfo, githubUrl: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Portfolio Website</label>
                <input
                  type="url"
                  placeholder="https://myportfolio.io"
                  value={activeResume.personalInfo.portfolioUrl || ''}
                  onChange={(e) =>
                    setActiveResume({
                      ...activeResume,
                      personalInfo: { ...activeResume.personalInfo, portfolioUrl: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Professional Summary */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-sm text-slate-900">2. Professional Summary</h3>
              <button
                type="button"
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary}
                className="px-3 py-1 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isGeneratingSummary ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                )}
                <span>Generate with AI</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={activeResume.summary}
              onChange={(e) => setActiveResume({ ...activeResume, summary: e.target.value })}
              placeholder="A 3-4 sentence summary highlighting your core skills, years of experience, and quantifiable value delivered."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Section 3: Work Experience with AI Bullet Enhancer */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-2 gap-2">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">3. Work Experience</h3>
                <p className="text-xs text-slate-500">Corporate roles, faculty/trainer jobs, or formal internships (optional for freshers)</p>
              </div>
              <div className="flex items-center gap-2">
                {activeResume.experience.some(isProjectEntry) && (
                  <button
                    type="button"
                    onClick={() => {
                      const cleaned = separateExperienceAndProjects(activeResume);
                      setActiveResume(cleaned);
                      saveResumeData(cleaned);
                      showToast('Projects Organized', 'Removed projects from Experience column and added them to Projects column', 'success');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-teal-100 hover:bg-teal-200 text-teal-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                    <span>Move Projects to Projects Column</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setActiveResume({
                      ...activeResume,
                      experience: [
                        ...activeResume.experience,
                        {
                          id: `exp-${Date.now()}`,
                          title: 'Software Developer',
                          company: 'Company Name',
                          startDate: '2024-01',
                          endDate: 'Present',
                          current: true,
                          description: 'Key deliverables and team collaboration.',
                          highlights: ['Delivered core features on time with high code quality.']
                        }
                      ]
                    })
                  }
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Position</span>
                </button>
              </div>
            </div>

            {activeResume.experience.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                <p className="text-xs text-slate-500">
                  No corporate work history listed — your technical projects below will be showcased as your primary proof of work.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {activeResume.experience.map((exp, expIdx) => (
                  <div key={exp.id} className="p-4.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-600">Position #{expIdx + 1}</span>
                      <div className="flex items-center gap-2">
                        {isProjectEntry(exp) && (
                          <button
                            type="button"
                            onClick={() => {
                              const updatedProjects = [
                                ...(activeResume.projects || []),
                                {
                                  id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                                  title: exp.title.replace(/^Project:\s*/i, '').replace(/Interactive Rot/i, 'Interactive Robot').trim(),
                                  role: 'Full Stack Developer',
                                  technologies: exp.company
                                    ? exp.company.replace(/\s*Project\s*/i, '').split(/[,|/&]/).map((s) => s.trim()).filter(Boolean)
                                    : ['React.js', 'Node.js'],
                                  link: '',
                                  description: exp.description || (exp.highlights && exp.highlights[0]) || '',
                                  highlights: exp.highlights || []
                                }
                              ];
                              const updatedExperience = activeResume.experience.filter((e) => e.id !== exp.id);
                              const cleaned = { ...activeResume, experience: updatedExperience, projects: updatedProjects };
                              setActiveResume(cleaned);
                              saveResumeData(cleaned);
                              showToast('Moved to Projects Column', `Moved "${exp.title}" to Key Projects section`, 'success');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-teal-100 hover:bg-teal-200 text-teal-800 font-bold text-[11px] cursor-pointer"
                          >
                            Move to Projects Column →
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setActiveResume({
                              ...activeResume,
                              experience: activeResume.experience.filter((e) => e.id !== exp.id)
                            })
                          }
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="Delete position"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={exp.title}
                        onChange={(e) => {
                          const updated = [...activeResume.experience];
                          updated[expIdx].title = e.target.value;
                          setActiveResume({ ...activeResume, experience: updated });
                        }}
                        className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...activeResume.experience];
                          updated[expIdx].company = e.target.value;
                          setActiveResume({ ...activeResume, experience: updated });
                        }}
                        className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Start (e.g. 2026-07)"
                        value={exp.startDate}
                        onChange={(e) => {
                          const updated = [...activeResume.experience];
                          updated[expIdx].startDate = e.target.value;
                          setActiveResume({ ...activeResume, experience: updated });
                        }}
                        className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="End (or Present)"
                        value={exp.endDate}
                        onChange={(e) => {
                          const updated = [...activeResume.experience];
                          updated[expIdx].endDate = e.target.value;
                          setActiveResume({ ...activeResume, experience: updated });
                        }}
                        className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                      />
                    </div>

                    {/* Bullet points */}
                    <div className="space-y-2 pt-1">
                      <label className="block text-[11px] font-bold text-slate-600">
                        Achievement-Oriented Highlights:
                      </label>
                      {exp.highlights.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => {
                              const updated = [...activeResume.experience];
                              updated[expIdx].highlights[bIdx] = e.target.value;
                              setActiveResume({ ...activeResume, experience: updated });
                            }}
                            className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handlePolishBullet(exp.id, bIdx, bullet)}
                            disabled={isPolishing === `${exp.id}-${bIdx}`}
                            className="px-2.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 disabled:opacity-60"
                          >
                            {isPolishing === `${exp.id}-${bIdx}` ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Sparkles className="w-3 h-3 text-teal-600" />
                            )}
                            <span>AI Polish</span>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...activeResume.experience];
                          updated[expIdx].highlights.push('Contributed to core deliverables and team initiatives.');
                          setActiveResume({ ...activeResume, experience: updated });
                        }}
                        className="text-[11px] font-bold text-teal-700 hover:underline cursor-pointer"
                      >
                        + Add another bullet point
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Key Technical & Portfolio Projects (Strictly Separated from Work Experience) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">4. Key Technical & Portfolio Projects</h3>
                <p className="text-xs text-slate-500">Software platforms, web applications, personal projects, or open-source repositories</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setActiveResume({
                    ...activeResume,
                    projects: [
                      ...(activeResume.projects || []),
                      {
                        id: `proj-${Date.now()}`,
                        title: 'New Technical Project',
                        role: 'Full Stack Developer',
                        technologies: ['React.js', 'Node.js', 'MongoDB'],
                        link: '',
                        description: 'Full stack responsive application with secure REST APIs and database integration.',
                        highlights: ['Architected core responsive UI components and state management.']
                      }
                    ]
                  })
                }
                className="px-3 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            {(!activeResume.projects || activeResume.projects.length === 0) ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                <p className="text-xs text-slate-500">No projects added yet. Click "+ Add Project" to highlight your portfolio.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {activeResume.projects.map((proj, projIdx) => (
                  <div key={proj.id} className="p-4.5 rounded-2xl bg-teal-50/30 border border-teal-200/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-teal-900">Project #{projIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveResume({
                            ...activeResume,
                            projects: activeResume.projects.filter((p) => p.id !== proj.id)
                          })
                        }
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Project Title (e.g. AuraEstate)"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...(activeResume.projects || [])];
                          updated[projIdx].title = e.target.value;
                          setActiveResume({ ...activeResume, projects: updated });
                        }}
                        className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-teal-600 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Role (e.g. Full Stack Developer)"
                        value={proj.role || ''}
                        onChange={(e) => {
                          const updated = [...(activeResume.projects || [])];
                          updated[projIdx].role = e.target.value;
                          setActiveResume({ ...activeResume, projects: updated });
                        }}
                        className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:border-teal-600 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Technologies (comma separated)"
                        value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies || ''}
                        onChange={(e) => {
                          const updated = [...(activeResume.projects || [])];
                          updated[projIdx].technologies = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                          setActiveResume({ ...activeResume, projects: updated });
                        }}
                        className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-teal-800 font-medium focus:border-teal-600 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <input
                        type="text"
                        placeholder="Live / GitHub Link (optional)"
                        value={proj.link || ''}
                        onChange={(e) => {
                          const updated = [...(activeResume.projects || [])];
                          updated[projIdx].link = e.target.value;
                          setActiveResume({ ...activeResume, projects: updated });
                        }}
                        className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-blue-600 focus:border-blue-600 focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        placeholder="Project overview & architecture..."
                        value={proj.description || ''}
                        onChange={(e) => {
                          const updated = [...(activeResume.projects || [])];
                          updated[projIdx].description = e.target.value;
                          setActiveResume({ ...activeResume, projects: updated });
                        }}
                        className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 focus:border-teal-600 focus:outline-none"
                      />
                    </div>

                    {/* Bullet points */}
                    <div className="space-y-2 pt-1">
                      <label className="block text-[11px] font-bold text-slate-600">
                        Feature Deliverables & Technical Highlights:
                      </label>
                      {(proj.highlights || []).map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => {
                              const updated = [...(activeResume.projects || [])];
                              const hl = [...(updated[projIdx].highlights || [])];
                              hl[bIdx] = e.target.value;
                              updated[projIdx].highlights = hl;
                              setActiveResume({ ...activeResume, projects: updated });
                            }}
                            className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handlePolishProjectBullet(proj.id, bIdx, bullet)}
                            disabled={isPolishing === `proj-${proj.id}-${bIdx}`}
                            className="px-2.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 disabled:opacity-60"
                          >
                            {isPolishing === `proj-${proj.id}-${bIdx}` ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Sparkles className="w-3 h-3 text-teal-600" />
                            )}
                            <span>AI Polish</span>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(activeResume.projects || [])];
                          const hl = [...(updated[projIdx].highlights || [])];
                          hl.push('Engineered modular features and ensured clean code architecture.');
                          updated[projIdx].highlights = hl;
                          setActiveResume({ ...activeResume, projects: updated });
                        }}
                        className="text-[11px] font-bold text-teal-700 hover:underline cursor-pointer"
                      >
                        + Add another project highlight
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Skills (Technical & Soft) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">5. Skills & Competencies</h3>
                <p className="text-xs text-slate-500">Keywords directly impact ATS resume ranking scores</p>
              </div>
              <button
                type="button"
                onClick={handleAutoSuggestSkills}
                disabled={isSuggestingSkills}
                className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isSuggestingSkills ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                )}
                <span>Suggest Skills with AI</span>
              </button>
            </div>

            {/* Technical Skills */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Technical Skills:</label>
              <div className="flex flex-wrap gap-2">
                {activeResume.skills.technical.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveResume({
                          ...activeResume,
                          skills: {
                            ...activeResume.skills,
                            technical: activeResume.skills.technical.filter((_, i) => i !== sIdx)
                          }
                        })
                      }
                      className="text-slate-400 hover:text-rose-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 max-w-sm pt-1">
                <input
                  type="text"
                  placeholder="e.g. Next.js, GraphQL, Docker"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newSkill.trim()) {
                      e.preventDefault();
                      setActiveResume({
                        ...activeResume,
                        skills: {
                          ...activeResume.skills,
                          technical: [...activeResume.skills.technical, newSkill.trim()]
                        }
                      });
                      setNewSkill('');
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newSkill.trim()) {
                      setActiveResume({
                        ...activeResume,
                        skills: {
                          ...activeResume.skills,
                          technical: [...activeResume.skills.technical, newSkill.trim()]
                        }
                      });
                      setNewSkill('');
                    }
                  }}
                  className="px-3 py-1.5 bg-[#0f172a] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Soft Skills */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700">Soft Skills & Leadership:</label>
              <div className="flex flex-wrap gap-2">
                {activeResume.skills.soft.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50 text-teal-800 text-xs font-semibold"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveResume({
                          ...activeResume,
                          skills: {
                            ...activeResume.skills,
                            soft: activeResume.skills.soft.filter((_, i) => i !== sIdx)
                          }
                        })
                      }
                      className="text-teal-400 hover:text-rose-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 6: Education */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
              6. Education
            </h3>

            {activeResume.education.map((edu, eduIdx) => (
              <div key={edu.id} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Degree (e.g. Master of Computer Applications)"
                  value={edu.degree}
                  onChange={(e) => {
                    const nextEdu = [...activeResume.education];
                    nextEdu[eduIdx].degree = e.target.value;
                    setActiveResume({ ...activeResume, education: nextEdu });
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:col-span-2 font-bold"
                />
                <input
                  type="text"
                  placeholder="Institution / University"
                  value={edu.institution}
                  onChange={(e) => {
                    const nextEdu = [...activeResume.education];
                    nextEdu[eduIdx].institution = e.target.value;
                    setActiveResume({ ...activeResume, education: nextEdu });
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
                <input
                  type="text"
                  placeholder="Year (e.g. 2024 – 2026)"
                  value={edu.year}
                  onChange={(e) => {
                    const nextEdu = [...activeResume.education];
                    nextEdu[eduIdx].year = e.target.value;
                    setActiveResume({ ...activeResume, education: nextEdu });
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            ))}
          </div>

          {/* Section 7: Certifications & Key Achievements */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-sm text-slate-900">
                7. Certifications, Internships & Achievements
              </h3>
            </div>

            {/* Certifications list */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Certifications & Micro-Internships:</label>
              {(activeResume.certifications || []).map((c, cIdx) => (
                <div key={c.id || cIdx} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-medium text-slate-800">{c.name} ({c.issuer})</span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextC = activeResume.certifications.filter((_, idx) => idx !== cIdx);
                      setActiveResume({ ...activeResume, certifications: nextC });
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Achievements list */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700">Key Achievements & Research Publications:</label>
              {(activeResume.achievements || []).map((ach, aIdx) => (
                <div key={aIdx} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-teal-50/40 border border-teal-200/60 text-xs">
                  <span className="text-slate-700">{ach}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextA = activeResume.achievements.filter((_, idx) => idx !== aIdx);
                      setActiveResume({ ...activeResume, achievements: nextA });
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ==================== LIVE PREVIEW MODE ==================== */
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-lg max-w-4xl mx-auto space-y-6 text-slate-800">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 space-y-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
              {activeResume.personalInfo.fullName}
            </h1>
            <p className="text-sm font-bold text-teal-800">{activeResume.title}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600 pt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {activeResume.personalInfo.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {activeResume.personalInfo.phone}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {activeResume.personalInfo.location}
              </span>
              {activeResume.personalInfo.linkedinUrl && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  LinkedIn
                </span>
              )}
              {activeResume.personalInfo.githubUrl && (
                <a
                  href={activeResume.personalInfo.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-teal-700 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5 text-teal-600" />
                  GitHub
                </a>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {activeResume.summary && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                Professional Summary
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">{activeResume.summary}</p>
            </div>
          )}

          {/* Work Experience (Rendered only if actual corporate employment records exist) */}
          {activeResume.experience && activeResume.experience.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>Work Experience</span>
                <span className="text-[10px] text-slate-500 font-normal lowercase">({activeResume.experience.length} formal roles)</span>
              </h3>
              {activeResume.experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-slate-900">
                      {exp.title} • <span className="font-medium text-slate-700">{exp.company}</span>
                      {exp.location ? <span className="font-normal text-slate-500 text-[11px]"> ({exp.location})</span> : null}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pl-1">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Key Technical & Portfolio Projects (Cleanly Separated from Work Experience) */}
          {activeResume.projects && activeResume.projects.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-teal-900 border-b border-teal-200 pb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Key Technical & Portfolio Projects</span>
                </span>
                <span className="text-[10px] text-teal-700 font-semibold lowercase">
                  ({activeResume.projects.length} verified projects)
                </span>
              </h3>
              {activeResume.projects.map((proj) => (
                <div key={proj.id} className="space-y-1.5">
                  <div className="flex flex-wrap justify-between items-baseline text-xs gap-2">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{proj.title}</span>
                      {proj.role && <span className="font-normal text-slate-500">({proj.role})</span>}
                    </div>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Globe className="w-3 h-3" />
                        <span>Live / Source Code</span>
                      </a>
                    )}
                  </div>

                  {/* Tech stack badge list */}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {(Array.isArray(proj.technologies) ? proj.technologies : [proj.technologies]).map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200/60"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {proj.description && (
                    <p className="text-xs text-slate-700 leading-relaxed">{proj.description}</p>
                  )}

                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pl-1">
                      {proj.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              Skills & Proficiencies
            </h3>
            <div className="text-xs text-slate-700 space-y-1">
              <div>
                <strong className="text-slate-900">Technical: </strong>
                {activeResume.skills.technical.join(', ')}
              </div>
              <div>
                <strong className="text-slate-900">Soft Skills & Leadership: </strong>
                {activeResume.skills.soft.join(', ')}
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              Education & Credentials
            </h3>
            {activeResume.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs">
                <span className="font-bold text-slate-900">
                  {edu.degree} – <span className="font-normal text-slate-700">{edu.institution}</span>
                  {edu.grade ? <span className="text-slate-500 font-normal"> | {edu.grade}</span> : null}
                </span>
                <span className="text-slate-500 font-semibold">{edu.year}</span>
              </div>
            ))}
          </div>

          {/* Certifications (if any) */}
          {activeResume.certifications && activeResume.certifications.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                Certifications & Internships
              </h3>
              <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-600 pl-1">
                {activeResume.certifications.map((c, i) => (
                  <li key={i}>
                    <strong className="text-slate-800">{c.name}</strong> – {c.issuer} ({c.date})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Achievements & Research (if any) */}
          {activeResume.achievements && activeResume.achievements.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                Key Achievements & Research
              </h3>
              <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-600 pl-1">
                {activeResume.achievements.map((ach, i) => (
                  <li key={i} className="text-slate-700">{ach}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
