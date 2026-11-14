import React from 'react';
import {
  Users,
  Calendar,
  MessageSquare,
  UserCheck,
  Compass,
  BookOpen,
  Star,
  Briefcase,
  Globe,
  Heart,
} from 'lucide-react';

interface NetworkDashboardViewProps {
  onNavigate: (view: 'dashboard' | 'mentors' | 'community' | 'workshops' | 'connections') => void;
  stats: { connections: number; workshops: number; mentors: number; posts: number };
  recentPosts: any[];
  suggestedMentors: any[];
}

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-3xl border border-purple-100 shadow-xs p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const NavCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  view: 'dashboard' | 'mentors' | 'community' | 'workshops' | 'connections';
  onNavigate: (view: 'dashboard' | 'mentors' | 'community' | 'workshops' | 'connections') => void;
  gradient: string;
}> = ({ icon, title, description, view, onNavigate, gradient }) => (
  <div className="bg-white rounded-3xl border border-purple-100 shadow-xs hover:shadow-md transition-all p-6 flex flex-col gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${gradient}`}>
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-gray-900 text-sm mb-1">{title}</h4>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
    <button
      onClick={() => onNavigate(view)}
      className="self-start bg-[#4A154B] hover:bg-[#350c36] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
    >
      Explore →
    </button>
  </div>
);

export const NetworkDashboardView: React.FC<NetworkDashboardViewProps> = ({
  onNavigate,
  stats,
  recentPosts,
  suggestedMentors,
}) => {
  const displayedMentors = suggestedMentors.slice(0, 2);
  const displayedPosts = recentPosts.slice(0, 2);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#4A154B] to-[#701a75] rounded-3xl p-8 text-white">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-pink-300" />
            <span className="text-pink-200 text-xs font-semibold uppercase tracking-wide">
              HerNetwork
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-snug">
            Connect. Share. Grow Together.
          </h1>
          <p className="text-purple-100 text-sm leading-relaxed mb-6 max-w-xl">
            Build meaningful connections, learn from experienced mentors and grow together with a
            supportive community of women.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('mentors')}
              className="bg-white text-[#4A154B] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-50 transition-colors cursor-pointer"
            >
              Find a Mentor
            </button>
            <button
              onClick={() => onNavigate('community')}
              className="border border-white text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors cursor-pointer"
            >
              Explore Community
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-5 h-5 text-purple-700" />}
          label="My Connections"
          value={stats.connections}
          color="bg-purple-50"
        />
        <StatCard
          icon={<Calendar className="w-5 h-5 text-pink-600" />}
          label="Upcoming Workshops"
          value={stats.workshops}
          color="bg-pink-50"
        />
        <StatCard
          icon={<Compass className="w-5 h-5 text-indigo-600" />}
          label="Suggested Mentors"
          value={stats.mentors}
          color="bg-indigo-50"
        />
        <StatCard
          icon={<MessageSquare className="w-5 h-5 text-emerald-600" />}
          label="Community Posts"
          value={stats.posts}
          color="bg-emerald-50"
        />
      </div>

      {/* Navigation Cards */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-4">Explore HerNetwork</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NavCard
            icon={<Compass className="w-5 h-5 text-purple-700" />}
            title="Find a Mentor"
            description="Connect with experienced women mentors across tech, business, finance and more."
            view="mentors"
            onNavigate={onNavigate}
            gradient="bg-purple-50"
          />
          <NavCard
            icon={<MessageSquare className="w-5 h-5 text-pink-600" />}
            title="Community"
            description="Share wins, ask questions and support each other in our safe community space."
            view="community"
            onNavigate={onNavigate}
            gradient="bg-pink-50"
          />
          <NavCard
            icon={<BookOpen className="w-5 h-5 text-indigo-600" />}
            title="Workshops & Events"
            description="Join live skill-building workshops hosted by industry leaders and experts."
            view="workshops"
            onNavigate={onNavigate}
            gradient="bg-indigo-50"
          />
          <NavCard
            icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
            title="My Connections"
            description="Manage your network — view mentors, peers and pending connection requests."
            view="connections"
            onNavigate={onNavigate}
            gradient="bg-emerald-50"
          />
        </div>
      </div>

      {/* Suggested Mentors */}
      {displayedMentors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Suggested Mentors</h2>
            <button
              onClick={() => onNavigate('mentors')}
              className="text-xs font-bold text-[#4A154B] hover:underline cursor-pointer"
            >
              View Full Directory →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedMentors.map((mentor: any) => (
              <div
                key={mentor.id}
                className="bg-white rounded-3xl border border-purple-100 shadow-xs hover:shadow-md transition-all p-5 flex gap-4"
              >
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 leading-tight">{mentor.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5 leading-tight">
                        {mentor.designation}
                      </p>
                      <p className="text-xs text-[#4A154B] font-semibold">{mentor.company}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-xl flex-shrink-0">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-amber-700">{mentor.rating}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(mentor.expertise || []).slice(0, 3).map((exp: string) => (
                      <span
                        key={exp}
                        className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-lg font-medium border border-purple-100"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => onNavigate('mentors')}
                      className="bg-[#4A154B] hover:bg-[#350c36] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      View Profile
                    </button>
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-gray-400" />
                      <span className="text-[10px] text-gray-500">
                        {(mentor.languages || []).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent from Community */}
      {displayedPosts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Recent from Community</h2>
            <button
              onClick={() => onNavigate('community')}
              className="text-xs font-bold text-[#4A154B] hover:underline cursor-pointer"
            >
              View All Posts →
            </button>
          </div>
          <div className="space-y-3">
            {displayedPosts.map((post: any) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl border border-purple-100 shadow-xs p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-9 h-9 rounded-xl object-cover border border-purple-100"
                  />
                  <div>
                    <p className="text-xs font-bold text-gray-900">{post.authorName}</p>
                    <p className="text-[10px] text-gray-500">{post.authorRole}</p>
                  </div>
                  {post.category && (
                    <span className="ml-auto text-[10px] bg-pink-50 text-pink-700 px-2.5 py-1 rounded-lg font-semibold border border-pink-100">
                      {post.category}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {post.likes ?? 0} likes
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> {(post.comments ?? []).length} comments
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
