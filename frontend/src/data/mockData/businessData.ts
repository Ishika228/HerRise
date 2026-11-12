import { BusinessIdea, BusinessPlan, RoadmapMilestone } from '../../types';

export const curatedBusinessIdeas: BusinessIdea[] = [
  {
    id: 'idea-1',
    title: 'Artisanal Organic Herbal Tea & Botanicals',
    category: 'Food & Wellness D2C',
    description: 'Direct-to-consumer wellness blends crafted from indigenous mountain herbs, packaged in 100% biodegradable zero-waste tins.',
    initialInvestment: '₹40,000 - ₹75,000',
    profitMargin: '45% - 60%',
    difficulty: 'Beginner',
    tags: ['E-commerce', 'Home-based', 'High Margin', 'Eco-friendly'],
    potentialRevenue: '₹90,000 - ₹1,80,000 / month',
    keySteps: [
      'Source organic certified herbs from verified regional farmer collectives',
      'Obtain basic FSSAI registration & design sustainable packaging',
      'Launch on HerMarket & Instagram with wellness creator tasting bundles',
      'Establish corporate wellness gifting subscription boxes'
    ]
  },
  {
    id: 'idea-2',
    title: 'Virtual Administrative & Executive Support Agency',
    category: 'B2B Professional Services',
    description: 'High-touch remote executive assistance, bookkeeping, customer onboarding, and diary management for busy women executives and founders.',
    initialInvestment: '₹15,000 - ₹30,000',
    profitMargin: '70% - 85%',
    difficulty: 'Beginner',
    tags: ['Zero Inventory', 'Remote Work', 'Recurring Retainers', 'Scalable'],
    potentialRevenue: '₹80,000 - ₹2,50,000 / month',
    keySteps: [
      'Master Notion, Google Workspace, Loom, and QuickBooks integrations',
      'Define 3 tiered packages (Starter 10 hrs/wk, Growth 25 hrs/wk, Retainer)',
      'Network on LinkedIn and pitch 15 vetted female founders',
      'Subcontract and train fellow women as client demands expand'
    ]
  },
  {
    id: 'idea-3',
    title: 'Handcrafted Soy Wax Scented Candles & Home Decor',
    category: 'Handmade & Lifestyle',
    description: 'Eco-conscious aromatherapy candles poured in reusable ceramic pottery, enriched with therapeutic essential oils and wooden wicks.',
    initialInvestment: '₹25,000 - ₹50,000',
    profitMargin: '50% - 65%',
    difficulty: 'Beginner',
    tags: ['Artisanal', 'Creative', 'Gifting', 'Fast Turnaround'],
    potentialRevenue: '₹60,000 - ₹1,40,000 / month',
    keySteps: [
      'Procure soy flakes, therapeutic oils, and artisan pots in wholesale batches',
      'Perfect scent formulations with 4 signature signature moods',
      'Set up HerMarket storefront with HD video reels demonstrating flame & fragrance throw',
      'Partner with boutique home cafes and wedding planners for return favors'
    ]
  },
  {
    id: 'idea-4',
    title: 'Personal Financial Coaching for Young Women & Couples',
    category: 'Education & Coaching',
    description: '1-on-1 and cohort-based financial literacy mentorship, demystifying savings, budgeting, insurance planning, and first-time investments.',
    initialInvestment: '₹10,000 - ₹25,000',
    profitMargin: '85% - 95%',
    difficulty: 'Moderate',
    tags: ['High Value', 'Community Impact', 'Digital Products'],
    potentialRevenue: '₹75,000 - ₹2,20,000 / month',
    keySteps: [
      'Obtain NISM certification or HerRise Financial Coach credential',
      'Create free downloadable budget spreadsheet as lead magnet',
      'Host monthly free 45-minute webinar on demystifying money',
      'Convert attendees into 6-week intensive 1:1 accountability packages'
    ]
  }
];

export const sampleBusinessPlan: BusinessPlan = {
  businessName: 'HerRise Venture Project',
  tagline: 'Sustainable & Mindful Products for Daily Wellness and Conscious Living',
  category: 'Food & Wellness D2C',
  problemStatement: 'Modern urban working professionals face severe daily stress, disrupted sleep cycles, and digestive issues. Commercial tea bags use bleached paper, micro-plastics, artificial flavor oils, and low-grade dust with negligible therapeutic benefits.',
  solution: 'Our venture produces small-batch, loose-leaf wellness infusions combining whole botanicals (ashwagandha, chamomile, tulsi, rhododendron petals) packaged in airtight, UV-blocking biodegradable tins with direct farmer transparency.',
  targetAudience: 'Health-conscious women aged 24-48, working professionals, yoga practitioners, and corporate gifting managers seeking premium clean-label daily self-care.',
  marketOpportunity: 'The South Asian herbal and functional wellness market is projected at $4.2B with a 16.4% CAGR, driven by natural preventative health priorities.',
  competitorAnalysis: 'Mass-market green teas compete purely on discounted price with synthetic aromas. Premium boutique brands are often overpriced imported imports. Our venture occupies the accessible-luxury niche with authentic indigenous Ayurvedic sourcing.',
  revenueModel: 'Direct-to-Consumer e-commerce via HerMarket and website (70%), Monthly recurring wellness subscription club (18%), Corporate wellness and holiday gifting bundles (12%).',
  pricingStrategy: 'Tiered value pricing: Single 100g tin at ₹499 (cost to produce ₹165, gross margin 67%). 3-Tin Ritual Box at ₹1,299. Corporate customized tins at ₹380/unit on 100+ MOQ.',
  marketingStrategy: 'Micro-influencer sampling with certified nutritionists, Instagram reels on daily mindful morning routines, content marketing on sleep hygiene, and HerRise Marketplace featured showcase.',
  startupCosts: [
    { item: 'Bulk Organic Botanicals & Herbs Initial Inventory', cost: 28000 },
    { item: 'Custom Tin Packaging & Biodegradable Labels (500 units)', cost: 14000 },
    { item: 'FSSAI License, Legal & Trademark Registration', cost: 7500 },
    { item: 'Product Photography & Branding Kit', cost: 6500 },
    { item: 'Digital Marketing & Creator Seeding Budget', cost: 12000 },
    { item: 'Contingency / Cashflow Cushion', cost: 10000 }
  ],
  projectedRevenueYear1: 1850000
};

export const launchRoadmap: RoadmapMilestone[] = [
  {
    day: 1,
    phase: 'Week 1: Clarification & Validation',
    title: 'Define Customer Persona & Core Value Proposition',
    description: 'Interview 10 potential target customers to validate the real pain point before purchasing any raw materials.',
    completed: true
  },
  {
    day: 5,
    phase: 'Week 1: Clarification & Validation',
    title: 'Finalize Minimum Viable Product (MVP) Offering',
    description: 'Pare down product line to 2-3 hero items rather than launching with 15 complex variants.',
    completed: true
  },
  {
    day: 10,
    phase: 'Week 2: Sourcing & Costing',
    title: 'Lock Supplier Pricing & Packaging Samples',
    description: 'Calculate exact unit economics (Cost of Goods Sold + shipping + packaging) to ensure at least 50% gross margin.',
    completed: true
  },
  {
    day: 14,
    phase: 'Week 2: Sourcing & Costing',
    title: 'Acquire Necessary Registrations (GST / MSME / FSSAI)',
    description: 'Register as an Udyam micro-enterprise (free government portal) to unlock women entrepreneur priority banking.',
    completed: false
  },
  {
    day: 20,
    phase: 'Week 3: Digital Presence & Launch Assets',
    title: 'Set Up HerMarket Storefront & High-Res Product Visuals',
    description: 'Photograph products in natural daylight with clean backgrounds; write empathetic benefits-focused descriptions.',
    completed: false
  },
  {
    day: 25,
    phase: 'Week 4: Pre-Launch & Community Seeding',
    title: 'Initiate VIP Waitlist & Send 10 Influencer Gift Kits',
    description: 'Generate authentic early testimonials and social proof before public checkout goes live.',
    completed: false
  },
  {
    day: 30,
    phase: 'Week 4: Public Launch & Scaling',
    title: 'Official Launch Day & First 25 Customer Milestone',
    description: 'Host a live launch showcase, activate promo discount code, and collect immediate video feedback.',
    completed: false
  }
];

