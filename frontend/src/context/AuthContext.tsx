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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('herrise_user_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name?.includes('Ananya') || parsed?.email?.includes('ananya')) {
          localStorage.removeItem('herrise_user_session');
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
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

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (json.success && json.user) {
        const u = json.user;
        const loggedUser: UserProfile = {
          id: u._id || u.id || 'usr-' + Date.now().toString(36),
          name: u.name || email.split('@')[0],
          email: u.email || email,
          phone: u.phone || '',
          location: u.location || '',
          language: (u.preferredLanguage as Language) || language,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
          role: u.professionalStatus || 'Member',
          goals: u.goals || [],
          education: u.education || '',
          currentStatus: u.professionalStatus || '',
          experienceLevel: u.experienceYears ? `${u.experienceYears} Years` : '',
          skills: u.skills || [],
          interests: [],
          bio: '',
          completionPercentage: u.profileCompleted || 50,
          careerProfile: u.careerProfile,
          businessProfile: u.businessProfile,
          fundProfile: u.fundProfile,
          marketProfile: u.marketProfile,
          learnProfile: u.learnProfile,
          networkProfile: u.networkProfile
        };
        setUser(loggedUser);
        return true;
      }
    } catch (e) {
      console.warn('[Auth] Remote login notice:', e);
    }

    const simpleUser: UserProfile = {
      id: 'usr-' + Date.now().toString(36),
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      phone: '',
      location: '',
      language,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      role: 'Member',
      goals: [],
      education: '',
      currentStatus: '',
      experienceLevel: '',
      skills: [],
      interests: [],
      bio: '',
      completionPercentage: 50
    };
    setUser(simpleUser);
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
      id: 'usr-' + Date.now().toString(36),
      name: data.name || 'HerRise Member',
      email: data.email || 'user@example.com',
      phone: data.phone || '',
      location: data.location || '',
      language: data.language || language,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      role: 'Member',
      goals: [],
      education: '',
      currentStatus: '',
      experienceLevel: '',
      skills: [],
      interests: [],
      bio: '',
      completionPercentage: 40
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('herrise_user_session');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) {
        return {
          id: 'usr-' + Date.now().toString(36),
          name: data.name || 'Member',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          language: data.language || language,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
          role: 'Member',
          goals: [],
          education: '',
          currentStatus: '',
          experienceLevel: '',
          skills: [],
          interests: [],
          bio: '',
          completionPercentage: 50,
          ...data
        };
      }
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
      const base: UserProfile = prev || {
        id: 'usr-' + Date.now().toString(36),
        name: 'Member',
        email: '',
        phone: '',
        location: '',
        language: background.language,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        role: 'Member',
        goals: [],
        education: '',
        currentStatus: '',
        experienceLevel: '',
        skills: [],
        interests: [],
        bio: '',
        completionPercentage: 50
      };
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
