import mongoose, { Schema, Document } from 'mongoose';

export interface IBudgetCategory extends Document {
  userId: string;
  categoryId: string;
  categoryName: string;
  limit: number;
  spent: number;
  color: string;
}

const BudgetCategorySchema: Schema = new Schema(
  {
    userId: { type: String, default: 'usr-101' },
    categoryId: { type: String, required: true },
    categoryName: { type: String, required: true },
    limit: { type: Number, required: true },
    spent: { type: Number, default: 0 },
    color: { type: String, default: '#0d9488' }
  },
  { timestamps: true }
);

export const BudgetCategoryModel = mongoose.model<IBudgetCategory>('BudgetCategory', BudgetCategorySchema);

