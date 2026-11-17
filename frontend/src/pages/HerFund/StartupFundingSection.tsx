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
  FileText
} from 'lucide-react';
import { API_BASE } from '../../config/api';

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
  const [startups, setStartups] = useState<StartupItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [offset, setOffset] = useState<number>(0);

  // Detail Modal State
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<StartupDetailData | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  // Fetch startups from backend proxy (which queries StartupDB API)
  const fetchStartups = useCallback(async (query: string, currentOffset: number = 0) => {
    setLoading(true);
    try {
      const qParam = query.trim() ? `&q=${encodeURIComponent(query.trim())}` : '';
      const res = await fetch(`${API_BASE}/api/fund/startups?limit=24&offset=${currentOffset}${qParam}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setStartups(json.data);
        if (json.total) setTotalCount(json.total);
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
    fetchStartups(searchQuery, offset);
  }, [fetchStartups, searchQuery, offset]);

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
      {/* Overview Stat Callout */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            Live Venture & Startup Funding Feed
          </h2>
          <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
            Real-time rounds, institutional venture capital, Series A/B/C investments, and verified investor links for over <strong>21,340+</strong> companies.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-xs space-y-4">
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
              placeholder="Search startup name, AI, healthcare, robotics..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-xs outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
            <span>Showing {filteredStartups.length} Live Ventures</span>
            <button
              onClick={() => fetchStartups(searchQuery, offset)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              title="Refresh Live Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
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
          {filteredStartups.map((startup) => (
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

                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                    {startup.roundLabel}
                  </span>
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

              {/* Action Buttons */}
              <div className="pt-4 border-t border-purple-50 flex items-center justify-between gap-2 mt-4">
                {startup.websiteUrl && (
                  <a
                    href={startup.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl border border-gray-200 hover:border-[#4A154B] text-gray-600 hover:text-[#4A154B] transition-colors"
                    title="Visit Official Website"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={() => handleOpenDetail(startup.slug)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#4A154B] hover:bg-[#350c36] text-white py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <span>Funding Rounds & Investors</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
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
            No venture records match &quot;{searchQuery}&quot;. Try adjusting your search query or choosing another sector filter.
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
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-purple-100 text-xs font-semibold">
          <span className="text-gray-500">
            Page {Math.floor(offset / 24) + 1} • Sourced from StartupDB
          </span>
          <div className="flex gap-2">
            <button
              disabled={offset === 0}
              onClick={() => setOffset((prev) => Math.max(0, prev - 24))}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setOffset((prev) => prev + 24)}
              className="px-4 py-2 rounded-xl bg-[#4A154B] text-white hover:bg-[#350c36] cursor-pointer transition-colors"
            >
              Next Page →
            </button>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedSlug && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl border border-purple-100 relative animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-purple-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                  Verified Startup Intelligence
                </span>
                <h3 className="font-extrabold text-xl text-gray-900 mt-0.5">
                  {detailData?.name || 'Company Details'}
                </h3>
              </div>
              <button
                onClick={handleCloseDetail}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {detailLoading && (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#4A154B] animate-spin mx-auto" />
                <p className="text-xs text-gray-500 font-semibold">Loading verified funding history...</p>
              </div>
            )}

            {!detailLoading && detailData && (
              <div className="space-y-6">
                {/* Short Overview */}
                <div className="bg-[#faf9fd] p-4 rounded-2xl border border-purple-50 space-y-2">
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {detailData.profile?.shortDescription || 'Company details from the official StartupDB register.'}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-600 pt-1">
                    <span>📍 {detailData.profile?.headquartersLocation || 'Headquarters Undisclosed'}</span>
                    {detailData.fundingTotalRaised && (
                      <span className="text-emerald-700 font-extrabold">
                        💰 Total Raised: {detailData.fundingTotalRaised}
                      </span>
                    )}
                    {detailData.websiteUrl && (
                      <a
                        href={detailData.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#4A154B] hover:underline flex items-center gap-1"
                      >
                        Visit Website <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Funding Rounds Timeline */}
                <div>
                  <h4 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#4A154B]" />
                    <span>Funding Rounds History</span>
                  </h4>
                  {Array.isArray(detailData.fundingHistory) && detailData.fundingHistory.length > 0 ? (
                    <div className="space-y-3">
                      {detailData.fundingHistory.map((round, idx) => {
                        const originalVal = round.amount?.original ? Number(round.amount.original) : null;
                        const originalFormatted = originalVal
                          ? `$${originalVal.toLocaleString()} ${round.amount?.currency || 'USD'}`
                          : 'Amount Undisclosed';

                        const sourceUrlList = typeof round.sourceUrls === 'string'
                          ? round.sourceUrls.split(' ').filter(Boolean)
                          : Array.isArray(round.sourceUrls) ? round.sourceUrls : [];

                        return (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl border border-gray-200 hover:border-purple-300 transition-colors space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-xs text-gray-900 bg-purple-50 px-2.5 py-1 rounded-lg text-purple-900">
                                {round.roundLabel || 'Venture Round'}
                              </span>
                              <span className="text-xs font-bold text-emerald-700">{originalFormatted}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Round Date: {round.eventDate || 'Recorded'}</span>
                            </div>
                            {sourceUrlList.length > 0 && (
                              <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-2 items-center text-[11px]">
                                <span className="text-gray-400 font-semibold">Verified Sources:</span>
                                {sourceUrlList.slice(0, 3).map((url, i) => (
                                  <a
                                    key={i}
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 hover:underline flex items-center gap-0.5 truncate max-w-[200px]"
                                  >
                                    <span>{new URL(url).hostname}</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">No historical funding rounds published.</p>
                  )}
                </div>

                {/* Backing Investors */}
                <div>
                  <h4 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#4A154B]" />
                    <span>Participating Investors</span>
                  </h4>
                  {Array.isArray(detailData.investors) && detailData.investors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {detailData.investors.map((inv, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                          <span className="font-semibold text-gray-800">{inv.name}</span>
                          {inv.relationship?.sourceUrl && (
                            <a
                              href={inv.relationship.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-gray-400 hover:text-purple-700"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">Individual investor names not disclosed publicly.</p>
                  )}
                </div>

                {/* License Attribution */}
                <div className="text-[11px] text-gray-400 pt-2 border-t border-purple-50 flex items-center justify-between">
                  <span>Data licensed under CC BY 4.0</span>
                  <span>Source: StartupDB (https://startupdb.com)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
