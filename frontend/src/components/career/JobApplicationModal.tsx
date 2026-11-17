import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  FileText,
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  Sparkles,
  Send,
  Loader2,
  User,
  Mail,
  Phone,
  GraduationCap,
  Globe,
  Clock,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { JobListing, CandidateApplicationDetails } from '../../types/career';
import { useAuth } from '../../context/AuthContext';
import { useHerCareer } from '../../context/HerCareerContext';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobListing | null;
  onSuccess?: () => void;
  onViewTracker?: () => void;
}

export const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  isOpen,
  onClose,
  job,
  onSuccess,
  onViewTracker
}) => {
  const { user } = useAuth();
  const { profile, activeResume, candidateQualification, applyToJob } = useHerCareer();

  const [formData, setFormData] = useState<CandidateApplicationDetails>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    headline: '',
    qualification: '',
    yearsOfExperience: '',
    skills: [],
    resumeTitle: '',
    portfolioUrl: '',
    coverLetter: '',
    reviewedAndConfirmed: true
  });

  const [skillsInput, setSkillsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedAt, setSubmittedAt] = useState('');

  // Auto-fill candidate details from user profile, active resume, and qualifications whenever modal opens
  useEffect(() => {
    if (!isOpen || !job) {
      setIsSuccess(false);
      return;
    }

    const name = user?.name || profile?.fullName || activeResume?.personalInfo?.fullName || '';
    const email = user?.email || profile?.email || activeResume?.personalInfo?.email || '';
    const phone = user?.phone || profile?.phone || activeResume?.personalInfo?.phone || '';
    const loc = user?.location || profile?.location || activeResume?.personalInfo?.location || job.location || 'Australia';
    const headline = profile?.headline || profile?.targetRole || user?.role || 'Professional Specialist';
    const qual = candidateQualification || user?.education || activeResume?.education?.[0]?.degree || 'Bachelor Degree';
    const exp = profile?.yearsOfExperience ? `${profile.yearsOfExperience} Years` : (user?.experienceLevel || '2+ Years');

    const rawSkills = profile?.primarySkills?.length
      ? profile.primarySkills
      : user?.skills?.length
        ? user.skills
        : (activeResume?.skills?.technical || ['Problem Solving', 'Strategic Communication', 'Project Management']);

    const resTitle = activeResume?.title || 'ATS Verified Resume';
    const portfolio = activeResume?.personalInfo?.portfolioUrl || activeResume?.personalInfo?.linkedinUrl || '';

    const defaultCover = `Dear Hiring Team at ${job.company},

I am excited to submit my candidate application for the ${job.title} opening in ${job.location}. With my background in ${headline} and qualification in ${qual}, I bring verified skills and dedication to excel in this role.

I look forward to discussing how my experience will contribute to the continued success of ${job.company}.

Sincerely,
${name || 'Candidate'}`;

    setFormData({
      fullName: name,
      email,
      phone,
      location: loc,
      headline,
      qualification: qual,
      yearsOfExperience: exp,
      skills: rawSkills,
      resumeTitle: resTitle,
      portfolioUrl: portfolio,
      coverLetter: defaultCover,
      reviewedAndConfirmed: true
    });

    setSkillsInput(rawSkills.join(', '));
    setIsSuccess(false);
  }, [isOpen, job, user, profile, activeResume, candidateQualification]);

  if (!isOpen || !job) return null;

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillsInput(e.target.value);
    const parsed = e.target.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, skills: parsed }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reviewedAndConfirmed) return;

    setIsSubmitting(true);
    try {
      const finalDetails: CandidateApplicationDetails = {
        ...formData,
        skills: skillsInput.split(',').map((s) => s.trim()).filter(Boolean)
      };

      await applyToJob(job.jobId, finalDetails, formData.coverLetter);

      setSubmittedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl my-6 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Application Review
              </span>
              <span className="text-[11px] text-slate-400">Database Sync & Tracking</span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-pink-400" />
              <span>Apply for {job.title}</span>
            </h2>
            <p className="text-xs text-slate-300 flex flex-wrap items-center gap-3 pt-0.5">
              <span className="font-bold text-white">{job.company}</span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location}
              </span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-400">
                <DollarSign className="w-3.5 h-3.5" />
                {job.salaryRange}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {isSuccess ? (
            /* Success State */
            <div className="py-8 px-4 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 border-4 border-emerald-300 flex items-center justify-center text-emerald-600 shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-white tracking-wide shadow-xs">
                  APPLICATION SENT
                </div>
                <h3 className="text-2xl font-black text-slate-900">Application Submitted! 🎉</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your candidate profile and application details for <strong className="text-slate-800">{job.title}</strong> at <strong className="text-slate-800">{job.company}</strong> have been securely saved to your private database tracker.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-lg mx-auto text-left space-y-2 text-xs text-slate-700">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-bold text-slate-900">{formData.fullName} ({formData.email})</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Application Sent
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                  <span className="text-slate-500">Resume Attached:</span>
                  <span className="font-bold text-slate-900">{formData.resumeTitle || 'ATS Resume'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Submission Time:</span>
                  <span className="font-semibold text-slate-600">Today at {submittedAt || 'Just now'}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                {onViewTracker && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onViewTracker();
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    View in Application Tracker
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Review & Edit Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Informational Callout */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-200/80 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-teal-950">
                    Auto-Filled from Your Profile &amp; Resume
                  </h4>
                  <p className="text-[11px] text-teal-800 leading-relaxed">
                    Your candidate information has been pre-populated automatically. Please verify your details below before submitting. All information will be saved to your unique database dashboard.
                  </p>
                </div>
              </div>

              {/* Section 1: Candidate Contact Info */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-pink-500" />
                  <span>1. Candidate Contact Information</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3 py-2 pl-9 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        placeholder="Your full name"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 pl-9 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        placeholder="your.email@domain.com"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 pl-9 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        placeholder="+61 400 000 000"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Current Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 pl-9 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        placeholder="e.g. Sydney, NSW"
                      />
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Qualifications & Experience */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-pink-500" />
                  <span>2. Professional Qualification &amp; Background</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Professional Headline / Role
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.headline}
                        onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                        className="w-full px-3 py-2 pl-9 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        placeholder="e.g. Software Engineer / Data Analyst"
                      />
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Highest Education / Qualification
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.qualification}
                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                        className="w-full px-3 py-2 pl-9 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        placeholder="e.g. Bachelor of Engineering / IT"
                      />
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Years of Experience
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.yearsOfExperience}
                        onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                        className="w-full px-3 py-2 pl-9 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        placeholder="e.g. 3 Years"
                      />
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Portfolio / LinkedIn URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        className="w-full px-3 py-2 pl-9 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        placeholder="https://linkedin.com/in/username"
                      />
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Core Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={handleSkillsChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="e.g. React, Node.js, Communication, AWS, Python"
                  />
                  {formData.skills && formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {formData.skills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Verified Resume Attachment */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-pink-500" />
                  <span>3. Attached Resume / CV</span>
                </h3>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {formData.resumeTitle || 'ATS Verified Resume'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Primary Resume • Auto-attached from your Resume Builder
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>

              {/* Section 4: Personalized Candidate Pitch */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-pink-500" />
                    <span>4. Candidate Cover Note / Pitch</span>
                  </h3>
                  <span className="text-[10px] text-slate-400">Customizable</span>
                </div>
                <textarea
                  rows={4}
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none leading-relaxed"
                  placeholder="Introduce yourself to the hiring team..."
                />
              </div>

              {/* Section 5: Verification & Confirmation Checkbox */}
              <div className="pt-2 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.reviewedAndConfirmed}
                    onChange={(e) => setFormData({ ...formData, reviewedAndConfirmed: e.target.checked })}
                    className="w-4 h-4 rounded border-amber-300 text-pink-600 focus:ring-pink-500 mt-0.5 cursor-pointer"
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-amber-950 block">
                      I have reviewed and confirmed all application details
                    </span>
                    <span className="text-[11px] text-amber-800 block">
                      Please confirm that the auto-filled information is correct and ready to be submitted to {job.company}.
                    </span>
                  </div>
                </label>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.reviewedAndConfirmed}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
