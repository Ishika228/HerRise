import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  DollarSign,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CheckCircle2,
  Loader2,
  Sparkles,
  TrendingUp,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { API_BASE } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StartupItem } from '../../pages/HerFund/StartupFundingSection';
import { SubmittedFundRequest } from '../../types';

interface FundingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  venture: StartupItem | null;
  onSuccess: (request: SubmittedFundRequest) => void;
}

export const FundingRequestModal: React.FC<FundingRequestModalProps> = ({
  isOpen,
  onClose,
  venture,
  onSuccess
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Form states with autofill from user profile
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantLocation, setApplicantLocation] = useState('');
  const [startupName, setStartupName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');

  // Manual amount entered by user
  const [requestedAmount, setRequestedAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [fundingType, setFundingType] = useState('Equity Funding');
  const [monthlyRevenue, setMonthlyRevenue] = useState('Early Stage (Pre-Revenue)');
  const [useOfFunds, setUseOfFunds] = useState('');
  const [pitchSummary, setPitchSummary] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<SubmittedFundRequest | null>(null);

  // Autofill fields whenever modal opens or venture changes
  useEffect(() => {
    if (isOpen && venture) {
      setIsSubmittedSuccess(false);
      setSubmittedData(null);

      // Autofill from user profile
      setApplicantName(user?.name || '');
      setApplicantEmail(user?.email || '');
      setApplicantPhone(user?.phone || '+91 98765 43210');
      setApplicantLocation(user?.location || 'Bengaluru, India');
      setStartupName(
        user?.businessProfile?.ventureName ||
        (user?.name ? `${user.name}'s Growth Venture` : 'My Innovation Venture')
      );
      setBusinessCategory(
        user?.businessProfile?.industry ||
        venture.industry ||
        'Technology & AI'
      );

      // Default pitch summary from bio or default
      setPitchSummary(
        user?.bio ||
        `High-potential women-led venture solving critical workflow and operational challenges in ${venture.industry}. Scalable business model targeting global expansion.`
      );

      // Default use of funds template
      setUseOfFunds(
        '40% Engineering & Product Development, 30% Go-To-Market & Customer Acquisition, 20% Key Hires, 10% Operational Runway.'
      );

      // Default requested amount to empty string so user enters it manually
      setRequestedAmount('');
      setCurrency(venture.currency || 'USD');
    }
  }, [isOpen, venture, user]);

  if (!isOpen || !venture) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!requestedAmount || Number(requestedAmount) <= 0) {
      showToast('Amount Required', 'Please manually enter the funding amount you are requesting.', 'warning');
      return;
    }

    if (!applicantName.trim() || !applicantEmail.trim() || !startupName.trim()) {
      showToast('Missing Fields', 'Please complete your contact and venture details.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userId: user?.id || 'usr-guest',
        userEmail: applicantEmail.trim() || user?.email || '',
        ventureId: venture.id || venture.slug,
        ventureName: venture.name,
        ventureSlug: venture.slug,
        ventureLogo: venture.logo || null,
        ventureIndustry: venture.industry,
        ventureRound: venture.roundLabel,
        applicantName: applicantName.trim(),
        applicantEmail: applicantEmail.trim(),
        applicantPhone: applicantPhone.trim(),
        applicantLocation: applicantLocation.trim(),
        startupName: startupName.trim(),
        businessCategory: businessCategory.trim(),
        requestedAmount: Number(requestedAmount),
        currency,
        fundingType,
        useOfFunds: useOfFunds.trim(),
        pitchSummary: pitchSummary.trim(),
        monthlyRevenue
      };

      const res = await fetch(`${API_BASE}/api/fund/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to submit funding request');
      }

      const created = json.data;
      setSubmittedData(created);
      setIsSubmittedSuccess(true);
      onSuccess(created);

      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {}

      showToast(
        'Funding Request Sent! 🚀',
        `Your request for ${currency} ${Number(requestedAmount).toLocaleString()} has been sent to ${venture.name}.`,
        'success'
      );
    } catch (err: any) {
      console.error('[FundingRequestModal Error]:', err);
      showToast('Submission Error', err.message || 'Unable to record fund request. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-100 relative">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#4A154B] via-[#63185c] to-indigo-900 text-white p-5 sm:p-6 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-lg text-pink-200 shrink-0">
              {venture.logo ? (
                <img
                  src={venture.logo}
                  alt={venture.name}
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                venture.name.slice(0, 2).toUpperCase()
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-pink-500/20 border border-pink-400/30 text-pink-200 px-2.5 py-0.5 rounded-full">
                  Official Funding Request
                </span>
                <span className="text-xs text-purple-200 font-semibold">
                  {venture.roundLabel}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Send Request to {venture.name}
              </h2>
              <p className="text-xs text-purple-200 mt-0.5">
                Target Sector: {venture.industry} • {venture.headquarters}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSubmittedSuccess && submittedData ? (
            /* Success View */
            <div className="text-center py-8 px-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-full border border-emerald-200 uppercase tracking-wider mb-2">
                  Request Recorded in Database
                </span>
                <h3 className="text-2xl font-black text-gray-900">
                  Funding Request Sent Successfully!
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto mt-2 leading-relaxed">
                  Your formal pitch and capital request of <strong className="text-emerald-700">{submittedData.currency} {submittedData.requestedAmount.toLocaleString()}</strong> has been submitted to <strong className="text-gray-900">{venture.name}</strong>.
                </p>
              </div>

              <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Applicant:</span>
                  <strong className="text-gray-900">{submittedData.applicantName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Startup Venture:</span>
                  <strong className="text-gray-900">{submittedData.startupName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Instrument:</span>
                  <span className="text-purple-900 font-semibold">{submittedData.fundingType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tracking Status:</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-bold text-[10px]">
                    {submittedData.status}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#4A154B] hover:bg-[#350c36] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                >
                  Done & View Status
                </button>
              </div>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 1. Autofilled User & Venture Details */}
              <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#4A154B]" />
                    <h4 className="text-xs font-black uppercase text-gray-900 tracking-wider">
                      Applicant Profile (Auto-filled)
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    ✓ Verified Member Data
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      required
                      placeholder="Your Full Name"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-semibold text-gray-900 focus:outline-none focus:border-[#4A154B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      required
                      placeholder="email@example.com"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-semibold text-gray-900 focus:outline-none focus:border-[#4A154B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="+91 / +61 mobile"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-semibold text-gray-900 focus:outline-none focus:border-[#4A154B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      Location / Region
                    </label>
                    <input
                      type="text"
                      value={applicantLocation}
                      onChange={(e) => setApplicantLocation(e.target.value)}
                      placeholder="City, Country"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-semibold text-gray-900 focus:outline-none focus:border-[#4A154B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      Startup / Venture Project Name
                    </label>
                    <input
                      type="text"
                      value={startupName}
                      onChange={(e) => setStartupName(e.target.value)}
                      required
                      placeholder="Your Venture Name"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-semibold text-gray-900 focus:outline-none focus:border-[#4A154B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      Venture Industry / Sector
                    </label>
                    <input
                      type="text"
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      placeholder="e.g. HealthTech, AI, Consumer"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-semibold text-gray-900 focus:outline-none focus:border-[#4A154B]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. MANUAL FUNDING AMOUNT (User inputs manually) */}
              <div className="bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-emerald-500/10 border-2 border-amber-400/40 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-600" />
                    <div>
                      <h4 className="text-xs font-black uppercase text-gray-900 tracking-wider">
                        Requested Funding Capital (Enter Manually)
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        Specify the exact investment amount your venture requires.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    Required
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl font-bold text-xs text-gray-900 focus:outline-none focus:border-[#4A154B] cursor-pointer"
                    >
                      <option value="USD">USD ($ - United States Dollar)</option>
                      <option value="INR">INR (₹ - Indian Rupee)</option>
                      <option value="AUD">AUD (A$ - Australian Dollar)</option>
                      <option value="EUR">EUR (€ - Euro)</option>
                      <option value="GBP">GBP (£ - British Pound)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Capital Amount Desired ({currency})
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1000"
                        step="500"
                        value={requestedAmount}
                        onChange={(e) => setRequestedAmount(e.target.value)}
                        required
                        placeholder="e.g. 50000"
                        className="w-full px-3.5 py-2.5 bg-white border-2 border-amber-300 focus:border-[#4A154B] rounded-xl font-black text-sm text-gray-900 placeholder:font-normal placeholder:text-gray-400 focus:outline-none"
                      />
                    </div>
                    {requestedAmount && Number(requestedAmount) > 0 && (
                      <div className="mt-1 text-xs font-black text-emerald-700">
                        Requested: {currency} {Number(requestedAmount).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Preferred Funding Structure
                    </label>
                    <select
                      value={fundingType}
                      onChange={(e) => setFundingType(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#4A154B] cursor-pointer"
                    >
                      <option value="Equity Funding">Equity Funding (Direct Shares / SAFE)</option>
                      <option value="Seed Capital">Seed Capital / Angel Round</option>
                      <option value="Non-Dilutive Grant">Non-Dilutive Grant</option>
                      <option value="Venture Debt">Venture Debt / Revenue-Based</option>
                      <option value="Convertible Note">Convertible Note</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Current Traction / Revenue
                    </label>
                    <select
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#4A154B] cursor-pointer"
                    >
                      <option value="Early Stage (Pre-Revenue)">Early Stage (Pre-Revenue / MVP Built)</option>
                      <option value="Under $5K / Month">Under $5K / Month (Initial Paying Users)</option>
                      <option value="$5K - $25K / Month">$5K - $25K / Month (Growing MRR)</option>
                      <option value="$25K - $100K+ / Month">$25K - $100K+ / Month (Scaling Product)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Use of Funds & Pitch */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Deployment of Capital / Use of Funds
                  </label>
                  <textarea
                    rows={2}
                    value={useOfFunds}
                    onChange={(e) => setUseOfFunds(e.target.value)}
                    required
                    placeholder="Describe how the requested money will be utilized..."
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 leading-relaxed focus:bg-white focus:outline-none focus:border-[#4A154B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Executive Pitch Summary
                  </label>
                  <textarea
                    rows={3}
                    value={pitchSummary}
                    onChange={(e) => setPitchSummary(e.target.value)}
                    required
                    placeholder="Brief 2-3 line value proposition explaining why your venture is a compelling investment..."
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 leading-relaxed focus:bg-white focus:outline-none focus:border-[#4A154B]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !requestedAmount}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#4A154B] hover:bg-[#350c36] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Request to Database...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-pink-300" />
                      <span>Submit Request</span>
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
