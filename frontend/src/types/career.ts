export interface CareerProfile {
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  headline?: string;
  targetRole: string;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'returnee';
  yearsOfExperience: number;
  currentStatus: 'employed' | 'seeking' | 'career_break' | 'student' | 'freelancer';
  workModePreference: 'remote' | 'hybrid' | 'onsite' | 'any';
  primarySkills: string[];
  secondarySkills: string[];
  readinessScore: number;
  bio?: string;
}

export interface ResumeData {
  id?: string;
  userId?: string;
  title: string;
  template: 'modern' | 'minimal' | 'executive';
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    portfolioUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
  };
  summary: string;
  experience: {
    id: string;
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    highlights: string[];
  }[];
  education: {
    id: string;
    degree: string;
    institution: string;
    year: string;
    grade?: string;
  }[];
  skills: {
    technical: string[];
    soft: string[];
    tools?: string[];
  };
  projects: {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    date: string;
  }[];
  achievements: string[];
  languages: string[];
  isPrimary?: boolean;
  qualityScore?: number;
  updatedAt?: string;
}

export interface JobListing {
  jobId: string;
  title: string;
  company: string;
  logo?: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'Onsite';
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';
  experienceLevel: string;
  salaryRange: string;
  skills: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  returneeFriendly: boolean;
  verified: boolean;
  applyUrl?: string;
  postedDate: string;
  matchScore?: number;
  suitabilityReason?: string;
  matchingSkills?: string[];
  missingSkills?: string[];
}

export interface JobApplication {
  id: string;
  jobId?: string;
  company: string;
  title: string;
  location?: string;
  salary?: string;
  status: 'Saved' | 'Applied' | 'Interview Scheduled' | 'Interview Completed' | 'Selected' | 'Rejected';
  appliedDate: string;
  interviewDate?: string;
  contactPerson?: string;
  notes?: string;
  applicationUrl?: string;
}

export interface ResumeAnalysisResult {
  overallScore: number;
  summaryRating: 'Strong' | 'Good' | 'Needs Improvement';
  categoryScores: {
    impactAndMetrics: number;
    skillsAlignment: number;
    formattingAndClarity: number;
    experienceDepth: number;
  };
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  improvedSampleBullets: {
    original: string;
    improved: string;
  }[];
}

export interface InterviewQuestionItem {
  id: string;
  question: string;
  expectedKeyPoints?: string[];
  userAnswer?: string;
  score?: number;
  feedback?: string;
  pointsMissed?: string[];
  idealSampleAnswer?: string;
}

export interface CareerRoadmapPhase {
  phase: string;
  durationWeeks: number;
  milestone: string;
  tasks: string[];
  completed?: boolean;
}

export interface CareerSkillGapItem {
  skill: string;
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
  recommendedCourse: string;
  completed?: boolean;
}

export interface CareerRestartNarrative {
  resumeSummaryNarrative: string;
  interviewTalkingPoints: string[];
  transferableSkillsIdentified: string[];
  recommendedComebackStrategy: string;
}
