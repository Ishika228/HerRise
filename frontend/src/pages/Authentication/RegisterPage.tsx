import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Globe,
  ArrowRight,
  CheckCircle2,
  FileText,
  Upload,
  Wand2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Language } from '../../types';
import { ResumeIntakeModal } from '../../components/resume/ResumeIntakeModal';
import { AtsResumeData } from '../../services/resumeExportService';

export const RegisterPage: React.FC = () => {
  const [stage, setStage] = useState<'credentials' | 'resume'>('credentials');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: '',
    language: 'en' as Language,
    agreedToTerms: false
  });

  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast('Password Mismatch', 'Passwords do not match. Please re-check.', 'error');
      return;
    }
    if (!formData.agreedToTerms) {
      showToast('Terms Required', 'Please accept the terms and conditions.', 'warning');
      return;
    }

    // Advance to Resume & Career Profile Stage
    setStage('resume');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResumeComplete = async (resumeData: AtsResumeData) => {
    setLoading(true);
    try {
      await register({
        name: resumeData.fullName || formData.name,
        email: resumeData.email || formData.email,
        phone: resumeData.phone || formData.phone,
        location: resumeData.location || formData.location,
        language: formData.language,
        password: formData.password,
        resumeData
      });

      showToast('Account & ATS Resume Ready!', 'Welcome to HerRise AI. Your resume has been formatted and saved.', 'success');
      navigate('/onboarding');
    } catch (e: any) {
      showToast('Registration Error', e.message || 'Could not complete registration', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipResume = async () => {
    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        language: formData.language,
        password: formData.password
      });

      showToast('Account Created!', 'You can create or upload your ATS resume anytime in the Career Hub.', 'success');
      navigate('/onboarding');
    } catch (e: any) {
      showToast('Registration Error', e.message || 'Could not complete registration', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9fd] flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center relative z-10 px-4">
        <Link to="/" className="inline-flex items-center gap-3 group mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3b0764] via-[#4A154B] to-[#e11d48] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 text-pink-200" />
          </div>
          <span className="font-extrabold text-3xl tracking-tight text-gray-900">
            HerRise<span className="text-[#fb7185]">AI</span>
          </span>
        </Link>

        {stage === 'credentials' ? (
          <>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Create Your HerRise Account
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-600">
              Her Future. Her Finance. Her Freedom. Join the ecosystem.
            </p>
          </>
        ) : (
          <>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#4A154B] text-xs font-bold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Step 2 of 2: AI Resume & Career Profile</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Upload or Build Your ATS-Friendly Resume
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-600">
              Our AI extracts your details, scans for missing items, and formats an ATS-compliant resume downloadable in Word and PDF.
            </p>
          </>
        )}
      </div>

      {/* STAGE 1: CREDENTIALS FORM */}
      {stage === 'credentials' && (
        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0 relative z-10">
          <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-purple-100 sm:px-10">
            {/* Progress Bar Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 text-xs">
              <span className="font-extrabold text-[#4A154B]">Step 1: Account Credentials</span>
              <span className="text-gray-400">Step 2: Resume & ATS Sync →</span>
            </div>

            <form className="space-y-4" onSubmit={handleCredentialsSubmit}>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Your Full Name"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-sm outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email & Mobile Number Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-sm outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Location & Preferred Language Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    City / Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Bengaluru, Pune"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Preferred Language
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value as Language })}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-sm outline-none transition-all cursor-pointer"
                    >
                      <option value="en">English (Default)</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                      <option value="mr">मराठी (Marathi)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-sm outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={formData.agreedToTerms}
                  onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                  className="mt-0.5 rounded text-[#4A154B] focus:ring-[#4A154B] cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-xs text-gray-600 leading-tight">
                  I agree to the{' '}
                  <a href="#terms" className="text-[#4A154B] font-bold hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#privacy" className="text-[#4A154B] font-bold hover:underline">
                    Privacy Policy
                  </a>.
                </label>
              </div>

              {/* Submit to Step 2 Button */}
              <button
                type="submit"
                className="w-full mt-4 flex items-center justify-center gap-2 bg-[#4A154B] hover:bg-[#350c36] text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-purple-950/20 hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Continue to Resume & Career Profile</span>
                <ArrowRight className="w-4 h-4 text-pink-300" />
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-[#4A154B] hover:underline">
                  Sign In here
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: RESUME INTAKE & ATS BUILDER MODAL */}
      {stage === 'resume' && (
        <div className="relative z-10 px-4 sm:px-6 lg:px-8">
          <ResumeIntakeModal
            initialName={formData.name}
            initialEmail={formData.email}
            initialPhone={formData.phone}
            initialLocation={formData.location}
            onComplete={handleResumeComplete}
            onSkip={handleSkipResume}
          />

          {/* Skip option */}
          <div className="text-center pt-2 pb-6">
            <button
              type="button"
              onClick={handleSkipResume}
              className="text-xs font-semibold text-gray-500 hover:text-gray-800 underline cursor-pointer"
            >
              Skip resume setup for now & proceed to goals →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
