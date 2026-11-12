import { Job, ResumeData, InterviewQuestion } from '../../types';

export const initialJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Product Marketing Specialist',
    company: 'FinElevate Global',
    logo: '💼',
    location: 'Bengaluru / Remote',
    workMode: 'Remote',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-level',
    salaryRange: '₹14,00,000 - ₹18,00,000 / yr',
    category: 'Marketing & Growth',
    skills: ['Product Positioning', 'GTM Strategy', 'Content Strategy', 'Data Analytics'],
    description: 'Lead consumer product positioning and go-to-market strategies for our suite of personal wealth products. Flexible remote hours designed for working parents.',
    isSaved: true,
    hasApplied: false,
    postedDate: '2 days ago',
    featured: true,
    returneeFriendly: true
  },
  {
    id: 'job-2',
    title: 'Associate Financial Analyst (Career Returnship Track)',
    company: 'Starlight Capital Advisors',
    logo: '📈',
    location: 'Mumbai / Hybrid',
    workMode: 'Hybrid',
    employmentType: 'Returnship',
    experienceLevel: 'Career Returnee',
    salaryRange: '₹8,50,000 - ₹12,00,000 / yr',
    category: 'Finance & Banking',
    skills: ['Financial Modeling', 'Excel / PowerBI', 'Equity Research', 'Reporting'],
    description: 'Designed specifically for women returning to the financial sector after a 1 to 5-year career sabbatical. Includes dedicated 90-day 1:1 mentorship and structured refresher training.',
    isSaved: false,
    hasApplied: true,
    postedDate: '3 days ago',
    featured: true,
    returneeFriendly: true
  },
  {
    id: 'job-3',
    title: 'Frontend React / UI Developer',
    company: 'Aura Cloud Technologies',
    logo: '💻',
    location: 'Remote (Anywhere in India)',
    workMode: 'Remote',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-level',
    salaryRange: '₹12,00,000 - ₹16,50,000 / yr',
    category: 'Technology & Engineering',
    skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Next.js', 'REST APIs'],
    description: 'Build elegant, accessible web applications for female entrepreneur networks across South Asia. Async work culture with core collaboration windows.',
    isSaved: true,
    hasApplied: false,
    postedDate: '1 day ago',
    featured: true,
    returneeFriendly: true
  },
  {
    id: 'job-4',
    title: 'Digital Operations & Community Coordinator',
    company: 'FemVenture Collective',
    logo: '🤝',
    location: 'Pune / Remote',
    workMode: 'Remote',
    employmentType: 'Part-time',
    experienceLevel: 'Entry-level',
    salaryRange: '₹35,000 - ₹50,000 / mo',
    category: 'Operations & Management',
    skills: ['Community Engagement', 'Notion', 'Slack / Discord Moderation', 'Event Support'],
    description: '20 hours/week managing virtual workshop logistics and member queries for a vibrant 10,000+ member women founders community.',
    isSaved: false,
    hasApplied: false,
    postedDate: '4 days ago',
    featured: false,
    returneeFriendly: true
  },
  {
    id: 'job-5',
    title: 'Talent Acquisition & HR Business Partner',
    company: 'Nexus Health Systems',
    logo: '🌿',
    location: 'Hyderabad / Hybrid',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experienceLevel: 'Senior',
    salaryRange: '₹16,00,000 - ₹22,00,000 / yr',
    category: 'Human Resources',
    skills: ['Talent Sourcing', 'Diversity & Inclusion', 'Stakeholder Management', 'HR Analytics'],
    description: 'Drive inclusive hiring policies and employee well-being initiatives across tech and healthcare divisions. Women leadership mentorship program provided.',
    isSaved: false,
    hasApplied: false,
    postedDate: '5 days ago',
    featured: false,
    returneeFriendly: false
  },
  {
    id: 'job-6',
    title: 'E-commerce Brand & Catalog Manager',
    company: 'ArtisanCraft India',
    logo: '🎨',
    location: 'Remote',
    workMode: 'Remote',
    employmentType: 'Contract',
    experienceLevel: 'Mid-level',
    salaryRange: '₹55,000 - ₹75,000 / mo',
    category: 'Creative & E-commerce',
    skills: ['Shopify', 'SEO Copywriting', 'Visual Merchandising', 'Inventory Analytics'],
    description: 'Help onboard women craftspeople and optimize product listings, photography standards, and promotional campaigns.',
    isSaved: false,
    hasApplied: false,
    postedDate: '6 days ago',
    featured: false,
    returneeFriendly: true
  }
];

export const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    careerBreakReason: ''
  },
  summary: 'Dedicated professional seeking high-impact opportunities with continuous learning and collaborative execution.',
  experiences: [
    {
      id: 'exp-1',
      role: 'Growth Marketing Lead',
      company: 'Verve Digital Solutions',
      startDate: '2021',
      endDate: '2024',
      current: false,
      description: 'Directed omni-channel campaigns for 8 D2C clients, achieving an average 3.8x ROAS. Managed a 5-person creative and performance team while standardizing reporting dashboards in PowerBI.'
    },
    {
      id: 'exp-2',
      role: 'Digital Campaign Specialist',
      company: 'Kavya Media Labs',
      startDate: '2019',
      endDate: '2021',
      current: false,
      description: 'Implemented targeted email automation journeys and social funnels generating ₹45 Lakhs in annual customer lifetime value. Reduced customer acquisition costs by 22%.'
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Business Administration (Marketing & Finance)',
      institution: 'Symbiosis International University, Pune',
      year: '2019',
      grade: 'First Class with Distinction (8.4 CGPA)'
    }
  ],
  skills: ['Google Analytics 4', 'SQL & Data Visualization', 'CRM & HubSpot', 'GTM Planning', 'Budget Management', 'SEO & SEM'],
  softSkills: ['Cross-functional Leadership', 'Empathetic Negotiation', 'Strategic Problem-solving', 'Stakeholder Presentations'],
  certifications: [
    'Google Advanced Data Analytics Professional Certificate (2024)',
    'HerRise Certified Financial Wellness & Micro-Enterprise Coach (2026)',
    'HubSpot Inbound Marketing Master Certification'
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'D2C Women Artisans Go-To-Market Blueprint',
      description: 'Conceptualized and executed an omni-channel digital launch for 12 local pottery and textile artisans, achieving ₹4.2L in sales within 60 days.',
      link: 'https://github.com/example/artisan-gtm'
    }
  ],
  templateId: 'modern'
};

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: 'iq-1',
    category: 'Career Gap',
    question: 'How do you explain your 2-year career sabbatical, and why are you ready to return now?',
    recommendedAnswer: 'Frame your break with confidence and proactive growth: "I took a intentional 2-year sabbatical to attend to family care priorities. During this period, I consciously preserved and upgraded my industry readiness by completing an Advanced Professional Analytics Certificate and volunteering as a growth advisor for two women-led micro-businesses. Now, with my home support systems fully established, I bring refreshed energy, sharpened strategic clarity, and an even stronger commitment to contributing long-term value to your team."',
    keyTips: [
      'Own your break proudly without apologizing or making excuses.',
      'Highlight concrete skills, courses, or freelance projects completed during the period.',
      'Clarify that your home-work balance and support structures are organized for full dedication.'
    ]
  },
  {
    id: 'iq-2',
    category: 'Behavioral',
    question: 'Tell me about a time you had to execute a high-stakes project with limited budget or resources.',
    recommendedAnswer: 'Use the STAR format (Situation, Task, Action, Result): "At Verve Solutions, we had our quarterly budget cut by 40% two weeks before a key product launch (Situation). My task was to maintain our targeted 25,000 sign-up goal despite the budget freeze (Task). I pivoted from paid advertisements to a community co-marketing partnership with three aligned micro-influencers and orchestrated an organic user referral contest (Action). We achieved 27,400 verified signups at 58% lower CAC than historical benchmarks (Result)."',
    keyTips: [
      'Explicitly quantify results using numbers, percentages, or saved costs.',
      'Emphasize creative problem-solving and collaboration over helplessness.'
    ]
  },
  {
    id: 'iq-3',
    category: 'Leadership',
    question: 'How do you foster psychological safety and team alignment in a remote/hybrid environment?',
    recommendedAnswer: '"I establish clear asynchronous documentation so team members do not suffer from meeting fatigue. I hold weekly 15-minute 1:1 check-ins focused on blockers and well-being rather than micromanagement. Celebrating small wins publicly and treating missteps as shared blameless learning experiments ensures everyone feels trusted and empowered to innovate."',
    keyTips: [
      'Show that you value clear asynchronous communication tools like Slack, Notion, and Loom.',
      'Highlight empathy coupled with clear measurable accountability.'
    ]
  }
];

export const skillGapTargetRoles = [
  {
    role: 'Digital Marketing & Growth Manager',
    matchedPercentage: 82,
    ownedSkills: ['GTM Planning', 'Social Media Strategy', 'Content Creation', 'Budget Management'],
    missingSkills: ['Advanced Mixpanel Analytics', 'A/B Testing Statistical Significance', 'Programmatic Ad Buying'],
    recommendedCourseId: 'learn-course-1'
  },
  {
    role: 'Financial Analyst / Equity Associate',
    matchedPercentage: 68,
    ownedSkills: ['Excel Modeling', 'Budgeting', 'Financial Reporting'],
    missingSkills: ['DCF Valuation Models', 'SQL Database Querying', 'Bloomberg Terminal Navigation'],
    recommendedCourseId: 'learn-course-2'
  },
  {
    role: 'Full Stack Frontend Developer',
    matchedPercentage: 74,
    ownedSkills: ['HTML/CSS', 'JavaScript / React basics', 'Responsive Design'],
    missingSkills: ['TypeScript Generics', 'Next.js App Router', 'State Management (Zustand/Redux)'],
    recommendedCourseId: 'learn-course-4'
  }
];

