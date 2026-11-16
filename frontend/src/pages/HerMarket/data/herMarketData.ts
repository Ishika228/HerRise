export interface HerMarketPackage {
  id: string;
  name: string;
  tagline: string;
  price: number;
  period: 'one-time' | 'monthly';
  targetCustomers: string;
  features: string[];
  recommended?: boolean;
  badge?: string;
  buttonText: string;
  popular?: boolean;
}

export interface HerMarketService {
  id: string;
  name: string;
  category: 'Design' | 'Development' | 'Marketing' | 'Content' | 'SEO';
  description: string;
  price: number;
  period: 'one-time' | 'monthly';
  image: string;
  features: string[];
  deliverables?: string[];
  popular?: boolean;
}

export interface HerMarketAddOn {
  id: string;
  name: string;
  price: number;
  period: 'one-time' | 'monthly';
  description: string;
}

export interface WebsiteTemplate {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  features: string[];
  startingPrice: number;
  previewImage: string;
  demoUrl?: string;
  tags: string[];
  highlights: string[];
}

export interface ServiceRequestItem {
  id: string;
  customerName: string;
  businessName: string;
  email: string;
  phone: string;
  category: string;
  location: string;
  selectedPackageName?: string;
  selectedPackagePrice?: number;
  servicesRequired: string[];
  hasWebsite: 'Yes' | 'No';
  hasLogo: 'Yes' | 'No';
  businessDescription: string;
  additionalRequirements: string;
  selectedAddOns: string[];
  oneTimeTotal: number;
  monthlyTotal: number;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Quotation Sent';
  requestDate: string;
  paymentDetails?: {
    method: 'Stripe' | 'Credit Card' | 'PayID';
    transactionId: string;
    amountPaid: number;
    status: 'Paid' | 'Simulated';
    paidAt: string;
  };
}

export interface ConsultationRequestItem {
  id: string;
  name: string;
  category: string;
  serviceNeeded: string;
  goals: string;
  preferredDate: string;
  createdAt: string;
  status: 'Scheduled' | 'Completed';
}

// Initial default packages in Australian Dollars (AUD)
export const initialPackages: HerMarketPackage[] = [
  {
    id: 'starter',
    name: 'STARTER – DIGITAL PRESENCE',
    tagline: 'Ideal foundation for small businesses, home studios, and sole traders.',
    price: 499,
    period: 'one-time',
    targetCustomers: 'Small businesses and home-based entrepreneurs',
    features: [
      '1–5 page responsive website',
      'Mobile-friendly design',
      'About Us page',
      'Services page',
      'Contact page',
      'WhatsApp & enquiry form',
      'Basic on-page SEO setup',
      'Google Maps listing link',
      '1 month technical support'
    ],
    buttonText: 'Choose Starter',
    recommended: false,
    badge: 'Starter Choice'
  },
  {
    id: 'growth',
    name: 'GROWTH – BUSINESS BOOSTER',
    tagline: 'Designed for expanding businesses ready to generate online leads and clients.',
    price: 999,
    period: 'one-time',
    targetCustomers: 'Businesses looking to grow their online presence',
    features: [
      'Up to 8 website pages',
      'Premium custom website design',
      'Product/service showcase gallery',
      'WhatsApp integration & quick contact',
      'Full SEO setup & meta tags',
      'Google Business Profile setup assistance',
      '5 social media promotional creatives',
      'Social media profile optimisation',
      '1 month technical support'
    ],
    buttonText: 'Choose Growth',
    recommended: true,
    badge: 'MOST POPULAR'
  },
  {
    id: 'premium',
    name: 'PREMIUM – COMPLETE DIGITAL GROWTH',
    tagline: 'Comprehensive digital infrastructure for established businesses and startups.',
    price: 1999,
    period: 'one-time',
    targetCustomers: 'Established businesses and growing startups',
    features: [
      'Up to 12 website pages',
      'Advanced responsive website build',
      'Product catalogue or booking enquiry system',
      'WhatsApp live contact integration',
      'Advanced on-page SEO & Schema markup',
      'Google Business Profile setup assistance',
      '10 branded social media creatives',
      '2 promotional video edits (Reels/TikTok)',
      'Digital marketing & brand strategy',
      'Google Analytics 4 setup',
      '3 months technical support'
    ],
    buttonText: 'Choose Premium',
    recommended: false,
    badge: 'COMPLETE SOLUTION'
  }
];

// Initial individual services in Australian Dollars (AUD)
export const initialServices: HerMarketService[] = [
  {
    id: 'srv-1',
    name: 'Logo Design',
    category: 'Design',
    description: 'Distinctive, versatile brand mark crafted to reflect your unique identity across print and digital media.',
    price: 99,
    period: 'one-time',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80',
    features: ['2 Creative Concepts', 'Vector SVG & PNG Formats', 'High-Res Print Files', 'Full Commercial Rights']
  },
  {
    id: 'srv-2',
    name: 'Business Card Design',
    category: 'Design',
    description: 'Double-sided modern business card design ready for print with QR code for digital contact sharing.',
    price: 49,
    period: 'one-time',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    features: ['Front & Back Layout', 'Print-Ready PDF + CMYK', 'Clickable QR Code', 'Editable Master File']
  },
  {
    id: 'srv-3',
    name: 'Social Media Poster',
    category: 'Design',
    description: 'Eye-catching promotional poster customized for Instagram, Facebook, and WhatsApp marketing campaigns.',
    price: 29,
    period: 'one-time',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    features: ['Story & Post Dimensions', 'High-Converting Copy Hints', 'Brand Palette Match', '24h Fast Turnaround']
  },
  {
    id: 'srv-4',
    name: 'Promotional Video Editing',
    category: 'Content',
    description: 'Engaging Reels and promotional video edits featuring punchy subtitles, royalty-free audio, and smooth motion.',
    price: 99,
    period: 'one-time',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
    features: ['Up to 60 Seconds Edit', 'Captions & Sound Design', 'Vertical 9:16 Video Format', '1 Revision Round']
  },
  {
    id: 'srv-5',
    name: 'Business Website',
    category: 'Development',
    description: 'Professional responsive company website with WhatsApp enquiry, fast loading speed, and modern styling.',
    price: 499,
    period: 'one-time',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    features: ['1–5 Responsive Pages', 'Mobile-First Layout', 'Contact Form + WhatsApp', 'Basic Search Engine Setup']
  },
  {
    id: 'srv-6',
    name: 'E-commerce Website',
    category: 'Development',
    description: 'Complete online storefront with product catalogue, cart checkout, inventory display, and payment gateway setup.',
    price: 1299,
    period: 'one-time',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=600&q=80',
    features: ['Product Catalogue & Filters', 'Cart & Order Management', 'Stripe / Card Setup', 'Customer Accounts']
  },
  {
    id: 'srv-7',
    name: 'SEO Services',
    category: 'SEO',
    description: 'Continuous search engine optimization to rank your business higher on Google and bring organic local leads.',
    price: 199,
    period: 'monthly',
    image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=600&q=80',
    features: ['Google Maps Local Ranking', 'Keyword & Competitor Audit', 'On-Page Meta Optimisation', 'Monthly Progress Report']
  },
  {
    id: 'srv-8',
    name: 'Social Media Management',
    category: 'Marketing',
    description: 'Consistent posting, branding, caption writing, hashtag strategy, and audience engagement across platforms.',
    price: 299,
    period: 'monthly',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80',
    features: ['12 Posts + Stories / Month', 'Content Calendar Plan', 'Caption Writing & Hashtags', 'Community Management']
  },
  {
    id: 'srv-9',
    name: 'Digital Marketing Campaign Management',
    category: 'Marketing',
    description: 'Targeted Google Ads & Meta (Instagram/Facebook) ad campaign setup and monitoring to generate real customer leads.',
    price: 399,
    period: 'monthly',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=600&q=80',
    features: ['Audience Targeting Strategy', 'Ad Creatives & Copywriting', 'A/B Performance Testing', 'Weekly ROI Tracking']
  }
];

// Optional Add-ons in Australian Dollars (AUD)
export const initialAddOns: HerMarketAddOn[] = [
  {
    id: 'addon-domain',
    name: 'Domain Registration Assistance',
    price: 49,
    period: 'one-time',
    description: 'Assistance and DNS configuration for your personalized .com.au, .com, or .store domain.'
  },
  {
    id: 'addon-hosting',
    name: 'Website Hosting Setup',
    price: 79,
    period: 'one-time',
    description: 'High-speed cloud server configuration, SSL certificate activation, and daily backups.'
  },
  {
    id: 'addon-pages',
    name: 'Extra Website Pages',
    price: 69,
    period: 'one-time',
    description: 'Additional custom-crafted web pages (portfolio, case studies, privacy, or careers).'
  },
  {
    id: 'addon-creatives',
    name: 'Additional Social Media Creatives (5 pack)',
    price: 89,
    period: 'one-time',
    description: '5 high-impact graphic design templates branded with your fonts and colors.'
  },
  {
    id: 'addon-video',
    name: 'Additional Promotional Videos (per video)',
    price: 99,
    period: 'one-time',
    description: 'Professional video cut, text overlay animations, and music sync for Instagram/TikTok.'
  },
  {
    id: 'addon-monthly-seo',
    name: 'Monthly SEO Retainer',
    price: 199,
    period: 'monthly',
    description: 'Ongoing technical maintenance, keyword tracking, and backlink recommendations.'
  },
  {
    id: 'addon-monthly-smm',
    name: 'Monthly Social Media Management',
    price: 299,
    period: 'monthly',
    description: 'Full monthly content pipeline, scheduled uploads, and comment replies.'
  },
  {
    id: 'addon-maintenance',
    name: 'Website Maintenance & Security',
    price: 129,
    period: 'monthly',
    description: 'Weekly software updates, security firewall monitoring, and up to 2 hours of revisions.'
  }
];

// 8 Website Solutions showcase in Australian Dollars (AUD)
export const initialWebsiteTemplates: WebsiteTemplate[] = [
  {
    id: 'web-1',
    title: 'Business Website',
    category: 'Corporate & Service',
    shortDesc: 'Credible, modern online presence for service firms, consultants, and agencies.',
    startingPrice: 499,
    previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    tags: ['Responsive', 'Fast Speed', 'Lead Forms'],
    features: ['5 custom pages', 'Interactive enquiry form', 'Trust badges & testimonials', 'WhatsApp live chat widget'],
    highlights: ['Clean layout tailored for conversion', 'Mobile-first Google score > 90', 'SSL encryption ready']
  },
  {
    id: 'web-2',
    title: 'E-commerce Website',
    category: 'Retail & Storefront',
    shortDesc: 'Sell physical or digital products smoothly with catalogue filters, carts, and Stripe checkout.',
    startingPrice: 1299,
    previewImage: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    tags: ['Cart & Checkout', 'Payment Gateway', 'Inventory'],
    features: ['Product catalogue with categories', 'Shopping cart & instant checkout', 'Stripe / Card gateway setup', 'Customer order email notifications'],
    highlights: ['Manage discounts & coupons easily', 'Shipping calculation setup', 'Automated tax receipts']
  },
  {
    id: 'web-3',
    title: 'Portfolio Website',
    category: 'Creative & Freelancers',
    shortDesc: 'Stunning visual showcase for photographers, designers, architects, and artists.',
    startingPrice: 449,
    previewImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    tags: ['High-Res Gallery', 'Minimalist', 'Client Showcase'],
    features: ['Lightbox image gallery', 'Client project case studies', 'Downloadable resume / deck', 'Direct booking form'],
    highlights: ['Silky-smooth transitions', 'Optimized for visual heavy media', 'Social media feed sync']
  },
  {
    id: 'web-4',
    title: 'Restaurant & Café Website',
    category: 'Food & Hospitality',
    shortDesc: 'Appetizing online menu, table reservation engine, and direct WhatsApp ordering.',
    startingPrice: 599,
    previewImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    tags: ['Digital Menu', 'Table Booking', 'WhatsApp Order'],
    features: ['Interactive digital menu with dietary tags', 'Direct WhatsApp ordering', 'Table reservation system', 'Google Maps location embed'],
    highlights: ['Mobile menu loads in under 1 second', 'Special offers banner', 'Instagram food gallery feed']
  },
  {
    id: 'web-5',
    title: 'Salon & Beauty Website',
    category: 'Lifestyle & Wellness',
    shortDesc: 'Elegant booking platform for beauty salons, spas, nail bars, and makeup studios.',
    startingPrice: 549,
    previewImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    tags: ['Service Menu', 'Appointment Requests', 'Lookbook'],
    features: ['Service pricing list with duration', 'Online appointment booking', 'Before & After lookbook', 'Bridal package enquiry'],
    highlights: ['Soft aesthetic design', 'Client reviews carousel', 'Staff stylist profiles']
  },
  {
    id: 'web-6',
    title: 'Coaching & Education Website',
    category: 'Learning & EdTech',
    shortDesc: 'Structured landing site for coaches, tutors, yoga instructors, and skill academies.',
    startingPrice: 649,
    previewImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    tags: ['Course Syllabus', 'Enrollment Form', 'Webinar Leads'],
    features: ['Course curriculum breakdown', 'Student testimonials & video reviews', 'Free webinar registration page', 'WhatsApp student support'],
    highlights: ['Lead capture magnet built-in', 'FAQ accordion for students', 'Certificate verification badge']
  },
  {
    id: 'web-7',
    title: 'Boutique Website',
    category: 'Fashion & Handcrafted',
    shortDesc: 'Artisanal boutique website highlighting fashion, custom tailoring, and luxury accessories.',
    startingPrice: 799,
    previewImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    tags: ['Collection Lookbook', 'Custom Sizing', 'Enquiry Modal'],
    features: ['Seasonal collection lookbook', 'Custom sizing request form', 'Story behind the makers', 'WhatsApp direct shopping'],
    highlights: ['Rich editorial typography', 'Zoomable fabric preview', 'Express WhatsApp checkout']
  },
  {
    id: 'web-8',
    title: 'Personal Brand Website',
    category: 'Influencers & Speakers',
    shortDesc: 'Build authority with a personal website for keynote speakers, authors, and founders.',
    startingPrice: 499,
    previewImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    tags: ['Media Kit', 'Speaking Inquiries', 'Podcast / Blog'],
    features: ['Speaker reel video embed', 'Media kit & press coverage', 'Newsletter signup form', 'Keynote booking calendar'],
    highlights: ['Authoritative personal branding', 'Podcast link integrations', 'Social proof counters']
  }
];

// Service requests start empty so users only see their own database-persisted orders
export const initialServiceRequests: ServiceRequestItem[] = [];

// Clean consultations start empty so only real user inquiries show
export const initialConsultations: ConsultationRequestItem[] = [];

// Local storage helper functions
export const STORAGE_KEYS = {
  PACKAGES: 'hermarket_digital_packages_aud',
  SERVICES: 'hermarket_digital_services_aud',
  ADDONS: 'hermarket_digital_addons_aud',
  REQUESTS: 'hermarket_service_requests_aud',
  CONSULTATIONS: 'hermarket_consultations_aud'
};

export const getStoredPackages = (): HerMarketPackage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PACKAGES);
    return raw ? JSON.parse(raw) : initialPackages;
  } catch {
    return initialPackages;
  }
};

export const saveStoredPackages = (data: HerMarketPackage[]) => {
  localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(data));
};

export const getStoredServices = (): HerMarketService[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICES);
    return raw ? JSON.parse(raw) : initialServices;
  } catch {
    return initialServices;
  }
};

export const saveStoredServices = (data: HerMarketService[]) => {
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(data));
};

export const getStoredRequests = (): ServiceRequestItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (raw) {
      if (raw.includes('REQ-1001') || raw.includes('Sarah Jenkins') || raw.includes('Chloe Sutherland') || raw.includes('Coastal Bloom')) {
        localStorage.removeItem(STORAGE_KEYS.REQUESTS);
        return [];
      }
      return JSON.parse(raw);
    }
    return [];
  } catch {
    return [];
  }
};

export const saveStoredRequests = (data: ServiceRequestItem[]) => {
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(data));
};

export const getStoredConsultations = (): ConsultationRequestItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
    if (raw) {
      if (raw.includes('CNS-201') || raw.includes('Emily Watson')) {
        localStorage.removeItem(STORAGE_KEYS.CONSULTATIONS);
        return [];
      }
      return JSON.parse(raw);
    }
    return [];
  } catch {
    return [];
  }
};

export const saveStoredConsultations = (data: ConsultationRequestItem[]) => {
  localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(data));
};

// Australian Dollar (AUD) formatting
export const formatAUD = (val: number): string => `A$${val.toLocaleString('en-AU')}`;
export const formatCurrency = formatAUD;
export const formatINR = formatAUD; // alias to prevent any breaks
