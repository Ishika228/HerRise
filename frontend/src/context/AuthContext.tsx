import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Language } from '../types';
import { API_BASE } from '../config/api';
import { observeLocalization } from '../localization';

/**
 * Purge all local storage keys related to a user so they start 100% fresh on re-registration
 */
export const purgeLocalUserStorage = (email: string) => {
  try {
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail) return;
    const userKey = cleanEmail.replace(/[^a-z0-9]/g, '_');

    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (
        key.includes(userKey) ||
        key.includes(cleanEmail) ||
        key.startsWith(`herfinance_${userKey}`) ||
        key.startsWith(`herrise_finance_${userKey}`) ||
        key.startsWith(`herrise_market_${userKey}`) ||
        key.startsWith(`herrise_career_${userKey}`) ||
        key.startsWith(`herrise_user_income_${userKey}`) ||
        key.startsWith(`herrise_resume_${userKey}`)
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));

    // Also remove unscoped legacy caches
    localStorage.removeItem('herrise_finance_profile');
    localStorage.removeItem('herrise_finance_transactions');
    localStorage.removeItem('herrise_finance_setup_completed');
    localStorage.removeItem('hercareer_resume');
  } catch (err) {
    console.warn('[Auth] Error purging local storage:', err);
  }
};

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

  // Always start with English as the default language when anyone opens the webapp
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      localStorage.removeItem('herrise_user_lang');
    } catch {}
  }, []);

  useEffect(() => observeLocalization(language), [language]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('herrise_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('herrise_user_session');
    }
  }, [user]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (lang === 'en') {
      try {
        localStorage.removeItem('herrise_user_lang');
      } catch {}
    } else {
      try {
        localStorage.setItem('herrise_user_lang', lang);
      } catch {}
    }
    if (user) {
      setUser({ ...user, language: lang });
    }
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
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
          monthlyIncome: u.financialProfile?.monthlyIncome || u.monthlyIncome || 0,
          financialProfile: u.financialProfile,
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
    const targetEmail = (data.email || data.resumeData?.email || '').toLowerCase().trim();
    if (targetEmail) {
      // Purge any stale cached state from previous users with this email
      purgeLocalUserStorage(targetEmail);
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name || data.resumeData?.fullName,
          email: targetEmail,
          password: data.password || 'password123',
          phone: data.phone || data.resumeData?.phone,
          location: data.location || data.resumeData?.location,
          preferredLanguage: data.language || language,
          resumeData: data.resumeData,
          goals: data.goals || []
        })
      });
      const json = await res.json();
      if (json.success && json.user) {
        console.log('[Auth] Registered fresh user in MongoDB Atlas:', json.user);
      }
    } catch (e) {
      console.warn('[Auth] Backend register sync notice:', e);
    }

    if (data.resumeData) {
      try {
        localStorage.setItem('hercareer_resume', JSON.stringify(data.resumeData));
      } catch {
        // ignore
      }
    }

    const newUser: UserProfile = {
      id: 'usr-' + Date.now().toString(36),
      name: data.name || data.resumeData?.fullName || 'HerRise Member',
      email: targetEmail || 'user@example.com',
      phone: data.phone || data.resumeData?.phone || '',
      location: data.location || data.resumeData?.location || '',
      language: data.language || language,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      role: data.resumeData?.headline || 'Member',
      goals: data.goals || [],
      education: data.education || (data.resumeData?.education?.[0]?.degree || ''),
      currentStatus: data.currentStatus || 'Active',
      experienceLevel: data.experienceLevel || (data.resumeData?.experience?.length ? `${data.resumeData.experience.length * 2} Years` : '2 Years'),
      skills: data.skills && data.skills.length > 0 ? data.skills : (data.resumeData?.skills || []),
      interests: [],
      bio: data.resumeData?.summary || '',
      completionPercentage: data.resumeData ? 85 : 40,
      resumeData: data.resumeData,
      monthlyIncome: 0,
      financialProfile: {
        monthlyIncome: 0,
        incomeSources: [],
        emergencyFundTargetMonths: 6,
        riskTolerance: 'moderate',
        currency: 'INR'
      },
      careerProfile: {
        targetRole: data.resumeData?.headline || 'Growth Professional',
        status: 'Active',
        experienceYears: data.resumeData?.experience?.length ? data.resumeData.experience.length * 2 : 2,
        education: data.resumeData?.education?.[0]?.degree || 'Degree',
        skills: data.resumeData?.skills || [],
        desiredSalary: 'Competitive',
        workMode: 'Flexible',
        readinessScore: 92,
        matchRolesCount: 12
      }
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    if (user?.email) {
      purgeLocalUserStorage(user.email);
    }
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
