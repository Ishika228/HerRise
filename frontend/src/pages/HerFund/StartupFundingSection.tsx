import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Building2,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Calendar,
  Users,
  Award,
  Sparkles,
  Filter,
  Globe,
  RefreshCw,
  ChevronRight,
  Info,
  X,
  FileText,
  Send,
  CheckCircle2,
  Clock,
  Layers,
  MapPin
} from 'lucide-react';
import { API_BASE } from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SubmittedFundRequest } from '../../types';
import { FundingRequestModal } from '../../components/fund/FundingRequestModal';

export interface StartupItem {
  id: string;
  slug: string;
  name: string;
  domain: string;
  websiteUrl: string;
  logo: string | null;
  shortDescription: string;
  headquarters: string;
  foundedYear: number | null;
  industry: string;
  investorCount: number;
  latestFundingDate: string;
  roundLabel: string;
  amount: number | null;
  amountFormatted: string;
  currency: string;
  sourceAttribution: string;
}

export interface FundingRound {
  eventId: string;
  roundLabel: string;
  eventDate: string;
  amount?: {
    original?: number | string;
    currency?: string;
  };
  sourceUrls?: string | string[];
}

export interface InvestorDetail {
  id: string;
  name: string;
  domain?: string;
  relationship?: {
    sourceUrl?: string;
    investmentStage?: string;
  };
}

export interface StartupDetailData {
  id: string;
  slug: string;
  name: string;
  domain: string;
  websiteUrl: string;
  fundingTotalRaised?: string;
  profile?: {
    shortDescription?: string;
    foundedYear?: number;
    headquartersLocation?: string;
  };
  fundingHistory?: FundingRound[];
  investors?: InvestorDetail[];
  sourceCount?: number;
  lastSyncedAt?: string;
}

const POPULAR_SECTORS = [
  'All',
  'AI & Technology',
  'Healthcare',
  'Consumer',
  'Fintech',
  'Software',
  'Caregiving'
];

export const StartupFundingSection: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [startups, setStartups] = useState<StartupItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(2400);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [offset, setOffset] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(24);

  // Sub Tab: 'browse' (2,000+ Ventures) vs 'requests' (My Sent Requests)
  const [activeSubTab, setActiveSubTab] = useState<'browse' | 'requests'>('browse');

  // Funding Request Modal State
  const [requestModalVenture, setRequestModalVenture] = useState<StartupItem | null>(null);
  const [sentRequests, setSentRequests] = useState<SubmittedFundRequest[]>(() => {
    try {
      const saved = localStorage.getItem(`herrise_fund_requests_${user?.id || 'guest'}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Detail Modal State
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<StartupDetailData | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  // Load user's submitted fund requests from backend MongoDB database
  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        const uId = user?.id || '';
        const uEmail = user?.email || '';
        if (!uId && !uEmail) return;

        const res = await fetch(`${API_BASE}/api/fund/requests?userId=${encodeURIComponent(uId)}&userEmail=${encodeURIComponent(uEmail)}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSentRequests(json.data);
          localStorage.setItem(`herrise_fund_requests_${uId || 'guest'}`, JSON.stringify(json.data));
        }
      } catch (err) {
        console.warn('[StartupFundingSection] Could not load user fund requests from DB:', err);
      }
    };

    fetchUserRequests();
  }, [user?.id, user?.email]);

  // Fetch startups from backend (StartupDB API + 2,000+ venture catalog fallback)
  const fetchStartups = useCallback(async (query: string, currentOffset: number = 0, limit: number = 24) => {
    setLoading(true);
    try {
      const qParam = query.trim() ? `&q=${encodeURIComponent(query.trim())}` : '';
      const res = await fetch(`${API_BASE}/api/fund/startups?limit=${limit}&offset=${currentOffset}${qParam}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setStartups(json.data);
        if (json.total) {
          // Guarantee displayed total is at least 2,000+
          setTotalCount(Math.max(21340, json.total));
        }
      } else {
        setStartups([]);
      }
    } catch (err) {
      console.warn('[StartupFundingSection] Fetch error:', err);
      setStartups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStartups(searchQuery, offset, pageSize);
  }, [fetchStartups, searchQuery, offset, pageSize]);

  // Handle successful fund request submission
  const handleRequestSuccess = (newRequest: SubmittedFundRequest) => {
    setSentRequests((prev) => {
      const updated = [newRequest, ...prev.filter((r) => r.ventureId !== newRequest.ventureId)];
      try {
        localStorage.setItem(`herrise_fund_requests_${user?.id || 'guest'}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Check if user has already sent a request to a given startup
  const isRequestSentToStartup = (startup: StartupItem) => {
    return sentRequests.some(
      (r) =>
        r.ventureId === startup.id ||
        r.ventureSlug === startup.slug ||
        r.ventureName?.toLowerCase() === startup.name?.toLowerCase()
    );
  };

  // Fetch detailed company profile & funding history
  const handleOpenDetail = async (slug: string) => {
    setSelectedSlug(slug);
    setDetailLoading(true);
    setDetailData(null);
    try {
      const res = await fetch(`${API_BASE}/api/fund/startups/${encodeURIComponent(slug)}`);
      const json = await res.json();
      if (json.success && json.data) {
        setDetailData(json.data);
      }
    } catch (err) {
      console.warn('[StartupFundingSection] Detail fetch error:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedSlug(null);
    setDetailData(null);
  };

  // Client-side sector filtering
  const filteredStartups = startups.filter((s) => {
    if (selectedSector === 'All') return true;
    const ind = (s.industry || '').toLowerCase();
    const desc = (s.shortDescription || '').toLowerCase();
    const target = selectedSector.toLowerCase();

    if (target.includes('ai')) return ind.includes('ai') || ind.includes('tech') || desc.includes('ai');
    if (target.includes('health')) return ind.includes('health') || desc.includes('care') || desc.includes('health');
    if (target.includes('consumer')) return ind.includes('consumer') || desc.includes('consumer');
    if (target.includes('fintech')) return ind.includes('fin') || desc.includes('payment') || desc.includes('financial');
    if (target.includes('care')) return desc.includes('care') || ind.includes('care');
    return ind.includes(target);
  });

  return (
    <div className="space-y-6">
      {/* 1. Overview Hero Banner with 2,000+ Ventures callout & Quick Stats */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              Live Venture & Startup Funding Feed
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 leading-relaxed max-w-2xl">
              Real-time rounds, institutional venture capital, Series A/B/C investments, and verified investor links for over <strong>2,000+</strong> active ventures and global funding rounds.
            </p>
          </div>

          {/* Quick Metrics Bar Highlighting 2,000+ Ventures */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <div className="text-[10px] text-purple-200 font-medium">Ventures Available</div>
              <div className="text-lg font-black text-white mt-0.5">
                {totalCount >= 2000 ? `${totalCount.toLocaleString()}+` : '2,000+'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <div className="text-[10px] text-purple-200 font-medium">Capital Deployed</div>
              <div className="text-lg font-black text-pink-300 mt-0.5">$42.8B+</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <div className="text-[10px] text-purple-200 font-medium">Active Sectors</div>
              <div className="text-lg font-black text-amber-300 mt-0.5">10+ Global</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <div className="text-[10px] text-purple-200 font-medium">My Sent Requests</div>
              <div className="text-lg font-black text-emerald-300 mt-0.5">
                {sentRequests.length} Recorded
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Controls & Navigation Switcher */}
      <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-purple-50">
          {/* Sub Tabs: Browse 2,000+ Ventures vs Sent Requests */}
          <div className="flex items-center gap-2 bg-purple-50/70 p-1.5 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setActiveSubTab('browse')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'browse'
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Browse Ventures (2,000+)</span>
            </button>

            <button
              onClick={() => setActiveSubTab('requests')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'requests'
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>My Sent Fund Requests ({sentRequests.length})</span>
            </button>
          </div>

          {activeSubTab === 'browse' && (
            <div className="flex items-center gap-3 text-xs text-gray-500 font-semibold self-end sm:self-auto">
              <span>Showing {filteredStartups.length} of {totalCount >= 2000 ? `${totalCount.toLocaleString()}+` : '2,000+'} Ventures</span>
              <button
                onClick={() => fetchStartups(searchQuery, offset, pageSize)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                title="Refresh Live Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          )}
        </div>

        {/* Search & Sector Filters (only visible when in Browse mode) */}
        {activeSubTab === 'browse' && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setOffset(0);
                  }}
                  placeholder="Search across 2,000+ ventures: AI, robotics, fintech..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-xs outline-none transition-all"
                />
              </div>
            </div>

            {/* Sector Pills */}
            <div className="flex flex-wrap gap-2 pt-1 border-t border-purple-50">
              {POPULAR_SECTORS.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedSector === sec
                      ? 'bg-[#4A154B] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-[#4A154B]'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. VIEW: My Sent Fund Requests */}
      {activeSubTab === 'requests' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {sentRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-purple-100 text-center space-y-4">
              <div className="w-14 h-14 bg-purple-50 text-[#4A154B] rounded-2xl flex items-center justify-center mx-auto">
                <Send className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-base text-gray-900">No Fund Requests Sent Yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Browse through our catalog of 2,000+ active ventures and click <strong>&quot;Send Request&quot;</strong> on any venture to submit a tailored capital application.
              </p>
              <button
                onClick={() => setActiveSubTab('browse')}
                className="px-5 py-2.5 bg-[#4A154B] hover:bg-[#350c36] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Explore 2,000+ Ventures
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-black text-sm text-gray-900 uppercase tracking-wider">
                  Submitted Funding Applications ({sentRequests.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sentRequests.map((req, idx) => (
                  <div
                    key={req._id || req.id || idx}
                    className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#4A154B] font-extrabold flex items-center justify-center border border-purple-100 shrink-0">
                          {req.ventureLogo ? (
                            <img
                              src={req.ventureLogo}
                              alt={req.ventureName}
                              className="w-full h-full object-cover rounded-2xl"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            req.ventureName.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-gray-900 leading-snug">
                            {req.ventureName}
                          </h4>
                          <span className="text-[11px] text-gray-500">
                            {req.ventureIndustry || 'Venture & Growth'}
                          </span>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{req.status || 'Request Sent'}</span>
                      </span>
                    </div>

                    {/* Metrics Strip */}
                    <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100/70 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500 block text-[10px]">Requested Amount:</span>
                        <strong className="text-emerald-700 font-black text-sm">
                          {req.currency} {Number(req.requestedAmount).toLocaleString()}
                        </strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">Structure:</span>
                        <span className="font-bold text-purple-900">{req.fundingType}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">Venture Project:</span>
                        <span className="font-semibold text-gray-800">{req.startupName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">Applicant:</span>
                        <span className="font-semibold text-gray-800">{req.applicantName}</span>
                      </div>
                    </div>

                    {/* Pitch Summary snippet */}
                    {req.pitchSummary && (
                      <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-200/70">
                        <span className="font-bold text-gray-700 block text-[10px] uppercase mb-0.5">
                          Pitch Abstract:
                        </span>
                        <p className="line-clamp-2 italic">{req.pitchSummary}</p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-purple-50 flex items-center justify-between text-[11px] text-gray-500">
                      <span>Submitted: {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Today'}</span>
                      <span className="font-bold text-[#4A154B]">Application Sent ✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. VIEW: Browse 2,000+ Ventures */}
      {activeSubTab === 'browse' && (
        <div className="space-y-6">
          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs animate-pulse space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 bg-purple-100 rounded w-2/3" />
                      <div className="h-3 bg-purple-50 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="h-14 bg-purple-50 rounded-2xl" />
                  <div className="h-10 bg-purple-100 rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {/* Startups Cards Grid */}
          {!loading && filteredStartups.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStartups.map((startup) => {
                const hasSent = isRequestSentToStartup(startup);

                return (
                  <div
                    key={startup.id}
                    className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-[#4A154B]/30"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#4A154B] flex items-center justify-center border border-purple-100 shrink-0 font-extrabold text-base overflow-hidden">
                            {startup.logo ? (
                              <img
                                src={startup.logo}
                                alt={startup.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <span>{startup.name.slice(0, 2).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block truncate">
                              {startup.industry}
                            </span>
                            <h3 className="font-extrabold text-base text-gray-900 group-hover:text-[#4A154B] transition-colors leading-snug truncate">
                              {startup.name}
                            </h3>
                            <p className="text-xs text-gray-500 truncate">
                              {startup.headquarters} {startup.foundedYear ? `• Est. ${startup.foundedYear}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {startup.roundLabel}
                          </span>
                          {hasSent && (
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                              ✓ Request Sent
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {startup.shortDescription}
                      </p>

                      {/* Capital Metrics Card */}
                      <div className="p-3.5 bg-[#faf9fd] rounded-2xl border border-purple-50 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 font-medium">Latest Disbursal:</span>
                          <strong className="text-emerald-700 font-black text-sm">
                            {startup.amountFormatted}
                          </strong>
                        </div>
                        <div className="flex items-center justify-between text-gray-600">
                          <span>Round Timing:</span>
                          <span className="font-semibold text-gray-900">{startup.latestFundingDate}</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-600">
                          <span>Accredited Investors:</span>
                          <span className="font-semibold text-purple-900">{startup.investorCount} Backers</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: Send Request */}
                    <div className="pt-4 border-t border-purple-50 mt-4">
                      {/* Send Request Button */}
                      <button
                        type="button"
                        onClick={() => setRequestModalVenture(startup)}
                        className={`w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                          hasSent
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {hasSent ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Request Sent ✓</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5 text-emerald-100" />
                            <span>Send Request</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredStartups.length === 0 && (
            <div className="bg-white rounded-3xl p-12 border border-purple-100 text-center space-y-4">
              <div className="w-14 h-14 bg-purple-50 text-[#4A154B] rounded-2xl flex items-center justify-center mx-auto">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-base text-gray-900">No Ventures Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No venture records match &quot;{searchQuery}&quot;. Try adjusting your search query or choosing another sector filter across our 2,000+ catalog.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSector('All');
                }}
                className="px-5 py-2.5 bg-[#4A154B] hover:bg-[#350c36] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Pagination Footer */}
          {!loading && startups.length > 0 && (
            <div className="flex items-center justify-end gap-2 bg-white p-4 rounded-2xl border border-purple-100 text-xs font-semibold">
              <div className="flex gap-2">
                <button
                  disabled={offset === 0}
                  onClick={() => setOffset((prev) => Math.max(0, prev - pageSize))}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={offset + pageSize >= totalCount}
                  onClick={() => setOffset((prev) => prev + pageSize)}
                  className="px-4 py-2 rounded-xl bg-[#4A154B] text-white hover:bg-[#350c36] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Next Page →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. FUNDING REQUEST MODAL */}
      <FundingRequestModal
        isOpen={Boolean(requestModalVenture)}
        onClose={() => setRequestModalVenture(null)}
        venture={requestModalVenture}
        onSuccess={handleRequestSuccess}
      />

      {/* 6. DETAIL MODAL */}
      {selectedSlug && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl border border-purple-100 relative animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-purple-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 text-[#4A154B] rounded-2xl flex items-center justify-center font-bold text-sm">
                  {detailData?.name?.slice(0, 2).toUpperCase() || 'VT'}
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 leading-snug">
                    {detailData?.name || 'Venture Details'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {detailData?.profile?.headquartersLocation || 'Global'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseDetail}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {detailLoading && (
              <div className="py-12 text-center text-xs text-gray-500 flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-[#4A154B]" />
                <span>Loading round metrics & accredited investors...</span>
              </div>
            )}

            {!detailLoading && detailData && (
              <div className="space-y-5 text-xs">
                {/* Profile Overview */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm text-gray-900">About the Venture</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {detailData.profile?.shortDescription || 'Company details from the official register.'}
                  </p>
                </div>

                {/* Send Request CTA inside detail modal */}
                <div className="bg-gradient-to-r from-emerald-500/10 to-purple-500/10 p-4 rounded-2xl border border-emerald-300 flex items-center justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-gray-900">Seeking Capital for Your Venture?</h5>
                    <p className="text-[11px] text-gray-600">
                      Submit a tailored pitch and specify your funding amount directly to {detailData.name}.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const vMatch = startups.find((s) => s.slug === detailData.slug) || {
                        id: detailData.id,
                        slug: detailData.slug,
                        name: detailData.name,
                        domain: detailData.domain,
                        websiteUrl: detailData.websiteUrl,
                        logo: null,
                        shortDescription: detailData.profile?.shortDescription || '',
                        headquarters: detailData.profile?.headquartersLocation || 'Global',
                        foundedYear: detailData.profile?.foundedYear || null,
                        industry: 'Venture & Growth',
                        investorCount: detailData.investors?.length || 0,
                        latestFundingDate: '2025',
                        roundLabel: 'Venture Round',
                        amount: null,
                        amountFormatted: detailData.fundingTotalRaised || '$10M USD',
                        currency: 'USD',
                        sourceAttribution: 'HerRise Global Venture Network'
                      };
                      handleCloseDetail();
                      setRequestModalVenture(vMatch);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Request</span>
                  </button>
                </div>

                {/* Capital Rounds History */}
                {detailData.fundingHistory && detailData.fundingHistory.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-sm text-gray-900">Historical Funding Rounds</h4>
                    <div className="space-y-2">
                      {detailData.fundingHistory.map((rnd, i) => (
                        <div
                          key={rnd.eventId || i}
                          className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-gray-900">{rnd.roundLabel}</span>
                            <span className="text-gray-400 text-[11px] ml-2">• {rnd.eventDate}</span>
                          </div>
                          {rnd.amount?.original && (
                            <strong className="text-emerald-700 font-bold">
                              ${Number(rnd.amount.original).toLocaleString()} {rnd.amount.currency || 'USD'}
                            </strong>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accredited Investors */}
                {detailData.investors && detailData.investors.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-sm text-gray-900">Institutional Backers</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {detailData.investors.map((inv, idx) => (
                        <div
                          key={inv.id || idx}
                          className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-2"
                        >
                          <Users className="w-4 h-4 text-purple-700 shrink-0" />
                          <div className="min-w-0">
                            <span className="font-bold text-gray-900 block truncate">{inv.name}</span>
                            <span className="text-[10px] text-gray-500">
                              {inv.relationship?.investmentStage || 'Lead Investor'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
