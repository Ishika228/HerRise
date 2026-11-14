/**
 * HerRise AI Universal Knowledge & Reasoning Engine
 * High-fidelity, domain-specific intelligence for Finance, Career, Business,
 * Funding Schemes, Marketplaces, Learning Roadmaps, and Mentorship.
 */

export interface KnowledgeMatch {
  title: string;
  response: string;
  suggestedActions?: Array<{ label: string; actionPath: string }>;
}

export function generateSmartAssistantResponse(
  query: string,
  topic: string = 'general',
  userContext?: { name?: string; targetRole?: string; skills?: string[] }
): KnowledgeMatch {
  const q = query.toLowerCase().trim();
  const userName = userContext?.name ? userContext.name.split(' ')[0] : 'there';
  const targetRole = userContext?.targetRole || 'Growth Professional';

  // -----------------------------------------------------------------
  // 1. CAREER & JOBS INTENTS
  // -----------------------------------------------------------------
  if (
    q.includes('career break') ||
    q.includes('gap') ||
    q.includes('sabbatical') ||
    q.includes('comeback') ||
    q.includes('restart') ||
    q.includes('childcare') ||
    q.includes('maternity')
  ) {
    return {
      title: 'Explaining a Career Break with Confidence',
      response: `### 🌸 How to Confidently Explain a Career Break

Taking time off for caregiving, family, or health is a mark of real-world resilience, not a weakness. Use this 3-step winning structure:

1. **Own It Concisely (1 Sentence)**:
   > *"Between 2023 and 2025, I took an intentional sabbatical to fulfill family commitments."*
2. **Demonstrate Domain Currency (Upskilling)**:
   > *"During this period, I kept my industry knowledge sharp by completing modern technical certifications, building capstone projects, and staying active in professional networks."*
3. **Bridge Forward with Enthusiasm**:
   > *"With my home infrastructure established, I bring renewed energy, mature prioritization, and a strong work ethic to this role."*

**Pro Tip:** In the **[HerCareer Resume Builder](/career)**, choose our *Returnship-Optimized Template* which organizes your sabbatical under a proactive *Professional Sabbatical & Upskilling* section.`,
      suggestedActions: [
        { label: 'Open Resume Builder', actionPath: '/career' },
        { label: 'Explore Returnships', actionPath: '/career' }
      ]
    };
  }

  if (
    q.includes('resume') ||
    q.includes('cv') ||
    q.includes('bullet') ||
    q.includes('ats')
  ) {
    return {
      title: 'High-Impact ATS Resume Optimization',
      response: `### 📄 High-Impact ATS Resume Guidelines

To score **90+ on ATS algorithms** and capture hiring managers' attention within 6 seconds:

1. **Use the Action + Metric + Outcome Formula**:
   - ❌ *Weak:* "Helped build frontend features and fixed bugs."
   - ✅ *Strong:* "Architected 12+ responsive UI components with React & Tailwind CSS, reducing page load latency by 35% across 50,000 active users."
2. **Single-Column ATS Layout**:
   - Multi-column, tables, and graphics break ATS text parsers. Always use single-column layouts with standard headings (*Summary*, *Education*, *Experience*, *Technical Skills*, *Projects*).
3. **Map Keywords to Job Descriptions**:
   - Extract the top 5 technical skills and tools from the job post and ensure they appear in your summary and project bullets naturally.

Use our **[HerCareer Resume Builder](/career)** to export clean single-column ATS PDFs and editable Word (.docx) formats!`,
      suggestedActions: [
        { label: 'Launch Resume Wizard', actionPath: '/career' },
        { label: 'Analyze Existing Resume', actionPath: '/career' }
      ]
    };
  }

  if (
    q.includes('interview') ||
    q.includes('questions to ask') ||
    q.includes('mock interview') ||
    q.includes('prepare for interview')
  ) {
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
   - *"How does the engineering culture support continuous mentorship and internal growth?"*
3. **Practice Live Simulation**:
   - Practice full behavioral and technical questions in real-time inside **[HerCareer Interview Prep](/career)**.`,
      suggestedActions: [
        { label: 'Start Interview Simulation', actionPath: '/career' },
        { label: 'View Recommended Jobs', actionPath: '/career' }
      ]
    };
  }

  if (
    q.includes('salary') ||
    q.includes('negotiat') ||
    q.includes('compensation') ||
    q.includes('counter offer')
  ) {
    return {
      title: 'Salary Negotiation Playbook',
      response: `### 💼 Salary & Compensation Negotiation Strategy

Women professionals statistically leave 15–25% on the table by not counter-offering. Here is how to negotiate with confidence:

1. **Benchmark Before Quoting**:
   - Research median compensation bands for **${targetRole}** on Glassdoor, Levels.fyi, and AmbitionBox for your city and years of experience.
2. **The Golden Script**:
   > *"Thank you so much for this offer! I am genuinely excited about the role and the team. Based on my track record in delivered metrics and current market benchmarks for this seniority, I was targeting ₹[Range: 15-20% higher]. Can we explore bridging this gap?"*
3. **Negotiate the Full Package**:
   - If fixed base salary is capped, negotiate flexible work-from-home days, sign-on bonuses, performance appraisal timelines (e.g., 6-month review instead of 12), or learning allowances.`,
      suggestedActions: [
        { label: 'Career Roadmap & Salary Bands', actionPath: '/career' }
      ]
    };
  }

  // -----------------------------------------------------------------
  // 2. FINANCE & WEALTH INTENTS
  // -----------------------------------------------------------------
  if (
    q.includes('50/30/20') ||
    q.includes('budget') ||
    q.includes('allocate') ||
    q.includes('income allocation')
  ) {
    return {
      title: 'The 50/30/20 Budgeting Rule',
      response: `### 📊 50/30/20 Financial Allocation Blueprint

The 50/30/20 rule is the foundation of sustainable financial independence:

1. **50% Essentials & Needs**:
   - Housing/Rent, Groceries, Electricity & Utilities, Healthcare, and Basic Commute.
   - *Goal:* Keep fixed overhead under 50% so a temporary loss of income doesn't create immediate distress.
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

  if (
    q.includes('emergency fund') ||
    q.includes('safety cushion') ||
    q.includes('rainy day')
  ) {
    return {
      title: 'Building an Emergency Fund',
      response: `### 🛡️ Building an Ironclad Emergency Fund

An Emergency Fund protects you from forced debt or breaking long-term investments when unexpected life events occur:

1. **Target Size**:
   - **Salaried Professionals:** 3 to 6 months of mandatory living expenses.
   - **Entrepreneurs & Freelancers:** 6 to 9 months of expenses (accounting for seasonal cash flow).
2. **Where to Keep It**:
   - **Do not lock it in volatile stocks or high-penalty lock-ins.**
   - Split 50% into a dedicated sweep-in bank savings account and 50% into an ultra-short-term liquid mutual fund with instantaneous redemption.
3. **Golden Rule**:
   - Treat your emergency fund as insurance, not an investment. Its job is peace of mind, not maximum returns.

Set up an automated target tracker in **[HerFinance Savings Goals](/finance)**!`,
      suggestedActions: [
        { label: 'Create Emergency Goal', actionPath: '/finance' }
      ]
    };
  }

  if (
    q.includes('sip') ||
    q.includes('mutual fund') ||
    q.includes('fd') ||
    q.includes('fixed deposit') ||
    q.includes('invest')
  ) {
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

  // -----------------------------------------------------------------
  // 3. BUSINESS & ENTREPRENEURSHIP INTENTS
  // -----------------------------------------------------------------
  if (
    q.includes('business idea') ||
    q.includes('start a business') ||
    q.includes('side hustle') ||
    q.includes('home business') ||
    q.includes('profitable business')
  ) {
    return {
      title: 'Top High-Margin Business Ideas for Women',
      response: `### 🚀 2026 High-Demand Business Ideas

Here are proven, high-margin ventures with low upfront capital:

1. **Digital Marketing & Social Growth Studio**:
   - *Startup Capital:* ₹5,000 – ₹15,000 (Laptop + Canva/Figma).
   - *Gross Margin:* 80–90%.
   - *Offer:* Content calendars, reels editing, and local SEO for boutique brands and doctors.
2. **Artisanal Organic Personal Care / Soy Candles**:
   - *Startup Capital:* ₹15,000 – ₹25,000 (Molds, organic wax, scents, packaging).
   - *Gross Margin:* 55–65%.
   - *Distribution:* HerMarket digital storefront + corporate gifting.
3. **Specialty Culinary / Healthy Meal Prep Kits**:
   - *Startup Capital:* ₹10,000 – ₹20,000.
   - *Gross Margin:* 50–60%.
   - *Offer:* Millet-based snacks, postpartum nutritional meal kits, diabetic-friendly treats.
4. **Corporate Soft Skills & Leadership Coaching**:
   - *Startup Capital:* Near zero.
   - *Gross Margin:* 90%+.
   - *Offer:* Executive presence, interview prep, and returnship guidance.

Use our brand-new **[HerBusiness AI Idea & Plan Generator](/business)** to customize an itemized budget, launch roadmap, and 1-to-1 matching business plan PDF!`,
      suggestedActions: [
        { label: 'Launch Business Idea Generator', actionPath: '/business' },
        { label: 'Download Business Plan PDF', actionPath: '/business' }
      ]
    };
  }

  if (
    q.includes('margin') ||
    q.includes('pricing') ||
    q.includes('how to price') ||
    q.includes('cost of goods')
  ) {
    return {
      title: 'Product Pricing & Profit Margin Formula',
      response: `### 🏷️ The Sustainable Pricing Formula (55%+ Gross Margin)

Many first-time founders underprice by forgetting their own labor and packaging costs:

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

  if (
    q.includes('customer') ||
    q.includes('client') ||
    q.includes('acquisition') ||
    q.includes('first 20') ||
    q.includes('marketing')
  ) {
    return {
      title: 'Acquiring Your First 20 Paying Customers',
      response: `### 🎯 Playbook to Get Your First 20 Paying Customers (Zero Ad Spend)

1. **Tap the Warm Inner Circle (Days 1–5)**:
   - Personally message 30 colleagues, friends, and alumnae. Offer a special beta-launch price in exchange for honest video/text testimonials.
2. **Community Value-First Posting (Days 6–15)**:
   - Share educational breakdowns on LinkedIn and WhatsApp groups. Instead of "buy my product", share: *"Here are 3 mistakes I made making soy candles and how to fix them."*
3. **Local Micro-Partnerships (Days 16–25)**:
   - Partner with local yoga studios, co-working spaces, or women-owned cafes to cross-promote complementary offerings.
4. **List on HerMarket (Days 26–30)**:
   - Launch your verified storefront on **[HerMarket](/market)** to accept direct digital orders.`,
      suggestedActions: [
        { label: 'Set Up HerMarket Store', actionPath: '/market' }
      ]
    };
  }

  // -----------------------------------------------------------------
  // 4. GOVERNMENT SCHEMES & FUNDING INTENTS
  // -----------------------------------------------------------------
  if (
    q.includes('scheme') ||
    q.includes('grant') ||
    q.includes('stand-up') ||
    q.includes('mudra') ||
    q.includes('loan') ||
    q.includes('subsid') ||
    q.includes('government')
  ) {
    return {
      title: 'Top Government Funding Schemes for Women',
      response: `### 🏛️ Verified Indian Government Schemes for Women Entrepreneurs

1. **Stand-Up India Scheme**:
   - **Funding Range:** ₹10 Lakhs to ₹1 Crore.
   - **Eligibility:** At least 51% women-owned greenfield manufacturing, service, or trading business.
   - **Collateral:** Backed by Credit Guarantee Scheme (CGS).
2. **Pradhan Mantri Mudra Yojana (PMMY)**:
   - **Shishu:** Loans up to ₹50,000 for early starters.
   - **Kishore:** Loans from ₹50,000 to ₹5 Lakhs for working capital.
   - **Tarun:** Loans up to ₹10 Lakhs for established enterprises.
   - **Benefit:** No collateral required; subsidized interest rates.
3. **SIDBI Mahila Udyam Nidhi**:
   - Soft loan assistance up to ₹10 Lakhs with 10-year repayment window and up to 5-year moratorium.
4. **Stree Shakti Package (SBI)**:
   - 0.5% interest rate concession for majority women-owned enterprises registered under MSME/Udyam.

Compare interest rates and document checklists in **[HerFund](/fund)**!`,
      suggestedActions: [
        { label: 'Explore HerFund Schemes', actionPath: '/fund' },
        { label: 'Calculate Loan EMI', actionPath: '/fund' }
      ]
    };
  }

  if (
    q.includes('pitch') ||
    q.includes('deck') ||
    q.includes('investor') ||
    q.includes('angel')
  ) {
    return {
      title: 'Investor Pitch Deck Architecture',
      response: `### 📑 The Winning 6-Slide Pitch Deck for Women Founders

1. **Slide 1: Problem & Customer Pain**: Real-world friction backed by primary customer interviews.
2. **Slide 2: Solution & Product**: Your unique value proposition and defensibility.
3. **Slide 3: Market Size (TAM, SAM, SOM)**: Proving the addressable opportunity is large enough.
4. **Slide 4: Traction & Unit Economics**: Monthly revenue, customer retention, and gross margins (aim for 50%+).
5. **Slide 5: Founding Team**: Complementary domain skills and unfair execution advantage.
6. **Slide 6: The Ask**: Specific capital requested (e.g. ₹25 Lakhs) and 12-month milestone breakdown.

Build and preview sample slide decks in **[HerFund Pitch Studio](/fund)**!`,
      suggestedActions: [
        { label: 'Open HerFund Pitch Studio', actionPath: '/fund' }
      ]
    };
  }

  // -----------------------------------------------------------------
  // 5. COURSES & LEARNING INTENTS
  // -----------------------------------------------------------------
  if (
    q.includes('learn') ||
    q.includes('course') ||
    q.includes('certificat') ||
    q.includes('python') ||
    q.includes('react') ||
    q.includes('upskill')
  ) {
    return {
      title: 'Learning Pathways & Certifications',
      response: `### 🎓 Personalized Learning Pathways on HerLearn

HerLearn provides structured, industry-recognized courses tailored for career acceleration and technical transitions:

1. **Full-Stack Web Development Track**:
   - Modern React.js, TypeScript, Node.js, and MongoDB Atlas.
   - Real-world deployment on cloud providers with hands-on capstone projects.
2. **Python & AI Engineering**:
   - Python programming fundamentals, REST APIs with FastAPI, LangChain, and Groq/LLM integrations.
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

  // -----------------------------------------------------------------
  // 6. MENTORSHIP & HERNETWORK INTENTS
  // -----------------------------------------------------------------
  if (
    q.includes('mentor') ||
    q.includes('network') ||
    q.includes('community') ||
    q.includes('workshop') ||
    q.includes('connect')
  ) {
    return {
      title: 'HerNetwork Mentorship & Community',
      response: `### 🤝 Connect, Share, and Grow Together on HerNetwork

HerNetwork is built specifically for women to find experienced mentors and collaborate with a supportive community:

1. **Find a Mentor**:
   - Filter 8+ industry veterans across IT, Finance, Marketing, Education, and Entrepreneurship.
   - View complete mentor profiles, areas where they can help, and request 1-on-1 mentorship sessions.
2. **Community Discussion Feed**:
   - Engage with peers on *Career Growth*, *Entrepreneurship*, *Financial Learning*, and *Motivation*.
   - Create posts, celebrate milestones, and ask questions.
3. **Workshops & Live Events**:
   - Attend upcoming workshops like *Building Confidence in the Workplace*, *Personal Financial Planning*, and *Digital Marketing for Founders*.
4. **My Connections**:
   - Manage your mentors, peer network, and pending requests in one clean dashboard.

Open **[HerNetwork](/network)** to connect with a mentor today!`,
      suggestedActions: [
        { label: 'Find a Mentor on HerNetwork', actionPath: '/network' },
        { label: 'Explore Community Feed', actionPath: '/network' }
      ]
    };
  }

  // -----------------------------------------------------------------
  // 7. GREETINGS & GENERAL INTENTS
  // -----------------------------------------------------------------
  if (
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q.includes('who are you') ||
    q.includes('help me') ||
    q.includes('what can you do')
  ) {
    return {
      title: 'Welcome to HerRise AI Assistant',
      response: `### 🌸 Hello ${userName}! I am your HerRise AI Copilot.

I am designed to guide you through every stage of your personal, financial, and career growth. Here is what we can do together:

1. **💼 Career Acceleration (HerCareer)**:
   - Build a verified ATS resume, practice interview questions, plan your promotion roadmap, or craft an empowering narrative for a career break.
2. **💰 Financial Freedom (HerFinance)**:
   - Calculate your 50/30/20 budget, build an emergency safety net, automate SIPs, and track daily cash flows.
3. **🚀 Venture Launchpad (HerBusiness & HerMarket)**:
   - Generate profitable business ideas, calculate sustainable unit economics (55%+ margins), and set up an e-commerce storefront.
4. **🏛️ Capital & Government Schemes (HerFund)**:
   - Navigate Stand-Up India, Mudra loans, SIDBI grants, and investor pitch decks.
5. **🎓 Upskilling (HerLearn)**:
   - Complete technical and financial courses with verified certificates.
6. **🤝 Mentorship (HerNetwork)**:
   - Connect 1-on-1 with industry mentors, attend workshops, and share achievements.

**What specific goal would you like to tackle right now?** Click any suggested topic below or type your question!`,
      suggestedActions: [
        { label: 'Create ATS Resume', actionPath: '/career' },
        { label: 'Generate Business Idea', actionPath: '/business' },
        { label: 'Optimize My Budget', actionPath: '/finance' },
        { label: 'Find a Mentor', actionPath: '/network' }
      ]
    };
  }

  // -----------------------------------------------------------------
  // 8. CONTEXTUAL DEFAULT FALLBACK
  // -----------------------------------------------------------------
  return {
    title: 'Actionable Guidance from HerRise AI',
    response: `### 💡 Strategic Guidance on "${query}"

Thank you for your question. Here is an actionable roadmap tailored for your objectives:

1. **Establish the Foundation**:
   - Define your clear 30-day milestone and break it down into daily 15-minute habits.
2. **Utilize HerRise AI Tools**:
   - For career transitions and resume polishing, use **[HerCareer](/career)**.
   - For wealth budgeting and financial allocations, visit **[HerFinance](/finance)**.
   - For business feasibility and pricing models, explore **[HerBusiness](/business)**.
   - For loan schemes and investor pitch decks, review **[HerFund](/fund)**.
   - For skill certifications, check **[HerLearn](/learn)**.
   - For 1:1 mentorship and community discussions, visit **[HerNetwork](/network)**.
3. **Next Recommended Step**:
   - Would you like a tailored action plan for **career advancement**, **personal budgeting**, or **starting a business**? Tell me what you'd like to prioritize and I'll generate the exact step-by-step breakdown!`,
    suggestedActions: [
      { label: 'Open HerCareer', actionPath: '/career' },
      { label: 'Open HerFinance', actionPath: '/finance' },
      { label: 'Open HerBusiness', actionPath: '/business' }
    ]
  };
}
