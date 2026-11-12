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
  ChevronRight
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

  const enrolledCourse = initialCourses.find((c) => c.isEnrolled) || initialCourses[0];
  const upcomingWorkshop = initialWorkshops[0];

  // Dynamic trend derived mathematically from user cashflow
  const dynamicMonthlyTrend = [
    { month: '3 Mo Ago', income: Math.round(totalIncome * 0.85), expenses: Math.round(totalExpenses * 0.9) },
    { month: '2 Mo Ago', income: Math.round(totalIncome * 0.92), expenses: Math.round(totalExpenses * 0.95) },
    { month: 'Last Mo', income: Math.round(totalIncome * 0.97), expenses: Math.round(totalExpenses * 0.88) },
    { month: 'Current', income: totalIncome, expenses: totalExpenses }
  ];

  const quickActions = [
    { label: 'Add Expense', icon: Wallet, path: '/finance', color: 'bg-purple-100 text-[#4A154B]' },
    { label: 'Find Returnships', icon: Briefcase, path: '/career', color: 'bg-pink-100 text-[#be185d]' },
    { label: 'Startup Plan', icon: Rocket, path: '/business', color: 'bg-rose-100 text-[#e11d48]' },
    { label: 'Check Funding', icon: Landmark, path: '/fund', color: 'bg-amber-100 text-[#d97706]' },
    { label: 'Sell on Market', icon: ShoppingBag, path: '/market', color: 'bg-emerald-100 text-[#059669]' },
    { label: 'Continue Course', icon: GraduationCap, path: '/learn', color: 'bg-blue-100 text-[#2563eb]' },
    { label: 'Book a Mentor', icon: Users2, path: '/network', color: 'bg-indigo-100 text-[#4f46e5]' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#3b0764] via-[#4A154B] to-[#be185d] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold text-pink-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Her Future. Her Finance. Her Freedom.</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name || 'Empowered Member'}! 🌸
              </h1>
              <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
                {totalIncome > 0
                  ? `Your monthly verified inflow is ₹${totalIncome.toLocaleString()} with ₹${currentSavings.toLocaleString()} in accumulated liquid savings.`
                  : 'Welcome to your unified HerRise AI ecosystem. Select any module to initialize your personalized live workspace.'}
              </p>

              {/* Goals chips */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {user?.goals && user.goals.slice(0, 3).map((goal, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20 text-purple-100"
                  >
                    ✓ {goal}
                  </span>
                ))}
              </div>
            </div>

            {/* Profile Completion Bar Card */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 w-full md:w-64 shrink-0 text-left">
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-purple-100">Profile Strength</span>
                <span className="text-pink-300 font-extrabold">{user?.completionPercentage || 85}%</span>
              </div>
              <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-400 to-amber-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${user?.completionPercentage || 85}%` }}
                />
              </div>
              <p className="text-[10px] text-purple-200 mt-2">
                Add 1 sample certification to unlock Priority Mentor Match.
              </p>
              <Link
                to="/profile"
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-white hover:text-pink-200 hover:underline"
              >
                Complete Profile →
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Primary Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Monthly Inflow"
            value={`₹${totalIncome.toLocaleString()}`}
            change={totalIncome > 0 ? "Verified" : "Pending setup"}
            isPositive={totalIncome > 0}
            subtitle={totalIncome > 0 ? "Live monthly cashflow" : "Add income in HerFinance"}
            icon={Wallet}
            iconColor="text-[#4A154B]"
            bgColor="bg-purple-100/70"
          />
          <StatCard
            title="Liquid Savings Cushion"
            value={`₹${currentSavings.toLocaleString()}`}
            change={currentSavings > 0 ? "Funded" : "0%"}
            isPositive={currentSavings > 0}
            subtitle={currentSavings > 0 ? "Active Liquid Reserves" : "Initialize savings goal"}
            icon={TrendingUp}
            iconColor="text-emerald-700"
            bgColor="bg-emerald-100/70"
          />
          <StatCard
            title="Career Matches"
            value={user?.careerProfile?.matchRolesCount ? `${user.careerProfile.matchRolesCount} Roles` : '0 Roles'}
            subtitle={user?.careerProfile?.targetRole || 'Set up HerCareer profile'}
            icon={Briefcase}
            iconColor="text-[#be185d]"
            bgColor="bg-pink-100/70"
            badge="Live"
          />
          <StatCard
            title="Marketplace Sales"
            value={`₹${orders.reduce((sum, o) => sum + (o.amount || 0), 0).toLocaleString()}`}
            change={orders.length > 0 ? `${orders.length} Orders` : "0 Orders"}
            isPositive={orders.length > 0}
            subtitle={orders.length > 0 ? "Processed Orders" : "Storefront Active"}
            icon={ShoppingBag}
            iconColor="text-[#ea580c]"
            bgColor="bg-amber-100/70"
          />
        </div>

        {/* Quick Actions Row */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(action.path)}
                  className="bg-white hover:bg-purple-50/70 border border-purple-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-2 shadow-2xs hover:shadow-xs transition-all group cursor-pointer"
                >
                  <div className={`p-2 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-800">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Left Charts & Right Schedule/Feeds */}
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
                HerRise AI copilot can analyze your business idea, rewrite resume bullet points, or optimize your 50/30/20 budget in seconds.
              </p>
              <div className="space-y-1.5 pt-1">
                {[
                  'How do I calculate profit margins?',
                  'Explain my career gap with confidence',
                  'What grants are available for women?'
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

            {/* Recent Orders / Marketplace Activity */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Recent Activity
                </h3>
                <Link to="/market" className="text-[11px] text-[#4A154B] font-semibold hover:underline">
                  HerMarket →
                </Link>
              </div>
              <div className="mt-3 divide-y divide-purple-50">
                {orders.length === 0 ? (
                  <div className="py-6 text-center text-xs text-gray-400">
                    No marketplace orders logged yet. Visit HerMarket to browse or sell.
                  </div>
                ) : (
                  orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-gray-800 truncate max-w-[170px]">
                          {order.productTitle}
                        </p>
                        <span className="text-[10px] text-gray-400">{order.customerName} • {order.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-700 block">+₹{order.amount}</span>
                        <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

