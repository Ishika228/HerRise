import React, { useState, useEffect } from 'react';
import {
  Search,
  Award,
  BookOpen,
  Clock,
  ExternalLink,
  RefreshCw,
  Briefcase,
  Building2,
  CheckCircle2,
  Sparkles,
  Info,
  X,
  Layers,
  ChevronRight,
  UserCheck,
  Target,
  Sliders,
  Compass
} from 'lucide-react';
import { API_BASE } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export interface AustralianCourse {
  _id?: string;
  code: string;
  title: string;
  qualificationLevel: string;
  aqfLevel: string;
  category: string;
  trainingPackage: {
    code: string;
    title: string;
  };
  description: string;
  status: 'current' | 'superseded' | 'deleted';
  unitsCount: number;
  unitsOfCompetency?: { code: string; title: string; isCore?: boolean }[];
  skillSets: string[];
  industrySectors: string[];
  occupations: string[];
  rtoDeliveryCount: number;
  rtoProviders?: { code: string; name: string; website?: string; state?: string }[];
  sourceUrl: string;
  sourceAttribution: string;
  developer: string;
  releaseDate?: string;
  lastSyncedAt?: string;
  durationEstimate?: string;
  matchScore?: number;
  matchReason?: string;
  progressionBadge?: string;
}

export const AustralianCoursesSection: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Mode: 'recommended' (personalized) vs 'all' (browse all 1,078 courses)
  const [viewMode, setViewMode] = useState<'recommended' | 'all'>('recommended');

  // Helper to extract education from stored resume, career profile or authenticated user
  const getUserRawEducation = (): string => {
    try {
      const rawResume = localStorage.getItem('hercareer_resume');
      if (rawResume) {
        const parsed = JSON.parse(rawResume);
        if (parsed.education && Array.isArray(parsed.education) && parsed.education.length > 0) {
          const deg = parsed.education[0].degree || '';
          if (deg) return deg;
        }
      }
    } catch {}

    try {
      const rawProfile = localStorage.getItem('hercareer_profile');
      if (rawProfile) {
        const parsed = JSON.parse(rawProfile);
        if (parsed.education) return parsed.education;
      }
    } catch {}

    if (user?.education) return user.education;
    if (user?.resumeData?.education?.[0]?.degree) return user.resumeData.education[0].degree;
    return '';
  };

  const detectedRawEdu = getUserRawEducation();

  const getTierFromEducation = (eduStr: string): string => {
    const q = eduStr.toLowerCase();
    if (q.includes('master') || q.includes('mca') || q.includes('mba') || q.includes('m.tech') || q.includes('mtech') || q.includes('m.sc') || q.includes('msc') || q.includes('post graduate')) {
      return "Master's Degree (MCA / MBA / M.Tech)";
    }
    if (q.includes('bachelor') || q.includes('bca') || q.includes('b.tech') || q.includes('btech') || q.includes('b.sc') || q.includes('bsc') || q.includes('degree') || q.includes('undergraduate')) {
      return "Bachelor's Degree (BCA / B.Tech / B.Sc)";
    }
    if (q.includes('diploma') || q.includes('polytechnic') || q.includes('associate')) {
      return 'Diploma / Associate Degree';
    }
    if (q.includes('certificate') || q.includes('cert')) {
      return 'Certificate III / IV';
    }
    if (q.includes('school') || q.includes('12') || q.includes('10') || q.includes('secondary')) {
      return 'Year 12 / High School';
    }
    return "Bachelor's Degree (BCA / B.Tech / B.Sc)";
  };

  const [selectedQualification, setSelectedQualification] = useState<string>(() => {
    return getTierFromEducation(detectedRawEdu);
  });

  const defaultDomain = user?.role?.toLowerCase().includes('health')
    ? 'Community & Health'
    : user?.role?.toLowerCase().includes('manage') || user?.role?.toLowerCase().includes('business')
      ? 'Business & Management'
      : 'Information Technology';

  const [selectedDomain, setSelectedDomain] = useState<string>(defaultDomain);
  const [selectedCareerGoal, setSelectedCareerGoal] = useState<string>('Skill Advancement');
  const [progressionRationale, setProgressionRationale] = useState<string>('');

  // Browsing & Filters
  const [courses, setCourses] = useState<AustralianCourse[]>([]);
  const [totalCatalogCount, setTotalCatalogCount] = useState<number>(1078);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<AustralianCourse | null>(null);

  const categories = [
    'All',
    'Information Technology',
    'Community & Health',
    'Business & Management',
    'Finance & Accounting',
    'Creative Arts & Design',
    'Engineering & Trades'
  ];

  const qualificationLevels = [
    'All',
    'Certificate III',
    'Certificate IV',
    'Diploma',
    'Advanced Diploma'
  ];

  const qualificationOptions = [
    "Master's Degree (MCA / MBA / M.Tech)",
    "Bachelor's Degree (BCA / B.Tech / B.Sc)",
    'Diploma / Associate Degree',
    'Certificate III / IV',
    'Year 12 / High School'
  ];

  const domainOptions = [
    'Information Technology',
    'Business & Management',
    'Community & Health',
    'Finance & Accounting',
    'Creative Arts & Design'
  ];

  const careerGoalOptions = [
    'Skill Advancement',
    'Step up to Leadership',
    'Career Transition',
    'Australia PR & Skilled Pathway'
  ];

  // Fetch Recommended Personalized Courses
  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('qualification', selectedQualification);
      params.append('domain', selectedDomain);
      params.append('targetRole', user?.role || 'Professional');
      if (user?.skills && user.skills.length > 0) {
        params.append('skills', user.skills.join(','));
      }
      params.append('limit', '18');

      const res = await fetch(`${API_BASE}/api/courses/recommendations?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setCourses(json.data || []);
        if (json.userProfileAnalyzed?.progressionRationale) {
          setProgressionRationale(json.userProfileAnalyzed.progressionRationale);
        }
      } else {
        throw new Error('Failed to fetch recommendations');
      }
    } catch (err: any) {
      console.warn('API error fetching recommendations:', err.message);
      // Fallback to standard courses
      fetchCatalogCourses();
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Full Catalog
  const fetchCatalogCourses = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedLevel !== 'All') params.append('level', selectedLevel);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      params.append('limit', '24');

      const res = await fetch(`${API_BASE}/api/courses?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setCourses(json.data || []);
        if (json.total) setTotalCatalogCount(json.total);
      } else {
        throw new Error('Failed to fetch Australian courses');
      }
    } catch (err: any) {
      console.warn('API Error fetching courses:', err.message);
      showToast('Notice', 'Could not load courses from server. Using local cache.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'recommended') {
      fetchRecommendations();
    } else {
      fetchCatalogCourses();
    }
  }, [viewMode, selectedQualification, selectedDomain, selectedCareerGoal, selectedCategory, selectedLevel]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setViewMode('all');
    fetchCatalogCourses();
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch(`${API_BASE}/api/courses/sync`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          'Synchronization Successful 🇦🇺',
          `Synced qualifications into MongoDB Atlas. Total available: ${totalCatalogCount}`,
          'success'
        );
        if (viewMode === 'recommended') fetchRecommendations();
        else fetchCatalogCourses();
      } else {
        throw new Error(data.error || 'Sync failed');
      }
    } catch (err: any) {
      showToast('Sync Notice', err.message || 'Synchronization failed', 'warning');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Personalized Learning Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-teal-800/40">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold backdrop-blur-md border border-teal-400/20">
            <span className="text-sm">🇦🇺</span>
            <span>Personalized Australian Qualifications Matcher (AQF)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Tailored Courses for {user?.name || 'Your Career Pathway'}
          </h2>

          <p className="text-xs sm:text-sm text-teal-100 leading-relaxed font-normal">
            Courses recommended based on your current qualification (
            <span className="font-bold text-teal-300 underline">{selectedQualification}</span>
            ) and career aspirations in <span className="font-bold text-teal-300">{selectedDomain}</span>. Explore over <strong className="text-white">{totalCatalogCount.toLocaleString()}</strong> official qualifications synced from the Australian Government National Training Register.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {/* View Mode Toggle: Recommended vs All 1078 */}
            <div className="bg-black/30 backdrop-blur-md p-1 rounded-2xl border border-teal-400/30 flex items-center gap-1 text-xs font-bold">
              <button
                onClick={() => setViewMode('recommended')}
                className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'recommended'
                    ? 'bg-teal-500 text-slate-950 shadow-md'
                    : 'text-teal-200 hover:text-white'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Recommended For You ({courses.length})</span>
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'all'
                    ? 'bg-teal-500 text-slate-950 shadow-md'
                    : 'text-teal-200 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>All {totalCatalogCount.toLocaleString()} Courses</span>
              </button>
            </div>

            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="px-3.5 py-1.5 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-200 text-xs font-semibold flex items-center gap-1.5 border border-teal-700/60 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync training.gov.au</span>
            </button>
          </div>
        </div>

        {/* Decorative badge background element */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Award className="w-64 h-64 text-teal-200" />
        </div>
      </div>

      {/* Interactive Personalization Customizer Card */}
      <div className="bg-white p-5 rounded-3xl border border-teal-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-800">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                Personalization Profile & Recommendation Controls
              </h3>
              <p className="text-[11px] text-slate-500">
                Adjust your qualification or focus to immediately re-calculate matched Australian courses
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-xl">
            {viewMode === 'recommended' ? 'Active: Personalized Matcher' : 'Active: Full Catalog'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current Qualification */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-teal-600" /> Your Current Qualification
            </label>
            <select
              value={selectedQualification}
              onChange={(e) => setSelectedQualification(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-teal-700 cursor-pointer"
            >
              {qualificationOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Target Industry Domain */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3 h-3 text-teal-600" /> Target Industry / Domain
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-teal-700 cursor-pointer"
            >
              {domainOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Career Objective */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3 h-3 text-teal-600" /> Learning Objective
            </label>
            <select
              value={selectedCareerGoal}
              onChange={(e) => setSelectedCareerGoal(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-teal-700 cursor-pointer"
            >
              {careerGoalOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search & Secondary Filter Bar (Available in both modes, especially for Full Catalog) */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by qualification code (e.g. ICT50220), title, occupation, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-teal-700 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-2xl transition-all shadow-xs cursor-pointer shrink-0"
          >
            Search Catalog
          </button>
        </form>

        {viewMode === 'all' && (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-slate-100">
            {/* Categories */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Industry Sector</span>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-teal-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Qualification Levels */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">AQF Level</span>
              <div className="flex flex-wrap gap-1.5">
                {qualificationLevels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedLevel === lvl
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Education Pathway Rationale Banner (Personalized Mode) */}
      {viewMode === 'recommended' && (
        <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-slate-50 p-4 sm:p-5 rounded-3xl border border-teal-300/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-teal-800 text-white shadow-xs shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-teal-900 uppercase tracking-wider">
                  🎓 Recommended for Your Education Level
                </span>
                {detectedRawEdu && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 border border-teal-200">
                    Your Degree: {detectedRawEdu}
                  </span>
                )}
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                  Target Tier: {selectedQualification}
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">
                {progressionRationale ||
                  `Courses curated for your ${selectedQualification} to achieve recognized Australian qualifications.`}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-black text-teal-950 block">
              {courses.length} Matched Qualifications
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Official training.gov.au</span>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      {isLoading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-800">
            {viewMode === 'recommended'
              ? `Personalizing Australian Qualifications for your ${selectedQualification} background...`
              : 'Retrieving Qualifications Catalog from MongoDB Atlas...'}
          </p>
          <p className="text-xs text-slate-500">Matching AQF framework competency standards</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <Info className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No matching qualifications found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search keywords or switching back to "Recommended For You".
          </p>
          <button
            onClick={() => {
              setViewMode('recommended');
              setSelectedCategory('All');
              setSelectedLevel('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-teal-800 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Show Personalized Recommendations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div
              key={course.code}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-teal-400"
            >
              {/* Card Header & Badges */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-black text-xs tracking-wider border border-teal-200">
                    {course.code}
                  </span>

                  {course.matchScore ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px] flex items-center gap-1 shadow-2xs">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>{course.matchScore}% Match</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                      {course.aqfLevel || course.qualificationLevel}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider block">
                    {course.category}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-teal-900 transition-colors line-clamp-2 mt-0.5">
                    {course.title}
                  </h3>
                </div>

                {/* Personalization Reason Callout Box (if in recommended view) */}
                {course.matchReason && (
                  <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-100/80 text-[11px] text-teal-900 leading-relaxed font-medium">
                    <span className="font-bold text-teal-950">Why for you: </span>
                    {course.matchReason}
                  </div>
                )}

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                {/* Occupations */}
                {course.occupations && course.occupations.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> Career Pathways
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {course.occupations.slice(0, 3).map((occ, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[10px] text-slate-700">
                          {occ}
                        </span>
                      ))}
                      {course.occupations.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-50 text-[10px] text-slate-500">
                          +{course.occupations.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{course.durationEstimate || '12-18 Mos'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={course.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-slate-500 hover:text-teal-800 hover:bg-slate-200 transition-all cursor-pointer"
                    title="View official record on training.gov.au"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="px-3 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-teal-500 text-slate-950 font-black text-xs tracking-wider">
                    {selectedCourse.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-300 font-bold text-xs border border-teal-500/30">
                    {selectedCourse.aqfLevel || selectedCourse.qualificationLevel}
                  </span>
                  {selectedCourse.matchScore && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs">
                      {selectedCourse.matchScore}% Profile Fit
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black">{selectedCourse.title}</h2>
                <p className="text-xs text-slate-300">
                  Training Package: {selectedCourse.trainingPackage?.code} — {selectedCourse.trainingPackage?.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Personalization Note */}
              {selectedCourse.matchReason && (
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-1">
                  <h4 className="font-extrabold uppercase tracking-wider text-[11px] text-teal-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                    Personalized Recommendation Fit
                  </h4>
                  <p>{selectedCourse.matchReason}</p>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Qualification Overview
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {selectedCourse.description}
                </p>
              </div>

              {/* Occupations and Sectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-2">
                  <h4 className="text-xs font-bold text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-teal-700" /> Target Australian Occupations
                  </h4>
                  <ul className="space-y-1">
                    {selectedCourse.occupations?.map((occ, idx) => (
                      <li key={idx} className="text-xs text-teal-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0" />
                        <span>{occ}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-600" /> Industry Sectors
                  </h4>
                  <ul className="space-y-1">
                    {selectedCourse.industrySectors?.map((sec, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                        <span>{sec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Registered Training Organisations (RTOs) */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-600" /> Example Registered Training Organisations (RTOs)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedCourse.rtoProviders?.map((rto, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1 shadow-2xs">
                      <div className="font-bold text-slate-900">{rto.name}</div>
                      <div className="text-[10px] text-slate-500">State: {rto.state} • RTO #{rto.code}</div>
                      {rto.website && (
                        <a
                          href={rto.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-teal-700 hover:underline flex items-center gap-1 pt-0.5 font-medium"
                        >
                          <span>Visit Provider</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Source attribution notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Official National Register Data:</strong> This qualification is registered under the Australian Qualifications Framework (AQF). Specification and competency rules are maintained by {selectedCourse.developer || 'the Australian Government'}.
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <a
                href={selectedCourse.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>View on training.gov.au</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showToast('Saved to Career Roadmap', `Added ${selectedCourse.title} to your targeted learning plan`, 'success');
                    setSelectedCourse(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                >
                  Save to My Learning Plan
                </button>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
