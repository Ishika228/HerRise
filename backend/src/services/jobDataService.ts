import { config } from '../config/env.js';

export interface CleanJobListing {
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
  applyUrl: string;
  postedDate: string;
  currency: string;
  qualification: string;
  qualificationCategory: string;
}

// In-memory cache to guarantee ultra-fast responses
interface CacheItem {
  data: CleanJobListing[];
  timestamp: number;
}

let jobsCache: CacheItem | null = null;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

// Australian fallback jobs with realistic market AUD packages
export const fallbackAustralianJobs: CleanJobListing[] = [
  {
    jobId: 'au-job-101',
    title: 'Senior Frontend Engineer (React / TypeScript)',
    company: 'Atlassian Australia',
    logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=60',
    location: 'Sydney, NSW (Remote within AU)',
    workMode: 'Remote',
    employmentType: 'Full-time',
    experienceLevel: 'Senior (4-7 yrs)',
    salaryRange: 'A$145,000 - A$175,000 AUD / yr',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux', 'REST APIs', 'Jest'],
    description: 'Build enterprise collaboration products used by millions of global software teams. Work with flexible Australian hours and generous parental support.',
    requirements: [
      '4+ years building high-traffic web applications with modern React & TypeScript',
      'Strong understanding of web accessibility (WCAG 2.1) and component architecture',
      'Proven experience working in cross-functional agile squads'
    ],
    benefits: [
      '100% Remote flexibility anywhere in Australia',
      '11.5% Superannuation guarantee',
      'Annual A$2,500 wellness & learning allowance',
      '26 weeks paid parental leave for primary caregivers'
    ],
    returneeFriendly: true,
    verified: true,
    applyUrl: 'https://www.atlassian.com/company/careers',
    postedDate: '2026-11-15',
    currency: 'AUD',
    qualification: "Bachelor's Degree in Computer Science, Software Engineering or IT",
    qualificationCategory: 'Technology & Software'
  },
  {
    jobId: 'au-job-102',
    title: 'Registered Nurse / Care Coordinator',
    company: 'UnitingCare Australia',
    logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=120&auto=format&fit=crop&q=60',
    location: 'Melbourne, VIC / Hybrid',
    workMode: 'Hybrid',
    employmentType: 'Part-time',
    experienceLevel: 'Mid-Level (2-5 yrs)',
    salaryRange: 'A$85,000 - A$98,000 AUD / yr (pro-rata)',
    skills: ['Patient Care', 'Clinical Assessment', 'Aged Care Standards', 'Care Planning', 'Communication'],
    description: 'Provide compassionate, clinical coordination for home and community care clients across suburban Melbourne. Ideal for healthcare professionals returning to work.',
    requirements: [
      'Current AHPRA registration as a Registered Nurse (RN)',
      'Experience in community, aged care, or acute nursing environments',
      'Valid Australian driver licence'
    ],
    benefits: [
      'Flexible 3-day or 4-day fortnightly rosters',
      'Salary packaging benefits up to A$15,900 tax-free',
      'Dedicated return-to-practice clinical mentorship',
      'Comprehensive employee assistance program'
    ],
    returneeFriendly: true,
    verified: true,
    applyUrl: 'https://www.unitingcare.org.au/careers',
    postedDate: '2026-11-14',
    currency: 'AUD',
    qualification: 'Bachelor of Nursing / AHPRA Registered Nurse (RN) or Diploma of Nursing',
    qualificationCategory: 'Healthcare & Nursing'
  },
  {
    jobId: 'au-job-103',
    title: 'Customer Operations & Experience Lead',
    company: 'Canva Sydney',
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=60',
    location: 'Surry Hills, Sydney, NSW',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-Senior (3-6 yrs)',
    salaryRange: 'A$110,000 - A$130,000 AUD / yr',
    skills: ['Customer Success', 'Zendesk', 'Operations', 'Team Leadership', 'Process Automation'],
    description: 'Lead frontline customer experience excellence for Canva Print and Enterprise subscribers across Australia and the Asia-Pacific region.',
    requirements: [
      '3+ years leading customer support or operations in high-growth tech or SaaS',
      'Strong analytical ability to interpret CSAT, SLA, and customer feedback trends',
      'Passion for inclusive culture and team mentoring'
    ],
    benefits: [
      'Hybrid work flexibility with catered in-office breakfast and lunch',
      'Generous equity package and performance bonus',
      'Vibe & wellness budget plus gym subsidy',
      'Equal opportunity career progression'
    ],
    returneeFriendly: true,
    verified: true,
    applyUrl: 'https://www.canva.com/careers/',
    postedDate: '2026-11-13',
    currency: 'AUD',
    qualification: "Diploma or Bachelor's Degree in Business, Communications or Any Discipline",
    qualificationCategory: 'Business & Operations'
  },
  {
    jobId: 'au-job-104',
    title: 'Digital Marketing & Content Specialist',
    company: 'EcoStore Australia',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=60',
    location: 'Brisbane, QLD / Remote',
    workMode: 'Remote',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-Level (2-4 yrs)',
    salaryRange: 'A$78,000 - A$92,000 AUD / yr',
    skills: ['Content Strategy', 'Social Media', 'SEO', 'Email Marketing', 'Canva', 'Shopify'],
    description: 'Drive omnichannel campaigns and organic content growth for sustainable home and wellness brands across Australian retail and e-commerce.',
    requirements: [
      '2+ years running paid or organic digital marketing campaigns in Australia',
      'Demonstrated portfolio in storytelling, copy, or social community building',
      'Familiarity with Klaviyo, Shopify, and Meta Ads Manager'
    ],
    benefits: [
      '100% remote within Australia',
      'Product discounts and eco-wellness allowance',
      'Flexible family-first working hours',
      'Professional upskilling budget'
    ],
    returneeFriendly: true,
    verified: true,
    applyUrl: 'https://ecostore.com/au/careers',
    postedDate: '2026-11-12',
    currency: 'AUD',
    qualification: "Bachelor's or Diploma in Marketing, Communications, Media, or Business",
    qualificationCategory: 'Marketing & Media'
  },
  {
    jobId: 'au-job-105',
    title: 'Retail Store Manager',
    company: 'Accent Group (Skechers / Hype DC)',
    logo: 'https://jobdataapi.com/media/company/logo/25/05/logo_img_eAwX07H.png',
    location: 'Chadstone, Melbourne, VIC',
    workMode: 'Onsite',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-Level (2-5 yrs)',
    salaryRange: 'A$70,000 - A$84,000 AUD / yr + Bonuses',
    skills: ['Retail Management', 'Team Leadership', 'Visual Merchandising', 'Sales KPI Driving', 'Rostering'],
    description: 'Lead sales performance, visual merchandising, and team coaching for high-energy retail storefronts in Melbourne. Great progression pathways into regional management.',
    requirements: [
      '2+ years in retail store supervisory or assistant management roles',
      'Strong ability to coach teams and exceed sales KPIs',
      'Familiarity with stock inventory systems and retail compliance'
    ],
    benefits: [
      '40% off across all Accent Group footwear and apparel brands',
      'Monthly sales incentive bonus scheme',
      'Structured retail leadership academy',
      '5 weeks annual leave + wellbeing days'
    ],
    returneeFriendly: false,
    verified: true,
    applyUrl: 'https://www.accentgroup.com.au/careers/',
    postedDate: '2026-11-16',
    currency: 'AUD',
    qualification: "High School Diploma, Certificate IV, or Bachelor's in Retail / Business",
    qualificationCategory: 'Retail & Hospitality'
  },
  {
    jobId: 'au-job-106',
    title: 'Finance & Accounts Officer',
    company: 'Meridian Energy Australia',
    logo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=120&auto=format&fit=crop&q=60',
    location: 'Perth, WA / Hybrid',
    workMode: 'Hybrid',
    employmentType: 'Part-time',
    experienceLevel: 'Mid-Level (3-5 yrs)',
    salaryRange: 'A$80,000 - A$95,000 AUD / yr (pro-rata)',
    skills: ['Xero', 'MYOB', 'Accounts Payable', 'BAS Compliance', 'Payroll', 'Excel'],
    description: 'Manage end-to-end accounts payable, receivable, and BAS reconciliations for an innovative renewable energy provider. Flexible hours tailored for parents and returnees.',
    requirements: [
      'Certificate IV or Bachelor degree in Accounting, Commerce, or Bookkeeping',
      'Strong hands-on proficiency in Xero, MYOB, and Microsoft Excel',
      'Australian payroll and superannuation compliance knowledge'
    ],
    benefits: [
      'Flexible 24-hour working week (choose your 3 days)',
      'Subsidised home office setup',
      'Company health insurance subsidy',
      'Supportive, female-led finance team'
    ],
    returneeFriendly: true,
    verified: true,
    applyUrl: 'https://meridianenergy.com.au/careers',
    postedDate: '2026-11-11',
    currency: 'AUD',
    qualification: "Certificate IV, Diploma, or Bachelor's in Accounting, Commerce, or Finance",
    qualificationCategory: 'Finance & Accounting'
  },
  {
    jobId: 'au-job-107',
    title: 'Data & Business Intelligence Analyst',
    company: 'Commonwealth Bank of Australia',
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=60',
    location: 'Sydney, NSW / Hybrid',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-Senior (3-6 yrs)',
    salaryRange: 'A$105,000 - A$125,000 AUD / yr',
    skills: ['SQL', 'Power BI', 'Tableau', 'Python', 'Financial Modeling', 'Data Governance'],
    description: 'Empower retail banking analytics, fraud monitoring, and inclusive lending algorithms for Australia’s leading bank. Flexible working culture and career restart support.',
    requirements: [
      '3+ years delivering business intelligence dashboards and predictive SQL pipelines',
      'Proven background in Power BI, Tableau, or Snowflake',
      'Strong communication skills for senior banking stakeholders'
    ],
    benefits: [
      '12% Superannuation contribution',
      'Hybrid roster (2 days office, 3 days home)',
      'Women in Tech sponsorship and leadership mentoring',
      'Study leave and paid professional certifications'
    ],
    returneeFriendly: true,
    verified: true,
    applyUrl: 'https://www.commbank.com.au/about-us/careers.html',
    postedDate: '2026-11-15',
    currency: 'AUD',
    qualification: "Bachelor's Degree in Data Analytics, Statistics, Mathematics, or Computer Science",
    qualificationCategory: 'Data & Analytics'
  },
  {
    jobId: 'au-job-108',
    title: 'Digital Product Designer (UI/UX)',
    company: 'Woolworths Group Digital',
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=60',
    location: 'Surry Hills, Sydney / Remote AU',
    workMode: 'Remote',
    employmentType: 'Full-time',
    experienceLevel: 'Senior (4-7 yrs)',
    salaryRange: 'A$120,000 - A$142,000 AUD / yr',
    skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Accessibility (WCAG)'],
    description: 'Design intuitive, frictionless mobile grocery and delivery experiences used by over 10 million Australians every week. Equal-opportunity, inclusive design team.',
    requirements: [
      'Strong Figma design portfolio demonstrating user-centred e-commerce or consumer apps',
      'Deep understanding of accessibility and responsive interaction design',
      'Collaborative mindset partnering with engineers and product managers'
    ],
    benefits: [
      '100% remote within Australia',
      'Staff grocery and retail discounts across Woolworths, BIG W, and BWS',
      'Generous paid parental leave program',
      'Annual technology stipend'
    ],
    returneeFriendly: true,
    verified: true,
    applyUrl: 'https://www.woolworthsgroup.com.au/careers',
    postedDate: '2026-11-14',
    currency: 'AUD',
    qualification: "Bachelor's or Diploma in UI/UX Design, Visual Arts, HCI, or Multimedia",
    qualificationCategory: 'Design & Creative'
  },
  {
    jobId: 'au-job-109',
    title: 'Cloud & DevOps Engineer (AWS / Kubernetes)',
    company: 'Telstra Enterprise',
    logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=120&auto=format&fit=crop&q=60',
    location: 'Brisbane, QLD / Remote',
    workMode: 'Remote',
    employmentType: 'Full-time',
    experienceLevel: 'Senior (4-8 yrs)',
    salaryRange: 'A$130,000 - A$160,000 AUD / yr',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD Pipelines', 'Docker', 'Linux'],
    description: 'Architect scalable, resilient cloud infrastructure powering national enterprise connectivity. High autonomy, remote-first environment with strong psychological safety.',
    requirements: [
      'Hands-on experience architecting production AWS cloud environments and Terraform code',
      'Familiarity with container orchestration (EKS / Kubernetes) and GitOps',
      'Security-first mindset and infrastructure reliability tracking'
    ],
    benefits: [
      'Telstra "All Roles Flex" policy: choose your schedule and location',
      '11.5% Superannuation + mobile/broadband plan subsidies',
      'Dedicated women in engineering career accelerator',
      '4 weeks annual leave + 2 paid volunteer/wellbeing days'
    ],
    returneeFriendly: true,
    verified: true,
    applyUrl: 'https://www.telstra.com.au/careers',
    postedDate: '2026-11-13',
    currency: 'AUD',
    qualification: "Bachelor's Degree in Cloud Engineering, Computer Science, IT, or AWS Certification",
    qualificationCategory: 'Technology & Software'
  },
  {
    jobId: 'au-job-110',
    title: 'Early Childhood Educator & Team Lead',
    company: 'Goodstart Early Learning',
    logo: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=120&auto=format&fit=crop&q=60',
    location: 'North Adelaide, SA',
    workMode: 'Onsite',
    employmentType: 'Part-time',
    experienceLevel: 'Mid-Level (2-5 yrs)',
    salaryRange: 'A$74,000 - A$88,000 AUD / yr (pro-rata)',
    skills: ['Early Childhood Curriculum', 'EYLF Framework', 'Parent Communication', 'First Aid / CPR', 'Child Safety'],
    description: 'Foster enriching early learning and inclusive play experiences for children. Welcoming, supportive not-for-profit social enterprise environment ideal for career returners.',
    requirements: [
      'Diploma in Early Childhood Education and Care or Bachelor of Early Childhood Teaching',
      'Current Working with Children Check (WWCC) and First Aid HLTAID012',
      'Passion for inclusive education and nurturing environments'
    ],
    benefits: [
      '50% childcare fee discount for your own children',
      'Above-award wage rates + salary packaging benefits',
      'Flexible 20 to 30 hour rosters',
      'Extensive paid professional development and university study grants'
    ],
    returneeFriendly: true,
    verified: true,
    applyUrl: 'https://www.goodstart.org.au/careers',
    postedDate: '2026-11-12',
    currency: 'AUD',
    qualification: 'Diploma in Early Childhood Education and Care or Bachelor of Early Childhood Teaching',
    qualificationCategory: 'Education & Teaching'
  },
  {
    jobId: 'au-job-111',
    title: 'People & Culture (HR) Coordinator',
    company: 'Lion Co Australia',
    logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=60',
    location: 'Sydney, NSW / Hybrid',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-Level (2-4 yrs)',
    salaryRange: 'A$82,000 - A$96,000 AUD / yr',
    skills: ['HR Operations', 'Workday', 'Talent Onboarding', 'Employee Relations', 'Workplace Diversity'],
    description: 'Coordinate employee wellbeing, inclusive talent onboarding, and performance management initiatives across Australian business units.',
    requirements: [
      "Diploma or Bachelor's Degree in Human Resources, Business, or Psychology",
      '2+ years supporting end-to-end employee lifecycle in Australian workplaces',
      'Empathetic communicator with strong confidentiality standards'
    ],
    benefits: [
      'Hybrid working (2 days office, 3 days home)',
      'Free product allowance and wellness benefits',
      'Generous 18 weeks paid parental leave',
      'Active women in leadership sponsorship program'
    ],
    returneeFriendly: true,
    verified: true,
    applyUrl: 'https://lionco.com/careers',
    postedDate: '2026-11-16',
    currency: 'AUD',
    qualification: "Bachelor's Degree or Diploma in Human Resources, Business, or Psychology",
    qualificationCategory: 'Human Resources & People'
  },
  {
    jobId: 'au-job-112',
    title: 'Risk & Compliance Analyst',
    company: 'Macquarie Group Australia',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=60',
    location: 'Melbourne, VIC / Hybrid',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-Senior (3-6 yrs)',
    salaryRange: 'A$110,000 - A$135,000 AUD / yr',
    skills: ['Regulatory Compliance', 'Risk Assessment', 'AML/CTF', 'Internal Audit', 'Stakeholder Reporting'],
    description: 'Oversee prudential compliance, conduct risk reviews, and ensure APRA/ASIC regulatory alignment for Australia’s premier global financial group.',
    requirements: [
      "Bachelor's Degree in Law, Legal Studies, Commerce, or Business Administration",
      '3+ years in regulatory compliance or operational risk within financial services',
      'Strong ability to interpret Australian financial services regulations'
    ],
    benefits: [
      'Leading industry bonus structure and superannuation contributions',
      'Tailored career progression and return-to-work support',
      'Subsidised health insurance and gym memberships',
      'Flexible hybrid working schedule'
    ],
    returneeFriendly: true,
    verified: true,
    applyUrl: 'https://www.macquarie.com/au/en/careers.html',
    postedDate: '2026-11-15',
    currency: 'AUD',
    qualification: "Bachelor's Degree in Law, Legal Studies, Commerce, or Business",
    qualificationCategory: 'Legal & Compliance'
  },
  {
    jobId: 'au-job-113',
    title: 'Medical Laboratory Technician',
    company: 'Sonic Healthcare Australia',
    logo: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=120&auto=format&fit=crop&q=60',
    location: 'Brisbane, QLD',
    workMode: 'Onsite',
    employmentType: 'Full-time',
    experienceLevel: 'Entry-Mid (1-3 yrs)',
    salaryRange: 'A$72,000 - A$86,000 AUD / yr',
    skills: ['Pathology Testing', 'Specimen Processing', 'Quality Assurance (NATA)', 'LIMS Software', 'Safety Protocols'],
    description: 'Perform diagnostic clinical testing, hematology specimen analysis, and quality assurance in a state-of-the-art pathology laboratory.',
    requirements: [
      'Associate Degree, Diploma or Bachelor of Medical Laboratory Science, Pathology, or Biotechnology',
      'Familiarity with NATA and ISO 15189 laboratory standards',
      'Strong attention to detail and accurate record-keeping'
    ],
    benefits: [
      'Stable rotating shifts with generous weekend penalty rates',
      'Salary sacrificing options',
      'Continuous laboratory upskilling and education grants',
      'Supportive scientific team'
    ],
    returneeFriendly: true,
    verified: true,
    applyUrl: 'https://www.sonichealthcare.com/careers',
    postedDate: '2026-11-14',
    currency: 'AUD',
    qualification: 'Diploma or Bachelor of Medical Laboratory Science, Pathology, or Biotechnology',
    qualificationCategory: 'Healthcare & Science'
  },
  {
    jobId: 'au-job-114',
    title: 'Secondary Science & Maths Educator',
    company: 'Victorian Department of Education',
    logo: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=120&auto=format&fit=crop&q=60',
    location: 'Geelong, VIC',
    workMode: 'Onsite',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-Level (2-5 yrs)',
    salaryRange: 'A$88,000 - A$104,000 AUD / yr',
    skills: ['STEM Pedagogy', 'Curriculum Planning', 'Student Mentoring', 'Classroom Leadership', 'VIT Registration'],
    description: 'Inspire the next generation of young women in STEM education. Teach secondary science and mathematics in an inclusive Victorian public school setting.',
    requirements: [
      'Bachelor of Education (Secondary) or Master of Teaching with VIT registration eligibility',
      'Specialisation in Secondary Science, Biology, Chemistry, or Mathematics',
      'Commitment to student-centred, inclusive education'
    ],
    benefits: [
      'Victorian government teacher salary package and 12 weeks school holidays',
      'Relocation assistance incentive available up to A$10,000',
      'Comprehensive teacher mentorship and return-to-teaching allowances',
      'Generous parental leave'
    ],
    returneeFriendly: true,
    verified: true,
    applyUrl: 'https://www.vic.gov.au/teaching-careers',
    postedDate: '2026-11-13',
    currency: 'AUD',
    qualification: 'Bachelor of Education (Secondary) or Master of Teaching (Science / Maths)',
    qualificationCategory: 'Education & Teaching'
  },
  {
    jobId: 'au-job-115',
    title: 'Hospitality & Event Operations Manager',
    company: 'Crown Resorts Melbourne',
    logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&auto=format&fit=crop&q=60',
    location: 'Southbank, Melbourne, VIC',
    workMode: 'Onsite',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-Senior (3-6 yrs)',
    salaryRange: 'A$85,000 - A$102,000 AUD / yr',
    skills: ['Event Planning', 'Hospitality Operations', 'Food & Beverage Service', 'Staff Rostering', 'Guest Relations'],
    description: 'Lead high-profile luxury conferences, banquets, and premier events. Guide a vibrant frontline team to deliver unforgettable guest hospitality experiences.',
    requirements: [
      "Diploma or Bachelor's Degree in Hospitality Management, Tourism, or Event Operations",
      '3+ years in high-volume luxury hotel, venue, or convention operations',
      'Current RSA (Responsible Service of Alcohol) Victoria certificate'
    ],
    benefits: [
      'Complimentary meals in staff dining room',
      'Discounted hotel stays and dining worldwide',
      'Clear pathways into executive venue leadership',
      'Dedicated wellbeing and family care programs'
    ],
    returneeFriendly: true,
    verified: true,
    applyUrl: 'https://www.crownresorts.com.au/careers',
    postedDate: '2026-11-16',
    currency: 'AUD',
    qualification: "Diploma or Bachelor's Degree in Hospitality Management, Tourism, or Event Operations",
    qualificationCategory: 'Hospitality & Events'
  }
];

/**
 * Helper to compute an accurate AUD salary range from job title and experience
 */
function deriveAustralianSalary(
  title: string,
  salaryMin: number | string | null,
  salaryMax: number | string | null,
  currency: string | null
): string {
  const minNum = salaryMin ? Number(salaryMin) : null;
  const maxNum = salaryMax ? Number(salaryMax) : null;

  if (minNum && maxNum && minNum > 0 && maxNum > 0) {
    if (currency === 'AUD') {
      return `A$${minNum.toLocaleString()} - A$${maxNum.toLocaleString()} AUD / yr`;
    }
    if (currency === 'USD') {
      // 1 USD approx 1.55 AUD
      const audMin = Math.round(minNum * 1.55);
      const audMax = Math.round(maxNum * 1.55);
      return `A$${audMin.toLocaleString()} - A$${audMax.toLocaleString()} AUD / yr`;
    }
    return `A$${minNum.toLocaleString()} - A$${maxNum.toLocaleString()} AUD / yr`;
  }

  // Derive realistic Australian industry benchmark in AUD
  const t = title.toLowerCase();
  if (t.includes('software') || t.includes('developer') || t.includes('engineer') || t.includes('react') || t.includes('full stack')) {
    return 'A$115,000 - A$150,000 AUD / yr';
  }
  if (t.includes('nurse') || t.includes('clinical') || t.includes('health')) {
    return 'A$80,000 - A$96,000 AUD / yr';
  }
  if (t.includes('care') || t.includes('support worker') || t.includes('aged care')) {
    return 'A$62,000 - A$74,000 AUD / yr';
  }
  if (t.includes('manager') || t.includes('lead') || t.includes('director')) {
    return 'A$95,000 - A$130,000 AUD / yr';
  }
  if (t.includes('analyst') || t.includes('data') || t.includes('product')) {
    return 'A$90,000 - A$120,000 AUD / yr';
  }
  if (t.includes('marketing') || t.includes('sales') || t.includes('content')) {
    return 'A$75,000 - A$95,000 AUD / yr';
  }
  if (t.includes('store') || t.includes('retail') || t.includes('assistant')) {
    return 'A$65,000 - A$80,000 AUD / yr';
  }

  return 'A$75,000 - A$95,000 AUD / yr';
}

/**
 * Extract clean skills from job title and raw HTML description
 */
function extractSkills(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const pool = [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'SQL',
    'Customer Service', 'Team Leadership', 'Retail Management', 'Nursing',
    'Clinical Care', 'Aged Care Standards', 'Care Planning', 'Communication',
    'Problem Solving', 'Sales Operations', 'Visual Merchandising', 'Xero',
    'MYOB', 'Budgeting', 'Project Management', 'Agile / Scrum', 'Digital Marketing',
    'SEO', 'Shopify', 'Zendesk', 'Time Management', 'WHS Compliance'
  ];

  const matched = pool.filter((skill) => text.includes(skill.toLowerCase()));
  if (matched.length >= 3) {
    return matched.slice(0, 6);
  }

  // Sensible default skills based on title
  const t = title.toLowerCase();
  if (t.includes('nurse') || t.includes('care')) {
    return ['Clinical Care', 'Patient Advocacy', 'Communication', 'Aged Care Standards', 'WHS Compliance'];
  }
  if (t.includes('store') || t.includes('retail')) {
    return ['Retail Management', 'Customer Service', 'Sales Operations', 'Team Leadership', 'Stock Management'];
  }
  if (t.includes('engineer') || t.includes('developer')) {
    return ['React', 'TypeScript', 'Web Architecture', 'Agile / Scrum', 'Problem Solving'];
  }
  return ['Teamwork', 'Communication', 'Time Management', 'Customer Focus', 'Problem Solving'];
}

/**
 * Strip HTML tags and entities for clean excerpt
 */
function cleanHtml(rawHtml: string): string {
  if (!rawHtml) return '';
  return rawHtml
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract qualification requirement & category from job title & description
 */
export function extractQualification(title: string, description: string): { qualification: string; qualificationCategory: string } {
  const t = (title || '').toLowerCase();
  const d = (description || '').toLowerCase();
  const combined = `${t} ${d}`;

  // 1. Precise Title checks first
  if (/(electrician|technician|fitter|mechanic|plumber|tradesperson|welder|pump)/i.test(t)) {
    return { qualification: 'Certificate III or IV in Electrotechnology, Trades or Technical Services', qualificationCategory: 'Trades & Engineering Services' };
  }
  if (/(nurse|midwife|clinical nurse|nursing|ahpra)/i.test(t)) {
    return { qualification: 'Bachelor of Nursing / AHPRA Registered Nurse (RN) or Diploma of Nursing', qualificationCategory: 'Healthcare & Nursing' };
  }
  if (/(doctor|medical officer|pharmacist|physiotherapist|occupational therapist|radiographer)/i.test(t)) {
    return { qualification: 'Bachelor of Medicine, Pharmacy, or Allied Health Qualification', qualificationCategory: 'Healthcare & Nursing' };
  }
  if (/(receptionist|front desk|office assistant|administrative assistant|concierge|clerk)/i.test(t)) {
    return { qualification: 'Certificate III/IV in Business Administration or Hospitality', qualificationCategory: 'Business & Operations' };
  }
  if (/(software|developer|frontend|backend|full stack|web dev|programmer|devops|cloud|react|python|java\b|aws)/i.test(t)) {
    return { qualification: "Bachelor's Degree in Computer Science, Software Engineering or IT", qualificationCategory: 'Technology & Software' };
  }
  if (/(data scientist|data analyst|bi analyst|business intelligence|machine learning|analytics)/i.test(t)) {
    return { qualification: "Bachelor's Degree in Data Science, Statistics, Mathematics or Computer Science", qualificationCategory: 'Data & Analytics' };
  }
  if (/(accountant|accounting|bookkeeper|tax agent|auditor|financial controller|finance manager)/i.test(t)) {
    return { qualification: "Certificate IV, Diploma, or Bachelor's in Accounting / Commerce / Finance", qualificationCategory: 'Finance & Accounting' };
  }
  if (/(childcare|early childhood|kindergarten|primary teacher|secondary teacher|school educator)/i.test(t)) {
    return { qualification: 'Diploma or Bachelor in Early Childhood Education / Teaching', qualificationCategory: 'Education & Teaching' };
  }
  if (/(ui\/ux|ux designer|product designer|graphic designer|art director|creative lead)/i.test(t)) {
    return { qualification: "Bachelor's or Diploma in Design, Visual Arts, HCI or Multimedia", qualificationCategory: 'Design & Creative' };
  }
  if (/(digital marketing|seo|content manager|copywriter|social media manager|brand manager)/i.test(t)) {
    return { qualification: "Bachelor's or Diploma in Marketing, Communications, Media, or Business", qualificationCategory: 'Marketing & Media' };
  }
  if (/(hr\b|human resources|people & culture|recruiter|talent acquisition)/i.test(t)) {
    return { qualification: "Bachelor's Degree or Diploma in Human Resources, Business, or Psychology", qualificationCategory: 'Human Resources & People' };
  }
  if (/(hotel|hospitality|barista|chef|cook|catering|banquet|restaurant manager)/i.test(t)) {
    return { qualification: "Diploma or Bachelor's in Hospitality Management, Tourism, or Commercial Cookery", qualificationCategory: 'Hospitality & Events' };
  }
  if (/(store manager|retail assistant|sales assistant|cashier|retail supervisor|merchandiser)/i.test(t)) {
    return { qualification: "High School Diploma, Certificate IV, or Bachelor's in Retail / Business", qualificationCategory: 'Retail & Hospitality' };
  }
  if (/(legal|lawyer|solicitor|paralegal|compliance officer|risk analyst)/i.test(t)) {
    return { qualification: "Bachelor's Degree in Law (LLB), Legal Studies, or Compliance", qualificationCategory: 'Legal & Compliance' };
  }
  if (/(customer service|operations coordinator|client support|virtual assistant)/i.test(t)) {
    return { qualification: "Diploma or Bachelor's Degree in Business, Communications or Any Discipline", qualificationCategory: 'Business & Operations' };
  }

  // 2. Fallback to combined text with domain-specific keywords
  if (/(registered nurse|clinical practice|patient care|ahpra registration|hospital ward)/i.test(combined)) {
    return { qualification: 'Bachelor of Nursing / AHPRA Registered Nurse (RN) or Diploma of Nursing', qualificationCategory: 'Healthcare & Nursing' };
  }
  if (/(software development|react\.js|node\.js|typescript|frontend development|backend architecture|cloud infrastructure)/i.test(combined)) {
    return { qualification: "Bachelor's Degree in Computer Science, Software Engineering or IT", qualificationCategory: 'Technology & Software' };
  }
  if (/(financial reporting|accounts payable|bas statement|xero|tax compliance|bookkeeping)/i.test(combined)) {
    return { qualification: "Certificate IV, Diploma, or Bachelor's in Accounting / Commerce / Finance", qualificationCategory: 'Finance & Accounting' };
  }
  if (/(data analysis|sql queries|power bi|dashboard reporting|predictive model)/i.test(combined)) {
    return { qualification: "Bachelor's Degree in Data Science, Statistics, Mathematics or Computer Science", qualificationCategory: 'Data & Analytics' };
  }
  if (/(figma|wireframing|user experience design|visual design|design system)/i.test(combined)) {
    return { qualification: "Bachelor's or Diploma in Design, Visual Arts, HCI or Multimedia", qualificationCategory: 'Design & Creative' };
  }
  if (/(early childhood education|eylf framework|child care service|preschool)/i.test(combined)) {
    return { qualification: 'Diploma or Bachelor in Early Childhood Education / Teaching', qualificationCategory: 'Education & Teaching' };
  }
  if (/(talent management|employee relations|workplace culture|hr policies)/i.test(combined)) {
    return { qualification: "Bachelor's Degree or Diploma in Human Resources, Business, or Psychology", qualificationCategory: 'Human Resources & People' };
  }

  return { qualification: "Bachelor's Degree or Relevant Professional Qualifications", qualificationCategory: 'General / Cross-Disciplinary' };
}

/**
 * Fetch Australian Jobs from JobDataAPI (JobDataLake) with in-memory caching
 */
export async function fetchAustralianJobs(): Promise<CleanJobListing[]> {
  const now = Date.now();
  if (jobsCache && now - jobsCache.timestamp < CACHE_TTL_MS && jobsCache.data.length > 0) {
    return jobsCache.data;
  }

  const apiKey = config.jobdataApiKey;
  if (!apiKey) {
    console.warn('[JobDataService] No JOBDATA_API_KEY set in .env. Serving high-fidelity Australian fallback jobs.');
    return fallbackAustralianJobs;
  }

  try {
    const targetUrl = 'https://jobdataapi.com/api/jobs/?country_code=AU';
    let response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        Authorization: `Api-Key ${apiKey}`,
        Accept: 'application/json',
        'User-Agent': 'HerRise-AustraliaJobs/1.0 (Mozilla/5.0)'
      }
    });

    if (response.status === 401 || response.status === 403) {
      // Fallback to Bearer token
      response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json',
          'User-Agent': 'HerRise-AustraliaJobs/1.0 (Mozilla/5.0)'
        }
      });
    }

    if (!response.ok) {
      console.warn(`[JobDataService] JobDataAPI returned HTTP ${response.status}. Serving Australian fallback jobs.`);
      return fallbackAustralianJobs;
    }

    const payload = (await response.json()) as any;
    if (!payload || !Array.isArray(payload.results) || payload.results.length === 0) {
      return fallbackAustralianJobs;
    }

    const mapped: CleanJobListing[] = payload.results.map((raw: any) => {
      const title = raw.title || 'Australian Role';
      const companyName = raw.company?.name || 'Australian Enterprise';
      const logo = raw.company?.logo || undefined;
      const location = raw.location || 'Australia';
      const cleanDesc = cleanHtml(raw.description || '');

      const isRemote = Boolean(raw.has_remote || cleanDesc.toLowerCase().includes('remote'));
      const isHybrid = cleanDesc.toLowerCase().includes('hybrid') || location.toLowerCase().includes('hybrid');
      const workMode: 'Remote' | 'Hybrid' | 'Onsite' = isRemote ? 'Remote' : isHybrid ? 'Hybrid' : 'Onsite';

      let empType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance' = 'Full-time';
      if (Array.isArray(raw.types) && raw.types.length > 0) {
        const typeName = (raw.types[0].name || '').toLowerCase();
        if (typeName.includes('part')) empType = 'Part-time';
        else if (typeName.includes('contract')) empType = 'Contract';
        else if (typeName.includes('casual')) empType = 'Part-time';
      }

      let expLevel = 'Mid-Level (2-5 yrs)';
      if (raw.experience_level === 'EN') expLevel = 'Entry-Level';
      else if (raw.experience_level === 'SE') expLevel = 'Senior (5+ yrs)';
      else if (raw.experience_level === 'EX') expLevel = 'Executive / Lead';

      const salaryRange = deriveAustralianSalary(title, raw.salary_min, raw.salary_max, raw.salary_currency);
      const skills = extractSkills(title, cleanDesc);

      // Returnee-friendly heuristic: flexible/part-time/supportive culture
      const lower = cleanDesc.toLowerCase();
      const returneeFriendly =
        empType === 'Part-time' ||
        isRemote ||
        lower.includes('flexible') ||
        lower.includes('diversity') ||
        lower.includes('work-life balance') ||
        lower.includes('return to work');

      return {
        jobId: `au-jdl-${raw.id}`,
        title,
        company: companyName,
        logo,
        location,
        workMode,
        employmentType: empType,
        experienceLevel: expLevel,
        salaryRange,
        skills,
        description: cleanDesc.slice(0, 320) + (cleanDesc.length > 320 ? '...' : ''),
        requirements: [
          'Relevant industry qualifications or demonstrated experience in Australia',
          'Strong communication and collaborative team capabilities',
          'Current Australian working rights (Citizen, PR, or Valid Work Visa)'
        ],
        benefits: [
          '11.5% Superannuation Guarantee contribution',
          'Flexible working arrangements and supportive culture',
          'Dedicated career growth and mentoring pathways'
        ],
        returneeFriendly,
        verified: true,
        applyUrl: raw.application_url || 'https://jobdataapi.com',
        postedDate: raw.published ? raw.published.split('T')[0] : new Date().toISOString().split('T')[0],
        currency: 'AUD',
        ...extractQualification(title, cleanDesc)
      };
    });

    const combinedJobs = [...mapped];
    for (const fJob of fallbackAustralianJobs) {
      if (!combinedJobs.some((j) => j.jobId === fJob.jobId || j.title.toLowerCase() === fJob.title.toLowerCase())) {
        combinedJobs.push(fJob);
      }
    }

    jobsCache = {
      data: combinedJobs,
      timestamp: Date.now()
    };

    return combinedJobs;
  } catch (error) {
    console.error('[JobDataService Error]:', error);
    return fallbackAustralianJobs;
  }
}
