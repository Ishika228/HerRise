import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Wallet,
  Briefcase,
  RotateCcw,
  Rocket,
  Landmark,
  ShoppingBag,
  GraduationCap,
  Users2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Language } from '../../types';

export const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const { user, completeOnboarding, setLanguage } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Step 1: Goals
  const goalOptions = [
    { id: 'g1', label: 'I want to manage my finances', icon: Wallet, color: 'text-purple-700 bg-purple-50' },
    { id: 'g2', label: 'I want to find a job', icon: Briefcase, color: 'text-blue-700 bg-blue-50' },
    { id: 'g3', label: 'I want to restart my career', icon: RotateCcw, color: 'text-pink-700 bg-pink-50' },
    { id: 'g4', label: 'I want to start a business', icon: Rocket, color: 'text-rose-700 bg-rose-50' },
    { id: 'g5', label: 'I need business funding', icon: Landmark, color: 'text-amber-700 bg-amber-50' },
    { id: 'g6', label: 'I want to sell my products', icon: ShoppingBag, color: 'text-emerald-700 bg-emerald-50' },
    { id: 'g7', label: 'I want to learn new skills', icon: GraduationCap, color: 'text-indigo-700 bg-indigo-50' },
    { id: 'g8', label: 'I want to connect with mentors', icon: Users2, color: 'text-violet-700 bg-violet-50' }
  ];

  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // Step 2: Background
  const [education, setEducation] = useState('');
  const [currentStatus, setCurrentStatus] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');

  // Step 3: Skills & Language
  const availableSkillPills = [
    'Digital Marketing', 'Financial Planning', 'D2C Commerce', 'Data Analysis',
    'Project Management', 'Content Creation', 'Accounting / GST', 'Web Development',
    'Customer Relations', 'Handmade Crafts', 'Culinary & Food Prep', 'Leadership'
  ];

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const [chosenLanguage, setChosenLanguage] = useState<Language>(user?.language || 'en');

  const toggleGoal = (label: string) => {
    setSelectedGoals((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleFinish = () => {
    if (selectedGoals.length === 0) {
      showToast('Select at least one goal', 'Please pick 1 or more goals so we can personalize your experience.', 'warning');
      setStep(1);
      return;
    }

    setLanguage(chosenLanguage);
    completeOnboarding(selectedGoals, {
      education,
      currentStatus,
      experienceLevel,
      skills: selectedSkills,
      language: chosenLanguage
    });

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    showToast('Personalization Complete!', 'Welcome to your tailored HerRise AI dashboard.', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#faf9fd] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-[#4A154B] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#fb7185]" />
            Personalized Onboarding Wizard
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Tailor HerRise to Your Aspirations
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Step {step} of 3 — We personalize your financial tools, job alerts, and mentor recommendations.
          </p>

          {/* Stepper Progress */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    step === num
                      ? 'bg-[#4A154B] text-white ring-4 ring-purple-100'
                      : step > num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > num ? '✓' : num}
                </div>
                {num < 3 && (
                  <div
                    className={`w-12 sm:w-20 h-1 mx-1 rounded-full ${
                      step > num ? 'bg-emerald-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Card Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-purple-100">
          {/* STEP 1: GOALS */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">What are your primary goals?</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Select all that apply to you. You can update these anytime in your profile.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {goalOptions.map((goal) => {
                  const isSelected = selectedGoals.includes(goal.label);
                  const Icon = goal.icon;
                  return (
                    <div
                      key={goal.id}
                      onClick={() => toggleGoal(goal.label)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#4A154B] bg-purple-50/50 shadow-xs'
                          : 'border-gray-100 hover:border-purple-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${goal.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-800">
                          {goal.label}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#4A154B] border-[#4A154B] text-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 bg-[#4A154B] hover:bg-[#350c36] text-white px-7 py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  <span>Next: Professional Background</span>
                  <ArrowRight className="w-4 h-4 text-pink-300" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PROFESSIONAL BACKGROUND */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Your Background & Current Status</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Helps us tune career returnship programs and business incubator roadmaps.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Highest Education
                  </label>
                  <select
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-sm outline-none cursor-pointer"
                  >
                    <option value="High School / Diploma">High School / Diploma</option>
                    <option value="Bachelor Degree">Bachelor's Degree (B.Com, BBA, B.Tech, B.A., etc.)</option>
                    <option value="Master Degree">Master's Degree / Post-Graduation (MBA, M.Com, M.Sc, etc.)</option>
                    <option value="Professional Certification (CA, CS, Law)">Professional Qualification (CA, CS, CFA, Law)</option>
                    <option value="Doctorate / PhD">Doctorate / PhD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Current Professional Status
                  </label>
                  <select
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-sm outline-none cursor-pointer"
                  >
                    <option value="Career Break / Exploring New Ventures">On Career Break (Caregiving, Family, or Sabbatical)</option>
                    <option value="Employed Full-time">Employed Full-time (Seeking side business or career pivot)</option>
                    <option value="Freelancer / Consultant">Freelancer / Independent Consultant</option>
                    <option value="Micro-Enterprise Founder">Small Business Owner / Artisan / Maker</option>
                    <option value="Recent College Graduate">Recent College Graduate</option>
                    <option value="Homemaker">Homemaker Seeking Financial Independence</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Total Career Experience
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-sm outline-none cursor-pointer"
                  >
                    <option value="First-time entrant / 0 years">First-time entrant / 0 years</option>
                    <option value="1-2 Years Experience">1 to 2 Years</option>
                    <option value="3-5 Years Experience">3 to 5 Years</option>
                    <option value="6-10 Years Experience">6 to 10 Years</option>
                    <option value="10+ Years Leadership Experience">10+ Years Leadership Experience</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 bg-[#4A154B] hover:bg-[#350c36] text-white px-7 py-3 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  <span>Next: Skills & Preferences</span>
                  <ArrowRight className="w-4 h-4 text-pink-300" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SKILLS & PREFERRED LANGUAGE */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Skills, Interests & Language</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Pick your strongest skills and confirm your preferred learning language.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Your Skills & Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSkillPills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#4A154B] text-white shadow-xs'
                            : 'bg-purple-50 text-gray-700 hover:bg-purple-100 border border-purple-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Preferred Platform Language
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { code: 'en' as Language, title: 'English', desc: 'Standard Interface' },
                    { code: 'hi' as Language, title: 'हिन्दी', desc: 'Hindi Localization' },
                    { code: 'mr' as Language, title: 'मराठी', desc: 'Marathi Localization' }
                  ].map((lang) => (
                    <div
                      key={lang.code}
                      onClick={() => setChosenLanguage(lang.code)}
                      className={`p-3 rounded-2xl border-2 text-center cursor-pointer transition-all ${
                        chosenLanguage === lang.code
                          ? 'border-[#4A154B] bg-purple-50/50'
                          : 'border-gray-200 hover:border-purple-200'
                      }`}
                    >
                      <h4 className="font-bold text-sm text-gray-900">{lang.title}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">{lang.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-purple-50">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#4A154B] to-[#be185d] hover:opacity-95 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-950/20 transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4 text-pink-300" />
                  <span>Launch My HerRise Platform</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

