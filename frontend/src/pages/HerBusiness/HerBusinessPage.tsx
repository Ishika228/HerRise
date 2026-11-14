import React, { useState } from 'react';
import {
  Rocket,
  Lightbulb,
  Calculator,
  FileText,
  Calendar,
  Sparkles,
  TrendingUp,
  Download,
  PlusCircle,
  CheckCircle2,
  DollarSign,
  PieChart as PieIcon,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import confetti from 'canvas-confetti';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/cards/StatCard';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { ModuleRegistrationGate } from '../../components/common/ModuleRegistrationGate';
import {
  curatedBusinessIdeas,
  sampleBusinessPlan,
  launchRoadmap
} from '../../data/mockData/businessData';
import { BusinessPlan, RoadmapMilestone } from '../../types';
import { BusinessIdeaGenerator } from './components/BusinessIdeaGenerator';
import { downloadBusinessPlanPdf } from '../../services/businessPlanPdfService';

export const HerBusinessPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Registration Gate at Starting
  const [isSetupCompleted, setIsSetupCompleted] = useState<boolean>(() => {
    return localStorage.getItem('herrise_business_setup_completed') === 'true';
  });
  const [gateOpen, setGateOpen] = useState<boolean>(() => {
    return localStorage.getItem('herrise_business_setup_completed') !== 'true';
  });

  // Tabs: Generator, Ideas, Feasibility, Pricing, Plan Builder, Roadmap
  const [activeTab, setActiveTab] = useState<'generator' | 'ideas' | 'pricing' | 'plan' | 'roadmap' | 'feasibility'>('generator');

  // Business plan state dynamically personalized
  const [businessPlan, setBusinessPlan] = useState<BusinessPlan>(() => ({
    ...sampleBusinessPlan,
    businessName: user?.businessProfile?.ventureName || sampleBusinessPlan.businessName,
    category: user?.businessProfile?.industry || sampleBusinessPlan.category
  }));

  // Roadmap milestones state
  const [milestones, setMilestones] = useState<RoadmapMilestone[]>(launchRoadmap);

  // Pricing calculator state dynamically derived
  const [pricingCalc, setPricingCalc] = useState({
    rawMaterialCost: user?.businessProfile ? Math.round(user.businessProfile.monthlyFixedCosts * 0.005) || 150 : 150,
    packagingCost: 40,
    laborPerUnit: 60,
    shippingCost: 50,
    targetGrossMargin: 55, // 55%
    monthlyFixedCost: user?.businessProfile?.monthlyFixedCosts || 25000
  });

  const handleGateComplete = (data: any) => {
    setIsSetupCompleted(true);
    setGateOpen(false);
    setBusinessPlan((prev) => ({
      ...prev,
      businessName: data.ventureName || prev.businessName,
      category: data.industry || prev.category
    }));
    if (data.monthlyFixedCosts) {
      setPricingCalc((prev) => ({
        ...prev,
        monthlyFixedCost: data.monthlyFixedCosts,
        rawMaterialCost: data.averageUnitCost || prev.rawMaterialCost
      }));
    }
  };

  // Feasibility assessment state
  const [feasibilityAnswers, setFeasibilityAnswers] = useState({
    marketDemand: 'high',
    domainExpertise: 'strong',
    initialCapitalReady: 'partial',
    timeDedication: 'fulltime'
  });
  const [feasibilityScore, setFeasibilityScore] = useState<number | null>(null);

  // AI Business Chat State
  const [bizChatInput, setBizChatInput] = useState('');
  const [bizChatLog, setBizChatLog] = useState([
    {
      sender: 'assistant',
      text: 'Welcome to HerBusiness Studio! I can help you evaluate unit economics, write high-converting value propositions, or plan your launch campaign.'
    }
  ]);

  // Pricing calculations
  const totalUnitCOGS =
    pricingCalc.rawMaterialCost +
    pricingCalc.packagingCost +
    pricingCalc.laborPerUnit +
    pricingCalc.shippingCost;

  const targetMarginDecimal = pricingCalc.targetGrossMargin / 100;
  const recommendedSellingPrice = Math.round(totalUnitCOGS / (1 - targetMarginDecimal || 0.01));
  const profitPerUnit = recommendedSellingPrice - totalUnitCOGS;
  const breakevenUnitsPerMonth = Math.ceil(pricingCalc.monthlyFixedCost / (profitPerUnit || 1));

  // Toggle milestone completion
  const toggleMilestone = (day: number) => {
    setMilestones((prev) =>
      prev.map((m) => (m.day === day ? { ...m, completed: !m.completed } : m))
    );
    showToast('Milestone Updated', 'Progress saved to your 30-day roadmap', 'info');
  };

  const calculateFeasibility = () => {
    let score = 60;
    if (feasibilityAnswers.marketDemand === 'high') score += 15;
    if (feasibilityAnswers.domainExpertise === 'strong') score += 15;
    if (feasibilityAnswers.initialCapitalReady === 'full') score += 10;
    else if (feasibilityAnswers.initialCapitalReady === 'partial') score += 5;
    setFeasibilityScore(Math.min(96, score));
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}
    showToast('Feasibility Assessed', `Score: ${score}/100. High viability!`, 'success');
  };

  const handleBizChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizChatInput.trim()) return;
    const query = bizChatInput;
    const userMsg = { sender: 'user', text: query };
    let reply =
      'To build defensible margins in D2C wellness, focus on repeat subscribers rather than one-off buyers. A monthly ritual club generates predictable recurring cashflow while reducing customer acquisition costs by up to 40%.';

    if (query.toLowerCase().includes('first 10') || query.toLowerCase().includes('customer')) {
      reply =
        'For your first 10 paying customers: 1. Send personalized VIP tasting boxes to 5 aligned micro-influencers. 2. Post behind-the-scenes preparation videos in women founder WhatsApp and LinkedIn groups. 3. Offer an early-adopter 20% launch voucher in exchange for a video testimonial.';
    } else if (query.toLowerCase().includes('pricing') || query.toLowerCase().includes('margin')) {
      reply = `Based on your calculator COGS of ₹${totalUnitCOGS}, pricing at ₹${recommendedSellingPrice} guarantees your healthy ${pricingCalc.targetGrossMargin}% gross profit margin!`;
    }

    setBizChatLog((prev) => [...prev, userMsg, { sender: 'assistant', text: reply }]);
    setBizChatInput('');
  };

  const handleExportPlan = () => {
    downloadBusinessPlanPdf(businessPlan, businessPlan.businessName);
    showToast(
      'Business Plan Downloaded! 📄',
      `Official A4 Executive PDF exported for "${businessPlan.businessName}".`,
      'success'
    );
  };

  const completedMilestones = milestones.filter((m) => m.completed).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Dynamic Setup Intake Prompt Banner */}
        {!isSetupCompleted ? (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-100 text-[#e11d48] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Personalized Business Intake Required</h4>
                <p className="text-xs text-gray-600 leading-relaxed mt-0.5">
                  Register your venture name, capital needs, and production costs to compute live break-even metrics and profit margins.
                </p>
              </div>
            </div>
            <button
              onClick={() => setGateOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#4A154B] hover:bg-[#350c36] text-white font-bold text-xs rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-pink-300" />
              <span>Complete Business Registration</span>
            </button>
          </div>
        ) : (
          <div className="bg-purple-50/60 border border-purple-100 px-4 py-2 rounded-2xl flex items-center justify-between text-xs text-purple-900">
            <span>✓ Verified Venture Active: <strong>{businessPlan.businessName}</strong> ({businessPlan.category})</span>
            <button
              onClick={() => setGateOpen(true)}
              className="font-bold text-[#4A154B] hover:underline cursor-pointer"
            >
              Edit Venture Profile
            </button>
          </div>
        )}

        {/* Header Bar */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-100 text-[#e11d48]">
                <Rocket className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                HerBusiness — Entrepreneurship & Incubator Studio
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Transform your business idea into a validated, scalable, and profitable enterprise.
            </p>
          </div>

          {/* Navigation Pills */}
          <div className="flex flex-wrap gap-1.5 bg-purple-50/70 p-1.5 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'generator' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              <span>AI Idea & Plan Generator</span>
            </button>
            <button
              onClick={() => setActiveTab('ideas')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'ideas' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              Idea Library
            </button>
            <button
              onClick={() => setActiveTab('feasibility')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'feasibility' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              Feasibility Quiz
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'pricing' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              Pricing & Margin Calc
            </button>
            <button
              onClick={() => setActiveTab('plan')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'plan' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              10-Section Plan
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'roadmap' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              30-Day Roadmap
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Readiness Score"
            value="89 / 100"
            subtitle="High Launch Viability"
            icon={TrendingUp}
            iconColor="text-emerald-700"
            bgColor="bg-emerald-50"
            badge="Strong"
          />
          <StatCard
            title="Gross Margin Target"
            value={`${pricingCalc.targetGrossMargin}%`}
            subtitle="Healthy D2C benchmark"
            icon={DollarSign}
            iconColor="text-[#4A154B]"
            bgColor="bg-purple-50"
          />
          <StatCard
            title="Breakeven Units"
            value={`${breakevenUnitsPerMonth} / mo`}
            subtitle="To cover all fixed costs"
            icon={Calculator}
            iconColor="text-[#be185d]"
            bgColor="bg-pink-50"
          />
          <StatCard
            title="30-Day Launch Progress"
            value={`${completedMilestones} of ${milestones.length}`}
            subtitle="Week 2 Completed"
            icon={Calendar}
            iconColor="text-amber-700"
            bgColor="bg-amber-50"
          />
        </div>

        {/* TAB 0: AI BUSINESS IDEA GENERATOR & STRATEGIC PLANNER */}
        {activeTab === 'generator' && (
          <BusinessIdeaGenerator
            onApplyToPlan={(generated) => {
              setBusinessPlan((prev) => ({
                ...prev,
                ...generated
              }));
              setActiveTab('plan');
            }}
            onOpenPricing={(cogs, margin) => {
              setPricingCalc((prev) => ({
                ...prev,
                rawMaterialCost: cogs,
                targetGrossMargin: margin
              }));
              setActiveTab('pricing');
            }}
          />
        )}

        {/* TAB 1: CURATED BUSINESS IDEAS */}
        {activeTab === 'ideas' && (
          <div className="space-y-6">
            {/* Callout to AI Generator */}
            <div className="bg-gradient-to-r from-purple-900 via-[#4A154B] to-[#701a75] text-white p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-pink-300 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">Looking for a custom business blueprint built around your budget & skills?</h4>
                  <p className="text-xs text-purple-200">
                    Use our AI Generator to explore trending 2026 opportunities or input your own passion to generate an instant executive plan.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('generator')}
                className="bg-white hover:bg-pink-50 text-[#4A154B] font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0 transition-transform hover:scale-105"
              >
                <span>Launch AI Generator →</span>
              </button>
            </div>

            <div className="text-left space-y-1">
              <h3 className="text-base font-bold text-gray-900">Curated Micro-Enterprise Blueprints</h3>
              <p className="text-xs text-gray-500">
                High-margin, low-barrier business models proven for women founders in India and South Asia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {curatedBusinessIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full">
                        {idea.category}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {idea.difficulty}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-gray-900 group-hover:text-[#4A154B] transition-colors">
                      {idea.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{idea.description}</p>

                    <div className="grid grid-cols-2 gap-3 my-4 p-3 rounded-2xl bg-[#faf9fd] border border-purple-50 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-semibold">Initial Capital</span>
                        <strong className="text-gray-900">{idea.initialInvestment}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block font-semibold">Profit Margin</span>
                        <strong className="text-[#be185d]">{idea.profitMargin}</strong>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-4">
                      <span className="text-[11px] font-bold text-gray-700 block">Launch Milestones:</span>
                      {idea.keySteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-purple-50 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-700">
                      Potential: {idea.potentialRevenue}
                    </span>
                    <button
                      onClick={() => {
                        setBusinessPlan({
                          ...businessPlan,
                          businessName: idea.title,
                          category: idea.category,
                          problemStatement: `Addressing unmet customer demands in the ${idea.category} market.`,
                          solution: idea.description
                        });
                        setActiveTab('plan');
                        showToast('Idea Loaded into Plan', 'Customizing 10-section business plan', 'success');
                      }}
                      className="bg-[#4A154B] hover:bg-[#350c36] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Use as Template →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PRICING & MARGIN CALCULATOR */}
        {activeTab === 'pricing' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Input sliders and fields */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Unit Cost & Pricing Controls</h3>
                <p className="text-xs text-gray-500">
                  Ensure you charge for your time, shipping, and packaging without underpricing.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-gray-700 mb-1">
                    <span>Raw Materials per Unit (₹)</span>
                    <span className="text-[#4A154B]">₹{pricingCalc.rawMaterialCost}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={pricingCalc.rawMaterialCost}
                    onChange={(e) =>
                      setPricingCalc({ ...pricingCalc, rawMaterialCost: Number(e.target.value) })
                    }
                    className="w-full accent-[#4A154B]"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-gray-700 mb-1">
                    <span>Packaging & Labelling (₹)</span>
                    <span className="text-[#4A154B]">₹{pricingCalc.packagingCost}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="200"
                    step="5"
                    value={pricingCalc.packagingCost}
                    onChange={(e) =>
                      setPricingCalc({ ...pricingCalc, packagingCost: Number(e.target.value) })
                    }
                    className="w-full accent-[#4A154B]"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-gray-700 mb-1">
                    <span>Your Time / Labor Cost per Unit (₹)</span>
                    <span className="text-[#4A154B]">₹{pricingCalc.laborPerUnit}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={pricingCalc.laborPerUnit}
                    onChange={(e) =>
                      setPricingCalc({ ...pricingCalc, laborPerUnit: Number(e.target.value) })
                    }
                    className="w-full accent-[#4A154B]"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Never calculate labor as zero! Value your hours.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-gray-700 mb-1">
                    <span>Estimated Shipping / Courier (₹)</span>
                    <span className="text-[#4A154B]">₹{pricingCalc.shippingCost}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="10"
                    value={pricingCalc.shippingCost}
                    onChange={(e) =>
                      setPricingCalc({ ...pricingCalc, shippingCost: Number(e.target.value) })
                    }
                    className="w-full accent-[#4A154B]"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-gray-700 mb-1">
                    <span>Target Gross Profit Margin (%)</span>
                    <span className="text-[#be185d] font-extrabold">{pricingCalc.targetGrossMargin}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    step="5"
                    value={pricingCalc.targetGrossMargin}
                    onChange={(e) =>
                      setPricingCalc({ ...pricingCalc, targetGrossMargin: Number(e.target.value) })
                    }
                    className="w-full accent-[#be185d]"
                  />
                </div>
              </div>
            </div>

            {/* Right: Output card */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-gradient-to-br from-[#3b0764] via-[#4A154B] to-[#be185d] text-white p-7 rounded-3xl shadow-xl space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-pink-200 px-3 py-1 rounded-full">
                    Recommended Retail Price
                  </span>
                  <div className="text-4xl font-black mt-2">₹{recommendedSellingPrice}</div>
                  <p className="text-xs text-purple-200 mt-1">
                    Guarantees {pricingCalc.targetGrossMargin}% Gross Margin with all overhead covered.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20 text-xs">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <span className="text-purple-200 text-[10px] block">True Unit COGS</span>
                    <strong className="text-lg">₹{totalUnitCOGS}</strong>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl">
                    <span className="text-purple-200 text-[10px] block">Net Profit per Item</span>
                    <strong className="text-lg text-emerald-300">₹{profitPerUnit}</strong>
                  </div>
                </div>

                <div className="p-3.5 bg-black/20 rounded-2xl text-xs space-y-1">
                  <span className="font-bold text-pink-300">Monthly Breakeven Target:</span>
                  <p className="text-purple-100 leading-relaxed">
                    Sell at least <strong>{breakevenUnitsPerMonth} units/month</strong> to cover your fixed ₹{pricingCalc.monthlyFixedCost.toLocaleString()} monthly operations budget.
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-gray-900">HerMarket Listing Integration</h4>
                  <p className="text-[11px] text-gray-500">Apply this price directly to your marketplace storefront.</p>
                </div>
                <button
                  onClick={() => (window.location.href = '/market')}
                  className="bg-[#4A154B] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#350c36] cursor-pointer"
                >
                  List on Market →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 10-SECTION BUSINESS PLAN BUILDER */}
        {activeTab === 'plan' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  10-Section AI Business Plan Generator
                </h3>
                <p className="text-xs text-gray-500">
                  Investor-ready format suitable for private bank loan evaluations and incubators.
                </p>
              </div>
              <button
                onClick={handleExportPlan}
                className="flex items-center gap-1.5 bg-[#4A154B] hover:bg-[#350c36] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer"
                title="Download complete 10-section A4 PDF document"
              >
                <Download className="w-4 h-4 text-pink-300" />
                <span>Download Plan (PDF)</span>
              </button>
            </div>

            {/* 10 Sections Grid Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Overview */}
              <div className="bg-white p-5 rounded-2xl border border-purple-100 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A154B]">
                  1. Business Overview & Brand
                </span>
                <input
                  type="text"
                  value={businessPlan.businessName}
                  onChange={(e) => setBusinessPlan({ ...businessPlan, businessName: e.target.value })}
                  placeholder="Business Name"
                  className="w-full px-3 py-1.5 text-xs bg-gray-50 border rounded-lg font-bold"
                />
                <input
                  type="text"
                  value={businessPlan.tagline}
                  onChange={(e) => setBusinessPlan({ ...businessPlan, tagline: e.target.value })}
                  placeholder="Tagline"
                  className="w-full px-3 py-1.5 text-xs bg-gray-50 border rounded-lg"
                />
              </div>

              {/* 2. Problem */}
              <div className="bg-white p-5 rounded-2xl border border-purple-100 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A154B]">
                  2. Problem Statement
                </span>
                <textarea
                  rows={3}
                  value={businessPlan.problemStatement}
                  onChange={(e) => setBusinessPlan({ ...businessPlan, problemStatement: e.target.value })}
                  className="w-full p-2.5 text-xs bg-gray-50 border rounded-lg leading-relaxed"
                />
              </div>

              {/* 3. Solution */}
              <div className="bg-white p-5 rounded-2xl border border-purple-100 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A154B]">
                  3. Proposed Solution
                </span>
                <textarea
                  rows={3}
                  value={businessPlan.solution}
                  onChange={(e) => setBusinessPlan({ ...businessPlan, solution: e.target.value })}
                  className="w-full p-2.5 text-xs bg-gray-50 border rounded-lg leading-relaxed"
                />
              </div>

              {/* 4. Target Audience */}
              <div className="bg-white p-5 rounded-2xl border border-purple-100 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A154B]">
                  4. Target Audience Persona
                </span>
                <textarea
                  rows={3}
                  value={businessPlan.targetAudience}
                  onChange={(e) => setBusinessPlan({ ...businessPlan, targetAudience: e.target.value })}
                  className="w-full p-2.5 text-xs bg-gray-50 border rounded-lg leading-relaxed"
                />
              </div>

              {/* 5. Market Opportunity */}
              <div className="bg-white p-5 rounded-2xl border border-purple-100 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A154B]">
                  5. Market Opportunity (TAM / SAM)
                </span>
                <textarea
                  rows={3}
                  value={businessPlan.marketOpportunity}
                  onChange={(e) => setBusinessPlan({ ...businessPlan, marketOpportunity: e.target.value })}
                  className="w-full p-2.5 text-xs bg-gray-50 border rounded-lg leading-relaxed"
                />
              </div>

              {/* 6. Competitor Analysis */}
              <div className="bg-white p-5 rounded-2xl border border-purple-100 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A154B]">
                  6. Competitor Analysis & Moat
                </span>
                <textarea
                  rows={3}
                  value={businessPlan.competitorAnalysis}
                  onChange={(e) => setBusinessPlan({ ...businessPlan, competitorAnalysis: e.target.value })}
                  className="w-full p-2.5 text-xs bg-gray-50 border rounded-lg leading-relaxed"
                />
              </div>

              {/* 7. Revenue Model */}
              <div className="bg-white p-5 rounded-2xl border border-purple-100 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A154B]">
                  7. Revenue Model & Channels
                </span>
                <textarea
                  rows={3}
                  value={businessPlan.revenueModel}
                  onChange={(e) => setBusinessPlan({ ...businessPlan, revenueModel: e.target.value })}
                  className="w-full p-2.5 text-xs bg-gray-50 border rounded-lg leading-relaxed"
                />
              </div>

              {/* 8. Pricing Strategy */}
              <div className="bg-white p-5 rounded-2xl border border-purple-100 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A154B]">
                  8. Pricing Strategy & Margins
                </span>
                <textarea
                  rows={3}
                  value={businessPlan.pricingStrategy}
                  onChange={(e) => setBusinessPlan({ ...businessPlan, pricingStrategy: e.target.value })}
                  className="w-full p-2.5 text-xs bg-gray-50 border rounded-lg leading-relaxed"
                />
              </div>

              {/* 9. Marketing Strategy */}
              <div className="bg-white p-5 rounded-2xl border border-purple-100 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A154B]">
                  9. Marketing & Go-To-Market
                </span>
                <textarea
                  rows={3}
                  value={businessPlan.marketingStrategy}
                  onChange={(e) => setBusinessPlan({ ...businessPlan, marketingStrategy: e.target.value })}
                  className="w-full p-2.5 text-xs bg-gray-50 border rounded-lg leading-relaxed"
                />
              </div>

              {/* 10. Financial Projections */}
              <div className="bg-white p-5 rounded-2xl border border-purple-100 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A154B]">
                  10. Year 1 Projected Revenue
                </span>
                <div className="text-xl font-black text-gray-900">
                  ₹{businessPlan.projectedRevenueYear1.toLocaleString()}
                </div>
                <div className="space-y-1 text-[11px] text-gray-500">
                  <span>Startup Cost Breakdown:</span>
                  {businessPlan.startupCosts.slice(0, 3).map((cost, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>• {cost.item}</span>
                      <strong className="text-gray-800">₹{cost.cost.toLocaleString()}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 30-DAY LAUNCH ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">30-Day Launch Roadmap</h3>
                <p className="text-xs text-gray-500">
                  Click milestones as you complete them to track your launch readiness.
                </p>
              </div>
              <span className="text-xs font-bold text-[#4A154B] bg-purple-100 px-3 py-1.5 rounded-full">
                {completedMilestones} / {milestones.length} Completed
              </span>
            </div>

            <div className="space-y-3">
              {milestones.map((m) => (
                <div
                  key={m.day}
                  onClick={() => toggleMilestone(m.day)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                    m.completed
                      ? 'border-emerald-300 bg-emerald-50/40'
                      : 'border-purple-100 bg-white hover:border-purple-200'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      m.completed ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {m.completed ? '✓' : `D${m.day}`}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {m.phase}
                      </span>
                    </div>
                    <h4 className={`text-xs sm:text-sm font-bold ${m.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {m.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FEASIBILITY ASSESSMENT */}
        {activeTab === 'feasibility' && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-purple-100 shadow-xs space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-gray-900">Interactive Business Feasibility Quiz</h3>
              <p className="text-xs text-gray-500">
                Answer 4 quick diagnostic questions to calculate your readiness quotient.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">1. Market Demand & Competitive Urgency</label>
                <select
                  value={feasibilityAnswers.marketDemand}
                  onChange={(e) => setFeasibilityAnswers({ ...feasibilityAnswers, marketDemand: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl"
                >
                  <option value="high">High: Customers actively seeking solutions with disposable income</option>
                  <option value="medium">Moderate: Existing alternatives exist, but lack clean/personalized quality</option>
                  <option value="low">Uncertain: Untested niche requiring heavy customer education</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">2. Domain Skill & Experience</label>
                <select
                  value={feasibilityAnswers.domainExpertise}
                  onChange={(e) => setFeasibilityAnswers({ ...feasibilityAnswers, domainExpertise: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl"
                >
                  <option value="strong">Strong: 3+ years hands-on experience or deep craft mastery</option>
                  <option value="moderate">Moderate: Completed certified course and practical prototypes</option>
                  <option value="learning">Beginner: Passionate learner seeking initial mentor guidance</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">3. Initial Capital Availability</label>
                <select
                  value={feasibilityAnswers.initialCapitalReady}
                  onChange={(e) => setFeasibilityAnswers({ ...feasibilityAnswers, initialCapitalReady: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border rounded-xl"
                >
                  <option value="full">Full: 100% of minimum startup capital saved in cash</option>
                  <option value="partial">Partial: 50% available, seeking micro-grant or crowdfunding</option>
                  <option value="seeking">Seeking 100% collateral-free bank loan or angel funding</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculateFeasibility}
              className="w-full bg-[#4A154B] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#350c36] cursor-pointer"
            >
              Calculate Feasibility Score
            </button>

            {feasibilityScore !== null && (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-in fade-in">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Feasibility Assessment Result
                </span>
                <div className="text-4xl font-extrabold text-emerald-800">{feasibilityScore} / 100</div>
                <p className="text-xs text-emerald-900">
                  Strong market fit and execution probability! We recommend creating your 10-section plan and testing initial pricing.
                </p>
              </div>
            )}
          </div>
        )}

        {/* AI Business Assistant Strip */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#fb7185]" />
              <h4 className="font-bold text-sm text-gray-900">AI Business Strategy Coach</h4>
            </div>
            <p className="text-xs text-gray-500">
              Need help validating your value proposition or negotiating with packaging vendors?
            </p>
          </div>

          <form onSubmit={handleBizChat} className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              value={bizChatInput}
              onChange={(e) => setBizChatInput(e.target.value)}
              placeholder="Ask business strategy question..."
              className="px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4A154B] w-full md:w-80"
            />
            <button
              type="submit"
              className="bg-[#4A154B] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#350c36] cursor-pointer shrink-0"
            >
              Ask
            </button>
          </form>
        </div>
      </div>

      {/* Module Registration Gate at Starting */}
      <ModuleRegistrationGate
        module="business"
        isOpen={gateOpen}
        onClose={() => setGateOpen(false)}
        onComplete={handleGateComplete}
      />
    </DashboardLayout>
  );
};

