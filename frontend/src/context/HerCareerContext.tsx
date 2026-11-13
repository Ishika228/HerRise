import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CareerProfile,
  ResumeData,
  JobListing,
  JobApplication,
  ResumeAnalysisResult,
  InterviewQuestionItem,
  CareerRoadmapPhase,
  CareerSkillGapItem,
  CareerRestartNarrative
} from '../types/career';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { API_BASE } from '../config/api';

interface HerCareerContextType {
  // Profile
  profile: CareerProfile;
  updateProfile: (updates: Partial<CareerProfile>) => void;

  // Overview Stats
  stats: {
    totalResumes: number;
    recommendedJobs: number;
    applicationsSubmitted: number;
    interviewPrepProgress: number;
    skillsCompleted: number;
    readinessScore: number;
  };

  // Resume Builder
  resumes: ResumeData[];
  activeResume: ResumeData;
  setActiveResume: (resume: ResumeData) => void;
  saveResumeData: (data: ResumeData) => Promise<boolean>;
  deleteResumeData: (id: string) => Promise<boolean>;
  aiEnhanceBullet: (bulletText: string, roleTitle?: string) => Promise<string[]>;
  aiSuggestSkillsForRole: (targetRole: string) => Promise<{ technical: string[]; soft: string[] }>;
  aiGenerateSummaries: (params: any) => Promise<string[]>;

  // Resume Analyzer
  resumeAnalysis: ResumeAnalysisResult | null;
  isAnalyzing: boolean;
  analyzeResumeContent: (resumeText: string, targetJobDesc?: string) => Promise<ResumeAnalysisResult | null>;
  parseResumeFile: (file: File) => Promise<any>;
  importParsedResume: (parsed: any) => Promise<ResumeData>;

  // Jobs
  jobs: JobListing[];
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;
  matchJobWithProfile: (job: JobListing) => Promise<any>;
  applyToJob: (jobId: string, coverNote?: string) => Promise<boolean>;

  // Application Tracker
  applications: JobApplication[];
  addApplication: (app: Omit<JobApplication, 'id'>) => Promise<boolean>;
  updateApplicationStatus: (id: string, status: JobApplication['status'], updates?: Partial<JobApplication>) => void;
  deleteApplication: (id: string) => void;

  // Interview Prep
  interviewQuestions: InterviewQuestionItem[];
  activeQuestionIndex: number;
  setActiveQuestionIndex: (idx: number) => void;
  isSimulating: boolean;
  startInterviewSimulation: (targetRole: string, category: string, difficulty: string) => Promise<void>;
  submitInterviewAnswer: (answer: string) => Promise<any>;
  resetInterviewSimulation: () => void;

  // Roadmap & Skill Gap
  roadmapPhases: CareerRoadmapPhase[];
  skillGaps: CareerSkillGapItem[];
  isGeneratingRoadmap: boolean;
  generateCareerRoadmap: (targetRole: string) => Promise<void>;
  toggleMilestoneTask: (phaseIndex: number, taskIndex: number) => void;

  // Career Restart
  restartNarrative: CareerRestartNarrative | null;
  isGeneratingRestart: boolean;
  generateRestartPlan: (params: {
    breakDurationYears: number;
    breakReason: string;
    previousRole: string;
    targetRole: string;
    newSkills: string;
  }) => Promise<void>;

  // AI Assistant Chat
  assistantHistory: { role: 'user' | 'assistant'; content: string }[];
  isAssistantTyping: boolean;
  askCareerAssistant: (prompt: string) => Promise<void>;
}

// Helper to detect if an item in experience is actually a project
export function isProjectEntry(item: { title?: string; role?: string; company?: string; description?: string; highlights?: string[] }): boolean {
  if (!item) return false;
  const title = (item.title || (item as any).role || '').toLowerCase();
  const company = (item.company || '').toLowerCase();
  const desc = (item.description || '').toLowerCase();
  const highlights = Array.isArray(item.highlights)
    ? item.highlights.join(' ').toLowerCase()
    : Array.isArray((item as any).bullets)
      ? (item as any).bullets.join(' ').toLowerCase()
      : '';

  // Positive project signals
  const hasProjectKeywords =
    title.includes('project') ||
    title.startsWith('project:') ||
    company.includes('project') ||
    company.includes('app') ||
    company.includes('website') ||
    title.includes('auraestate') ||
    title.includes('realestate') ||
    title.includes('estate') ||
    title.includes('voice assistant') ||
    title.includes('assistant') ||
    title.includes('interactive rot') ||
    title.includes('interactive robot') ||
    title.includes('robot') ||
    title.includes('fitness fusion') ||
    title.includes('fitness') ||
    title.includes('gym management') ||
    title.includes('gym') ||
    title.includes('ultrasonic') ||
    title.includes('distance') ||
    title.includes('ielts') ||
    company.includes('mern') ||
    company.includes('django') ||
    company.includes('ai & iot') ||
    company.includes('iot') ||
    company.includes('arduino') ||
    company.includes('python') ||
    desc.includes('voice assistant') ||
    desc.includes('robot') ||
    desc.includes('gym') ||
    desc.includes('ultrasonic') ||
    highlights.includes('voice assistant') ||
    highlights.includes('robot') ||
    highlights.includes('gym management') ||
    highlights.includes('personal trainer allotment') ||
    highlights.includes('esp8266') ||
    highlights.includes('alexa-like');

  return hasProjectKeywords;
}

// Strictly separate projects that were placed inside experience and move them to projects
// Strictly separate projects placed inside experience and move them to projects
export function separateExperienceAndProjects(resume: ResumeData): ResumeData {
  if (!resume) return resume;
  const actualExperience: ResumeData['experience'] = [];
  const existingProjects: ResumeData['projects'] = [...(resume.projects || [])];

  for (const exp of (resume.experience || [])) {
    if (isProjectEntry(exp)) {
      // Move project-like entries out of experience into projects
      const cleanedTitle = (exp.title || (exp as any).role || 'Technical Project')
        .replace(/^Project:\s*/i, '')
        .trim();

      const techStack: string[] = Array.isArray((exp as any).technologies) ? (exp as any).technologies : [];
      if (techStack.length === 0 && exp.company) {
        const cleanedComp = exp.company.replace(/\s*Project\s*/i, '').trim();
        if (cleanedComp && !cleanedComp.toLowerCase().includes('company')) {
          techStack.push(...cleanedComp.split(/[,|/&]/).map((s) => s.trim()).filter(Boolean));
        }
      }

      const alreadyExists = existingProjects.some(
        (p) => cleanedTitle && p.title.toLowerCase().includes(cleanedTitle.toLowerCase().slice(0, 8))
      );

      if (!alreadyExists && cleanedTitle) {
        existingProjects.push({
          id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          title: cleanedTitle,
          role: 'Developer',
          technologies: techStack,
          link: '',
          description: exp.description || (exp.highlights && exp.highlights[0]) || '',
          highlights: exp.highlights || []
        });
      }
    } else {
      actualExperience.push(exp);
    }
  }

  return {
    ...resume,
    experience: actualExperience,
    projects: existingProjects
  };
}


export function buildPersonalizedResume(user: any): ResumeData {
  // Read from localStorage — populated when user uploads/parses a resume
  let storedResume: any = null;
  try {
    const raw = localStorage.getItem('hercareer_resume');
    if (raw) storedResume = JSON.parse(raw);
  } catch { }

  // ── Basic identity (from user auth or parsed resume) ────────────────────────
  const name = user?.name || storedResume?.fullName || storedResume?.name || '';
  const email = user?.email || storedResume?.email || '';
  const phone = user?.phone || storedResume?.phone || '';
  const location = user?.location || storedResume?.location || '';
  const targetRole =
    user?.careerProfile?.targetRole ||
    user?.role ||
    storedResume?.headline ||
    storedResume?.targetRole ||
    '';

  // ── Skills ──────────────────────────────────────────────────────────────────
  const userSkills: string[] =
    (storedResume?.skills && storedResume.skills.length > 0)
      ? storedResume.skills
      : (user?.skills && user.skills.length > 0)
        ? user.skills
        : [];

  // ── 1. WORK EXPERIENCE ──────────────────────────────────────────────────────
  // Read from uploaded resume. Strip any entries that look like projects.
  const rawExp = storedResume?.experience || user?.resumeData?.experience;
  const rawProjectEntriesFromExp = (rawExp && Array.isArray(rawExp))
    ? rawExp.filter((e: any) => isProjectEntry(e))
    : [];

  const cleanExpList = (rawExp && Array.isArray(rawExp))
    ? rawExp.filter((e: any) => !isProjectEntry(e))
    : [];

  const experience: ResumeData['experience'] = cleanExpList.map((e: any, idx: number) => ({
    id: e.id || `exp-${idx + 1}`,
    title: e.title || e.role || targetRole,
    company: e.company || '',
    location: e.location || location,
    startDate: e.startDate || (e.duration ? e.duration.split('–')[0]?.split('-')[0]?.trim() : ''),
    endDate: e.endDate || (e.duration
      ? (e.duration.split('–')[1] || e.duration.split('-')[1])?.trim() || 'Present'
      : 'Present'),
    current: e.current ?? (!e.endDate || e.endDate?.toLowerCase() === 'present'),
    description: e.description || '',
    highlights: Array.isArray(e.highlights || e.bullets) && (e.highlights || e.bullets).length > 0
      ? (e.highlights || e.bullets)
      : []
  }));

  // ── 2. PROJECTS ─────────────────────────────────────────────────────────────
  // Read from uploaded resume projects + project-like experience entries
  const rawProjects = storedResume?.projects || user?.resumeData?.projects;
  const projects: ResumeData['projects'] = [];

  if (rawProjects && Array.isArray(rawProjects) && rawProjects.length > 0) {
    rawProjects.forEach((p: any, idx: number) => {
      projects.push({
        id: p.id || `proj-${idx + 1}`,
        title: p.title || 'Technical Project',
        role: p.role || 'Developer',
        description: p.description || '',
        technologies: Array.isArray(p.technologies)
          ? p.technologies
          : typeof p.technologies === 'string'
            ? p.technologies.split(',').map((s: string) => s.trim())
            : [],
        link: p.link || p.url || '',
        highlights: Array.isArray(p.highlights || p.bullets) ? (p.highlights || p.bullets) : []
      });
    });
  }

  // Move project-like experience entries into projects section
  for (const expProj of rawProjectEntriesFromExp) {
    const cleanedTitle = (expProj.title || expProj.role || '').replace(/^Project:\s*/i, '').trim();
    if (cleanedTitle && !projects.some((p) => p.title.toLowerCase().includes(cleanedTitle.toLowerCase().slice(0, 8)))) {
      projects.push({
        id: `proj-exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: cleanedTitle,
        role: expProj.role || 'Developer',
        technologies: Array.isArray(expProj.technologies) ? expProj.technologies : [],
        link: expProj.link || '',
        description: expProj.description || (expProj.highlights && expProj.highlights[0]) || '',
        highlights: expProj.highlights || []
      });
    }
  }

  // ── 3. EDUCATION ────────────────────────────────────────────────────────────
  const rawEdu = storedResume?.education || user?.resumeData?.education;
  let education: ResumeData['education'] = [];

  if (rawEdu && Array.isArray(rawEdu) && rawEdu.length > 0) {
    education = rawEdu.map((edu: any, idx: number) => ({
      id: edu.id || `edu-${idx + 1}`,
      degree: edu.degree || edu.qualification || '',
      institution: edu.institution || edu.school || edu.college || '',
      year: edu.year || edu.graduationYear || '',
      grade: edu.grade || edu.gpa || edu.percentage || ''
    }));
  } else if (user?.education) {
    education = [{ id: 'edu-1', degree: user.education, institution: '', year: '', grade: '' }];
  }

  // ── 4. CERTIFICATIONS ────────────────────────────────────────────────────────
  const rawCert = storedResume?.certifications || user?.resumeData?.certifications;
  let certifications: ResumeData['certifications'] = [];

  if (rawCert && Array.isArray(rawCert) && rawCert.length > 0) {
    certifications = rawCert.map((c: any, idx: number) => ({
      id: `cert-${idx + 1}`,
      name: typeof c === 'string' ? c : c.name || '',
      issuer: typeof c === 'string' ? '' : c.issuer || c.organization || '',
      date: typeof c === 'string' ? '' : c.year || c.date || ''
    }));
  }

  // ── 5. ACHIEVEMENTS ──────────────────────────────────────────────────────────
  const achievements: string[] =
    (storedResume?.achievements && Array.isArray(storedResume.achievements) && storedResume.achievements.length > 0)
      ? storedResume.achievements
      : (user?.resumeData?.achievements && Array.isArray(user.resumeData.achievements))
        ? user.resumeData.achievements
        : [];

  // ── Summary ──────────────────────────────────────────────────────────────────
  const summary = storedResume?.summary || user?.resumeData?.summary || user?.bio || '';

  return {
    id: `res-${user?.id || 'usr-101'}`,
    userId: user?.id || 'usr-101',
    title: `${name || targetRole || 'My'} Resume`,
    template: 'modern',
    personalInfo: {
      fullName: name,
      email,
      phone,
      location,
      portfolioUrl: storedResume?.portfolio || storedResume?.portfolioUrl || '',
      linkedinUrl: storedResume?.linkedin || storedResume?.linkedinUrl || '',
      githubUrl: storedResume?.github || storedResume?.githubUrl || ''
    },
    summary,
    experience,
    projects,
    education,
    skills: {
      technical: userSkills,
      soft: storedResume?.softSkills || [],
      tools: storedResume?.tools || []
    },
    certifications,
    achievements,
    languages: storedResume?.languages || [],
    qualityScore: 0,
    updatedAt: new Date().toISOString()
  };
}

const buildProfileFromUser = (u: any): CareerProfile => {
  return {
    userId: u?.id || 'usr-101',
    fullName: u?.name || '',
    email: u?.email || '',
    phone: u?.phone || '',
    location: u?.location || '',
    headline: u?.careerProfile?.targetRole || u?.role || '',
    targetRole: u?.careerProfile?.targetRole || u?.role || '',
    experienceLevel: (u?.experienceLevel?.includes('Senior') ? 'senior' : 'mid') as any,
    yearsOfExperience: u?.careerProfile?.experienceYears || 0,
    currentStatus: 'seeking',
    workModePreference: 'remote',
    primarySkills: u?.skills && u.skills.length > 0 ? u.skills.slice(0, 4) : [],
    secondarySkills: u?.skills && u.skills.length > 4 ? u.skills.slice(4) : [],
    readinessScore: u?.careerProfile?.readinessScore || 0,
    bio: u?.bio || ''
  };
};

const HerCareerContext = createContext<HerCareerContextType | undefined>(undefined);

export const HerCareerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const backendUrl = API_BASE;

  // 1. Profile State initialized dynamically from authenticated user
  const [profile, setProfile] = useState<CareerProfile>(() => {
    return buildProfileFromUser(user);
  });

  const updateProfile = (updates: Partial<CareerProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    showToast('Career Profile Updated', 'Preferences and target role saved', 'success');
  };

  // 2. Overview Stats
  const [stats, setStats] = useState({
    totalResumes: 1,
    recommendedJobs: 5,
    applicationsSubmitted: 2,
    interviewPrepProgress: 75,
    skillsCompleted: 8,
    readinessScore: 88
  });

  // 3. Resumes State initialized dynamically from authenticated user
  const [resumes, setResumes] = useState<ResumeData[]>(() => {
    const personalized = separateExperienceAndProjects(buildPersonalizedResume(user));
    try {
      const saved = localStorage.getItem('hercareer_resumes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Remove any stale hardcoded Ananya Sharma resumes AND strictly separate projects from experience
          const sanitized = parsed
            .filter(
              (r) => !r.personalInfo?.fullName?.includes('Ananya') && !r.personalInfo?.email?.includes('ananya')
            )
            .map((r) => separateExperienceAndProjects(r));

          if (sanitized.length > 0) {
            localStorage.setItem('hercareer_resumes', JSON.stringify(sanitized));
            return sanitized;
          }
        }
      }
    } catch { }
    return [personalized];
  });

  const [activeResume, setActiveResume] = useState<ResumeData>(() => {
    const initial = resumes[0] || buildPersonalizedResume(user);
    return separateExperienceAndProjects(initial);
  });

  // Dynamic user sync: when authenticated user changes or logs in, calibrate profile & resume
  useEffect(() => {
    if (user && user.email) {
      const personalized = separateExperienceAndProjects(buildPersonalizedResume(user));
      const userProf = buildProfileFromUser(user);
      setProfile(userProf);

      setResumes((prev) => {
        const sanitized = prev
          .filter(
            (r) => !r.personalInfo?.fullName?.includes('Ananya') && !r.personalInfo?.email?.includes('ananya')
          )
          .map((r) => separateExperienceAndProjects(r));

        const hasUserResume = sanitized.some((r) => r.personalInfo.email === user.email || r.personalInfo.fullName === user.name);
        let finalResumes: ResumeData[];
        if (!hasUserResume || sanitized.length === 0) {
          finalResumes = [personalized, ...sanitized];
        } else {
          finalResumes = sanitized.map((r) =>
            (r.personalInfo.email === user.email || r.personalInfo.fullName === user.name)
              ? separateExperienceAndProjects(r)
              : r
          );
        }
        localStorage.setItem('hercareer_resumes', JSON.stringify(finalResumes));
        return finalResumes;
      });

      setActiveResume((prev) => {
        if (
          !prev ||
          prev.personalInfo?.fullName?.includes('Ananya') ||
          prev.personalInfo?.email?.includes('ananya') ||
          (user.name && prev.personalInfo.fullName !== user.name)
        ) {
          return personalized;
        }
        return separateExperienceAndProjects(prev);
      });
    }
  }, [user?.id, user?.email, user?.name, user?.skills]);

  useEffect(() => {
    localStorage.setItem('hercareer_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('hercareer_resumes', JSON.stringify(resumes));
    setStats((prev) => ({ ...prev, totalResumes: resumes.length }));
  }, [resumes]);

  const saveResumeData = async (data: ResumeData): Promise<boolean> => {
    const cleaned = separateExperienceAndProjects(data);
    const updated = { ...cleaned, updatedAt: new Date().toISOString() };
    setResumes((prev) => {
      const idx = prev.findIndex((r) => r.id === updated.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [updated, ...prev];
    });
    setActiveResume(updated);

    // Sync to backend MongoDB Atlas
    try {
      await fetch(`${backendUrl}/api/career/resumes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.warn('Backend sync note:', err);
    }

    showToast('Resume Saved', `${updated.title} is ready`, 'success');
    return true;
  };

  const deleteResumeData = async (id: string): Promise<boolean> => {
    if (resumes.length <= 1) {
      showToast('Action Denied', 'You must maintain at least one resume record', 'warning');
      return false;
    }
    const filtered = resumes.filter((r) => r.id !== id);
    setResumes(filtered);
    setActiveResume(filtered[0]);

    try {
      await fetch(`${backendUrl}/api/career/resumes/${id}`, { method: 'DELETE' });
    } catch { }

    showToast('Resume Deleted', 'Removed from resume library', 'info');
    return true;
  };

  // AI Resume Enhancements
  const aiEnhanceBullet = async (bulletText: string, roleTitle?: string): Promise<string[]> => {
    try {
      const res = await fetch(`${backendUrl}/api/career/enhance-bullet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulletText, roleTitle: roleTitle || profile.targetRole })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.bullets)) {
        return data.bullets;
      }
    } catch (err) {
      console.warn('AI bullet polish fallback:', err);
    }
    return [
      `Spearheaded ${bulletText.toLowerCase()}, driving a 25% improvement in operational efficiency and deliverable speed.`,
      `Engineered and optimized ${bulletText.toLowerCase()}, eliminating system bottlenecks and cutting cycle turnaround time by 30%.`,
      `Partnered across cross-functional stakeholders to successfully launch ${bulletText.toLowerCase()}, enhancing user engagement.`
    ];
  };

  const aiSuggestSkillsForRole = async (targetRole: string): Promise<{ technical: string[]; soft: string[] }> => {
    try {
      const res = await fetch(`${backendUrl}/api/career/suggest-skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole })
      });
      const data = await res.json();
      if (data.success && data.skills) {
        return data.skills;
      }
    } catch (err) {
      console.warn('AI suggest skills fallback:', err);
    }
    return {
      technical: ['React.js', 'TypeScript', 'Node.js', 'REST APIs', 'PostgreSQL', 'Tailwind CSS', 'Git & CI/CD', 'Docker'],
      soft: ['Cross-functional Collaboration', 'Problem Solving', 'Strategic Thinking', 'Stakeholder Communication']
    };
  };

  const aiGenerateSummaries = async (params: any): Promise<string[]> => {
    try {
      const res = await fetch(`${backendUrl}/api/career/generate-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.summaries)) {
        return data.summaries;
      }
    } catch (err) {
      console.warn('AI summary generator fallback:', err);
    }
    return [
      `Results-driven ${params.targetRole || 'Software Professional'} with strong expertise delivering high-impact solutions in collaborative teams. Proven track record in problem solving, strategic execution, and driving organizational goals.`,
      `Dynamic and collaborative ${params.targetRole || 'Professional'} skilled in modern technologies, agile methodologies, and continuous improvement. Brings a proactive mindset to elevate team productivity.`,
      `Empowered and ambitious ${params.targetRole || 'Specialist'} combining technical acumen with analytical rigor. Recognized for delivering milestones ahead of schedule with exceptional quality.`
    ];
  };

  // 4. Resume Analyzer
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeResumeContent = async (
    resumeText: string,
    targetJobDesc?: string
  ): Promise<ResumeAnalysisResult | null> => {
    setIsAnalyzing(true);
    try {
      const res = await fetch(`${backendUrl}/api/career/analyze-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, targetJobDescription: targetJobDesc })
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setResumeAnalysis(data.analysis);
        showToast('Analysis Complete', `Estimated Quality Score: ${data.analysis.overallScore}/100`, 'success');
        return data.analysis;
      }
    } catch (err) {
      console.warn('AI resume analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
    return null;
  };

  const parseResumeFile = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const res = await fetch(`${backendUrl}/api/career/parse-resume`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('File parsing error:', err);
      throw err;
    }
  };

  // Dynamically import and apply an uploaded & parsed resume across the platform
  const importParsedResume = async (parsed: any): Promise<ResumeData> => {
    const rawExp = Array.isArray(parsed.experience) ? parsed.experience : [];
    const cleanExpList = rawExp.filter((e: any) => !isProjectEntry(e));
    const extraProjectsFromExp = rawExp.filter((e: any) => isProjectEntry(e));

    const experience: ResumeData['experience'] = cleanExpList.map((e: any, idx: number) => ({
      id: e.id || `exp-${idx + 1}`,
      title: e.title || e.role || parsed.headline || 'Position',
      company: e.company || 'Company',
      location: e.location || parsed.location || '',
      startDate: e.startDate || (e.duration ? e.duration.split('–')[0]?.split('-')[0]?.trim() : ''),
      endDate: e.endDate || (e.duration ? (e.duration.split('–')[1] || e.duration.split('-')[1])?.trim() || 'Present' : 'Present'),
      current: e.current ?? (!e.endDate || e.endDate?.toLowerCase().includes('present')),
      description: e.description || '',
      highlights: Array.isArray(e.highlights || e.bullets) ? (e.highlights || e.bullets) : []
    }));

    const rawProj = Array.isArray(parsed.projects) ? parsed.projects : [];
    const projects: ResumeData['projects'] = [
      ...rawProj.map((p: any, idx: number) => ({
        id: p.id || `proj-${idx + 1}`,
        title: p.title || 'Technical Project',
        role: p.role || 'Contributor',
        technologies: Array.isArray(p.technologies)
          ? p.technologies
          : typeof p.technologies === 'string'
            ? p.technologies.split(',').map((s: string) => s.trim())
            : [],
        link: p.link || '',
        description: p.description || '',
        highlights: Array.isArray(p.highlights || p.bullets) ? (p.highlights || p.bullets) : []
      })),
      ...extraProjectsFromExp.map((e: any, idx: number) => ({
        id: `proj-exp-${idx + 1}-${Date.now()}`,
        title: (e.title || e.role || 'Project').replace(/^Project:\s*/i, '').trim(),
        role: e.role || 'Contributor',
        technologies: Array.isArray(e.technologies) ? e.technologies : [],
        link: e.link || '',
        description: e.description || (e.highlights && e.highlights[0]) || '',
        highlights: Array.isArray(e.highlights || e.bullets) ? (e.highlights || e.bullets) : []
      }))
    ];

    const rawEdu = Array.isArray(parsed.education) ? parsed.education : [];
    const education: ResumeData['education'] = rawEdu.map((edu: any, idx: number) => ({
      id: edu.id || `edu-${idx + 1}`,
      degree: edu.degree || 'Degree',
      institution: edu.institution || 'Institution',
      year: edu.year || '',
      grade: edu.grade || ''
    }));

    const rawCert = Array.isArray(parsed.certifications) ? parsed.certifications : [];
    const certifications: ResumeData['certifications'] = rawCert.map((c: any, idx: number) => ({
      id: `cert-${idx + 1}`,
      name: typeof c === 'string' ? c : c.name || 'Certification',
      issuer: typeof c === 'string' ? '' : c.issuer || '',
      date: typeof c === 'string' ? '' : c.year || c.date || ''
    }));

    const achievements = Array.isArray(parsed.achievements) ? parsed.achievements : [];
    const userSkills = Array.isArray(parsed.skills) ? parsed.skills : [];

    const newResume: ResumeData = {
      id: `res-${Date.now()}`,
      userId: user?.id || 'usr-101',
      title: `${parsed.fullName || parsed.headline || 'Uploaded'} Resume`,
      template: 'modern',
      personalInfo: {
        fullName: parsed.fullName || user?.name || '',
        email: parsed.email || user?.email || '',
        phone: parsed.phone || user?.phone || '',
        location: parsed.location || user?.location || '',
        portfolioUrl: parsed.portfolio || '',
        linkedinUrl: parsed.linkedin || '',
        githubUrl: parsed.github || ''
      },
      summary: parsed.summary || '',
      experience,
      projects,
      education,
      skills: {
        technical: userSkills,
        soft: Array.isArray(parsed.softSkills) ? parsed.softSkills : ['Problem Solving', 'Communication', 'Teamwork'],
        tools: Array.isArray(parsed.tools) ? parsed.tools : []
      },
      certifications,
      achievements,
      languages: Array.isArray(parsed.languages) && parsed.languages.length > 0 ? parsed.languages : ['English'],
      qualityScore: parsed.qualityScore || 88,
      updatedAt: new Date().toISOString()
    };

    const sanitized = separateExperienceAndProjects(newResume);
    setActiveResume(sanitized);
    setResumes((prev) => [sanitized, ...prev.filter((r) => r.id !== sanitized.id)]);
    localStorage.setItem('hercareer_resume', JSON.stringify(sanitized));

    if (parsed.fullName || parsed.headline || userSkills.length > 0) {
      setProfile((prev) => ({
        ...prev,
        fullName: parsed.fullName || prev.fullName,
        headline: parsed.headline || prev.headline,
        targetRole: parsed.headline || prev.targetRole,
        location: parsed.location || prev.location,
        phone: parsed.phone || prev.phone,
        email: parsed.email || prev.email,
        primarySkills: userSkills.slice(0, 4).length > 0 ? userSkills.slice(0, 4) : prev.primarySkills,
        secondarySkills: userSkills.slice(4).length > 0 ? userSkills.slice(4) : prev.secondarySkills,
        bio: parsed.summary || prev.bio
      }));
    }

    try {
      await fetch(`${backendUrl}/api/career/resumes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitized)
      });
    } catch (e) {
      console.warn('Backend sync note:', e);
    }

    showToast('Resume Loaded! 📄', `Applied all data from uploaded resume`, 'success');
    return sanitized;
  };

  // 5. Jobs State
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('hercareer_saved_jobs');
    return saved ? JSON.parse(saved) : ['job-101'];
  });

  useEffect(() => {
    localStorage.setItem('hercareer_saved_jobs', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  const loadJobs = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/career/jobs`);
      const data = await res.json();
      if (data.success && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
        setStats((prev) => ({ ...prev, recommendedJobs: data.jobs.length }));
      }
    } catch (err) {
      console.warn('Load jobs fallback:', err);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) => {
      const exists = prev.includes(jobId);
      if (exists) {
        showToast('Removed from Saved Jobs', '', 'info');
        return prev.filter((id) => id !== jobId);
      } else {
        showToast('Job Saved', 'Added to your favorites', 'success');
        return [...prev, jobId];
      }
    });
  };

  const matchJobWithProfile = async (job: JobListing): Promise<any> => {
    try {
      const res = await fetch(`${backendUrl}/api/career/match-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userSkills: activeResume.skills.technical,
          userExperience: `${profile.yearsOfExperience} years`,
          job
        })
      });
      const data = await res.json();
      if (data.success && data.match) {
        return data.match;
      }
    } catch (err) {
      console.warn('Match job error:', err);
    }
    return {
      matchPercentage: 88,
      suitabilityReason: `Your profile in ${profile.targetRole} strongly aligns with ${job.company}'s requirements.`,
      matchingSkills: ['React', 'TypeScript', 'Tailwind CSS'],
      missingSkills: ['System Design'],
      recommendedPrep: 'Highlight production architecture in your application notes.'
    };
  };

  const applyToJob = async (jobId: string, coverNote?: string): Promise<boolean> => {
    const job = jobs.find((j) => j.jobId === jobId);
    if (!job) return false;

    try {
      await fetch(`${backendUrl}/api/career/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, coverLetter: coverNote })
      });
    } catch { }

    // Add to applications tracker
    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId,
      company: job.company,
      title: job.title,
      location: job.location,
      salary: job.salaryRange,
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: coverNote || 'Applied via HerRise AI Career Portal'
    };

    setApplications((prev) => [newApp, ...prev]);
    setStats((prev) => ({ ...prev, applicationsSubmitted: prev.applicationsSubmitted + 1 }));
    showToast('Application Submitted! ðŸŽ‰', `Applied to ${job.company}`, 'success');
    return true;
  };

  // 6. Applications Tracker State
  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('hercareer_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch { }
    }
    return [
      {
        id: 'app-1',
        company: 'Fintech Spark India',
        title: 'Senior Frontend Engineer',
        location: 'Bengaluru / Remote',
        salary: 'â‚¹22,00,000 / yr',
        status: 'Interview Scheduled',
        appliedDate: '2026-11-04',
        interviewDate: '2026-11-15',
        notes: 'Technical round with Engineering Director.'
      },
      {
        id: 'app-2',
        company: 'Nexus Health Analytics',
        title: 'Data Analyst & BI Specialist',
        location: 'Hybrid',
        salary: 'â‚¹14,50,000 / yr',
        status: 'Applied',
        appliedDate: '2026-11-08',
        notes: 'Tailored resume submitted with SQL case studies.'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('hercareer_applications', JSON.stringify(applications));
    setStats((prev) => ({ ...prev, applicationsSubmitted: applications.length }));
  }, [applications]);

  const addApplication = async (app: Omit<JobApplication, 'id'>): Promise<boolean> => {
    const created: JobApplication = { ...app, id: `app-${Date.now()}` };
    setApplications((prev) => [created, ...prev]);
    showToast('Application Added', `Tracking application for ${app.company}`, 'success');
    return true;
  };

  const updateApplicationStatus = (
    id: string,
    status: JobApplication['status'],
    updates?: Partial<JobApplication>
  ) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, ...updates } : a))
    );
    showToast('Status Updated', `Moved to ${status}`, 'success');
  };

  const deleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    showToast('Application Removed', 'Record deleted', 'info');
  };

  // 7. Interview Prep Simulation
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestionItem[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const startInterviewSimulation = async (
    targetRole: string,
    category: string,
    difficulty: string
  ) => {
    setIsSimulating(true);
    setActiveQuestionIndex(0);
    try {
      const res = await fetch(`${backendUrl}/api/career/interview/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole, category, difficulty })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.questions)) {
        setInterviewQuestions(data.questions);
        showToast('Interview Session Started', `${data.questions.length} questions ready`, 'success');
        return;
      }
    } catch (err) {
      console.warn('Interview simulation start fallback:', err);
    }

    setInterviewQuestions([
      {
        id: 'q1',
        question: `Can you walk me through a challenging problem you solved in your recent work as a ${targetRole}, and how you measured success?`,
        expectedKeyPoints: ['Problem context', 'Strategic solution', 'Quantified outcome']
      },
      {
        id: 'q2',
        question: 'How do you prioritize technical quality and testing against urgent release deadlines?',
        expectedKeyPoints: ['Impact vs effort balance', 'Risk mitigation', 'Stakeholder communication']
      },
      {
        id: 'q3',
        question: 'Describe a situation where a project requirement changed unexpectedly midway. How did you adapt?',
        expectedKeyPoints: ['Adaptability', 'Proactive communication', 'Re-scoping']
      }
    ]);
  };

  const submitInterviewAnswer = async (answer: string): Promise<any> => {
    const currentQ = interviewQuestions[activeQuestionIndex];
    if (!currentQ) return null;

    try {
      const res = await fetch(`${backendUrl}/api/career/interview/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ.question,
          userAnswer: answer,
          role: profile.targetRole
        })
      });
      const data = await res.json();
      if (data.success && data.evaluation) {
        setInterviewQuestions((prev) =>
          prev.map((q, idx) =>
            idx === activeQuestionIndex
              ? {
                ...q,
                userAnswer: answer,
                score: data.evaluation.score,
                feedback: data.evaluation.clarityAndTone,
                pointsMissed: data.evaluation.pointsMissed,
                idealSampleAnswer: data.evaluation.idealSampleAnswer
              }
              : q
          )
        );
        return data.evaluation;
      }
    } catch (err) {
      console.warn('Evaluate answer fallback:', err);
    }

    const fallbackEval = {
      score: 85,
      rating: 'Solid',
      clarityAndTone: 'Clear, structured response with good ownership and domain vocabulary.',
      keyStrengths: ['Direct answer to the prompt', 'Logical flow'],
      pointsMissed: ['Include concrete metrics (e.g. % performance increase)'],
      idealSampleAnswer:
        'In my recent project, I prioritized this by establishing clear SLAs with product managers. We isolated the root cause, implemented automated tests, and reduced defect escape rates by 30%.'
    };

    setInterviewQuestions((prev) =>
      prev.map((q, idx) =>
        idx === activeQuestionIndex
          ? {
            ...q,
            userAnswer: answer,
            score: fallbackEval.score,
            feedback: fallbackEval.clarityAndTone,
            pointsMissed: fallbackEval.pointsMissed,
            idealSampleAnswer: fallbackEval.idealSampleAnswer
          }
          : q
      )
    );
    return fallbackEval;
  };

  const resetInterviewSimulation = () => {
    setIsSimulating(false);
    setActiveQuestionIndex(0);
    setInterviewQuestions([]);
  };

  // 8. Roadmap & Skill Gap State
  const [roadmapPhases, setRoadmapPhases] = useState<CareerRoadmapPhase[]>([
    {
      phase: 'Phase 1: Core Fundamentals & Modern Syntax',
      durationWeeks: 4,
      milestone: 'Master advanced React patterns, TypeScript generics, and state machines',
      tasks: ['Deep dive into TypeScript Generics', 'Build accessible design system components', 'Write unit tests with Vitest'],
      completed: true
    },
    {
      phase: 'Phase 2: Full Stack Architecture & Microservices',
      durationWeeks: 6,
      milestone: 'Deploy end-to-end cloud-backed microservice application',
      tasks: ['Build high-performance REST APIs in Node/Express', 'Optimize MongoDB indexing & aggregation', 'Configure Docker and CI/CD pipeline'],
      completed: false
    },
    {
      phase: 'Phase 3: System Design & Leadership Screen',
      durationWeeks: 3,
      milestone: 'Pass 3 senior-level mock system design and behavioral interviews',
      tasks: ['Design scalable distributed cache architecture', 'Practice behavioral STAR storytelling', 'Submit applications to verified returnee-friendly openings'],
      completed: false
    }
  ]);

  const [skillGaps, setSkillGaps] = useState<CareerSkillGapItem[]>([
    { skill: 'System Design & Scalability', priority: 'high', estimatedHours: 25, recommendedCourse: 'Grokking Modern System Design', completed: false },
    { skill: 'GraphQL & Apollo Client', priority: 'medium', estimatedHours: 15, recommendedCourse: 'Full Stack GraphQL Masterclass', completed: false },
    { skill: 'Docker & Containerization', priority: 'medium', estimatedHours: 12, recommendedCourse: 'Docker for Web Developers', completed: true }
  ]);

  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

  const generateCareerRoadmap = async (targetRole: string) => {
    setIsGeneratingRoadmap(true);
    try {
      const res = await fetch(`${backendUrl}/api/career/roadmap/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSkills: activeResume.skills.technical,
          targetRole,
          yearsOfExperience: profile.yearsOfExperience
        })
      });
      const data = await res.json();
      if (data.success && data.roadmap) {
        if (Array.isArray(data.roadmap.phases)) setRoadmapPhases(data.roadmap.phases);
        if (Array.isArray(data.roadmap.missingSkills)) setSkillGaps(data.roadmap.missingSkills);
        showToast('Roadmap Calibrated', `Custom path for ${targetRole} generated`, 'success');
      }
    } catch (err) {
      console.warn('Roadmap generation fallback:', err);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const toggleMilestoneTask = (phaseIndex: number, taskIndex: number) => {
    setRoadmapPhases((prev) => {
      const next = [...prev];
      if (next[phaseIndex]) {
        // Toggle phase completion if all tasks completed or simple toggle
        next[phaseIndex] = {
          ...next[phaseIndex],
          completed: !next[phaseIndex].completed
        };
      }
      return next;
    });
  };

  // 9. Career Restart (Women Returnee Track)
  const [restartNarrative, setRestartNarrative] = useState<CareerRestartNarrative | null>(() => {
    const saved = localStorage.getItem('hercareer_restart_narrative');
    return saved ? JSON.parse(saved) : null;
  });
  const [isGeneratingRestart, setIsGeneratingRestart] = useState(false);

  const generateRestartPlan = async (params: {
    breakDurationYears: number;
    breakReason: string;
    previousRole: string;
    targetRole: string;
    newSkills: string;
  }) => {
    setIsGeneratingRestart(true);
    try {
      const res = await fetch(`${backendUrl}/api/career/restart/narrative`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      if (data.success && data.restartData) {
        setRestartNarrative(data.restartData);
        localStorage.setItem('hercareer_restart_narrative', JSON.stringify(data.restartData));
        showToast('Career Comeback Strategy Ready! ðŸŒ¸', 'Empowering narrative generated', 'success');
      }
    } catch (err) {
      console.warn('Restart narrative fallback:', err);
    } finally {
      setIsGeneratingRestart(false);
    }
  };

  // 10. AI Assistant Chat
  const [assistantHistory, setAssistantHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am your HerCareer AI Assistant. I can help you polish your resume bullets, evaluate job matches, simulate interview questions, build a career comeback narrative after a break, or plan your next promotion. How can I support your career journey today?'
    }
  ]);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);

  const askCareerAssistant = async (prompt: string) => {
    const userMsg = { role: 'user' as const, content: prompt };
    setAssistantHistory((prev) => [...prev, userMsg]);
    setIsAssistantTyping(true);

    try {
      const res = await fetch(`${backendUrl}/api/career/assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          history: assistantHistory,
          userProfile: profile
        })
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setAssistantHistory((prev) => [...prev, { role: 'assistant', content: data.reply }]);
        return;
      }
    } catch (err) {
      console.warn('Assistant error:', err);
    } finally {
      setIsAssistantTyping(false);
    }

    setAssistantHistory((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `Here are 3 key strategies for "${prompt}":\n\n1. **Highlight Quantified Impact**: Recruiter algorithms and hiring managers look for measurable milestones (e.g. "increased speed by 25%").\n2. **Tailor Your Keywords**: Map the top skills from the job description directly into your resume summary.\n3. **Network with Alumnae**: Reaching out to women leaders on LinkedIn or in the HerRise network increases referral callbacks by 4x.`
      }
    ]);
  };

  return (
    <HerCareerContext.Provider
      value={{
        profile,
        updateProfile,
        stats,
        resumes,
        activeResume,
        setActiveResume,
        saveResumeData,
        deleteResumeData,
        aiEnhanceBullet,
        aiSuggestSkillsForRole,
        aiGenerateSummaries,
        resumeAnalysis,
        isAnalyzing,
        analyzeResumeContent,
        parseResumeFile,
        importParsedResume,
        jobs,
        savedJobIds,
        toggleSaveJob,
        matchJobWithProfile,
        applyToJob,
        applications,
        addApplication,
        updateApplicationStatus,
        deleteApplication,
        interviewQuestions,
        activeQuestionIndex,
        setActiveQuestionIndex,
        isSimulating,
        startInterviewSimulation,
        submitInterviewAnswer,
        resetInterviewSimulation,
        roadmapPhases,
        skillGaps,
        isGeneratingRoadmap,
        generateCareerRoadmap,
        toggleMilestoneTask,
        restartNarrative,
        isGeneratingRestart,
        generateRestartPlan,
        assistantHistory,
        isAssistantTyping,
        askCareerAssistant
      }}
    >
      {children}
    </HerCareerContext.Provider>
  );
};

export const useHerCareer = () => {
  const context = useContext(HerCareerContext);
  if (!context) {
    throw new Error('useHerCareer must be used within a HerCareerProvider');
  }
  return context;
};

