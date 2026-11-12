import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Briefcase,
  Rocket,
  Landmark,
  ShoppingBag,
  GraduationCap,
  Users2,
  CheckCircle2,
  ChevronDown,
  Star,
  Globe2,
  Lightbulb,
  HeartHandshake,
  BadgeCheck,
  Play
} from 'lucide-react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { ModuleCard } from '../../components/cards/ModuleCard';
import { platformTestimonials, platformFAQs } from '../../data/mockData/testimonialsData';
import { successStoriesData } from '../../data/mockData/networkData';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<string | null>('faq-1');

  const modulesList = [
    {
      id: 'finance',
      number: '01',
      name: 'HerFinance',
      tagline: 'Financial Management & Wealth Security',
      description: 'Master your income, expenses, 50/30/20 budgeting, and automated liquid emergency funds with interactive analytics.',
      icon: Wallet,
      gradient: 'from-[#4A154B] to-[#7e22ce]',
      route: '/finance',
      badge: 'Core Fintech',
      features: [
        'Income & Expense Real-Time Tracker',
        'Interactive 50/30/20 Budgeting Matrix',
        'Emergency Fund & SIP Calculators',
        'Bite-Sized Financial Literacy Lessons'
      ]
    },
    {
      id: 'career',
      number: '02',
      name: 'HerCareer',
      tagline: 'Career Relaunch & Remote Job Hub',
      description: 'Break into high-growth roles or return after a sabbatical with our resume builder, gap-explaining frameworks, and returnships.',
      icon: Briefcase,
      gradient: 'from-[#7e22ce] to-[#be185d]',
      route: '/career',
      badge: 'Returnships',
      features: [
        'Multi-Template Live Resume Builder',
        'Verified Remote & WFH Job Discovery',
        'Dedicated Career Returnee Tracks',
        'STAR Method Mock Interview Coach'
      ]
    },
    {
      id: 'business',
      number: '03',
      name: 'HerBusiness',
      tagline: 'Startup Studio & Idea Validation',
      description: 'Turn home passions into sustainable commercial businesses with 10-section business plans, feasibility checks, and pricing tools.',
      icon: Rocket,
      gradient: 'from-[#be185d] to-[#e11d48]',
      route: '/business',
      badge: 'Incubator',
      features: [
        'High-Potential Business Idea Library',
        '10-Section AI Business Plan Generator',
        'Pricing & Profit Margin Calculator',
        '30-Day Step-by-Step Launch Roadmap'
      ]
    },
    {
      id: 'fund',
      number: '04',
      name: 'HerFund',
      tagline: 'Funding & Grant Navigator',
      description: 'Compare public bank loans, NBFC schemes, crowdfunding pools, and grants with complete fee transparency and document checklists.',
      icon: Landmark,
      gradient: 'from-[#e11d48] to-[#ea580c]',
      route: '/fund',
      badge: 'Capital Hub',
      features: [
        'Side-by-Side Scheme Comparison',
        'Interactive Loan Readiness Checklist',
        'Pre-Flight Document Upload Preview',
        '6-Slide Pitch Deck Builder'
      ]
    },
    {
      id: 'market',
      number: '05',
      name: 'HerMarket',
      tagline: 'Women-Led Products Marketplace',
      description: 'Showcase and sell handmade creations, wellness infusions, artisan fashion, and digital consulting templates without high commissions.',
      icon: ShoppingBag,
      gradient: 'from-[#ea580c] to-[#d97706]',
      route: '/market',
      badge: 'E-commerce',
      features: [
        'Boutique Storefront for Female Sellers',
        'Seller Dashboard & Revenue Analytics',
        'One-Click Product Publishing Form',
        'Integrated Cart & Mock UPI Checkout'
      ]
    },
    {
      id: 'learn',
      number: '06',
      name: 'HerLearn',
      tagline: 'Skill Academies & Verified Certifications',
      description: 'Gain future-ready competencies in AI productivity, digital commerce, personal taxation, and executive negotiation with instant scoring.',
      icon: GraduationCap,
      gradient: 'from-[#d97706] to-[#059669]',
      route: '/learn',
      badge: 'Accredited',
      features: [
        '8 Specialized Women-Centric Tracks',
        'Interactive Video Player Simulation',
        'Real-Time Scoring Knowledge Quizzes',
        'Verifiable Digital Completion Badges'
      ]
    },
    {
      id: 'network',
      number: '07',
      name: 'HerNetwork',
      tagline: '1:1 Mentorship & Sisterhood Community',
      description: 'Book 1-on-1 strategy calls with certified women leaders, attend weekend venture masterclasses, and share founder wins in our feed.',
      icon: Users2,
      gradient: 'from-[#059669] to-[#4A154B]',
      route: '/network',
      badge: 'Community',
      features: [
        'Verified Mentors in Tech, Law & Venture',
        'Interactive 1:1 Session Slot Booking',
        'Live Masterclasses & Event Registration',
        'Sisterhood Wins & Advice Discussion Feed'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf9fd] flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-purple-200/30 via-pink-100/20 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-xs font-semibold text-[#4A154B]">
                <Sparkles className="w-4 h-4 text-[#fb7185]" />
                <span>The Unified Ecosystem for Women's Independence</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
                Your Dreams Deserve a Platform.{' '}
                <span className="bg-gradient-to-r from-[#4A154B] via-[#9333ea] to-[#e11d48] bg-clip-text text-transparent">
                  Your Future Deserves HerRise.
                </span>
              </h1>

              {/* Tagline & Description */}
              <p className="text-lg sm:text-xl font-semibold text-[#4A154B]/90">
                Her Future. Her Finance. Her Freedom.
              </p>

              <p className="text-base text-gray-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                HerRise AI is a modern, unified platform designed to help women learn high-value skills, manage personal wealth with confidence, launch resilient micro-enterprises, secure non-predatory funding, and thrive through verified 1:1 mentorship.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/register"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#4A154B] hover:bg-[#350c36] text-white px-8 py-4 rounded-2xl font-bold text-base shadow-lg shadow-purple-950/20 hover:shadow-xl transition-all cursor-pointer"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5 text-pink-300" />
                </Link>

                <a
                  href="#modules"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-purple-50/80 text-gray-800 border border-purple-200 px-7 py-4 rounded-2xl font-semibold text-base shadow-xs transition-all"
                >
                  <span>Explore Features</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Bank-Grade Data Privacy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-[#4A154B]" />
                  <span>English, हिन्दी & मराठी</span>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-[#fb7185]" />
                  <span>Curated by Certified Experts</span>
                </div>
              </div>
            </div>

            {/* Right Visual Card Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Card with Visual Composition */}
                <div className="bg-white rounded-3xl p-6 shadow-2xl border border-purple-100 relative z-10 backdrop-blur-md">
                  {/* Top user badge */}
                  <div className="flex items-center justify-between pb-4 border-b border-purple-100">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                        alt="Empowered Woman"
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-purple-200"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">Verified Member Network</h4>
                        <p className="text-[11px] text-gray-500">Live Collaborative Ecosystem</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Live Ecosystem
                    </span>
                  </div>

                  {/* Visual Stats Row */}
                  <div className="grid grid-cols-2 gap-3 my-4">
                    <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Dynamic Inflow</span>
                      <div className="text-xl font-extrabold text-[#4A154B] mt-0.5">Real-Time Ledger</div>
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
                        <TrendingUp className="w-3 h-3" /> 50/30/20 Smart Allocation
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Storefront Settlement</span>
                      <div className="text-xl font-extrabold text-[#be185d] mt-0.5">Direct Payouts</div>
                      <span className="text-[11px] font-semibold text-[#be185d] flex items-center gap-0.5 mt-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 100% Commission-Free
                      </span>
                    </div>
                  </div>

                  {/* Micro AI Assistant Chat Preview */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 to-[#4A154B] text-white shadow-md">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-pink-300" />
                      <span className="text-xs font-bold text-pink-200">HerRise AI Copilot</span>
                    </div>
                    <p className="text-xs text-purple-100 leading-relaxed">
                      "I’ve matched your 5-year marketing background with 3 remote Returnship programs offering structured onboarding and 20% higher pay."
                    </p>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-purple-700/50 text-[11px]">
                      <span className="text-purple-200">Recommendation Ready</span>
                      <span className="font-semibold text-pink-300 hover:underline cursor-pointer" onClick={() => navigate('/career')}>
                        View Roles →
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating pill 1 */}
                <div className="absolute -top-4 -left-6 bg-white p-3 rounded-2xl shadow-xl border border-purple-100 flex items-center gap-2.5 z-20 hidden sm:flex">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-[#4A154B]">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-gray-500 font-medium">50/30/20 Budgeting</p>
                    <p className="text-xs font-bold text-gray-900">Balanced & Tracked</p>
                  </div>
                </div>

                {/* Floating pill 2 */}
                <div className="absolute -bottom-5 -right-4 bg-white p-3 rounded-2xl shadow-xl border border-purple-100 flex items-center gap-2.5 z-20 hidden sm:flex">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-gray-500 font-medium">Verified Mentor Call</p>
                    <p className="text-xs font-bold text-emerald-700">Booked: Saturday 5 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics Section (Demo Data) */}
      <section className="py-12 bg-white border-y border-purple-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#fb7185] bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
              Platform Impact (Interactive Demo Data)
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl hover:bg-purple-50/50 transition-colors">
              <div className="text-3xl sm:text-4xl font-black text-[#4A154B] tracking-tight">120,000+</div>
              <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-1">Women Empowered</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Across 28 states & union territories</p>
            </div>

            <div className="p-4 rounded-2xl hover:bg-purple-50/50 transition-colors">
              <div className="text-3xl sm:text-4xl font-black text-[#9333ea] tracking-tight">45,000+</div>
              <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-1">Career Opportunities</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Remote, flexible & returnship roles</p>
            </div>

            <div className="p-4 rounded-2xl hover:bg-purple-50/50 transition-colors">
              <div className="text-3xl sm:text-4xl font-black text-[#be185d] tracking-tight">18,500+</div>
              <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-1">Businesses Supported</p>
              <p className="text-[11px] text-gray-400 mt-0.5">From idea validation to HerMarket sales</p>
            </div>

            <div className="p-4 rounded-2xl hover:bg-purple-50/50 transition-colors">
              <div className="text-3xl sm:text-4xl font-black text-[#e11d48] tracking-tight">850+</div>
              <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-1">Learning Resources</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Video masterclasses & quizzes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seven Modules Showcase */}
      <section id="modules" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-[#4A154B] text-xs font-bold uppercase tracking-wider">
            All-In-One Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Seven Purpose-Built Modules for Total Empowerment
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Unlike fragmented apps, HerRise AI connects your money, career, business ventures, capital access, and community into one synchronized engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modulesList.map((m) => (
            <ModuleCard
              key={m.id}
              id={m.id}
              number={m.number}
              name={m.name}
              tagline={m.tagline}
              description={m.description}
              icon={m.icon}
              features={m.features}
              route={m.route}
              badge={m.badge}
              gradient={m.gradient}
            />
          ))}

          {/* 8th Card: Unified AI Copilot Highlight */}
          <div className="bg-gradient-to-br from-[#3b0764] via-[#4A154B] to-[#be185d] text-white rounded-3xl p-7 shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="w-36 h-36" />
            </div>

            <div>
              <div className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-pink-300 mb-4 shadow-xs">
                <Sparkles className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 text-white inline-block mb-2">
                Unified Copilot
              </span>
              <h3 className="text-xl font-bold text-white mb-1">HerRise AI Assistant</h3>
              <p className="text-xs text-pink-200 font-semibold mb-3">One Chatbot for All 7 Disciplines</p>
              <p className="text-xs text-purple-100 leading-relaxed mb-6">
                Ask questions regarding emergency funds, resume gap wording, pricing handmade goods, or loan requirements.
              </p>

              <div className="space-y-2 mb-6 text-xs text-purple-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-300" />
                  <span>Module-Specific Predefined Prompts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-300" />
                  <span>Instant Calculations & STAR Formulas</span>
                </div>
              </div>
            </div>

            <Link
              to="/ai-assistant"
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white text-[#4A154B] font-bold text-xs hover:bg-pink-50 transition-all shadow-md"
            >
              <span>Launch AI Assistant</span>
              <ArrowRight className="w-4 h-4 text-[#4A154B]" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-y border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A154B] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Clear & Simple Path
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              How HerRise AI Works
            </h2>
            <p className="text-sm text-gray-600">
              A 4-step progressive journey tailored to your individual ambitions and current stage of life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-[#faf9fd] p-6 rounded-3xl border border-purple-100 relative group hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#4A154B] text-white flex items-center justify-center font-black text-lg mb-4 shadow-md shadow-purple-950/20">
                1
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Create Your Profile</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Sign up in under 60 seconds. Choose your preferred language (English, Hindi, or Marathi) and define your background.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#faf9fd] p-6 rounded-3xl border border-purple-100 relative group hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#7e22ce] text-white flex items-center justify-center font-black text-lg mb-4 shadow-md shadow-purple-950/20">
                2
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Choose Your Goals</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Select from 8 personalized objectives: budget tracking, career relaunch, startup building, capital discovery, or skill growth.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#faf9fd] p-6 rounded-3xl border border-purple-100 relative group hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#be185d] text-white flex items-center justify-center font-black text-lg mb-4 shadow-md shadow-purple-950/20">
                3
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Explore Opportunities</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Access curated remote jobs, transparent bank loan options, marketplace storefront tools, and 1:1 mentor bookings.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#faf9fd] p-6 rounded-3xl border border-purple-100 relative group hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#e11d48] text-white flex items-center justify-center font-black text-lg mb-4 shadow-md shadow-purple-950/20">
                4
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Learn, Earn & Grow</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Complete verifiable skill courses, build your emergency fund, and celebrate milestones alongside an encouraging sisterhood.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose HerRise AI */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#fb7185] bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
              Why Choose HerRise AI
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Designed with Dignity, Privacy and Genuine Economic Impact
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We eliminated the noise, aggressive advertising, and condescending advice found in conventional financial portals. HerRise AI treats every woman as the CEO of her own destiny.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#4A154B] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#4A154B]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">One Connected Platform</h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    No need to juggle 7 separate apps. Your budget informs your business plan, and your courses unlock job matches.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-[#be185d] flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-[#be185d]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Empathetic Career Returnship Models</h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    We normalize career breaks taken for motherhood or family care with proud resume positioning.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#4A154B] flex items-center justify-center shrink-0">
                  <Globe2 className="w-5 h-5 text-[#4A154B]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Inclusive Regional Language Support</h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Available in English, Hindi, and Marathi so economic literacy is not gatekept by language barriers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-tr from-purple-100/60 to-pink-50/60 p-8 rounded-3xl border border-purple-100">
            <div className="bg-white p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-900">Holistic Women's Index</span>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  All Systems Aligned
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Financial Resilience Score</span>
                    <span className="font-bold text-[#4A154B]">88 / 100</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#4A154B] h-full rounded-full w-[88%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Business Feasibility Index</span>
                    <span className="font-bold text-[#be185d]">92 / 100</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#be185d] h-full rounded-full w-[92%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Career Match Currency</span>
                    <span className="font-bold text-[#9333ea]">85 / 100</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#9333ea] h-full rounded-full w-[85%]" />
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <Link
                  to="/onboarding"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A154B] hover:underline"
                >
                  Personalize Your Dashboard Path →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section id="success-stories" className="py-20 bg-white border-y border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A154B] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Real Journeys (Demo Case Studies)
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Stories of Transformation & Sisterhood
            </h2>
            <p className="text-sm text-gray-600">
              Discover how women from diverse backgrounds leveraged HerRise AI to build independence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStoriesData.map((story, idx) => (
              <div
                key={idx}
                className="bg-[#faf9fd] rounded-3xl border border-purple-100 p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-200 shadow-xs"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{story.name}</h4>
                      <p className="text-[11px] text-gray-500 font-medium">{story.role}</p>
                      <p className="text-[10px] text-purple-700 font-semibold">{story.location}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 italic leading-relaxed mb-4">
                    "{story.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-purple-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#4A154B] bg-purple-100/70 px-2.5 py-1 rounded-full">
                    {story.metrics}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-500">
                    {story.moduleUsed}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#fb7185] bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
            Member Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Loved by Women Building Their Futures
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {platformTestimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-7 rounded-3xl border border-purple-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mb-6">"{t.content}"</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-purple-50">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-purple-200"
                />
                <div>
                  <h5 className="text-xs font-bold text-gray-900">{t.name}</h5>
                  <p className="text-[11px] text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white border-t border-purple-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A154B] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Got Questions? We Have Answers.
            </h2>
          </div>

          <div className="space-y-4">
            {platformFAQs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="border border-purple-100 rounded-2xl overflow-hidden bg-[#faf9fd] transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-gray-900 hover:text-[#4A154B] transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        isOpen ? 'rotate-180 text-[#4A154B]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-purple-50 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Strip */}
      <section className="py-16 bg-gradient-to-r from-[#3b0764] via-[#4A154B] to-[#be185d] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Take Command of Your Financial Destiny?
          </h2>
          <p className="text-sm sm:text-base text-purple-200 max-w-2xl mx-auto leading-relaxed">
            Join thousands of women who are learning, earning, launching businesses, and thriving together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-[#4A154B] font-bold text-sm hover:bg-pink-50 transition-all shadow-xl"
            >
              Create Free Account
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/30 transition-all"
            >
              Explore Live Demo Dashboard
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

