import React, { useState } from 'react';
import {
  Users2,
  Calendar,
  MessageSquare,
  Heart,
  Star,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  PlusCircle,
  Award,
  Video,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/cards/StatCard';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ModuleRegistrationGate } from '../../components/common/ModuleRegistrationGate';
import {
  initialMentors,
  initialWorkshops,
  initialCommunityPosts,
  successStoriesData
} from '../../data/mockData/networkData';
import { Mentor, Workshop, CommunityPost } from '../../types';

export const HerNetworkPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Registration Gate at Starting
  const [isSetupCompleted, setIsSetupCompleted] = useState<boolean>(() => {
    return localStorage.getItem('herrise_network_setup_completed') === 'true';
  });
  const [gateOpen, setGateOpen] = useState<boolean>(() => {
    return localStorage.getItem('herrise_network_setup_completed') !== 'true';
  });

  const [activeTab, setActiveTab] = useState<'mentors' | 'workshops' | 'feed' | 'stories'>('mentors');

  // Mentors state
  const [mentorsList, setMentorsList] = useState<Mentor[]>(initialMentors);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [searchMentor, setSearchMentor] = useState('');

  // Dynamic Compatibility Match
  const [matchScore, setMatchScore] = useState<number>(user?.networkProfile?.matchScore || 94);

  const handleGateComplete = (data: any) => {
    setIsSetupCompleted(true);
    setGateOpen(false);
    if (data.matchScore) setMatchScore(data.matchScore);
    if (data.mentorshipDomain) {
      if (data.mentorshipDomain.includes('Fundraising')) setSelectedIndustry('Venture & Angel Investing');
      else if (data.mentorshipDomain.includes('Career')) setSelectedIndustry('Corporate HR & Leadership');
      else if (data.mentorshipDomain.includes('Tech')) setSelectedIndustry('Technology & Engineering');
      else if (data.mentorshipDomain.includes('Marketing')) setSelectedIndustry('Brand & Growth Marketing');
    }
  };

  // Workshops state
  const [workshops, setWorkshops] = useState<Workshop[]>(initialWorkshops);

  // Community Feed state
  const [posts, setPosts] = useState<CommunityPost[]>(initialCommunityPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Founder Win 🎉');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Mentor Booking Modal
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState<Mentor | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-11-20');
  const [bookingSlot, setBookingSlot] = useState('4:00 PM - 4:30 PM IST');
  const [bookingTopic, setBookingTopic] = useState('Pricing my handmade product & marketing strategy');
  const [bookedSessionsCount, setBookedSessionsCount] = useState(1);

  // Filters
  const filteredMentors = mentorsList.filter((m) => {
    const matchesIndustry = selectedIndustry === 'All' || m.industry.includes(selectedIndustry);
    const matchesSearch =
      m.name.toLowerCase().includes(searchMentor.toLowerCase()) ||
      m.company.toLowerCase().includes(searchMentor.toLowerCase()) ||
      m.expertise.some((e) => e.toLowerCase().includes(searchMentor.toLowerCase()));
    return matchesIndustry && matchesSearch;
  });

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentorForBooking) return;
    setBookedSessionsCount((prev) => prev + 1);
    setSelectedMentorForBooking(null);
    try {
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    } catch {}
    showToast(
      'Session Booked! 🎉',
      `1:1 Strategy Call with ${selectedMentorForBooking.name} confirmed for ${bookingDate} at ${bookingSlot}`,
      'success'
    );
  };

  const handleToggleWorkshopRegister = (id: string) => {
    setWorkshops((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const newState = !w.isRegistered;
          showToast(
            newState ? 'Workshop Registered!' : 'Unregistered',
            newState ? `Calendar invite set for ${w.title}` : w.title,
            newState ? 'success' : 'info'
          );
          return {
            ...w,
            isRegistered: newState,
            attendeesCount: newState ? w.attendeesCount + 1 : w.attendeesCount - 1
          };
        }
        return w;
      })
    );
  };

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      })
    );
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    const newPost: CommunityPost = {
      id: 'post-' + Date.now().toString(36),
      authorName: user?.name || 'HerRise Member',
      authorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      authorRole: user?.role || 'Entrepreneur & Member',
      timeAgo: 'Just now',
      category: newPostCategory,
      content: newPostContent,
      likes: 1,
      isLiked: true,
      comments: []
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    showToast('Post Published', 'Shared with the HerNetwork sisterhood community', 'success');
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                id: 'c-' + Date.now().toString(36),
                authorName: user?.name || 'HerRise Member',
                authorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
                content: text,
                timeAgo: 'Just now'
              }
            ]
          };
        }
        return p;
      })
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    showToast('Reply Added', 'Your comment was posted', 'info');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Dynamic Setup Intake Prompt Banner */}
        {!isSetupCompleted ? (
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-100 text-[#4f46e5] shrink-0">
                <Users2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Personalized Mentorship Intake Required</h4>
                <p className="text-xs text-gray-600 leading-relaxed mt-0.5">
                  Specify your venture or career challenge to calculate your live Mentor Compatibility Score.
                </p>
              </div>
            </div>
            <button
              onClick={() => setGateOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#4A154B] hover:bg-[#350c36] text-white font-bold text-xs rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
            >
              <span>Complete Mentorship Registration</span>
            </button>
          </div>
        ) : (
          <div className="bg-purple-50/60 border border-purple-100 px-4 py-2 rounded-2xl flex items-center justify-between text-xs text-purple-900">
            <span>✓ Verified Sisterhood Profile Active: <strong>{user?.networkProfile?.mentorshipDomain || 'Mentorship Focus'}</strong></span>
            <button
              onClick={() => setGateOpen(true)}
              className="font-bold text-[#4A154B] hover:underline cursor-pointer"
            >
              Edit Mentorship Focus
            </button>
          </div>
        )}

        {/* Header Bar */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-violet-100 text-[#4f46e5]">
                <Users2 className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                HerNetwork — Mentorship & Sisterhood Community
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Book 1:1 strategy calls with seasoned female leaders, join live masterclasses, and share founder wins.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-purple-50/70 p-1.5 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('mentors')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'mentors' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              Mentor Discovery
            </button>
            <button
              onClick={() => setActiveTab('workshops')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'workshops' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              Live Workshops
            </button>
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'feed' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              Community Feed
            </button>
            <button
              onClick={() => setActiveTab('stories')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'stories' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              Success Stories
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Verified Mentors"
            value="32 Leaders"
            subtitle="Tech, Venture, IP Law"
            icon={Users2}
            iconColor="text-[#4A154B]"
            bgColor="bg-purple-50"
          />
          <StatCard
            title="Your Booked Sessions"
            value={`${bookedSessionsCount} Active`}
            subtitle="Next: Saturday 4:00 PM"
            icon={Video}
            iconColor="text-emerald-700"
            bgColor="bg-emerald-50"
          />
          <StatCard
            title="Upcoming Masterclasses"
            value={workshops.length}
            subtitle="Free registration for members"
            icon={Calendar}
            iconColor="text-[#be185d]"
            bgColor="bg-pink-50"
          />
          <StatCard
            title="Community Sisterhood"
            value="14,200+"
            subtitle="Women supporting women"
            icon={Heart}
            iconColor="text-rose-600"
            bgColor="bg-rose-50"
          />
        </div>

        {/* TAB 1: MENTOR DISCOVERY */}
        {activeTab === 'mentors' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchMentor}
                  onChange={(e) => setSearchMentor(e.target.value)}
                  placeholder="Search mentors by name, company, or domain (e.g. Angel, Returnships)..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-xs outline-none"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-gray-500 uppercase tracking-wider">Industry:</span>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                >
                  <option value="All">All Industries</option>
                  <option value="Investment">Investment & VC</option>
                  <option value="D2C">D2C E-commerce</option>
                  <option value="Tech">Tech & Returnships</option>
                  <option value="Legal">Legal & IP Protection</option>
                </select>
              </div>
            </div>

            {/* Mentor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-3">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-extrabold text-base text-gray-900 group-hover:text-[#4A154B] transition-colors">
                            {mentor.name}
                          </h3>
                          {mentor.badges.map((b, idx) => (
                            <span key={idx} className="text-[9px] font-bold bg-pink-100 text-[#be185d] px-2 py-0.5 rounded-full">
                              {b}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs font-semibold text-[#4A154B]">{mentor.designation}</p>
                        <p className="text-[11px] text-gray-500">{mentor.company} • {mentor.experienceYears} yrs experience</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      {mentor.bio}
                    </p>

                    {/* Expertise Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {mentor.expertise.map((exp, idx) => (
                        <span key={idx} className="text-[10px] bg-purple-50 text-purple-900 border border-purple-100 px-2 py-0.5 rounded-md font-medium">
                          {exp}
                        </span>
                      ))}
                    </div>

                    {/* Languages & Rating */}
                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                      <span>Languages: <strong>{mentor.languages.join(', ')}</strong></span>
                      <span className="flex items-center gap-1 font-bold text-gray-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {mentor.rating} ({mentor.sessionsCompleted} calls)
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-purple-50 flex items-center justify-between mt-4">
                    <span className="text-[11px] font-semibold text-emerald-700">
                      {mentor.availability}
                    </span>
                    <button
                      onClick={() => setSelectedMentorForBooking(mentor)}
                      className="bg-[#4A154B] hover:bg-[#350c36] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5 text-pink-300" />
                      <span>Book a Session</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: LIVE WORKSHOPS */}
        {activeTab === 'workshops' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Upcoming Live Masterclasses</h3>
              <p className="text-xs text-gray-500">
                Interactive weekend sessions with Q&A directly led by seasoned practitioners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workshops.map((ws) => (
                <div
                  key={ws.id}
                  className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A154B] bg-purple-100 px-2.5 py-0.5 rounded-full">
                        {ws.category}
                      </span>
                      <span className="text-[11px] text-gray-400">{ws.duration}</span>
                    </div>

                    <h4 className="font-extrabold text-sm text-gray-900 leading-snug">{ws.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{ws.description}</p>

                    <div className="p-3 bg-[#faf9fd] rounded-2xl border border-purple-50 flex items-center gap-3">
                      <img
                        src={ws.mentorAvatar}
                        alt={ws.mentorName}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <strong className="text-xs text-gray-900 block">{ws.mentorName}</strong>
                        <span className="text-[10px] text-gray-500">{ws.mentorRole}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-600 pt-1">
                      <Clock className="w-4 h-4 text-[#4A154B]" />
                      <span>{ws.date} • {ws.time}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-purple-50 flex items-center justify-between mt-4">
                    <span className="text-[11px] text-gray-500 font-medium">
                      {ws.attendeesCount} Registered
                    </span>

                    <button
                      onClick={() => handleToggleWorkshopRegister(ws.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        ws.isRegistered
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-[#4A154B] hover:bg-[#350c36] text-white shadow-xs'
                      }`}
                    >
                      {ws.isRegistered ? '✓ Registered' : 'Register Free'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: COMMUNITY DISCUSSION FEED */}
        {activeTab === 'feed' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Create Post Box */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">
                Share a Win or Ask the Sisterhood
              </h3>
              <form onSubmit={handleAddPost} className="space-y-3">
                <textarea
                  rows={3}
                  required
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share your latest milestone, ask for vendor advice, or celebrate another sister..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs outline-none focus:border-[#4A154B] leading-relaxed"
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 font-medium">Category:</span>
                    <select
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value)}
                      className="px-2.5 py-1 bg-gray-50 border rounded-lg outline-none text-xs"
                    >
                      <option value="Founder Win 🎉">Founder Win 🎉</option>
                      <option value="Career Advice 💡">Career Advice 💡</option>
                      <option value="Financial Growth 💰">Financial Growth 💰</option>
                      <option value="Vendor / Supply Question 📦">Vendor Question 📦</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#4A154B] hover:bg-[#350c36] text-white px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-pink-300" />
                    <span>Post Update</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Posts Stream */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-10 h-10 rounded-full object-cover border border-purple-200"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-gray-900">{post.authorName}</h4>
                        <span className="text-[10px] text-gray-500">{post.authorRole} • {post.timeAgo}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-900">
                      {post.category}
                    </span>
                  </div>

                  <p className="text-xs text-gray-800 leading-relaxed">{post.content}</p>

                  {/* Likes & Comments bar */}
                  <div className="pt-2 border-t border-purple-50 flex items-center gap-4 text-xs text-gray-500">
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        post.isLiked ? 'text-rose-600 font-bold' : 'hover:text-gray-900'
                      }`}
                    >
                      <Heart className="w-4 h-4" fill={post.isLiked ? '#e11d48' : 'none'} />
                      <span>{post.likes} Likes</span>
                    </button>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-purple-700" />
                      <span>{post.comments.length} Comments</span>
                    </span>
                  </div>

                  {/* Comments list */}
                  {post.comments.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-purple-50 bg-[#faf9fd] p-3 rounded-2xl">
                      {post.comments.map((c) => (
                        <div key={c.id} className="text-xs">
                          <span className="font-bold text-gray-900 mr-1.5">{c.authorName}:</span>
                          <span className="text-gray-700">{c.content}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment input */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      placeholder="Write an encouraging reply..."
                      className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#4A154B]"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="bg-purple-50 hover:bg-[#4A154B] hover:text-white text-[#4A154B] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SUCCESS STORIES */}
        {activeTab === 'stories' && (
          <div className="space-y-6">
            <div className="text-left space-y-1">
              <h3 className="text-base font-bold text-gray-900">Featured Sisterhood Transformations</h3>
              <p className="text-xs text-gray-500">Inspiring journeys from across the HerRise platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {successStoriesData.map((s, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-3">
                  <img src={s.image} alt={s.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-200" />
                  <h4 className="font-bold text-sm text-gray-900">{s.name}</h4>
                  <p className="text-xs text-[#4A154B] font-semibold">{s.role}</p>
                  <p className="text-xs text-gray-600 italic">"{s.quote}"</p>
                  <div className="pt-2 text-xs font-bold text-emerald-700">{s.metrics}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Book Mentorship Session */}
      {selectedMentorForBooking && (
        <Modal
          isOpen={!!selectedMentorForBooking}
          onClose={() => setSelectedMentorForBooking(null)}
          title={`Book 1:1 Strategy Call with ${selectedMentorForBooking.name}`}
          subtitle={`${selectedMentorForBooking.designation} @ ${selectedMentorForBooking.company}`}
        >
          <form onSubmit={handleBookSession} className="space-y-4 text-xs">
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
              <span className="font-bold text-purple-900">30-Minute Dedicated Strategy Session:</span>
              <p className="text-gray-600 text-[11px] mt-0.5">
                Complimentary for HerRise community members. Conducted over encrypted video call.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Available Time Slot</label>
                <select
                  value={bookingSlot}
                  onChange={(e) => setBookingSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                >
                  <option value="11:00 AM - 11:30 AM IST">11:00 AM - 11:30 AM IST</option>
                  <option value="3:00 PM - 3:30 PM IST">3:00 PM - 3:30 PM IST</option>
                  <option value="4:00 PM - 4:30 PM IST">4:00 PM - 4:30 PM IST</option>
                  <option value="6:00 PM - 6:30 PM IST">6:00 PM - 6:30 PM IST</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Primary Discussion Topic / Question</label>
              <textarea
                rows={3}
                required
                value={bookingTopic}
                onChange={(e) => setBookingTopic(e.target.value)}
                placeholder="What specific roadblock or question do you want guidance on?"
                className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#4A154B] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#350c36] cursor-pointer"
            >
              Confirm Mentorship Session
            </button>
          </form>
        </Modal>
      )}

      {/* Module Registration Gate at Starting */}
      <ModuleRegistrationGate
        module="network"
        isOpen={gateOpen}
        onClose={() => setGateOpen(false)}
        onComplete={handleGateComplete}
      />
    </DashboardLayout>
  );
};

