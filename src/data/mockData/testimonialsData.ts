export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  content: string;
  rating: number;
  highlight: string;
}

export const platformTestimonials: Testimonial[] = [
  {
    id: 't-1',
    name: 'Pooja Iyer',
    role: 'Founder, TerraCraft Decor',
    location: 'Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    content: 'HerRise AI brought all my fragmented business needs into one sanctuary. From planning startup budgets in HerBusiness to listing handcrafted ceramic ware on HerMarket, I achieved operational profitability in four months.',
    rating: 5,
    highlight: 'Operational profitability in 4 months'
  },
  {
    id: 't-2',
    name: 'Deepika Nair',
    role: 'Senior QA Analyst (Returned after 3-yr break)',
    location: 'Kochi (Remote)',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    content: 'Returning to tech after caring for my elderly parents seemed terrifying. The HerCareer resume builder and mock interview coach gave me the structure to showcase my real capabilities without hesitation.',
    rating: 5,
    highlight: 'Successfully returned to tech'
  },
  {
    id: 't-3',
    name: 'Suhani Malhotra',
    role: 'Freelance Financial Consultant & Investor',
    location: 'New Delhi',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
    content: 'The 50/30/20 budget planner and Emergency Fund tracker in HerFinance completely took away the anxiety of variable freelance income. I finally have 8 months of liquid safety cushion.',
    rating: 5,
    highlight: 'Built 8 months safety cushion'
  }
];

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const platformFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'What is HerRise AI, and who is it designed for?',
    answer: 'HerRise AI is a unified, all-in-one empowerment ecosystem tailored for women across every phase of their journey — aspiring entrepreneurs, corporate professionals, women returning to work after career breaks, students, and freelancers. It integrates financial management, career placement, startup creation, funding discovery, marketplace selling, curated education, and verified mentorship under one roof.'
  },
  {
    id: 'faq-2',
    category: 'Finance & Funding',
    question: 'How does HerFund help me find business loans and grants?',
    answer: 'HerFund provides side-by-side comparisons of women-centric financial instruments from verified public sector banks, NBFCs, and angel networks. You can evaluate collateral requirements, interest rates, eligibility criteria, and track documentation readiness with our pre-flight loan checklist.'
  },
  {
    id: 'faq-3',
    category: 'Career & Returnships',
    question: 'How does HerCareer support women returning after a career break?',
    answer: 'We offer specialized Career Returnship filters, resume templates with dedicated sections to confidently highlight sabbatical learnings, skill-gap analysis, and interview question guides addressing career pauses with authority.'
  },
  {
    id: 'faq-4',
    category: 'Marketplace',
    question: 'Can I sell my handmade products or freelance services on HerMarket?',
    answer: 'Yes! HerMarket allows female micro-entrepreneurs, artisans, and service providers to create high-converting digital storefronts with automated pricing calculators, inventory tracking, and order dashboards.'
  },
  {
    id: 'faq-5',
    category: 'Security & Languages',
    question: 'Is my data secure, and is the platform available in regional Indian languages?',
    answer: 'Yes. HerRise AI prioritizes privacy and financial dignity. The interface supports English, Hindi, and Marathi with localized resources, and client data is protected with enterprise-grade encryption principles.'
  }
];

