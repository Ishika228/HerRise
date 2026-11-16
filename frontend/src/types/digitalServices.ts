export type PricePeriod = 'one-time' | 'monthly';

export type EnquiryStatus =
  | 'New'
  | 'Contacted'
  | 'Quotation Sent'
  | 'Negotiation'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled';

export interface DigitalServicePackage {
  _id: string;
  name: string;
  slug: string;
  price: number;
  pricePeriod: PricePeriod;
  description: string;
  features: string[];
  badge?: string;
  enabled: boolean;
  displayOrder: number;
}

export interface DigitalService {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  pricePeriod: PricePeriod;
  includes: string[];
  icon: string;
  imageUrl?: string;
  enabled: boolean;
  displayOrder: number;
}

export interface DigitalServicesCatalog {
  packages: DigitalServicePackage[];
  services: DigitalService[];
  whatsappNumber: string;
}

export interface EnquiryService {
  serviceId: string;
  title: string;
  price: number;
  pricePeriod: PricePeriod;
}

export interface DigitalServicesQuotation {
  items: Array<{ title: string; description?: string; amount: number; optional?: boolean }>;
  subtotal: number;
  discount: number;
  total: number;
  deliveryTimeline: string;
  terms: string;
  paymentTerms: string;
  updatedAt: string;
}

export interface DigitalServicesEnquiry {
  _id: string;
  enquiryId: string;
  name: string;
  businessName: string;
  phone: string;
  email: string;
  category: string;
  selectedPackage?: { packageId: string; name: string; price: number; pricePeriod: PricePeriod };
  selectedServices: EnquiryService[];
  estimatedBudget: number;
  estimatedOneTimeBudget?: number;
  estimatedMonthlyBudget?: number;
  projectDescription: string;
  preferredContact: 'Phone' | 'Email' | 'WhatsApp';
  status: EnquiryStatus;
  createdAt: string;
  quotation?: DigitalServicesQuotation;
}

export interface EnquiryInput {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  category: string;
  packageId?: string;
  serviceIds: string[];
  projectDescription: string;
  preferredContact: 'Phone' | 'Email' | 'WhatsApp';
  enquiryType?: 'consultation';
  website?: string;
}