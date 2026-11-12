import mongoose, { Schema, Document } from 'mongoose';

export interface ISavingsGoal extends Document {
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  status: 'active' | 'paused' | 'completed';
  color: string;
}

const SavingsGoalSchema: Schema = new Schema(
  {
    userId: { type: String, default: 'usr-101' },
    title: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    targetDate: { type: String, required: true },
    category: { type: String, default: 'General' },
    status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' },
    color: { type: String, default: '#0d9488' }
  },
  { timestamps: true }
);

export const SavingsGoalModel = mongoose.model<ISavingsGoal>('SavingsGoal', SavingsGoalSchema);

