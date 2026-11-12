import { ChatMessage } from '../../types';

export interface AssistantTopic {
  id: string;
  label: string;
  icon: string;
  description: string;
  suggestedPrompts: string[];
}

export const assistantTopics: AssistantTopic[] = [
  {
    id: 'general',
    label: 'All-in-One Advisor',
    icon: '✨',
    description: 'Ask anything across finance, career, business, and skill growth',
    suggestedPrompts: [
      'What are the first 3 steps I should take on HerRise today?',
      'How do I balance launching a side-business while working full-time?',
      'Can you recommend a 30-day roadmap for financial independence?'
    ]
  },
  {
    id: 'finance',
    label: 'HerFinance Advisor',
    icon: '💰',
    description: 'Budgeting, Emergency funds, SIP investments, and debt reduction',
    suggestedPrompts: [
      'How should I allocate my 50/30/20 budget on a ₹60,000 monthly income?',
      'How large should my Emergency Fund be as an entrepreneur?',
      'What is the difference between Direct SIP Mutual Funds and FDs?'
    ]
  },
  {
    id: 'career',
    label: 'HerCareer Coach',
    icon: '💼',
    description: 'Resume polishing, explaining career gaps, and interview prep',
    suggestedPrompts: [
      'How do I explain a 3-year career break in my resume and interviews?',
      'Rewrite my summary for a Senior Product Marketing position',
      'What are high-impact questions to ask the interviewer at the end?'
    ]
  },
  {
    id: 'business',
    label: 'HerBusiness Strategist',
    icon: '🚀',
    description: 'Idea validation, profit margin calculation, and go-to-market',
    suggestedPrompts: [
      'How do I calculate the selling price of my handmade product to ensure 55% margin?',
      'What are 5 low-investment business ideas I can start from home?',
      'How do I acquire my first 25 paying customers with zero ad spend?'
    ]
  },
  {
    id: 'fund',
    label: 'HerFund Guide',
    icon: '🏛️',
    description: 'Loans, grants, credit scores, and investor pitch structure',
    suggestedPrompts: [
      'What documents do public sector banks ask for women business loans?',
      'How do I structure a 6-slide investor pitch deck?',
      'What is the difference between collateral-free microloans and equity funding?'
    ]
  },
  {
    id: 'market',
    label: 'HerMarket Optimizer',
    icon: '🛍️',
    description: 'Storefront copywriting, packaging design, and customer retention',
    suggestedPrompts: [
      'Write an appealing product description for artisanal soy wax candles',
      'How should I package fragile glass items affordably and sustainably?',
      'What strategies increase repeat orders on digital marketplaces?'
    ]
  }
];

export const initialAssistantMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    content: `👋 **Welcome to HerRise AI Assistant!** 

I am your personal copilot across financial planning, career acceleration, business building, and funding navigation.

**How can I support your journey today?** You can click any suggested prompt below or type your specific question!`,
    timestamp: 'Just now',
    category: 'general',
    suggestedActions: [
      { label: 'Optimize My Budget', actionPath: '/finance' },
      { label: 'Explore Career Opportunities', actionPath: '/career' },
      { label: 'Draft Business Plan', actionPath: '/business' }
    ]
  }
];

export const smartAIResponses: Record<string, string> = {
  'budget': `### 📊 Personalized 50/30/20 Budget Breakdown (₹60,000 Monthly Income)

Here is how you can allocate your monthly take-home salary to build lasting financial independence:

1. **50% Needs (₹30,000 / month)**:
   - Rent / Home EMI: ₹18,000
   - Groceries & Essentials: ₹7,000
   - Utilities, Mobile & Fiber Broadband: ₹3,000
   - Healthcare & Basic Commute: ₹2,000

2. **30% Wants & Lifestyle (₹18,000 / month)**:
   - Dining out & weekend socializing: ₹7,000
   - Personal care & wardrobe: ₹5,000
   - Entertainment & Streaming Subscriptions: ₹2,000
   - Guilt-Free Joy Fund: ₹4,000

3. **20% Wealth & Security (₹12,000 / month)**:
   - **Emergency Safety Buffer**: ₹4,000 (into a high-yield liquid account until you reach 6 months of expenses)
   - **Index SIP (Nifty 50 / Broad Equity)**: ₹6,000
   - **Term & Health Insurance Buffer**: ₹2,000

> 💡 **Next Action**: Head over to the **[HerFinance Dashboard](/finance)** to set up automated category limits and track your real daily expenses.`,

  'break': `### 🌟 How to Confidently Explain a Career Break in Interviews

Remember: Taking time off for family, caregiving, health, or personal exploration is valid and demonstrates real-world resilience. Never apologize for your sabbatical.

#### The 3-Part Winning Framework:
1. **Clear Statement (Own It)**: State the duration and clear purpose in one sentence.
   > *"Between 2023 and 2025, I took an intentional sabbatical to fulfill family caregiving commitments."*
2. **Upskilling & Proactive Growth (Prove Freshness)**:
   > *"During this period, I intentionally maintained domain currency by completing certifications in Advanced Analytics, advising a women-owned micro-business, and staying active in industry networks."*
3. **Forward Momentum (Bridge to the Role)**:
   > *"With my home support infrastructure firmly in place, I bring renewed energy, heightened focus, and proven prioritization skills to this role."*

> 📄 **Next Action**: Use the **[HerCareer Resume Builder](/career)** to select our 'Returnship-Optimized' template that highlights your break under a dedicated 'Professional Sabbatical & Upskilling' section.`,

  'margin': `### 🏷️ Pricing Formula for Handmade Products & Healthy Margins

Many women entrepreneurs underprice by forgetting to charge for their own labor! Here is the sustainable formula to protect a 55%+ gross margin:

#### 1. Calculate True Cost of Goods Sold (COGS) per unit:
- **Raw Materials**: ₹120 (e.g. soy wax, essential oil, wick, ceramic jar)
- **Packaging & Box**: ₹35 (biodegradable box, label, safety warning)
- **Direct Labor (Your Time)**: ₹70 (e.g. 30 minutes at ₹140/hour base)
- **Total COGS**: **₹225 per unit**

#### 2. Target Selling Price for 55% Gross Margin:
$$\\text{Selling Price} = \\frac{\\text{COGS}}{1 - 0.55} = \\frac{225}{0.45} = ₹500$$

- **Selling Price**: **₹499 - ₹549**
- **Your Net Profit per Item**: **₹274 - ₹324**

> 🚀 **Next Action**: Test different volume tiers using our interactive **[HerBusiness Pricing Calculator](/business)**!`,

  'pitch': `### 📑 The Ideal 6-Slide Pitch Deck Structure for Women Founders

Angel investors evaluate clarity, market size, and execution readiness:

1. **Slide 1: Problem & Empathy**: State the acute pain point your customers face and why current alternatives fail.
2. **Slide 2: Solution & Product**: Your unique value proposition, photos/demos, and why customers love it.
3. **Slide 3: Market Size (TAM, SAM, SOM)**: Demonstrate that the market is at least ₹500Cr+ to support venture returns.
4. **Slide 4: Business Model & Unit Economics**: Average order value, customer acquisition cost (CAC), gross margin (aim for 50%+), and retention rate.
5. **Slide 5: Traction & Milestones**: Monthly revenue, user growth, customer testimonials, and awards/grants.
6. **Slide 6: The Ask & Capital Allocation**: How much funding you are raising (e.g. ₹25 Lakhs) and exactly what 12-month milestones it will achieve.

> 🏛️ **Next Action**: Use our **[HerFund Pitch Deck Builder](/fund)** to generate and download slide templates.`,

  'default': `### 💡 Actionable Guidance from HerRise AI

Thank you for your question. Here is our recommended strategic framework:

1. **Clarify Objectives**: Break your long-term vision into measurable 30-day sprints.
2. **Leverage Platform Tools**:
   - For budget and wealth tracking, visit **[HerFinance](/finance)**.
   - For resume building and returnships, visit **[HerCareer](/career)**.
   - For business feasibility and pricing, explore **[HerBusiness](/business)**.
   - For funding comparisons, review **[HerFund](/fund)**.
   - For showcasing and selling products, use **[HerMarket](/market)**.
   - For interactive skills courses and certifications, open **[HerLearn](/learn)**.
   - For 1:1 mentorship and community discussions, visit **[HerNetwork](/network)**.
3. **Consistency**: Focus on 15 minutes of intentional progress each day.

Is there a specific section above you would like to drill deeper into?`
};

