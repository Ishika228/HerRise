import mongoose, { Schema } from 'mongoose';

const PackageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    price: { type: Number, required: true, min: 0 },
    pricePeriod: { type: String, enum: ['one-time', 'monthly'], default: 'one-time' },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    features: { type: [String], default: [], validate: (v: string[]) => v.length <= 40 },
    badge: { type: String, default: '', trim: true, maxlength: 40 },
    enabled: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    category: { type: String, required: true, trim: true, maxlength: 60 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    price: { type: Number, required: true, min: 0 },
    pricePeriod: { type: String, enum: ['one-time', 'monthly'], default: 'one-time' },
    includes: { type: [String], default: [], validate: (v: string[]) => v.length <= 30 },
    icon: { type: String, default: 'sparkles', trim: true, maxlength: 40 },
    imageUrl: { type: String, default: '', maxlength: 1400000 },
    enabled: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const QuotationItemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: '', trim: true, maxlength: 500 },
    amount: { type: Number, required: true, min: 0 },
    optional: { type: Boolean, default: false }
  },
  { _id: false }
);

const EnquirySchema = new Schema(
  {
    enquiryId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    businessName: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    selectedPackage: {
      packageId: { type: Schema.Types.ObjectId, ref: 'DigitalServicePackage' },
      name: { type: String, default: '' },
      price: { type: Number, default: 0 },
      pricePeriod: { type: String, enum: ['one-time', 'monthly'], default: 'one-time' }
    },
    selectedServices: [
      {
        serviceId: { type: Schema.Types.ObjectId, ref: 'DigitalService' },
        title: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        pricePeriod: { type: String, enum: ['one-time', 'monthly'], default: 'one-time' }
      }
    ],
    estimatedBudget: { type: Number, required: true, min: 0 },
    estimatedOneTimeBudget: { type: Number, default: 0, min: 0 },
    estimatedMonthlyBudget: { type: Number, default: 0, min: 0 },
    projectDescription: { type: String, required: true, trim: true, maxlength: 3000 },
    preferredContact: { type: String, enum: ['Phone', 'Email', 'WhatsApp'], required: true },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Quotation Sent', 'Negotiation', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'New'
    },
    quotation: {
      items: { type: [QuotationItemSchema], default: [] },
      subtotal: { type: Number, min: 0 },
      discount: { type: Number, min: 0, default: 0 },
      total: { type: Number, min: 0 },
      deliveryTimeline: { type: String, default: '', maxlength: 200 },
      terms: { type: String, default: '', maxlength: 3000 },
      paymentTerms: { type: String, default: '', maxlength: 1000 },
      updatedAt: { type: Date }
    }
  },
  { timestamps: true }
);

export const DigitalServicePackageModel =
  mongoose.models.DigitalServicePackage || mongoose.model('DigitalServicePackage', PackageSchema);
export const DigitalServiceModel =
  mongoose.models.DigitalService || mongoose.model('DigitalService', ServiceSchema);
export const DigitalServicesEnquiryModel =
  mongoose.models.DigitalServicesEnquiry || mongoose.model('DigitalServicesEnquiry', EnquirySchema);
