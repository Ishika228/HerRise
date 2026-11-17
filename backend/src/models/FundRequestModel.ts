import mongoose, { Schema, Document } from 'mongoose';

export interface IFundRequest extends Document {
  userId: string;
  userEmail: string;
  ventureId: string;
  ventureName: string;
  ventureSlug: string;
  ventureLogo?: string;
  ventureIndustry?: string;
  ventureRound?: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  applicantLocation?: string;
  startupName: string;
  businessCategory?: string;
  requestedAmount: number;
  currency: string;
  fundingType: string;
  useOfFunds: string;
  pitchSummary: string;
  monthlyRevenue?: string;
  status: 'Request Sent' | 'Under Review' | 'Accepted' | 'Declined';
  createdAt: Date;
  updatedAt: Date;
}

const FundRequestSchema = new Schema<IFundRequest>(
  {
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, index: true },
    ventureId: { type: String, required: true },
    ventureName: { type: String, required: true },
    ventureSlug: { type: String, required: true },
    ventureLogo: { type: String },
    ventureIndustry: { type: String },
    ventureRound: { type: String },
    applicantName: { type: String, required: true },
    applicantEmail: { type: String, required: true },
    applicantPhone: { type: String },
    applicantLocation: { type: String },
    startupName: { type: String, required: true },
    businessCategory: { type: String },
    requestedAmount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    fundingType: { type: String, default: 'Equity Funding' },
    useOfFunds: { type: String, required: true },
    pitchSummary: { type: String, required: true },
    monthlyRevenue: { type: String },
    status: {
      type: String,
      enum: ['Request Sent', 'Under Review', 'Accepted', 'Declined'],
      default: 'Request Sent'
    }
  },
  { timestamps: true }
);

FundRequestSchema.index({ userId: 1, ventureId: 1 });

export const FundRequestModel = mongoose.model<IFundRequest>('FundRequest', FundRequestSchema);
