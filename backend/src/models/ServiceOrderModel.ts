import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceOrder extends Document {
  orderId: string;
  userId?: string;
  userEmail: string;
  customerName: string;
  businessName: string;
  phone: string;
  email: string;
  category: string;
  location: string;
  selectedPackageName: string;
  selectedPackagePrice: number;
  servicesRequired: string[];
  selectedAddOns: string[];
  oneTimeTotal: number;
  monthlyTotal: number;
  status: 'In Progress' | 'Confirmed' | 'Completed' | 'Pending';
  requestDate: string;
  paymentDetails: {
    method: string;
    transactionId: string;
    amountPaid: number;
    status: string;
    paidAt: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ServiceOrderSchema = new Schema<IServiceOrder>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    userEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    customerName: { type: String, required: true, trim: true },
    businessName: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    category: { type: String, default: 'Digital Services' },
    location: { type: String, default: 'Australia' },
    selectedPackageName: { type: String, required: true },
    selectedPackagePrice: { type: Number, required: true, min: 0 },
    servicesRequired: { type: [String], default: [] },
    selectedAddOns: { type: [String], default: [] },
    oneTimeTotal: { type: Number, required: true, min: 0 },
    monthlyTotal: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['In Progress', 'Confirmed', 'Completed', 'Pending'],
      default: 'In Progress'
    },
    requestDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    paymentDetails: {
      method: { type: String, default: 'Card' },
      transactionId: { type: String, required: true },
      amountPaid: { type: Number, required: true },
      status: { type: String, default: 'Paid' },
      paidAt: { type: String, default: () => new Date().toISOString() }
    }
  },
  { timestamps: true }
);

export const ServiceOrderModel =
  mongoose.models.ServiceOrder || mongoose.model<IServiceOrder>('ServiceOrder', ServiceOrderSchema);
