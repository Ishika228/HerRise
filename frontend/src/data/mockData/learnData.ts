import { Course, QuizQuestion, Certificate } from '../../types';

export const initialCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Financial Independence & Wealth Architecture for Women',
    instructor: 'Rhea Shenoy, CA',
    instructorRole: 'Ex-Goldman Sachs & Founder of FinCoach',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    duration: '4.5 Hours',
    totalLessons: 14,
    level: 'Beginner',
    category: 'Financial Literacy',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    description: 'Break free from money intimidation. Master personal budgeting, tax strategies, equity mutual funds, sovereign gold bonds, and retirement independence.',
    rating: 4.9,
    enrolledStudents: 3420,
    isEnrolled: true,
    progressPercent: 72,
    modules: [
      { id: 'm1', title: '1. Mindset Shift: Dismantling Cultural Money Taboos', duration: '18 mins', completed: true },
      { id: 'm2', title: '2. The Bulletproof 50/30/20 Budgeting Blueprint', duration: '24 mins', completed: true },
      { id: 'm3', title: '3. Emergency Funds & High-Yield Safety Cushions', duration: '20 mins', completed: true },
      { id: 'm4', title: '4. Demystifying Mutual Funds, ETFs & Index Investing', duration: '32 mins', completed: true },
      { id: 'm5', title: '5. Health & Term Insurance Without Getting Mis-sold', duration: '28 mins', completed: false },
      { id: 'm6', title: '6. Tax Savings for Freelancers & Business Owners', duration: '35 mins', completed: false }
    ]
  },
  {
    id: 'course-2',
    title: 'From Idea to First 100 Customers: D2C E-commerce',
    instructor: 'Aarti Menon',
    instructorRole: 'Founder of Bloom Botanics (₹4Cr D2C Brand)',
    instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    duration: '6.0 Hours',
    totalLessons: 18,
    level: 'Intermediate',
    category: 'Entrepreneurship',
    thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
    description: 'A step-by-step masterclass on sourcing raw materials, packaging design, FSSAI/trademark compliance, HerMarket storefront setup, and organic customer acquisition.',
    rating: 4.9,
    enrolledStudents: 2850,
    isEnrolled: true,
    progressPercent: 40,
    modules: [
      { id: 'm1', title: '1. Validating Product-Market Fit with Zero Inventory', duration: '22 mins', completed: true },
      { id: 'm2', title: '2. Costing, COGS & Protecting 50%+ Gross Margins', duration: '30 mins', completed: true },
      { id: 'm3', title: '3. Packaging, Labelling & Eco-Friendly Supply Chains', duration: '25 mins', completed: false },
      { id: 'm4', title: '4. Instagram & WhatsApp Commerce That Actually Converts', duration: '35 mins', completed: false }
    ]
  },
  {
    id: 'course-3',
    title: 'AI Tools & Automation for Solo Entrepreneurs',
    instructor: 'Pooja Sundaram',
    instructorRole: 'AI Strategist & Former Google Developer Advocate',
    instructorAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
    duration: '3.5 Hours',
    totalLessons: 10,
    level: 'Beginner',
    category: 'Artificial Intelligence',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    description: 'Learn how to use AI for marketing copywriting, graphic mockups, customer support automation, and data analysis to run a multi-person business by yourself.',
    rating: 4.8,
    enrolledStudents: 4120,
    isEnrolled: false,
    progressPercent: 0,
    modules: [
      { id: 'm1', title: '1. Mastering Prompt Engineering for Business Tasks', duration: '20 mins', completed: false },
      { id: 'm2', title: '2. AI Copywriting for High-Converting Ad Funnels', duration: '25 mins', completed: false },
      { id: 'm3', title: '3. Automated Customer Support & FAQ Chatbots', duration: '30 mins', completed: false }
    ]
  },
  {
    id: 'course-4',
    title: 'Executive Communication & High-Stakes Negotiation',
    instructor: 'Sunita Krishnan',
    instructorRole: 'Leadership Coach & Former Fortune 500 VP',
    instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    duration: '4.0 Hours',
    totalLessons: 12,
    level: 'Advanced',
    category: 'Communication Skills',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    description: 'Command the room, overcome impostor syndrome, negotiate salary increases with confidence, and pitch investors without feeling defensive.',
    rating: 5.0,
    enrolledStudents: 1980,
    isEnrolled: false,
    progressPercent: 0,
    modules: [
      { id: 'm1', title: '1. The Psychology of Gravitas in High-Stakes Meetings', duration: '25 mins', completed: false },
      { id: 'm2', title: '2. The 4-Step Salary & Retainer Negotiation Script', duration: '35 mins', completed: false }
    ]
  },
  {
    id: 'course-5',
    title: 'Modern Web Development with React & TypeScript',
    instructor: 'Nisha Agarwal',
    instructorRole: 'Principal Tech Lead @ CloudScale',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    duration: '12.0 Hours',
    totalLessons: 32,
    level: 'Intermediate',
    category: 'Programming',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    description: 'Practical project-based coding course for women breaking into frontend engineering or building their own software products.',
    rating: 4.9,
    enrolledStudents: 1670,
    isEnrolled: false,
    progressPercent: 0,
    modules: [
      { id: 'm1', title: '1. Modern React Architecture & State Management', duration: '40 mins', completed: false },
      { id: 'm2', title: '2. TypeScript Fundamentals for Production Apps', duration: '45 mins', completed: false }
    ]
  },
  {
    id: 'course-6',
    title: 'Growth Marketing & Performance Ads Playbook',
    instructor: 'Divya Nair',
    instructorRole: 'Head of Growth @ EcoLiving Brands',
    instructorAvatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80',
    duration: '5.5 Hours',
    totalLessons: 16,
    level: 'Intermediate',
    category: 'Digital Marketing',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    description: 'Scale your business using Meta Ads, Google Performance Max, UGC creators, and email retention funnels with measurable ROI.',
    rating: 4.8,
    enrolledStudents: 2310,
    isEnrolled: false,
    progressPercent: 0,
    modules: [
      { id: 'm1', title: '1. Setting Up Pixel Tracking & Conversion APIs', duration: '30 mins', completed: false },
      { id: 'm2', title: '2. Crafting High-Hook Video Creatives on a Budget', duration: '35 mins', completed: false }
    ]
  }
];

export const sampleQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'According to the 50/30/20 budgeting rule, what percentage of your net income should go towards essential living needs?',
    options: ['20%', '30%', '50%', '70%'],
    correctAnswer: 2,
    explanation: '50% of your take-home pay is allocated to mandatory needs such as housing, utility bills, groceries, and minimum debt payments.'
  },
  {
    id: 2,
    question: 'How many months of mandatory living expenses should ideally be kept in a liquid Emergency Fund for a freelance or solo business owner?',
    options: ['1 to 2 months', '3 to 6 months', '6 to 9 months', '24 months'],
    correctAnswer: 2,
    explanation: 'Because freelance and entrepreneurial income fluctuates, having 6 to 9 months of expenses ensures stability during client invoice delays or seasonal dips.'
  },
  {
    id: 3,
    question: 'What is Rupee-Cost Averaging when investing in Systematic Investment Plans (SIPs)?',
    options: [
      'Selling all shares when the market peaks',
      'Investing a fixed sum regularly, buying more units when prices drop and fewer when prices rise',
      'Borrowing money to purchase high-risk penny stocks',
      'Keeping all money in cash under your mattress'
    ],
    correctAnswer: 1,
    explanation: 'By investing a consistent sum every month, you automatically purchase more units when markets are down, lowering your average cost per unit over time.'
  },
  {
    id: 4,
    question: 'What credit score threshold is generally considered the gateway to prime interest rates and hassle-free business loans?',
    options: ['500+', '600+', '750+', '950+'],
    correctAnswer: 2,
    explanation: 'A CIBIL or Experian credit score of 750 and above is considered prime, unlocking lower loan interest margins and faster approvals.'
  }
];

export const userCertificates: Certificate[] = [
  {
    id: 'cert-1',
    courseTitle: 'Financial Independence & Wealth Architecture',
    issuedTo: 'Verified HerRise Scholar',
    issueDate: 'October 28, 2026',
    credentialId: 'HR-FIN-883492',
    instructorName: 'Rhea Shenoy, CA'
  },
  {
    id: 'cert-2',
    courseTitle: 'Digital Marketing & Community Commerce',
    issuedTo: 'Verified HerRise Scholar',
    issueDate: 'August 14, 2026',
    credentialId: 'HR-MKT-419082',
    instructorName: 'Divya Nair'
  }
];

export const personalized30DayPlan = [
  { week: 'Week 1', focus: 'Financial Foundations', task: 'Complete the 50/30/20 audit and set up automated SIP deposit' },
  { week: 'Week 2', focus: 'Market Discovery & Skill Gap', task: 'Review target role requirements and draft refreshed resume' },
  { week: 'Week 3', focus: 'Business / Portfolio Launch', task: 'Publish first product on HerMarket or submit 3 tailored job applications' },
  { week: 'Week 4', focus: 'Mentorship & Growth Expansion', task: 'Attend a live networking workshop and book 1:1 mentor strategy call' }
];

