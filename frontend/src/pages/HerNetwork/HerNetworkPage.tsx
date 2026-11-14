import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ExternalLink,
  LayoutDashboard,
  Compass,
  UserCheck,
  Bell,
  ArrowLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ModuleRegistrationGate } from '../../components/common/ModuleRegistrationGate';

// Views
import { NetworkDashboardView } from './views/NetworkDashboardView';
import { MentorDiscoveryView } from './views/MentorDiscoveryView';
import { CommunityView } from './views/CommunityView';
import { WorkshopsView } from './views/WorkshopsView';
import { MyConnectionsView } from './views/MyConnectionsView';
import { MentorProfileModal } from './views/MentorProfileModal';

// Mock Data
import {
  initialMentors,
  initialWorkshops,
  initialCommunityPosts,
  initialConnections,
  Connection
} from '../../data/mockData/networkData';
import { Mentor, Workshop, CommunityPost } from '../../types';

export const HerNetworkPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  // Active subview: 'dashboard' | 'mentors' | 'community' | 'workshops' | 'connections'
  const [activeView, setActiveView] = useState<'dashboard' | 'mentors' | 'community' | 'workshops' | 'connections'>('dashboard');

  // Registration Gate
  const [isSetupCompleted, setIsSetupCompleted] = useState<boolean>(() => {
    return localStorage.getItem('herrise_network_setup_completed') === 'true';
  });
  const [gateOpen, setGateOpen] = useState<boolean>(() => {
    return localStorage.getItem('herrise_network_setup_completed') !== 'true';
  });

  // Mentors state (persisted in localStorage or fallback)
  const [mentorsList, setMentorsList] = useState<Mentor[]>(initialMentors);
  const [connectedMentorIds, setConnectedMentorIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('herrise_connected_mentor_ids');
      return saved ? JSON.parse(saved) : ['mentor-1', 'mentor-3'];
    } catch {
      return ['mentor-1', 'mentor-3'];
    }
  });

  // Workshops state
  const [workshops, setWorkshops] = useState<Workshop[]>(() => {
    try {
      const saved = localStorage.getItem('herrise_workshops_data');
      return saved ? JSON.parse(saved) : initialWorkshops;
    } catch {
      return initialWorkshops;
    }
  });

  // Community Feed state
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem('herrise_community_posts_data');
      return saved ? JSON.parse(saved) : initialCommunityPosts;
    } catch {
      return initialCommunityPosts;
    }
  });

  // Connections state
  const [connections, setConnections] = useState<Connection[]>(() => {
    try {
      const saved = localStorage.getItem('herrise_connections_data');
      return saved ? JSON.parse(saved) : initialConnections;
    } catch {
      return initialConnections;
    }
  });

  // Modals state
  const [selectedMentorForProfile, setSelectedMentorForProfile] = useState<Mentor | null>(null);
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState<Mentor | null>(null);
  const [selectedConnectionForProfile, setSelectedConnectionForProfile] = useState<Connection | null>(null);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState('2026-11-25');
  const [bookingSlot, setBookingSlot] = useState('4:00 PM - 4:30 PM IST');
  const [bookingTopic, setBookingTopic] = useState('Career Transition Strategy & Portfolio Guidance');
  const [bookedSessionsCount, setBookedSessionsCount] = useState(2);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('herrise_connected_mentor_ids', JSON.stringify(connectedMentorIds));
    } catch {}
  }, [connectedMentorIds]);

  useEffect(() => {
    try {
      localStorage.setItem('herrise_workshops_data', JSON.stringify(workshops));
    } catch {}
  }, [workshops]);

  useEffect(() => {
    try {
      localStorage.setItem('herrise_community_posts_data', JSON.stringify(posts));
    } catch {}
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem('herrise_connections_data', JSON.stringify(connections));
    } catch {}
  }, [connections]);

  // Handlers
  const handleGateComplete = (data: any) => {
    setIsSetupCompleted(true);
    setGateOpen(false);
    showToast('Mentorship Profile Active! ✨', 'Your personalized compatibility index is enabled.', 'success');
  };

  const handleConnectMentor = (mentorId: string) => {
    if (connectedMentorIds.includes(mentorId)) return;
    const mentor = mentorsList.find((m) => m.id === mentorId);

    setConnectedMentorIds((prev) => [...prev, mentorId]);

    // Add to pending connections if not already there
    if (mentor) {
      setConnections((prev) => {
        if (prev.some((c) => c.name === mentor.name)) return prev;
        return [
          {
            id: 'conn-' + Date.now().toString(36),
            name: mentor.name,
            avatar: mentor.avatar,
            profession: mentor.designation,
            industry: mentor.industry,
            status: 'mentor',
            connectedSince: 'Just now'
          },
          ...prev
        ];
      });
    }

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}

    showToast(
      'Connection Request Sent! 🤝',
      `You sent a mentorship connection invitation to ${mentor?.name || 'this mentor'}.`,
      'success'
    );
  };

  const handleToggleWorkshopRegister = (id: string) => {
    setWorkshops((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const newState = !w.isRegistered;
          showToast(
            newState ? 'Workshop Registered! 📅' : 'Registration Cancelled',
            newState
              ? `You are confirmed for "${w.title}". Calendar invite synced.`
              : `Removed registration for "${w.title}".`,
            newState ? 'success' : 'info'
          );
          if (newState) {
            try {
              confetti({ particleCount: 65, spread: 55, origin: { y: 0.6 } });
            } catch {}
          }
          return {
            ...w,
            isRegistered: newState,
            attendeesCount: newState ? w.attendeesCount + 1 : Math.max(0, w.attendeesCount - 1)
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
            likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
          };
        }
        return p;
      })
    );
  };

  const handleAddPost = (content: string, category: string) => {
    if (!content.trim()) return;
    const newPost: CommunityPost = {
      id: 'post-' + Date.now().toString(36),
      authorName: user?.name || 'Verified HerRise Member',
      authorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      authorRole: user?.role || 'Entrepreneur & Member',
      timeAgo: 'Just now',
      category: category || 'General Discussion',
      content,
      likes: 1,
      isLiked: true,
      comments: []
    };
    setPosts([newPost, ...posts]);
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch {}
    showToast('Post Published! 🌸', 'Your message is now visible to the HerNetwork sisterhood.', 'success');
  };

  const handleAddComment = (postId: string, text: string) => {
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
                authorName: user?.name || 'Verified HerRise Member',
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
    showToast('Reply Added 💬', 'Your response has been added to the discussion.', 'info');
  };

  const handleAcceptConnection = (id: string) => {
    setConnections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'connected', connectedSince: 'Just now' } : c))
    );
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}
    showToast('Connection Accepted! ✨', 'New peer added to your sisterhood network.', 'success');
  };

  const handleRemoveConnection = (id: string) => {
    const conn = connections.find((c) => c.id === id);
    setConnections((prev) => prev.filter((c) => c.id !== id));
    showToast('Connection Removed', `${conn?.name || 'Contact'} was removed from your network.`, 'info');
  };

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentorForBooking) return;
    setBookedSessionsCount((prev) => prev + 1);
    const mentorName = selectedMentorForBooking.name;
    setSelectedMentorForBooking(null);
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.55 } });
    } catch {}
    showToast(
      'Strategy Session Booked! 🎉',
      `1:1 Strategy Call with ${mentorName} confirmed for ${bookingDate} at ${bookingSlot}.`,
      'success'
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Intake Banner if not completed */}
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

        {/* HerNetwork Dedicated Navigation Header Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-purple-100 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#4A154B] to-[#be185d] flex items-center justify-center text-white shadow-xs">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                  HerNetwork
                </h1>
                <span className="text-[10px] bg-pink-100 text-[#be185d] px-2 py-0.5 rounded-full font-bold">
                  Sisterhood Hub
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Connect with mentors, participate in discussions, and join live masterclasses.
              </p>
            </div>
          </div>

          {/* Quick Sub-navigation Pills */}
          <div className="flex flex-wrap items-center gap-1 bg-[#faf9fd] p-1.5 rounded-2xl border border-purple-100/60 text-xs font-bold">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeView === 'dashboard'
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'text-gray-700 hover:text-[#4A154B] hover:bg-purple-50/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveView('mentors')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeView === 'mentors'
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'text-gray-700 hover:text-[#4A154B] hover:bg-purple-50/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Find a Mentor</span>
            </button>

            <button
              onClick={() => setActiveView('community')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeView === 'community'
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'text-gray-700 hover:text-[#4A154B] hover:bg-purple-50/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Community</span>
            </button>

            <button
              onClick={() => setActiveView('workshops')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeView === 'workshops'
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'text-gray-700 hover:text-[#4A154B] hover:bg-purple-50/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Workshops & Events</span>
            </button>

            <button
              onClick={() => setActiveView('connections')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                activeView === 'connections'
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'text-gray-700 hover:text-[#4A154B] hover:bg-purple-50/60'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>My Connections</span>
              <span className="text-[10px] bg-purple-200/60 text-[#4A154B] px-1.5 py-0.2 rounded-full font-mono">
                {connections.length}
              </span>
            </button>
          </div>
        </div>

        {/* Main Subview Content Body */}
        {activeView === 'dashboard' && (
          <NetworkDashboardView
            onNavigate={(view) => setActiveView(view)}
            stats={{
              connections: connections.length,
              workshops: workshops.length,
              mentors: mentorsList.length,
              posts: posts.length
            }}
            recentPosts={posts}
            suggestedMentors={mentorsList}
          />
        )}

        {activeView === 'mentors' && (
          <MentorDiscoveryView
            mentors={mentorsList}
            connectedIds={connectedMentorIds}
            onConnect={handleConnectMentor}
            onViewProfile={(m) => setSelectedMentorForProfile(m)}
          />
        )}

        {activeView === 'community' && (
          <CommunityView
            posts={posts}
            onAddPost={handleAddPost}
            onLike={handleToggleLike}
            onComment={handleAddComment}
          />
        )}

        {activeView === 'workshops' && (
          <WorkshopsView
            workshops={workshops}
            onRegister={handleToggleWorkshopRegister}
          />
        )}

        {activeView === 'connections' && (
          <MyConnectionsView
            connections={connections}
            onAccept={handleAcceptConnection}
            onRemove={handleRemoveConnection}
            onViewProfile={(conn) => setSelectedConnectionForProfile(conn)}
            onMessage={(conn) => {
              showToast(
                'Opening Encrypted Direct Chat 💬',
                `Direct conversation window with ${conn.name} initiated.`,
                'info'
              );
            }}
          />
        )}
      </div>

      {/* MODAL 1: Full Mentor Profile Modal */}
      <MentorProfileModal
        mentor={selectedMentorForProfile}
        isOpen={!!selectedMentorForProfile}
        onClose={() => setSelectedMentorForProfile(null)}
        isConnected={Boolean(
          selectedMentorForProfile && connectedMentorIds.includes(selectedMentorForProfile.id)
        )}
        onConnect={(id) => handleConnectMentor(id)}
        onBookSession={(mentor) => {
          setSelectedMentorForProfile(null);
          setSelectedMentorForBooking(mentor);
        }}
      />

      {/* MODAL 2: 1:1 Strategy Session Booking Modal */}
      {selectedMentorForBooking && (
        <Modal
          isOpen={!!selectedMentorForBooking}
          onClose={() => setSelectedMentorForBooking(null)}
          title={`Book 1:1 Strategy Call with ${selectedMentorForBooking.name}`}
          subtitle={`${selectedMentorForBooking.designation} @ ${selectedMentorForBooking.company}`}
        >
          <form onSubmit={handleBookSession} className="space-y-4 text-xs">
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
              <span className="font-bold text-purple-900 block">30-Minute Dedicated Mentorship Session:</span>
              <p className="text-gray-600 text-[11px] mt-0.5">
                Complimentary for HerRise community scholars & entrepreneurs. Conducted over private secure video meet.
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
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none focus:border-[#4A154B]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Available Slot</label>
                <select
                  value={bookingSlot}
                  onChange={(e) => setBookingSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none focus:border-[#4A154B]"
                >
                  <option value="11:00 AM - 11:30 AM IST">11:00 AM - 11:30 AM IST</option>
                  <option value="3:00 PM - 3:30 PM IST">3:00 PM - 3:30 PM IST</option>
                  <option value="4:00 PM - 4:30 PM IST">4:00 PM - 4:30 PM IST</option>
                  <option value="6:00 PM - 6:30 PM IST">6:00 PM - 6:30 PM IST</option>
                  <option value="7:30 PM - 8:00 PM IST">7:30 PM - 8:00 PM IST</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">
                Primary Discussion Topic / Roadblock
              </label>
              <textarea
                rows={3}
                required
                value={bookingTopic}
                onChange={(e) => setBookingTopic(e.target.value)}
                placeholder="What specific challenge or question do you want guidance on?"
                className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none focus:border-[#4A154B]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#4A154B] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#350c36] cursor-pointer shadow-xs transition-all"
            >
              Confirm Mentorship Session
            </button>
          </form>
        </Modal>
      )}

      {/* MODAL 3: Connection Profile View Modal */}
      {selectedConnectionForProfile && (
        <Modal
          isOpen={!!selectedConnectionForProfile}
          onClose={() => setSelectedConnectionForProfile(null)}
          title={selectedConnectionForProfile.name}
          subtitle={selectedConnectionForProfile.profession}
        >
          <div className="space-y-4 text-xs text-gray-700">
            <div className="flex items-center gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
              <img
                src={selectedConnectionForProfile.avatar}
                alt={selectedConnectionForProfile.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-200"
              />
              <div>
                <h4 className="font-extrabold text-sm text-gray-900">{selectedConnectionForProfile.name}</h4>
                <p className="text-xs text-[#4A154B] font-semibold">{selectedConnectionForProfile.profession}</p>
                <p className="text-[11px] text-gray-500">{selectedConnectionForProfile.industry}</p>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {selectedConnectionForProfile.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-[11px]">
              <span className="font-bold text-gray-700 block">About Connection</span>
              <p className="text-gray-600">
                Active member of the HerRise Sisterhood community. Connects on professional growth, venture collaboration, and peer learning.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedConnectionForProfile(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Module Registration Gate */}
      <ModuleRegistrationGate
        module="network"
        isOpen={gateOpen}
        onClose={() => setGateOpen(false)}
        onComplete={handleGateComplete}
      />
    </DashboardLayout>
  );
};
