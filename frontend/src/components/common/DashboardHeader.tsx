import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Sparkles,
  Bell,
  Globe,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../types';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuClick }) => {
  const { user, language, setLanguage } = useAuth();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    {
      id: 1,
      title: 'New Returnship Job Match',
      desc: 'Starlight Capital added Associate Financial Analyst',
      time: '10m ago',
      path: '/career',
      unread: true
    },
    {
      id: 2,
      title: 'Savings Goal Milestone 75%',
      desc: 'Emergency Fund is ₹1,35,000 of ₹1,80,000',
      time: '2h ago',
      path: '/finance',
      unread: true
    },
    {
      id: 3,
      title: 'Upcoming Live Masterclass',
      desc: 'Dr. Radhika Sen: Investor-Ready Pitch Decks starts Saturday',
      time: '1d ago',
      path: '/network',
      unread: false
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase();
    if (query.includes('job') || query.includes('resume') || query.includes('career')) {
      navigate('/career');
    } else if (query.includes('money') || query.includes('tax') || query.includes('budget') || query.includes('expense')) {
      navigate('/finance');
    } else if (query.includes('business') || query.includes('startup') || query.includes('plan')) {
      navigate('/business');
    } else if (query.includes('loan') || query.includes('fund') || query.includes('grant')) {
      navigate('/fund');
    } else if (query.includes('course') || query.includes('learn') || query.includes('quiz')) {
      navigate('/learn');
    } else if (query.includes('product') || query.includes('shop') || query.includes('market')) {
      navigate('/market');
    } else if (query.includes('mentor') || query.includes('workshop')) {
      navigate('/network');
    } else {
      navigate('/ai-assistant');
    }
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-purple-100 h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-purple-50 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearch} className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs, grants, budget tools, courses or mentors... (Press Enter)"
            className="w-full pl-9 pr-4 py-2 bg-purple-50/50 hover:bg-purple-50 focus:bg-white text-xs text-gray-900 border border-purple-100 focus:border-[#4A154B] rounded-xl outline-none transition-all"
          />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick AI Assistant Launch Pill */}
        <button
          onClick={() => navigate('/ai-assistant')}
          className="flex items-center gap-1.5 bg-gradient-to-r from-[#4A154B] to-[#701a75] hover:to-[#581c87] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-300" />
          <span className="hidden md:inline">Ask</span> HerRise AI
        </button>

        {/* Language selector */}
        <div className="flex items-center bg-purple-50/70 border border-purple-100 rounded-lg p-0.5 text-xs font-semibold text-gray-600">
          <Globe className="w-3.5 h-3.5 text-[#4A154B] ml-1 mr-0.5" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-transparent text-xs text-[#4A154B] font-semibold py-1 px-1 rounded outline-none cursor-pointer"
          >
            <option value="en">EN</option>
            <option value="hi">हिन्दी</option>
            <option value="mr">मराठी</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-purple-50 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#fb7185] rounded-full ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-purple-100 py-3 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 pb-2 border-b border-purple-50 flex items-center justify-between">
                <span className="font-bold text-xs text-gray-900">Notifications (Demo)</span>
                <span className="text-[10px] bg-purple-100 text-[#4A154B] font-bold px-2 py-0.5 rounded-full">
                  2 New
                </span>
              </div>
              <div className="divide-y divide-purple-50 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setNotificationsOpen(false);
                      navigate(n.path);
                    }}
                    className={`px-4 py-3 hover:bg-purple-50/70 transition-colors cursor-pointer text-xs ${
                      n.unread ? 'bg-purple-50/30' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-gray-900 font-semibold mb-0.5">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-gray-400 font-normal">{n.time}</span>
                    </div>
                    <p className="text-gray-600 text-[11px] leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 pt-2 border-t border-purple-50 text-center">
                <Link
                  to="/settings"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[11px] text-[#4A154B] font-semibold hover:underline"
                >
                  Notification Preferences →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Name Link */}
        <Link
          to="/profile"
          className="flex items-center gap-2 pl-2 border-l border-purple-100 hover:opacity-90 transition-opacity"
        >
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name || 'Member'}
            className="w-8 h-8 rounded-full object-cover border border-purple-200"
          />
          <span className="hidden md:block text-xs font-semibold text-gray-800 max-w-[110px] truncate">
            {user?.name?.split(' ')[0] || 'Member'}
          </span>
        </Link>
      </div>
    </header>
  );
};

