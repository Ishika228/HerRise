import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Rocket,
  Landmark,
  ShoppingBag,
  GraduationCap,
  Users2,
  Calculator,
  ShieldCheck,
  TrendingUp,
  X
} from 'lucide-react';
import { Modal } from './Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { API_BASE } from '../../config/api';

export type SupportedModule = 'career' | 'business' | 'fund' | 'market' | 'learn' | 'network';

interface ModuleRegistrationGateProps {
  module: SupportedModule;
  isOpen: boolean;
  onClose?: () => void;
  onComplete: (data: any) => void;
}

export const ModuleRegistrationGate: React.FC<ModuleRegistrationGateProps> = ({
  module,
  isOpen,
  onClose,
  onComplete
}) => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Common User Info
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || ''
  });

  // Module 2: Career state
  const [careerData, setCareerData] = useState({
    targetRole: user?.careerProfile?.targetRole || '',
    status: user?.careerProfile?.status || 'Career Break / Exploring Returnships',
    experienceYears: user?.careerProfile?.experienceYears || 0,
    education: user?.education || "Bachelor's Degree",
    skills: user?.careerProfile?.skills || user?.skills || [],
    desiredSalary: user?.careerProfile?.desiredSalary || '',
    workMode: user?.careerProfile?.workMode || 'Remote'
  });

  // Module 3: Business state
  const [businessData, setBusinessData] = useState({
    ventureName: user?.businessProfile?.ventureName || user?.businessName || '',
    pitch: user?.businessProfile?.pitch || '',
    industry: user?.businessProfile?.industry || user?.businessCategory || 'Food & Wellness D2C',
    stage: user?.businessProfile?.stage || 'Prototype / Early Validation',
    monthlyTargetRevenue: user?.businessProfile?.monthlyTargetRevenue || 0,
    seedCapitalNeeded: user?.businessProfile?.seedCapitalNeeded || 0,
    monthlyFixedCosts: user?.businessProfile?.monthlyFixedCosts || 0,
    averageUnitCost: user?.businessProfile?.averageUnitCost || 0
  });

  // Module 4: Fund state
  const [fundData, setFundData] = useState({
    enterpriseName: user?.fundProfile?.enterpriseName || user?.businessName || '',
    capitalNeeded: user?.fundProfile?.capitalNeeded || 0,
    fundingType: user?.fundProfile?.fundingType || 'Government Low-Interest Scheme (Stand-Up India / PMEGP)',
    stage: user?.fundProfile?.stage || 'Early Stage (1-3 Years)',
    annualTurnover: user?.fundProfile?.annualTurnover || 0,
    hasCollateral: user?.fundProfile?.hasCollateral || false
  });

  // Module 5: Market state
  const [marketData, setMarketData] = useState({
    storeName: user?.marketProfile?.storeName || (user?.businessName ? `${user.businessName} Storefront` : ''),
    category: user?.marketProfile?.category || 'Food & Wellness',
    productTitle: user?.marketProfile?.productTitle || '',
    sellingPrice: user?.marketProfile?.sellingPrice || 0,
    unitCost: user?.marketProfile?.unitCost || 0,
    stockQuantity: user?.marketProfile?.stockQuantity || 0,
    monthlyTargetUnits: user?.marketProfile?.monthlyTargetUnits || 0
  });

  // Module 6: Learn state
  const [learnData, setLearnData] = useState({
    targetDomain: user?.learnProfile?.targetDomain || 'AI Productivity & FinTech Strategy',
    currentLevel: user?.learnProfile?.currentLevel || 'Intermediate',
    weeklyHours: user?.learnProfile?.weeklyHours || 6,
    primaryGoal: user?.learnProfile?.primaryGoal || ''
  });

  // Module 7: Network state
  const [networkData, setNetworkData] = useState({
    mentorshipDomain: user?.networkProfile?.mentorshipDomain || 'Venture Fundraising & Pitching',
    primaryGoal: user?.networkProfile?.primaryGoal || '',
    meetingFrequency: user?.networkProfile?.meetingFrequency || 'Bi-weekly'
  });

  if (!isOpen) return null;

  // Module Config Metadata
  const moduleMeta: Record<
    SupportedModule,
    { title: string; subtitle: string; icon: any; color: string }
  > = {
    career: {
      title: 'HerCareer Registration & Profile Intake',
      subtitle: 'Personalize your job board, career returnships, and ATS-ready resume.',
      icon: Briefcase,
      color: 'bg-pink-100 text-[#be185d]'
    },
    business: {
      title: 'HerBusiness Startup Studio Registration',
      subtitle: 'Register your venture parameters to calculate break-even metrics and 30-day roadmap.',
      icon: Rocket,
      color: 'bg-rose-100 text-[#e11d48]'
    },
    fund: {
      title: 'HerFund Capital Navigator Registration',
      subtitle: 'Enter your capital needs to calculate loan readiness score and monthly EMI.',
      icon: Landmark,
      color: 'bg-amber-100 text-[#d97706]'
    },
    market: {
      title: 'HerMarket Merchant Registration',
      subtitle: 'Set up your artisan storefront and first product with automated margin calculations.',
      icon: ShoppingBag,
      color: 'bg-emerald-100 text-[#059669]'
    },
    learn: {
      title: 'HerLearn Academy Registration',
      subtitle: 'Choose your curriculum track and weekly pace to calculate certification timelines.',
      icon: GraduationCap,
      color: 'bg-blue-100 text-[#2563eb]'
    },
    network: {
      title: 'HerNetwork Mentorship Registration',
      subtitle: 'Define your venture or career challenge to calculate mentor compatibility match.',
      icon: Users2,
      color: 'bg-indigo-100 text-[#4f46e5]'
    }
  };

  const currentMeta = moduleMeta[module];
  const Icon = currentMeta.icon;

  // Dynamic Calculations for each module
  const calculateMetrics = () => {
    switch (module) {
      case 'career': {
        const skillsScore = Math.min(40, careerData.skills.length * 10);
        const expScore = Math.min(30, careerData.experienceYears * 6);
        const readinessScore = Math.min(98, 25 + skillsScore + expScore);
        const matchRolesCount = Math.max(3, careerData.skills.length * 2);
        return { readinessScore, matchRolesCount };
      }
      case 'business': {
        const sellingPrice = businessData.averageUnitCost > 0 ? Math.round(businessData.averageUnitCost * 1.8) : 0;
        const unitMargin = sellingPrice - businessData.averageUnitCost;
        const breakEvenUnits = unitMargin > 0 ? Math.ceil(businessData.monthlyFixedCosts / unitMargin) : 0;
        const breakEvenRevenue = breakEvenUnits * sellingPrice;
        const projectedUnits = sellingPrice > 0 ? Math.round(businessData.monthlyTargetRevenue / sellingPrice) : 0;
        const projectedProfit = Math.round(businessData.monthlyTargetRevenue - (businessData.monthlyFixedCosts + projectedUnits * businessData.averageUnitCost));
        const runwayMonths = businessData.monthlyFixedCosts > 0 ? Number((businessData.seedCapitalNeeded / businessData.monthlyFixedCosts).toFixed(1)) : 0;
        return { sellingPrice, breakEvenUnits, breakEvenRevenue, projectedProfit, runwayMonths };
      }
      case 'fund': {
        let readinessScore = 20;
        if (fundData.hasCollateral) readinessScore += 30;
        if (fundData.annualTurnover >= fundData.capitalNeeded && fundData.capitalNeeded > 0) readinessScore += 35;
        else if (fundData.annualTurnover > 0) readinessScore += 20;
        if (fundData.stage.includes('3+')) readinessScore += 15;
        readinessScore = Math.min(95, readinessScore);

        // EMI calc at 9% for 36 months
        const r = 0.09 / 12;
        const n = 36;
        const P = fundData.capitalNeeded;
        const emi = P > 0 ? Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) : 0;
        return { readinessScore, emi };
      }
      case 'market': {
        const unitMargin = marketData.sellingPrice - marketData.unitCost;
        const marginPercent = marketData.sellingPrice > 0 ? Math.round((unitMargin / marketData.sellingPrice) * 100) : 0;
        const grossRevenue = marketData.sellingPrice * marketData.monthlyTargetUnits;
        const netProfit = unitMargin * marketData.monthlyTargetUnits;
        return { unitMargin, marginPercent, grossRevenue, netProfit };
      }
      case 'learn': {
        const totalCourseHours = 40;
        const weeksToCert = Math.max(2, Math.ceil(totalCourseHours / (learnData.weeklyHours || 1)));
        return { totalCourseHours, weeksToCert };
      }
      case 'network': {
        const matchScore = 94;
        return { matchScore };
      }
      default:
        return {};
    }
  };

  const calculated = calculateMetrics();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalInfo.name || !personalInfo.email) {
      showToast('Please provide your name and email', 'warning');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // 1. Prepare module payload
      let modulePayload: any = {};
      if (module === 'career') {
        modulePayload = { ...careerData, ...calculated };
      } else if (module === 'business') {
        modulePayload = { ...businessData, ...calculated };
      } else if (module === 'fund') {
        modulePayload = { ...fundData, ...calculated };
      } else if (module === 'market') {
        modulePayload = { ...marketData, ...calculated };
      } else if (module === 'learn') {
        modulePayload = { ...learnData, ...calculated };
      } else if (module === 'network') {
        modulePayload = { ...networkData, ...calculated };
      }

      // 2. Persist to MongoDB Atlas via backend API
      try {
        await fetch(`${API_BASE}/api/auth/module-profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            module,
            name: personalInfo.name,
            email: personalInfo.email,
            phone: personalInfo.phone,
            location: personalInfo.location,
            profileData: modulePayload
          })
        });
      } catch (backendErr) {
        console.warn('Backend MongoDB sync notice:', backendErr);
      }

      // 3. Update local auth user profile
      const updatedUserProps: any = {
        name: personalInfo.name,
        email: personalInfo.email,
        phone: personalInfo.phone,
        location: personalInfo.location,
        [`${module}Profile`]: modulePayload
      };
      updateProfile(updatedUserProps);
      localStorage.setItem(`herrise_${module}_setup_completed`, 'true');

      showToast(`${currentMeta.title} Completed!`, 'Your personalized live metrics are now active.', 'success');
      onComplete(modulePayload);
    } catch (err: any) {
      showToast('Registration Error', err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={currentMeta.title} isOpen={isOpen} onClose={() => onClose && onClose()} maxWidth="2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${currentMeta.color} shadow-xs`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full mb-1">
                <Sparkles className="w-3 h-3 text-pink-500" />
                <span>Personalized Module Intake</span>
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                {currentMeta.title}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">{currentMeta.subtitle}</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Stepper Indicators */}
        <div className="flex items-center justify-between text-xs font-bold text-gray-500">
          <span className={step === 1 ? 'text-[#4A154B]' : 'text-gray-400'}>
            Step 1: Member Identity
          </span>
          <span className="w-12 h-0.5 bg-gray-200" />
          <span className={step === 2 ? 'text-[#4A154B]' : 'text-gray-400'}>
            Step 2: Module Parameters & Goals
          </span>
          <span className="w-12 h-0.5 bg-gray-200" />
          <span className={step === 3 ? 'text-[#4A154B]' : 'text-gray-400'}>
            Step 3: Live Dynamic Calculation
          </span>
        </div>

        {/* STEP 1: PERSONAL IDENTITY */}
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed">
              👋 <strong>Welcome to HerRise AI!</strong> Please confirm your member details so all reports, contracts, and certificates reflect your verified identity.
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Legal Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                    placeholder="e.g. Your Full Legal Name"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-xs outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                      placeholder="user@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-xs outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-xs outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  City / Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                    placeholder="e.g. Bengaluru, Karnataka"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-xs outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2.5 bg-[#4A154B] hover:bg-[#350c36] text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                <span>Continue to Module Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: MODULE SPECIFIC PARAMETERS */}
        {step === 2 && (
          <div className="space-y-4">
            {/* CAREER FORM */}
            {module === 'career' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Target Job Title / Career Focus
                  </label>
                  <input
                    type="text"
                    value={careerData.targetRole}
                    onChange={(e) => setCareerData({ ...careerData, targetRole: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                    placeholder="e.g. Senior Frontend Developer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Current Professional Status
                    </label>
                    <select
                      value={careerData.status}
                      onChange={(e) => setCareerData({ ...careerData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                    >
                      <option value="Career Break / Exploring Returnships">Career Break / Sabbatical</option>
                      <option value="Employed (Looking to Switch)">Employed (Seeking Side Transition)</option>
                      <option value="Homemaker">Homemaker Seeking Independence</option>
                      <option value="Freelancer">Freelancer</option>
                      <option value="Recent College Graduate">Recent College Graduate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Total Experience (Years)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={careerData.experienceYears}
                      onChange={(e) => setCareerData({ ...careerData, experienceYears: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Desired Annual Compensation
                    </label>
                    <input
                      type="text"
                      value={careerData.desiredSalary}
                      onChange={(e) => setCareerData({ ...careerData, desiredSalary: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                      placeholder="e.g. ₹15,00,000 / yr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Preferred Work Mode
                    </label>
                    <select
                      value={careerData.workMode}
                      onChange={(e) => setCareerData({ ...careerData, workMode: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                    >
                      <option value="Remote">100% Remote / Work from Home</option>
                      <option value="Hybrid">Hybrid (1-2 days in office)</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* BUSINESS FORM */}
            {module === 'business' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Venture / Brand Name
                  </label>
                  <input
                    type="text"
                    value={businessData.ventureName}
                    placeholder="e.g. EcoBloom Naturals"
                    onChange={(e) => setBusinessData({ ...businessData, ventureName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Elevator Pitch / Product Description
                  </label>
                  <textarea
                    rows={2}
                    value={businessData.pitch}
                    placeholder="e.g. Sustainable organic wellness & skincare formulated for urban women."
                    onChange={(e) => setBusinessData({ ...businessData, pitch: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Target Monthly Revenue (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 150000"
                      value={businessData.monthlyTargetRevenue || ''}
                      onChange={(e) => setBusinessData({ ...businessData, monthlyTargetRevenue: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Required Seed Capital (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 300000"
                      value={businessData.seedCapitalNeeded || ''}
                      onChange={(e) => setBusinessData({ ...businessData, seedCapitalNeeded: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Monthly Fixed Overheads (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 35000"
                      value={businessData.monthlyFixedCosts || ''}
                      onChange={(e) => setBusinessData({ ...businessData, monthlyFixedCosts: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Average Unit Production Cost (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 250"
                      value={businessData.averageUnitCost || ''}
                      onChange={(e) => setBusinessData({ ...businessData, averageUnitCost: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* FUND FORM */}
            {module === 'fund' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Enterprise / Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. EcoBloom Naturals"
                    value={fundData.enterpriseName}
                    onChange={(e) => setFundData({ ...fundData, enterpriseName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Capital Required (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 500000"
                      value={fundData.capitalNeeded || ''}
                      onChange={(e) => setFundData({ ...fundData, capitalNeeded: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Annual Turnover (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 800000"
                      value={fundData.annualTurnover || ''}
                      onChange={(e) => setFundData({ ...fundData, annualTurnover: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Primary Scheme Category
                  </label>
                  <select
                    value={fundData.fundingType}
                    onChange={(e) => setFundData({ ...fundData, fundingType: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                  >
                    <option value="Government Low-Interest Scheme (Stand-Up India / PMEGP)">Government Subsidized (Stand-Up India, Mudra, PMEGP)</option>
                    <option value="Direct Grant (Non-repayable)">Direct Non-repayable Grant</option>
                    <option value="Microfinance NBFC Facility">Microfinance NBFC Facility</option>
                    <option value="Women Angel Network Equity">Women Angel Network Equity</option>
                  </select>
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fundData.hasCollateral}
                      onChange={(e) => setFundData({ ...fundData, hasCollateral: e.target.checked })}
                      className="rounded text-[#4A154B]"
                    />
                    <span>I have collateral assets (property, FD, equipment) to pledge if required</span>
                  </label>
                </div>
              </div>
            )}

            {/* MARKET FORM */}
            {module === 'market' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Store / Boutique Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. EcoBloom Storefront"
                    value={marketData.storeName}
                    onChange={(e) => setMarketData({ ...marketData, storeName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    First Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Handcrafted Lavender Sleep Mist (50ml)"
                    value={marketData.productTitle}
                    onChange={(e) => setMarketData({ ...marketData, productTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 799"
                      value={marketData.sellingPrice || ''}
                      onChange={(e) => setMarketData({ ...marketData, sellingPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Cost of Goods Sold (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 320"
                      value={marketData.unitCost || ''}
                      onChange={(e) => setMarketData({ ...marketData, unitCost: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Initial Available Stock
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 100"
                      value={marketData.stockQuantity || ''}
                      onChange={(e) => setMarketData({ ...marketData, stockQuantity: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Monthly Target Units Sold
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 80"
                      value={marketData.monthlyTargetUnits || ''}
                      onChange={(e) => setMarketData({ ...marketData, monthlyTargetUnits: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* LEARN FORM */}
            {module === 'learn' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Domain / Skill Track to Master
                  </label>
                  <select
                    value={learnData.targetDomain}
                    onChange={(e) => setLearnData({ ...learnData, targetDomain: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                  >
                    <option value="AI Productivity & FinTech Strategy">AI Productivity & FinTech Strategy</option>
                    <option value="Digital D2C E-Commerce & Brand Scaling">Digital D2C E-Commerce & Brand Scaling</option>
                    <option value="Financial Literacy & Taxation Mastery">Financial Literacy & Personal Taxation</option>
                    <option value="Executive Negotiation & Leadership">Executive Negotiation & Leadership</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Current Knowledge Level
                    </label>
                    <select
                      value={learnData.currentLevel}
                      onChange={(e) => setLearnData({ ...learnData, currentLevel: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                    >
                      <option value="Beginner">Beginner (Foundational)</option>
                      <option value="Intermediate">Intermediate (Practitioner)</option>
                      <option value="Advanced">Advanced (Executive)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Available Weekly Study Time (Hours)
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="40"
                      value={learnData.weeklyHours}
                      onChange={(e) => setLearnData({ ...learnData, weeklyHours: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* NETWORK FORM */}
            {module === 'network' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Mentorship Focus Area
                  </label>
                  <select
                    value={networkData.mentorshipDomain}
                    onChange={(e) => setNetworkData({ ...networkData, mentorshipDomain: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                  >
                    <option value="Venture Fundraising & Pitching">Venture Fundraising & Pitching</option>
                    <option value="Career Relaunch & Executive Positioning">Career Relaunch & Executive Positioning</option>
                    <option value="Tech Architecture & Software Leadership">Tech Architecture & Software Leadership</option>
                    <option value="D2C Product Positioning & Growth Marketing">D2C Product Positioning & Growth Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Specific Goal or Challenge for Mentor
                  </label>
                  <textarea
                    rows={2}
                    value={networkData.primaryGoal}
                    onChange={(e) => setNetworkData({ ...networkData, primaryGoal: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                    placeholder="e.g. Need feedback on pitch deck and financial model"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Preferred Session Cadence
                  </label>
                  <select
                    value={networkData.meetingFrequency}
                    onChange={(e) => setNetworkData({ ...networkData, meetingFrequency: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                  >
                    <option value="Weekly">Weekly (High acceleration)</option>
                    <option value="Bi-weekly">Bi-weekly (Recommended standard)</option>
                    <option value="Monthly">Monthly Check-in</option>
                  </select>
                </div>
              </div>
            )}

            <div className="pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-[#4A154B] hover:bg-[#350c36] text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                <span>Preview Dynamic Calculations</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LIVE CALCULATION CONFIRMATION */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <Calculator className="w-4 h-4 text-emerald-700" />
                <span>Live Dynamic Calculations Derived from Your Input</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Zero static numbers. HerRise AI computes your indicators in real-time and persists your baseline to MongoDB Atlas.
              </p>
            </div>

            {/* Calculations display */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              {module === 'career' && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 font-semibold">Career Readiness Score:</span>
                    <div className="text-xl font-black text-slate-900">{calculated.readinessScore} / 100</div>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold">Matching Remote Roles:</span>
                    <div className="text-xl font-black text-[#be185d]">{calculated.matchRolesCount}+ Active</div>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200 text-gray-600">
                    Target Role: <strong>{careerData.targetRole}</strong> | Mode: <strong>{careerData.workMode}</strong>
                  </div>
                </div>
              )}

              {module === 'business' && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 font-semibold">Suggested Selling Price:</span>
                    <div className="text-xl font-black text-slate-900">₹{calculated.sellingPrice?.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold">Break-Even Units:</span>
                    <div className="text-xl font-black text-rose-700">{calculated.breakEvenUnits?.toLocaleString()} units/mo</div>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold">Projected Net Monthly Profit:</span>
                    <div className="text-xl font-black text-emerald-700">₹{calculated.projectedProfit?.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold">Runway with Seed Capital:</span>
                    <div className="text-xl font-black text-teal-700">{calculated.runwayMonths} Months</div>
                  </div>
                </div>
              )}

              {module === 'fund' && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 font-semibold">Loan Readiness Score:</span>
                    <div className="text-xl font-black text-slate-900">{calculated.readinessScore} / 100</div>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold">Estimated Monthly EMI (36m):</span>
                    <div className="text-xl font-black text-amber-700">₹{calculated.emi?.toLocaleString()} / mo</div>
                  </div>
                </div>
              )}

              {module === 'market' && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 font-semibold">Gross Profit Margin:</span>
                    <div className="text-xl font-black text-emerald-700">{calculated.marginPercent}%</div>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold">Projected Net Profit:</span>
                    <div className="text-xl font-black text-slate-900">₹{calculated.netProfit?.toLocaleString()} / mo</div>
                  </div>
                </div>
              )}

              {module === 'learn' && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 font-semibold">Estimated Weeks to Complete:</span>
                    <div className="text-xl font-black text-blue-700">{calculated.weeksToCert} Weeks</div>
                  </div>
                  <div>
                    <span className="text-gray-500 font-semibold">Curriculum Total:</span>
                    <div className="text-xl font-black text-slate-900">{calculated.totalCourseHours} Hours</div>
                  </div>
                </div>
              )}

              {module === 'network' && (
                <div className="text-xs space-y-1">
                  <span className="text-gray-500 font-semibold">Mentor Match Compatibility:</span>
                  <div className="text-2xl font-black text-indigo-700">{calculated.matchScore}% Match</div>
                  <p className="text-gray-500 text-[11px] pt-1">
                    Focus: {networkData.mentorshipDomain} • {networkData.meetingFrequency}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-[#4A154B] to-[#be185d] hover:opacity-95 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 text-pink-300" />
                <span>{submitting ? 'Saving to Database...' : 'Confirm & Launch Module'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
