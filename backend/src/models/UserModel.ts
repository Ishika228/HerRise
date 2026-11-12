import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  preferredLanguage?: string;
  goals: string[];
  education?: string;
  professionalStatus?: string;
  skills: string[];
  experienceYears?: number;
  profileCompleted: number;
  financialSetupCompleted?: boolean;
  financialProfile?: {
    monthlyIncome: number;
    incomeSources: { name: string; amount: number; type: string }[];
    emergencyFundTargetMonths: number;
    riskTolerance: string;
    currency: string;
    currentSavings: number;
  };
  resumeData?: {
    headline?: string;
    summary?: string;
    skills?: string[];
    experience?: Array<{
      role: string;
      company: string;
      location?: string;
      duration: string;
      bullets: string[];
    }>;
    education?: Array<{
      degree: string;
      institution: string;
      year?: string;
      grade?: string;
    }>;
    certifications?: string[];
    languages?: string[];
    missingFields?: string[];
    updatedAt?: Date;
  };
  createdAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    preferredLanguage: { type: String, default: 'English' },
    goals: { type: [String], default: [] },
    education: { type: String, default: '' },
    professionalStatus: { type: String, default: '' },
    skills: { type: [String], default: [] },
    experienceYears: { type: Number, default: 0 },
    profileCompleted: { type: Number, default: 0 },
    financialSetupCompleted: { type: Boolean, default: false },
    financialProfile: {
      monthlyIncome: { type: Number, default: 0 },
      incomeSources: [
        {
          name: { type: String },
          amount: { type: Number },
          type: { type: String }
        }
      ],
      emergencyFundTargetMonths: { type: Number, default: 6 },
      riskTolerance: { type: String, default: 'moderate' },
      currency: { type: String, default: 'INR' },
      currentSavings: { type: Number, default: 0 }
    },
    resumeData: {
      headline: { type: String, default: '' },
      summary: { type: String, default: '' },
      skills: { type: [String], default: [] },
      experience: [
        {
          role: { type: String },
          company: { type: String },
          location: { type: String },
          duration: { type: String },
          bullets: { type: [String], default: [] }
        }
      ],
      education: [
        {
          degree: { type: String },
          institution: { type: String },
          year: { type: String },
          grade: { type: String }
        }
      ],
      certifications: { type: [String], default: [] },
      languages: { type: [String], default: [] },
      missingFields: { type: [String], default: [] },
      updatedAt: { type: Date, default: Date.now }
    }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);

