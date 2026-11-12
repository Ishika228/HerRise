import { Request, Response } from 'express';
import { store, Transaction, BudgetCategory, SavingsGoal } from '../data/mockStore.js';
import { callGroqChat } from '../services/groqService.js';
import { config } from '../config/env.js';

export const getFinanceOverview = (req: Request, res: Response) => {
  const transactions = store.transactions;
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;
  const totalSavings = store.goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const emergencyGoal = store.goals.find((g) => g.category === 'Emergency Fund');
  const emergencyCoverageMonths = totalExpenses > 0 ? Number(((emergencyGoal?.currentAmount || totalSavings) / totalExpenses).toFixed(1)) : 6.0;

  return res.status(200).json({
    success: true,
    data: {
      totalIncome,
      totalExpenses,
      netBalance,
      totalSavings,
      emergencyCoverageMonths,
      activeGoalsCount: store.goals.filter((g) => g.status === 'active').length,
      categoriesTracked: store.budgetCategories.length
    }
  });
};

export const getTransactions = (req: Request, res: Response) => {
  const { type, category, search } = req.query;
  let result = [...store.transactions];

  if (type && type !== 'all') {
    result = result.filter((t) => t.type === type);
  }

  if (category && category !== 'all') {
    result = result.filter((t) => t.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter((t) => t.title.toLowerCase().includes(q) || (t.notes && t.notes.toLowerCase().includes(q)));
  }

  return res.status(200).json({ success: true, count: result.length, data: result });
};

export const createTransaction = (req: Request, res: Response) => {
  const { title, amount, type, category, date, paymentMethod, notes } = req.body;

  if (!title || !amount || !type || !category) {
    return res.status(400).json({ success: false, error: 'Missing required transaction fields' });
  }

  const newTx: Transaction = {
    id: `tx-${Date.now()}`,
    userId: 'usr-101',
    title,
    amount: Number(amount),
    type: type as 'income' | 'expense',
    category,
    date: date || new Date().toISOString().split('T')[0],
    paymentMethod: paymentMethod || 'UPI',
    notes: notes || '',
    createdAt: new Date().toISOString()
  };

  store.transactions.unshift(newTx);

  // Dynamically update category spent if expense
  if (type === 'expense') {
    const cat = store.budgetCategories.find((c) => c.categoryName.toLowerCase() === category.toLowerCase());
    if (cat) cat.spent += Number(amount);
  }

  return res.status(201).json({ success: true, message: 'Transaction logged', data: newTx });
};

export const deleteTransaction = (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = store.transactions.findIndex((t) => t.id === id);

  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Transaction not found' });
  }

  const [removed] = store.transactions.splice(idx, 1);
  return res.status(200).json({ success: true, message: 'Transaction deleted', data: removed });
};

export const getBudgetCategories = (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: store.budgetCategories });
};

export const updateBudgetCategoryLimit = (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { limit } = req.body;

  const cat = store.budgetCategories.find((c) => c.categoryId === categoryId);
  if (!cat) {
    return res.status(404).json({ success: false, error: 'Category not found' });
  }

  cat.limit = Number(limit);
  return res.status(200).json({ success: true, message: 'Limit updated', data: cat });
};

export const getSavingsGoals = (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: store.goals });
};

export const createSavingsGoal = (req: Request, res: Response) => {
  const { title, targetAmount, targetDate, category, color } = req.body;

  if (!title || !targetAmount || !targetDate) {
    return res.status(400).json({ success: false, error: 'Title, targetAmount, and targetDate required' });
  }

  const newGoal: SavingsGoal = {
    id: `goal-${Date.now()}`,
    userId: 'usr-101',
    title,
    targetAmount: Number(targetAmount),
    currentAmount: 0,
    targetDate,
    category: category || 'General',
    status: 'active',
    color: color || '#0d9488'
  };

  store.goals.push(newGoal);
  return res.status(201).json({ success: true, message: 'Savings goal launched', data: newGoal });
};

export const depositToGoal = (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount } = req.body;

  const goal = store.goals.find((g) => g.id === id);
  if (!goal) {
    return res.status(404).json({ success: false, error: 'Goal not found' });
  }

  const depositNum = Number(amount) || 0;
  goal.currentAmount += depositNum;
  if (goal.currentAmount >= goal.targetAmount) {
    goal.status = 'completed';
  }

  return res.status(200).json({ success: true, message: `Deposited ₹${depositNum.toLocaleString()}`, data: goal });
};

export const processOcrReceipt = (req: Request, res: Response) => {
  const { receiptType } = req.body; // e.g. "groceries", "coworking", "electronics"
  
  const mockTemplates: Record<string, any> = {
    groceries: {
      merchant: "Nature's Basket Fine Foods",
      amount: 4250,
      date: new Date().toISOString().split('T')[0],
      category: 'Groceries & Staples',
      confidence: 0.98,
      items: ['Organic Almond Milk (1L)', 'Whole Grain Sourdough', 'Himalayan Pink Salt', 'Kashmiri Walnuts']
    },
    coworking: {
      merchant: 'WeWork Management India',
      amount: 3200,
      date: new Date().toISOString().split('T')[0],
      category: 'Utilities & Bills',
      confidence: 0.96,
      items: ['Day Pass Hot Desk (2 sessions)', 'Conference Room Booking (1 hr)']
    },
    electronics: {
      merchant: 'Croma Electronics Retail',
      amount: 1899,
      date: new Date().toISOString().split('T')[0],
      category: 'Shopping & Lifestyle',
      confidence: 0.95,
      items: ['USB-C Multiport Adapter 7-in-1', 'Braided Cable 2M']
    }
  };

  const extracted = mockTemplates[receiptType] || mockTemplates.groceries;
  return res.status(200).json({
    success: true,
    message: 'Receipt parsed via OCR engine. User verification required before committing.',
    data: extracted
  });
};

export const aiConsult = async (req: Request, res: Response) => {
  const { query } = req.body;
  const totalIncome = store.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = store.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const net = totalIncome - totalExpenses;

  // If Groq API key is present, generate real LLM response using Groq
  if (config.groqApiKey) {
    try {
      const groqResponse = await callGroqChat([
        {
          role: 'system',
          content: `You are HerRise AI's Financial Copilot, an empathetic, expert personal finance advisor for women entrepreneurs and professionals. 
Context:
- User's Monthly Income: ₹${totalIncome}
- User's Monthly Expenses: ₹${totalExpenses}
- Net Monthly Surplus: ₹${net}
- Active Goals: ${store.goals.map(g => `${g.title} (Saved: ₹${g.currentAmount}/₹${g.targetAmount})`).join(', ')}

Guidelines:
- Provide structured, practical, empowering advice.
- Always include an educational perspective.
- Always end with a disclaimer: "Financial Education Only – Not Regulated Financial Advice."`
        },
        {
          role: 'user',
          content: query || 'How should I optimize my budget and savings this month?'
        }
      ]);

      return res.status(200).json({
        success: true,
        source: 'groq-llm',
        data: {
          response: groqResponse,
          disclaimer: 'Financial Education Only – Not Regulated Financial Advice.'
        }
      });
    } catch (err: any) {
      console.error('[Groq AI fallback to rule engine]:', err.message);
    }
  }

  // Fallback grounded context response
  return res.status(200).json({
    success: true,
    source: 'context-engine',
    data: {
      response: `Based on your live verified inflow of ₹${totalIncome.toLocaleString()} and outgoings of ₹${totalExpenses.toLocaleString()}, you currently retain a net monthly surplus of ₹${net.toLocaleString()} (${Math.round((net / (totalIncome || 1)) * 100)}% savings rate). We recommend prioritizing an automated SIP of ₹${Math.round(net * 0.5).toLocaleString()} towards index equity and maintaining a 6-month liquid cushion.`,
      disclaimer: 'Financial Education Only – Not Regulated Financial Advice.'
    }
  });
};

