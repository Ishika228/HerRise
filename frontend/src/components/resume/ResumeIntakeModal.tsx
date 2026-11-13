import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Download,
  Plus,
  Trash2,
  ArrowRight,
  RefreshCw,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Wand2,
  FileDown,
  Layers,
  ChevronDown
} from 'lucide-react';
import { AtsResumeData, downloadAtsPdf, downloadAtsWord } from '../../services/resumeExportService';
import { useToast } from '../../context/ToastContext';
import { isProjectEntry } from '../../context/HerCareerContext';
import { API_BASE } from '../../config/api';

interface ResumeIntakeModalProps {
  initialName?: string;
  initialEmail?: string;
  initialPhone?: string;
  initialLocation?: string;
  onComplete: (resume: AtsResumeData) => void;
  onSkip?: () => void;
}

export const ResumeIntakeModal: React.FC<ResumeIntakeModalProps> = ({
  initialName = '',
  initialEmail = '',
  initialPhone = '',
  initialLocation = '',
  onComplete,
  onSkip
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'upload' | 'create'>('upload');

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState('');
  const [showPasteText, setShowPasteText] = useState(false);
  const [pastedText, setPastedText] = useState('');

  // Structured Resume State
  const [resumeData, setResumeData] = useState<AtsResumeData>({
    fullName: initialName,
    email: initialEmail,
    phone: initialPhone,
    location: initialLocation,
    headline: '',
    summary: '',
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    languages: ['English']
  });

  // Missing fields flagged by AI or validator
  const [missingFields, setMissingFields] = useState<Array<{ field: string; label: string; reason: string }>>([]);

  // Create Mode Step Tracking
  const [createStep, setCreateStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiSummaryOptions, setAiSummaryOptions] = useState<string[]>([]);
  const [isReturnee, setIsReturnee] = useState(false);

  // Recommended skill presets
  const popularSkills = [
    'React.js', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB',
    'HTML', 'CSS', 'Tailwind CSS', 'TypeScript', 'Git', 'Project Management',
    'Financial Modeling', 'Data Analysis', 'Digital Marketing', 'Content Strategy'
  ];

  // -------------------------------------------------------------
  // TAB 1: RESUME UPLOAD & AI PARSING
  // -------------------------------------------------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleParseResume = async () => {
    if (!selectedFile && !pastedText.trim()) {
      showToast('Input Required', 'Please select a resume file or paste your resume text.', 'warning');
      return;
    }

    setIsParsing(true);
    setParseProgress('Uploading document...');

    try {
      let response: Response;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('resume', selectedFile);
        setParseProgress('Groq AI scanning resume & extracting ATS structure...');
        response = await fetch(`${API_BASE}/api/career/parse-resume`, {
          method: 'POST',
          body: formData
        });
      } else {
        setParseProgress('Groq AI parsing resume text...');
        response = await fetch(`${API_BASE}/api/career/parse-resume`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: pastedText })
        });
      }

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with HTTP ${response.status}`);
      }

      const json = await response.json();

      if (json.success && json.parsed) {
        const p = json.parsed;
        const rawParsedExp = Array.isArray(p.experience) ? p.experience : [];
        const rawParsedProj = Array.isArray(p.projects) ? p.projects : [];

        const cleanExp = rawParsedExp.filter((e: any) => !isProjectEntry(e));
        const extraProjects = rawParsedExp.filter((e: any) => isProjectEntry(e));

        const updated: AtsResumeData = {
          fullName: p.fullName || initialName || resumeData.fullName,
          email: p.email || initialEmail || resumeData.email,
          phone: p.phone || initialPhone || resumeData.phone,
          location: p.location || initialLocation || resumeData.location,
          headline: p.headline || 'Professional Specialist',
          summary: p.summary || '',
          skills: Array.isArray(p.skills) ? p.skills : [],
          experience: cleanExp.map((exp: any) => ({
            role: exp.role || exp.title || 'Role',
            company: exp.company || 'Organization',
            location: exp.location || '',
            duration: exp.duration || 'Recent',
            bullets: Array.isArray(exp.bullets || exp.highlights) ? exp.bullets || exp.highlights : []
          })),
          projects: [
            ...rawParsedProj.map((proj: any) => ({
              title: proj.title || 'Technical Project',
              role: proj.role || 'Full Stack Developer',
              technologies: Array.isArray(proj.technologies)
                ? proj.technologies.join(', ')
                : proj.technologies || '',
              link: proj.link || '',
              description: proj.description || '',
              highlights: Array.isArray(proj.highlights || proj.bullets)
                ? proj.highlights || proj.bullets
                : []
            })),
            ...extraProjects.map((e: any) => ({
              title: (e.role || e.title || 'Technical Project')
                .replace(/^Project:\s*/i, '')
                .trim(),
              role: e.role || 'Contributor',
              technologies: (e.company || '').replace(/\s*Project\s*/i, '').trim(),
              link: '',
              description: e.description || (e.bullets && e.bullets[0]) || '',
              highlights: Array.isArray(e.bullets || e.highlights) ? e.bullets || e.highlights : []
            }))
          ],
          education: Array.isArray(p.education)
            ? p.education.map((edu: any) => ({
              degree: edu.degree || 'Degree',
              institution: edu.institution || 'University',
              year: edu.year || '',
              grade: edu.grade || ''
            }))
            : [],
          certifications: Array.isArray(p.certifications)
            ? p.certifications.map((c: any) => (typeof c === 'string' ? c : c.name || 'Certification'))
            : [],
          achievements: Array.isArray(p.achievements) ? p.achievements : [],
          languages: Array.isArray(p.languages) && p.languages.length > 0 ? p.languages : ['English']
        };

        setResumeData(updated);

        // Detect genuinely missing key fields
        const detectedMissing: Array<{ field: string; label: string; reason: string }> = [];
        if (!updated.phone || updated.phone.trim().length < 6) {
          detectedMissing.push({
            field: 'phone',
            label: 'Phone Number',
            reason: 'Recruiters and automated screeners require a mobile contact number.'
          });
        }
        if (!updated.location || updated.location.trim().length < 2) {
          detectedMissing.push({
            field: 'location',
            label: 'City & State',
            reason: 'Helps match location-based and remote job filters.'
          });
        }
        if (!updated.headline || updated.headline.trim().length < 2) {
          detectedMissing.push({
            field: 'headline',
            label: 'Target Job Title / Headline',
            reason: 'ATS algorithms score relevancy against job titles.'
          });
        }
        if (!updated.summary || updated.summary.trim().length < 20) {
          detectedMissing.push({
            field: 'summary',
            label: 'Professional Summary',
            reason: 'A 2-3 line summary highlights your top strengths.'
          });
        }
        if (updated.skills.length < 3) {
          detectedMissing.push({
            field: 'skills',
            label: 'Key Skills (at least 3)',
            reason: 'Keywords directly impact ATS resume ranking scores.'
          });
        }

        setMissingFields(detectedMissing);
        showToast('Resume Extracted!', 'Groq AI successfully extracted all details.', 'success');
      } else {
        throw new Error(json.error || 'Parsing failed.');
      }
    } catch (err: any) {
      console.error('[ResumeIntake] Parse error:', err);
      showToast('Extraction Failed', err?.message || 'Could not parse document. Please check the file or paste your resume text.', 'error');
    } finally {
      setIsParsing(false);
      setParseProgress('');
    }
  };

  // -------------------------------------------------------------
  // TAB 2: AI SUMMARY GENERATION FOR RESUME BUILDER
  // -------------------------------------------------------------
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const res = await fetch(`${API_BASE}/api/career/generate-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: resumeData.headline,
          targetRole: resumeData.headline,
          skills: resumeData.skills,
          experienceYears: resumeData.experience.length * 2 || 3,
          careerBreak: isReturnee
        })
      });
      const data = await res.json();
      if (data.success && data.summaries) {
        setAiSummaryOptions(data.summaries);
        showToast('AI Summaries Generated', 'Select an option to apply it to your resume.', 'success');
      }
    } catch {
      setAiSummaryOptions([
        `Results-oriented ${resumeData.headline || 'Professional'} with expertise in cross-functional leadership, structured problem-solving, and driving measurable impact. Adept at leveraging modern tools to optimize productivity and strategic deliverables.`,
        `Dynamic and adaptable ${resumeData.headline || 'Specialist'} offering hands-on competence in ${resumeData.skills.slice(0, 3).join(', ') || 'strategy and communication'}. Proven track record of high accountability, rapid upskilling, and collaborative execution.`,
        `Empowered professional with a passion for continuous learning and measurable results. Demonstrated background in stakeholder management and milestone delivery with strong attention to quality.`
      ]);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Skill management
  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !resumeData.skills.includes(trimmed)) {
      setResumeData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setNewSkillInput('');
      setMissingFields((prev) => prev.filter((m) => m.field !== 'skills'));
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill)
    }));
  };

  // Experience entry management
  const addExperienceEntry = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          role: '',
          company: '',
          duration: 'Recent',
          bullets: ['Delivered key strategic project deliverables and optimized workflows.']
        }
      ]
    }));
  };

  const removeExperienceEntry = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Project entry management (Kept strictly distinct from Work Experience)
  const addProjectEntry = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        {
          title: '',
          role: 'Full Stack Developer',
          technologies: '',
          link: '',
          description: '',
          highlights: ['Engineered key features and optimized system architecture.']
        }
      ]
    }));
  };

  const removeProjectEntry = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((_, i) => i !== index)
    }));
  };

  // Education entry management
  const addEducationEntry = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: '',
          institution: '',
          year: new Date().getFullYear().toString()
        }
      ]
    }));
  };

  const removeEducationEntry = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index)
    }));
  };

  // Download Handlers (FOR TAB 2 ONLY)
  const handleDownloadWord = async () => {
    try {
      await downloadAtsWord(resumeData);
      showToast('Word Document Downloaded', 'Your ATS-friendly .docx resume is ready.', 'success');
    } catch (e: any) {
      showToast('Error', e.message || 'Failed to download Word document', 'error');
    }
  };

  const handleDownloadPdf = () => {
    try {
      downloadAtsPdf(resumeData);
      showToast('PDF Document Downloaded', 'Your ATS-friendly .pdf resume is ready.', 'success');
    } catch (e: any) {
      showToast('Error', e.message || 'Failed to download PDF', 'error');
    }
  };

  const handleFinalSubmit = () => {
    if (!resumeData.fullName) {
      showToast('Name Required', 'Please enter your full name.', 'warning');
      return;
    }
    if (!resumeData.headline) {
      setResumeData((prev) => ({ ...prev, headline: 'Growth Professional' }));
    }
    onComplete(resumeData);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden max-w-4xl w-full mx-auto my-6">
      {/* Header Banner (NO DOWNLOAD BUTTONS HERE) */}
      <div className="bg-gradient-to-r from-[#3b0764] via-[#4A154B] to-[#be185d] p-6 sm:p-8 text-white relative">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-pink-200 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Resume Extraction & ATS Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Power Your Profile with AI Resume Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-purple-100 mt-1 max-w-xl">
              Upload your resume for automated Groq AI detail extraction, or build a brand-new ATS-optimized resume in under 2 minutes.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-purple-500/30">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'upload'
              ? 'bg-white text-[#4A154B] shadow-md'
              : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
          >
            <Upload className="w-4 h-4" />
            <span>Option 1: Upload Existing Resume</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'create'
              ? 'bg-white text-[#4A154B] shadow-md'
              : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Option 2: Don't Have a Resume? Build One Now</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* ======================================================= */}
        {/* TAB 1: UPLOAD & EXTRACT RESUME                          */}
        {/* ======================================================= */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            {/* File Drag and Drop Card */}
            <div className="border-2 border-dashed border-purple-200 hover:border-[#4A154B] rounded-2xl p-6 sm:p-8 text-center bg-purple-50/30 transition-all">
              <input
                type="file"
                id="resume-file-input"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="resume-file-input" className="cursor-pointer block space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-[#4A154B] flex items-center justify-center mx-auto shadow-xs">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900">
                    {selectedFile ? selectedFile.name : 'Upload Your Resume File'}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports <span className="font-semibold text-gray-700">Word (.docx), PDF (.pdf), and Plain Text (.txt)</span> (Max 10MB)
                  </p>
                </div>
                {selectedFile && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>File Selected: {(selectedFile.size / 1024).toFixed(1)} KB</span>
                  </div>
                )}
              </label>

              {/* Paste Text Toggle */}
              <div className="mt-4 pt-3 border-t border-purple-100 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasteText(!showPasteText)}
                  className="text-xs text-[#4A154B] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{showPasteText ? 'Hide text box' : 'Or paste your resume text directly'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPasteText ? 'rotate-180' : ''}`} />
                </button>

                {showPasteText && (
                  <textarea
                    rows={6}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste the full text of your resume here (Name, Email, Skills, Experience, Education)..."
                    className="w-full text-xs p-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-[#4A154B] leading-relaxed"
                  />
                )}

                {/* Action Parse Button */}
                {(selectedFile || pastedText.trim()) && (
                  <button
                    type="button"
                    disabled={isParsing}
                    onClick={handleParseResume}
                    className="flex items-center gap-2 bg-[#4A154B] hover:bg-[#350c36] text-white px-7 py-3 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isParsing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-pink-300" />
                        <span>{parseProgress || 'Extracting with Groq AI...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-pink-300" />
                        <span>Extract Key Details & Scan for Missing Items</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Extracted Details & Missing Fields Review */}
            {(resumeData.headline || resumeData.skills.length > 0 || resumeData.experience.length > 0 || resumeData.email) && (
              <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-top-4">
                {/* MISSING FIELDS ALERT CARD (If any) */}
                {missingFields.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-xs">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex-1 space-y-3">
                        <div>
                          <h4 className="font-bold text-sm text-amber-900">
                            Missing Information Detected for ATS Compliance
                          </h4>
                          <p className="text-xs text-amber-700 mt-0.5">
                            Our AI noticed the following details are missing from your resume. Please provide them to make your profile 100% complete:
                          </p>
                        </div>

                        {/* Interactive Inline Inputs for Missing Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {missingFields.map((missing) => (
                            <div key={missing.field} className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs">
                              <label className="block text-xs font-bold text-gray-800 mb-1">
                                {missing.label}
                              </label>
                              <p className="text-[10px] text-gray-500 mb-1.5">{missing.reason}</p>

                              {missing.field === 'phone' && (
                                <input
                                  type="tel"
                                  value={resumeData.phone}
                                  onChange={(e) => {
                                    setResumeData({ ...resumeData, phone: e.target.value });
                                    if (e.target.value.length > 5) {
                                      setMissingFields(missingFields.filter((m) => m.field !== 'phone'));
                                    }
                                  }}
                                  placeholder="e.g. +91 98765 43210"
                                  className="w-full text-xs px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:border-[#4A154B]"
                                />
                              )}

                              {missing.field === 'location' && (
                                <input
                                  type="text"
                                  value={resumeData.location}
                                  onChange={(e) => {
                                    setResumeData({ ...resumeData, location: e.target.value });
                                    if (e.target.value.length > 2) {
                                      setMissingFields(missingFields.filter((m) => m.field !== 'location'));
                                    }
                                  }}
                                  placeholder="e.g. Amritsar, Punjab"
                                  className="w-full text-xs px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:border-[#4A154B]"
                                />
                              )}

                              {missing.field === 'headline' && (
                                <input
                                  type="text"
                                  value={resumeData.headline}
                                  onChange={(e) => {
                                    setResumeData({ ...resumeData, headline: e.target.value });
                                    if (e.target.value.length > 2) {
                                      setMissingFields(missingFields.filter((m) => m.field !== 'headline'));
                                    }
                                  }}
                                  placeholder="e.g. Full Stack Developer | Web Developer"
                                  className="w-full text-xs px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:border-[#4A154B]"
                                />
                              )}

                              {missing.field === 'summary' && (
                                <textarea
                                  rows={2}
                                  value={resumeData.summary}
                                  onChange={(e) => {
                                    setResumeData({ ...resumeData, summary: e.target.value });
                                    if (e.target.value.length > 20) {
                                      setMissingFields(missingFields.filter((m) => m.field !== 'summary'));
                                    }
                                  }}
                                  placeholder="Brief summary of your professional background..."
                                  className="w-full text-xs px-3 py-1.5 border border-gray-300 rounded-lg outline-none focus:border-[#4A154B]"
                                />
                              )}

                              {missing.field === 'skills' && (
                                <div className="space-y-1.5">
                                  <div className="flex gap-1.5">
                                    <input
                                      type="text"
                                      value={newSkillInput}
                                      onChange={(e) => setNewSkillInput(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          addSkill(newSkillInput);
                                        }
                                      }}
                                      placeholder="Add skill..."
                                      className="flex-1 text-xs px-2.5 py-1 border border-gray-300 rounded-lg outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => addSkill(newSkillInput)}
                                      className="px-2.5 py-1 bg-[#4A154B] text-white rounded-lg text-xs font-bold"
                                    >
                                      Add
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Extracted Data Card Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Candidate Identity */}
                  <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200 space-y-2">
                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#4A154B]" />
                      <span>Extracted Contact Identity</span>
                    </h5>
                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-gray-900 text-sm">{resumeData.fullName || 'Candidate Name'}</div>
                      <div className="text-gray-600 flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-gray-400" />
                        <input
                          type="text"
                          value={resumeData.headline}
                          onChange={(e) => setResumeData({ ...resumeData, headline: e.target.value })}
                          placeholder="Professional Title"
                          className="font-medium text-purple-900 bg-transparent border-b border-purple-200 outline-none w-full"
                        />
                      </div>
                      <div className="text-gray-600 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span>{resumeData.email || 'Email missing'}</span>
                      </div>
                      <div className="text-gray-600 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{resumeData.phone || 'Phone missing'}</span>
                      </div>
                      <div className="text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{resumeData.location || 'Location missing'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Professional Summary */}
                  <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200 space-y-2">
                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#4A154B]" />
                      <span>Professional Summary</span>
                    </h5>
                    <textarea
                      rows={4}
                      value={resumeData.summary}
                      onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                      placeholder="Professional summary statement..."
                      className="w-full text-xs text-gray-800 bg-white p-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#4A154B] leading-relaxed"
                    />
                  </div>
                </div>

                {/* Card 3: Skills Badges */}
                <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#4A154B]" />
                      <span>Detected Skills & Keywords ({resumeData.skills.length})</span>
                    </h5>
                    <span className="text-[10px] text-gray-500">Click × to remove or add custom keywords</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-100 text-[#4A154B] text-xs font-semibold"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-red-500 cursor-pointer ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add skill input */}
                  <div className="flex items-center gap-2 max-w-sm">
                    <input
                      type="text"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill(newSkillInput);
                        }
                      }}
                      placeholder="Type skill & press Add..."
                      className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#4A154B] flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => addSkill(newSkillInput)}
                      className="px-3 py-1.5 bg-[#4A154B] hover:bg-[#350c36] text-white rounded-xl text-xs font-bold"
                    >
                      Add Skill
                    </button>
                  </div>
                </div>

                {/* Card 4: Work Experience (Strictly Formal Employment & Jobs) */}
                <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-[#4A154B]" />
                        <span>Work Experience ({resumeData.experience.length} Roles)</span>
                      </h5>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Only includes formal employment, corporate roles, and trainer positions.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addExperienceEntry}
                      className="text-xs font-bold text-[#4A154B] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Experience
                    </button>
                  </div>

                  {resumeData.experience.length === 0 ? (
                    <div className="p-3 bg-white rounded-xl border border-dashed border-gray-200 text-center">
                      <p className="text-xs text-gray-500">
                        No corporate work history listed — your technical projects below will be showcased as your primary proof of work.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {resumeData.experience.map((exp, idx) => (
                        <div key={idx} className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                              <input
                                type="text"
                                value={exp.role}
                                onChange={(e) => {
                                  const expCopy = [...resumeData.experience];
                                  expCopy[idx].role = e.target.value;
                                  setResumeData({ ...resumeData, experience: expCopy });
                                }}
                                placeholder="Job Title (e.g. Full Stack Developer)"
                                className="font-bold text-xs text-gray-900 border-b border-gray-200 pb-0.5 outline-none focus:border-[#4A154B]"
                              />
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => {
                                  const expCopy = [...resumeData.experience];
                                  expCopy[idx].company = e.target.value;
                                  setResumeData({ ...resumeData, experience: expCopy });
                                }}
                                placeholder="Company (e.g. AOSC Technologies Pvt Ltd)"
                                className="text-xs text-gray-700 border-b border-gray-200 pb-0.5 outline-none focus:border-[#4A154B]"
                              />
                              <input
                                type="text"
                                value={exp.duration}
                                onChange={(e) => {
                                  const expCopy = [...resumeData.experience];
                                  expCopy[idx].duration = e.target.value;
                                  setResumeData({ ...resumeData, experience: expCopy });
                                }}
                                placeholder="Duration (e.g. July 2026 – Present)"
                                className="text-xs text-gray-500 border-b border-gray-200 pb-0.5 outline-none focus:border-[#4A154B]"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeExperienceEntry(idx)}
                              className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                              title="Delete position"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Bullets */}
                          <div className="space-y-1 pt-1">
                            {exp.bullets.map((b, bIdx) => (
                              <p key={bIdx} className="text-xs text-gray-600 flex items-start gap-1.5">
                                <span className="text-[#4A154B] font-bold">•</span>
                                <span>{b}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card 5: Key Technical & Portfolio Projects (Cleanly separated from Work Experience) */}
                <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                        <span>Key Technical & Portfolio Projects ({(resumeData.projects || []).length})</span>
                      </h5>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Web applications, software systems, personal/academic projects, or open-source repositories.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addProjectEntry}
                      className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Project
                    </button>
                  </div>

                  {(resumeData.projects || []).length === 0 ? (
                    <div className="p-3 bg-white rounded-xl border border-dashed border-gray-200 text-center">
                      <p className="text-xs text-gray-500">
                        No projects listed yet. Click "+ Add Project" to highlight your portfolio.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(resumeData.projects || []).map((proj, pIdx) => (
                        <div key={pIdx} className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                              <input
                                type="text"
                                value={proj.title}
                                onChange={(e) => {
                                  const projCopy = [...(resumeData.projects || [])];
                                  projCopy[pIdx].title = e.target.value;
                                  setResumeData({ ...resumeData, projects: projCopy });
                                }}
                                placeholder="Project Name (e.g. AuraEstate)"
                                className="font-bold text-xs text-gray-900 border-b border-gray-200 pb-0.5 outline-none focus:border-teal-600"
                              />
                              <input
                                type="text"
                                value={typeof proj.technologies === 'string' ? proj.technologies : (proj.technologies || []).join(', ')}
                                onChange={(e) => {
                                  const projCopy = [...(resumeData.projects || [])];
                                  projCopy[pIdx].technologies = e.target.value;
                                  setResumeData({ ...resumeData, projects: projCopy });
                                }}
                                placeholder="Tech Stack (e.g. React, Node.js, MongoDB)"
                                className="text-xs text-teal-800 border-b border-gray-200 pb-0.5 outline-none focus:border-teal-600"
                              />
                              <input
                                type="text"
                                value={proj.link || ''}
                                onChange={(e) => {
                                  const projCopy = [...(resumeData.projects || [])];
                                  projCopy[pIdx].link = e.target.value;
                                  setResumeData({ ...resumeData, projects: projCopy });
                                }}
                                placeholder="Live / GitHub Link (optional)"
                                className="text-xs text-blue-600 border-b border-gray-200 pb-0.5 outline-none focus:border-blue-600"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeProjectEntry(pIdx)}
                              className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                              title="Delete project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {proj.description && (
                            <p className="text-xs text-gray-700">{proj.description}</p>
                          )}

                          {/* Highlights / Bullets */}
                          {proj.highlights && proj.highlights.length > 0 && (
                            <div className="space-y-1 pt-1">
                              {proj.highlights.map((h, hIdx) => (
                                <p key={hIdx} className="text-xs text-gray-600 flex items-start gap-1.5">
                                  <span className="text-teal-600 font-bold">•</span>
                                  <span>{h}</span>
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card 5: Education */}
                {resumeData.education.length > 0 && (
                  <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200 space-y-3">
                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#4A154B]" />
                      <span>Education ({resumeData.education.length})</span>
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {resumeData.education.map((edu, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 text-xs">
                          <div className="font-bold text-gray-900">{edu.degree}</div>
                          <div className="text-gray-600">{edu.institution}</div>
                          {(edu.year || edu.grade) && (
                            <div className="text-gray-500 text-[11px] mt-0.5">
                              {edu.year} {edu.grade ? `• ${edu.grade}` : ''}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted Details Verified & Save Bar (NO DOWNLOAD OPTION HERE) */}
                <div className="bg-purple-50/60 p-5 rounded-2xl border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h5 className="text-sm font-extrabold text-[#4A154B] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Resume Details Extracted Successfully</span>
                    </h5>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Review or edit your extracted details above before continuing to your profile.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#4A154B] hover:bg-[#350c36] text-white px-7 py-3 rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <span>Save & Continue to Profile</span>
                    <ArrowRight className="w-4 h-4 text-pink-300" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================= */}
        {/* TAB 2: INTERACTIVE ATS RESUME BUILDER (NO RESUME)       */}
        {/* ======================================================= */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            {/* Step Wizard Indicator */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 text-xs">
              <span className="font-extrabold text-[#4A154B]">
                Step {createStep} of 5:{' '}
                {createStep === 1 && 'Personal Information & Target Role'}
                {createStep === 2 && 'Professional Summary (AI Assist)'}
                {createStep === 3 && 'Experience & Career Track'}
                {createStep === 4 && 'Education & Degrees'}
                {createStep === 5 && 'Key Skills & Final Download'}
              </span>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCreateStep(s as any)}
                    className={`w-6 h-6 rounded-full text-[10px] font-bold transition-all cursor-pointer ${createStep === s
                      ? 'bg-[#4A154B] text-white'
                      : createStep > s
                        ? 'bg-purple-100 text-[#4A154B]'
                        : 'bg-gray-100 text-gray-400'
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 1: Personal Details */}
            {createStep === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={resumeData.fullName}
                      onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                      placeholder="e.g. Priya Nair"
                      className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#4A154B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Desired Job Title / Headline *</label>
                    <input
                      type="text"
                      required
                      value={resumeData.headline}
                      onChange={(e) => setResumeData({ ...resumeData, headline: e.target.value })}
                      placeholder="e.g. Senior Operations Analyst"
                      className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#4A154B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={resumeData.email}
                      onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                      placeholder="e.g. priya@example.com"
                      className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#4A154B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={resumeData.phone}
                      onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#4A154B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Current City / Location *</label>
                    <input
                      type="text"
                      required
                      value={resumeData.location}
                      onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                      placeholder="e.g. Pune, Maharashtra"
                      className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#4A154B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">LinkedIn or Portfolio URL (Optional)</label>
                    <input
                      type="url"
                      value={resumeData.linkedin || ''}
                      onChange={(e) => setResumeData({ ...resumeData, linkedin: e.target.value })}
                      placeholder="e.g. linkedin.com/in/priyanair"
                      className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#4A154B]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!resumeData.fullName || !resumeData.headline) {
                        showToast('Required Fields', 'Please enter your Full Name and Desired Title.', 'warning');
                        return;
                      }
                      setCreateStep(2);
                    }}
                    className="flex items-center gap-1.5 bg-[#4A154B] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md"
                  >
                    <span>Next: Professional Summary</span>
                    <ArrowRight className="w-4 h-4 text-pink-300" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Summary with AI Assist */}
            {createStep === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Professional Summary</h4>
                    <p className="text-xs text-gray-500">
                      A compelling 3-4 sentence elevator pitch optimized for ATS keyword scans.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-purple-900 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isReturnee}
                        onChange={(e) => setIsReturnee(e.target.checked)}
                        className="rounded text-[#4A154B]"
                      />
                      <span>Career Relaunch / Sabbatical returnee</span>
                    </label>

                    <button
                      type="button"
                      disabled={isGeneratingSummary}
                      onClick={handleGenerateSummary}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-[#4A154B] to-[#be185d] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingSummary ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Wand2 className="w-3.5 h-3.5 text-pink-300" />
                      )}
                      <span>{isGeneratingSummary ? 'Writing with AI...' : 'Generate with Groq AI'}</span>
                    </button>
                  </div>
                </div>

                {/* AI Summary suggestions */}
                {aiSummaryOptions.length > 0 && (
                  <div className="space-y-2 bg-purple-50/70 p-4 rounded-2xl border border-purple-200">
                    <span className="text-[11px] font-bold text-[#4A154B] uppercase tracking-wider">
                      Select an AI-Crafted Summary Option:
                    </span>
                    <div className="space-y-2">
                      {aiSummaryOptions.map((opt, i) => (
                        <div
                          key={i}
                          onClick={() => setResumeData({ ...resumeData, summary: opt })}
                          className={`p-3 rounded-xl border text-xs leading-relaxed cursor-pointer transition-all ${resumeData.summary === opt
                            ? 'bg-white border-[#4A154B] shadow-xs ring-1 ring-[#4A154B]'
                            : 'bg-white/80 border-purple-100 hover:bg-white'
                            }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-gray-800">{opt}</p>
                            {resumeData.summary === opt && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main Summary Textarea */}
                <textarea
                  rows={4}
                  value={resumeData.summary}
                  onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                  placeholder="e.g. Dedicated Financial Analyst with 4+ years of experience leading forecasting, budget variance, and multi-team reporting..."
                  className="w-full text-xs text-gray-900 bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none focus:bg-white focus:border-[#4A154B] leading-relaxed"
                />

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setCreateStep(1)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateStep(3)}
                    className="flex items-center gap-1.5 bg-[#4A154B] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md"
                  >
                    <span>Next: Work Experience</span>
                    <ArrowRight className="w-4 h-4 text-pink-300" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Work Experience */}
            {createStep === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Work Experience & Key Projects</h4>
                    <p className="text-xs text-gray-500">
                      Add previous roles or entrepreneurial / freelancing projects.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addExperienceEntry}
                    className="flex items-center gap-1 text-xs font-bold text-[#4A154B] bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Entry</span>
                  </button>
                </div>

                {resumeData.experience.length === 0 ? (
                  <div className="border border-dashed border-gray-300 p-8 rounded-2xl text-center space-y-2 bg-gray-50/50">
                    <p className="text-xs text-gray-600">No work experience or project entries added yet.</p>
                    <button
                      type="button"
                      onClick={addExperienceEntry}
                      className="px-4 py-2 bg-[#4A154B] text-white text-xs font-bold rounded-xl shadow-xs"
                    >
                      + Add Your First Role / Project
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resumeData.experience.map((exp, idx) => (
                      <div key={idx} className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => {
                                const expCopy = [...resumeData.experience];
                                expCopy[idx].role = e.target.value;
                                setResumeData({ ...resumeData, experience: expCopy });
                              }}
                              placeholder="Job Title (e.g. Full Stack Developer)"
                              className="font-bold text-xs text-gray-900 border-b border-gray-200 pb-0.5 outline-none focus:border-[#4A154B]"
                            />
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const expCopy = [...resumeData.experience];
                                expCopy[idx].company = e.target.value;
                                setResumeData({ ...resumeData, experience: expCopy });
                              }}
                              placeholder="Company (e.g. Acme Innovations)"
                              className="text-xs text-gray-700 border-b border-gray-200 pb-0.5 outline-none focus:border-[#4A154B]"
                            />
                            <input
                              type="text"
                              value={exp.duration}
                              onChange={(e) => {
                                const expCopy = [...resumeData.experience];
                                expCopy[idx].duration = e.target.value;
                                setResumeData({ ...resumeData, experience: expCopy });
                              }}
                              placeholder="Duration (e.g. July 2026 – Present)"
                              className="text-xs text-gray-500 border-b border-gray-200 pb-0.5 outline-none focus:border-[#4A154B]"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => removeExperienceEntry(idx)}
                            className="text-gray-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Bullet achievements */}
                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                            Key Achievements & Impact Bullets
                          </label>
                          <textarea
                            rows={3}
                            value={exp.bullets.join('\n')}
                            onChange={(e) => {
                              const copy = [...resumeData.experience];
                              copy[idx].bullets = e.target.value.split('\n').filter(Boolean);
                              setResumeData({ ...resumeData, experience: copy });
                            }}
                            placeholder="Enter 1 achievement per line, e.g.:&#10;Engineered responsive frontend with React and Tailwind CSS&#10;Integrated REST APIs with Node.js and MongoDB"
                            className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl outline-none leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setCreateStep(2)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateStep(4)}
                    className="flex items-center gap-1.5 bg-[#4A154B] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md"
                  >
                    <span>Next: Education</span>
                    <ArrowRight className="w-4 h-4 text-pink-300" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Education */}
            {createStep === 4 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Education & Academic Credentials</h4>
                    <p className="text-xs text-gray-500">Degree, college/university, and completion year.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addEducationEntry}
                    className="flex items-center gap-1 text-xs font-bold text-[#4A154B] bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Degree</span>
                  </button>
                </div>

                {resumeData.education.length === 0 ? (
                  <div className="border border-dashed border-gray-300 p-8 rounded-2xl text-center space-y-2 bg-gray-50/50">
                    <p className="text-xs text-gray-600">No education entries added yet.</p>
                    <button
                      type="button"
                      onClick={addEducationEntry}
                      className="px-4 py-2 bg-[#4A154B] text-white text-xs font-bold rounded-xl shadow-xs"
                    >
                      + Add Your Degree
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(resumeData.education || []).map((edu, idx) => (
                      <div key={idx} className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => {
                                const copy = [...resumeData.education];
                                copy[idx].degree = e.target.value;
                                setResumeData({ ...resumeData, education: copy });
                              }}
                              placeholder="Degree (e.g. Master / Bachelor of Technology)"
                              className="font-bold text-xs text-gray-900 border-b border-gray-200 pb-0.5 outline-none focus:border-purple-600"
                            />
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => {
                                const copy = [...resumeData.education];
                                copy[idx].institution = e.target.value;
                                setResumeData({ ...resumeData, education: copy });
                              }}
                              placeholder="Institution / University"
                              className="text-xs text-gray-700 border-b border-gray-200 pb-0.5 outline-none focus:border-purple-600"
                            />
                            <input
                              type="text"
                              value={edu.year || ''}
                              onChange={(e) => {
                                const copy = [...resumeData.education];
                                copy[idx].year = e.target.value;
                                setResumeData({ ...resumeData, education: copy });
                              }}
                              placeholder="Graduation Year (e.g. 2024)"
                              className="text-xs text-gray-600 border-b border-gray-200 pb-0.5 outline-none focus:border-purple-600"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeEducationEntry(idx)}
                            className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                            title="Delete degree"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setCreateStep(3)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateStep(5)}
                    className="flex items-center gap-1.5 bg-[#4A154B] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md"
                  >
                    <span>Next: Skills & Download</span>
                    <ArrowRight className="w-4 h-4 text-pink-300" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Skills & Final Download Bar (DOWNLOAD ONLY AVAILABLE HERE FOR BUILDER) */}
            {createStep === 5 && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Core Competencies & Keywords</h4>
                  <p className="text-xs text-gray-500">
                    Pick popular keywords or type custom competencies to enhance ATS match scoring.
                  </p>
                </div>

                {/* Popular Pills */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    Recommended High-Demand Skills (Click to Add):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {popularSkills.map((sk) => {
                      const isAdded = resumeData.skills.includes(sk);
                      return (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => (isAdded ? removeSkill(sk) : addSkill(sk))}
                          className={`text-xs px-3 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${isAdded
                            ? 'bg-[#4A154B] text-white border-[#4A154B]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                            }`}
                        >
                          {isAdded ? `✓ ${sk}` : `+ ${sk}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Current Active Skills */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800">
                      Your Selected Skills ({resumeData.skills.length})
                    </span>
                    <span className="text-[10px] text-gray-400">Aim for at least 5-8 relevant skills</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-100 text-[#4A154B] text-xs font-bold"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => removeSkill(s)}
                          className="hover:text-red-600 ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Custom input */}
                  <div className="flex items-center gap-2 max-w-sm pt-1">
                    <input
                      type="text"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill(newSkillInput);
                        }
                      }}
                      placeholder="Add custom skill..."
                      className="text-xs px-3 py-1.5 bg-white border border-gray-300 rounded-xl outline-none flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => addSkill(newSkillInput)}
                      className="px-3 py-1.5 bg-[#4A154B] text-white rounded-xl text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* ATS Resume Generation & Download Final Card (DOWNLOAD OPTION IS HERE ONLY) */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-3xl border border-purple-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#4A154B] text-white flex items-center justify-center font-black">
                      <FileText className="w-5 h-5 text-pink-200" />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-gray-900">
                        Your ATS-Friendly Resume is Ready to Download!
                      </h4>
                      <p className="text-xs text-gray-600">
                        Download your newly created resume in clean Word format (.docx) or PDF (.pdf) for job portals.
                      </p>
                    </div>
                  </div>

                  {/* Download Buttons Row */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-5 py-3 rounded-2xl font-bold text-xs shadow-xs transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-rose-600" />
                      <span>Download PDF Format (.pdf)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadWord}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-5 py-3 rounded-2xl font-bold text-xs shadow-xs transition-all cursor-pointer"
                    >
                      <FileDown className="w-4 h-4 text-blue-600" />
                      <span>Download Word Format (.docx)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#4A154B] hover:bg-[#350c36] text-white px-7 py-3 rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      <span>Complete Account Setup</span>
                      <ArrowRight className="w-4 h-4 text-pink-300" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={() => setCreateStep(4)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700"
                  >
                    Back to Education
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
