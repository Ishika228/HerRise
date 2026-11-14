import React from 'react';
import {
  Star,
  Globe,
  Briefcase,
  CheckCircle2,
  Calendar,
  Video,
  Award,
  Sparkles,
  UserPlus,
  ShieldCheck,
  Clock,
  HeartHandshake
} from 'lucide-react';
import { Modal } from '../../../components/common/Modal';
import { Mentor } from '../../../types';

interface MentorProfileModalProps {
  mentor: Mentor | null;
  isOpen: boolean;
  onClose: () => void;
  onConnect: (mentorId: string) => void;
  onBookSession: (mentor: Mentor) => void;
  isConnected: boolean;
}

export const MentorProfileModal: React.FC<MentorProfileModalProps> = ({
  mentor,
  isOpen,
  onClose,
  onConnect,
  onBookSession,
  isConnected
}) => {
  if (!mentor) return null;

  // Areas where mentor can help, derived from expertise and designation
  const guidanceAreas = [
    `Direct strategic feedback on ${(mentor.expertise && mentor.expertise[0]) || 'career progression'}`,
    `Overcoming real-world hurdles in ${(mentor.expertise && mentor.expertise[1]) || mentor.industry}`,
    `Executive communication, salary calibration & long-term positioning`,
    `Navigating work-life balance and leadership transitions for women`
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${mentor.name} — Mentor Profile`}
      subtitle={`${mentor.designation} at ${mentor.company}`}
    >
      <div className="space-y-6 text-xs text-gray-700">
        {/* Mentor Overview Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-purple-50/60 rounded-3xl border border-purple-100">
          <img
            src={mentor.avatar}
            alt={mentor.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-purple-200 shrink-0 shadow-xs"
          />
          <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
              <h3 className="font-extrabold text-base text-gray-900">{mentor.name}</h3>
              {mentor.badges?.map((badge, idx) => (
                <span
                  key={idx}
                  className="text-[9px] font-bold bg-pink-100 text-[#be185d] px-2 py-0.5 rounded-full"
                >
                  {badge}
                </span>
              ))}
            </div>
            <p className="font-semibold text-xs text-[#4A154B]">{mentor.designation}</p>
            <p className="text-[11px] text-gray-500">{mentor.company} • {mentor.industry}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-[11px]">
              <span className="flex items-center gap-1 font-bold text-gray-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {mentor.rating} ({mentor.sessionsCompleted} sessions)
              </span>
              <span>•</span>
              <span className="text-gray-600 font-medium">
                {mentor.experienceYears} Years Experience
              </span>
            </div>
          </div>
        </div>

        {/* Short Bio / Introduction */}
        <div className="space-y-1.5">
          <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider text-[#4A154B]">
            Professional Introduction & Background
          </h4>
          <p className="leading-relaxed text-gray-700 bg-[#faf9fd] p-3.5 rounded-2xl border border-purple-50">
            {mentor.bio}
          </p>
        </div>

        {/* Skills & Expertise */}
        <div className="space-y-2">
          <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider text-[#4A154B]">
            Core Skills & Specializations
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {mentor.expertise?.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-purple-50 text-purple-900 font-medium text-xs rounded-xl border border-purple-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Areas where mentor can help */}
        <div className="space-y-2">
          <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider text-[#4A154B]">
            How This Mentor Can Support You
          </h4>
          <div className="space-y-2">
            {guidanceAreas.map((area, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Languages & Availability */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-purple-50/50 rounded-2xl border border-purple-100 text-[11px]">
          <div>
            <span className="font-bold text-gray-700 block">Languages Spoken</span>
            <span className="text-gray-600">{mentor.languages?.join(', ')}</span>
          </div>
          <div>
            <span className="font-bold text-gray-700 block">Current Availability</span>
            <span className="text-emerald-700 font-semibold">{mentor.availability}</span>
          </div>
        </div>

        {/* Disclaimer Note */}
        <p className="text-[10px] text-gray-400 italic text-center">
          * Verified mentor roster for HerRise AI sisterhood. Demo profile for platform preview.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => onConnect(mentor.id)}
            disabled={isConnected}
            className={`flex-1 w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isConnected
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                : 'bg-white text-[#4A154B] border-2 border-[#4A154B] hover:bg-purple-50'
            }`}
          >
            {isConnected ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Connection Requested ✓</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Connect with {mentor.name.split(' ')[0]}</span>
              </>
            )}
          </button>

          <button
            onClick={() => onBookSession(mentor)}
            className="flex-1 w-full bg-[#4A154B] hover:bg-[#350c36] text-white py-2.5 px-4 rounded-xl font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Video className="w-4 h-4 text-pink-300" />
            <span>Request a Mentoring Session</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
