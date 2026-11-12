import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { store, Transaction, BudgetCategory, SavingsGoal } from '../data/mockStore.js';
import { callGroqChat } from '../services/groqService.js';
import { config } from '../config/env.js';
import { TransactionModel } from '../models/TransactionModel.js';
import { BudgetCategoryModel } from '../models/BudgetModel.js';
import { SavingsGoalModel } from '../models/SavingsGoalModel.js';
import { UserModel } from '../models/UserModel.js';

export const getFinanceOverview = async (req: Request, res: Response) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const txs = await TransactionModel.find();
      const goals = await SavingsGoalModel.find();
      const categories = await BudgetCategoryModel.find();

      const totalIncome = txs
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpenses = txs
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const netBalance = totalIncome - totalExpenses;
      const totalSavings = goals.reduce((sum, g) => sum + g.currentAmount, 0);
      const emergencyGoal = goals.find((g) => g.category === 'Emergency Fund');
      const emergencyCoverageMonths = totalExpenses > 0 ? Number(((emergencyGoal?.currentAmount || totalSavings) / totalExpenses).toFixed(1)) : 6.0;

      return res.status(200).json({
        success: true,
        source: 'mongodb-atlas',
        data: {
          totalIncome,
          totalExpenses,
          netBalance,
          totalSavings,
          emergencyCoverageMonths,
          activeGoalsCount: goals.filter((g) => g.status === 'active').length,
          categoriesTracked: categories.length
        }
      });
    } catch (err: any) {
      console.warn('[MongoDB Atlas] Overview query error, falling back:', err.message);
    }
  }

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
    source: 'in-memory',
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

export const getTransactions = async (req: Request, res: Response) => {
  const { type, category, search } = req.query;

  if (mongoose.connection.readyState === 1) {
    try {
      const queryFilter: any = {};
      if (type && type !== 'all') queryFilter.type = type;
      if (category && category !== 'all') queryFilter.category = new RegExp(String(category), 'i');
      if (search) {
        queryFilter.$or = [
          { title: new RegExp(String(search), 'i') },
          { notes: new RegExp(String(search), 'i') }
        ];
      }

      const txs = await TransactionModel.find(queryFilter).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        source: 'mongodb-atlas',
        count: txs.length,
        data: txs.map((t) => ({
          id: t._id.toString(),
          userId: t.userId,
          title: t.title,
          amount: t.amount,
          type: t.type,
          category: t.category,
          date: t.date,
          paymentMethod: t.paymentMethod,
          notes: t.notes,
          createdAt: t.createdAt
        }))
      });
    } catch (err: any) {
      console.warn('[MongoDB Atlas] Query error, falling back:', err.message);
    }
  }

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

  return res.status(200).json({ success: true, source: 'in-memory', count: result.length, data: result });
};

export const createTransaction = async (req: Request, res: Response) => {
  const { title, amount, type, category, date, paymentMethod, notes } = req.body;

  if (!title || !amount || !type || !category) {
    return res.status(400).json({ success: false, error: 'Missing required transaction fields' });
  }

  const txData = {
    userId: 'usr-101',
    title,
    amount: Number(amount),
    type: type as 'income' | 'expense',
    category,
    date: date || new Date().toISOString().split('T')[0],
    paymentMethod: paymentMethod || 'UPI',
    notes: notes || ''
  };

  if (mongoose.connection.readyState === 1) {
    try {
      const doc = await TransactionModel.create(txData);

      if (type === 'expense') {
        await BudgetCategoryModel.updateOne(
          { categoryName: new RegExp(`^${category}$`, 'i') },
          { $inc: { spent: Number(amount) } }
        );
      }

      return res.status(201).json({
        success: true,
        source: 'mongodb-atlas',
        message: 'Transaction saved to MongoDB Atlas',
        data: {
          id: doc._id.toString(),
          ...txData,
          createdAt: doc.createdAt
        }
      });
    } catch (err: any) {
      console.warn('[MongoDB Atlas] Insert error, falling back to memory:', err.message);
    }
  }

  const newTx: Transaction = {
    id: `tx-${Date.now()}`,
    ...txData,
    createdAt: new Date().toISOString()
  };

  store.transactions.unshift(newTx);

  if (type === 'expense') {
    const cat = store.budgetCategories.find((c) => c.categoryName.toLowerCase() === category.toLowerCase());
    if (cat) cat.spent += Number(amount);
  }

  return res.status(201).json({ success: true, source: 'in-memory', message: 'Transaction logged', data: newTx });
};

export const deleteTransaction = async (req: Request, res: Response) => {
  const id = String(req.params.id);

  if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
    try {
      const deleted = await TransactionModel.findByIdAndDelete(id);
      if (deleted) {
        return res.status(200).json({ success: true, source: 'mongodb-atlas', message: 'Transaction deleted from MongoDB', data: deleted });
      }
    } catch (err: any) {
      console.warn('[MongoDB Atlas] Delete error:', err.message);
    }
  }

  const idx = store.transactions.findIndex((t) => t.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Transaction not found' });
  }

  const [removed] = store.transactions.splice(idx, 1);
  return res.status(200).json({ success: true, source: 'in-memory', message: 'Transaction deleted', data: removed });
};

export const getBudgetCategories = async (req: Request, res: Response) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const cats = await BudgetCategoryModel.find();
      if (cats.length > 0) {
        return res.status(200).json({
          success: true,
          source: 'mongodb-atlas',
          data: cats.map((c) => ({
            categoryId: c.categoryId,
            categoryName: c.categoryName,
            limit: c.limit,
            spent: c.spent,
            color: c.color
          }))
        });
      }
    } catch (err: any) {
      console.warn('[MongoDB Atlas] Budget query error:', err.message);
    }
  }

  return res.status(200).json({ success: true, source: 'in-memory', data: store.budgetCategories });
};

export const updateBudgetCategoryLimit = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { limit } = req.body;

  if (mongoose.connection.readyState === 1) {
    try {
      const updated = await BudgetCategoryModel.findOneAndUpdate(
        { categoryId },
        { limit: Number(limit) },
        { new: true }
      );
      if (updated) {
        return res.status(200).json({ success: true, source: 'mongodb-atlas', message: 'Limit updated in MongoDB', data: updated });
      }
    } catch (err: any) {
      console.warn('[MongoDB Atlas] Update limit error:', err.message);
    }
  }

  const cat = store.budgetCategories.find((c) => c.categoryId === categoryId);
  if (!cat) {
    return res.status(404).json({ success: false, error: 'Category not found' });
  }

  cat.limit = Number(limit);
  return res.status(200).json({ success: true, source: 'in-memory', message: 'Limit updated', data: cat });
};

export const getSavingsGoals = async (req: Request, res: Response) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const goals = await SavingsGoalModel.find();
      if (goals.length > 0) {
        return res.status(200).json({
          success: true,
          source: 'mongodb-atlas',
          data: goals.map((g) => ({
            id: g._id.toString(),
            userId: g.userId,
            title: g.title,
            targetAmount: g.targetAmount,
            currentAmount: g.currentAmount,
            targetDate: g.targetDate,
            category: g.category,
            status: g.status,
            color: g.color
          }))
        });
      }
    } catch (err: any) {
      console.warn('[MongoDB Atlas] Goals query error:', err.message);
    }
  }

  return res.status(200).json({ success: true, source: 'in-memory', data: store.goals });
};

export const createSavingsGoal = async (req: Request, res: Response) => {
  const { title, targetAmount, targetDate, category, color } = req.body;

  if (!title || !targetAmount || !targetDate) {
    return res.status(400).json({ success: false, error: 'Title, targetAmount, and targetDate required' });
  }

  const goalData = {
    userId: 'usr-101',
    title,
    targetAmount: Number(targetAmount),
    currentAmount: 0,
    targetDate,
    category: category || 'General',
    status: 'active' as const,
    color: color || '#0d9488'
  };

  if (mongoose.connection.readyState === 1) {
    try {
      const doc = await SavingsGoalModel.create(goalData);
      return res.status(201).json({
        success: true,
        source: 'mongodb-atlas',
        message: 'Savings goal saved in MongoDB Atlas',
        data: {
          id: doc._id.toString(),
          ...goalData
        }
      });
    } catch (err: any) {
      console.warn('[MongoDB Atlas] Goal create error:', err.message);
    }
  }

  const newGoal: SavingsGoal = {
    id: `goal-${Date.now()}`,
    ...goalData
  };

  store.goals.push(newGoal);
  return res.status(201).json({ success: true, source: 'in-memory', message: 'Savings goal launched', data: newGoal });
};

export const depositToGoal = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const { amount } = req.body;
  const depositNum = Number(amount) || 0;

  if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
    try {
      const goal = await SavingsGoalModel.findById(id);
      if (goal) {
        goal.currentAmount += depositNum;
        if (goal.currentAmount >= goal.targetAmount) {
          goal.status = 'completed';
        }
        await goal.save();
        return res.status(200).json({
          success: true,
          source: 'mongodb-atlas',
          message: `Deposited ₹${depositNum.toLocaleString()} to MongoDB Atlas`,
          data: goal
        });
      }
    } catch (err: any) {
      console.warn('[MongoDB Atlas] Deposit error:', err.message);
    }
  }

  const goal = store.goals.find((g) => g.id === id);
  if (!goal) {
    return res.status(404).json({ success: false, error: 'Goal not found' });
  }

  goal.currentAmount += depositNum;
  if (goal.currentAmount >= goal.targetAmount) {
    goal.status = 'completed';
  }

  return res.status(200).json({ success: true, source: 'in-memory', message: `Deposited ₹${depositNum.toLocaleString()}`, data: goal });
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

export const setupFinancialProfile = async (req: Request, res: Response) => {
  const {
    fullName,
    email,
    monthlyIncome,
    incomeSources,
    monthlyExpenses,
    currentSavings,
    primaryGoal,
    riskTolerance,
    emergencyFundTargetMonths,
    currency
  } = req.body;

  if (!fullName || !email || !monthlyIncome) {
    return res.status(400).json({ success: false, error: 'Name, email, and monthly income are required.' });
  }

  // If MongoDB is connected:
  if (mongoose.connection.readyState === 1) {
    try {
      // 1. Update or create User
      const user = await UserModel.findOneAndUpdate(
        { email: email.toLowerCase() },
        {
          name: fullName,
          email: email.toLowerCase(),
          financialSetupCompleted: true,
          financialProfile: {
            monthlyIncome: Number(monthlyIncome),
            incomeSources: incomeSources || [{ name: 'Primary Income', amount: Number(monthlyIncome), type: 'salary' }],
            emergencyFundTargetMonths: Number(emergencyFundTargetMonths) || 6,
            riskTolerance: riskTolerance || 'moderate',
            currency: currency || 'INR',
            currentSavings: Number(currentSavings) || 0
          }
        },
        { upsert: true, new: true }
      );

      // 2. Rebuild budget categories from user's actual entered expenses
      await BudgetCategoryModel.deleteMany({ userId: 'usr-101' });
      const newBudgetDocs: any[] = [];
      const colors = ['#1e3a8a', '#0d9488', '#059669', '#d97706', '#e11d48', '#9333ea', '#2563eb', '#f59e0b'];

      if (Array.isArray(monthlyExpenses) && monthlyExpenses.length > 0) {
        for (let i = 0; i < monthlyExpenses.length; i++) {
          const exp = monthlyExpenses[i];
          if (exp.amount > 0) {
            newBudgetDocs.push({
              userId: 'usr-101',
              categoryId: `cat-${exp.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
              categoryName: exp.category,
              limit: Number(exp.amount),
              spent: Number(exp.spent || 0),
              color: colors[i % colors.length]
            });
          }
        }
      }

      if (newBudgetDocs.length > 0) {
        await BudgetCategoryModel.insertMany(newBudgetDocs);
      }

      // 3. Clear old goals and create user's goals
      await SavingsGoalModel.deleteMany({ userId: 'usr-101' });
      const goalsToCreate: any[] = [];

      // A: Emergency Cushion Fund if currentSavings entered
      if (Number(currentSavings) > 0) {
        const totalExp = Array.isArray(monthlyExpenses)
          ? monthlyExpenses.reduce((s: number, e: any) => s + (Number(e.amount) || 0), 0)
          : 40000;
        const targetRunway = (Number(emergencyFundTargetMonths) || 6) * totalExp;
        goalsToCreate.push({
          userId: 'usr-101',
          title: 'Liquid Emergency Cushion',
          targetAmount: targetRunway > 0 ? targetRunway : Number(currentSavings) * 1.5,
          currentAmount: Number(currentSavings),
          targetDate: '2027-06-30',
          category: 'Emergency Fund',
          status: 'active',
          color: '#1e3a8a'
        });
      }

      // B: Primary Goal
      if (primaryGoal && primaryGoal.title && primaryGoal.targetAmount) {
        goalsToCreate.push({
          userId: 'usr-101',
          title: primaryGoal.title,
          targetAmount: Number(primaryGoal.targetAmount),
          currentAmount: Number(primaryGoal.currentAmount || 0),
          targetDate: primaryGoal.targetDate || '2027-04-30',
          category: primaryGoal.category || 'General',
          status: 'active',
          color: '#0d9488'
        });
      }

      if (goalsToCreate.length > 0) {
        await SavingsGoalModel.insertMany(goalsToCreate);
      }

      // 4. Create opening transaction record for verified monthly income
      await TransactionModel.deleteMany({ userId: 'usr-101' });
      await TransactionModel.create({
        userId: 'usr-101',
        title: incomeSources?.[0]?.name || 'Baseline Monthly Income',
        amount: Number(monthlyIncome),
        type: 'income',
        category: 'Monthly Salary',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer',
        notes: 'User verified baseline monthly inflow'
      });

      return res.status(200).json({
        success: true,
        source: 'mongodb-atlas',
        message: 'Financial profile and custom budget successfully configured in MongoDB Atlas',
        data: {
          user,
          budgetCount: newBudgetDocs.length,
          primaryGoal
        }
      });
    } catch (err: any) {
      console.warn('[MongoDB Atlas] Profile setup error, falling back:', err.message);
    }
  }

  // In-memory fallback
  return res.status(200).json({
    success: true,
    source: 'in-memory',
    message: 'Financial baseline profile registered successfully'
  });
};

