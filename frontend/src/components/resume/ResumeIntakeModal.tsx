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
  ArrowLeft,
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
  ChevronDown,
  Award,
  FolderGit2,
  Check,
  X
} from 'lucide-react';
import { AtsResumeData, downloadAtsPdf, downloadAtsWord } from '../../services/resumeExportService';
import { useToast } from '../../context/ToastContext';
import { isProjectEntry } from '../../context/HerCareerContext';
import { API_BASE } from '../../config/api';

export interface ResumeIntakeModalProps {
  initialName?: string;
  initialEmail?: string;
  initialPhone?: string;
  initialLocation?: string;
  initialHeadline?: string;
  defaultTab?: 'upload' | 'create';
  isOpen?: boolean;
  onClose?: () => void;
  onComplete: (resume: AtsResumeData) => void;
  onSkip?: () => void;
}

export const ResumeIntakeModal: React.FC<ResumeIntakeModalProps> = ({
  initialName = '',
  initialEmail = '',
  initialPhone = '',
  initialLocation = '',
  initialHeadline = '',
  defaultTab = 'create',
  isOpen,
  onClose,
  onComplete,
  onSkip
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'upload' | 'create'>(defaultTab);

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
    headline: initialHeadline || 'Growth Professional',
    summary: '',
    skills: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
    experience: [
      {
        role: 'Associate Developer',
        company: 'InnovateTech Solutions',
        location: initialLocation || 'India',
        duration: '2024 - Present',
        bullets: [
          'Engineered responsive web applications and collaborated with cross-functional product teams.',
          'Optimized database queries and API response times to improve platform reliability.'
        ]
      }
    ],
    projects: [
      {
        title: 'HerRise FinTech Dashboard',
        role: 'Full Stack Contributor',
        technologies: 'React, TypeScript, Tailwind CSS, Node.js',
        link: 'https://github.com',
        description: 'Comprehensive financial tracking and career empowerment hub designed for women professionals.',
        highlights: [
          'Implemented modular budget tools, AI resume parser, and dynamic SVG data visualizations.'
        ]
      }
    ],
    education: [
      {
        degree: 'Bachelor of Technology (B.Tech)',
        institution: 'National Institute of Technology',
        year: '2024',
        grade: '8.4 CGPA'
      }
    ],
    certifications: ['Full Stack Web Development - Coursera'],
    languages: ['English', 'Hindi']
  });

  // Missing fields flagged by AI or validator
  const [missingFields, setMissingFields] = useState<Array<{ field: string; label: string; reason: string }>>([]);

  // Create Mode Step Tracking: 1=Personal, 2=Education, 3=Experience, 4=Skills, 5=Projects, 6=Summary, 7=Review & Export
  const [createStep, setCreateStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [careerStage, setCareerStage] = useState<'experienced' | 'fresher' | 'returnee'>('experienced');
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiSummaryOptions, setAiSummaryOptions] = useState<string[]>([]);

  // Recommended skill presets
  const popularSkills = [
    'React.js', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB',
    'HTML5', 'CSS3', 'Tailwind CSS', 'TypeScript', 'Git & GitHub', 'REST APIs',
    'Project Management', 'Financial Modeling', 'Data Analysis', 'Digital Marketing'
  ];

  const softSkillsPresets = [
    'Critical Thinking', 'Cross-Functional Leadership', 'Effective Communication',
    'Agile Collaboration', 'Time Management', 'Stakeholder Management'
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
          skills: Array.isArray(p.skills) && p.skills.length > 0 ? p.skills : resumeData.skills,
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
              title: (e.role || e.title || 'Technical Project').replace(/^Project:\s*/i, '').trim(),
              role: e.role || 'Contributor',
              technologies: (e.company || '').replace(/\s*Project\s*/i, '').trim(),
              link: '',
              description: e.description || (e.bullets && e.bullets[0]) || '',
              highlights: Array.isArray(e.bullets || e.highlights) ? e.bullets || e.highlights : []
            }))
          ],
          education: Array.isArray(p.education) && p.education.length > 0
            ? p.education.map((edu: any) => ({
              degree: edu.degree || 'Degree',
              institution: edu.institution || 'University',
              year: edu.year || '',
              grade: edu.grade || ''
            }))
            : resumeData.education,
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
        if (!updated.education || updated.education.length === 0 || !updated.education[0]?.degree) {
          detectedMissing.push({
            field: 'education',
            label: 'Highest Qualification / Degree',
            reason: 'Academic qualifications are required for ATS evaluation.'
          });
        }
        if (!updated.experience || updated.experience.length === 0) {
          detectedMissing.push({
            field: 'experience',
            label: 'Work Experience or Career Level',
            reason: 'Relevant work experience or internship track is required.'
          });
        }
        if (!updated.skills || updated.skills.length < 3) {
          detectedMissing.push({
            field: 'skills',
            label: 'Key Skills (at least 3)',
            reason: 'Skills directly determine keyword match scores in ATS portals.'
          });
        }

        setMissingFields(detectedMissing);
        showToast('Resume Extracted! ✨', 'Groq AI successfully parsed your qualifications, experience & skills.', 'success');
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
  // AI SUMMARY GENERATION (CONTEXT-AWARE BASED ON ENTERED DATA)
  // -------------------------------------------------------------
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    const degreeStr = resumeData.education[0]?.degree || 'Technical Degree';
    const topSkills = resumeData.skills.slice(0, 4).join(', ') || 'Software Development, Analysis';
    const primaryRole = resumeData.headline || 'Professional Specialist';
    const expCount = resumeData.experience.length;

    try {
      const res = await fetch(`${API_BASE}/api/career/generate-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: primaryRole,
          targetRole: primaryRole,
          skills: resumeData.skills,
          experienceYears: careerStage === 'fresher' ? 0 : expCount * 2 || 2,
          careerBreak: careerStage === 'returnee'
        })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.summaries) && data.summaries.length > 0) {
        setAiSummaryOptions(data.summaries);
        showToast('AI Summaries Generated! ✨', 'Tailored to your qualification, experience & skills.', 'success');
      } else {
        throw new Error('Fallback to local prompts');
      }
    } catch {
      // High-quality local generative fallback incorporating user's EXACT details
      if (careerStage === 'fresher') {
        setAiSummaryOptions([
          `Proactive and detail-oriented ${degreeStr} graduate specialized as an aspiring ${primaryRole}. Built strong foundational expertise in ${topSkills}. Eager to apply structured problem-solving, rapid learning agility, and collaborative execution to contribute to impactful software deliverables.`,
          `High-achieving ${degreeStr} student offering demonstrable project capability across ${topSkills}. Proven track record of team collaboration, clean code practices, and milestone execution through academic capstones and hands-on projects.`,
          `Driven and adaptable entry-level ${primaryRole} with comprehensive training in ${topSkills}. Passionate about agile methodologies, user-centric engineering, and continuous professional growth.`
        ]);
      } else if (careerStage === 'returnee') {
        setAiSummaryOptions([
          `Resilient and results-driven ${primaryRole} holding a ${degreeStr}, relaunching career after a dedicated sabbatical. Combines prior professional delivery background with upskilled competence in ${topSkills}. Demonstrates exceptional stakeholder management, maturity, and accelerated ramp-up capability.`,
          `Experienced ${primaryRole} with a strong academic foundation in ${degreeStr} and modern proficiency in ${topSkills}. Bringing high accountability, refined critical thinking, and renewed enthusiasm to drive operational and technical excellence.`,
          `Adaptable growth professional with proven capability in cross-functional coordination and technical delivery in ${topSkills}. Empowered returnee ready to contribute immediate value to engineering and product teams.`
        ]);
      } else {
        setAiSummaryOptions([
          `Results-driven ${primaryRole} with a ${degreeStr} and solid experience executing cross-functional initiatives in ${topSkills}. Adept at designing scalable solutions, optimizing team velocity, and delivering measurable business impact.`,
          `Dedicated ${primaryRole} recognized for high-standard execution and technical mastery in ${topSkills}. Combines deep analytical capabilities with collaborative stakeholder leadership to deliver complex projects on schedule.`,
          `Performance-focused specialist with a background in ${degreeStr} and hands-on track record across ${topSkills}. Proven success in driving process improvements, mentoring peers, and aligning technical implementations with strategic objectives.`
        ]);
      }
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

  // Education entry management
  const addEducationEntry = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: '',
          institution: '',
          year: new Date().getFullYear().toString(),
          grade: ''
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

  // Experience entry management
  const addExperienceEntry = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          role: '',
          company: '',
          location: resumeData.location || 'India',
          duration: '2023 - Present',
          bullets: ['Delivered key deliverables and collaborated with cross-functional teams to achieve organizational milestones.']
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

  // Project entry management
  const addProjectEntry = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        {
          title: '',
          role: 'Lead Contributor',
          technologies: '',
          link: '',
          description: '',
          highlights: ['Architected key modules and ensured robust automated test coverage.']
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

  // Certification management
  const addCertification = (cert: string) => {
    if (cert.trim() && !(resumeData.certifications || []).includes(cert.trim())) {
      setResumeData((prev) => ({
        ...prev,
        certifications: [...(prev.certifications || []), cert.trim()]
      }));
    }
  };

  const removeCertification = (certIdx: number) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).filter((_, i) => i !== certIdx)
    }));
  };

  // Download Handlers
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
      setCreateStep(1);
      return;
    }
    if (!resumeData.education || resumeData.education.length === 0 || !resumeData.education[0]?.degree) {
      showToast('Qualification Required', 'Please provide at least your highest qualification/degree.', 'warning');
      setCreateStep(2);
      return;
    }
    onComplete(resumeData);
  };

  // If used as a modal and isOpen is false, don't render
  if (isOpen === false) return null;

  const content = (
    <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden max-w-4xl w-full mx-auto my-4 transition-all">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#3b0764] via-[#4A154B] to-[#be185d] p-6 sm:p-7 text-white relative">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            title="Close Wizard"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-pink-200 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Complete ATS Resume Creator & AI Assistant</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Build Your Professional ATS Resume
            </h2>
            <p className="text-xs sm:text-sm text-purple-100 mt-1 max-w-xl">
              We guide you through your Personal Info, Academic Qualifications, Experience, Skills & Projects with instant AI polish.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mt-5 pt-3 border-t border-purple-500/30">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'create'
                ? 'bg-white text-[#4A154B] shadow-md'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Step-by-Step Resume Creator Wizard</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-[#4A154B] shadow-md'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload & Auto-Extract Existing Resume</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* ======================================================= */}
        {/* TAB 1: UPLOAD & AUTO-EXTRACT                            */}
        {/* ======================================================= */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-purple-200 hover:border-[#4A154B] rounded-2xl p-6 sm:p-8 text-center bg-purple-50/30 transition-all">
              <input
                type="file"
                id="resume-file-modal-input"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="resume-file-modal-input" className="cursor-pointer block space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-[#4A154B] flex items-center justify-center mx-auto shadow-xs">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900">
                    {selectedFile ? selectedFile.name : 'Upload Your Existing Resume File'}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports <span className="font-semibold text-gray-700">Word (.docx), PDF (.pdf), and Plain Text (.txt)</span>
                  </p>
                </div>
                {selectedFile && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>File Selected: {(selectedFile.size / 1024).toFixed(1)} KB</span>
                  </div>
                )}
              </label>

              <div className="pt-3 border-t border-purple-100 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasteText(!showPasteText)}
                  className="text-xs text-[#4A154B] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{showPasteText ? 'Hide text box' : 'Or paste resume text'}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showPasteText ? 'rotate-180' : ''}`} />
                </button>

                {showPasteText && (
                  <textarea
                    rows={5}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste your complete resume text here (Education, Experience, Skills, Projects)..."
                    className="w-full text-xs p-3 border border-purple-200 rounded-xl bg-white outline-none focus:border-[#4A154B] mt-2 font-mono"
                  />
                )}
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  disabled={isParsing}
                  onClick={handleParseResume}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4A154B] hover:bg-[#350c36] text-white px-8 py-3 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isParsing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-pink-300" />
                      <span>{parseProgress || 'Groq AI Extracting All Resume Sections...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-pink-300" />
                      <span>Extract Qualifications, Experience & Skills</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Extracted Details Preview */}
            {resumeData.fullName && (
              <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-gray-900">Extracted Resume Profile</span>
                  </div>
                  <span className="text-xs font-bold text-[#4A154B]">{resumeData.headline}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-purple-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Name</span>
                    <span className="font-bold text-gray-800">{resumeData.fullName}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-purple-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Highest Qualification</span>
                    <span className="font-bold text-gray-800">{resumeData.education[0]?.degree || 'Not provided'}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-purple-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Work Experience</span>
                    <span className="font-bold text-gray-800">
                      {resumeData.experience.length > 0 ? `${resumeData.experience.length} roles listed` : 'Fresher / None listed'}
                    </span>
                  </div>
                </div>

                {missingFields.length > 0 && (
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Missing items detected:</span>
                    </div>
                    <ul className="text-xs text-amber-700 list-disc list-inside">
                      {missingFields.map((m) => (
                        <li key={m.field}><span className="font-semibold">{m.label}</span> — {m.reason}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('create')}
                    className="px-4 py-2 border border-purple-300 text-[#4A154B] rounded-xl text-xs font-bold hover:bg-purple-100/50"
                  >
                    Edit in Step-by-Step Wizard →
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="px-6 py-2 bg-[#4A154B] hover:bg-[#350c36] text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    Save & Apply Resume
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================= */}
        {/* TAB 2: STEP-BY-STEP INTERACTIVE RESUME CREATOR WIZARD   */}
        {/* ======================================================= */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            {/* Step Wizard Nav Header */}
            <div className="border-b border-gray-200 pb-3">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-black text-[#4A154B] text-sm">
                  Step {createStep} of 7:{' '}
                  {createStep === 1 && 'Personal Details & Target Title'}
                  {createStep === 2 && 'Qualifications & Academic Background'}
                  {createStep === 3 && 'Work Experience & Career Track'}
                  {createStep === 4 && 'Key Skills & Competencies'}
                  {createStep === 5 && 'Projects & Certifications'}
                  {createStep === 6 && 'Professional Summary (AI Assist)'}
                  {createStep === 7 && 'Review & Download ATS Resume'}
                </span>
                <span className="text-gray-400 text-[11px] font-semibold">
                  {Math.round((createStep / 7) * 100)}% Completed
                </span>
              </div>

              {/* Progress Bar & Badges */}
              <div className="flex items-center justify-between gap-1 sm:gap-2">
                {[
                  { step: 1, label: 'Identity', icon: User },
                  { step: 2, label: 'Qualification', icon: GraduationCap },
                  { step: 3, label: 'Experience', icon: Briefcase },
                  { step: 4, label: 'Skills', icon: Sparkles },
                  { step: 5, label: 'Projects', icon: FolderGit2 },
                  { step: 6, label: 'Summary', icon: Wand2 },
                  { step: 7, label: 'Download', icon: Download }
                ].map((s) => {
                  const Icon = s.icon;
                  const isCurrent = createStep === s.step;
                  const isDone = createStep > s.step;
                  return (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => setCreateStep(s.step as any)}
                      className={`flex-1 py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        isCurrent
                          ? 'bg-[#4A154B] text-white shadow-xs'
                          : isDone
                          ? 'bg-purple-100 text-[#4A154B]'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-3 h-3 shrink-0" />
                      <span className="hidden sm:inline">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* STEP 1: Personal Details & Target Role                        */}
            {/* ------------------------------------------------------------- */}
            {createStep === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-gray-100 pb-2">
                  <h4 className="text-sm font-bold text-gray-900">Personal Information & Career Target</h4>
                  <p className="text-xs text-gray-500">Recruiters use these details for contact and identity matching.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={resumeData.fullName}
                        onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                        placeholder="e.g. Priya Nair"
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#4A154B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Target Job Title / Headline *</label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={resumeData.headline}
                        onChange={(e) => setResumeData({ ...resumeData, headline: e.target.value })}
                        placeholder="e.g. Senior Software Engineer / Full Stack Developer"
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#4A154B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={resumeData.email}
                        onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                        placeholder="e.g. priya.nair@example.com"
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#4A154B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Phone Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={resumeData.phone}
                        onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#4A154B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">City & State (Location) *</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={resumeData.location}
                        onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                        placeholder="e.g. Pune, Maharashtra"
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#4A154B]"
                      />
                    </div>
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
                        showToast('Required Fields', 'Please enter your Full Name and Target Job Title.', 'warning');
                        return;
                      }
                      setCreateStep(2);
                    }}
                    className="flex items-center gap-1.5 bg-[#4A154B] hover:bg-[#350c36] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <span>Next: Qualifications & Education</span>
                    <ArrowRight className="w-4 h-4 text-pink-300" />
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STEP 2: Qualifications & Academic Background                  */}
            {/* ------------------------------------------------------------- */}
            {createStep === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Academic Qualifications & Education</h4>
                    <p className="text-xs text-gray-500">
                      Degrees, colleges/universities, graduation year, and GPA/percentage.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addEducationEntry}
                    className="flex items-center gap-1 text-xs font-bold text-[#4A154B] bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Degree</span>
                  </button>
                </div>

                {resumeData.education.length === 0 ? (
                  <div className="border border-dashed border-gray-300 p-8 rounded-2xl text-center space-y-2 bg-gray-50/50">
                    <GraduationCap className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-xs text-gray-600">No education entries added yet.</p>
                    <button
                      type="button"
                      onClick={addEducationEntry}
                      className="px-4 py-2 bg-[#4A154B] text-white text-xs font-bold rounded-xl shadow-xs"
                    >
                      + Add Your Degree / Qualification
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-2xl border border-purple-100 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#4A154B]">
                            Degree #{idx + 1} {idx === 0 && '(Highest Qualification)'}
                          </span>
                          {resumeData.education.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEducationEntry(idx)}
                              className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                              title="Delete this qualification"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">
                              Degree / Qualification *
                            </label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => {
                                const copy = [...resumeData.education];
                                copy[idx].degree = e.target.value;
                                setResumeData({ ...resumeData, education: copy });
                              }}
                              placeholder="e.g. B.Tech Computer Science"
                              className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#4A154B]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">
                              College / University / Institute *
                            </label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => {
                                const copy = [...resumeData.education];
                                copy[idx].institution = e.target.value;
                                setResumeData({ ...resumeData, education: copy });
                              }}
                              placeholder="e.g. Pune University / IIT / NIT"
                              className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#4A154B]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">
                              Graduation / Passing Year *
                            </label>
                            <input
                              type="text"
                              value={edu.year || ''}
                              onChange={(e) => {
                                const copy = [...resumeData.education];
                                copy[idx].year = e.target.value;
                                setResumeData({ ...resumeData, education: copy });
                              }}
                              placeholder="e.g. 2024 or 2025"
                              className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#4A154B]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">
                              Grade / CGPA / Percentage
                            </label>
                            <input
                              type="text"
                              value={edu.grade || ''}
                              onChange={(e) => {
                                const copy = [...resumeData.education];
                                copy[idx].grade = e.target.value;
                                setResumeData({ ...resumeData, education: copy });
                              }}
                              placeholder="e.g. 8.5 CGPA or 82%"
                              className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#4A154B]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setCreateStep(1)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!resumeData.education[0]?.degree) {
                        showToast('Qualification Required', 'Please enter your highest degree/qualification.', 'warning');
                        return;
                      }
                      setCreateStep(3);
                    }}
                    className="flex items-center gap-1.5 bg-[#4A154B] hover:bg-[#350c36] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <span>Next: Work Experience</span>
                    <ArrowRight className="w-4 h-4 text-pink-300" />
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STEP 3: Work Experience & Career Track                       */}
            {/* ------------------------------------------------------------- */}
            {createStep === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Work Experience & Career Background</h4>
                    <p className="text-xs text-gray-500">
                      Include full-time roles, internships, freelancing, or select Fresher.
                    </p>
                  </div>

                  {/* Career Stage Selector */}
                  <div className="flex p-1 bg-purple-50 rounded-xl border border-purple-200 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setCareerStage('experienced')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        careerStage === 'experienced' ? 'bg-[#4A154B] text-white shadow-2xs' : 'text-[#4A154B] hover:bg-white/50'
                      }`}
                    >
                      💼 Experienced
                    </button>
                    <button
                      type="button"
                      onClick={() => setCareerStage('fresher')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        careerStage === 'fresher' ? 'bg-[#4A154B] text-white shadow-2xs' : 'text-[#4A154B] hover:bg-white/50'
                      }`}
                    >
                      🎓 Fresher
                    </button>
                    <button
                      type="button"
                      onClick={() => setCareerStage('returnee')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        careerStage === 'returnee' ? 'bg-[#4A154B] text-white shadow-2xs' : 'text-[#4A154B] hover:bg-white/50'
                      }`}
                    >
                      🌸 Career Returnee
                    </button>
                  </div>
                </div>

                {careerStage === 'fresher' ? (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-2xl border border-purple-200 space-y-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      <h5 className="text-xs font-bold text-gray-900">Fresher / Recent Graduate Track</h5>
                    </div>
                    <p className="text-xs text-gray-600">
                      As a fresher, your academic qualifications, capstone projects, and technical skills take center stage. You don't need years of full-time corporate experience.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={addExperienceEntry}
                        className="text-xs font-bold text-[#4A154B] hover:underline cursor-pointer"
                      >
                        + Have an internship or student club role? Click here to add it.
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Experience Entries List */}
                <div className="space-y-4">
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-purple-100 shadow-2xs space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase">Job Title / Role</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => {
                                const copy = [...resumeData.experience];
                                copy[idx].role = e.target.value;
                                setResumeData({ ...resumeData, experience: copy });
                              }}
                              placeholder="e.g. Software Engineer / Analyst"
                              className="w-full font-bold text-xs text-gray-900 border-b border-gray-200 pb-1 outline-none focus:border-[#4A154B]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase">Company Name</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const copy = [...resumeData.experience];
                                copy[idx].company = e.target.value;
                                setResumeData({ ...resumeData, experience: copy });
                              }}
                              placeholder="e.g. TechCorp Solutions"
                              className="w-full text-xs text-gray-800 border-b border-gray-200 pb-1 outline-none focus:border-[#4A154B]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase">Duration & Dates</label>
                            <input
                              type="text"
                              value={exp.duration}
                              onChange={(e) => {
                                const copy = [...resumeData.experience];
                                copy[idx].duration = e.target.value;
                                setResumeData({ ...resumeData, experience: copy });
                              }}
                              placeholder="e.g. Jan 2024 - Present"
                              className="w-full text-xs text-gray-600 border-b border-gray-200 pb-1 outline-none focus:border-[#4A154B]"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeExperienceEntry(idx)}
                          className="text-gray-400 hover:text-red-500 p-1 cursor-pointer shrink-0"
                          title="Delete role"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Responsibilities Bullets */}
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                          Key Achievements & Responsibilities (1 bullet per line)
                        </label>
                        <textarea
                          rows={3}
                          value={exp.bullets.join('\n')}
                          onChange={(e) => {
                            const copy = [...resumeData.experience];
                            copy[idx].bullets = e.target.value.split('\n').filter(Boolean);
                            setResumeData({ ...resumeData, experience: copy });
                          }}
                          placeholder="Engineered scalable full stack modules using React and Node.js&#10;Collaborated with cross-functional product stakeholders to ship features on time"
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#4A154B] leading-relaxed font-sans"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addExperienceEntry}
                    className="w-full py-2.5 border-2 border-dashed border-purple-200 hover:border-[#4A154B] rounded-xl text-xs font-bold text-[#4A154B] flex items-center justify-center gap-1.5 cursor-pointer bg-purple-50/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Another Work Experience / Role</span>
                  </button>
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setCreateStep(2)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateStep(4)}
                    className="flex items-center gap-1.5 bg-[#4A154B] hover:bg-[#350c36] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <span>Next: Skills & Competencies</span>
                    <ArrowRight className="w-4 h-4 text-pink-300" />
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STEP 4: Skills & Core Competencies                            */}
            {/* ------------------------------------------------------------- */}
            {createStep === 4 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="border-b border-gray-100 pb-2">
                  <h4 className="text-sm font-bold text-gray-900">Key Skills & Technical Proficiencies</h4>
                  <p className="text-xs text-gray-500">
                    ATS search algorithms index these keywords to calculate match percentages.
                  </p>
                </div>

                {/* Popular Skill Recommendations */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">
                    Recommended Technical Skills (Click to Add / Remove):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {popularSkills.map((sk) => {
                      const isAdded = resumeData.skills.includes(sk);
                      return (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => (isAdded ? removeSkill(sk) : addSkill(sk))}
                          className={`text-xs px-3 py-1 rounded-xl border font-semibold transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-[#4A154B] text-white border-[#4A154B] shadow-2xs'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                          }`}
                        >
                          {isAdded ? `✓ ${sk}` : `+ ${sk}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Soft Skills */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">
                    Leadership & Professional Strengths:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {softSkillsPresets.map((sk) => {
                      const isAdded = resumeData.skills.includes(sk);
                      return (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => (isAdded ? removeSkill(sk) : addSkill(sk))}
                          className={`text-xs px-3 py-1 rounded-xl border font-semibold transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-teal-300 hover:bg-teal-50/50'
                          }`}
                        >
                          {isAdded ? `✓ ${sk}` : `+ ${sk}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Skill Tags & Custom Input */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800">
                      Your Selected Skills ({resumeData.skills.length})
                    </span>
                    <span className="text-[10px] text-gray-500 font-semibold">Aim for at least 6-8 skills</span>
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
                          className="hover:text-red-600 ml-1 cursor-pointer font-black"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Custom tag input */}
                  <div className="flex items-center gap-2 max-w-md pt-1">
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
                      placeholder="Add custom skill (e.g. Next.js, PowerBI, Excel)..."
                      className="text-xs px-3 py-2 bg-white border border-gray-300 rounded-xl outline-none focus:border-[#4A154B] flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => addSkill(newSkillInput)}
                      className="px-4 py-2 bg-[#4A154B] hover:bg-[#350c36] text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setCreateStep(3)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (resumeData.skills.length === 0) {
                        showToast('Skills Required', 'Please select or add at least 3 skills.', 'warning');
                        return;
                      }
                      setCreateStep(5);
                    }}
                    className="flex items-center gap-1.5 bg-[#4A154B] hover:bg-[#350c36] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <span>Next: Projects & Certifications</span>
                    <ArrowRight className="w-4 h-4 text-pink-300" />
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STEP 5: Projects & Certifications                            */}
            {/* ------------------------------------------------------------- */}
            {createStep === 5 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Projects & Certifications</h4>
                    <p className="text-xs text-gray-500">
                      Showcase hands-on applications, capstones, and verified credentials.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addProjectEntry}
                    className="flex items-center gap-1 text-xs font-bold text-[#4A154B] bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                {/* Projects List */}
                <div className="space-y-3">
                  {(resumeData.projects || []).map((proj, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-purple-100 shadow-2xs space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase">Project Title</label>
                            <input
                              type="text"
                              value={proj.title}
                              onChange={(e) => {
                                const copy = [...(resumeData.projects || [])];
                                copy[idx].title = e.target.value;
                                setResumeData({ ...resumeData, projects: copy });
                              }}
                              placeholder="e.g. HerRise Financial Empowerment App"
                              className="w-full font-bold text-xs text-gray-900 border-b border-gray-200 pb-1 outline-none focus:border-[#4A154B]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase">Tech Stack / Tools</label>
                            <input
                              type="text"
                              value={proj.technologies}
                              onChange={(e) => {
                                const copy = [...(resumeData.projects || [])];
                                copy[idx].technologies = e.target.value;
                                setResumeData({ ...resumeData, projects: copy });
                              }}
                              placeholder="e.g. React, TypeScript, Node.js, MongoDB"
                              className="w-full text-xs text-gray-700 border-b border-gray-200 pb-1 outline-none focus:border-[#4A154B]"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeProjectEntry(idx)}
                          className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Description / Deliverables</label>
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => {
                            const copy = [...(resumeData.projects || [])];
                            copy[idx].description = e.target.value;
                            setResumeData({ ...resumeData, projects: copy });
                          }}
                          placeholder="Brief description of the problem solved and core functionalities built..."
                          className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Certifications Section */}
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-[#4A154B]" />
                    <span className="text-xs font-bold text-gray-800">Certifications & Licenses</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(resumeData.certifications || []).map((c, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold">
                        {c}
                        <button type="button" onClick={() => removeCertification(i)} className="text-amber-500 hover:text-red-600">×</button>
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const name = window.prompt('Enter certification name (e.g. AWS Certified Cloud Practitioner):');
                        if (name) addCertification(name);
                      }}
                      className="px-3 py-1 rounded-xl border border-dashed border-gray-300 text-xs font-semibold text-gray-600 hover:border-[#4A154B] hover:text-[#4A154B]"
                    >
                      + Add Certification
                    </button>
                  </div>
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setCreateStep(4)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateStep(6)}
                    className="flex items-center gap-1.5 bg-[#4A154B] hover:bg-[#350c36] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <span>Next: AI Professional Summary</span>
                    <ArrowRight className="w-4 h-4 text-pink-300" />
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STEP 6: AI Professional Summary                               */}
            {/* ------------------------------------------------------------- */}
            {createStep === 6 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Professional Summary (AI-Crafted)</h4>
                    <p className="text-xs text-gray-500">
                      An executive 2-3 line overview incorporating your qualification, experience, and top skills.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isGeneratingSummary}
                    onClick={handleGenerateSummary}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-[#4A154B] to-[#be185d] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingSummary ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-pink-300" />
                        <span>AI Generating Options...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                        <span>Generate with Groq AI</span>
                      </>
                    )}
                  </button>
                </div>

                {/* AI Summary Suggestion Cards */}
                {aiSummaryOptions.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block">
                      Choose an AI-Generated Summary Option to Apply:
                    </span>
                    <div className="grid grid-cols-1 gap-2.5">
                      {aiSummaryOptions.map((opt, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setResumeData({ ...resumeData, summary: opt });
                            showToast('Summary Applied', `Option ${i + 1} set as active summary.`, 'info');
                          }}
                          className={`p-3.5 rounded-2xl border text-xs leading-relaxed cursor-pointer transition-all ${
                            resumeData.summary === opt
                              ? 'bg-purple-100/70 border-[#4A154B] ring-2 ring-[#4A154B]/20 text-gray-900 font-medium'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-extrabold uppercase text-[#4A154B]">
                              Style {i + 1}: {i === 0 ? 'Technical & Impact' : i === 1 ? 'Executive Leadership' : 'Growth & Adaptability'}
                            </span>
                            {resumeData.summary === opt && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check className="w-3 h-3" /> Selected
                              </span>
                            )}
                          </div>
                          <p>{opt}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Editable Textarea */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Active Professional Summary (Editable)
                  </label>
                  <textarea
                    rows={4}
                    value={resumeData.summary}
                    onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                    placeholder="Click 'Generate with Groq AI' above or write your custom summary..."
                    className="w-full text-xs p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#4A154B] leading-relaxed font-sans"
                  />
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setCreateStep(5)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!resumeData.summary || resumeData.summary.length < 15) {
                        handleGenerateSummary();
                      }
                      setCreateStep(7);
                    }}
                    className="flex items-center gap-1.5 bg-[#4A154B] hover:bg-[#350c36] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <span>Next: Review & Download ATS Resume</span>
                    <ArrowRight className="w-4 h-4 text-pink-300" />
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STEP 7: Review & Download ATS Resume                          */}
            {/* ------------------------------------------------------------- */}
            {createStep === 7 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-gray-100 pb-2">
                  <h4 className="text-sm font-bold text-gray-900">Final ATS Resume Review & Export</h4>
                  <p className="text-xs text-gray-500">
                    Verify all sections before downloading or saving to your HerRise profile.
                  </p>
                </div>

                {/* ATS Formatted Preview Paper */}
                <div className="bg-slate-50 border border-slate-300 rounded-2xl p-6 sm:p-8 space-y-4 max-h-96 overflow-y-auto font-sans text-slate-800 shadow-inner">
                  {/* Header */}
                  <div className="border-b border-slate-300 pb-3 text-center sm:text-left">
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">{resumeData.fullName}</h2>
                    <p className="text-xs font-bold text-[#4A154B]">{resumeData.headline}</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      {resumeData.email} • {resumeData.phone} • {resumeData.location}
                      {resumeData.linkedin && ` • ${resumeData.linkedin}`}
                    </p>
                  </div>

                  {/* Summary */}
                  {resumeData.summary && (
                    <div>
                      <h4 className="text-[11px] font-black uppercase text-slate-900 border-b border-slate-200 pb-0.5 mb-1 tracking-wider">
                        Professional Summary
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">{resumeData.summary}</p>
                    </div>
                  )}

                  {/* Education */}
                  {resumeData.education.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-black uppercase text-slate-900 border-b border-slate-200 pb-0.5 mb-1 tracking-wider">
                        Education & Academic Background
                      </h4>
                      <div className="space-y-1.5">
                        {resumeData.education.map((edu, i) => (
                          <div key={i} className="flex justify-between text-xs">
                            <div>
                              <span className="font-bold text-slate-900">{edu.degree}</span>
                              <span className="text-slate-600"> — {edu.institution}</span>
                            </div>
                            <span className="text-slate-500 font-semibold">{edu.year} {edu.grade && `(${edu.grade})`}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {resumeData.experience.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-black uppercase text-slate-900 border-b border-slate-200 pb-0.5 mb-1 tracking-wider">
                        Work Experience
                      </h4>
                      <div className="space-y-3">
                        {resumeData.experience.map((exp, i) => (
                          <div key={i} className="text-xs">
                            <div className="flex justify-between font-bold text-slate-900">
                              <span>{exp.role} — <span className="text-slate-700">{exp.company}</span></span>
                              <span className="text-slate-500 font-normal">{exp.duration}</span>
                            </div>
                            <ul className="list-disc list-inside text-slate-600 mt-1 space-y-0.5 text-[11px]">
                              {exp.bullets.map((b, bIdx) => (
                                <li key={bIdx}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {resumeData.skills.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-black uppercase text-slate-900 border-b border-slate-200 pb-0.5 mb-1 tracking-wider">
                        Core Competencies & Technologies
                      </h4>
                      <p className="text-xs text-slate-700">{resumeData.skills.join(' • ')}</p>
                    </div>
                  )}

                  {/* Projects */}
                  {(resumeData.projects || []).length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-black uppercase text-slate-900 border-b border-slate-200 pb-0.5 mb-1 tracking-wider">
                        Projects
                      </h4>
                      <div className="space-y-1.5">
                        {(resumeData.projects || []).map((proj, i) => (
                          <div key={i} className="text-xs">
                            <span className="font-bold text-slate-900">{proj.title}</span>
                            {proj.technologies && <span className="text-slate-500"> ({proj.technologies})</span>}
                            <p className="text-[11px] text-slate-600 mt-0.5">{proj.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Instant Downloads & Save Action Card */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-3xl border border-purple-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#4A154B] text-white flex items-center justify-center font-black">
                      <FileText className="w-5 h-5 text-pink-200" />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-gray-900">
                        Your Complete ATS Resume is Ready!
                      </h4>
                      <p className="text-xs text-gray-600">
                        Download your resume directly in PDF or editable Word (.docx), or apply it to your profile.
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
                      <span>Save & Apply to My Profile</span>
                      <ArrowRight className="w-4 h-4 text-pink-300" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={() => setCreateStep(6)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Summary</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // If rendered as a modal popup
  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="relative w-full max-w-4xl my-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
