import { Mentor, Workshop, CommunityPost } from '../../types';

export const initialMentors: Mentor[] = [
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
  }
];

export const initialWorkshops: Workshop[] = [
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
  }
];

export const initialCommunityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'Tanvi Deshmukh',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    authorRole: 'Founder, Mitti Handmade Pottery',
    timeAgo: '2 hours ago',
    category: 'Founder Win 🎉',
    content: 'Thrilled to share that we just fulfilled our 500th order on HerMarket! 🌸 Three months ago, I was terrified to price my terracotta planters beyond ₹200. Following Mentor Pooja’s advice on value-based pricing and eco packaging gave me the confidence to charge what our craftsmanship is truly worth. Keep going, sisters!',
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
    content: 'Quick note to anyone dreading explaining a career break in interviews: I had a 3-year gap taking care of my twin toddlers. In today’s final round interview, instead of being apologetic, I highlighted my time-management discipline, upskilling certifications, and volunteer website builds. The hiring manager praised my clarity and sent the offer letter an hour later! Own your story!',
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
  }
];

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

