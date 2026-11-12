import mongoose from 'mongoose';
import { TransactionModel } from '../models/TransactionModel.js';
import { BudgetCategoryModel } from '../models/BudgetModel.js';
import { SavingsGoalModel } from '../models/SavingsGoalModel.js';
import { store } from '../data/mockStore.js';

export async function seedMongoIfEmpty(): Promise<void> {
  if (mongoose.connection.readyState !== 1) return;

  try {
    const txCount = await TransactionModel.countDocuments();
    if (txCount === 0) {
      console.log('🌱 [MongoDB] Seeding initial transactions into Atlas cluster...');
      await TransactionModel.insertMany(
        store.transactions.map((t) => ({
          userId: t.userId,
          title: t.title,
          amount: t.amount,
          type: t.type,
          category: t.category,
          date: t.date,
          paymentMethod: t.paymentMethod,
          notes: t.notes
        }))
      );
      console.log('✅ [MongoDB] Initial transactions seeded successfully.');
    }

    const budgetCount = await BudgetCategoryModel.countDocuments();
    if (budgetCount === 0) {
      console.log('🌱 [MongoDB] Seeding budget categories into Atlas cluster...');
      await BudgetCategoryModel.insertMany(
        store.budgetCategories.map((b) => ({
          userId: 'usr-101',
          categoryId: b.categoryId,
          categoryName: b.categoryName,
          limit: b.limit,
          spent: b.spent,
          color: b.color
        }))
      );
      console.log('✅ [MongoDB] Budget categories seeded.');
    }

    const goalCount = await SavingsGoalModel.countDocuments();
    if (goalCount === 0) {
      console.log('🌱 [MongoDB] Seeding savings goals into Atlas cluster...');
      await SavingsGoalModel.insertMany(
        store.goals.map((g) => ({
          userId: g.userId,
          title: g.title,
          targetAmount: g.targetAmount,
          currentAmount: g.currentAmount,
          targetDate: g.targetDate,
          category: g.category,
          status: g.status,
          color: g.color
        }))
      );
      console.log('✅ [MongoDB] Savings goals seeded.');
    }
  } catch (error: any) {
    console.warn('⚠️ [MongoDB] Error during initial seeding:', error.message);
  }
}

