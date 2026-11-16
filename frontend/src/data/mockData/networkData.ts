import { Mentor, Workshop, CommunityPost } from '../../types';

// ─── Connection Interface ────────────────────────────────────────────────────
export interface Connection {
  id: string;
  name: string;
  avatar: string;
  profession: string;
  industry: string;
  status: 'connected' | 'mentor' | 'pending';
  connectedSince?: string;
}

// ─── Mentors ─────────────────────────────────────────────────────────────────
export const initialMentors: Mentor[] = [
  // ── Original 4 ──
  {
    id: 'mentor-1',
    name: 'Dr. Radhika Sen',
    designation: 'Managing Partner & Angel Investor',
    company: 'Saraswati Capital Ventures',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    industry: 'Investment & Venture Capital',
    experienceYears: 16,
    expertise: ['Seed Fundraising', 'Pitch Decks', 'Cap Table Management', 'Valuation Strategy'],
    languages: ['English', 'Hindi', 'Bengali'],
    bio: 'Passionate angel investor who has backed 24 women-led technology and consumer startups across India. Former Goldman Sachs Managing Director.',
    availability: 'Next available: Tomorrow, 4:00 PM',
    rating: 4.98,
    sessionsCompleted: 142,
    badges: ['Top Rated Mentor', 'Seed Investor']
  },
  {
    id: 'mentor-2',
    name: 'Pooja Verma',
    designation: 'Founder & CEO (₹12Cr Brand)',
    company: 'AuraBotanics Direct',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    industry: 'D2C & Retail E-commerce',
    experienceYears: 9,
    expertise: ['Product Sourcing', 'FSSAI & Packaging', 'D2C Supply Chains', 'HerMarket Scaling'],
    languages: ['English', 'Hindi'],
    bio: 'Started with ₹50,000 from her kitchen counter in 2020. Now operating a zero-waste wellness brand employing 35 rural women artisans and farmers.',
    availability: 'Next available: Friday, 6:00 PM',
    rating: 4.95,
    sessionsCompleted: 98,
    badges: ['Bootstrapped Founder', 'HerMarket Champion']
  },
  {
    id: 'mentor-3',
    name: 'Meenakshi Sundaram',
    designation: 'Head of Global Talent & Returnship Programs',
    company: 'CognitiveWave Tech',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
    industry: 'Tech & Career Coaching',
    experienceYears: 14,
    expertise: ['Career Restart Strategies', 'Resume Re-branding', 'Executive Salary Negotiation', 'Interview Confidence'],
    languages: ['English', 'Tamil', 'Hindi'],
    bio: 'Pioneered back-to-work returnship programs that have brought 400+ women back into technical and product leadership roles after extended family breaks.',
    availability: 'Next available: Thursday, 11:00 AM',
    rating: 5.0,
    sessionsCompleted: 215,
    badges: ['Career Relaunch Expert']
  },
  {
    id: 'mentor-4',
    name: 'Advocate Shalini Kulkarni',
    designation: 'Principal Corporate & IP Counsel',
    company: 'Kulkarni & Associates',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    industry: 'Legal & Intellectual Property',
    experienceYears: 12,
    expertise: ['Trademark Protection', 'Founder Agreements', 'MSME Registrations', 'Contract Vetting'],
    languages: ['English', 'Marathi', 'Hindi'],
    bio: 'Advises women founders on safeguarding their brand intellectual property, contracts with suppliers, and regulatory compliance.',
    availability: 'Next available: Monday, 3:00 PM',
    rating: 4.92,
    sessionsCompleted: 87,
    badges: ['Legal Specialist']
  },

  // ── New 4 ──
  {
    id: 'mentor-5',
    name: 'Ananya Krishnan',
    designation: 'Senior Engineering Manager',
    company: 'Infosys BPM',
    avatar: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=200&q=80',
    industry: 'IT & Technology',
    experienceYears: 11,
    expertise: ['Cloud Architecture', 'Women in Tech', 'Agile Leadership', 'System Design'],
    languages: ['English', 'Tamil', 'Kannada'],
    bio: 'Engineering manager leading a 40-person cloud team. Passionate about building technical pipelines for women re-entering STEM after career breaks.',
    availability: 'Next available: Wednesday, 7:00 PM',
    rating: 4.9,
    sessionsCompleted: 113,
    badges: ['Tech Mentor', 'STEM Champion']
  },
  {
    id: 'mentor-6',
    name: 'Ritika Malhotra',
    designation: 'Serial Entrepreneur & Business Strategist',
    company: 'Venture Studio India',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80',
    industry: 'Business & Entrepreneurship',
    experienceYears: 13,
    expertise: ['Business Model Design', 'Go-To-Market Strategy', 'B2B Sales', 'Scaling Operations'],
    languages: ['English', 'Hindi', 'Punjabi'],
    bio: 'Founded and exited two B2B SaaS companies. Now runs a venture studio that co-builds businesses with first-time women entrepreneurs from ideation to revenue.',
    availability: 'Next available: Saturday, 10:00 AM',
    rating: 4.87,
    sessionsCompleted: 76,
    badges: ['Serial Founder', 'Startup Coach']
  },
  {
    id: 'mentor-7',
    name: 'Deepa Rao',
    designation: 'Chartered Financial Analyst & Wealth Advisor',
    company: 'FinHer Advisory',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    industry: 'Finance & Wealth Management',
    experienceYears: 15,
    expertise: ['Personal Finance Planning', 'Mutual Fund Strategy', 'Tax Optimization', 'Financial Independence'],
    languages: ['English', 'Hindi', 'Telugu'],
    bio: 'CFA and SEBI-registered advisor dedicated to making financial planning accessible to women. Has helped 500+ women build their first investment portfolio.',
    availability: 'Next available: Tuesday, 5:30 PM',
    rating: 4.96,
    sessionsCompleted: 189,
    badges: ['CFA', 'Financial Literacy Champion']
  },
  {
    id: 'mentor-8',
    name: 'Nisha Patel',
    designation: 'Head of Growth & Digital Marketing',
    company: 'BrandWave Digital',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    industry: 'Marketing & Digital Media',
    experienceYears: 8,
    expertise: ['SEO & Content Strategy', 'Social Media Growth', 'Performance Marketing', 'Brand Building'],
    languages: ['English', 'Hindi', 'Gujarati'],
    bio: 'Digital marketing leader who has grown 15+ brands from zero to 100K followers. Specialises in low-budget growth strategies for women-owned micro-businesses.',
    availability: 'Next available: Sunday, 3:00 PM',
    rating: 4.85,
    sessionsCompleted: 64,
    badges: ['Growth Expert', 'Social Media Pro']
  }
];

// ─── Workshops ────────────────────────────────────────────────────────────────
export const initialWorkshops: Workshop[] = [
  // ── Original 3 ──
  {
    id: 'ws-1',
    title: 'Masterclass: Crafting an Investor-Ready Pitch Deck for Women Founders',
    mentorName: 'Dr. Radhika Sen',
    mentorRole: 'Angel Investor @ Saraswati Ventures',
    mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    date: 'Saturday, Nov 21, 2026',
    time: '5:00 PM - 6:30 PM IST',
    duration: '90 Mins',
    category: 'Fundraising',
    description: 'Deconstruct real winning pitch decks that secured ₹50L to ₹2Cr in early seed capital. Learn how to tell a compelling founder story without financial jargon.',
    attendeesCount: 238,
    isRegistered: true
  },
  {
    id: 'ws-2',
    title: 'Career Returnee Bootcamp: Navigating the Gap with Authority',
    mentorName: 'Meenakshi Sundaram',
    mentorRole: 'Head of Returnships @ CognitiveWave',
    mentorAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
    date: 'Wednesday, Nov 25, 2026',
    time: '6:30 PM - 8:00 PM IST',
    duration: '90 Mins',
    category: 'Career Growth',
    description: 'Transform your career gap into a competitive superpower. Live mock answers, LinkedIn profile revamp, and direct recruiter referral matchmaking.',
    attendeesCount: 312,
    isRegistered: false
  },
  {
    id: 'ws-3',
    title: 'Tax Planning & Business Accounting for Women Freelancers',
    mentorName: 'Rhea Shenoy, CA',
    mentorRole: 'Founder @ FinCoach Pro',
    mentorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    date: 'Sunday, Nov 29, 2026',
    time: '11:00 AM - 12:30 PM IST',
    duration: '90 Mins',
    category: 'Personal Finance',
    description: 'Understand Section 44ADA presumptive taxation, GST threshold limits, legal expense deductions, and how to legally cut your tax bill by up to 50%.',
    attendeesCount: 194,
    isRegistered: false
  },

  // ── New 3 ──
  {
    id: 'ws-4',
    title: 'Building Confidence in the Workplace: Speak Up, Stand Out',
    mentorName: 'Ritika Malhotra',
    mentorRole: 'Serial Entrepreneur @ Venture Studio India',
    mentorAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80',
    date: 'Tuesday, Dec 2, 2026',
    time: '7:00 PM - 8:30 PM IST',
    duration: '90 Mins',
    category: 'Leadership',
    description: 'Practical frameworks to overcome imposter syndrome, assert boundaries professionally, and build an executive presence that gets you noticed — without changing who you are.',
    attendeesCount: 156,
    isRegistered: false
  },
  {
    id: 'ws-5',
    title: 'Resume Building & Interview Prep: Land Your Dream Role in 30 Days',
    mentorName: 'Meenakshi Sundaram',
    mentorRole: 'Head of Returnships @ CognitiveWave',
    mentorAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
    date: 'Friday, Dec 5, 2026',
    time: '6:00 PM - 7:30 PM IST',
    duration: '90 Mins',
    category: 'Career Growth',
    description: 'Write a resume that passes ATS screening, craft a 60-second elevator pitch, and practise live mock interview rounds with real-time feedback from a returnship expert.',
    attendeesCount: 274,
    isRegistered: false
  },
  {
    id: 'ws-6',
    title: 'Digital Marketing for Entrepreneurs: Grow Your Brand on ₹0 Ad Budget',
    mentorName: 'Nisha Patel',
    mentorRole: 'Head of Growth @ BrandWave Digital',
    mentorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    date: 'Sunday, Dec 7, 2026',
    time: '4:00 PM - 5:30 PM IST',
    duration: '90 Mins',
    category: 'Marketing',
    description: 'Master organic Instagram, SEO-driven blog content, WhatsApp Business flows, and Google My Business — the exact playbook used to scale 15+ women-owned brands to 100K reach.',
    attendeesCount: 203,
    isRegistered: false
  }
];

// ─── Community Posts (Clean empty default - populated as users post) ────────
export const initialCommunityPosts: CommunityPost[] = [];

// ─── Success Stories (unchanged) ──────────────────────────────────────────────
export const successStoriesData = [
  {
    name: 'Kavita Joshi',
    role: 'From Homemaker to Founder of "AromaSoul"',
    location: 'Nagpur, Maharashtra',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    quote: 'HerRise gave me the pricing calculator and financial clarity I never had in school. Within 6 months of listing on HerMarket, I generated over ₹4.5 Lakhs in independent revenue.',
    metrics: '₹4.5L+ Revenue in 6 Months',
    moduleUsed: 'HerBusiness & HerMarket'
  },
  {
    name: 'Ritu Ganguly',
    role: 'Product Lead after a 4-Year Sabbatical',
    location: 'Kolkata / Remote',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    quote: 'The Career Returnship track and 1:1 mentorship helped me rewrite my resume and practice high-stakes interview answers. I secured a remote Product Lead role with a 35% salary jump.',
    metrics: 'Placed in 45 Days',
    moduleUsed: 'HerCareer & HerNetwork'
  },
  {
    name: 'Sneha Patel',
    role: 'Founder of CleanEats Kitchens',
    location: 'Ahmedabad, Gujarat',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    quote: 'We secured a ₹5,00,000 collateral-free women enterprise microloan through the HerFund comparison tool. It completely changed our cloud kitchen production capacity.',
    metrics: '₹5L Disbursed in 5 Days',
    moduleUsed: 'HerFund & HerFinance'
  }
];

// ─── Connections (Clean empty default - populated as users connect) ──────────
export const initialConnections: Connection[] = [];
