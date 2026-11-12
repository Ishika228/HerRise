import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Bell,
  Lock,
  Trash2,
  CheckCircle2,
  Save,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Language } from '../../types';

export const SettingsPage: React.FC = () => {
  const { language, setLanguage, logout } = useAuth();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState({
    emailDigest: true,
    workshopReminders: true,
    fundingAlerts: true,
    savingsGoalReminders: true,
    communityReplies: false
  });

  const [privacy, setPrivacy] = useState({
    publicMentorProfile: true,
    anonymousSalaryStats: true,
    twoFactorAuth: false
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    showToast('Language Updated', `Interface set to ${lang.toUpperCase()}`, 'success');
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Preferences Saved', 'Your notification and privacy settings are updated', 'success');
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all demo transactions, cart items, and settings to original defaults?')) {
      localStorage.clear();
      showToast('Demo Data Reset', 'Platform restored to initial sample state. Reloading...', 'info');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100 text-[#4A154B]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900">Platform Preferences & Settings</h1>
              <p className="text-xs text-gray-500">Configure language, notification alerts, and data privacy</p>
            </div>
          </div>
        </div>

        {/* 1. Language Preferences */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-purple-50">
            <Globe className="w-5 h-5 text-[#4A154B]" />
            <h3 className="font-bold text-sm text-gray-900">Platform Language Selection</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                code: 'en' as Language,
                title: 'English',
                subtitle: 'Standard Interface & Resources',
                tag: 'Active'
              },
              {
                code: 'hi' as Language,
                title: 'हिन्दी (Hindi)',
                subtitle: 'हिंदी अनुवाद व संसाधन',
                tag: 'Localized'
              },
              {
                code: 'mr' as Language,
                title: 'मराठी (Marathi)',
                subtitle: 'मराठी भाषा व मार्गदर्शक',
                tag: 'Localized'
              }
            ].map((lang) => (
              <div
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  language === lang.code
                    ? 'border-[#4A154B] bg-purple-50/60 shadow-xs'
                    : 'border-gray-100 hover:border-purple-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-gray-900">{lang.title}</h4>
                    {language === lang.code && <CheckCircle2 className="w-4 h-4 text-[#4A154B]" />}
                  </div>
                  <p className="text-xs text-gray-500">{lang.subtitle}</p>
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full w-max mt-3">
                  {lang.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Notification Preferences */}
        <form onSubmit={handleSavePreferences} className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-purple-50">
            <Bell className="w-5 h-5 text-[#be185d]" />
            <h3 className="font-bold text-sm text-gray-900">Notification Alerts</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#faf9fd] cursor-pointer">
              <div>
                <span className="font-bold text-gray-900 block">Weekly Financial Health Digest</span>
                <span className="text-gray-500 text-[11px]">Receive a summary of budget spending vs emergency savings.</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailDigest}
                onChange={(e) => setNotifications({ ...notifications, emailDigest: e.target.checked })}
                className="w-4 h-4 rounded text-[#4A154B] focus:ring-[#4A154B]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#faf9fd] cursor-pointer">
              <div>
                <span className="font-bold text-gray-900 block">Live Workshop & Masterclass Reminders</span>
                <span className="text-gray-500 text-[11px]">Calendar ping 1 hour before scheduled mentorship events.</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.workshopReminders}
                onChange={(e) => setNotifications({ ...notifications, workshopReminders: e.target.checked })}
                className="w-4 h-4 rounded text-[#4A154B] focus:ring-[#4A154B]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#faf9fd] cursor-pointer">
              <div>
                <span className="font-bold text-gray-900 block">Funding & Grant Application Deadlines</span>
                <span className="text-gray-500 text-[11px]">Alerts for women entrepreneurship cohorts closing soon.</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.fundingAlerts}
                onChange={(e) => setNotifications({ ...notifications, fundingAlerts: e.target.checked })}
                className="w-4 h-4 rounded text-[#4A154B] focus:ring-[#4A154B]"
              />
            </label>
          </div>

          {/* Privacy Controls */}
          <div className="pt-4 border-t border-purple-50">
            <div className="flex items-center gap-2 pb-2 mb-3">
              <Lock className="w-5 h-5 text-indigo-700" />
              <h3 className="font-bold text-sm text-gray-900">Privacy & Security</h3>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#faf9fd] cursor-pointer">
                <div>
                  <span className="font-bold text-gray-900 block">Allow Verified Mentors to View Profile</span>
                  <span className="text-gray-500 text-[11px]">Enables priority matching during career returnship reviews.</span>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.publicMentorProfile}
                  onChange={(e) => setPrivacy({ ...privacy, publicMentorProfile: e.target.checked })}
                  className="w-4 h-4 rounded text-[#4A154B] focus:ring-[#4A154B]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#faf9fd] cursor-pointer">
                <div>
                  <span className="font-bold text-gray-900 block">Contribute to Anonymous Equal Pay Index</span>
                  <span className="text-gray-500 text-[11px]">Shares de-identified salary data to help women negotiate better compensation.</span>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.anonymousSalaryStats}
                  onChange={(e) => setPrivacy({ ...privacy, anonymousSalaryStats: e.target.checked })}
                  className="w-4 h-4 rounded text-[#4A154B] focus:ring-[#4A154B]"
                />
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-purple-50 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#4A154B] hover:bg-[#350c36] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4 text-pink-300" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>

        {/* Demo Data Reset Card */}
        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-gray-900">Reset Demo Platform Data</h4>
            <p className="text-xs text-gray-500">
              Clear added transactions, cart items, published products, and restore initial state.
            </p>
          </div>
          <button
            onClick={handleResetDemoData}
            className="flex items-center gap-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Demo State</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

