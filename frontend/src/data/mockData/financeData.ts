import { Transaction, SavingsGoal, BudgetCategory, FinancialLesson } from '../../types';

export const initialTransactions: Transaction[] = [];

export const initialSavingsGoals: SavingsGoal[] = [];

export const initialBudgetCategories: BudgetCategory[] = [];

export const monthlyFinancialTrend: { month: string; income: number; expenses: number; savings: number }[] = [];

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

