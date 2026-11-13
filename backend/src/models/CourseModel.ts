import mongoose, { Document, Schema } from 'mongoose';

export interface ICourseUnit {
  code: string;
  title: string;
  isCore?: boolean;
}

export interface IRTOProvider {
  code: string;
  name: string;
  tradingName?: string;
  website?: string;
  state?: string;
}

export interface ICourseDocument extends Document {
  code: string; // e.g. ICT50220
  title: string; // e.g. Diploma of Information Technology
  qualificationLevel: string; // Certificate III, Certificate IV, Diploma, Advanced Diploma, etc.
  aqfLevel?: string;
  category: string; // IT, Health, Business, etc.
  trainingPackage: {
    code: string;
    title: string;
  };
  description: string;
  status: 'current' | 'superseded' | 'deleted';
  unitsCount: number;
  unitsOfCompetency: ICourseUnit[];
  skillSets: string[];
  industrySectors: string[];
  occupations: string[];
  rtoDeliveryCount: number;
  rtoProviders: IRTOProvider[];
  sourceUrl: string;
  sourceAttribution: string;
  developer: string;
  releaseDate?: string;
  lastSyncedAt: Date;
  featured?: boolean;
  durationEstimate?: string;
}

const CourseSchema = new Schema<ICourseDocument>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    qualificationLevel: {
      type: String,
      required: true,
      index: true
    },
    aqfLevel: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      required: true,
      index: true
    },
    trainingPackage: {
      code: { type: String, default: '' },
      title: { type: String, default: '' }
    },
    description: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['current', 'superseded', 'deleted'],
      default: 'current',
      index: true
    },
    unitsCount: {
      type: Number,
      default: 0
    },
    unitsOfCompetency: [
      {
        code: { type: String, required: true },
        title: { type: String, required: true },
        isCore: { type: Boolean, default: false }
      }
    ],
    skillSets: [String],
    industrySectors: [String],
    occupations: [String],
    rtoDeliveryCount: {
      type: Number,
      default: 0
    },
    rtoProviders: [
      {
        code: String,
        name: String,
        tradingName: String,
        website: String,
        state: String
      }
    ],
    sourceUrl: {
      type: String,
      required: true
    },
    sourceAttribution: {
      type: String,
      default: 'Official Australian Government National Training Register (training.gov.au)'
    },
    developer: {
      type: String,
      default: ''
    },
    releaseDate: {
      type: String,
      default: ''
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now
    },
    featured: {
      type: Boolean,
      default: false
    },
    durationEstimate: {
      type: String,
      default: '12-24 Months (Full-time / Blended)'
    }
  },
  {
    timestamps: true
  }
);

// Full text indexing for lightning fast search across title, code, occupations & industry sectors
CourseSchema.index({
  code: 'text',
  title: 'text',
  description: 'text',
  occupations: 'text',
  industrySectors: 'text'
});

export const CourseModel = mongoose.model<ICourseDocument>('Course', CourseSchema);
