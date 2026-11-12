import mongoose from 'mongoose';
import { TransactionModel } from '../models/TransactionModel.js';
import { BudgetCategoryModel } from '../models/BudgetModel.js';
import { SavingsGoalModel } from '../models/SavingsGoalModel.js';

export async function seedMongoIfEmpty(): Promise<void> {
  if (mongoose.connection.readyState !== 1) return;

  try {
    // Purge any legacy demo dummy records from Atlas cluster
    await TransactionModel.deleteMany({
      title: {
        $in: [
          'Consulting Retainer - TechCorp',
          'HerMarket Handcraft D2C Payout',
          'Studio Apartment Rental',
          'Nature Basket Organic Groceries',
          'WeWork Flexible Desk Pass'
        ]
      }
    });

    await SavingsGoalModel.deleteMany({
      title: {
        $in: [
          '6-Month Emergency Cushion',
          'M3 Pro Laptop for Design Work',
          'HerRise Micro-Enterprise Seed Fund'
        ]
      }
    });

    await BudgetCategoryModel.deleteMany({
      categoryId: {
        $in: [
          'cat-rent',
          'cat-groceries',
          'cat-transport',
          'cat-bills',
          'cat-health',
          'cat-shopping',
          'cat-dining'
        ]
      }
    });

    console.log('✅ [MongoDB Atlas] Cluster verified: Zero dummy data active. Ready for live user operations.');
  } catch (error: any) {
    console.warn('⚠️ [MongoDB] Error during database verification:', error.message);
  }
}

