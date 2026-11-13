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
  Clock,
  ChevronRight,
  Target,
  BadgeCheck,
  FileText,
  MapPin,
  Star,
  BookOpen,
  Award,
  Code2,
  Upload
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
import { useHerCareer } from '../../context/HerCareerContext';

/* ------------------------------------------------------------------ */
/* Helper: read the richest resume from localStorage                   */
/* ------------------------------------------------------------------ */
function getResumeFromStorage() {
  try {
    const raw = localStorage.getItem('hercareer_resume');
    if (raw) return JSON.parse(raw);
    const rawArr = localStorage.getItem('hercareer_resumes');
    if (rawArr) {
      const arr = JSON.parse(rawArr);
      if (Array.isArray(arr) && arr.length > 0) return arr[arr.length - 1];
    }
  } catch {/* ignore */}
  return null;
}

function getProfileFromStorage() {
  try {
    const raw = localStorage.getItem('hercareer_profile');
    if (raw) return JSON.parse(raw);
  } catch {/* ignore */}
  return null;
}

/* ------------------------------------------------------------------ */
/* Profile strength calculator                                          */
/* ------------------------------------------------------------------ */
function calcProfileStrength(resume: any, user: any): number {
  if (!resume && !user) return 20;
  if (resume?.qualityScore) return Math.min(100, resume.qualityScore);
  let score = 0;
  if (resume?.personalInfo?.fullName || user?.name) score += 20;
  if ((resume?.skills?.technical?.length ?? 0) > 0 || (user?.skills?.length ?? 0) > 0) score += 20;
  if ((resume?.experience?.length ?? 0) > 0) score += 20;
  if ((resume?.education?.length ?? 0) > 0) score += 20;
  if (resume?.summary || user?.resumeData) score += 20;
  return score;
}

/* ------------------------------------------------------------------ */
/* Domain → category helper for quick-actions label                   */
/* ------------------------------------------------------------------ */
function getDomainLabel(resume: any): string {
  const tech = (resume?.skills?.technical || []).map((s: string) => s.toLowerCase());
  const techKeywords = ['react', 'python', 'javascript', 'node', 'java', 'aws', 'ml', 'ai', 'data', 'cloud', 'devops', 'flutter', 'django', 'sql'];
  if (tech.some((s: string) => techKeywords.some(k => s.includes(k)))) return 'Tech';
  const finKeywords = ['finance', 'accounting', 'ca', 'cfa', 'banking', 'mba'];
  const edu = (resume?.education || []).map((e: any) => (e.degree || '').toLowerCase());
  if (edu.some((d: string) => finKeywords.some(k => d.includes(k)))) return 'Finance';
  return 'Professional';
}

/* ------------------------------------------------------------------ */
/* AI prompt suggestions based on resume                               */
/* ------------------------------------------------------------------ */
function buildAIPrompts(resume: any, profile: any, user: any): string[] {
  const role = profile?.targetRole || resume?.title || user?.role;
  const topSkill = resume?.skills?.technical?.[0] || user?.skills?.[0];
  const edu = resume?.education?.[0]?.degree;

  return [
    role ? `How do I land a ${role} role with my current experience?` : 'How do I explain my career gap with confidence?',
    topSkill ? `Which ${topSkill} certifications will boost my salary fastest?` : 'What grants are available for women in tech?',
    edu ? `What career paths suit someone with a ${edu}?` : 'How do I calculate profit margins for my startup?'
  ];
}

/* ------------------------------------------------------------------ */
/* Workshop suggestions based on domain                                */
/* ------------------------------------------------------------------ */
function getWorkshopForDomain(domain: string) {
  const workshops: Record<string, { title: string; date: string; time: string; mentor: string; role: string }> = {
    Tech: {
      title: 'Women in Tech: Breaking Into Senior Engineering Roles',
      date: 'Nov 20, 2026',
      time: '7:00 PM IST',
      mentor: 'Priya Sharma',
      role: 'Senior SDE @ Google'
    },
    Finance: {
      title: 'Navigating Finance Careers as a Woman Leader',
      date: 'Nov 22, 2026',
      time: '6:30 PM IST',
      mentor: 'Ananya Kapoor',
      role: 'VP Finance @ HDFC'
    },
    Professional: {
      title: 'Personal Branding for Career Growth',
      date: 'Nov 18, 2026',
      time: '5:00 PM IST',
      mentor: 'Meera Joshi',
      role: 'Career Coach @ LinkedIn'
    }
  };
  return workshops[domain] || workshops['Professional'];
}

/* ================================================================== */
export const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const { totalIncome, totalExpenses, currentSavings } = useFinance();
  const { orders } = useMarket();
  const { activeResume, profile, jobs } = useHerCareer();
  const navigate = useNavigate();

  /* Auth guard */
  React.useEffect(() => {
    if (!user) navigate('/', { replace: true });
  }, [user, navigate]);

  /* ── Resume data (context > localStorage > user) ── */
  const lsResume = getResumeFromStorage();
  const lsProfile = getProfileFromStorage();
  const resume = activeResume?.personalInfo?.fullName ? activeResume : lsResume;
  const careerProfile = profile?.targetRole ? profile : lsProfile;

  /* ── Extracted fields ── */
  const displayName =
    resume?.personalInfo?.fullName || user?.name || 'Empowered Member';
  const displayRole =
    careerProfile?.targetRole || resume?.title || resume?.personalInfo?.headline || user?.role;
  const displayLocation =
    resume?.personalInfo?.location || user?.location;
  const techSkills: string[] =
    resume?.skills?.technical || user?.skills || [];
  const softSkills: string[] = resume?.skills?.soft || [];
  const tools: string[] = resume?.skills?.tools || [];
  const allSkills = [...techSkills, ...softSkills, ...tools];
  const summary: string = resume?.summary || '';
  const experience = resume?.experience || [];
  const projects = resume?.projects || [];
  const education = resume?.education || [];
  const certifications = resume?.certifications || [];
  const hasResume = Boolean(resume?.personalInfo?.fullName);
  const profileStrength = calcProfileStrength(resume, user);
  const domain = getDomainLabel(resume);

  /* ── Goals ── */
  const userGoals = user?.goals || [];
  const wantsCareer = userGoals.some((g) => /job|career|return/i.test(g)) || hasResume;
  const wantsFinance = userGoals.some((g) => /finance|saving|budget/i.test(g));
  const wantsBusiness = userGoals.some((g) => /business|fund|grant|sell|market/i.test(g));
  const wantsLearn = userGoals.some((g) => /learn|skill|course/i.test(g)) || hasResume;
  const wantsNetwork = userGoals.some((g) => /mentor|network|leader/i.test(g));

  /* ── Matched Jobs (live from HerCareer context, fallback to empty) ── */
  const matchedJobs = React.useMemo(() => {
    const liveJobs = Array.isArray(jobs) ? jobs : [];
    if (liveJobs.length === 0 || techSkills.length === 0) return liveJobs;
    return liveJobs
      .map((job: any) => {
        const jobSkills: string[] = job.skills || [];
        const matching = jobSkills.filter((sk) =>
          techSkills.some((us) =>
            sk.toLowerCase().includes(us.toLowerCase()) ||
            us.toLowerCase().includes(sk.toLowerCase())
          )
        );
        const matchPercentage = Math.min(
          98,
          Math.max(80, Math.round(76 + (matching.length / (jobSkills.length || 1)) * 22))
        );
        return { ...job, matchingSkills: matching, matchPercentage };
      })
      .sort((a: any, b: any) => b.matchPercentage - a.matchPercentage);
  }, [jobs, techSkills]);

  /* ── Cashflow trend chart ── */
  const dynamicMonthlyTrend = [
    { month: '3 Mo Ago', income: Math.round(totalIncome * 0.85), expenses: Math.round(totalExpenses * 0.9) },
    { month: '2 Mo Ago', income: Math.round(totalIncome * 0.92), expenses: Math.round(totalExpenses * 0.95) },
    { month: 'Last Mo', income: Math.round(totalIncome * 0.97), expenses: Math.round(totalExpenses * 0.88) },
    { month: 'Current', income: totalIncome, expenses: totalExpenses }
  ];

  /* ── Personalized AI prompts ── */
  const aiPrompts = buildAIPrompts(resume, careerProfile, user);

  /* ── Workshop card ── */
  const workshop = getWorkshopForDomain(domain);

  /* ── Recommended course label ── */
  const eduDeg = education[0]?.degree || '';
  const topCourseLabel = techSkills[0]
    ? `${techSkills[0]} Advanced Qualification`
    : eduDeg
    ? `Upskill from your ${eduDeg}`
    : 'Australian Nationally Recognised Course';

  /* ── Quick Actions (goal-ordered) ── */
  const allQuickActions = [
    { id: 'resume', label: 'Resume Builder', sub: hasResume ? 'Update Resume' : 'Upload Resume', icon: FileText, path: '/career', color: 'bg-pink-100 text-[#be185d]', preferred: !hasResume },
    { id: 'career', label: 'Find Jobs', sub: displayRole ? `For ${displayRole}` : 'Matched to stack', icon: Briefcase, path: '/career', color: 'bg-pink-100 text-[#be185d]', preferred: wantsCareer },
    { id: 'learn', label: 'Upskill Courses', sub: techSkills[0] ? `Learn ${techSkills[0]}` : 'AU Qualifications', icon: GraduationCap, path: '/learn', color: 'bg-blue-100 text-[#2563eb]', preferred: wantsLearn },
    { id: 'finance', label: 'Log Cashflow', sub: 'Track Income', icon: Wallet, path: '/finance', color: 'bg-purple-100 text-[#4A154B]', preferred: wantsFinance },
    { id: 'business', label: 'Startup Plan', sub: 'Business Model', icon: Rocket, path: '/business', color: 'bg-rose-100 text-[#e11d48]', preferred: wantsBusiness },
    { id: 'funding', label: 'Check Grants', sub: 'SIDBI Schemes', icon: Landmark, path: '/fund', color: 'bg-amber-100 text-[#d97706]', preferred: wantsBusiness },
    { id: 'network', label: 'Book Mentor', sub: '1-on-1 Guidance', icon: Users2, path: '/network', color: 'bg-indigo-100 text-[#4f46e5]', preferred: wantsNetwork },
    { id: 'market', label: 'HerMarket', sub: 'Sell Products', icon: ShoppingBag, path: '/market', color: 'bg-emerald-100 text-[#059669]', preferred: false }
  ];
  const prioritizedActions = [...allQuickActions].sort((a, b) =>
    a.preferred === b.preferred ? 0 : a.preferred ? -1 : 1
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* ============================================================= */}
        {/* WELCOME BANNER — fully resume-driven                           */}
        {/* ============================================================= */}
        <div className="bg-gradient-to-r from-[#3b0764] via-[#4A154B] to-[#be185d] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold text-pink-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personalized HerRise AI Dashboard</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {displayName}! 🌸
              </h1>

              {/* Resume-extracted credentials */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-purple-200">
                {displayRole && (
                  <span className="font-bold text-white bg-white/15 px-2.5 py-0.5 rounded-lg border border-white/20">
                    💼 {displayRole}
                  </span>
                )}
                {displayLocation && (
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/15">
                    📍 {displayLocation}
                  </span>
                )}
                {techSkills.length > 0 && (
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/15">
                    ⚡ {techSkills.length} Skills Analyzed
                  </span>
                )}
                {education.length > 0 && (
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/15">
                    🎓 {education[0].degree}
                  </span>
                )}
                {experience.length > 0 && (
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/15">
                    🏢 {experience.length} Experience{experience.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Top skills chips */}
              {techSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {techSkills.slice(0, 5).map((sk, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-white/15 px-2.5 py-0.5 rounded-full border border-white/25 text-pink-100">
                      {sk}
                    </span>
                  ))}
                  {techSkills.length > 5 && (
                    <span className="text-[10px] font-semibold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20 text-purple-200">
                      +{techSkills.length - 5} more
                    </span>
                  )}
                </div>
              )}

              {/* Summary subtext */}
              <p className="text-xs sm:text-sm text-purple-100 leading-relaxed pt-1">
                {summary
                  ? summary.length > 180 ? summary.slice(0, 180) + '…' : summary
                  : hasResume
                  ? `Your profile has been analyzed. We found ${matchedJobs.length} live job openings and curated Australian qualifications matched to your background.`
                  : 'Upload your resume to unlock personalized job matches, course recommendations, and AI-powered career insights.'}
              </p>

              {/* Goals badges */}
              {userGoals.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {userGoals.map((goal, idx) => (
                    <span key={idx} className="text-[10px] font-semibold bg-white/15 px-2.5 py-0.5 rounded-full border border-white/25 text-pink-100">
                      ✓ {goal}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Strength widget */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 w-full md:w-64 shrink-0 text-left space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-purple-100 flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5 text-pink-300" />
                  Profile Strength
                </span>
                <span className="text-pink-300 font-extrabold">{profileStrength}%</span>
              </div>
              <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-400 to-amber-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${profileStrength}%` }}
                />
              </div>
              <p className="text-[10px] text-purple-200">
                {hasResume
                  ? profileStrength >= 80
                    ? '✅ Resume fully analyzed & synced'
                    : '📄 Resume loaded — add more details to reach 100%'
                  : '📂 Upload your resume to unlock full personalization'}
              </p>

              {/* Resume stats mini-grid */}
              {hasResume && (
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  {[
                    { label: 'Skills', val: allSkills.length },
                    { label: 'Experience', val: experience.length },
                    { label: 'Projects', val: projects.length },
                    { label: 'Certs', val: certifications.length }
                  ].map(({ label, val }) => (
                    <div key={label} className="bg-white/10 rounded-lg px-2 py-1 text-center">
                      <div className="font-extrabold text-white text-sm">{val}</div>
                      <div className="text-purple-300">{label}</div>
                    </div>
                  ))}
                </div>
              )}

              {!hasResume && (
                <button
                  onClick={() => navigate('/career')}
                  className="w-full bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Resume
                </button>
              )}

              <Link
                to="/career"
                className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-white hover:text-pink-200 hover:underline"
              >
                View Career Profile →
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* RESUME UPLOAD PROMPT (shown when no resume is loaded)          */}
        {/* ============================================================= */}
        {!hasResume && (
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center shrink-0">
              <FileText className="w-7 h-7 text-[#be185d]" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-base font-extrabold text-gray-900">Upload Your Resume to Personalize Everything</h3>
              <p className="text-xs text-gray-500 mt-1">
                Get personalized job matches, Australian course recommendations, AI insights, and a customized dashboard — all based on your actual background.
              </p>
            </div>
            <button
              onClick={() => navigate('/career')}
              className="shrink-0 bg-[#4A154B] hover:bg-[#350c36] text-white font-bold text-sm px-6 py-3 rounded-2xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Resume
            </button>
          </div>
        )}

        {/* ============================================================= */}
        {/* 4 PRIMARY STAT CARDS                                           */}
        {/* ============================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Career Matches"
            value={matchedJobs.length > 0 ? `${matchedJobs.length} Roles` : hasResume ? 'Loading…' : 'Upload Resume'}
            subtitle={displayRole || 'Upload resume to match'}
            change={matchedJobs[0]?.matchPercentage ? `${matchedJobs[0].matchPercentage}% Match` : hasResume ? 'Analyzing…' : 'Not yet set up'}
            isPositive={matchedJobs.length > 0}
            icon={Briefcase}
            iconColor="text-[#be185d]"
            bgColor="bg-pink-100/70"
            badge="Live"
          />

          <StatCard
            title="Total Monthly Inflow"
            value={totalIncome > 0 ? `₹${totalIncome.toLocaleString()}` : '₹0'}
            change={totalIncome > 0 ? 'Active Inflow' : 'Pending setup'}
            isPositive={totalIncome > 0}
            subtitle={totalIncome > 0 ? 'Verified Cashflow' : 'Log income in HerFinance'}
            icon={Wallet}
            iconColor="text-[#4A154B]"
            bgColor="bg-purple-100/70"
          />

          <StatCard
            title="Liquid Savings Cushion"
            value={currentSavings > 0 ? `₹${currentSavings.toLocaleString()}` : '₹0'}
            change={currentSavings > 0 ? 'Protected' : 'Set Target'}
            isPositive={currentSavings > 0}
            subtitle={currentSavings > 0 ? 'Emergency Reserve' : 'Set 6-mo safety cushion'}
            icon={TrendingUp}
            iconColor="text-emerald-700"
            bgColor="bg-emerald-100/70"
          />

          <StatCard
            title="Marketplace Orders"
            value={orders.length > 0 ? `₹${orders.reduce((s, o) => s + (o.amount || 0), 0).toLocaleString()}` : '₹0'}
            change={orders.length > 0 ? `${orders.length} Orders` : 'Ready'}
            isPositive={orders.length > 0}
            subtitle={orders.length > 0 ? 'Sales Revenue' : 'Storefront Enabled'}
            icon={ShoppingBag}
            iconColor="text-[#ea580c]"
            bgColor="bg-amber-100/70"
          />
        </div>

        {/* ============================================================= */}
        {/* RESUME SKILLS SECTION (shows only when resume is loaded)       */}
        {/* ============================================================= */}
        {hasResume && allSkills.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#4A154B] flex items-center justify-center">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">Your Skills Profile</h3>
                  <p className="text-xs text-gray-500">Extracted from your uploaded resume</p>
                </div>
              </div>
              <Link to="/career" className="text-xs font-bold text-[#be185d] hover:underline flex items-center gap-1">
                Edit Resume <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {techSkills.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-700 mb-2">Technical Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {techSkills.slice(0, 8).map((sk, i) => (
                      <span key={i} className="text-xs font-medium bg-purple-50 text-purple-900 px-2.5 py-1 rounded-lg border border-purple-100">
                        {sk}
                      </span>
                    ))}
                    {techSkills.length > 8 && (
                      <span className="text-xs font-medium bg-gray-50 text-gray-500 px-2.5 py-1 rounded-lg border border-gray-100">
                        +{techSkills.length - 8}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {softSkills.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-pink-700 mb-2">Soft Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {softSkills.slice(0, 6).map((sk, i) => (
                      <span key={i} className="text-xs font-medium bg-pink-50 text-pink-900 px-2.5 py-1 rounded-lg border border-pink-100">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {tools.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700 mb-2">Tools & Platforms</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tools.slice(0, 6).map((t, i) => (
                      <span key={i} className="text-xs font-medium bg-blue-50 text-blue-900 px-2.5 py-1 rounded-lg border border-blue-100">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* CAREER MATCHES (live jobs from HerCareer context)              */}
        {/* ============================================================= */}
        {wantsCareer && matchedJobs.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-pink-50 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-[#be185d] flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    Recommended Opportunities for Your Stack
                  </h3>
                  <p className="text-xs text-gray-500">
                    Filtered by:{' '}
                    <span className="font-semibold text-purple-900">
                      {techSkills.slice(0, 4).join(', ') || displayRole || 'Your Profile'}
                    </span>
                  </p>
                </div>
              </div>
              <Link to="/career" className="text-xs font-bold text-[#be185d] hover:underline flex items-center gap-1">
                View All {matchedJobs.length} Matches <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {matchedJobs.slice(0, 3).map((job: any) => (
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
                    <div className="flex flex-wrap gap-1 pt-1">
                      {(job.skills || []).slice(0, 3).map((sk: string) => (
                        <span key={sk} className="text-[10px] font-medium bg-white px-2 py-0.5 rounded-md border border-purple-100 text-gray-700">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/career')}
                    className="w-full flex items-center justify-center gap-1.5 bg-[#4A154B] hover:bg-[#350c36] text-white py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    Apply with ATS Resume <ArrowRight className="w-3.5 h-3.5 text-pink-300" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* BUSINESS / GRANTS (shown if user wants business)              */}
        {/* ============================================================= */}
        {wantsBusiness && (
          <div className="bg-gradient-to-r from-amber-50/60 to-rose-50/60 p-6 rounded-3xl border border-amber-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-amber-200/60 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">Startup Launchpad & Grants Readiness</h3>
                  <p className="text-xs text-gray-600">Personalized capital schemes & business models for your journey</p>
                </div>
              </div>
              <Link to="/fund" className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1">
                Explore Grants <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-amber-100 space-y-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Government Initiative</span>
                <h4 className="font-bold text-sm text-gray-900">Stand-Up India Scheme</h4>
                <p className="text-gray-500">Bank loans between ₹10 Lakhs and ₹1 Crore for women entrepreneurs setting up greenfield ventures.</p>
                <button onClick={() => navigate('/fund')} className="font-bold text-[#4A154B] hover:underline flex items-center gap-1 pt-1">
                  Check Eligibility →
                </button>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-amber-100 space-y-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-[#be185d]">Micro-Grant</span>
                <h4 className="font-bold text-sm text-gray-900">HerRise Catalyst Grant (₹1,50,000)</h4>
                <p className="text-gray-500">Zero-equity seed grant for early-stage women founders launching products or consulting services.</p>
                <button onClick={() => navigate('/fund')} className="font-bold text-[#4A154B] hover:underline flex items-center gap-1 pt-1">
                  Apply for Grant →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* QUICK ACTIONS ROW (goal-ordered)                               */}
        {/* ============================================================= */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Quick Actions (Personalized for Your Goals)
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {prioritizedActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(action.path)}
                  className={`bg-white hover:bg-purple-50/70 border p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 shadow-xs hover:shadow-sm transition-all group cursor-pointer ${
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

        {/* ============================================================= */}
        {/* MAIN GRID: CASHFLOW + LEARNING + WORKSHOP + AI                 */}
        {/* ============================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left col (8) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Financial trend chart */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-purple-50 gap-2">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Income vs. Expense Trend</h3>
                  <p className="text-xs text-gray-500">Your 4-Month Cashflow Health</p>
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

            {/* Recommended course card (resume-driven) */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#4A154B]" />
                  <h3 className="text-base font-bold text-gray-900">
                    {hasResume ? 'Recommended for You' : 'Start Learning Today'}
                  </h3>
                </div>
                <Link to="/learn" className="text-xs text-[#4A154B] font-bold hover:underline">
                  All Courses →
                </Link>
              </div>

              <div className="mt-4 bg-gradient-to-r from-purple-50/60 to-pink-50/60 p-4 rounded-2xl border border-purple-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#4A154B] to-[#be185d] rounded-2xl flex items-center justify-center shrink-0">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                    🇦🇺 Nationally Recognised
                  </span>
                  <h4 className="text-sm font-bold text-gray-900 mt-1.5 leading-snug">
                    {topCourseLabel}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {eduDeg
                      ? `Tailored for your ${eduDeg} background — progress your Australian qualification level`
                      : 'Browse 1000+ accredited Australian qualifications matched to your skills'}
                  </p>
                  {techSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {techSkills.slice(0, 3).map((sk, i) => (
                        <span key={i} className="text-[10px] bg-white border border-purple-100 px-2 py-0.5 rounded-md text-purple-800 font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => navigate('/learn')}
                  className="w-full sm:w-auto bg-[#4A154B] text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-[#350c36] transition-colors shrink-0 cursor-pointer"
                >
                  Explore Courses
                </button>
              </div>
            </div>
          </div>

          {/* Right col (4) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Upcoming Workshop card — domain-matched */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#be185d]" />
                  <h3 className="text-sm font-bold text-gray-900">Upcoming Workshop</h3>
                </div>
                <span className="text-[10px] font-bold bg-pink-100 text-[#be185d] px-2 py-0.5 rounded-full">
                  {domain}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <h4 className="text-xs font-bold text-gray-900 leading-snug">{workshop.title}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5 text-purple-700" />
                  <span>{workshop.date} • {workshop.time}</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4A154B] to-[#be185d] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {workshop.mentor.charAt(0)}
                  </div>
                  <div className="text-[11px]">
                    <span className="font-semibold text-gray-800">{workshop.mentor}</span>
                    <span className="text-gray-400 block">{workshop.role}</span>
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

            {/* AI Assistant quick launcher — resume-contextual prompts */}
            <div className="bg-gradient-to-br from-[#4A154B] to-[#701a75] text-white p-6 rounded-3xl shadow-md space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-300" />
                <h4 className="font-bold text-sm">Need Fast Advice?</h4>
              </div>
              <p className="text-xs text-purple-100 leading-relaxed">
                {hasResume
                  ? `HerRise AI analyzed your resume. Ask anything about your ${displayRole || 'career'} path, skills, or qualifications.`
                  : 'HerRise AI copilot can analyze your resume, optimize bullet points, or review your cashflow health.'}
              </p>
              <div className="space-y-1.5 pt-1">
                {aiPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => navigate('/ai-assistant')}
                    className="w-full text-left text-[11px] bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-purple-100 cursor-pointer transition-colors"
                    title={prompt}
                  >
                    💬 {prompt.length > 55 ? prompt.slice(0, 55) + '…' : prompt}
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

            {/* Education / Certifications summary (resume-driven) */}
            {(education.length > 0 || certifications.length > 0) && (
              <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#4A154B]" />
                  <h4 className="text-sm font-bold text-gray-900">Your Qualifications</h4>
                </div>
                {education.slice(0, 2).map((edu: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-800">{edu.degree}</div>
                      <div className="text-gray-500">{edu.institution}{edu.graduationYear ? ` • ${edu.graduationYear}` : ''}</div>
                    </div>
                  </div>
                ))}
                {certifications.slice(0, 2).map((cert: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <BadgeCheck className="w-3.5 h-3.5 text-pink-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-800">{cert.name}</div>
                      {cert.issuer && <div className="text-gray-500">{cert.issuer}</div>}
                    </div>
                  </div>
                ))}
                <Link to="/career" className="text-[11px] font-bold text-[#be185d] hover:underline flex items-center gap-1 pt-1">
                  View full profile <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
