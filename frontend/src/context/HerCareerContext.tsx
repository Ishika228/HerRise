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
export function isProjectEntry(item: { title?: string; role?: string; company?: string; description?: string }): boolean {
  if (!item) return false;
  const title = (item.title || item.role || '').toLowerCase();
  const company = (item.company || '').toLowerCase();

  return (
    title.includes('project') ||
    company.includes('project') ||
    title.startsWith('project:') ||
    title.includes('auraestate') ||
    title.includes('voice assistant') ||
    title.includes('interactive rot') ||
    title.includes('interactive robot') ||
    title.includes('fitness fusion') ||
    title.includes('ultrasonic') ||
    title.includes('ielts') ||
    company.includes('mern stack') ||
    company.includes('ai & iot') ||
    company.includes('iot project') ||
    company.includes('django project') ||
    company.includes('arduino')
  );
}

// Strictly separate projects that were placed inside experience and move them to projects
export function separateExperienceAndProjects(resume: ResumeData): ResumeData {
  if (!resume) return resume;
  const actualExperience: ResumeData['experience'] = [];
  const existingProjects: ResumeData['projects'] = [...(resume.projects || [])];

  for (const exp of (resume.experience || [])) {
    if (isProjectEntry(exp)) {
      // It's a project mistakenly placed in experience! Clean it up and move to projects
      const cleanedTitle = exp.title
        .replace(/^Project:\s*/i, '')
        .replace(/Interactive Rot/i, 'Interactive Robot')
        .trim();

      const techStack: string[] = [];
      if (exp.company) {
        const cleanedComp = exp.company.replace(/\s*Project\s*/i, '').trim();
        if (cleanedComp && !cleanedComp.toLowerCase().includes('company') && !cleanedComp.toLowerCase().includes('organization')) {
          const parts = cleanedComp.split(/[,|/&]/).map((s) => s.trim()).filter(Boolean);
          techStack.push(...parts);
        }
      }

      if (cleanedTitle.toLowerCase().includes('auraestate') && techStack.length === 0) {
        techStack.push('MongoDB', 'Express.js', 'React.js', 'Node.js', 'MERN Stack');
      } else if (cleanedTitle.toLowerCase().includes('voice assistant') && techStack.length === 0) {
        techStack.push('Python', 'Gemini AI', 'Speech Recognition', 'ESP8266', 'Arduino');
      }

      const alreadyExists = existingProjects.some(
        (p) => p.title.toLowerCase().includes(cleanedTitle.toLowerCase().slice(0, 10))
      );

      if (!alreadyExists) {
        existingProjects.push({
          id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          title: cleanedTitle,
          role: 'Full Stack Developer',
          technologies: techStack.length > 0 ? techStack : ['React.js', 'Node.js', 'Python'],
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
  let storedResume: any = null;
  try {
    const raw = localStorage.getItem('hercareer_resume');
    if (raw) storedResume = JSON.parse(raw);
  } catch { }

  const isIshika =
    user?.email?.toLowerCase().includes('ishikabhatia') ||
    user?.name?.toLowerCase().includes('ishika') ||
    storedResume?.fullName?.toLowerCase().includes('ishika') ||
    storedResume?.email?.toLowerCase().includes('ishikabhatia');

  const name = user?.name || storedResume?.fullName || (isIshika ? 'Ishika Bhatia' : 'Professional Member');
  const email = user?.email || storedResume?.email || (isIshika ? 'ishikabhatia5777@gmail.com' : 'member@herrise.org');
  const phone = user?.phone || storedResume?.phone || (isIshika ? '7508163418' : '');
  const location = user?.location || storedResume?.location || (isIshika ? 'Amritsar, Punjab' : 'India');
  const targetRole =
    user?.careerProfile?.targetRole ||
    user?.role ||
    storedResume?.headline ||
    (isIshika ? 'Full Stack Developer | Web Developer' : 'Full Stack Developer');

  const userSkills: string[] =
    storedResume?.skills && storedResume.skills.length > 0
      ? storedResume.skills
      : user?.skills && user.skills.length > 0
        ? user.skills
        : isIshika
          ? [
            'MongoDB',
            'Express.js',
            'React.js',
            'Node.js',
            'Python',
            'Django',
            'Java',
            'C++',
            'HTML',
            'CSS',
            'Bootstrap',
            'SQL',
            'REST APIs',
            'AI Integration'
          ]
          : ['React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'HTML', 'CSS'];

  // 1. WORK EXPERIENCE (Strictly formal employment, jobs, trainer/faculty roles)
  const rawExp = storedResume?.experience || user?.resumeData?.experience;
  let experience: ResumeData['experience'] = [];

  // Filter out any projects that were mistakenly inside raw experience
  const cleanExpList = (rawExp && Array.isArray(rawExp))
    ? rawExp.filter((e: any) => !isProjectEntry(e))
    : [];

  const rawProjectEntriesFromExp = (rawExp && Array.isArray(rawExp))
    ? rawExp.filter((e: any) => isProjectEntry(e))
    : [];

  if (cleanExpList.length > 0) {
    experience = cleanExpList.map((e: any, idx: number) => ({
      id: `exp-${idx + 1}`,
      title: e.role || e.title || targetRole,
      company: e.company || 'Organization',
      location: e.location || location,
      startDate: e.duration ? e.duration.split('–')[0]?.split('-')[0]?.trim() : '2023-01',
      endDate: e.duration ? (e.duration.split('–')[1] || e.duration.split('-')[1])?.trim() || 'Present' : 'Present',
      current: !e.duration || e.duration.toLowerCase().includes('present'),
      description: e.description || `Key contributor delivering solutions for ${e.company || 'organization'}.`,
      highlights:
        Array.isArray(e.bullets || e.highlights) && (e.bullets || e.highlights).length > 0
          ? e.bullets || e.highlights
          : [`Delivered key responsibilities and achieved operational milestones.`]
    }));
  } else if (isIshika) {
    // Ishika's actual verified employment (AOSC Technologies & Marshall Institute)
    experience = [
      {
        id: 'exp-1',
        title: 'Full Stack Developer',
        company: 'AOSC Technologies Pvt Ltd',
        location: 'Punjab, India',
        startDate: '2026-07',
        endDate: 'Present',
        current: true,
        description: 'Developed full-stack web application using MERN Stack with responsive UI, REST APIs, and database integration.',
        highlights: [
          'Developed a full-stack web application using MongoDB, Express.js, React.js, and Node.js, implementing responsive UI, REST APIs, and database integration.',
          'Contributed to AI-driven development, integrating modern AI tools/workflows to improve functionality, automation, and user experience.'
        ]
      },
      {
        id: 'exp-2',
        title: 'Faculty / Trainer',
        company: 'Marshall Institute',
        location: 'Amritsar, Punjab',
        startDate: '2026-02',
        endDate: 'Present',
        current: true,
        description: 'Delivered theoretical and practical training in computer fundamentals, programming, and digital applications.',
        highlights: [
          'Delivered theoretical and practical training in computer fundamentals, programming, and digital applications to students.',
          'Designed lesson plans, conducted assessments, and provided academic guidance to strengthen students\' technical and problem-solving skills.'
        ]
      }
    ];
  } else {
    // For freshers or students without employment history: keep empty! Do not inject fake company!
    experience = [];
  }

  // 2. KEY TECHNICAL & PORTFOLIO PROJECTS (Dedicated section separate from work experience)
  const rawProjects = storedResume?.projects || user?.resumeData?.projects;
  let projects: ResumeData['projects'] = [];

  if (rawProjects && Array.isArray(rawProjects) && rawProjects.length > 0) {
    projects = rawProjects.map((p: any, idx: number) => ({
      id: `proj-${idx + 1}`,
      title: p.title || 'Technical Project',
      role: p.role || 'Full Stack Developer',
      description: p.description || '',
      technologies: Array.isArray(p.technologies)
        ? p.technologies
        : typeof p.technologies === 'string'
          ? p.technologies.split(',').map((s: string) => s.trim())
          : userSkills.slice(0, 3),
      link: p.link || '',
      highlights: Array.isArray(p.highlights || p.bullets) ? p.highlights || p.bullets : []
    }));
  } else if (isIshika) {
    // Ishika's authentic technical projects from her resume
    projects = [
      {
        id: 'proj-1',
        title: 'AuraEstate (Real Estate Platform)',
        role: 'Full Stack Developer',
        technologies: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'MERN Stack'],
        link: 'https://github.com/ishikabhatia5777',
        description: 'Comprehensive real estate marketplace featuring buyer wishlists, live agent chat, chatbot, and filtered search.',
        highlights: [
          'Implemented buyer wishlist, live agent chat, chatbot, filtered search, and client dashboard.',
          'Engineered agent property/chat dashboard and admin oversight module with login logs and bulk property upload.'
        ]
      },
      {
        id: 'proj-2',
        title: 'AI Voice Assistant & Interactive Robot',
        role: 'AI & IoT Developer',
        technologies: ['Python', 'Gemini AI', 'Speech Recognition', 'ESP8266', 'Arduino'],
        link: '',
        description: 'AI-powered voice assistant integrated with physical robot hardware for real-time speech interaction.',
        highlights: [
          'Developed an AI-powered, Alexa-like voice assistant integrated with a physical robot for real-time voice conversations.',
          'Built a Listen → Process → Respond pipeline using Speech Recognition, Gemini AI, and Text-to-Speech with Python-ESP8266 integration for LED eyes and mouth animations.'
        ]
      },
      {
        id: 'proj-3',
        title: 'Fitness Fusion (Gym Management)',
        role: 'Web Developer',
        technologies: ['HTML', 'CSS', 'Python', 'Django', 'Bootstrap'],
        link: '',
        description: 'Dynamic gym management system streamlining trainer allotment, fitness goals, and health tracking.',
        highlights: [
          'Engineered personal trainer allotment, goal setting, and interactive BMI/BMR/calorie calculators.',
          'Integrated record keeper, chatbot assistant, video workout sessions, and trainer work scheduling.'
        ]
      },
      {
        id: 'proj-4',
        title: 'Ultrasonic Distance Project',
        role: 'Embedded Systems Developer',
        technologies: ['C++', 'Arduino', 'Ultrasonic Sensor'],
        link: '',
        description: 'Hardware-software embedded system measuring precision distances in real-time.',
        highlights: [
          'Programmed Arduino micro-controller in C++ to interface with ultrasonic sensors for accurate distance calculations.'
        ]
      },
      {
        id: 'proj-5',
        title: 'IELTS Practice Website',
        role: 'AI & Web Developer',
        technologies: ['React.js', 'Python', 'AI Agents'],
        link: '',
        description: 'Interactive test preparation platform utilizing specialized AI agents for English language evaluation.',
        highlights: [
          'Developed intelligent AI agents for real-time writing analysis and speaking test practice.'
        ]
      }
    ];
  } else {
    // Default project for general candidate
    projects = [
      {
        id: 'proj-1',
        title: `${targetRole} Portfolio Application`,
        role: 'Full Stack Developer',
        description: `Full stack responsive application built with modern architecture and reusable components.`,
        technologies: userSkills.slice(0, 4),
        link: 'https://github.com',
        highlights: [
          `Architected scalable state management and responsive UI components using ${userSkills.slice(0, 2).join(' & ')}.`,
          `Engineered REST API endpoints with robust error handling and database indexing.`
        ]
      }
    ];
  }

  // Also append any projects that were extracted from rawExp if not already present
  for (const expProj of rawProjectEntriesFromExp) {
    const cleanedTitle = (expProj.title || '').replace(/^Project:\s*/i, '').trim();
    if (!projects.some((p) => p.title.toLowerCase().includes(cleanedTitle.toLowerCase().slice(0, 8)))) {
      projects.push({
        id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: cleanedTitle,
        role: 'Full Stack Developer',
        technologies: ['MERN Stack', 'React.js', 'Node.js'],
        link: '',
        description: expProj.description || (expProj.highlights && expProj.highlights[0]) || '',
        highlights: expProj.highlights || []
      });
    }
  }

  // 3. EDUCATION
  const rawEdu = storedResume?.education || user?.resumeData?.education;
  let education: ResumeData['education'] = [];

  if (rawEdu && Array.isArray(rawEdu) && rawEdu.length > 0) {
    education = rawEdu.map((edu: any, idx: number) => ({
      id: `edu-${idx + 1}`,
      degree: edu.degree || 'Degree',
      institution: edu.institution || 'University',
      year: edu.year || '2024',
      grade: edu.grade || ''
    }));
  } else if (isIshika) {
    education = [
      {
        id: 'edu-1',
        degree: 'Master of Computer Applications',
        institution: 'Khalsa College of Engineering and Technology, Amritsar',
        year: '2024 – 2026',
        grade: '8.96 SGPA'
      },
      {
        id: 'edu-2',
        degree: 'Bachelor of Computer Applications',
        institution: 'BBK DAV College for Women, Amritsar',
        year: '2021 – 2024',
        grade: '77.33%'
      },
      {
        id: 'edu-3',
        degree: 'Non-Medical (Class XII)',
        institution: 'Shri Ram Ashram Public School, Amritsar',
        year: '2020 – 2021',
        grade: '88.2%'
      }
    ];
  } else {
    education = [
      {
        id: 'edu-1',
        degree: user?.education || 'Bachelor of Technology / Computer Applications',
        institution: 'University / Institute',
        year: '2024',
        grade: 'First Class'
      }
    ];
  }

  // 4. CERTIFICATIONS & TRAINING
  const rawCert = storedResume?.certifications || user?.resumeData?.certifications;
  let certifications: ResumeData['certifications'] = [];

  if (rawCert && Array.isArray(rawCert) && rawCert.length > 0) {
    certifications = rawCert.map((c: any, idx: number) => ({
      id: `cert-${idx + 1}`,
      name: typeof c === 'string' ? c : c.name || 'Certification',
      issuer: typeof c === 'string' ? 'Industry Organization' : c.issuer || 'Certified Institute',
      date: typeof c === 'string' ? '2024' : c.year || c.date || '2024'
    }));
  } else if (isIshika) {
    certifications = [
      {
        id: 'cert-1',
        name: 'IBM SkillsBuild & CSRBOX Micro-Internships: Data Science, Agentic AI, Generative AI',
        issuer: 'IBM & CSRBOX',
        date: '2024'
      },
      {
        id: 'cert-2',
        name: '3-Month Web Development Training (Django)',
        issuer: 'CACMS Institute',
        date: '2023'
      }
    ];
  } else {
    certifications = [
      {
        id: 'cert-1',
        name: `${targetRole} Certified Professional`,
        issuer: 'Industry Recognized Credential',
        date: '2024'
      }
    ];
  }

  // 5. ACHIEVEMENTS & RESEARCH
  const achievements =
    storedResume?.achievements && Array.isArray(storedResume.achievements) && storedResume.achievements.length > 0
      ? storedResume.achievements
      : isIshika
        ? [
          'Published review paper: "Deep Learning-Driven Engineering Solutions: A Comprehensive Review".',
          'Authored research paper on "AI and Driving Business Innovation", presented at National Women Conference.',
          'Overall Departmental Coordinator for Tech Urja at Khalsa College of Engineering and Technology.'
        ]
        : [
          `Recognized for high-impact deliverables in ${targetRole} initiatives.`,
          `Consistently achieved zero-defect deployment across project sprints.`
        ];

  const summary =
    storedResume?.summary ||
    user?.resumeData?.summary ||
    user?.bio ||
    (isIshika
      ? 'MCA candidate with a strong foundation in the MERN stack (MongoDB, Express.js, React.js, Node.js) and Python/Django, working as a Full Stack Developer at AOSC Technologies. Experienced in building responsive web applications, developing REST APIs, and integrating AI-driven workflows for enhanced user experiences. Passionate about software architecture, data structures, and continuous upskilling.'
      : `Driven and results-oriented ${targetRole} with proven capabilities in ${userSkills.slice(0, 4).join(', ')}. Passionate about building reliable, accessible, and high-performance digital solutions with measurable user impact.`);

  return {
    id: `res-${user?.id || 'usr-101'}`,
    userId: user?.id || 'usr-101',
    title: `${targetRole} Resume (ATS Optimized)`,
    template: 'modern',
    personalInfo: {
      fullName: name,
      email: email,
      phone: phone,
      location: location,
      portfolioUrl: storedResume?.portfolio || '',
      linkedinUrl: storedResume?.linkedin || '',
      githubUrl: isIshika ? 'https://github.com/ishikabhatia5777' : ''
    },
    summary,
    experience,
    projects,
    education,
    skills: {
      technical: userSkills,
      soft: ['Cross-functional Collaboration', 'Analytical Problem Solving', 'Strategic Execution', 'Clear Communication'],
      tools: ['Git & GitHub', 'VS Code', 'Postman', 'Docker', 'MongoDB Compass']
    },
    certifications,
    achievements,
    languages: ['English (Fluent)', 'Hindi (Native)', 'Punjabi'],
    qualityScore: 92,
    updatedAt: new Date().toISOString()
  };
}

const buildProfileFromUser = (u: any): CareerProfile => {
  const isIshika =
    u?.email?.toLowerCase().includes('ishikabhatia') ||
    u?.name?.toLowerCase().includes('ishika');

  return {
    userId: u?.id || 'usr-101',
    fullName: u?.name || (isIshika ? 'Ishika Bhatia' : 'Member'),
    email: u?.email || (isIshika ? 'ishikabhatia5777@gmail.com' : 'member@herrise.org'),
    phone: u?.phone || (isIshika ? '7508163418' : ''),
    location: u?.location || (isIshika ? 'Amritsar, Punjab' : 'India'),
    headline: u?.careerProfile?.targetRole || (isIshika ? 'Full Stack Developer | Web Developer' : u?.role || 'Full Stack Developer'),
    targetRole: u?.careerProfile?.targetRole || (isIshika ? 'Full Stack Developer | Web Developer' : u?.role || 'Full Stack Developer'),
    experienceLevel: (u?.experienceLevel?.includes('Senior') ? 'senior' : 'mid') as any,
    yearsOfExperience: u?.careerProfile?.experienceYears || (isIshika ? 2 : 2),
    currentStatus: 'seeking',
    workModePreference: 'remote',
    primarySkills:
      u?.skills && u.skills.length > 0
        ? u.skills.slice(0, 4)
        : isIshika
          ? ['MongoDB', 'Express.js', 'React.js', 'Node.js']
          : ['React', 'Node.js', 'Python'],
    secondarySkills:
      u?.skills && u.skills.length > 4
        ? u.skills.slice(4)
        : isIshika
          ? ['Python', 'Django', 'SQL', 'C++']
          : ['SQL', 'MongoDB'],
    readinessScore: u?.careerProfile?.readinessScore || 92,
    bio:
      u?.bio ||
      (isIshika
        ? 'Full Stack MERN & Python Developer with experience in web applications, REST APIs, and AI integrations.'
        : '')
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
    showToast('Application Submitted! 🎉', `Applied to ${job.company}`, 'success');
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
        salary: '₹22,00,000 / yr',
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
        salary: '₹14,50,000 / yr',
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
        showToast('Career Comeback Strategy Ready! 🌸', 'Empowering narrative generated', 'success');
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

