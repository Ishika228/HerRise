import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Clock,
  Sparkles,
  MessageSquare,
  UserMinus,
  Check,
  X,
  Search,
  ExternalLink,
  ShieldCheck,
  Mail
} from 'lucide-react';
import { Connection } from '../../../data/mockData/networkData';

interface MyConnectionsViewProps {
  connections: Connection[];
  onAccept: (id: string) => void;
  onRemove: (id: string) => void;
  onViewProfile: (connection: Connection) => void;
  onMessage?: (connection: Connection) => void;
}

export const MyConnectionsView: React.FC<MyConnectionsViewProps> = ({
  connections,
  onAccept,
  onRemove,
  onViewProfile,
  onMessage
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'mentor' | 'connected' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const mentorsCount = connections.filter((c) => c.status === 'mentor').length;
  const connectedCount = connections.filter((c) => c.status === 'connected').length;
  const pendingCount = connections.filter((c) => c.status === 'pending').length;

  const filteredConnections = connections.filter((conn) => {
    // Tab filter
    if (activeTab !== 'all' && conn.status !== activeTab) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = conn.name.toLowerCase().includes(q);
      const matchProf = conn.profession.toLowerCase().includes(q);
      const matchInd = conn.industry.toLowerCase().includes(q);
      if (!matchName && !matchProf && !matchInd) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#4A154B] via-[#631c64] to-[#701a75] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-pink-200 text-xs font-bold">
            <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Professional Network & Trusted Circles</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Connections & Mentorship Circle
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 leading-relaxed max-w-xl">
            Keep track of your mentors, industry peers, and inbound connection invitations in one organized space.
          </p>

          {/* Metric Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl font-bold">
              {mentorsCount} Active Mentors
            </span>
            <span className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl font-bold">
              {connectedCount} Sisterhood Connections
            </span>
            {pendingCount > 0 && (
              <span className="text-xs bg-amber-400/90 text-amber-950 font-extrabold px-3 py-1 rounded-xl">
                {pendingCount} Pending Requests
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-purple-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search connections by name or industry..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-xs outline-none transition-colors"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-purple-50/70 p-1 rounded-2xl w-full md:w-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#4A154B] text-white shadow-xs'
                : 'text-gray-700 hover:text-[#4A154B]'
            }`}
          >
            All ({connections.length})
          </button>
          <button
            onClick={() => setActiveTab('mentor')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'mentor'
                ? 'bg-[#4A154B] text-white shadow-xs'
                : 'text-gray-700 hover:text-[#4A154B]'
            }`}
          >
            My Mentors ({mentorsCount})
          </button>
          <button
            onClick={() => setActiveTab('connected')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'connected'
                ? 'bg-[#4A154B] text-white shadow-xs'
                : 'text-gray-700 hover:text-[#4A154B]'
            }`}
          >
            My Connections ({connectedCount})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'pending'
                ? 'bg-[#4A154B] text-white shadow-xs'
                : 'text-gray-700 hover:text-[#4A154B]'
            }`}
          >
            <span>Pending Requests</span>
            {pendingCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-amber-950 font-black">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Grid of Connections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConnections.map((conn) => (
          <div
            key={conn.id}
            className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-4">
              {/* Header with Avatar and Status Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={conn.avatar}
                    alt={conn.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-[#4A154B] transition-colors truncate">
                      {conn.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#4A154B] truncate">
                      {conn.profession}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {conn.industry}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                  {conn.status === 'mentor' && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                      ★ Mentor
                    </span>
                  )}
                  {conn.status === 'connected' && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ✓ Connected
                    </span>
                  )}
                  {conn.status === 'pending' && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
                      ⏱ Pending
                    </span>
                  )}
                </div>
              </div>

              {conn.connectedSince && (
                <div className="text-[11px] text-gray-400 flex items-center gap-1.5 pt-1 border-t border-purple-50">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Connected since {conn.connectedSince}</span>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-purple-50 flex items-center justify-between gap-2 mt-4">
              <button
                onClick={() => onViewProfile(conn)}
                className="text-xs font-bold text-gray-700 hover:text-[#4A154B] px-3 py-2 rounded-xl bg-gray-50 hover:bg-purple-50 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>View Profile</span>
              </button>

              {conn.status === 'pending' ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onAccept(conn.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    title="Accept connection request"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={() => onRemove(conn.id)}
                    className="bg-gray-100 hover:bg-rose-50 text-gray-600 hover:text-rose-600 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    title="Decline request"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onMessage?.(conn)}
                    className="bg-[#4A154B] hover:bg-[#350c36] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-pink-300" />
                    <span>Message</span>
                  </button>
                  <button
                    onClick={() => onRemove(conn.id)}
                    className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove connection"
                  >
                    <UserMinus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredConnections.length === 0 && (
        <div className="bg-white rounded-3xl border border-purple-100 p-12 text-center space-y-3">
          <Users className="w-10 h-10 text-gray-300 mx-auto" />
          <h4 className="font-bold text-gray-700 text-sm">No connections match this view</h4>
          <p className="text-xs text-gray-400">
            {activeTab === 'pending'
              ? 'No pending invitations right now.'
              : 'Try discovering mentors or connecting with women in the community.'}
          </p>
        </div>
      )}
    </div>
  );
};
