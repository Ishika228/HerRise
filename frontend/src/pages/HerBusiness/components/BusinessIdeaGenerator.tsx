import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Calendar,
  Layers,
  ShieldCheck,
  Target,
  FileText,
  Copy,
  Printer,
  Download,
  RotateCcw,
  BadgePercent,
  Compass,
  Zap,
  ShoppingBag,
  Cpu,
  Coffee,
  HeartPulse,
  Palette,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../../../context/ToastContext';
import { BusinessPlan } from '../../../types';
import { downloadGeneratedBlueprintPdf } from '../../../services/businessPlanPdfService';

export interface GeneratedIdeaPlan {
  businessName: string;
  tagline: string;
  industry: string;
  difficulty: 'Beginner Friendly' | 'Moderate' | 'Advanced';
  initialInvestment: string;
  profitMargin: string;
  projectedRevenueYear1: string;
  breakevenTimeline: string;
  problemStatement: string;
  solution: string;
  uniqueSellingProposition: string;
  targetAudience: {
    demographics: string;
    psychographics: string;
    painPoint: string;
  };
  productTiers: {
    tierName: string;
    price: string;
    cogs: string;
    margin: string;
    description: string;
  }[];
  roadmapPhases: {
    phase: string;
    timeline: string;
    tasks: string[];
  }[];
  startupBudget: {
    category: string;
    cost: number;
    description: string;
  }[];
  marketingPlaybook: string[];
  legalChecklist: string[];
  riskMitigation: {
    risk: string;
    solution: string;
  }[];
}

interface BusinessIdeaGeneratorProps {
  onApplyToPlan: (generatedPlan: Partial<BusinessPlan>) => void;
  onOpenPricing?: (cogs: number, margin: number) => void;
}

// 8 Curated Trending Business Ideas with complete analytical profiles
const TRENDING_TOPICS = [
  {
    id: 'trending-1',
    title: 'Millet-Based Healthy Superfoods & Snacks',
    badge: '🔥 High Growth in 2026',
    category: 'Food & Wellness D2C',
    icon: Coffee,
    capital: '₹35,000 - ₹60,000',
    margin: '55% - 68%',
    description: 'Direct-to-consumer organic ragi, jowar & bajra snack bites, gluten-free diabetic snack packs, zero preservatives.',
    keyword: 'millet superfood snacks healthy diet'
  },
  {
    id: 'trending-2',
    title: 'AI-Enhanced Social Media & Creator Growth Agency',
    badge: '⚡ Low Investment',
    category: 'Tech & B2B Services',
    icon: Cpu,
    capital: '₹15,000 - ₹30,000',
    margin: '75% - 88%',
    description: 'High-touch short-form video editing, LinkedIn personal branding, and automated scheduling for female executives & SMBs.',
    keyword: 'social media management AI content agency'
  },
  {
    id: 'trending-3',
    title: 'Sustainable Eco-Friendly Packaging & Zero-Waste Essentials',
    badge: '🌿 Eco-Impact Trend',
    category: 'Eco-Friendly & Green Tech',
    icon: ShoppingBag,
    capital: '₹45,000 - ₹90,000',
    margin: '48% - 62%',
    description: 'Cassava-starch bags, honeycomb protective paper mailers & reusable canvas bags for local e-commerce stores.',
    keyword: 'eco packaging zero waste sustainable products'
  },
  {
    id: 'trending-4',
    title: 'Hormonal Wellness & Women\'s Functional Fitness Coaching',
    badge: '⭐ High Recurring Revenue',
    category: 'Health & Wellness',
    icon: HeartPulse,
    capital: '₹20,000 - ₹45,000',
    margin: '80% - 92%',
    description: 'PCOS/PCOD lifestyle management, postpartum pelvic recovery cohorts, and cycle-synced nutrition subscriptions.',
    keyword: 'women wellness PCOS coaching hormone health'
  },
  {
    id: 'trending-5',
    title: 'Artisanal Eco-Soy Scented Candles & Luxury Decor',
    badge: '✨ Aesthetic & Gifting',
    category: 'Handmade & Lifestyle',
    icon: Palette,
    capital: '₹25,000 - ₹50,000',
    margin: '58% - 70%',
    description: 'Hand-poured aromatherapy candles with natural wooden wicks in reusable handcrafted ceramic bowls for festive & wedding favors.',
    keyword: 'soy wax candles home decor artisanal gifts'
  },
  {
    id: 'trending-6',
    title: 'Career Returnship & Digital Skills Micro-Academy',
    badge: '📚 High Community Need',
    category: 'Education & Coaching',
    icon: GraduationCap,
    capital: '₹15,000 - ₹35,000',
    margin: '82% - 95%',
    description: 'Structured 4-week cohort training women after career breaks in data analysis, remote operations, and portfolio building.',
    keyword: 'online course skill academy returnship career coaching'
  }
];

export const BusinessIdeaGenerator: React.FC<BusinessIdeaGeneratorProps> = ({
  onApplyToPlan,
  onOpenPricing
}) => {
  const { showToast } = useToast();

  // Intake Form State
  const [topicInput, setTopicInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Food & Wellness D2C');
  const [capitalRange, setCapitalRange] = useState('₹25,000 - ₹75,000');
  const [timeCommitment, setTimeCommitment] = useState('Part-Time (15-25 hrs/week)');
  const [coreStrength, setCoreStrength] = useState('Creative Design & Crafting');
  const [salesChannel, setSalesChannel] = useState('100% Online & HerMarket');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedIdeaPlan | null>(null);

  // Quick select trending idea
  const handleSelectTrending = (trending: typeof TRENDING_TOPICS[0]) => {
    setTopicInput(trending.title);
    setSelectedCategory(trending.category);
    setCapitalRange(trending.capital);
    showToast('Trending Topic Selected 🔥', `Pre-filled "${trending.title}". Adjust your preferences and generate your plan!`, 'info');
  };

  // AI Generation Engine Simulator
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) {
      showToast('Topic Required', 'Please enter your business idea topic or pick one from the trending list.', 'error');
      return;
    }

    setIsGenerating(true);
    setGenerationStep(1);

    setTimeout(() => setGenerationStep(2), 600);
    setTimeout(() => setGenerationStep(3), 1200);

    setTimeout(() => {
      setIsGenerating(false);
      setGenerationStep(0);

      // Generate a comprehensive, realistic business blueprint based on inputs
      const cleanTopic = topicInput.trim();
      const plan: GeneratedIdeaPlan = buildCustomPlan(
        cleanTopic,
        selectedCategory,
        capitalRange,
        timeCommitment,
        coreStrength,
        salesChannel
      );

      setGeneratedPlan(plan);

      try {
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.55 } });
      } catch {}

      showToast(
        'Business Blueprint Generated! 🚀',
        `Complete strategy and financial plan prepared for "${plan.businessName}".`,
        'success'
      );
    }, 1800);
  };

  // Copy plan summary
  const handleCopySummary = () => {
    if (!generatedPlan) return;
    const summaryText = `HERRISE AI BUSINESS BLUEPRINT: ${generatedPlan.businessName}
Tagline: ${generatedPlan.tagline}
Industry: ${generatedPlan.industry}
Estimated Capital: ${generatedPlan.initialInvestment}
Projected Gross Margin: ${generatedPlan.profitMargin}
Year 1 Potential Revenue: ${generatedPlan.projectedRevenueYear1}

PROBLEM:
${generatedPlan.problemStatement}

SOLUTION & USP:
${generatedPlan.solution}
USP: ${generatedPlan.uniqueSellingProposition}

KEY ROADMAP MILESTONES:
${generatedPlan.roadmapPhases.map((p) => `${p.phase} (${p.timeline}):\n${p.tasks.map((t) => ' - ' + t).join('\n')}`).join('\n\n')}

STARTUP COSTS BREAKDOWN:
${generatedPlan.startupBudget.map((b) => ` - ${b.category}: ₹${b.cost.toLocaleString('en-IN')} (${b.description})`).join('\n')}

MARKETING CHANNELS:
${generatedPlan.marketingPlaybook.map((m) => ' - ' + m).join('\n')}

LEGAL & COMPLIANCE:
${generatedPlan.legalChecklist.map((l) => ' - ' + l).join('\n')}
`;

    navigator.clipboard.writeText(summaryText);
    showToast('Plan Copied to Clipboard 📋', 'Full business blueprint copied for your records.', 'success');
  };

  // Download complete high-res PDF blueprint directly
  const handleDownloadPdf = () => {
    if (!generatedPlan) return;
    downloadGeneratedBlueprintPdf(generatedPlan);
    showToast(
      'Blueprint PDF Downloaded! 📄',
      `Official multi-page A4 PDF generated for "${generatedPlan.businessName}".`,
      'success'
    );
  };

  // Apply to the master 10-section plan
  const handleTransferToPlan = () => {
    if (!generatedPlan) return;

    const partialPlan: Partial<BusinessPlan> = {
      businessName: generatedPlan.businessName,
      tagline: generatedPlan.tagline,
      category: generatedPlan.industry,
      problemStatement: generatedPlan.problemStatement,
      solution: generatedPlan.solution,
      targetAudience: `${generatedPlan.targetAudience.demographics}. Value-driven buyers seeking: ${generatedPlan.targetAudience.painPoint}`,
      marketOpportunity: `Targeting addressable demand with ${generatedPlan.profitMargin} gross margin and ${generatedPlan.uniqueSellingProposition}.`,
      competitorAnalysis: 'Incumbents rely on high retail markups, generic mass production, and impersonal customer touchpoints. Our advantage is direct community engagement, clean-label transparency, and agile small-batch fulfillment.',
      revenueModel: `Direct sales via ${salesChannel} with 3 distinct tiered offerings. Target Year 1 revenue: ${generatedPlan.projectedRevenueYear1}.`,
      pricingStrategy: `Tiered value pricing: Entry Starter (${generatedPlan.productTiers[0]?.price}), Flagship Core (${generatedPlan.productTiers[1]?.price}), Premium Bundle (${generatedPlan.productTiers[2]?.price}). Gross margins maintained above ${generatedPlan.profitMargin}.`,
      marketingStrategy: generatedPlan.marketingPlaybook.join('. '),
      startupCosts: generatedPlan.startupBudget.map((b) => ({ item: `${b.category} (${b.description})`, cost: b.cost })),
      projectedRevenueYear1: parseInt(generatedPlan.projectedRevenueYear1.replace(/[^0-9]/g, '')) || 1200000
    };

    onApplyToPlan(partialPlan);
    showToast(
      'Loaded into 10-Section Plan! 📄',
      `"${generatedPlan.businessName}" is now active in your master editable plan.`,
      'success'
    );
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#4A154B] via-[#6a1b6c] to-[#be185d] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xs">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-pink-200 text-xs font-bold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            <span>AI Business Idea Synthesizer & Strategic Planner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Generate Your Tailored Business Blueprint
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 leading-relaxed max-w-xl">
            Tell us your passion, budget, and time availability — or pick from curated high-margin trending markets. We'll generate an executive-ready business model, unit economics, 4-phase launch roadmap, and compliance checklist.
          </p>
        </div>
      </div>

      {/* SECTION 1: TRENDING SUGGESTIONS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#be185d]" />
              <span>Trending Business Opportunities for Women</span>
            </h3>
            <p className="text-xs text-gray-500">
              High-growth, validated micro-enterprise sectors in India and South Asia with strong margin profiles.
            </p>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-bold text-[#4A154B] bg-purple-50 px-3 py-1 rounded-xl">
            Click any idea to pre-fill
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TRENDING_TOPICS.map((trend) => {
            const Icon = trend.icon;
            const isSelected = topicInput === trend.title;
            return (
              <div
                key={trend.id}
                onClick={() => handleSelectTrending(trend)}
                className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'border-[#4A154B] bg-purple-50/70 shadow-xs'
                    : 'border-purple-100/70 bg-white hover:border-purple-300 hover:shadow-xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-[#be185d]">
                      {trend.badge}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">{trend.category}</span>
                  </div>

                  <div className="flex items-start gap-2.5 pt-1">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#4A154B] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-gray-900 group-hover:text-[#4A154B] transition-colors leading-snug">
                        {trend.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {trend.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-purple-50/80 mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">
                    Capital: <strong className="text-gray-800">{trend.capital}</strong>
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    {trend.margin} Margin
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: CUSTOM INTAKE FORM */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-xs space-y-6">
        <div className="border-b border-purple-50 pb-4">
          <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#4A154B]" />
            <span>Customize Your Business Requirements & Vision</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Answer a few quick questions so our AI can calibrate realistic startup costs, pricing tiers, and a step-by-step launch roadmap.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-5 text-xs">
          {/* Main Idea / Topic Field */}
          <div>
            <label className="block font-bold text-gray-800 uppercase tracking-wider text-[11px] mb-1.5">
              1. What product, service, or passion do you want to build a business around? *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g., Artisanal scented candles, Gluten-free bakery, Remote digital marketing agency, Handcrafted pottery..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-2xl text-xs text-gray-800 outline-none transition-all shadow-2xs font-medium"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              Tip: You can type your own dream idea or click any of the trending boxes above to auto-fill.
            </p>
          </div>

          {/* 4-Column Preference Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider text-[10px] mb-1">
                Industry Sector
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4A154B]"
              >
                <option value="Food & Wellness D2C">Food & Wellness D2C</option>
                <option value="Handmade & Lifestyle Decor">Handmade & Lifestyle Decor</option>
                <option value="Tech & B2B Services">Tech & B2B Services</option>
                <option value="Health & Functional Wellness">Health & Wellness</option>
                <option value="Education & Coaching">Education & Coaching</option>
                <option value="Eco-Friendly & Green Retail">Eco-Friendly & Retail</option>
                <option value="Fashion & Sustainable Apparel">Fashion & Apparel</option>
              </select>
            </div>

            {/* Starting Budget */}
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider text-[10px] mb-1">
                Available Capital / Budget
              </label>
              <select
                value={capitalRange}
                onChange={(e) => setCapitalRange(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4A154B]"
              >
                <option value="Under ₹20,000 (Micro Bootstrapped)">Under ₹20,000 (Micro)</option>
                <option value="₹25,000 - ₹75,000">₹25,000 - ₹75,000</option>
                <option value="₹75,000 - ₹1,50,000">₹75,000 - ₹1,50,000</option>
                <option value="₹1,50,000 - ₹3,00,000">₹1,50,000 - ₹3,00,000</option>
                <option value="₹3,00,000+ (Scale Venture)">₹3,00,000+ (Scale)</option>
              </select>
            </div>

            {/* Time Commitment */}
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider text-[10px] mb-1">
                Time Dedication
              </label>
              <select
                value={timeCommitment}
                onChange={(e) => setTimeCommitment(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4A154B]"
              >
                <option value="Full-Time (35-45 hrs/week)">Full-Time (35-45 hrs/wk)</option>
                <option value="Part-Time (15-25 hrs/week)">Part-Time (15-25 hrs/wk)</option>
                <option value="Weekend Venture (5-10 hrs/week)">Weekend (5-10 hrs/wk)</option>
              </select>
            </div>

            {/* Primary Strength */}
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider text-[10px] mb-1">
                Your Strongest Skill
              </label>
              <select
                value={coreStrength}
                onChange={(e) => setCoreStrength(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#4A154B]"
              >
                <option value="Creative Design & Crafting">Creative Design & Crafting</option>
                <option value="Social Media, Video & Marketing">Marketing & Social Media</option>
                <option value="Cooking, Baking & Culinary Arts">Culinary Arts & Baking</option>
                <option value="Client Relationship & Teaching">Client Relations & Teaching</option>
                <option value="Operations, Finance & Planning">Operations & Organization</option>
              </select>
            </div>
          </div>

          {/* Sales Channel Preference */}
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider text-[10px] mb-1.5">
              Preferred Sales & Distribution Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: '100% Online & HerMarket', title: '100% Online & HerMarket', desc: 'Direct-to-consumer website, Instagram & shipping' },
                { id: 'Local Neighborhood & Events', title: 'Local Hub & Popups', desc: 'Farmers markets, local community pickup, popups' },
                { id: 'Hybrid Model (Online + B2B Wholesale)', title: 'Hybrid & B2B Gifting', desc: 'Corporate orders, wedding favors & retail' }
              ].map((mode) => (
                <div
                  key={mode.id}
                  onClick={() => setSalesChannel(mode.id)}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                    salesChannel === mode.id
                      ? 'border-[#4A154B] bg-purple-50/70'
                      : 'border-gray-100 hover:border-purple-200'
                  }`}
                >
                  <span className="font-bold text-gray-900 block text-xs">{mode.title}</span>
                  <span className="text-[10px] text-gray-500 block mt-0.5">{mode.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Generate Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 bg-gradient-to-r from-[#4A154B] via-[#631c64] to-[#be185d] hover:opacity-95 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-pink-300" />
                  <span>
                    {generationStep === 1 && 'Calibrating Market Viability & Consumer Demand...'}
                    {generationStep === 2 && 'Structuring Unit Economics & Startup Budget...'}
                    {generationStep === 3 && 'Finalizing 4-Phase Roadmap & Legal Checklist...'}
                  </span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-pink-300" />
                  <span>Generate Detailed AI Business Blueprint</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 3: GENERATED BUSINESS PLAN REPORT */}
      {generatedPlan && (
        <div className="bg-white rounded-3xl border border-purple-100 shadow-md p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
          {/* Executive Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-purple-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-[#4A154B] px-3 py-0.5 rounded-full">
                  {generatedPlan.industry}
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  ✓ {generatedPlan.difficulty}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                {generatedPlan.businessName}
              </h2>
              <p className="text-xs text-[#be185d] font-semibold italic">
                "{generatedPlan.tagline}"
              </p>
            </div>

            {/* Top Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopySummary}
                className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-[#4A154B] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                title="Copy plan text"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </button>

              <button
                onClick={handleDownloadPdf}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-emerald-200"
                title="Download complete A4 PDF document"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Download Blueprint (PDF)</span>
              </button>

              <button
                onClick={handleTransferToPlan}
                className="px-4 py-2 bg-[#4A154B] hover:bg-[#350c36] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-pink-300" />
                <span>Load into 10-Section Plan →</span>
              </button>
            </div>
          </div>

          {/* Key Metric Highlights (4 Cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Est. Starting Capital</span>
              <strong className="text-sm sm:text-base font-extrabold text-[#4A154B] block mt-0.5">
                {generatedPlan.initialInvestment}
              </strong>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Target Gross Margin</span>
              <strong className="text-sm sm:text-base font-extrabold text-emerald-700 block mt-0.5">
                {generatedPlan.profitMargin}
              </strong>
            </div>

            <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-100">
              <span className="text-[10px] text-pink-800 font-bold uppercase tracking-wider block">Year 1 Potential Revenue</span>
              <strong className="text-sm sm:text-base font-extrabold text-[#be185d] block mt-0.5">
                {generatedPlan.projectedRevenueYear1}
              </strong>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100">
              <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Breakeven Horizon</span>
              <strong className="text-sm sm:text-base font-extrabold text-amber-900 block mt-0.5">
                {generatedPlan.breakevenTimeline}
              </strong>
            </div>
          </div>

          {/* PART 1: The Problem & The Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 bg-rose-50/50 rounded-3xl border border-rose-100 space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>The Core Market Problem</span>
              </span>
              <p className="text-gray-700 leading-relaxed font-normal">
                {generatedPlan.problemStatement}
              </p>
            </div>

            <div className="p-5 bg-emerald-50/50 rounded-3xl border border-emerald-100 space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Your Proposed Solution & Edge</span>
              </span>
              <p className="text-gray-700 leading-relaxed font-normal">
                {generatedPlan.solution}
              </p>
              <div className="pt-2 text-[11px] text-[#4A154B] font-semibold border-t border-emerald-100">
                <strong>USP:</strong> {generatedPlan.uniqueSellingProposition}
              </div>
            </div>
          </div>

          {/* PART 2: Target Audience & Persona */}
          <div className="p-5 bg-[#faf9fd] rounded-3xl border border-purple-100 space-y-3 text-xs">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#4A154B] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              <span>Target Customer Profile & Persona</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-bold text-gray-500 text-[10px] uppercase block">Demographics</span>
                <p className="text-gray-800 mt-0.5 font-medium">{generatedPlan.targetAudience.demographics}</p>
              </div>
              <div>
                <span className="font-bold text-gray-500 text-[10px] uppercase block">Psychographics & Lifestyle</span>
                <p className="text-gray-800 mt-0.5 font-medium">{generatedPlan.targetAudience.psychographics}</p>
              </div>
              <div>
                <span className="font-bold text-gray-500 text-[10px] uppercase block">Primary Buying Trigger</span>
                <p className="text-gray-800 mt-0.5 font-medium">{generatedPlan.targetAudience.painPoint}</p>
              </div>
            </div>
          </div>

          {/* PART 3: Product & Pricing Architecture */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                <BadgePercent className="w-4 h-4 text-[#be185d]" />
                <span>Tiered Product Architecture & Pricing Strategy</span>
              </h4>
              <span className="text-[11px] text-gray-500">Tiered for high conversion & upsell</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {generatedPlan.productTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl border border-purple-100 bg-white hover:border-[#4A154B] transition-all space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-[#4A154B]">
                        {tier.tierName}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {tier.margin} Margin
                      </span>
                    </div>

                    <div className="mt-2">
                      <span className="text-xl font-black text-gray-900">{tier.price}</span>
                      <span className="text-[11px] text-gray-400 block font-normal">Est. COGS: {tier.cogs}</span>
                    </div>

                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {tier.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PART 4: 4-Phase Step-by-Step Launch Roadmap */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#4A154B]" />
              <span>Step-by-Step 4-Phase Launch Roadmap</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {generatedPlan.roadmapPhases.map((phase, idx) => (
                <div key={idx} className="p-5 rounded-3xl bg-[#faf9fd] border border-purple-100 space-y-3">
                  <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                    <span className="text-xs font-black text-[#4A154B]">{phase.phase}</span>
                    <span className="text-[10px] font-bold bg-white text-gray-600 px-2 py-0.5 rounded-full border border-purple-100">
                      {phase.timeline}
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-gray-700">
                    {phase.tasks.map((task, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2 leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* PART 5: Startup Budget Breakdown */}
          <div className="p-6 bg-purple-50/40 rounded-3xl border border-purple-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Itemized Startup Budget & Capital Allocation</span>
                </h4>
                <p className="text-[11px] text-gray-500">
                  Total Initial Estimate: ₹
                  {generatedPlan.startupBudget.reduce((acc, curr) => acc + curr.cost, 0).toLocaleString('en-IN')}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl">
                Conservative Bootstrap Estimate
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {generatedPlan.startupBudget.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-2xl border border-purple-100">
                  <div>
                    <strong className="text-gray-900 block font-bold">{item.category}</strong>
                    <span className="text-[11px] text-gray-500">{item.description}</span>
                  </div>
                  <span className="font-mono font-extrabold text-gray-900">
                    ₹{item.cost.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PART 6 & 7: Marketing Channels & Legal Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Marketing */}
            <div className="p-6 bg-white rounded-3xl border border-purple-100 space-y-3">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#be185d]" />
                <span>Customer Acquisition Playbook</span>
              </h4>
              <ul className="space-y-2 text-gray-700">
                {generatedPlan.marketingPlaybook.map((play, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-pink-100 text-[#be185d] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{play}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="p-6 bg-white rounded-3xl border border-purple-100 space-y-3">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#4A154B]" />
                <span>Mandatory Registrations & Legal Checklist</span>
              </h4>
              <ul className="space-y-2 text-gray-700">
                {generatedPlan.legalChecklist.map((legal, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{legal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* PART 8: Risk Mitigation */}
          <div className="p-6 bg-amber-50/50 rounded-3xl border border-amber-200/60 space-y-3 text-xs">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-900">
              Risk Management & Defensive Strategy
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {generatedPlan.riskMitigation.map((riskItem, idx) => (
                <div key={idx} className="space-y-1 bg-white p-3.5 rounded-2xl border border-amber-100">
                  <span className="font-bold text-red-700 block text-[11px]">⚠️ Risk: {riskItem.risk}</span>
                  <p className="text-gray-700 text-[11px] leading-relaxed">
                    <strong>Solution:</strong> {riskItem.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              Ready to execute? Transfer this blueprint into the 10-Section Plan Builder to edit specific projections.
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  setGeneratedPlan(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 font-bold text-xs transition-colors cursor-pointer"
              >
                Tweak Inputs
              </button>

              <button
                onClick={handleTransferToPlan}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-[#4A154B] hover:bg-[#350c36] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Load into 10-Section Plan Builder</span>
                <ArrowRight className="w-4 h-4 text-pink-300" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// Dynamic Plan Synthesis Logic: Produces professional, granular blueprints
// =========================================================================
function buildCustomPlan(
  topic: string,
  category: string,
  capital: string,
  commitment: string,
  strength: string,
  channel: string
): GeneratedIdeaPlan {
  const words = topic.split(' ');
  const primaryWord = words[0] || 'Venture';
  const brandName = `${primaryWord.charAt(0).toUpperCase() + primaryWord.slice(1)} Artisans & Co.`;

  return {
    businessName: brandName,
    tagline: `Premium, Sustainable & Empowering Solutions in ${category}`,
    industry: category,
    difficulty: commitment.includes('Weekend') ? 'Beginner Friendly' : 'Moderate',
    initialInvestment: capital,
    profitMargin: category.includes('Services') || category.includes('Education') ? '75% - 88%' : '52% - 66%',
    projectedRevenueYear1: capital.includes('Under') ? '₹8,50,000 - ₹14,00,000' : '₹18,00,000 - ₹32,00,000',
    breakevenTimeline: '4 to 6 Months',
    problemStatement: `Modern consumers in India are increasingly frustrated by generic, synthetic, and overpriced mass-market alternatives in the ${category.toLowerCase()} segment. They lack transparent, culturally rooted, and reliable options tailored to conscious urban and semi-urban households.`,
    solution: `We establish an agile, authentic brand specializing in small-batch, customer-centric offerings around "${topic}". By leveraging direct digital channels (${channel}) and community trust, we eliminate high distributor markups to offer premium quality at accessible price points.`,
    uniqueSellingProposition: `Handcrafted small-batch precision, clean ingredient/process transparency, and bespoke customer care backed by female artisan empowerment.`,
    targetAudience: {
      demographics: 'Conscious urban women & families aged 23-48, working professionals, and thoughtful gifting shoppers.',
      psychographics: 'Prioritize health, authentic craftsmanship, sustainable packaging, and supporting women-owned local ventures.',
      painPoint: 'Tired of mass-produced chemical or impersonal products; willing to pay a fair premium for verified quality and transparent origins.'
    },
    productTiers: [
      {
        tierName: 'Tier 1: Starter / Trial Kit',
        price: '₹349 - ₹499',
        cogs: '₹120 - ₹160',
        margin: '65%',
        description: 'Low-friction entry product designed for rapid customer sampling, gifting, and first-time trust building.'
      },
      {
        tierName: 'Tier 2: Signature Bestseller',
        price: '₹899 - ₹1,299',
        cogs: '₹310 - ₹420',
        margin: '68%',
        description: 'Our core high-value bundle offering maximum utility, premium recyclable packaging, and customer favorite blends.'
      },
      {
        tierName: 'Tier 3: VIP Annual / Corporate Pack',
        price: '₹2,499 - ₹4,999',
        cogs: '₹850 - ₹1,650',
        margin: '66%',
        description: 'High-ticket seasonal gifting hamper or monthly recurring subscription box generating predictable recurring cashflow.'
      }
    ],
    roadmapPhases: [
      {
        phase: 'Phase 1: Validation & Setup',
        timeline: 'Days 1 - 10',
        tasks: [
          'Survey 25 prospective buyers to confirm exact fragrance/taste/service preferences',
          'Create brand identity (logo, brand colors, aesthetic guidelines using Canva)',
          'Set up dedicated WhatsApp Business catalog & Instagram business handle',
          'Register for free MSME Udyam certificate online in under 30 minutes'
        ]
      },
      {
        phase: 'Phase 2: Sourcing & Prototyping',
        timeline: 'Days 11 - 20',
        tasks: [
          'Procure initial raw materials and food-grade/sustainable packaging in wholesale lots',
          'Craft 15 sample units; conduct blind feedback tasting/testing with target users',
          'Capture high-resolution aesthetic reels and lifestyle photos using smartphone natural light',
          'Calculate exact unit economics using HerBusiness pricing calculator'
        ]
      },
      {
        phase: 'Phase 3: Launch & First 25 Buyers',
        timeline: 'Days 21 - 30',
        tasks: [
          'Launch exclusive early-adopter bundle offering 15% discount for first 25 orders',
          'List catalog products on HerRise HerMarket platform to access verified sisterhood buyers',
          'Seed complimentary gift hampers to 5 local micro-influencers in exchange for authentic reviews',
          'Collect 10 photo/video customer testimonials for social proof'
        ]
      },
      {
        phase: 'Phase 4: Retain & Scale',
        timeline: 'Month 2 Onwards',
        tasks: [
          'Introduce monthly refill club / recurring subscription to build recurring revenue',
          'Pitch local boutique cafes, organic stores, or corporate offices for festive gifting contracts',
          'Leverage HerFund women micro-loan assistance if inventory expansion is required',
          'Hire and train 1-2 local women part-time for packaging and dispatch fulfillment'
        ]
      }
    ],
    startupBudget: [
      {
        category: 'Initial Raw Materials & Ingredients',
        cost: 18000,
        description: 'Sufficient supplies for first 150 customer units'
      },
      {
        category: 'Sustainable Packaging & Custom Labels',
        cost: 9500,
        description: 'Recyclable cartons, custom paper stickers, seal tapes'
      },
      {
        category: 'Basic Equipment / Tools',
        cost: 7500,
        description: 'Production essentials, digital weighing scale, sealing machine'
      },
      {
        category: 'Branding, Photography & Sample Seeding',
        cost: 5000,
        description: 'Mini backdrop studio, gift box seeding to micro-influencers'
      },
      {
        category: 'Legal Registrations & License Fees',
        cost: 4500,
        description: 'Udyam (free), FSSAI basic / local municipal trade license'
      },
      {
        category: 'Emergency Working Capital Cushion',
        cost: 8000,
        description: 'Contingency fund to cover delayed courier remittances'
      }
    ],
    marketingPlaybook: [
      'Behind-The-Scenes Video Reels: Document raw ingredient unboxing, hygienic pouring/cooking, and packaging with relaxing audio.',
      'HerMarket Sisterhood Launch: Host a featured launch showcase on the HerRise platform with member-exclusive bundle pricing.',
      'WhatsApp VIP Circle: Create an invite-only broadcast channel for repeat customers with early access to limited edition seasonal batches.',
      'Corporate & Wedding Gifting Pitch: Reach out to HR heads and wedding planners with customizable branded tags.'
    ],
    legalChecklist: [
      'Udyam Registration (Ministry of MSME) — 100% free, unlocks priority bank microloans & subsidies',
      'FSSAI Basic Food Safety Registration (if Food/Wellness) or Trade License',
      'Current Business Bank Account opened in enterprise trade name',
      'Goods and Services Tax (GSTIN) registration once turnover exceeds statutory thresholds',
      'Trademark application for brand name and logo protection'
    ],
    riskMitigation: [
      {
        risk: 'Raw Material Price Fluctuation',
        solution: 'Establish relationships with 2 independent wholesale vendors and procure 45-day inventory during harvest or price dips.'
      },
      {
        risk: 'Slow Initial Social Media Growth',
        solution: 'Rely on direct WhatsApp networking, pop-up stalls in residential societies, and HerMarket platform referrals rather than paying for expensive Meta ads.'
      },
      {
        risk: 'Courier Transit Damage',
        solution: 'Invest in honeycomb paper bubble wrap and double-wall corrugated shipping boxes to maintain damage rates under 1%.'
      }
    ]
  };
}
