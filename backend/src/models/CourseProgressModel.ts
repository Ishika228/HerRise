import mongoose, { Document, Schema } from 'mongoose';

export interface ICourseProgress extends Document {
  userEmail: string;
  userId?: string;
  courseId: string;
  courseTitle: string;
  currentModuleIndex: number;
  currentModuleTitle: string;
  currentTimeSeconds: number; // exact second where user stopped watching
  durationSeconds: number;
  completedModuleIds: string[];
  progressPercent: number;
  isCompleted: boolean;
  completedAt?: Date;
  certificateId?: string;
  certificateIssuedAt?: Date;
  lastWatchedAt: Date;
}

const CourseProgressSchema = new Schema<ICourseProgress>(
  {
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    userId: {
      type: String,
      default: ''
    },
    courseId: {
      type: String,
      required: true,
      index: true
    },
    courseTitle: {
      type: String,
      required: true
    },
    currentModuleIndex: {
      type: Number,
      default: 0
    },
    currentModuleTitle: {
      type: String,
      default: ''
    },
    currentTimeSeconds: {
      type: Number,
      default: 0
    },
    durationSeconds: {
      type: Number,
      default: 0
    },
    completedModuleIds: {
      type: [String],
      default: []
    },
    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    },
    certificateId: {
      type: String,
      default: ''
    },
    certificateIssuedAt: {
      type: Date
    },
    lastWatchedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index so one user has at most one progress document per course
CourseProgressSchema.index({ userEmail: 1, courseId: 1 }, { unique: true });

export const CourseProgressModel = mongoose.model<ICourseProgress>(
  'CourseProgress',
  CourseProgressSchema
);
