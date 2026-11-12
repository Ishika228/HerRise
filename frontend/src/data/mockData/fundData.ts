import { FundingScheme, PitchDeckSlide } from '../../types';

export const initialFundingSchemes: FundingScheme[] = [
  {
    id: 'fund-1',
    title: 'Stree Shakti Women Enterprise Credit',
    provider: 'State Bank Group (Demo Scheme)',
    logo: '🏦',
    type: 'Bank Loan',
    amountRange: '₹2,00,000 - ₹25,00,000',
    minAmount: 200000,
    maxAmount: 2500000,
    interestRate: '8.15% - 9.40% p.a.',
    repaymentTenor: 'Up to 5 Years',
    eligibility: [
      'Woman entrepreneur holding minimum 51% ownership',
      'Business operational for at least 12 months',
      'Credit score 680+ with no major defaults',
      'Udyam / MSME registration certificate'
    ],
    documentsRequired: [
      'PAN & Aadhaar cards of all partners/directors',
      'Past 12 months business bank statement',
      'ITR filing / GST returns for previous fiscal year',
      'Proof of business premises (Rent agreement/Electricity bill)'
    ],
    processingTime: '7 - 10 working days',
    collateralRequired: false,
    stage: 'Early Stage',
    badge: 'Popular for Women Founders'
  },
  {
    id: 'fund-2',
    title: 'Mahila Udyami Growth Line',
    provider: 'Kinara Capital NBFC (Demo Partner)',
    logo: '⚡',
    type: 'NBFC Microloan',
    amountRange: '₹1,00,000 - ₹10,00,000',
    minAmount: 100000,
    maxAmount: 1000000,
    interestRate: '11.5% - 14.0% p.a.',
    repaymentTenor: '12 to 36 Months',
    eligibility: [
      'Women-owned manufacturing, retail, or service business',
      'Minimum monthly turnover of ₹50,000',
      'Digital banking records available',
      'No property collateral needed'
    ],
    documentsRequired: [
      'KYC documents of promoter',
      '6 months bank statement via Net Banking / Account Aggregator',
      'Storefront / workshop photo with geo-tag'
    ],
    processingTime: '48 - 72 Hours (Fast-track)',
    collateralRequired: false,
    stage: 'Early Stage',
    badge: 'Fast Disbursal'
  },
  {
    id: 'fund-3',
    title: 'HerRise Micro-Innovation Seed Grant',
    provider: 'HerRise Impact Foundation (Demo Cohort)',
    logo: '🌟',
    type: 'Women Empowerment Grant',
    amountRange: '₹50,000 - ₹3,00,000',
    minAmount: 50000,
    maxAmount: 300000,
    interestRate: '0% (Non-repayable Grant)',
    repaymentTenor: 'Milestone-based Grant',
    eligibility: [
      'Female-led startup in eco-crafts, green tech, education, or wellness',
      'Working MVP or initial sales demonstrated',
      'Commitment to attend 4 virtual mentorship workshops',
      'Clear social or community impact metrics'
    ],
    documentsRequired: [
      '2-minute video pitch or 6-slide deck',
      'Detailed budget expenditure plan',
      'Founder resume and identity proof'
    ],
    processingTime: '14 days after cohort review',
    collateralRequired: false,
    stage: 'Idea',
    badge: 'Equity-Free Grant'
  },
  {
    id: 'fund-4',
    title: 'Community Micro-Backer Campaign',
    provider: 'HerRise Crowdfunding Pool (Demo)',
    logo: '🤝',
    type: 'Crowdfunding',
    amountRange: '₹50,000 - ₹5,00,000',
    minAmount: 50000,
    maxAmount: 500000,
    interestRate: 'Reward / Pre-order based (0% Interest)',
    repaymentTenor: 'Fulfill pre-ordered products within 60 days',
    eligibility: [
      'Compelling consumer product ready for batch production',
      'Active social media or HerNetwork community presence',
      'Ability to offer tiered product rewards (e.g. Early Bird tin, VIP kit)'
    ],
    documentsRequired: [
      'High-quality product photos and prototypes',
      'Fulfillment roadmap & shipping estimates',
      'Creator verification video'
    ],
    processingTime: 'Instant campaign launch upon verification',
    collateralRequired: false,
    stage: 'Early Stage',
    badge: 'Pre-order Backing'
  },
  {
    id: 'fund-5',
    title: 'Angel Syndicate for Female Tech & D2C Founders',
    provider: 'SheVentures Angel Network (Demo)',
    logo: '💎',
    type: 'Angel/Equity',
    amountRange: '₹15,00,000 - ₹75,00,000',
    minAmount: 1500000,
    maxAmount: 7500000,
    interestRate: '5% - 10% Equity Dilution',
    repaymentTenor: 'Long-term equity partnership',
    eligibility: [
      'Scalable technology or tech-enabled brand',
      'Demonstrated monthly recurring revenue (MRR) of ₹2 Lakhs+',
      'Full-time female founder or co-founder',
      'Defensible market positioning'
    ],
    documentsRequired: [
      'Full Pitch Deck & 3-year Financial Model',
      'Cap table and incorporation certificates',
      'Customer retention & cohort analytics'
    ],
    processingTime: '3 - 6 weeks',
    collateralRequired: false,
    stage: 'Growth',
    badge: 'High Growth Equity'
  }
];

export const samplePitchDeckSlides: PitchDeckSlide[] = [
  {
    id: 1,
    title: 'The Problem',
    subtitle: 'The unmet need in the market',
    content: 'Mass commercial products use synthetic additives, non-recyclable plastic packaging, and exploit farm labor. Modern consumers lack transparent, authentic wellness options.',
    bulletPoints: [
      '84% of consumers struggle to find verifiable organic ingredients',
      'Over 200M single-use packaging containers end up in landfills monthly',
      'Smallholder female herb farmers receive less than 8% of retail shelf value'
    ]
  },
  {
    id: 2,
    title: 'The Solution',
    subtitle: 'Our unique value proposition',
    content: 'Small-batch, 100% natural infusions directly sourced from mountain women cooperatives in biodegradable airtight tins with full traceability.',
    bulletPoints: [
      'Farm-to-cup traceability QR codes on every package',
      'Zero-microplastic certified loose leaf botanicals',
      'Fair-share premium: 35% profit margin shared with farm cooperatives'
    ]
  },
  {
    id: 3,
    title: 'Market Opportunity',
    subtitle: 'Target Addressable Market (TAM)',
    content: 'The wellness and clean-label functional nutrition market represents a $4.2B opportunity in India alone, with 28% year-on-year growth among urban women consumers.',
    bulletPoints: [
      'TAM: $4.2 Billion (Holistic wellness beverages in South Asia)',
      'SAM: $750 Million (Urban premium herbal and botanical buyers)',
      'SOM: $15 Million (HerMarket, direct D2C, and corporate gifting)'
    ]
  },
  {
    id: 4,
    title: 'Business Model',
    subtitle: 'How we make money',
    content: 'Diversified revenue streams with high gross margins (65%+) and high customer lifetime value.',
    bulletPoints: [
      'Direct-to-Consumer e-commerce via website & HerMarket (₹499 AOV)',
      'Monthly Ritual Subscription Box (₹1,299/mo, 64% 90-day retention)',
      'Corporate wellness gifting hampers for women leadership events'
    ]
  },
  {
    id: 5,
    title: 'Financial Projections',
    subtitle: '3-Year Path to Scale',
    content: 'Disciplined capital efficiency with breakeven achieved in Month 11.',
    bulletPoints: [
      'Year 1 Revenue: ₹24 Lakhs (Gross Margin 64%, Breakeven Month 11)',
      'Year 2 Revenue: ₹75 Lakhs (EBITDA Positive at 18%)',
      'Year 3 Revenue: ₹2.1 Crores (Expanded retail & export presence)'
    ]
  },
  {
    id: 6,
    title: 'The Funding Ask',
    subtitle: 'Capital allocation & milestones',
    content: 'Seeking ₹10,00,000 seed funding / working capital to scale production batch capacity and customer acquisition.',
    bulletPoints: [
      '40% Inventory & automated tin sealing equipment',
      '30% Omni-channel digital marketing & creator seeding',
      '20% Working capital & farm cooperative advance purchases',
      '10% Regulatory certifications (USFDA & EU Organic)'
    ]
  }
];

export const documentChecklistData = [
  { id: 'doc-1', name: 'Identity Proof (Aadhaar / Passport)', status: 'Verified', required: true },
  { id: 'doc-2', name: 'PAN Card (Founder / Business Entity)', status: 'Verified', required: true },
  { id: 'doc-3', name: 'Bank Statement (Last 6-12 Months)', status: 'Uploaded', required: true },
  { id: 'doc-4', name: 'Udyam / MSME Registration Certificate', status: 'Pending', required: true },
  { id: 'doc-5', name: 'Business Pitch Deck / Project Summary', status: 'Drafting', required: false },
  { id: 'doc-6', name: 'Audited Financial Statements / ITR', status: 'Pending', required: false },
];

