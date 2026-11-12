import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  paymentMethod: string;
  notes?: string;
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, default: 'usr-101' },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    paymentMethod: { type: String, default: 'UPI' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export const TransactionModel = mongoose.model<ITransaction>('Transaction', TransactionSchema);

