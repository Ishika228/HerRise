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
import { useHerFinance } from '../../context/HerFinanceContext';
import { calculateQualificationFit } from '../../utils/qualificationMatcher';
import { useMarket } from '../../context/MarketContext';
import { useHerCareer } from '../../context/HerCareerContext';

/* ------------------------------------------------------------------ */
/* Helper: read the richest resume from localStorage                   */
/* ------------------------------------------------------------------ */
function getResumeFromStorage(userKey?: string) {
  try {
    if (userKey && userKey !== 'guest') {
      const userRaw = localStorage.getItem(`hercareer_${userKey}_resume`);
      if (userRaw) return JSON.parse(userRaw);
    }
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

function getProfileFromStorage(userKey?: string) {
  try {
    if (userKey && userKey !== 'guest') {
      const userRaw = localStorage.getItem(`hercareer_${userKey}_profile`);
      if (userRaw) return JSON.parse(userRaw);
    }
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

const EMPTY_ARRAY: any[] = [];

/* ================================================================== */
export const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const userKey = user?.email ? user.email.toLowerCase() : (user?.id ? user.id.toLowerCase() : 'guest');
  const { totalIncome, totalExpenses, profile: financeProfile, goals: financeGoals } = useHerFinance();
  const { orders } = useMarket();
  const { activeResume, profile, jobs, candidateQualification } = useHerCareer();
  const navigate = useNavigate();

  /* ── User-specific Effective Finance Metrics ── */
  const effectiveIncome = totalIncome > 0 ? totalIncome : (financeProfile?.monthlyIncome || 0);
  const targetSavings = Math.round(effectiveIncome * 0.20);
  const actualSavings = Math.max(0, effectiveIncome - totalExpenses);
  const goalsSavings = (financeGoals || []).reduce((sum, g) => sum + (g.currentAmount || 0), 0);
  const effectiveSavings = goalsSavings > 0 ? goalsSavings : (actualSavings > 0 ? actualSavings : (financeProfile?.monthlySavingsTarget || targetSavings));

  /* ── User-specific Marketplace Metrics ── */
  const totalOrderRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);

  /* Auth guard */
  React.useEffect(() => {
    if (!user) navigate('/', { replace: true });
  }, [user, navigate]);

  /* ── Resume data (context > user-scoped localStorage > user) ── */
  const lsResume = React.useMemo(() => getResumeFromStorage(userKey), [userKey]);
  const lsProfile = React.useMemo(() => getProfileFromStorage(userKey), [userKey]);
  const resume = activeResume?.personalInfo?.fullName ? activeResume : lsResume;
  const careerProfile = profile?.targetRole ? profile : lsProfile;

  /* ── Extracted fields ── */
  const displayName =
    resume?.personalInfo?.fullName || user?.name || 'Empowered Member';
  const displayRole =
    careerProfile?.targetRole || user?.careerProfile?.targetRole || resume?.title || resume?.personalInfo?.headline || user?.role;
  const displayLocation =
    resume?.personalInfo?.location || user?.location;
  const techSkills: string[] =
    resume?.skills?.technical || user?.skills || EMPTY_ARRAY;
  const softSkills: string[] = resume?.skills?.soft || EMPTY_ARRAY;
  const tools: string[] = resume?.skills?.tools || EMPTY_ARRAY;
  const allSkills = React.useMemo(() => [...techSkills, ...softSkills, ...tools], [techSkills, softSkills, tools]);
  const summary: string = resume?.summary || '';
  const experience = resume?.experience || EMPTY_ARRAY;
  const projects = resume?.projects || EMPTY_ARRAY;
  const education = resume?.education || EMPTY_ARRAY;
  const certifications = resume?.certifications || EMPTY_ARRAY;
  const hasResume = Boolean(resume?.personalInfo?.fullName || user?.resumeData?.fullName);
  const profileStrength = calcProfileStrength(resume, user);
  const domain = getDomainLabel(resume);

  /* ── Goals ── */
  const userGoals = user?.goals || [];
  const wantsCareer = userGoals.some((g) => /job|career|return/i.test(g)) || hasResume;
  const wantsFinance = userGoals.some((g) => /finance|saving|budget/i.test(g));
  const wantsBusiness = userGoals.some((g) => /business|fund|grant|sell|market/i.test(g));
  const wantsLearn = userGoals.some((g) => /learn|skill|course/i.test(g)) || hasResume;
  const wantsNetwork = userGoals.some((g) => /mentor|network|leader/i.test(g));

  /* ── Qualification resolution ── */
  const detectedQualification = React.useMemo(() => {
    const resumeDegree = resume?.education?.[0]?.degree;
    const resumeField = resume?.education?.[0]?.fieldOfStudy;
    if (resumeDegree) {
      return resumeField && !resumeDegree.toLowerCase().includes(resumeField.toLowerCase())
        ? `${resumeDegree} (${resumeField})`
        : resumeDegree;
    }
    if (typeof user?.education === 'string' && user.education.trim()) {
      return user.education.trim();
    }
    if (Array.isArray(user?.education) && user.education[0]?.degree) {
      return user.education[0].degree;
    }
    if (user?.resumeData?.education?.[0]?.degree) {
      return user.resumeData.education[0].degree;
    }
    if (careerProfile?.education) {
      return careerProfile.education;
    }
    return '';
  }, [resume, user, careerProfile]);

  const activeQualification = candidateQualification || detectedQualification || '';

  /* ── Matched Jobs (live from HerCareer context, scored strictly by educational qualification & skills) ── */
  const matchedJobs = React.useMemo(() => {
    const liveJobs = Array.isArray(jobs) ? jobs : [];
    if (liveJobs.length === 0) return liveJobs;

    // If candidate has not specified any qualification or skills or resume, don't fake matches
    if (!activeQualification && !hasResume && techSkills.length === 0) {
      return [];
    }

    return liveJobs
      .map((job: any) => {
        const fit = calculateQualificationFit(activeQualification, job);
        const jobSkills: string[] = job.skills || [];
        const matching = jobSkills.filter((sk) =>
          techSkills.some(
            (us) =>
              sk.toLowerCase().includes(us.toLowerCase()) ||
              us.toLowerCase().includes(sk.toLowerCase())
          )
        );
        const matchPercentage = fit.score || (job.matchPercentage ?? 85);

        return {
          ...job,
          matchingSkills: matching,
          matchPercentage,
          fit
        };
      })
      .filter((j: any) => j.matchPercentage >= 50 || !activeQualification)
      .sort((a: any, b: any) => b.matchPercentage - a.matchPercentage);
  }, [jobs, techSkills, activeQualification, hasResume]);

  /* ── Cashflow trend chart (actual user transactions only) ── */
  const dynamicMonthlyTrend = (effectiveIncome > 0 || totalExpenses > 0) ? [
    { month: 'Current Period', income: effectiveIncome, expenses: totalExpenses }
  ] : [];

  /* ── Personalized AI prompts ── */
  const aiPrompts = buildAIPrompts(resume, careerProfile, user);

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
            value={
              matchedJobs.length > 0
                ? `${matchedJobs.length} Roles`
                : hasResume
                ? '0 Roles'
                : 'Upload Resume'
            }
            subtitle={displayRole || 'Upload resume to match'}
            change={
              matchedJobs[0]?.matchPercentage
                ? `${matchedJobs[0].matchPercentage}% Match`
                : hasResume
                ? 'Reviewing fit'
                : 'Explore 35+ Roles'
            }
            isPositive={matchedJobs.length > 0}
            icon={Briefcase}
            iconColor="text-[#be185d]"
            bgColor="bg-pink-100/70"
            badge={matchedJobs.length > 0 ? 'Live' : undefined}
            onClick={() => navigate('/career')}
          />

          <StatCard
            title="Total Monthly Inflow"
            value={effectiveIncome > 0 ? `₹${effectiveIncome.toLocaleString()}` : '₹0'}
            change={effectiveIncome > 0 ? 'Active Inflow' : 'Pending setup'}
            isPositive={effectiveIncome > 0}
            subtitle={effectiveIncome > 0 ? 'Verified Cashflow' : 'Log income in HerFinance'}
            icon={Wallet}
            iconColor="text-[#4A154B]"
            bgColor="bg-purple-100/70"
            onClick={() => navigate('/finance')}
          />

          <StatCard
            title="Liquid Savings Cushion"
            value={effectiveSavings > 0 ? `₹${effectiveSavings.toLocaleString()}` : '₹0'}
            change={
              effectiveIncome > 0 && actualSavings >= targetSavings && targetSavings > 0
                ? '20% Target Met'
                : effectiveSavings > 0
                ? 'Protected'
                : 'Set Target'
            }
            isPositive={effectiveSavings > 0}
            subtitle={
              effectiveSavings > 0
                ? (actualSavings > 0 ? '20% Cushion Active' : 'Emergency Reserve')
                : 'Set 6-mo safety cushion'
            }
            icon={TrendingUp}
            iconColor="text-emerald-700"
            bgColor="bg-emerald-100/70"
            onClick={() => navigate('/finance')}
          />

          <StatCard
            title="Marketplace Orders"
            value={orders.length > 0 ? `₹${totalOrderRevenue.toLocaleString()}` : '₹0'}
            change={orders.length > 0 ? `${orders.length} Order${orders.length > 1 ? 's' : ''}` : '0 Orders'}
            isPositive={orders.length > 0}
            subtitle={orders.length > 0 ? 'Sales Revenue' : 'Storefront Enabled'}
            icon={ShoppingBag}
            iconColor="text-[#ea580c]"
            bgColor="bg-amber-100/70"
            onClick={() => navigate('/market')}
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
        {/* CAREER MATCHES: RANKED STRICTLY BY EDUCATIONAL QUALIFICATION   */}
        {/* ============================================================= */}
        {matchedJobs.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-xs space-y-4 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-pink-50 gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#be185d] to-[#4A154B] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-extrabold text-gray-900">
                      Opportunities Matched to Your Educational Qualification
                    </h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {matchedJobs.filter((j: any) => j.matchPercentage >= 90).length} High Fit Roles
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1">
                    <span>Ranked for:</span>
                    <span className="font-bold text-[#4A154B] bg-purple-100/70 px-2.5 py-0.5 rounded-lg border border-purple-200">
                      🎓 {activeQualification}
                    </span>
                    {detectedQualification && activeQualification === detectedQualification && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-semibold">
                        Auto-detected from Profile / Resume
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <Link to="/career" className="text-xs font-bold text-[#be185d] hover:underline flex items-center gap-1">
                  View All ({matchedJobs.length}) <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {matchedJobs.slice(0, 3).map((job: any) => {
                const isDirectMatch = job.matchPercentage >= 95 || job.fit?.isMatch;
                return (
                  <div
                    key={job.jobId || job.id}
                    className="bg-purple-50/30 hover:bg-purple-50/70 p-4 rounded-2xl border border-purple-100 hover:border-[#4A154B] transition-all flex flex-col justify-between gap-3 group shadow-2xs hover:shadow-sm"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                                isDirectMatch
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-purple-100 text-purple-800 border-purple-200'
                              }`}
                            >
                              {job.matchPercentage}% {isDirectMatch ? 'Direct Qualification Match' : 'Transferable Fit'}
                            </span>
                            {job.workMode && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                                {job.workMode}
                              </span>
                            )}
                          </div>

                          <h4 className="font-bold text-sm text-gray-900 mt-2 group-hover:text-[#4A154B] transition-colors leading-snug">
                            {job.title}
                          </h4>
                          <p className="text-xs text-gray-500 font-medium">
                            {job.company} • {job.location}
                          </p>

                          {/* Required qualification requirement badge */}
                          <div className="flex items-start gap-1.5 text-[11px] font-semibold text-purple-900 bg-purple-100/70 px-2.5 py-1.5 rounded-xl border border-purple-200 mt-2">
                            <GraduationCap className="w-3.5 h-3.5 text-[#4A154B] shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <span className="text-[10px] uppercase font-bold text-purple-700 block tracking-wider">Required Degree:</span>
                              <span className="line-clamp-2 leading-tight text-gray-900">{job.qualification || 'Relevant Tertiary Qualification'}</span>
                            </div>
                          </div>
                        </div>

                        {job.logo ? (
                          job.logo.startsWith('http') ? (
                            <img
                              src={job.logo}
                              alt={job.company || 'Company'}
                              className="w-11 h-11 rounded-xl object-cover shrink-0 border border-purple-100 bg-white shadow-2xs"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="text-xl shrink-0">{job.logo}</span>
                          )
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-purple-100 text-[#4A154B] flex items-center justify-center shrink-0">
                            <Briefcase className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      {/* AI Fit explanation if available */}
                      {job.fit?.explanation && (
                        <p className="text-[11px] text-gray-600 bg-white/80 p-2 rounded-lg border border-purple-50 italic leading-relaxed">
                          💡 {job.fit.explanation}
                        </p>
                      )}

                      <p className="text-xs font-bold text-[#4A154B]">{job.salaryRange}</p>

                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {(job.skills || []).slice(0, 3).map((sk: string) => (
                          <span key={sk} className="text-[10px] font-medium bg-white px-2 py-0.5 rounded-md border border-purple-100 text-gray-700">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/career')}
                      className="w-full flex items-center justify-center gap-1.5 bg-[#4A154B] hover:bg-[#350c36] text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      Apply with ATS Resume <ArrowRight className="w-3.5 h-3.5 text-pink-300" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* MAIN GRID: REAL CASHFLOW + UNIFIED AI COPILOT                  */}
        {/* ============================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left col (7) - Real Cashflow Chart */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-purple-50 gap-2">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Live Cashflow Overview</h3>
                  <p className="text-xs text-gray-500">Your Recorded Financial Activity</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#4A154B]" />
                    <span className="text-gray-700">Income (₹{effectiveIncome.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#fb7185]" />
                    <span className="text-gray-700">Expenses (₹{totalExpenses.toLocaleString()})</span>
                  </div>
                  <Link to="/finance" className="text-xs text-[#4A154B] font-bold hover:underline">
                    Manage →
                  </Link>
                </div>
              </div>

              {(effectiveIncome > 0 || totalExpenses > 0) ? (
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
              ) : (
                <div className="h-56 mt-4 w-full flex flex-col items-center justify-center text-center p-6 bg-purple-50/20 rounded-2xl border border-dashed border-purple-200">
                  <Wallet className="w-8 h-8 text-purple-300 mb-2" />
                  <p className="text-xs font-bold text-gray-700">No Transactions Recorded Yet</p>
                  <p className="text-[11px] text-gray-500 max-w-sm mt-0.5">
                    Log your real earnings and expenses in HerFinance to display your cashflow chart.
                  </p>
                  <Link to="/finance" className="mt-3 text-xs font-bold text-[#4A154B] bg-white px-3.5 py-1.5 rounded-xl border border-purple-200 hover:bg-purple-50">
                    Add Transaction in HerFinance →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right col (5) - Verified Credentials & Qualifications */}
          <div className="lg:col-span-5 space-y-6">
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
