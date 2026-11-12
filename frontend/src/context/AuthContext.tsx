import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Language } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (data: Partial<UserProfile> & { password?: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  completeOnboarding: (goals: string[], background: { education: string; currentStatus: string; experienceLevel: string; skills: string[]; language: Language }) => void;
}

const defaultUserProfile: UserProfile = {
  id: 'usr-101',
  name: 'Ananya Sharma',
  email: 'ananya.sharma@example.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India',
  language: 'en',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  role: 'Aspiring Entrepreneur & Career Returnee',
  goals: [
    'I want to manage my finances',
    'I want to start a business',
    'I want to restart my career',
    'I want to connect with mentors'
  ],
  education: 'Bachelor of Business Administration',
  currentStatus: 'Exploring new ventures & Career Relaunch',
  experienceLevel: '5+ years prior experience',
  skills: ['Digital Marketing', 'Financial Planning', 'D2C Strategy', 'Project Management'],
  interests: ['Sustainable E-commerce', 'Wealth Independence', 'AI Productivity'],
  bio: 'Passionate about sustainable lifestyle products and building personal financial security. Currently preparing to launch a wellness brand while exploring returnship opportunities in growth marketing.',
  businessName: 'VedaBotanica Wellness Labs',
  businessCategory: 'Food & Wellness D2C',
  completionPercentage: 85
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('herrise_user_session');
      if (stored) {
        return JSON.parse(stored);
      }
      return defaultUserProfile;
    } catch {
      return defaultUserProfile;
    }
  });

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem('herrise_user_lang') as Language;
      return savedLang || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('herrise_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('herrise_user_session');
    }
  }, [user]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('herrise_user_lang', lang);
    if (user) {
      setUser({ ...user, language: lang });
    }
  };

  const login = async (email: string): Promise<boolean> => {
    // Frontend demo login simulation
    const updatedUser: UserProfile = {
      ...defaultUserProfile,
      email: email || defaultUserProfile.email,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || defaultUserProfile.name
    };
    setUser(updatedUser);
    return true;
  };

  const register = async (data: Partial<UserProfile> & { password?: string }): Promise<boolean> => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password || 'password123',
          phone: data.phone,
          location: data.location,
          preferredLanguage: data.language || language
        })
      });
      const json = await res.json();
      if (json.success && json.user) {
        console.log('[Auth] Registered user in MongoDB Atlas:', json.user);
      }
    } catch (e) {
      console.warn('[Auth] Backend register sync notice:', e);
    }

    const newUser: UserProfile = {
      ...defaultUserProfile,
      id: 'usr-' + Date.now().toString(36),
      name: data.name || 'HerRise Member',
      email: data.email || 'user@example.com',
      phone: data.phone || '+91 90000 00000',
      location: data.location || 'India',
      language: data.language || language,
      completionPercentage: 40,
      goals: []
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, ...data };
    });
  };

  const completeOnboarding = (
    goals: string[],
    background: {
      education: string;
      currentStatus: string;
      experienceLevel: string;
      skills: string[];
      language: Language;
    }
  ) => {
    setUser((prev) => {
      const base = prev || defaultUserProfile;
      const updated: UserProfile = {
        ...base,
        goals,
        education: background.education,
        currentStatus: background.currentStatus,
        experienceLevel: background.experienceLevel,
        skills: background.skills,
        language: background.language,
        completionPercentage: 90
      };
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        language,
        setLanguage,
        login,
        register,
        logout,
        updateProfile,
        completeOnboarding
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

