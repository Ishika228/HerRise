import { Transaction, SavingsGoal, BudgetCategory, FinancialLesson } from '../../types';

export const initialTransactions: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Consulting Client Retainer',
    amount: 45000,
    type: 'income',
    category: 'Consulting / Freelance',
    date: '2026-11-05',
    notes: 'Direct bank transfer for November services'
  },
  {
    id: 'tx-2',
    title: 'HerMarket Product Sales',
    amount: 18450,
    type: 'income',
    category: 'Business Revenue',
    date: '2026-11-08',
    notes: 'Online store earnings (Handmade Jewelry)'
  },
  {
    id: 'tx-3',
    title: 'Office Space & Internet',
    amount: 8500,
    type: 'expense',
    category: 'Workspace / Utilities',
    date: '2026-11-02',
    notes: 'Coworking desk and broadband fiber'
  },
  {
    id: 'tx-4',
    title: 'Packaging & Shipping Supplies',
    amount: 4200,
    type: 'expense',
    category: 'Business Operations',
    date: '2026-11-04',
    notes: 'Eco-friendly mailers and branding stickers'
  },
  {
    id: 'tx-5',
    title: 'Groceries & Household Health',
    amount: 6800,
    type: 'expense',
    category: 'Living & Healthcare',
    date: '2026-11-06',
    notes: 'Monthly staples and organic pantry items'
  },
  {
    id: 'tx-6',
    title: 'SIP Mutual Fund Investment',
    amount: 10000,
    type: 'expense',
    category: 'Investments',
    date: '2026-11-07',
    notes: 'Automated index fund wealth builder'
  },
  {
    id: 'tx-7',
    title: 'Skill Development Course',
    amount: 2500,
    type: 'expense',
    category: 'Education / Learning',
    date: '2026-11-09',
    notes: 'Advanced Digital Marketing Masterclass'
  }
];

export const initialSavingsGoals: SavingsGoal[] = [
  {
    id: 'goal-1',
    title: 'Emergency Safety Cushion (6 Months)',
    targetAmount: 180000,
    currentAmount: 135000,
    targetDate: '2027-03-31',
    category: 'Emergency',
    color: '#4A154B'
  },
  {
    id: 'goal-2',
    title: 'Micro-Enterprise Seed Capital',
    targetAmount: 100000,
    currentAmount: 64000,
    targetDate: '2027-06-30',
    category: 'Business',
    color: '#9333ea'
  },
  {
    id: 'goal-3',
    title: 'Professional Laptop Upgrade',
    targetAmount: 75000,
    currentAmount: 52000,
    targetDate: '2027-01-15',
    category: 'Career Tech',
    color: '#e11d48'
  },
  {
    id: 'goal-4',
    title: 'Annual Health & Life Insurance Premium',
    targetAmount: 24000,
    currentAmount: 20000,
    targetDate: '2026-12-20',
    category: 'Insurance',
    color: '#059669'
  }
];

export const initialBudgetCategories: BudgetCategory[] = [
  { category: 'Housing & Workspace', allocated: 15000, spent: 8500, color: '#4A154B' },
  { category: 'Business Operations', allocated: 12000, spent: 4200, color: '#9333ea' },
  { category: 'Living & Wellness', allocated: 14000, spent: 6800, color: '#059669' },
  { category: 'Savings & SIPs', allocated: 15000, spent: 10000, color: '#e11d48' },
  { category: 'Learning & Growth', allocated: 5000, spent: 2500, color: '#d97706' },
  { category: 'Miscellaneous', allocated: 4000, spent: 1200, color: '#6b7280' },
];

export const monthlyFinancialTrend = [
  { month: 'Jun', income: 48000, expenses: 28000, savings: 20000 },
  { month: 'Jul', income: 52000, expenses: 31000, savings: 21000 },
  { month: 'Aug', income: 56000, expenses: 29500, savings: 26500 },
  { month: 'Sep', income: 61000, expenses: 33000, savings: 28000 },
  { month: 'Oct', income: 64500, expenses: 32000, savings: 32500 },
  { month: 'Nov (Current)', income: 63450, expenses: 33200, savings: 30250 },
];

export const financialLessons: FinancialLesson[] = [
  {
    id: 'lesson-1',
    title: 'The 50/30/20 Rule: Building Financial Peace',
    category: 'Budgeting Fundamentals',
    duration: '8 mins',
    level: 'Beginner',
    summary: 'Master how to split net income into 50% essentials, 30% lifestyle choices, and 20% future wealth.',
    completed: true,
    content: `### Understanding the 50/30/20 Principle
A balanced budget is about peace of mind rather than restriction.
1. **50% Needs**: Housing, groceries, utility bills, minimum loan repayments, and basic healthcare.
2. **30% Wants**: Dining out, hobbies, subscriptions, vacations, and personal treats.
3. **20% Savings & Debt Acceleration**: Emergency funds, Mutual Fund SIPs, retirement savings, and principal prepayments.

**Pro-tip for Women Entrepreneurs**: Separate personal finances from business bank accounts from day one. Pay yourself a fixed monthly founder salary rather than withdrawing randomly.`
  },
  {
    id: 'lesson-2',
    title: 'Emergency Fund Architecture: Your Independence Anchor',
    category: 'Financial Resilience',
    duration: '10 mins',
    level: 'Beginner',
    summary: 'Calculate your true 3 to 6-month living expenses and set up high-yield liquid buffers.',
    completed: true,
    content: `### Why Every Woman Needs Her Own Emergency Buffer
An emergency fund provides the leverage to take calculated career pivots, leave toxic environments, or bridge dry seasons in business.
- **Recommended Size**: 3 to 6 months of mandatory living expenses for salaried professionals; 6 to 9 months for freelancers and entrepreneurs.
- **Where to Store**: Keep 50% in a liquid high-yield savings account and 50% in liquid mutual funds or sweep-in fixed deposits with instant withdrawal access.`
  },
  {
    id: 'lesson-3',
    title: 'SIPs & Index Investing: Beating Inflation Without Stress',
    category: 'Wealth Generation',
    duration: '12 mins',
    level: 'Intermediate',
    summary: 'How systematic investment plans (SIPs) in broad-market index funds turn small amounts into substantial wealth.',
    completed: false,
    content: `### The Magic of Compound Growth
Investing ₹5,000 every month at an assumed conservative 12% annual return can grow to over ₹11.6 Lakhs in 10 years and ₹50 Lakhs in 20 years.
- Rupee-Cost Averaging eliminates the need to time market ups and downs.
- Start small: Even ₹500/month establishes the wealth habit.`
  },
  {
    id: 'lesson-4',
    title: 'Demystifying Credit Scores & Women Business Loans',
    category: 'Credit & Leverage',
    duration: '14 mins',
    level: 'Intermediate',
    summary: 'How to build a 750+ credit score and leverage government-supported women credit schemes.',
    completed: false,
    content: `### Maximizing Credit Health
- Keep credit card utilization below 30% of total sanctioned limits.
- Never default on EMI dates — set up auto-debit 3 days before due dates.
- Understand the difference between secured loans and collateral-free microloans.`
  }
];

