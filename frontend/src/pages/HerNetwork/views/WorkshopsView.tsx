import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Users,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';
import { Workshop } from '../../../types';

interface WorkshopsViewProps {
  workshops: Workshop[];
  onRegister: (workshopId: string) => void;
}

export const WorkshopsView: React.FC<WorkshopsViewProps> = ({
  workshops,
  onRegister
}) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'online' | 'offline'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkshopForDetails, setSelectedWorkshopForDetails] = useState<Workshop | null>(null);

  // Distribute workshop modes: some online, some offline for realistic demo
  const enhancedWorkshops = useMemo(() => {
    return workshops.map((ws, index) => ({
      ...ws,
      mode: index % 3 === 2 ? ('offline' as const) : ('online' as const),
      location: index % 3 === 2 ? 'HerRise Hub, BKC, Mumbai' : 'Live Interactive Zoom / Google Meet',
      isUpcoming: true,
      bannerGradient: [
        'from-purple-600 to-indigo-600',
        'from-pink-600 to-rose-600',
        'from-emerald-600 to-teal-600',
        'from-amber-500 to-orange-600',
        'from-violet-600 to-purple-800',
        'from-blue-600 to-cyan-600'
      ][index % 6]
    }));
  }, [workshops]);

  const filteredWorkshops = useMemo(() => {
    return enhancedWorkshops.filter((ws) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ws.title.toLowerCase().includes(q);
        const matchesCategory = ws.category.toLowerCase().includes(q);
        const matchesMentor = ws.mentorName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesMentor) return false;
      }

      // Tab filter
      if (filter === 'online' && ws.mode !== 'online') return false;
      if (filter === 'offline' && ws.mode !== 'offline') return false;
      // All are upcoming in our mock calendar
      return true;
    });
  }, [enhancedWorkshops, filter, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#4A154B] via-[#631c64] to-[#be185d] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-pink-200 text-xs font-bold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            <span>Interactive Upskilling & Peer Learning</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Workshops & Skill Masterclasses
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 leading-relaxed max-w-xl">
            Hands-on weekend cohorts and virtual bootcamps led by experienced practitioners. Learn actionable frameworks, build real portfolios, and connect with like-minded women.
          </p>
          <div className="pt-2 text-[11px] text-pink-200/90 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Demo Sessions & Sample Event Rosters</span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-purple-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workshops by topic or mentor..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-xs outline-none transition-colors"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-purple-50/70 p-1 rounded-2xl w-full md:w-auto text-xs font-bold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#4A154B] text-white shadow-xs'
                : 'text-gray-700 hover:text-[#4A154B]'
            }`}
          >
            All Workshops ({workshops.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              filter === 'upcoming'
                ? 'bg-[#4A154B] text-white shadow-xs'
                : 'text-gray-700 hover:text-[#4A154B]'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('online')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              filter === 'online'
                ? 'bg-[#4A154B] text-white shadow-xs'
                : 'text-gray-700 hover:text-[#4A154B]'
            }`}
          >
            Online Virtual
          </button>
          <button
            onClick={() => setFilter('offline')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              filter === 'offline'
                ? 'bg-[#4A154B] text-white shadow-xs'
                : 'text-gray-700 hover:text-[#4A154B]'
            }`}
          >
            In-Person Hub
          </button>
        </div>
      </div>

      {/* Workshop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkshops.map((ws) => (
          <div
            key={ws.id}
            className="bg-white rounded-3xl border border-purple-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
          >
            <div>
              {/* Header Visual Bar */}
              <div className={`h-24 bg-gradient-to-r ${ws.bannerGradient} p-4 flex items-start justify-between text-white relative`}>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                  {ws.category}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                  ws.mode === 'online'
                    ? 'bg-emerald-500/90 text-white'
                    : 'bg-amber-500/90 text-white'
                }`}>
                  {ws.mode === 'online' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                  <span>{ws.mode === 'online' ? 'Online' : 'In-Person'}</span>
                </span>
              </div>

              {/* Content Body */}
              <div className="p-5 space-y-3">
                <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-[#4A154B] transition-colors line-clamp-2 leading-snug">
                  {ws.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {ws.description}
                </p>

                {/* Host Info Box */}
                <div className="p-3 bg-[#faf9fd] rounded-2xl border border-purple-50 flex items-center gap-3">
                  <img
                    src={ws.mentorAvatar}
                    alt={ws.mentorName}
                    className="w-10 h-10 rounded-xl object-cover border border-purple-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <strong className="text-xs text-gray-900 block truncate">{ws.mentorName}</strong>
                    <span className="text-[10px] text-gray-500 truncate block">{ws.mentorRole}</span>
                  </div>
                </div>

                {/* Date & Time metadata */}
                <div className="space-y-1.5 pt-1 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#4A154B] shrink-0" />
                    <span className="font-medium text-gray-800">{ws.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{ws.time} ({ws.duration})</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    {ws.mode === 'online' ? (
                      <Video className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    )}
                    <span className="truncate">{ws.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Register Action */}
            <div className="p-5 pt-0 mt-2">
              <div className="pt-3 border-t border-purple-50 flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span>{ws.attendeesCount} enrolled</span>
                </span>

                <button
                  onClick={() => onRegister(ws.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    ws.isRegistered
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-[#4A154B] hover:bg-[#350c36] text-white shadow-xs'
                  }`}
                >
                  {ws.isRegistered ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>✓ Registered</span>
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="w-3.5 h-3.5 text-pink-300" />
                      <span>Register Free</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredWorkshops.length === 0 && (
        <div className="bg-white rounded-3xl border border-purple-100 p-12 text-center space-y-3">
          <Calendar className="w-10 h-10 text-gray-300 mx-auto" />
          <h4 className="font-bold text-gray-700 text-sm">No workshops found</h4>
          <p className="text-xs text-gray-400">Try adjusting your search terms or filter selection.</p>
        </div>
      )}

      {/* Upcoming Events Schedule Timeline Section */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Upcoming Community Calendar</h3>
            <p className="text-xs text-gray-500">Fast overview of upcoming masterclasses and cohort deadlines.</p>
          </div>
          <span className="text-xs font-bold text-[#4A154B] bg-purple-50 px-3 py-1 rounded-xl">
            Sample Live Schedule
          </span>
        </div>

        <div className="divide-y divide-purple-50">
          {enhancedWorkshops.slice(0, 4).map((ws, idx) => (
            <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#faf9fd] px-3 rounded-2xl transition-colors">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex flex-col items-center justify-center text-[#4A154B] shrink-0 font-mono">
                  <span className="text-[10px] uppercase font-bold text-pink-600">Day</span>
                  <span className="text-xs font-black">{idx + 1}</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900">{ws.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                    <span>Host: <strong className="text-gray-700">{ws.mentorName}</strong></span>
                    <span>•</span>
                    <span>{ws.date} at {ws.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onRegister(ws.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    ws.isRegistered
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                      : 'text-[#4A154B] bg-purple-50 hover:bg-[#4A154B] hover:text-white'
                  }`}
                >
                  {ws.isRegistered ? '✓ Enrolled' : 'Quick Register'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
