import React, { useState, useMemo } from 'react';
import {
  Search,
  Star,
  Globe,
  CheckCircle2,
  UserPlus,
  SlidersHorizontal,
  Users,
} from 'lucide-react';

interface MentorDiscoveryViewProps {
  mentors: any[];
  onViewProfile: (mentor: any) => void;
  onConnect: (mentorId: string) => void;
  connectedIds: string[];
}

const INDUSTRIES = ['All', 'IT & Technology', 'Business', 'Finance', 'Marketing', 'Education'];
const LANGUAGES = ['All', 'English', 'Hindi', 'Marathi', 'Tamil'];
const EXPERIENCE_OPTIONS = [
  { label: 'All Experience', value: 'all' },
  { label: '5+ Years', value: '5' },
  { label: '10+ Years', value: '10' },
  { label: '15+ Years', value: '15' },
];

export const MentorDiscoveryView: React.FC<MentorDiscoveryViewProps> = ({
  mentors,
  onViewProfile,
  onConnect,
  connectedIds,
}) => {
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [language, setLanguage] = useState('All');
  const [experience, setExperience] = useState('all');

  const filtered = useMemo(() => {
    return mentors.filter((m) => {
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = m.name?.toLowerCase().includes(q);
        const matchesIndustry = m.industry?.toLowerCase().includes(q);
        const matchesExpertise = (m.expertise || []).some((e: string) =>
          e.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesIndustry && !matchesExpertise) return false;
      }

      // Industry filter
      if (industry !== 'All') {
        if (!m.industry?.toLowerCase().includes(industry.toLowerCase())) return false;
      }

      // Language filter
      if (language !== 'All') {
        if (!(m.languages || []).includes(language)) return false;
      }

      // Experience filter
      if (experience !== 'all') {
        const minYears = parseInt(experience, 10);
        if ((m.experienceYears ?? 0) < minYears) return false;
      }

      return true;
    });
  }, [mentors, search, industry, language, experience]);

  const hasFilters = search || industry !== 'All' || language !== 'All' || experience !== 'all';

  const handleClearFilters = () => {
    setSearch('');
    setIndustry('All');
    setLanguage('All');
    setExperience('all');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Find a Mentor</h2>
        <p className="text-sm text-gray-500 mt-1">
          Discover experienced women mentors who can guide you on your journey — filter by
          expertise, language or experience.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search mentors by name, industry or expertise…"
          className="w-full pl-11 pr-4 py-3 bg-white border border-purple-100 rounded-2xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 shadow-xs"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters:
        </div>

        {/* Industry */}
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="text-xs font-medium text-gray-700 bg-white border border-purple-100 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 shadow-xs cursor-pointer"
        >
          {INDUSTRIES.map((opt) => (
            <option key={opt} value={opt}>
              {opt === 'All' ? 'All Industries' : opt}
            </option>
          ))}
        </select>

        {/* Language */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="text-xs font-medium text-gray-700 bg-white border border-purple-100 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 shadow-xs cursor-pointer"
        >
          {LANGUAGES.map((opt) => (
            <option key={opt} value={opt}>
              {opt === 'All' ? 'All Languages' : opt}
            </option>
          ))}
        </select>

        {/* Experience */}
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="text-xs font-medium text-gray-700 bg-white border border-purple-100 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 shadow-xs cursor-pointer"
        >
          {EXPERIENCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-pink-600 font-semibold hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        )}

        <span className="ml-auto text-xs text-gray-400 font-medium">
          {filtered.length} mentor{filtered.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* Mentor Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((mentor) => {
            const isConnected = connectedIds.includes(mentor.id);
            const expertisePills = (mentor.expertise || []).slice(0, 4);

            return (
              <div
                key={mentor.id}
                className="bg-white rounded-3xl border border-purple-100 shadow-xs hover:shadow-md transition-all p-5 flex flex-col gap-4"
              >
                {/* Top Row: Avatar + Name + Rating */}
                <div className="flex gap-4">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-bold text-sm text-gray-900 leading-tight truncate">
                        {mentor.name}
                      </h3>
                      <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg flex-shrink-0">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-bold text-amber-700">{mentor.rating}</span>
                      </div>
                    </div>
                    {/* Badges */}
                    {(mentor.badges || []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(mentor.badges as string[]).slice(0, 2).map((badge) => (
                          <span
                            key={badge}
                            className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-lg font-semibold border border-purple-100"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1 leading-tight truncate">
                      {mentor.designation}
                    </p>
                    <p className="text-xs font-semibold text-[#4A154B] truncate">{mentor.company}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {mentor.experienceYears} yrs experience
                    </p>
                  </div>
                </div>

                {/* Bio */}
                {mentor.bio && (
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{mentor.bio}</p>
                )}

                {/* Expertise Pills */}
                {expertisePills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {expertisePills.map((exp: string) => (
                      <span
                        key={exp}
                        className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-0.5 rounded-lg font-medium"
                      >
                        {exp}
                      </span>
                    ))}
                    {(mentor.expertise || []).length > 4 && (
                      <span className="text-[10px] text-gray-400 font-medium self-center">
                        +{(mentor.expertise || []).length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Languages + Sessions */}
                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <div className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span>{(mentor.languages || []).join(', ')}</span>
                  </div>
                  {mentor.sessionsCompleted !== undefined && (
                    <span className="font-medium text-gray-400">
                      {mentor.sessionsCompleted} sessions
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onViewProfile(mentor)}
                    className="flex-1 border border-[#4A154B] text-[#4A154B] hover:bg-purple-50 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    View Profile
                  </button>
                  {isConnected ? (
                    <button
                      disabled
                      className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold cursor-default"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Connected ✓
                    </button>
                  ) : (
                    <button
                      onClick={() => onConnect(mentor.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-[#4A154B] hover:bg-[#350c36] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Connect
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-3xl flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-purple-300" />
          </div>
          <h3 className="font-bold text-gray-700 text-sm mb-1">No mentors found</h3>
          <p className="text-xs text-gray-400 max-w-xs">
            Try adjusting your search or filters to discover mentors who match your needs.
          </p>
          {hasFilters && (
            <button
              onClick={handleClearFilters}
              className="mt-4 bg-[#4A154B] hover:bg-[#350c36] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
