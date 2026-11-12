import { FinancialLessonItem } from '../../types/finance';

export const comprehensiveFinancialLessons: FinancialLessonItem[] = [
  {
    id: 'lesson-budgeting',
    title: 'The Modern 50/30/20 Rule: Building Financial Peace',
    category: 'Budgeting Basics',
    durationMinutes: 10,
    difficulty: 'Beginner',
    summary: 'Master how to partition income into 50% non-negotiable needs, 30% flexible lifestyle wants, and 20% future wealth building.',
    content: `### Why Rigid Budgets Fail — And What Works Instead
Most conventional budgets fail because they feel punitive. The 50/30/20 rule is an intuitive cashflow framework designed to give you clarity and guilt-free spending freedom.

#### 1. 50% for Needs (Non-Negotiables)
These are bills you must pay to survive and remain employed:
- Rent or home mortgage EMI
- Basic groceries and cooking supplies
- Electricity, water, cooking gas, and mobile/broadband
- Minimum medical care, prescription medicine, and insurance premiums

#### 2. 30% for Wants (Lifestyle Choices)
Spending money on things you love is healthy, provided it is bounded:
- Dining out, artisanal coffees, and weekend socializing
- Wardrobe upgrades, hobbies, and book purchases
- Streaming subscriptions (Netflix, Spotify)

#### 3. 20% for Wealth & Security (Your Future Self)
This 20% is non-negotiable because it buys your independence:
- Liquid Emergency Fund until you reach 6 months of mandatory expenses
- Mutual Fund SIPs (Equity Index Funds like Nifty 50 or Sensex)
- Prepaying high-interest debts (such as credit card balances)

> **Golden Rule for Women Founders:** Never mix personal household accounts with enterprise revenues. Pay yourself a fixed founder salary on the 1st of every month!`,
    keyTakeaways: [
      'Needs should consume no more than 50% of your take-home pay.',
      'Treat savings as an automated bill on payday rather than saving what is left over at the end of the month.',
      'A separate personal account protects your peace of mind.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Under the 50/30/20 principle, where does an emergency fund contribution belong?',
        options: [
          'In the 30% lifestyle budget',
          'In the 20% wealth and security budget',
          'In the 50% mandatory living expenses budget',
          'It is not recommended to keep an emergency fund'
        ],
        correctIndex: 1,
        explanation: 'Emergency savings and systematic investments belong strictly within the 20% wealth and financial security allocation.'
      },
      {
        id: 'q2',
        question: 'If a woman earns ₹60,000 monthly take-home, what is the recommended maximum spending on essential needs?',
        options: ['₹18,000', '₹30,000', '₹45,000', '₹50,000'],
        correctIndex: 1,
        explanation: '50% of ₹60,000 equals exactly ₹30,000 allocated for rent, groceries, and essential utilities.'
      }
    ],
    completed: true,
    quizScore: 2
  },
  {
    id: 'lesson-saving',
    title: 'The Psychology of Saving: Friction & Pay Yourself First',
    category: 'Saving Money',
    durationMinutes: 8,
    difficulty: 'Beginner',
    summary: 'Discover behavioral finance techniques to make saving effortless through automation and positive friction.',
    content: `### Overcoming the "Save What's Left" Myth
Saving fails when we treat it as an afterthought. Human psychology dictates that as long as money sits visibly in an everyday checking account, we find compelling reasons to spend it.

#### The "Pay Yourself First" Architecture
1. **Automated Standing Instructions:** Schedule automated transfers to your savings and SIP accounts on the 1st or 2nd day after your paycheck arrives.
2. **Positive Friction:** Keep your emergency fund in a separate liquid bank account or sweep-in fixed deposit without a linked debit card on quick-delivery apps (Swiggy, Amazon).
3. **The 72-Hour Rule:** For any non-essential purchase exceeding ₹2,500, enforce a 72-hour cooling period. 70% of impulse buying desires evaporate within three days.`,
    keyTakeaways: [
      'Automate savings within 48 hours of income credit.',
      'Create positive friction to curb impulsive online purchases.',
      'Small regular transfers beat irregular massive deposits.'
    ],
    quiz: [
      {
        id: 'q3',
        question: 'What is the core idea of "Paying Yourself First"?',
        options: [
          'Buying luxury gifts before paying bills',
          'Transferring your savings allocation into separate investment accounts immediately on payday',
          'Waiting until the last day of the month to see if money remains',
          'Borrowing money from family to invest in volatile assets'
        ],
        correctIndex: 1,
        explanation: 'Paying yourself first means treating your savings and investments as your most important non-negotiable monthly bill on the day your salary is credited.'
      }
    ],
    completed: true,
    quizScore: 1
  },
  {
    id: 'lesson-banking',
    title: 'Banking Fundamentals: High-Yield Accounts & Zero Hidden Fees',
    category: 'Banking Fundamentals',
    durationMinutes: 12,
    difficulty: 'Beginner',
    summary: 'Learn how sweep-in accounts work, how to avoid bank penalties, and how to verify digital banking security.',
    content: `### Optimizing Your Everyday Banking
A bank account should serve your growth rather than bleed your hard-earned money in maintenance fees and non-maintenance penalties.

#### Key Banking Features Every Woman Should Enable:
1. **Auto Sweep-In Facility:** Allows surplus savings balances beyond a set threshold (e.g. ₹25,000) to automatically earn 6.5%-7.5% fixed deposit interest while retaining 100% instant liquid withdrawal accessibility.
2. **Zero-Balance Salary / Women Advantage Accounts:** Avoid penalty fees when cashflow is seasonal or during career transitions.
3. **Account Aggregator (AA) Framework:** Secure RBI-approved data sharing protocol that lets you share bank statements with lenders or financial apps without disclosing login passwords or paper statements.`,
    keyTakeaways: [
      'Enable sweep-in deposits to earn 2x more interest on idle savings.',
      'Check for hidden debit card annual charges and SMS alert fees.',
      'Never share OTPs or Net Banking passwords with callers claiming to be bank managers.'
    ],
    quiz: [
      {
        id: 'q4',
        question: 'What is the primary advantage of an Auto Sweep-in facility?',
        options: [
          'It locks your money for 10 years without withdrawal access',
          'It earns higher fixed deposit interest on idle balances while remaining instantly liquid',
          'It doubles your credit card limit automatically',
          'It eliminates the need to file income tax returns'
        ],
        correctIndex: 1,
        explanation: 'Auto sweep-in balances earn FD-level interest rates while being instantly available for debit card swipes, UPI payments, or ATM withdrawals.'
      }
    ],
    completed: false
  },
  {
    id: 'lesson-interest',
    title: 'Understanding Interest: Simple, Compound & The Rule of 72',
    category: 'Understanding Interest',
    durationMinutes: 15,
    difficulty: 'Intermediate',
    summary: 'How compound growth accelerates wealth over time, and how high compounding interest in credit cards can lead to debt traps.',
    content: `### Compound Interest: Albert Einstein's "Eighth Wonder"
Understanding compound interest gives you the superpower to let your money work for you 24 hours a day.

#### The Compounding Formula
When you invest ₹10,000 at 12% annual return:
- **Year 1:** You earn ₹1,200 (Total ₹11,200)
- **Year 2:** You earn 12% on ₹11,200 = ₹1,344 (Total ₹12,544)
- **Year 10:** Your ₹10,000 has grown to over **₹31,058** without you adding another rupee.

#### The Rule of 72
Divide 72 by your expected annual interest rate to determine how many years it will take to double your wealth:
- At **12% annual equity return**: $72 / 12 = 6$ years to double.
- At **6% savings account rate**: $72 / 6 = 12$ years to double.

> **The Dangerous Flipside:** Credit card companies charge **36% to 42% annual compound interest** on unpaid revolving balances, causing debts to double in less than 24 months!`,
    keyTakeaways: [
      'Time in the market matters far more than timing the market.',
      'The Rule of 72 quickly estimates investment doubling time.',
      'Always pay credit card statements in full to avoid high compounding penalties.'
    ],
    quiz: [
      {
        id: 'q5',
        question: 'Using the Rule of 72, approximately how many years will it take an investment earning 12% per year to double?',
        options: ['12 years', '6 years', '2 years', '18 years'],
        correctIndex: 1,
        explanation: '72 divided by 12 equals 6. Your money doubles roughly every 6 years at a 12% compounding rate.'
      }
    ],
    completed: false
  },
  {
    id: 'lesson-debt',
    title: 'Loans & Debt Management: The Snowball vs. Avalanche Method',
    category: 'Loans and Debt Management',
    durationMinutes: 14,
    difficulty: 'Intermediate',
    summary: 'Strategically pay down high-interest liabilities, student loans, and credit cards without damaging mental health.',
    content: `### Escaping the Debt Trap with Systemic Strategy
Debt is not a moral failing; it is a financial puzzle requiring mathematical and behavioral clarity.

#### The Two Proven Payoff Strategies:
1. **The Avalanche Method (Mathematically Optimal):**
   - List all debts in descending order of interest rate.
   - Pay minimum EMIs on all accounts, and throw every surplus rupee at the highest interest debt (usually credit cards at 36%+).
   - Saves the maximum total interest expense over time.
2. **The Snowball Method (Psychologically Rewarding):**
   - List debts from smallest remaining balance to largest.
   - Pay off the smallest debt entirely first to get quick psychological momentum and reduce the number of bills.`,
    keyTakeaways: [
      'Prioritize high-interest credit card debt over low-interest home loans.',
      'Never borrow to invest in speculative schemes.',
      'Consolidate multiple personal loans into a single lower-interest loan if feasible.'
    ],
    quiz: [
      {
        id: 'q6',
        question: 'Which debt payoff method prioritizes paying off the debt with the highest interest rate first?',
        options: [
          'The Snowball Method',
          'The Avalanche Method',
          'The Lottery Method',
          'The Minimum-Only Method'
        ],
        correctIndex: 1,
        explanation: 'The Debt Avalanche targets the highest APR debt first, which mathematically saves the most money in interest charges.'
      }
    ],
    completed: false
  },
  {
    id: 'lesson-credit',
    title: 'Demystifying Credit Scores (CIBIL 750+): Unlocking Prime Rates',
    category: 'Credit Scores',
    durationMinutes: 11,
    difficulty: 'Beginner',
    summary: 'How credit scores are calculated, why women must build their own independent credit histories, and how to improve scores rapidly.',
    content: `### Why Every Woman Needs Her Own Independent Credit Score
A pristine credit score (750+) is your passport to obtaining business loans, lower home mortgage interest rates, and premium card benefits in your own name.

#### What Affects Your Score:
- **Payment History (35%):** 100% on-time EMI and card payments. A single 30-day late payment can drop your score by 40-60 points.
- **Credit Utilization Ratio (30%):** Keep spending under 30% of your total sanctioned limit. If your limit is ₹1,00,000, keep statement balances below ₹30,000.
- **Credit Age & Mix (25%):** A healthy mix of secured and unsecured credit over time.
- **Hard Inquiries (10%):** Avoid applying for 5 credit cards simultaneously.`,
    keyTakeaways: [
      'Keep credit utilization under 30%.',
      'Never guarantee or co-sign a loan for someone else without full understanding of liability.',
      'Check your credit report once a year for errors.'
    ],
    quiz: [
      {
        id: 'q7',
        question: 'What is the recommended maximum credit utilization ratio to maintain an excellent credit score?',
        options: ['90%', '70%', '30%', '100%'],
        correctIndex: 2,
        explanation: 'Credit bureaus favor utilization under 30% of your total credit limit to indicate disciplined borrowing.'
      }
    ],
    completed: false
  },
  {
    id: 'lesson-emergency',
    title: 'Emergency Funds: Your Anchor of Independence',
    category: 'Emergency Funds',
    durationMinutes: 9,
    difficulty: 'Beginner',
    summary: 'Calculate your true 3 to 6-month living expenses and set up high-yield liquid buffers that let you walk away from bad situations.',
    content: `### The Power to Walk Away
An emergency fund is not merely about car repairs; it is about dignity. It gives you the power to leave toxic work environments, navigate health emergencies, or survive business dry spells without borrowing from anyone.

#### Calculating Your Target:
$$\\text{Emergency Cushion} = \\text{Monthly Mandatory Needs} \\times 6$$
If your rent, groceries, and bills equal ₹25,000/month, your target is ₹1,50,000. Keep 50% in a liquid high-yield bank account and 50% in an ultra-short term mutual fund.`,
    keyTakeaways: [
      'Aim for 3-6 months for salaried women, 6-9 months for freelancers/founders.',
      'Store in safe, capital-protected liquid instruments.',
      'Do not invest your emergency fund in volatile stocks.'
    ],
    quiz: [
      {
        id: 'q8',
        question: 'Where should an Emergency Fund ideally be stored?',
        options: [
          'In high-risk speculative cryptocurrency',
          'In a locked 10-year real estate property',
          'In safe, high-yield liquid accounts or sweep-in deposits with instant access',
          'In physical cash under a mattress'
        ],
        correctIndex: 2,
        explanation: 'Emergency funds must prioritize capital safety and instant 24/7 liquidity over aggressive returns.'
      }
    ],
    completed: true,
    quizScore: 1
  },
  {
    id: 'lesson-planning',
    title: 'Comprehensive Financial Planning: Life Goals to Portfolio Allocation',
    category: 'Financial Planning',
    durationMinutes: 16,
    difficulty: 'Advanced',
    summary: 'Map life goals (home purchase, child education, sabbatical, retirement) to distinct time horizons and asset classes.',
    content: `### Goal-Based Asset Allocation
Never invest randomly; attach every rupee to a specific life milestone and timeline.

#### The Three Buckets:
1. **Short-Term (0 to 3 Years):** Fixed Deposits, Treasury Bills, Liquid Debt Funds. (Protect capital; zero equity).
2. **Medium-Term (3 to 7 Years):** Hybrid Funds, Balanced Advantage Funds, Sovereign Gold Bonds.
3. **Long-Term (7+ Years):** Diversified Equity Mutual Funds, Index Funds (Nifty 50, S&P 500). (Harness compounding growth).`,
    keyTakeaways: [
      'Short-term money should never be exposed to stock market volatility.',
      'Equity is the only asset class historically proven to beat 7% inflation over 10+ year horizons.',
      'Rebalance your portfolio once a year.'
    ],
    quiz: [
      {
        id: 'q9',
        question: 'Which asset class is most suitable for a goal you need to fulfill within 12 months?',
        options: [
          'High-growth small-cap equity stocks',
          'Capital-protected Fixed Deposits or Liquid Debt funds',
          'Cryptocurrency and NFTs',
          'Raw commercial land'
        ],
        correctIndex: 1,
        explanation: 'For any goal within 3 years, capital preservation is paramount because you cannot afford to wait out a market downturn.'
      }
    ],
    completed: false
  },
  {
    id: 'lesson-beginners',
    title: 'Personal Finance for Beginners: Demystifying Common Money Jargon',
    category: 'Personal Finance for Beginners',
    durationMinutes: 10,
    difficulty: 'Beginner',
    summary: 'Clear, jargon-free explanations of SIPs, NAV, Inflation, Gross vs Net Income, and Asset vs Liability.',
    content: `### De-coding the Financial World
Finance is made unnecessarily complex to intimidate women. Let us strip away the jargon:
- **Gross vs Net Income:** Gross is what is on paper before taxes and deductions; Net is what actually enters your bank account.
- **Inflation:** The silent thief that erodes purchasing power (a ₹100 grocery item will cost ₹107 next year at 7% inflation).
- **Asset vs Liability:** Assets put money into your pocket (index funds, income-producing business); liabilities take money out (high-interest car loans, credit debt).`,
    keyTakeaways: [
      'Always calculate your budgets on Net Income, never Gross.',
      'Cash sitting idle in a 2.5% savings account loses purchasing power every day.',
      'Invest in income-generating assets.'
    ],
    quiz: [
      {
        id: 'q10',
        question: 'What is the primary difference between an Asset and a Liability?',
        options: [
          'Assets are always physical gold, liabilities are paper',
          'Assets generate value or put money in your pocket; liabilities cost money to maintain',
          'There is no difference in personal finance',
          'Liabilities are provided free by the government'
        ],
        correctIndex: 1,
        explanation: 'Assets produce cashflow or appreciate in value; liabilities drain financial resources through payments and interest.'
      }
    ],
    completed: false
  },
  {
    id: 'lesson-independence',
    title: 'Financial Independence & The FIRE Movement for Women',
    category: 'Financial Independence',
    durationMinutes: 18,
    difficulty: 'Advanced',
    summary: 'The 4% Safe Withdrawal Rule, calculating your FIRE number, and building life autonomy.',
    content: `### What Does True Financial Freedom Look Like?
Financial independence is not about buying luxury yachts; it is the freedom to wake up every morning and say: *"I work because I choose to, on projects that align with my values, with people I respect."*

#### Calculating Your Financial Independence Number:
$$\\text{FIRE Number} = \\text{Annual Living Expenses} \\times 25$$
- If your comfortable annual expenses are ₹6,00,000 (₹50,000/mo), your independence number is **₹1.5 Crores**.
- Once achieved, withdrawing 4% annually (₹6,00,000) adjusted for inflation has a 98% historical probability of sustaining you indefinitely without depleting principal.`,
    keyTakeaways: [
      'Financial independence equals 25x your annual living expenses.',
      'The 4% rule provides safe inflation-adjusted retirement withdrawals.',
      'Focus on increasing savings rate and building high-margin side income.'
    ],
    quiz: [
      {
        id: 'q11',
        question: 'Based on the 25x rule, what is the Financial Independence target for someone spending ₹40,000 per month (₹4,80,000 annually)?',
        options: ['₹48 Lakhs', '₹1.2 Crores', '₹2.5 Crores', '₹50 Lakhs'],
        correctIndex: 1,
        explanation: '₹4,80,000 multiplied by 25 equals ₹1,20,00,000 (₹1.2 Crores).'
      }
    ],
    completed: false
  }
];

