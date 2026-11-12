import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Rocket,
  Award,
  Sparkles,
  Save,
  CheckCircle2,
  Camera,
  Plus
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || 'Ananya Sharma',
    email: user?.email || 'ananya.sharma@example.com',
    phone: user?.phone || '+91 98765 43210',
    location: user?.location || 'Bengaluru, Karnataka',
    role: user?.role || 'Growth Strategist & Aspiring Founder',
    education: user?.education || 'Bachelor of Business Administration',
    currentStatus: user?.currentStatus || 'On Career Sabbatical / Exploring Ventures',
    bio: user?.bio || 'Building financial security while launching a sustainable wellness brand.',
    businessName: user?.businessName || 'VedaBotanica Wellness Labs',
    businessCategory: user?.businessCategory || 'Food & Wellness D2C',
    skills: user?.skills || ['Digital Marketing', 'Financial Planning', 'D2C Strategy', 'Project Management'],
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'
  });

  const [newSkillInput, setNewSkillInput] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      completionPercentage: 95
    });
    showToast('Profile Updated', 'Your details and skills have been saved successfully', 'success');
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim() || formData.skills.includes(newSkillInput.trim())) return;
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkillInput.trim()]
    }));
    setNewSkillInput('');
    showToast('Skill Added', `${newSkillInput} added to your profile`, 'info');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={formData.avatar}
                alt={formData.name}
                className="w-20 h-20 rounded-3xl object-cover border-4 border-purple-100 shadow-md"
              />
              <button
                type="button"
                onClick={() => showToast('Avatar Upload', 'Simulated photo upload dialog opened', 'info')}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#4A154B] text-white hover:bg-[#350c36] cursor-pointer shadow-sm"
                title="Change picture"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-gray-900">{formData.name}</h1>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  Verified Member
                </span>
              </div>
              <p className="text-xs text-[#4A154B] font-semibold">{formData.role}</p>
              <p className="text-[11px] text-gray-500">{formData.location}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-gray-500 block">Profile Strength</span>
            <span className="text-2xl font-black text-[#4A154B]">{user?.completionPercentage || 95}%</span>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl border border-purple-100 shadow-xs space-y-6 text-xs">
          <div className="flex justify-between items-center pb-3 border-b border-purple-50">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">1. Personal & Contact Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl outline-none focus:border-[#4A154B]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl outline-none focus:border-[#4A154B]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">Mobile Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl outline-none focus:border-[#4A154B]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase mb-1">City / Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl outline-none focus:border-[#4A154B]"
              />
            </div>
          </div>

          {/* Career & Venture Details */}
          <div className="pt-4 border-t border-purple-50">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">2. Career & Venture Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Current Status</label>
                <input
                  type="text"
                  value={formData.currentStatus}
                  onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl outline-none focus:border-[#4A154B]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Highest Education</label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl outline-none focus:border-[#4A154B]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Micro-Enterprise / Brand Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl outline-none focus:border-[#4A154B]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Business Industry / Category</label>
                <input
                  type="text"
                  value={formData.businessCategory}
                  onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl outline-none focus:border-[#4A154B]"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block font-bold text-gray-700 uppercase mb-1">Founder / Professional Bio</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-3 bg-gray-50 border rounded-xl outline-none leading-relaxed focus:border-[#4A154B]"
            />
          </div>

          {/* Skills Pills */}
          <div>
            <label className="block font-bold text-gray-700 uppercase mb-2">Skills & Core Competencies</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#4A154B] font-bold border border-purple-200"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-600 font-bold ml-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Add another skill (e.g. SEO, GST)..."
                className="flex-1 px-3 py-1.5 bg-gray-50 border rounded-xl text-xs outline-none"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-[#4A154B] text-white px-3.5 py-1.5 rounded-xl font-bold hover:bg-[#350c36] cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-purple-50 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#4A154B] hover:bg-[#350c36] text-white px-8 py-3 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-pink-300" />
              <span>Save Profile Updates</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

