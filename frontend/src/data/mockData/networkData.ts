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

// ─── Community Posts ──────────────────────────────────────────────────────────
export const initialCommunityPosts: CommunityPost[] = [
  // ── Original 2 ──
  {
    id: 'post-1',
    authorName: 'Tanvi Deshmukh',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    authorRole: 'Founder, Mitti Handmade Pottery',
    timeAgo: '2 hours ago',
    category: 'Founder Win 🎉',
    content: "Thrilled to share that we just fulfilled our 500th order on HerMarket! 🌸 Three months ago, I was terrified to price my terracotta planters beyond ₹200. Following Mentor Pooja's advice on value-based pricing and eco packaging gave me the confidence to charge what our craftsmanship is truly worth. Keep going, sisters!",
    likes: 48,
    isLiked: false,
    comments: [
      {
        id: 'c-1',
        authorName: 'Kavita Menon',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        content: 'So inspiring Tanvi! Your packaging was gorgeous when I ordered the ceramic mug.',
        timeAgo: '1 hour ago'
      },
      {
        id: 'c-2',
        authorName: 'Meera Kulkarni',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        content: 'Huge congratulations! Value pricing is a game-changer.',
        timeAgo: '45 mins ago'
      }
    ]
  },
  {
    id: 'post-2',
    authorName: 'Priya Sundar',
    authorAvatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80',
    authorRole: 'Returning Software Engineer',
    timeAgo: '5 hours ago',
    category: 'Career Advice 💡',
    content: "Quick note to anyone dreading explaining a career break in interviews: I had a 3-year gap taking care of my twin toddlers. In today's final round interview, instead of being apologetic, I highlighted my time-management discipline, upskilling certifications, and volunteer website builds. The hiring manager praised my clarity and sent the offer letter an hour later! Own your story!",
    likes: 89,
    isLiked: true,
    comments: [
      {
        id: 'c-3',
        authorName: 'Sunita Rao',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        content: 'Needed to hear this today. Preparing for my first interview after 4 years tomorrow morning!',
        timeAgo: '3 hours ago'
      }
    ]
  },

  // ── New 2 ──
  {
    id: 'post-3',
    authorName: 'Anjali Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=80',
    authorRole: 'Product Manager, TechPath Solutions',
    timeAgo: '8 hours ago',
    category: 'Career Growth 🚀',
    content: "Big career win to celebrate with this community! 🎊 After attending Mentor Meenakshi's Resume Bootcamp, I completely rewrote my LinkedIn summary and applied the impact-first bullet point method. Result: 3 recruiter calls in one week after 6 months of silence. I also negotiated a 28% salary hike by using the BATNA framework she shared. This network is genuinely transforming careers. If you are hesitating to book a session, please do not. It is worth every rupee.",
    likes: 134,
    isLiked: false,
    comments: [
      {
        id: 'c-4',
        authorName: 'Ritu Ganguly',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
        content: 'This is incredible Anjali! The BATNA method is so underrated for salary negotiation.',
        timeAgo: '6 hours ago'
      },
      {
        id: 'c-5',
        authorName: 'Deepika Nair',
        authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
        content: 'Bookmarking this post. 28% jump is phenomenal — congratulations!',
        timeAgo: '5 hours ago'
      }
    ]
  },
  {
    id: 'post-4',
    authorName: 'Swati Nair',
    authorAvatar: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=200&q=80',
    authorRole: 'Self-Employed Artisan & HerFinance Graduate',
    timeAgo: '1 day ago',
    category: 'Financial Learning 💰',
    content: "Sharing something I genuinely wish someone had told me at 25: a SIP of just ₹2,000/month started today is worth more than ₹10,000/month started 10 years later - thanks to compounding. I completed the HerFinance financial literacy modules and booked a session with Mentor Deepa. She helped me set up my first MF portfolio in under an hour, completely aligned to my irregular freelance income cycle. No jargon, no pressure. Just practical money moves. Financial independence is for all of us - start wherever you are.",
    likes: 211,
    isLiked: false,
    comments: [
      {
        id: 'c-6',
        authorName: 'Preethi Iyer',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        content: 'The SIP compounding example just clicked for me. Setting up mine today!',
        timeAgo: '20 hours ago'
      },
      {
        id: 'c-7',
        authorName: 'Tanvi Deshmukh',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        content: 'Mentor Deepa is amazing! She helped me understand the difference between ELSS and PPF in one session.',
        timeAgo: '18 hours ago'
      }
    ]
  }
];

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

// ─── Connections ──────────────────────────────────────────────────────────────
export const initialConnections: Connection[] = [
  // 2 mentors
  {
    id: 'conn-1',
    name: 'Dr. Radhika Sen',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    profession: 'Managing Partner & Angel Investor',
    industry: 'Investment & Venture Capital',
    status: 'mentor',
    connectedSince: 'Oct 2026'
  },
  {
    id: 'conn-2',
    name: 'Meenakshi Sundaram',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
    profession: 'Head of Global Talent & Returnship Programs',
    industry: 'Tech & Career Coaching',
    status: 'mentor',
    connectedSince: 'Sep 2026'
  },

  // 4 connections
  {
    id: 'conn-3',
    name: 'Anjali Sharma',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=80',
    profession: 'Product Manager',
    industry: 'IT & Technology',
    status: 'connected',
    connectedSince: 'Nov 2026'
  },
  {
    id: 'conn-4',
    name: 'Swati Nair',
    avatar: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=200&q=80',
    profession: 'Self-Employed Artisan',
    industry: 'Handmade & Craft',
    status: 'connected',
    connectedSince: 'Oct 2026'
  },
  {
    id: 'conn-5',
    name: 'Ritu Ganguly',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    profession: 'Product Lead',
    industry: 'D2C & E-commerce',
    status: 'connected',
    connectedSince: 'Sep 2026'
  },
  {
    id: 'conn-6',
    name: 'Kavita Menon',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    profession: 'Freelance Content Strategist',
    industry: 'Marketing & Media',
    status: 'connected',
    connectedSince: 'Aug 2026'
  },

  // 2 pending
  {
    id: 'conn-7',
    name: 'Deepika Nair',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    profession: 'Financial Analyst',
    industry: 'Finance & Banking',
    status: 'pending'
  },
  {
    id: 'conn-8',
    name: 'Arjun Kapoor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    profession: 'Business Development Manager',
    industry: 'Business & Entrepreneurship',
    status: 'pending'
  }
];
