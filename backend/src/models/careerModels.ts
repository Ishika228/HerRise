import mongoose, { Schema, Document } from 'mongoose';

// ==========================================
// 1. Career Profile Model
// ==========================================
export interface ICareerProfile extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const CareerProfileSchema = new Schema<ICareerProfile>(
  {
    userId: { type: String, required: true, index: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    location: { type: String, default: 'Bengaluru, India' },
    headline: { type: String },
    targetRole: { type: String, default: 'Software Engineer' },
    experienceLevel: { type: String, default: 'mid' },
    yearsOfExperience: { type: Number, default: 2 },
    currentStatus: { type: String, default: 'seeking' },
    workModePreference: { type: String, default: 'remote' },
    primarySkills: { type: [String], default: [] },
    secondarySkills: { type: [String], default: [] },
    readinessScore: { type: Number, default: 85 },
    bio: { type: String }
  },
  { timestamps: true }
);

export const CareerProfileModel = mongoose.model<ICareerProfile>('CareerProfile', CareerProfileSchema);

// ==========================================
// 2. Resume Model
// ==========================================
export interface IResume extends Document {
  userId: string;
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
  isPrimary: boolean;
  qualityScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, default: 'My Professional Resume' },
    template: { type: String, default: 'modern' },
    personalInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      portfolioUrl: { type: String },
      linkedinUrl: { type: String },
      githubUrl: { type: String }
    },
    summary: { type: String, default: '' },
    experience: [
      {
        id: { type: String },
        title: { type: String },
        company: { type: String },
        location: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        current: { type: Boolean, default: false },
        description: { type: String },
        highlights: { type: [String], default: [] }
      }
    ],
    education: [
      {
        id: { type: String },
        degree: { type: String },
        institution: { type: String },
        year: { type: String },
        grade: { type: String }
      }
    ],
    skills: {
      technical: { type: [String], default: [] },
      soft: { type: [String], default: [] },
      tools: { type: [String], default: [] }
    },
    projects: [
      {
        id: { type: String },
        title: { type: String },
        description: { type: String },
        technologies: { type: [String], default: [] },
        link: { type: String }
      }
    ],
    certifications: [
      {
        id: { type: String },
        name: { type: String },
        issuer: { type: String },
        date: { type: String }
      }
    ],
    achievements: { type: [String], default: [] },
    languages: { type: [String], default: ['English'] },
    isPrimary: { type: Boolean, default: false },
    qualityScore: { type: Number, default: 85 }
  },
  { timestamps: true }
);

export const ResumeModel = mongoose.model<IResume>('Resume', ResumeSchema);

// ==========================================
// 3. Job Listing Model
// ==========================================
export interface IJobListing extends Document {
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
}

const JobListingSchema = new Schema<IJobListing>(
  {
    jobId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    logo: { type: String },
    location: { type: String, required: true },
    workMode: { type: String, default: 'Remote' },
    employmentType: { type: String, default: 'Full-time' },
    experienceLevel: { type: String, default: 'Mid-Level' },
    salaryRange: { type: String, default: '₹12,00,000 - ₹18,00,000' },
    skills: { type: [String], default: [] },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    returneeFriendly: { type: Boolean, default: false },
    verified: { type: Boolean, default: true },
    applyUrl: { type: String },
    postedDate: { type: String, default: () => new Date().toISOString().split('T')[0] }
  },
  { timestamps: true }
);

export const JobListingModel = mongoose.model<IJobListing>('JobListing', JobListingSchema);

// ==========================================
// 4. Job Application Tracker Model
// ==========================================
export interface IJobApplication extends Document {
  userId: string;
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
  followUpGenerated?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    userId: { type: String, required: true, index: true },
    jobId: { type: String },
    company: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String },
    salary: { type: String },
    status: {
      type: String,
      enum: ['Saved', 'Applied', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Rejected'],
      default: 'Applied'
    },
    appliedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    interviewDate: { type: String },
    contactPerson: { type: String },
    notes: { type: String },
    applicationUrl: { type: String },
    followUpGenerated: { type: String }
  },
  { timestamps: true }
);

export const JobApplicationModel = mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);

// ==========================================
// 5. Interview Session Model
// ==========================================
export interface IInterviewSession extends Document {
  userId: string;
  targetRole: string;
  category: 'HR Interview' | 'Technical Interview' | 'Behavioral Interview' | 'Communication Skills' | 'Situational Questions' | 'Fresher Interview' | 'Management Interview';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questions: {
    id: string;
    question: string;
    userAnswer?: string;
    score?: number;
    feedback?: string;
    keyPointsMissed?: string[];
    suggestedAnswer?: string;
  }[];
  overallScore?: number;
  summaryFeedback?: string;
  completed: boolean;
  createdAt: Date;
}

const InterviewSessionSchema = new Schema<IInterviewSession>(
  {
    userId: { type: String, required: true, index: true },
    targetRole: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, default: 'Intermediate' },
    questions: [
      {
        id: { type: String },
        question: { type: String },
        userAnswer: { type: String },
        score: { type: Number },
        feedback: { type: String },
        keyPointsMissed: { type: [String], default: [] },
        suggestedAnswer: { type: String }
      }
    ],
    overallScore: { type: Number },
    summaryFeedback: { type: String },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const InterviewSessionModel = mongoose.model<IInterviewSession>('InterviewSession', InterviewSessionSchema);

// ==========================================
// 6. Career Roadmap & Skill Gap Model
// ==========================================
export interface ICareerRoadmap extends Document {
  userId: string;
  targetRole: string;
  currentSkills: string[];
  missingSkills: {
    skill: string;
    priority: 'high' | 'medium' | 'low';
    estimatedHours: number;
    recommendedCourse: string;
    completed: boolean;
  }[];
  milestones: {
    id: string;
    title: string;
    phase: string;
    durationWeeks: number;
    tasks: string[];
    completed: boolean;
  }[];
  completionPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const CareerRoadmapSchema = new Schema<ICareerRoadmap>(
  {
    userId: { type: String, required: true, index: true },
    targetRole: { type: String, required: true },
    currentSkills: { type: [String], default: [] },
    missingSkills: [
      {
        skill: { type: String },
        priority: { type: String, enum: ['high', 'medium', 'low'], default: 'high' },
        estimatedHours: { type: Number, default: 20 },
        recommendedCourse: { type: String },
        completed: { type: Boolean, default: false }
      }
    ],
    milestones: [
      {
        id: { type: String },
        title: { type: String },
        phase: { type: String },
        durationWeeks: { type: Number, default: 2 },
        tasks: { type: [String], default: [] },
        completed: { type: Boolean, default: false }
      }
    ],
    completionPercentage: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const CareerRoadmapModel = mongoose.model<ICareerRoadmap>('CareerRoadmap', CareerRoadmapSchema);

// ==========================================
// 7. Career Break / Returnee Profile Model
// ==========================================
export interface ICareerBreakProfile extends Document {
  userId: string;
  breakDurationYears: number;
  breakReason: 'childcare' | 'caregiving' | 'health' | 'education' | 'relocation' | 'other';
  previousRole: string;
  targetRole: string;
  transferableSkills: string[];
  relaunchStrategy: string;
  resumeNarrative: string;
  interviewTalkingPoints: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CareerBreakProfileSchema = new Schema<ICareerBreakProfile>(
  {
    userId: { type: String, required: true, index: true },
    breakDurationYears: { type: Number, default: 2 },
    breakReason: { type: String, default: 'childcare' },
    previousRole: { type: String, default: '' },
    targetRole: { type: String, default: '' },
    transferableSkills: { type: [String], default: [] },
    relaunchStrategy: { type: String },
    resumeNarrative: { type: String },
    interviewTalkingPoints: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const CareerBreakProfileModel = mongoose.model<ICareerBreakProfile>('CareerBreakProfile', CareerBreakProfileSchema);
