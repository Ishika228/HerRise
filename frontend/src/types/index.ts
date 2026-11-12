// HerRise AI - Core Type Definitions

export type Language = 'en' | 'hi' | 'mr';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  language: Language;
  avatar: string;
  role: string;
  goals: string[];
  education: string;
  currentStatus: string;
  experienceLevel: string;
  skills: string[];
  interests: string[];
  bio: string;
  businessName?: string;
  businessCategory?: string;
  completionPercentage: number;

  // Module Registration States & Profiles
  careerProfile?: {
    targetRole: string;
    status: string;
    experienceYears: number;
    education: string;
    skills: string[];
    desiredSalary: string;
    workMode: string;
    readinessScore: number;
    matchRolesCount?: number;
  };
  businessProfile?: {
    ventureName: string;
    pitch?: string;
    industry: string;
    stage: string;
    monthlyTargetRevenue: number;
    seedCapitalNeeded: number;
    monthlyFixedCosts: number;
    monthlyVariableCosts?: number;
    averageUnitCost?: number;
    breakEvenRevenue?: number;
    projectedNetProfit?: number;
  };
  fundProfile?: {
    ventureName?: string;
    enterpriseName?: string;
    capitalNeeded: number;
    fundingType: string;
    stage?: string;
    collateral?: boolean;
    hasCollateral?: boolean;
    annualTurnover: number;
    loanReadinessScore?: number;
    estimatedEmi?: number;
  };
  marketProfile?: {
    storeName: string;
    category: string;
    productTitle: string;
    price?: number;
    cost?: number;
    stock?: number;
    sellingPrice?: number;
    unitCost?: number;
    stockQuantity?: number;
    monthlyTargetUnits?: number;
    marginPercent?: number;
    projectedMonthlyRevenue?: number;
  };
  learnProfile?: {
    targetDomain: string;
    currentLevel: string;
    weeklyHours: number;
    estimatedWeeks?: number;
    primaryGoal?: string;
  };
  networkProfile?: {
    mentorshipDomain: string;
    primaryGoal: string;
    meetingFrequency: string;
    matchScore: number;
  };
}

// Module 1: HerFinance Types
export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  color: string;
}

export interface BudgetCategory {
  category: string;
  allocated: number;
  spent: number;
  color: string;
}

export interface FinancialLesson {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  completed: boolean;
  content: string;
}

// Module 2: HerCareer Types
export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Returnship';
  experienceLevel: 'Entry-level' | 'Mid-level' | 'Senior' | 'Career Returnee';
  salaryRange: string;
  category: string;
  skills: string[];
  description: string;
  isSaved?: boolean;
  hasApplied?: boolean;
  postedDate: string;
  featured?: boolean;
  returneeFriendly?: boolean;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
    careerBreakReason?: string;
  };
  summary: string;
  experiences: {
    id: string;
    role: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }[];
  education: {
    id: string;
    degree: string;
    institution: string;
    year: string;
    grade?: string;
  }[];
  skills: string[];
  softSkills: string[];
  certifications: string[];
  projects: {
    id: string;
    title: string;
    description: string;
    link?: string;
  }[];
  templateId: 'modern' | 'minimal' | 'executive';
}

export interface InterviewQuestion {
  id: string;
  category: 'Behavioral' | 'Career Gap' | 'Technical' | 'Leadership';
  question: string;
  recommendedAnswer: string;
  keyTips: string[];
}

// Module 3: HerBusiness Types
export interface BusinessIdea {
  id: string;
  title: string;
  category: string;
  description: string;
  initialInvestment: string;
  profitMargin: string;
  difficulty: 'Beginner' | 'Moderate' | 'Advanced';
  tags: string[];
  potentialRevenue: string;
  keySteps: string[];
}

export interface BusinessPlan {
  businessName: string;
  tagline: string;
  category: string;
  problemStatement: string;
  solution: string;
  targetAudience: string;
  marketOpportunity: string;
  competitorAnalysis: string;
  revenueModel: string;
  pricingStrategy: string;
  marketingStrategy: string;
  startupCosts: { item: string; cost: number }[];
  projectedRevenueYear1: number;
}

export interface RoadmapMilestone {
  day: number;
  phase: string;
  title: string;
  description: string;
  completed: boolean;
}

// Module 4: HerFund Types
export interface FundingScheme {
  id: string;
  title: string;
  provider: string;
  logo: string;
  type: 'Bank Loan' | 'NBFC Microloan' | 'Women Empowerment Grant' | 'Crowdfunding' | 'Angel/Equity';
  amountRange: string;
  minAmount: number;
  maxAmount: number;
  interestRate: string;
  repaymentTenor: string;
  eligibility: string[];
  documentsRequired: string[];
  processingTime: string;
  collateralRequired: boolean;
  stage: 'Idea' | 'Early Stage' | 'Growth' | 'Expansion';
  badge?: string;
}

export interface PitchDeckSlide {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  bulletPoints: string[];
}

// Module 5: HerMarket Types
export interface Product {
  id: string;
  title: string;
  sellerName: string;
  sellerLocation: string;
  sellerRating: number;
  price: number;
  originalPrice?: number;
  category: 'Fashion' | 'Handmade' | 'Beauty' | 'Home Decor' | 'Food' | 'Services' | 'Digital';
  image: string;
  images: string[];
  description: string;
  features: string[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  productTitle: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  paymentMethod: string;
}

// Module 6: HerLearn Types
export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorRole: string;
  instructorAvatar: string;
  duration: string;
  totalLessons: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  thumbnail: string;
  description: string;
  rating: number;
  enrolledStudents: number;
  isEnrolled?: boolean;
  progressPercent?: number;
  modules: {
    id: string;
    title: string;
    duration: string;
    completed: boolean;
  }[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Certificate {
  id: string;
  courseTitle: string;
  issuedTo: string;
  issueDate: string;
  credentialId: string;
  instructorName: string;
}

// Module 7: HerNetwork Types
export interface Mentor {
  id: string;
  name: string;
  designation: string;
  company: string;
  avatar: string;
  industry: string;
  experienceYears: number;
  expertise: string[];
  languages: string[];
  bio: string;
  availability: string;
  rating: number;
  sessionsCompleted: number;
  badges: string[];
}

export interface Workshop {
  id: string;
  title: string;
  mentorName: string;
  mentorRole: string;
  mentorAvatar: string;
  date: string;
  time: string;
  duration: string;
  category: string;
  description: string;
  attendeesCount: number;
  isRegistered?: boolean;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  timeAgo: string;
  category: string;
  content: string;
  likes: number;
  comments: {
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    timeAgo: string;
  }[];
  isLiked?: boolean;
}

// AI Assistant
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  category?: string;
  suggestedActions?: { label: string; actionPath?: string }[];
}

