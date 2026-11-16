/**
 * HerRise Frontend AI Assistant Knowledge & Reasoning Service
 * Ensures appropriate, structured, and actionable answers across all platform disciplines.
 */

export interface AssistantAnswer {
  title: string;
  response: string;
  suggestedActions?: Array<{ label: string; actionPath: string }>;
}

interface TitleInfo {
  id: string;
  label: string;
  icon: string;
  role: string;
  specialty: string;
  path: string;
}

const TITLE_REGISTRY: Record<string, TitleInfo> = {
  general: {
    id: 'general',
    label: 'All-in-One Advisor',
    icon: '✨',
    role: 'Universal Copilot',
    specialty: 'holistic cross-discipline advice across finance, career, business, funding, and marketing',
    path: '/assistant'
  },
  finance: {
    id: 'finance',
    label: 'HerFinance Advisor',
    icon: '💰',
    role: 'Financial Planning & Wealth Specialist',
    specialty: 'personal budgeting (50/30/20 rule), emergency funds, SIP investments, savings goals, and expense tracking',
    path: '/finance'
  },
  career: {
    id: 'career',
    label: 'HerCareer Coach',
    icon: '💼',
    role: 'Career Strategy & ATS Resume Coach',
    specialty: 'resume building, ATS optimization, explaining career breaks, interview preparation, and salary negotiations',
    path: '/career'
  },
  business: {
    id: 'business',
    label: 'HerBusiness Strategist',
    icon: '🚀',
    role: 'Venture & Business Development Strategist',
    specialty: 'high-margin business ideas, unit economics, 55%+ pricing formulas, and customer acquisition',
    path: '/business'
  },
  fund: {
    id: 'fund',
    label: 'HerFund Guide',
    icon: '🏛️',
    role: 'Government Schemes & Funding Specialist',
    specialty: 'government loans (Mudra, Stand-Up India, SIDBI), subsidies, collateral-free credit, and 6-slide investor pitch decks',
    path: '/fund'
  },
  market: {
    id: 'market',
    label: 'HerMarket Optimizer',
    icon: '🛍️',
    role: 'E-Commerce & Digital Marketplace Specialist',
    specialty: 'storefront optimization, compelling product copywriting, fragile item packaging, and customer retention',
    path: '/market'
  }
};

function detectTargetDiscipline(q: string): string | null {
  // 1. Career (resumes, gaps, interviews, hiring, promotions)
  if (
    /\b(resume|cv|ats|interview|interviews|career|job|jobs|hiring|hire|recruiter|recruiters|sabbatical|maternity|childcare|promotion|promotions|raise|counteroffer)\b/i.test(q) ||
    q.includes('career break') ||
    q.includes('career gap') ||
    q.includes('gap in') ||
    q.includes('comeback') ||
    q.includes('restart') ||
    q.includes('work experience') ||
    q.includes('summary rewrite') ||
    q.includes('bullet point') ||
    (q.includes('salary') && !q.includes('budget'))
  ) {
    return 'career';
  }

  // 2. Finance (budgeting, 50/30/20, emergency funds, SIP, FD, savings, expenses)
  if (
    /\b(budget|budgeting|sip|sips|fd|fds|invest|investing|investment|investments|savings|saving|expense|expenses|spend|spending|emergency fund|compound interest)\b/i.test(q) ||
    q.includes('50/30/20') ||
    q.includes('mutual fund') ||
    q.includes('fixed deposit') ||
    q.includes('safety fund') ||
    q.includes('rainy day') ||
    q.includes('how to save') ||
    q.includes('cut cost') ||
    q.includes('money management')
  ) {
    return 'finance';
  }

  // 3. Fund (government schemes, Mudra, Stand-Up India, loans, subsidies, pitch decks)
  if (
    /\b(loan|loans|grant|grants|scheme|schemes|subsid|subsidy|subsidies|mudra|sidbi|stand-up|pmmy|pitch deck|angel|investor|investors)\b/i.test(q) ||
    q.includes('stand up india') ||
    q.includes('bank loan') ||
    q.includes('business loan') ||
    q.includes('raise capital') ||
    q.includes('seed capital') ||
    q.includes('pitch presentation')
  ) {
    return 'fund';
  }

  // 4. Market (storefronts, e-commerce, product copy, packaging, repeat orders)
  if (
    /\b(packaging|package|packages|storefront|store|product description|copywriting|marketplace|e-commerce|unboxing|fragile|repeat order|retention|candle|candles)\b/i.test(q) ||
    q.includes('bubble wrap') ||
    q.includes('glass packaging') ||
    q.includes('how to sell') ||
    q.includes('repeat customer') ||
    q.includes('hermarket')
  ) {
    return 'market';
  }

  // 5. Business (ideas, validation, pricing formula, margins, client acquisition)
  if (
    /\b(business|startup|startups|entrepreneur|hustle|margin|margins|pricing|price|client|clients|customer|customers)\b/i.test(q) ||
    q.includes('business idea') ||
    q.includes('business plan') ||
    q.includes('start a business') ||
    q.includes('side hustle') ||
    q.includes('home business') ||
    q.includes('gross margin') ||
    q.includes('cost of goods') ||
    q.includes('customer acquisition')
  ) {
    return 'business';
  }

  return null;
}

export function getClientAssistantAnswer(
  query: string,
  topic: string = 'general',
  userName: string = 'there'
): AssistantAnswer {
  const q = query.toLowerCase().trim();
  const activeTopic = (topic || 'general').toLowerCase();

  // -----------------------------------------------------------------
  // 0. SPECIALIST DISCIPLINE ROUTING
  // If user selected a specific title (not 'general') and asks a question
  // for a different title, reassign politely to that specialist without off-topic advice.
  // -----------------------------------------------------------------
  const targetKey = detectTargetDiscipline(q);

  if (activeTopic !== 'general' && targetKey && targetKey !== activeTopic) {
    const current = TITLE_REGISTRY[activeTopic] || TITLE_REGISTRY.finance;
    const target = TITLE_REGISTRY[targetKey];

    return {
      title: `Referred to ${target.label}`,
      response: `### ${target.icon} Reassigned to ${target.label}

You have currently selected **${current.label}** (which specializes in *${current.specialty}*).

Your question is about **${target.specialty.split(',')[0]}**, which is handled by our **${target.label}**!

> **Please switch to ${target.label}:**
> To get specialized guidance and dedicated interactive tools for this query, please click the **${target.icon} ${target.label}** tab in the Focus Discipline bar above, or use the direct action button below.`,
      suggestedActions: [
        { label: `Switch to ${target.label}`, actionPath: `#topic-${target.id}` },
        { label: `Open ${target.label} Portal`, actionPath: target.path }
      ]
    };
  }

  // 1. Career, Resume & Interviews
  if (q.includes('break') || q.includes('gap') || q.includes('sabbatical') || q.includes('returnee') || q.includes('childcare')) {
    return {
      title: 'Explaining a Career Break with Confidence',
      response: `### 🌸 How to Confidently Explain a Career Break

Taking time off for family, caregiving, or health is a mark of real-world resilience, not a weakness. Use this 3-part winning structure:

1. **Own It Concisely (1 Sentence)**:
   > *"Between 2023 and 2025, I took an intentional sabbatical to fulfill family commitments."*
2. **Demonstrate Domain Currency (Upskilling)**:
   > *"During this period, I kept my industry knowledge sharp by completing modern technical certifications, building capstone projects, and staying active in professional networks."*
3. **Bridge Forward with Enthusiasm**:
   > *"With my home infrastructure established, I bring renewed energy, mature prioritization, and a strong work ethic to this role."*

**Pro Tip:** In the **[HerCareer Resume Builder](/career)**, choose our *Returnship-Optimized Template* which highlights your break under a dedicated *Professional Sabbatical & Upskilling* section.`,
      suggestedActions: [
        { label: 'Open Resume Builder', actionPath: '/career' },
        { label: 'Explore Returnships', actionPath: '/career' }
      ]
    };
  }

  if (q.includes('resume') || q.includes('cv') || q.includes('bullet') || q.includes('ats')) {
    return {
      title: 'High-Impact ATS Resume Optimization',
      response: `### 📄 High-Impact ATS Resume Guidelines

To score **90+ on ATS algorithms** and capture hiring managers' attention:

1. **Use the Action + Metric + Outcome Formula**:
   - ❌ *Weak:* "Helped build frontend features and fixed bugs."
   - ✅ *Strong:* "Architected 12+ responsive UI components with React & Tailwind CSS, reducing page load latency by 35% across 50,000 active users."
2. **Single-Column ATS Layout**:
   - Multi-column, tables, and graphics break ATS text parsers. Always use single-column layouts with standard headings (*Summary*, *Education*, *Experience*, *Technical Skills*, *Projects*).
3. **Map Keywords to Job Descriptions**:
   - Extract top technical keywords from the job description and weave them into your summary and experience highlights.

Use our **[HerCareer Resume Builder](/career)** to export clean single-column ATS PDFs and editable Word (.docx) formats!`,
      suggestedActions: [
        { label: 'Launch Resume Wizard', actionPath: '/career' },
        { label: 'Analyze Existing Resume', actionPath: '/career' }
      ]
    };
  }

  if (q.includes('interview') || q.includes('questions to ask') || q.includes('mock interview')) {
    return {
      title: 'Interview Preparation & Strategy',
      response: `### 🎯 Strategic Interview Framework

1. **Structure Behavioral Answers with the STAR Method**:
   - **Situation**: Context in 1-2 sentences.
   - **Task**: The specific problem you had to solve.
   - **Action**: What **you** specifically implemented (technologies, frameworks, processes).
   - **Result**: Quantified impact (e.g., saved 4 hours weekly, increased efficiency by 25%).
2. **High-Impact Questions to Ask the Interviewer**:
   - *"What does success look like in this role over the first 90 days?"*
   - *"What is the most challenging technical hurdle the team is solving this quarter?"*
   - *"How does the team foster mentorship and internal leadership for women engineers?"*
3. **Live AI Practice**:
   - Practice full behavioral and technical questions in real-time inside **[HerCareer Interview Prep](/career)**.`,
      suggestedActions: [
        { label: 'Start Interview Simulation', actionPath: '/career' },
        { label: 'View Recommended Jobs', actionPath: '/career' }
      ]
    };
  }

  if (q.includes('salary') || q.includes('negotiat') || q.includes('compensation')) {
    return {
      title: 'Salary Negotiation Playbook',
      response: `### 💼 Salary & Compensation Negotiation Strategy

Women professionals statistically leave 15–25% on the table by not counter-offering. Here is how to negotiate with confidence:

1. **Benchmark Before Quoting**:
   - Research median compensation bands on Glassdoor, Levels.fyi, and AmbitionBox for your city and years of experience.
2. **The Golden Script**:
   > *"Thank you so much for this offer! I am genuinely excited about the role and the team. Based on my track record in delivered metrics and current market benchmarks for this seniority, I was targeting ₹[Range: 15-20% higher]. Can we explore bridging this gap?"*
3. **Negotiate the Full Package**:
   - If fixed base salary is capped, negotiate flexible work-from-home days, sign-on bonuses, performance appraisal timelines, or learning allowances.`,
      suggestedActions: [
        { label: 'Career Roadmap & Salary Bands', actionPath: '/career' }
      ]
    };
  }

  // 2. Budgeting & Finance
  if (q.includes('50/30/20') || q.includes('budget') || q.includes('allocate') || q.includes('savings rate')) {
    return {
      title: 'The 50/30/20 Budgeting Rule',
      response: `### 📊 50/30/20 Financial Allocation Blueprint

The 50/30/20 rule is the foundation of sustainable financial independence:

1. **50% Essentials & Needs**:
   - Housing/Rent, Groceries, Electricity & Utilities, Healthcare, and Basic Commute.
   - *Goal:* Keep fixed overhead under 50% so temporary income disruptions don't cause emergency distress.
2. **30% Lifestyle & Joy (Guilt-Free)**:
   - Dining out, personal grooming, entertainment, hobby gear, and family celebrations.
   - *Goal:* Sustainable financial health requires enjoying your life today while securing tomorrow.
3. **20% Wealth Creation & Emergency Cushion**:
   - Automated SIPs into broad-market index funds (e.g. Nifty 50).
   - High-yield liquid savings until you have a 6-month emergency reserve.
   - Term life & adequate health insurance cover.

Track your monthly categories live in **[HerFinance Budget Dashboard](/finance)**!`,
      suggestedActions: [
        { label: 'Open HerFinance Budget', actionPath: '/finance' },
        { label: 'Set Savings Goal', actionPath: '/finance' }
      ]
    };
  }

  if (q.includes('emergency fund') || q.includes('safety cushion')) {
    return {
      title: 'Building an Emergency Fund',
      response: `### 🛡️ Building an Ironclad Emergency Fund

An Emergency Fund protects you from forced high-interest debt when unexpected life events occur:

1. **Target Size**:
   - **Salaried Professionals:** 3 to 6 months of mandatory living expenses.
   - **Entrepreneurs & Freelancers:** 6 to 9 months of expenses (accounting for seasonal cash flow).
2. **Where to Keep It**:
   - Split 50% into a sweep-in bank savings account and 50% into an ultra-short-term liquid mutual fund with instantaneous redemption.
3. **Golden Rule**:
   - Treat your emergency fund as insurance, not an investment. Its job is safety, not speculative returns.

Set up an automated target tracker in **[HerFinance Savings Goals](/finance)**!`,
      suggestedActions: [
        { label: 'Create Emergency Goal', actionPath: '/finance' }
      ]
    };
  }

  if (q.includes('sip') || q.includes('mutual fund') || q.includes('fd') || q.includes('fixed deposit') || q.includes('invest')) {
    return {
      title: 'SIP vs Fixed Deposit (FD) Comparison',
      response: `### 📈 SIP (Systematic Investment Plan) vs Fixed Deposit (FD)

| Metric | Fixed Deposit (FD) | Equity Mutual Fund SIP |
|---|---|---|
| **Expected Returns** | 6.5% – 7.5% per annum | 12% – 14% long-term historical CAGR |
| **Inflation Protection** | ❌ Usually lags post-tax inflation | ✅ Outpaces inflation significantly over 5+ yrs |
| **Risk Profile** | Capital guaranteed (up to ₹5L DICGC) | Market-linked (fluctuates short-term) |
| **Best Horizon** | Short-term needs (< 2 years) | Long-term wealth creation (5+ years) |
| **Tax Treatment** | Taxed at your income slab | 12.5% LTCG on gains exceeding ₹1.25 Lakh |

**Recommended Strategy:** Keep your 6-month emergency fund in FDs or liquid funds, and automate a monthly SIP into broad index funds for retirement and long-term milestones.

Explore our interactive compounding calculators in **[HerFinance Tools](/finance)**!`,
      suggestedActions: [
        { label: 'SIP Calculator in HerFinance', actionPath: '/finance' }
      ]
    };
  }

  // 3. Business & Entrepreneurship
  if (q.includes('business idea') || q.includes('start a business') || q.includes('side hustle') || q.includes('home business')) {
    return {
      title: 'Top High-Margin Business Ideas for Women',
      response: `### 🚀 2026 High-Demand Business Ideas

Here are proven, high-margin ventures with low upfront capital:

1. **Digital Marketing & Social Growth Studio**:
   - *Startup Capital:* ₹5,000 – ₹15,000 (Laptop + Canva/Figma).
   - *Gross Margin:* 80–90%.
   - *Offer:* Content calendars, reels editing, and local SEO for boutique brands.
2. **Artisanal Organic Personal Care / Soy Candles**:
   - *Startup Capital:* ₹15,000 – ₹25,000 (Molds, organic wax, scents, packaging).
   - *Gross Margin:* 55–65%.
   - *Distribution:* HerMarket digital storefront + corporate gifting.
3. **Specialty Culinary / Healthy Meal Prep Kits**:
   - *Startup Capital:* ₹10,000 – ₹20,000.
   - *Gross Margin:* 50–60%.
   - *Offer:* Millet-based snacks, postpartum nutritional meal kits.
4. **Corporate Soft Skills & Leadership Coaching**:
   - *Startup Capital:* Near zero.
   - *Gross Margin:* 90%+.

Use our **[HerBusiness AI Idea & Plan Generator](/business)** to customize an itemized budget, launch roadmap, and download a complete 1-to-1 matching business plan PDF!`,
      suggestedActions: [
        { label: 'Launch Business Idea Generator', actionPath: '/business' },
        { label: 'Download Business Plan PDF', actionPath: '/business' }
      ]
    };
  }

  if (q.includes('margin') || q.includes('pricing') || q.includes('how to price')) {
    return {
      title: 'Product Pricing & Profit Margin Formula',
      response: `### 🏷️ The Sustainable Pricing Formula (55%+ Gross Margin)

Many founders underprice by forgetting their own labor and packaging costs:

1. **Calculate True Cost of Goods Sold (COGS)**:
   - Raw Materials: ₹120
   - Packaging, Labels & Thank-you Card: ₹35
   - Your Direct Labor Time (e.g. 30 mins at ₹150/hr): ₹75
   - **Total COGS:** **₹230 per unit**
2. **Formula for 55% Target Gross Margin**:
   $$\\text{Selling Price} = \\frac{\\text{COGS}}{1 - \\text{Margin}} = \\frac{230}{1 - 0.55} = \\frac{230}{0.45} = ₹511$$
3. **Retail Pricing Recommendation**:
   - Set price at **₹499 to ₹549**.
   - Your net profit per unit: **₹269 to ₹319**.

Test volume break-even scenarios with our interactive tools in **[HerBusiness](/business)**!`,
      suggestedActions: [
        { label: 'Pricing Calculator in HerBusiness', actionPath: '/business' }
      ]
    };
  }

  // 3.5. HerMarket & Packaging
  if (q.includes('packaging') || q.includes('fragile') || q.includes('bubble wrap') || q.includes('glass')) {
    return {
      title: 'Affordable & Sustainable Packaging for Fragile Goods',
      response: `### 📦 Sustainable Packaging Architecture for Fragile Items

Protect your margins and customer goodwill by eliminating transit breakage with eco-conscious materials:

1. **The 3-Layer Protection Protocol**:
   - **Primary Layer (Scratch Guard):** Wrap the item in biodegradable tissue or kraft paper.
   - **Cushioning Layer (Shock Absorption):** Use 100% recyclable expandable honeycomb kraft paper instead of plastic bubble wrap. It locks without tape and absorbs 40% more drop impact.
   - **Outer Shield (Rigid Structure):** 3-ply or 5-ply corrugated cardboard boxes with a 1-inch buffer all around.
2. **Cost-Effective Sourcing**:
   - Source kraft honeycomb rolls in bulk from wholesale distributors (saves 50% vs retail rolls, approx. ₹8–₹12 per package).
3. **The Unboxing Touch**:
   - Include a personalized 'Handcrafted with Love' branded sticker and a prominent 'Fragile: Handle with Care' label on the outer box.`,
      suggestedActions: [
        { label: 'Explore HerMarket Portal', actionPath: '/market' }
      ]
    };
  }

  if (q.includes('product description') || q.includes('copywriting') || q.includes('storefront copy') || q.includes('candle')) {
    return {
      title: 'High-Converting Product Description Formula',
      response: `### ✨ High-Converting Product Description Blueprint

Turn casual window shoppers into proud paying customers using the Sensory + Story + Spec framework:

1. **The Hook (Sensory Headline)**:
   - *"Hand-Poured French Lavender & Warm Vanilla Botanical Soy Candle"*
2. **The Emotional Benefit (2 Sentences)**:
   - *"Transform your evening sanctuary. Hand-poured with 100% natural golden soy wax and therapeutic essential oils, designed to melt away daily stress without soot or synthetic fragrances."*
3. **Transparent Specifications**:
   - **Burn Time:** 45+ clean-burning hours
   - **Wick:** Lead-free organic braided cotton
   - **Wax:** 100% biodegradable golden soy wax
   - **Weight:** 220g / 7.8 oz in an amber reusable glass vessel
4. **Care Instructions**:
   - *"Trim wick to 1/4 inch before each burn for a smooth, even wax pool."*`,
      suggestedActions: [
        { label: 'Optimize HerMarket Listing', actionPath: '/market' }
      ]
    };
  }

  if (q.includes('repeat order') || q.includes('retention') || q.includes('loyalty') || q.includes('customer repeat')) {
    return {
      title: 'Driving Repeat Purchases on Marketplaces',
      response: `### 🔁 4 Proven Tactics to Double Repeat Orders

Acquiring a new customer costs 5x more than retaining an existing one. Here is how to keep them returning:

1. **The Unboxing Bounceback Coupon**:
   - Insert an elegant printed postcard inside every package with a personalized note: *"Thank you for supporting a woman-owned venture! Use code \`HERRISE15\` for 15% off your next order within 30 days."*
2. **Surprise Sample Gifting**:
   - Include a free mini sample of an upcoming product variant. 40% of recipients buy the full-sized version on their next visit.
3. **Automated Replenishment Reminders**:
   - For consumable goods (skincare, candles, teas), send an email or WhatsApp check-in at Day 25: *"How is your jar lasting? Replenish now before it runs out."*
4. **Loyalty VIP Perks**:
   - Offer early preview access to festive collections for returning customers.`,
      suggestedActions: [
        { label: 'View HerMarket Dashboard', actionPath: '/market' }
      ]
    };
  }

  // 4. Government Schemes & Funding
  if (q.includes('scheme') || q.includes('grant') || q.includes('stand-up') || q.includes('mudra') || q.includes('loan')) {
    return {
      title: 'Top Government Funding Schemes for Women',
      response: `### 🏛️ Verified Indian Government Schemes for Women Entrepreneurs

1. **Stand-Up India Scheme**:
   - **Funding Range:** ₹10 Lakhs to ₹1 Crore.
   - **Eligibility:** At least 51% women-owned greenfield enterprise.
   - **Collateral:** Backed by Credit Guarantee Scheme (CGS).
2. **Pradhan Mantri Mudra Yojana (PMMY)**:
   - **Shishu:** Loans up to ₹50,000 for early starters.
   - **Kishore:** Loans from ₹50,000 to ₹5 Lakhs for working capital.
   - **Tarun:** Loans up to ₹10 Lakhs for established enterprises.
   - **Benefit:** Collateral-free with subsidized interest rates.
3. **SIDBI Mahila Udyam Nidhi**:
   - Soft loan assistance up to ₹10 Lakhs with 10-year repayment window and up to 5-year moratorium.

Compare interest rates and document checklists in **[HerFund](/fund)**!`,
      suggestedActions: [
        { label: 'Explore HerFund Schemes', actionPath: '/fund' },
        { label: 'Calculate Loan EMI', actionPath: '/fund' }
      ]
    };
  }

  // 5. Courses & Learning
  if (q.includes('learn') || q.includes('course') || q.includes('certificat') || q.includes('python') || q.includes('react')) {
    return {
      title: 'Learning Pathways & Certifications',
      response: `### 🎓 Personalized Learning Pathways on HerLearn

HerLearn provides structured, industry-recognized courses tailored for career acceleration and technical transitions:

1. **Full-Stack Web Development Track**:
   - Modern React.js, TypeScript, Node.js, and MongoDB Atlas.
2. **Python & AI Engineering**:
   - Python programming fundamentals, REST APIs with FastAPI, and Generative AI & Enterprise LLM integrations.
3. **Financial Literacy Masterclasses**:
   - Wealth psychology, smart asset allocation, micro-investing, and tax optimization.
4. **Australian Qualifications Framework (AQF)**:
   - Synchronized accredited qualifications covering leadership, project management, and business administration.

**Video Enforcement Notice:** HerLearn tracks your exact playback in MongoDB to issue verified certificates upon full module completion!`,
      suggestedActions: [
        { label: 'Browse HerLearn Courses', actionPath: '/learn' }
      ]
    };
  }

  // 6. Mentorship & Community
  if (q.includes('mentor') || q.includes('network') || q.includes('community') || q.includes('workshop')) {
    return {
      title: 'HerNetwork Mentorship & Community',
      response: `### 🤝 Connect, Share, and Grow Together on HerNetwork

HerNetwork is built specifically for women to find experienced mentors and collaborate with a supportive community:

1. **Find a Mentor**:
   - Filter 8+ industry veterans across IT, Finance, Marketing, Education, and Entrepreneurship.
   - View mentor profiles and request 1-on-1 mentorship sessions.
2. **Community Discussion Feed**:
   - Share experiences and engage with peers on *Career Growth*, *Entrepreneurship*, and *Financial Learning*.
3. **Workshops & Live Events**:
   - Attend upcoming workshops like *Building Confidence in the Workplace*, *Personal Financial Planning*, and *Digital Marketing for Founders*.

Open **[HerNetwork](/network)** to connect with a mentor today!`,
      suggestedActions: [
        { label: 'Find a Mentor on HerNetwork', actionPath: '/network' },
        { label: 'Explore Community Feed', actionPath: '/network' }
      ]
    };
  }

  // 7. Greetings & Coach-Specific Welcomes
  const isGreeting =
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q.includes('who are you') ||
    q.includes('help me') ||
    q.includes('what can you do') ||
    q.includes('how to start');

  if (isGreeting) {
    if (activeTopic === 'career') {
      return {
        title: 'Welcome to HerCareer Coach',
        response: `### 💼 Hello ${userName}! I am your HerCareer Coach.

I am dedicated to helping you maximize your market compensation, advance your leadership trajectory, and craft winning resumes:

1. **📄 High-Impact ATS Resume Optimization**: Format single-column resumes scored against applicant tracking systems.
2. **🌸 Navigating Career Gaps & Comebacks**: Reframe sabbaticals, maternity leaves, or caregiving pauses as leadership strengths.
3. **🎯 Live Behavioral Interview Practice**: Master the STAR framework (Situation, Task, Action, Result) for tough questions.
4. **💼 Strategic Salary Negotiation**: Benchmark compensation bands and negotiate your total compensation package.

**What career milestone can we work on today?**`,
        suggestedActions: [
          { label: 'Open ATS Resume Builder', actionPath: '/career' },
          { label: 'Practice Interviews', actionPath: '/career' },
          { label: 'Explore Career Roadmaps', actionPath: '/career' }
        ]
      };
    }

    if (activeTopic === 'business') {
      return {
        title: 'Welcome to HerBusiness Strategist',
        response: `### 🚀 Hello ${userName}! I am your HerBusiness Strategist.

I help women entrepreneurs conceptualize, validate, and scale high-margin profitable businesses:

1. **💡 High-Margin Business Ideas**: Identify low-investment businesses with 60%+ gross margins.
2. **🏷️ Sustainable 55%+ Pricing Blueprint**: Calculate your true Cost of Goods Sold for sustainable profits.
3. **🎯 First 25 Customers Playbook**: Execute a 30-day playbook to secure paying clients with zero ad spend.
4. **📑 Comprehensive Business Plan**: Generate an itemized financial plan and downloadable investor-ready roadmap.

**What business concept or question would you like to explore?**`,
        suggestedActions: [
          { label: 'Launch Idea Generator', actionPath: '/business' },
          { label: 'Pricing & Margin Calculator', actionPath: '/business' },
          { label: 'Download Business Plan', actionPath: '/business' }
        ]
      };
    }

    if (activeTopic === 'fund') {
      return {
        title: 'Welcome to HerFund Guide',
        response: `### 🏛️ Hello ${userName}! I am your HerFund Guide.

I specialize in navigating Indian government funding schemes, subsidies, and investor capital for women-owned enterprises:

1. **🏛️ Government Schemes & Subsidies**: Pradhan Mantri Mudra Yojana (up to ₹10L) and Stand-Up India (₹10L to ₹1Cr).
2. **📋 Bank Loan Document Checklists**: Prepare KYC, Udyam registration, and projected P&L reports for smooth approval.
3. **📊 6-Slide Pitch Deck Architecture**: Structure an investor story covering customer pain, market size, and traction.
4. **🛡️ Collateral-Free Microloans**: Learn how the Credit Guarantee Scheme protects your personal assets.

**How can I help you secure capital today?**`,
        suggestedActions: [
          { label: 'Explore Mudra & Stand-Up Schemes', actionPath: '/fund' },
          { label: 'Open Pitch Studio', actionPath: '/fund' },
          { label: 'Loan Document Checklist', actionPath: '/fund' }
        ]
      };
    }

    if (activeTopic === 'market') {
      return {
        title: 'Welcome to HerMarket Optimizer',
        response: `### 🛍️ Hello ${userName}! I am your HerMarket Optimizer.

I help women artisans, makers, and founders dominate digital marketplaces and build enduring brand loyalty:

1. **✨ Sensory Product Descriptions**: Turn browsers into buyers using the Sensory + Story + Specification framework.
2. **📦 Eco-Friendly Packaging for Fragile Goods**: Eliminate transit breakage with expandable honeycomb kraft paper.
3. **🔁 Doubling Repeat Orders**: Implement unboxing bounceback cards, QR re-order discounts, and sample gifting.
4. **🏪 Storefront Setup & SEO**: Optimize titles, tags, and category placement to rank on marketplace search feeds.

**What product or storefront listing can we optimize today?**`,
        suggestedActions: [
          { label: 'Product Description Formula', actionPath: '/market' },
          { label: 'Sustainable Packaging Guide', actionPath: '/market' },
          { label: 'HerMarket Dashboard', actionPath: '/market' }
        ]
      };
    }

    if (activeTopic === 'finance') {
      return {
        title: 'Welcome to HerFinance Advisor',
        response: `### 💰 Hello ${userName}! I am your HerFinance Advisor.

I am dedicated to your complete personal financial security, cash-flow mastery, and wealth compounding:

1. **📊 50/30/20 Budgeting Allocation**: Balance essentials, lifestyle joy, and wealth creation without guilt.
2. **🛡️ Ironclad 6-Month Emergency Fund**: Protect yourself and your family from unexpected medical or career disruptions.
3. **📈 Direct SIP Wealth Compounding**: Outpace inflation through diversified, disciplined equity index funds.
4. **✂️ Expense Auditing & Waste Reduction**: Identify phantom subscriptions and negotiate lower recurring costs.

**What financial goal would you like to review today?**`,
        suggestedActions: [
          { label: 'Calculate 50/30/20 Budget', actionPath: '/finance' },
          { label: 'Set Emergency Fund Goal', actionPath: '/finance' },
          { label: 'SIP vs FD Calculator', actionPath: '/finance' }
        ]
      };
    }

    return {
      title: 'Welcome to HerRise AI Assistant',
      response: `### 🌸 Hello ${userName}! I am your HerRise All-in-One Advisor.

I am designed to guide you through every stage of your personal, financial, and career growth:

1. **💼 Career Acceleration (HerCareer)**: Build an ATS resume, practice interviews, and negotiate compensation.
2. **💰 Financial Freedom (HerFinance)**: Calculate 50/30/20 budgets, build emergency reserves, and automate SIPs.
3. **🚀 Venture Launchpad (HerBusiness)**: Generate validated business ideas, calculate 55%+ gross margins, and build business plans.
4. **🏛️ Capital & Government Schemes (HerFund)**: Stand-Up India, Mudra loans, SIDBI schemes, and pitch decks.
5. **🛍️ Marketplace Optimization (HerMarket)**: Product copy, sustainable packaging, and repeat order retention.

**What specific goal would you like to tackle right now?** Click any suggested prompt or type your question!`,
      suggestedActions: [
        { label: 'Create ATS Resume', actionPath: '/career' },
        { label: 'Generate Business Idea', actionPath: '/business' },
        { label: 'Optimize My Budget', actionPath: '/finance' },
        { label: 'Explore Mudra Loans', actionPath: '/fund' }
      ]
    };
  }

  // 8. Coach-Specific Fallbacks
  if (activeTopic === 'career') {
    return {
      title: 'Career Strategy Guidance',
      response: `### 💼 HerCareer Coach Guidance on "${query}"

Here is a focused career development framework for your objective:

1. **Target Role Alignment**: Identify the top 5 high-impact skills required for your target seniority.
2. **Resume & Portfolio Proof**: Validate each core competency using quantifiable metric bullets (*"Increased efficiency by 25%"*).
3. **Recommended Next Step**: Use our **[HerCareer Resume Builder](/career)** to export an ATS-compliant PDF, or practice questions in **[HerCareer Interview Prep](/career)**!`,
      suggestedActions: [
        { label: 'Open ATS Resume Builder', actionPath: '/career' },
        { label: 'Practice Interviews', actionPath: '/career' }
      ]
    };
  }

  if (activeTopic === 'business') {
    return {
      title: 'Venture Strategy Guidance',
      response: `### 🚀 HerBusiness Strategist Guidance on "${query}"

Here is a focused entrepreneurial roadmap for your venture:

1. **Unit Economics & Margin Check**: Always verify that retail price yields at least 55% gross margin after all direct materials, packaging, and transaction fees.
2. **Customer Validation**: Conduct 15 informal customer discovery interviews before purchasing inventory or building complex software.
3. **Recommended Next Step**: Use our **[HerBusiness Idea & Plan Generator](/business)** to draft your complete launch model!`,
      suggestedActions: [
        { label: 'Launch Idea Generator', actionPath: '/business' },
        { label: 'Pricing Calculator', actionPath: '/business' }
      ]
    };
  }

  if (activeTopic === 'fund') {
    return {
      title: 'Funding Strategy Guidance',
      response: `### 🏛️ HerFund Guide on "${query}"

Here is a strategic funding framework for your capital requirement:

1. **Scheme Matching**: Match your capital needs with collateral-free government programs like Mudra (up to ₹10L) or Stand-Up India (₹10L to ₹1Cr).
2. **Document Readiness**: Keep 2 years of ITR, bank statements, Udyam registration, and projected cash-flow statements organized.
3. **Recommended Next Step**: Review verified schemes in **[HerFund](/fund)** or build your slide deck in **[HerFund Pitch Studio](/fund)**!`,
      suggestedActions: [
        { label: 'Explore HerFund Schemes', actionPath: '/fund' },
        { label: 'Open Pitch Studio', actionPath: '/fund' }
      ]
    };
  }

  if (activeTopic === 'market') {
    return {
      title: 'Marketplace Optimization Guidance',
      response: `### 🛍️ HerMarket Optimizer Guidance on "${query}"

Here is an e-commerce playbook for your digital storefront:

1. **Visual & Copy Optimization**: Lead with clear benefit headlines, authentic artisan photography, and sensory descriptions.
2. **Packaging & Repeat Orders**: Use expandable honeycomb paper wrap and include a 15% discount card for re-orders.
3. **Recommended Next Step**: Review your listings on **[HerMarket](/market)**!`,
      suggestedActions: [
        { label: 'Open HerMarket Dashboard', actionPath: '/market' }
      ]
    };
  }

  if (activeTopic === 'finance') {
    return {
      title: 'Financial Planning Guidance',
      response: `### 💰 HerFinance Advisor Guidance on "${query}"

Here is a financial roadmap for your goal:

1. **Cash Flow Check**: Ensure your fixed living needs do not exceed 50% of verified monthly inflow.
2. **Reserve & Compounding**: Maintain a 6-month liquid cushion before expanding discretionary commitments.
3. **Recommended Next Step**: Audit your numbers in **[HerFinance Budget Dashboard](/finance)**!`,
      suggestedActions: [
        { label: 'Open HerFinance Budget', actionPath: '/finance' },
        { label: 'Set Savings Goal', actionPath: '/finance' }
      ]
    };
  }

  return {
    title: `Guidance on "${query}"`,
    response: `### 💡 Strategic Guidance on "${query}"

Here is an actionable framework to address this:

1. **Clarify Objectives**: Break your long-term goal into measurable 30-day milestones with daily 15-minute actions.
2. **Leverage HerRise AI Modules**:
   - For career questions and resume editing, use **[HerCareer](/career)**.
   - For wealth budgeting and financial allocations, visit **[HerFinance](/finance)**.
   - For business feasibility and pricing models, explore **[HerBusiness](/business)**.
   - For government loan schemes and grants, review **[HerFund](/fund)**.
   - For marketplace sales, visit **[HerMarket](/market)**.
3. **Next Recommended Step**: Choose any specialized discipline above for in-depth, dedicated advisory!`,
    suggestedActions: [
      { label: 'Open HerCareer', actionPath: '/career' },
      { label: 'Open HerFinance', actionPath: '/finance' },
      { label: 'Open HerBusiness', actionPath: '/business' }
    ]
  };
}
