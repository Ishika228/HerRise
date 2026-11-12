import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Briefcase,
  CheckCircle2,
  Upload,
  RefreshCw,
  Wand2,
  ArrowRight,
  Wallet,
  Rocket,
  Landmark,
  GraduationCap,
  Users2,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ResumeIntakeModal } from '../../components/resume/ResumeIntakeModal';
import { AtsResumeData } from '../../services/resumeExportService';

interface GoalOption {
  id: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const AVAILABLE_GOALS: GoalOption[] = [
  {
    id: 'career',
    title: 'Find Tech Jobs & Returnships',
    desc: 'Match 14+ high-paying roles tailored to your stack',
    icon: Briefcase,
    color: 'border-pink-200 bg-pink-50/60 text-[#be185d]'
  },
  {
    id: 'finance',
    title: 'Manage Finances & Grow Savings',
    desc: 'Automated 50/30/20 budgeting & liquid cashflow tracking',
    icon: Wallet,
    color: 'border-purple-200 bg-purple-50/60 text-[#4A154B]'
  },
  {
    id: 'business',
    title: 'Launch or Scale a Business',
    desc: 'Startup toolkit, business plan generator & digital store',
    icon: Rocket,
    color: 'border-rose-200 bg-rose-50/60 text-[#e11d48]'
  },
  {
    id: 'funding',
    title: 'Access Grants & Women Schemes',
    desc: 'Stand-Up India, SIDBI & collateral-free micro-grants',
    icon: Landmark,
    color: 'border-amber-200 bg-amber-50/60 text-[#d97706]'
  },
  {
    id: 'learning',
    title: 'Upskill with AI & Tech Courses',
    desc: 'Hands-on certifications in React, Python, Cloud & AI',
    icon: GraduationCap,
    color: 'border-blue-200 bg-blue-50/60 text-[#2563eb]'
  },
  {
    id: 'mentorship',
    title: 'Connect with Women Leaders',
    desc: '1-on-1 career guidance with senior engineering mentors',
    icon: Users2,
    color: 'border-indigo-200 bg-indigo-50/60 text-[#4f46e5]'
  }
];

export const RegisterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fast-ai' | 'no-resume'>('fast-ai');
  const [noResumeSubTab, setNoResumeSubTab] = useState<'builder' | 'manual'>('manual');

  // Fast AI File State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState('');
  const [showPasteText, setShowPasteText] = useState(false);
  const [pastedText, setPastedText] = useState('');

  // Analyzed Resume Data
  const [extractedData, setExtractedData] = useState<AtsResumeData | null>(null);
  const [missingFields, setMissingFields] = useState<Array<{ field: string; label: string; reason: string }>>([]);

  // User Intent / Goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Find Tech Jobs & Returnships',
    'Manage Finances & Grow Savings'
  ]);

  // Account Security
  const [password, setPassword] = useState('');

  // Manual fallback state (for users who choose manual sign-up)
  const [manualForm, setManualForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Analyze Resume with Groq AI
  const handleAnalyzeResume = async () => {
    if (!selectedFile && !pastedText.trim()) {
      showToast('Resume Required', 'Please select a resume file (.docx, .pdf) or paste resume text.', 'warning');
      return;
    }

    setIsParsing(true);
    setParseProgress('Uploading document...');

    try {
      let response: Response;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('resume', selectedFile);
        setParseProgress('Groq AI extracting candidate identity, skills, experience & education...');
        response = await fetch('http://localhost:5000/api/career/parse-resume', {
          method: 'POST',
          body: formData
        });
      } else {
        setParseProgress('Groq AI analyzing resume text...');
        response = await fetch('http://localhost:5000/api/career/parse-resume', {
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
        const atsData: AtsResumeData = {
          fullName: p.fullName || 'Candidate',
          email: p.email || '',
          phone: p.phone || '',
          location: p.location || '',
          headline: p.headline || 'Full Stack Developer',
          summary: p.summary || '',
          skills: Array.isArray(p.skills) ? p.skills : [],
          experience: Array.isArray(p.experience) ? p.experience : [],
          education: Array.isArray(p.education) ? p.education : [],
          certifications: Array.isArray(p.certifications) ? p.certifications : [],
          languages: Array.isArray(p.languages) && p.languages.length > 0 ? p.languages : ['English']
        };

        setExtractedData(atsData);

        // Check if anything essential is missing
        const detectedMissing: Array<{ field: string; label: string; reason: string }> = [];
        if (!atsData.phone || atsData.phone.trim().length < 6) {
          detectedMissing.push({
            field: 'phone',
            label: 'Mobile Number',
            reason: 'Required for recruiters and verification.'
          });
        }
        if (!atsData.location || atsData.location.trim().length < 2) {
          detectedMissing.push({
            field: 'location',
            label: 'Current City / Location',
            reason: 'Needed for location-based and remote job filters.'
          });
        }
        if (!atsData.email || !atsData.email.includes('@')) {
          detectedMissing.push({
            field: 'email',
            label: 'Email Address',
            reason: 'Needed for your account login.'
          });
        }

        setMissingFields(detectedMissing);
        showToast('Resume Analyzed!', `Welcome ${atsData.fullName}. Details extracted with Groq AI.`, 'success');
      } else {
        throw new Error(json.error || 'Failed to parse resume.');
      }
    } catch (err: any) {
      console.error('[Register] Parse error:', err);
      showToast('Extraction Notice', err?.message || 'Could not parse document. Please check the file or paste your resume text.', 'error');
    } finally {
      setIsParsing(false);
      setParseProgress('');
    }
  };

  // Toggle Goal selection
  const toggleGoal = (title: string) => {
    setSelectedGoals((prev) =>
      prev.includes(title) ? prev.filter((g) => g !== title) : [...prev, title]
    );
  };

  // Complete Fast AI Registration
  const handleFastAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!extractedData) {
      showToast('Resume Required', 'Please upload or paste your resume first so Groq AI can extract your profile.', 'warning');
      return;
    }

    if (!extractedData.email || !extractedData.email.includes('@')) {
      showToast('Email Required', 'Please provide a valid email address.', 'warning');
      return;
    }

    if (missingFields.length > 0) {
      showToast('Missing Details', 'Please complete the highlighted missing items above.', 'warning');
      return;
    }

    if (!password || password.length < 6) {
      showToast('Password Required', 'Please enter a password with at least 6 characters.', 'warning');
      return;
    }

    if (selectedGoals.length === 0) {
      showToast('Select What You Want', 'Please pick at least 1 goal so we can customize your dashboard.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: extractedData.fullName,
        email: extractedData.email,
        phone: extractedData.phone,
        location: extractedData.location,
        password,
        goals: selectedGoals,
        resumeData: extractedData
      });

      showToast('Account Created!', `Welcome ${extractedData.fullName}! Your personalized dashboard is ready.`, 'success');
      navigate('/dashboard');
    } catch (err: any) {
      showToast('Registration Error', err.message || 'Could not complete registration', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Complete Manual Sign-Up (Tab 2)
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!manualForm.name || !manualForm.email || !manualForm.password) {
      showToast('Required Fields', 'Please fill in your name, email, and password.', 'warning');
      return;
    }

    if (selectedGoals.length === 0) {
      showToast('Select What You Want', 'Please select at least 1 goal.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: manualForm.name,
        email: manualForm.email,
        phone: manualForm.phone,
        location: manualForm.location,
        password: manualForm.password,
        goals: selectedGoals
      });

      showToast('Account Created!', `Welcome to HerRise AI, ${manualForm.name}!`, 'success');
      navigate('/dashboard');
    } catch (err: any) {
      showToast('Registration Error', err.message || 'Could not complete registration', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Complete Resume Builder Flow (Tab 2 ATS Builder)
  const handleBuilderComplete = async (atsResume: AtsResumeData) => {
    setLoading(true);
    try {
      await register({
        name: atsResume.fullName,
        email: atsResume.email,
        phone: atsResume.phone,
        location: atsResume.location,
        password: 'password123',
        goals: selectedGoals,
        resumeData: atsResume
      });

      showToast('Profile & Resume Saved!', 'Your ATS resume has been created and your dashboard is live.', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      showToast('Registration Error', err.message || 'Could not complete registration', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9fd] flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center relative z-10 px-4">
        <Link to="/" className="inline-flex items-center gap-3 group mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3b0764] via-[#4A154B] to-[#e11d48] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 text-pink-200" />
          </div>
          <span className="font-extrabold text-3xl tracking-tight text-gray-900">
            HerRise<span className="text-[#fb7185]">AI</span>
          </span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Create Your HerRise Account
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
          Upload your resume for instant Groq AI extraction — no need to re-type your details. Just pick what you want and launch your personalized dashboard!
        </p>
      </div>

      {/* Main Registration Container */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-3xl px-4 sm:px-0 relative z-10">
        <div className="bg-white shadow-xl rounded-3xl border border-purple-100 overflow-hidden">
          {/* Top Mode Tabs */}
          <div className="bg-gradient-to-r from-[#3b0764] via-[#4A154B] to-[#be185d] p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-pink-200">Registration Mode</span>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('fast-ai')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'fast-ai'
                    ? 'bg-white text-[#4A154B] shadow-md'
                    : 'text-purple-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>⚡ Fast AI Resume Registration (Recommended)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('no-resume')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'no-resume'
                    ? 'bg-white text-[#4A154B] shadow-md'
                    : 'text-purple-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Don't Have a Resume?</span>
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* ========================================================= */}
            {/* TAB 1: FAST AI RESUME REGISTRATION                        */}
            {/* ========================================================= */}
            {activeTab === 'fast-ai' && (
              <form onSubmit={handleFastAiSubmit} className="space-y-6">
                {/* STEP 1: UPLOAD & GROQ AI EXTRACTION */}
                {!extractedData ? (
                  <div className="border-2 border-dashed border-purple-200 hover:border-[#4A154B] rounded-2xl p-6 sm:p-8 text-center bg-purple-50/30 transition-all space-y-4">
                    <input
                      type="file"
                      id="reg-resume-file"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="reg-resume-file" className="cursor-pointer block space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-purple-100 text-[#4A154B] flex items-center justify-center mx-auto shadow-xs">
                        <Upload className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900">
                          {selectedFile ? selectedFile.name : 'Upload Your Resume File'}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Supports <span className="font-semibold text-gray-700">Word (.docx), PDF (.pdf), or Text (.txt)</span> (Max 10MB)
                        </p>
                      </div>
                      {selectedFile && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>File Selected: {(selectedFile.size / 1024).toFixed(1)} KB</span>
                        </div>
                      )}
                    </label>

                    {/* Paste text toggle */}
                    <div className="pt-2 border-t border-purple-100 flex flex-col items-center gap-2">
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
                          placeholder="Paste the raw text of your resume here..."
                          className="w-full text-xs p-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-[#4A154B] leading-relaxed"
                        />
                      )}
                    </div>

                    {/* Trigger Parse Button */}
                    {(selectedFile || pastedText.trim()) && (
                      <div className="pt-2">
                        <button
                          type="button"
                          disabled={isParsing}
                          onClick={handleAnalyzeResume}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4A154B] hover:bg-[#350c36] text-white px-8 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isParsing ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin text-pink-300" />
                              <span>{parseProgress || 'Groq AI Extracting All Resume Details...'}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-pink-300" />
                              <span>Analyze Resume with Groq AI</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* AI ANALYZED CONFIRMATION CARD */
                  <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-white p-5 rounded-2xl border border-purple-200 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Groq AI Analyzed Your Resume Successfully</span>
                        </div>
                        <h2 className="text-lg font-black text-gray-900">{extractedData.fullName}</h2>
                        <p className="text-xs font-bold text-[#4A154B]">{extractedData.headline}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setExtractedData(null);
                          setSelectedFile(null);
                          setPastedText('');
                        }}
                        className="text-xs text-purple-700 hover:text-purple-900 font-bold underline cursor-pointer shrink-0"
                      >
                        Change Resume
                      </button>
                    </div>

                    {/* Extracted Details Identity Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-gray-700 pt-1">
                      <div className="bg-white/80 p-2.5 rounded-xl border border-purple-100 flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="truncate">{extractedData.email || 'Email missing'}</span>
                      </div>
                      <div className="bg-white/80 p-2.5 rounded-xl border border-purple-100 flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="truncate">{extractedData.phone || 'Phone missing'}</span>
                      </div>
                      <div className="bg-white/80 p-2.5 rounded-xl border border-purple-100 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="truncate">{extractedData.location || 'Location missing'}</span>
                      </div>
                    </div>

                    {/* Skills Detected */}
                    {extractedData.skills.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold">
                          <span>Extracted Skills ({extractedData.skills.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {extractedData.skills.slice(0, 10).map((s) => (
                            <span
                              key={s}
                              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-100 text-[#4A154B]"
                            >
                              {s}
                            </span>
                          ))}
                          {extractedData.skills.length > 10 && (
                            <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-gray-100 text-gray-600">
                              +{extractedData.skills.length - 10} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Truly Missing Details Inline Inputs (Only if missing from resume!) */}
                    {missingFields.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-2 mt-2">
                        <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Please provide the missing detail(s) to finalize your profile:</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {missingFields.map((missing) => (
                            <div key={missing.field}>
                              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                {missing.label}
                              </label>
                              <input
                                type={missing.field === 'phone' ? 'tel' : missing.field === 'email' ? 'email' : 'text'}
                                value={(extractedData as any)[missing.field] || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setExtractedData({ ...extractedData, [missing.field]: val });
                                  if (val.trim().length > 3) {
                                    setMissingFields((prev) => prev.filter((m) => m.field !== missing.field));
                                  }
                                }}
                                placeholder={`Enter your ${missing.label.toLowerCase()}`}
                                className="w-full text-xs px-3 py-1.5 bg-white border border-amber-300 rounded-lg outline-none focus:border-[#4A154B]"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2: "JUST ASK WHAT THE USER WANTS" - GOAL SELECTION */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900">
                        What would you like to achieve on HerRise AI?
                      </h3>
                      <p className="text-xs text-gray-500">
                        Select one or more goals — we tailor your dashboard & modules accordingly.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#4A154B]">
                      {selectedGoals.length} Selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {AVAILABLE_GOALS.map((goal) => {
                      const Icon = goal.icon;
                      const isSelected = selectedGoals.includes(goal.title);
                      return (
                        <div
                          key={goal.id}
                          onClick={() => toggleGoal(goal.title)}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2 shadow-2xs hover:shadow-xs ${
                            isSelected
                              ? `${goal.color} border-[#4A154B] ring-2 ring-[#4A154B]/20`
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="w-8 h-8 rounded-xl bg-white shadow-2xs flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4 text-[#4A154B]" />
                            </div>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // handled by parent div
                              className="rounded text-[#4A154B] focus:ring-[#4A154B] w-4 h-4 cursor-pointer mt-1"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-900">{goal.title}</h4>
                            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{goal.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* STEP 3: ACCOUNT PASSWORD */}
                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Create Account Password
                  </label>
                  <div className="relative max-w-md">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-xs outline-none transition-all"
                    />
                  </div>
                </div>

                {/* FINAL SUBMIT BUTTON */}
                <div className="pt-4 border-t border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[11px] text-gray-500">
                    By registering, you agree to HerRise AI Terms of Service and Privacy Policy.
                  </p>

                  <button
                    type="submit"
                    disabled={loading || !extractedData}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#4A154B] hover:bg-[#350c36] text-white px-8 py-3.5 rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-pink-300" />
                        <span>Setting Up Your Dashboard...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account & Open My Dashboard</span>
                        <ArrowRight className="w-4 h-4 text-pink-300" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ========================================================= */}
            {/* TAB 2: DON'T HAVE A RESUME? (BUILDER & MANUAL FORM)       */}
            {/* ========================================================= */}
            {activeTab === 'no-resume' && (
              <div className="space-y-6">
                {/* Sub-tab selection */}
                <div className="flex gap-2 border-b border-gray-200 pb-3">
                  <button
                    type="button"
                    onClick={() => setNoResumeSubTab('manual')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      noResumeSubTab === 'manual'
                        ? 'bg-[#4A154B] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Quick Sign-Up (No Resume)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoResumeSubTab('builder')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      noResumeSubTab === 'builder'
                        ? 'bg-[#4A154B] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Build ATS Resume with Interactive Wizard
                  </button>
                </div>

                {noResumeSubTab === 'manual' ? (
                  /* Standard Quick Form */
                  <form onSubmit={handleManualSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={manualForm.name}
                            onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                            placeholder="Your full name"
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-xs outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={manualForm.email}
                            onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                            placeholder="name@example.com"
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-xs outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Mobile Number
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            value={manualForm.phone}
                            onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-xs outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          City / Location
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={manualForm.location}
                            onChange={(e) => setManualForm({ ...manualForm, location: e.target.value })}
                            placeholder="e.g. Amritsar, Punjab"
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-xs outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          value={manualForm.password}
                          onChange={(e) => setManualForm({ ...manualForm, password: e.target.value })}
                          placeholder="Minimum 6 characters"
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-xs outline-none"
                        />
                      </div>
                    </div>

                    {/* Goal Selection */}
                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                        What are your main goals?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {AVAILABLE_GOALS.map((goal) => {
                          const isSelected = selectedGoals.includes(goal.title);
                          return (
                            <button
                              key={goal.id}
                              type="button"
                              onClick={() => toggleGoal(goal.title)}
                              className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-purple-100 border-[#4A154B] text-[#4A154B]'
                                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <span>{goal.title}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-[#4A154B]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-[#4A154B] hover:bg-[#350c36] text-white py-3.5 rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer mt-4"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-pink-300" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account & Open Dashboard</span>
                          <ArrowRight className="w-4 h-4 text-pink-300" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Interactive ATS Resume Builder (with Word and PDF download) */
                  <ResumeIntakeModal
                    onComplete={handleBuilderComplete}
                    onSkip={() => setNoResumeSubTab('manual')}
                  />
                )}
              </div>
            )}
          </div>

          {/* Footer sign in link */}
          <div className="bg-gray-50/70 p-4 border-t border-purple-50 text-center text-xs text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#4A154B] hover:underline">
              Sign In here →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
