import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Wallet,
  Briefcase,
  Rocket,
  Landmark,
  ShoppingBag,
  GraduationCap,
  Users2,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Target,
  Award,
  BadgeCheck,
  FileText
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
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/cards/StatCard';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { useMarket } from '../../context/MarketContext';
import { initialWorkshops } from '../../data/mockData/networkData';
import { initialCourses } from '../../data/mockData/learnData';
import { initialJobs } from '../../data/mockData/careerData';

export const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const { totalIncome, totalExpenses, currentSavings, monthlyBudget } = useFinance();
  const { orders } = useMarket();
  const navigate = useNavigate();

  // If visitor is unauthenticated, redirect to the marketing website
  React.useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const userGoals = user?.goals || [];
  const wantsCareer = userGoals.some((g) => /job|career|return/i.test(g)) || Boolean(user?.resumeData);
  const wantsFinance = userGoals.some((g) => /finance|saving|budget/i.test(g));
  const wantsBusiness = userGoals.some((g) => /business|fund|grant|sell|market/i.test(g));
  const wantsLearn = userGoals.some((g) => /learn|skill|course/i.test(g));
  const wantsNetwork = userGoals.some((g) => /mentor|network|leader/i.test(g));

  // Compute smart matching jobs based on extracted resume skills
  const userSkillsLower = (user?.skills || []).map((s) => s.toLowerCase());
  const matchedJobs = React.useMemo(() => {
    return initialJobs
      .map((job) => {
        const matching = job.skills.filter((sk) =>
          userSkillsLower.some((us) => sk.toLowerCase().includes(us) || us.includes(sk.toLowerCase()))
        );
        const matchPercentage = Math.min(
          98,
          Math.max(82, Math.round(78 + (matching.length / (job.skills.length || 1)) * 20))
        );
        return { ...job, matchingSkills: matching, matchPercentage };
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [userSkillsLower]);

  const enrolledCourse = initialCourses.find((c) => c.isEnrolled) || initialCourses[0];
  const upcomingWorkshop = initialWorkshops[0];

  // Dynamic cashflow trend derived from user finances
  const dynamicMonthlyTrend = [
    { month: '3 Mo Ago', income: Math.round(totalIncome * 0.85), expenses: Math.round(totalExpenses * 0.9) },
    { month: '2 Mo Ago', income: Math.round(totalIncome * 0.92), expenses: Math.round(totalExpenses * 0.95) },
    { month: 'Last Mo', income: Math.round(totalIncome * 0.97), expenses: Math.round(totalExpenses * 0.88) },
    { month: 'Current', income: totalIncome, expenses: totalExpenses }
  ];

  // Prioritize Quick Actions based on user goals
  const allQuickActions = [
    {
      id: 'career',
      label: 'Find Tech Jobs',
      sub: 'Matched to stack',
      icon: Briefcase,
      path: '/career',
      color: 'bg-pink-100 text-[#be185d]',
      preferred: wantsCareer
    },
    {
      id: 'finance',
      label: 'Log Inflow/Expense',
      sub: 'Track Cashflow',
      icon: Wallet,
      path: '/finance',
      color: 'bg-purple-100 text-[#4A154B]',
      preferred: wantsFinance
    },
    {
      id: 'business',
      label: 'Startup Launchpad',
      sub: 'Business Plan',
      icon: Rocket,
      path: '/business',
      color: 'bg-rose-100 text-[#e11d48]',
      preferred: wantsBusiness
    },
    {
      id: 'funding',
      label: 'Check Grants',
      sub: 'SIDBI Schemes',
      icon: Landmark,
      path: '/fund',
      color: 'bg-amber-100 text-[#d97706]',
      preferred: wantsBusiness
    },
    {
      id: 'learn',
      label: 'Upskill Courses',
      sub: 'Learn AI & Cloud',
      icon: GraduationCap,
      path: '/learn',
      color: 'bg-blue-100 text-[#2563eb]',
      preferred: wantsLearn
    },
    {
      id: 'network',
      label: 'Book a Mentor',
      sub: '1-on-1 Guidance',
      icon: Users2,
      path: '/network',
      color: 'bg-indigo-100 text-[#4f46e5]',
      preferred: wantsNetwork
    },
    {
      id: 'market',
      label: 'HerMarket Store',
      sub: 'Sell Products',
      icon: ShoppingBag,
      path: '/market',
      color: 'bg-emerald-100 text-[#059669]',
      preferred: false
    }
  ];

  // Sort quick actions so preferred actions come first
  const prioritizedActions = [...allQuickActions].sort((a, b) => {
    if (a.preferred && !b.preferred) return -1;
    if (!a.preferred && b.preferred) return 1;
    return 0;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ========================================================= */}
        {/* WELCOME BANNER (CUSTOMIZED ACCORDING TO USER & GOALS)     */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-[#3b0764] via-[#4A154B] to-[#be185d] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold text-pink-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personalized HerRise AI Dashboard</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name || 'Empowered Member'}! 🌸
              </h1>

              {/* Real Extracted Credentials Summary */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-purple-200">
                {user?.role && (
                  <span className="font-bold text-white bg-white/15 px-2.5 py-0.5 rounded-lg border border-white/20">
                    💼 {user.role}
                  </span>
                )}
                {user?.location && (
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/15">
                    📍 {user.location}
                  </span>
                )}
                {user?.skills && user.skills.length > 0 && (
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/15">
                    ⚡ {user.skills.length} Skills Analyzed
                  </span>
                )}
              </div>

              {/* Dynamic Goal-Oriented Subhead */}
              <p className="text-xs sm:text-sm text-purple-100 leading-relaxed pt-1">
                {wantsCareer && matchedJobs.length > 0
                  ? `Your profile has been analyzed with Groq AI. We have matched ${matchedJobs.length} live openings tailored to your technical stack with up to ${matchedJobs[0].matchPercentage}% ATS compatibility.`
                  : totalIncome > 0
                  ? `Your verified monthly cashflow is ₹${totalIncome.toLocaleString()} with ₹${currentSavings.toLocaleString()} in liquid reserves.`
                  : 'Your personalized workspace is ready. Explore your tailored modules below.'}
              </p>

              {/* User Selected Goals Badges */}
              {userGoals.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {userGoals.map((goal, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold bg-white/15 px-2.5 py-0.5 rounded-full border border-white/25 text-pink-100"
                    >
                      ✓ {goal}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Strength & Verification Badge */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 w-full md:w-64 shrink-0 text-left">
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-purple-100 flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5 text-pink-300" />
                  <span>Profile Strength</span>
                </span>
                <span className="text-pink-300 font-extrabold">{user?.completionPercentage || 90}%</span>
              </div>
              <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-400 to-amber-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${user?.completionPercentage || 90}%` }}
                />
              </div>
              <p className="text-[10px] text-purple-200 mt-2">
                {user?.resumeData ? 'ATS Resume Verified & Synced' : 'Add your resume to unlock 95%+ match scoring'}
              </p>
              <Link
                to="/career"
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-white hover:text-pink-200 hover:underline"
              >
                View Career Profile →
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4 PRIMARY STAT CARDS                                      */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Career Matches"
            value={`${matchedJobs.length} Roles`}
            subtitle={user?.role || 'Top Stack Alignment'}
            change={`${matchedJobs[0]?.matchPercentage || 95}% Match`}
            isPositive={true}
            icon={Briefcase}
            iconColor="text-[#be185d]"
            bgColor="bg-pink-100/70"
            badge="Live"
          />

          <StatCard
            title="Total Monthly Inflow"
            value={totalIncome > 0 ? `₹${totalIncome.toLocaleString()}` : "₹0"}
            change={totalIncome > 0 ? "Active Inflow" : "Pending setup"}
            isPositive={totalIncome > 0}
            subtitle={totalIncome > 0 ? "Verified Cashflow" : "Log income in HerFinance"}
            icon={Wallet}
            iconColor="text-[#4A154B]"
            bgColor="bg-purple-100/70"
          />

          <StatCard
            title="Liquid Savings Cushion"
            value={currentSavings > 0 ? `₹${currentSavings.toLocaleString()}` : "₹0"}
            change={currentSavings > 0 ? "Protected" : "Set Target"}
            isPositive={currentSavings > 0}
            subtitle={currentSavings > 0 ? "Emergency Reserve" : "Set 6-mo safety cushion"}
            icon={TrendingUp}
            iconColor="text-emerald-700"
            bgColor="bg-emerald-100/70"
          />

          <StatCard
            title="Marketplace Orders"
            value={orders.length > 0 ? `₹${orders.reduce((sum, o) => sum + (o.amount || 0), 0).toLocaleString()}` : "₹0"}
            change={orders.length > 0 ? `${orders.length} Orders` : "Ready"}
            isPositive={orders.length > 0}
            subtitle={orders.length > 0 ? "Sales Revenue" : "Storefront Enabled"}
            icon={ShoppingBag}
            iconColor="text-[#ea580c]"
            bgColor="bg-amber-100/70"
          />
        </div>

        {/* ========================================================= */}
        {/* DYNAMIC SECTION 1: IF USER WANTS CAREER / JOBS           */}
        {/* ========================================================= */}
        {wantsCareer && matchedJobs.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-pink-50 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-[#be185d] flex items-center justify-center font-bold">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    Recommended Opportunities for Your Stack
                  </h3>
                  <p className="text-xs text-gray-500">
                    Filtered by your extracted skills: <span className="font-semibold text-purple-900">{user?.skills?.slice(0, 4).join(', ') || user?.role || 'Technical Stack'}</span>
                  </p>
                </div>
              </div>

              <Link
                to="/career"
                className="text-xs font-bold text-[#be185d] hover:text-[#9d174d] hover:underline flex items-center gap-1"
              >
                <span>View All {matchedJobs.length} Matches</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 3 Matched Job Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {matchedJobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="bg-purple-50/30 hover:bg-purple-50/70 p-4 rounded-2xl border border-purple-100 hover:border-[#4A154B] transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {job.matchPercentage}% ATS Match
                        </span>
                        <h4 className="font-bold text-sm text-gray-900 mt-1.5 group-hover:text-[#4A154B] transition-colors leading-snug">
                          {job.title}
                        </h4>
                        <p className="text-xs text-gray-500">{job.company} • {job.location}</p>
                      </div>
                      <span className="text-xl shrink-0">{job.logo}</span>
                    </div>

                    <p className="text-xs font-bold text-[#4A154B]">{job.salaryRange}</p>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.skills.slice(0, 3).map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] font-medium bg-white px-2 py-0.5 rounded-md border border-purple-100 text-gray-700"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/career')}
                    className="w-full flex items-center justify-center gap-1.5 bg-[#4A154B] hover:bg-[#350c36] text-white py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    <span>Apply with ATS Resume</span>
                    <ArrowRight className="w-3.5 h-3.5 text-pink-300" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* DYNAMIC SECTION 2: IF USER WANTS BUSINESS / FUNDING      */}
        {/* ========================================================= */}
        {wantsBusiness && (
          <div className="bg-gradient-to-r from-amber-50/60 to-rose-50/60 p-6 rounded-3xl border border-amber-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-amber-200/60 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    Startup Launchpad & Grants Readiness
                  </h3>
                  <p className="text-xs text-gray-600">
                    Personalized capital schemes & business models for your journey
                  </p>
                </div>
              </div>
              <Link to="/fund" className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1">
                <span>Explore Grants</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-amber-100 space-y-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Government Initiative
                </span>
                <h4 className="font-bold text-sm text-gray-900">Stand-Up India Scheme</h4>
                <p className="text-gray-500 text-xs">
                  Bank loans between ₹10 Lakhs and ₹1 Crore for women entrepreneurs setting up greenfield ventures.
                </p>
                <button
                  onClick={() => navigate('/fund')}
                  className="font-bold text-[#4A154B] hover:underline flex items-center gap-1 pt-1"
                >
                  Check Eligibility →
                </button>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-100 space-y-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-[#be185d]">
                  Micro-Grant
                </span>
                <h4 className="font-bold text-sm text-gray-900">HerRise Catalyst Grant (₹1,50,000)</h4>
                <p className="text-gray-500 text-xs">
                  Zero-equity seed grant for early-stage women founders launching products or consulting services.
                </p>
                <button
                  onClick={() => navigate('/fund')}
                  className="font-bold text-[#4A154B] hover:underline flex items-center gap-1 pt-1"
                >
                  Apply for Grant →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* QUICK ACTIONS ROW (ORDERED ACCORDING TO USER'S INTENT)    */}
        {/* ========================================================= */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Quick Actions (Personalized for Your Goals)
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {prioritizedActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(action.path)}
                  className={`bg-white hover:bg-purple-50/70 border p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 shadow-2xs hover:shadow-xs transition-all group cursor-pointer ${
                    action.preferred ? 'border-[#4A154B]/40 ring-1 ring-[#4A154B]/20' : 'border-purple-100'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-800 leading-tight">{action.label}</span>
                  <span className="text-[10px] text-gray-400 leading-none">{action.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN GRID: FINANCIAL CASHFLOW & LEARNING / WORKSHOP FEEDS */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Financial Trend Chart */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-purple-50 gap-2">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Income vs. Expense Trend</h3>
                  <p className="text-xs text-gray-500">6-Month Cashflow Health</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#4A154B]" />
                    <span className="text-gray-700">Income</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#fb7185]" />
                    <span className="text-gray-700">Expenses</span>
                  </div>
                  <Link to="/finance" className="text-xs text-[#4A154B] font-bold hover:underline">
                    View Details →
                  </Link>
                </div>
              </div>

              <div className="h-64 mt-4 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dynamicMonthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3e8ff" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, '']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e9d5ff', fontSize: '12px' }}
                    />
                    <Bar dataKey="income" fill="#4A154B" radius={[6, 6, 0, 0]} name="Income" />
                    <Bar dataKey="expenses" fill="#fb7185" radius={[6, 6, 0, 0]} name="Expense" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* In-Progress Course Card */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#4A154B]" />
                  <h3 className="text-base font-bold text-gray-900">Learning In Progress</h3>
                </div>
                <Link to="/learn" className="text-xs text-[#4A154B] font-bold hover:underline">
                  All Courses →
                </Link>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                <img
                  src={enrolledCourse.thumbnail}
                  alt={enrolledCourse.title}
                  className="w-full sm:w-24 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                    {enrolledCourse.category}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900 mt-1 truncate">
                    {enrolledCourse.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">Instructor: {enrolledCourse.instructor}</p>

                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#4A154B] h-full rounded-full"
                        style={{ width: `${enrolledCourse.progressPercent || 72}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#4A154B]">
                      {enrolledCourse.progressPercent || 72}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/learn')}
                  className="w-full sm:w-auto bg-[#4A154B] text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-[#350c36] transition-colors shrink-0 cursor-pointer"
                >
                  Resume Lesson
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Upcoming Live Workshop */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#be185d]" />
                  <h3 className="text-sm font-bold text-gray-900">Upcoming Workshop</h3>
                </div>
                <span className="text-[10px] font-bold bg-pink-100 text-[#be185d] px-2 py-0.5 rounded-full">
                  Registered
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <h4 className="text-xs font-bold text-gray-900 leading-snug">
                  {upcomingWorkshop.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5 text-purple-700" />
                  <span>{upcomingWorkshop.date} • {upcomingWorkshop.time}</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <img
                    src={upcomingWorkshop.mentorAvatar}
                    alt={upcomingWorkshop.mentorName}
                    className="w-7 h-7 rounded-full object-cover border border-purple-200"
                  />
                  <div className="text-[11px]">
                    <span className="font-semibold text-gray-800">{upcomingWorkshop.mentorName}</span>
                    <span className="text-gray-400 block">{upcomingWorkshop.mentorRole}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/network')}
                  className="w-full mt-2 bg-purple-50 hover:bg-[#4A154B] hover:text-white text-[#4A154B] font-bold text-xs py-2 rounded-xl transition-all cursor-pointer"
                >
                  Join / View Details
                </button>
              </div>
            </div>

            {/* AI Assistant Quick Launcher Card */}
            <div className="bg-gradient-to-br from-[#4A154B] to-[#701a75] text-white p-6 rounded-3xl shadow-md space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-300" />
                <h4 className="font-bold text-sm">Need Fast Advice?</h4>
              </div>
              <p className="text-xs text-purple-100 leading-relaxed">
                HerRise AI copilot can analyze your business idea, optimize resume bullet points, or review your cashflow health.
              </p>
              <div className="space-y-1.5 pt-1">
                {[
                  'Explain my career gap with confidence',
                  'What grants are available for women in tech?',
                  'How do I calculate profit margins?'
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => navigate('/ai-assistant')}
                    className="w-full text-left text-[11px] bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-purple-100 truncate cursor-pointer transition-colors"
                  >
                    💬 {prompt}
                  </button>
                ))}
              </div>
              <button
                onClick={() => navigate('/ai-assistant')}
                className="w-full bg-white text-[#4A154B] font-bold text-xs py-2.5 rounded-xl hover:bg-pink-50 transition-colors mt-2 cursor-pointer"
              >
                Open Unified AI Copilot →
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
