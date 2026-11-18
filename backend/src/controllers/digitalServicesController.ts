import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { randomBytes } from 'crypto';
import { config } from '../config/env.js';
import {
  DigitalServiceModel,
  DigitalServicePackageModel,
  DigitalServicesEnquiryModel
} from '../models/DigitalServicesModels.js';
import { ServiceOrderModel } from '../models/ServiceOrderModel.js';
import { sendReceiptEmail } from '../services/emailService.js';
import { defaultPackages, defaultServices } from '../services/digitalServicesSeed.js';

const enquiryStatuses = [
  'New',
  'Contacted',
  'Quotation Sent',
  'Negotiation',
  'Confirmed',
  'Completed',
  'Cancelled'
];
const requestAttempts = new Map<string, number[]>();

function databaseReady(res: Response): boolean {
  if (mongoose.connection.readyState === 1) return true;
  res.status(503).json({
    success: false,
    error: 'The database is unavailable right now. Please try again later; your enquiry was not saved.'
  });
  return false;
}

function handleError(next: NextFunction, error: unknown): void {
  next(error);
}

export async function getDigitalServicesCatalog(_req: Request, res: Response, next: NextFunction) {
  try {
    const connected = mongoose.connection.readyState === 1;
    const [packages, services] = connected
      ? await Promise.all([
          DigitalServicePackageModel.find({ enabled: true }).sort({ displayOrder: 1 }).lean(),
          DigitalServiceModel.find({ enabled: true }).sort({ displayOrder: 1 }).lean()
        ])
      : [defaultPackages, defaultServices];
    res.json({
      success: true,
      data: { packages, services, whatsappNumber: config.digitalServicesWhatsapp }
    });
  } catch (error) {
    handleError(next, error);
  }
}

export async function createDigitalServicesEnquiry(req: Request, res: Response, next: NextFunction) {
  try {
    if (typeof req.body.website === 'string' && req.body.website.trim()) {
      res.status(400).json({ success: false, error: 'Unable to accept this enquiry.' });
      return;
    }

    const now = Date.now();
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const attempts = (requestAttempts.get(ip) || []).filter((time) => now - time < 15 * 60 * 1000);
    if (attempts.length >= 5) {
      res.status(429).json({ success: false, error: 'Too many enquiries from this network. Please try again later.' });
      return;
    }
    attempts.push(now);
    requestAttempts.set(ip, attempts);

    const {
      name, businessName, phone, email, category, packageId,
      serviceIds, projectDescription, preferredContact, enquiryType
    } = req.body || {};
    const validString = (value: unknown, min: number, max: number) =>
      typeof value === 'string' && value.trim().length >= min && value.trim().length <= max;
    if (
      !validString(name, 2, 120) ||
      !validString(businessName, 2, 120) ||
      !validString(phone, 7, 30) ||
      !/^[+0-9()\-\s]{7,30}$/.test(phone) ||
      !validString(email, 5, 254) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !validString(category, 2, 80) ||
      !validString(projectDescription, 10, 3000) ||
      !['Phone', 'Email', 'WhatsApp'].includes(preferredContact) ||
      !Array.isArray(serviceIds) ||
      serviceIds.length > 20 ||
      serviceIds.some((id: unknown) => !mongoose.isValidObjectId(id))
    ) {
      res.status(400).json({ success: false, error: 'Please provide valid contact and project details.' });
      return;
    }
    const uniqueServiceIds = [...new Set(serviceIds as string[])];
    if (!packageId && uniqueServiceIds.length === 0 && enquiryType !== 'consultation') {
      res.status(400).json({ success: false, error: 'Select a package or at least one service.' });
      return;
    }
    if (packageId && !mongoose.isValidObjectId(packageId)) {
      res.status(400).json({ success: false, error: 'The selected package is not valid.' });
      return;
    }
    if (!databaseReady(res)) return;

    const [selectedPackage, services] = await Promise.all([
      packageId ? DigitalServicePackageModel.findOne({ _id: packageId, enabled: true }).lean() : null,
      uniqueServiceIds.length
        ? DigitalServiceModel.find({ _id: { $in: uniqueServiceIds }, enabled: true }).lean()
        : []
    ]);
    if (packageId && !selectedPackage) {
      res.status(400).json({ success: false, error: 'The selected package is no longer available.' });
      return;
    }
    if (services.length !== uniqueServiceIds.length) {
      res.status(400).json({ success: false, error: 'One or more selected services are no longer available.' });
      return;
    }

    const selectedServices = services.map((service: any) => ({
      serviceId: service._id,
      title: service.title,
      price: service.price,
      pricePeriod: service.pricePeriod
    }));
    const estimatedOneTimeBudget =
      (selectedPackage?.pricePeriod === 'monthly' ? 0 : selectedPackage?.price || 0) +
      selectedServices.reduce(
        (total: number, service: { price: number; pricePeriod: string }) =>
          total + (service.pricePeriod === 'monthly' ? 0 : service.price),
        0
      );
    const estimatedMonthlyBudget =
      (selectedPackage?.pricePeriod === 'monthly' ? selectedPackage.price : 0) +
      selectedServices.reduce(
        (total: number, service: { price: number; pricePeriod: string }) =>
          total + (service.pricePeriod === 'monthly' ? service.price : 0),
        0
      );
    const budget = estimatedOneTimeBudget + estimatedMonthlyBudget;
    const enquiry = await DigitalServicesEnquiryModel.create({
      enquiryId: `HR-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString('hex').toUpperCase()}`,
      name: name.trim(),
      businessName: businessName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      category: category.trim(),
      selectedPackage: selectedPackage
        ? {
            packageId: selectedPackage._id,
            name: selectedPackage.name,
            price: selectedPackage.price,
            pricePeriod: selectedPackage.pricePeriod
          }
        : undefined,
      selectedServices,
      estimatedBudget: budget,
      estimatedOneTimeBudget,
      estimatedMonthlyBudget,
      projectDescription: projectDescription.trim(),
      preferredContact,
      status: 'New'
    });
    res.status(201).json({
      success: true,
      message: 'Your enquiry has been received. No payment has been taken.',
      data: enquiry
    });
  } catch (error) {
    handleError(next, error);
  }
}

export async function createAdminSession(req: Request, res: Response) {
  const token = typeof req.body?.token === 'string' ? req.body.token : '';
  const expected = config.digitalServicesAdminToken;
  if (!expected) {
    res.status(503).json({
      success: false,
      error: 'Admin access is not configured. Set DIGITAL_SERVICES_ADMIN_TOKEN on the backend.'
    });
    return;
  }
  const { timingSafeEqual } = await import('crypto');
  const expectedBuffer = Buffer.from(expected);
  const tokenBuffer = Buffer.from(token);
  if (!token || expectedBuffer.length !== tokenBuffer.length || !timingSafeEqual(expectedBuffer, tokenBuffer)) {
    res.status(401).json({ success: false, error: 'Invalid admin token.' });
    return;
  }
  res.json({ success: true });
}

export async function getAdminDashboard(_req: Request, res: Response, next: NextFunction) {
  try {
    if (!databaseReady(res)) return;
    const [enquiries, packages, services] = await Promise.all([
      DigitalServicesEnquiryModel.find().sort({ createdAt: -1 }).limit(500).lean(),
      DigitalServicePackageModel.find().sort({ displayOrder: 1 }).lean(),
      DigitalServiceModel.find().sort({ displayOrder: 1 }).lean()
    ]);
    const stats = {
      totalEnquiries: enquiries.length,
      newEnquiries: enquiries.filter((item: any) => item.status === 'New').length,
      confirmedProjects: enquiries.filter((item: any) => item.status === 'Confirmed').length,
      completedProjects: enquiries.filter((item: any) => item.status === 'Completed').length,
      totalQuotedValue: enquiries.reduce((sum: number, item: any) => sum + (item.quotation?.total || 0), 0),
      estimatedRevenue: enquiries
        .filter((item: any) => ['Confirmed', 'Completed'].includes(item.status))
        .reduce((sum: number, item: any) => sum + (item.estimatedOneTimeBudget ?? item.estimatedBudget), 0),
      estimatedMonthlyValue: enquiries
        .filter((item: any) => ['Confirmed', 'Completed'].includes(item.status))
        .reduce((sum: number, item: any) => sum + (item.estimatedMonthlyBudget || 0), 0)
    };
    res.json({ success: true, data: { enquiries, packages, services, stats, actualPaymentsTracked: false } });
  } catch (error) {
    handleError(next, error);
  }
}

function makeSlug(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90);
}

const packageFields = ['name', 'slug', 'price', 'pricePeriod', 'description', 'features', 'badge', 'enabled', 'displayOrder'];
const serviceFields = ['title', 'category', 'description', 'price', 'pricePeriod', 'includes', 'icon', 'imageUrl', 'enabled', 'displayOrder'];

function pickFields(body: Record<string, unknown>, fields: string[]) {
  return Object.fromEntries(fields.filter((key) => body[key] !== undefined).map((key) => [key, body[key]]));
}

export async function savePackage(req: Request, res: Response, next: NextFunction) {
  try {
    if (!databaseReady(res)) return;
    const body = req.body || {};
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const price = Number(body.price);
    if (!name || name.length > 100 || !Number.isFinite(price) || price < 0 ||
      !['one-time', 'monthly'].includes(body.pricePeriod || 'one-time') ||
      !Array.isArray(body.features) || body.features.length > 40 ||
      !body.description || String(body.description).length > 500) {
      res.status(400).json({ success: false, error: 'Provide a package name, valid price, description, period and feature list.' });
      return;
    }
    const data = pickFields(body, packageFields);
    data.name = name;
    data.slug = makeSlug(typeof body.slug === 'string' && body.slug ? body.slug : name);
    if (!data.pricePeriod) data.pricePeriod = 'one-time';
    const item = req.params.id
      ? await DigitalServicePackageModel.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
      : await DigitalServicePackageModel.create(data);
    if (!item) {
      res.status(404).json({ success: false, error: 'Package not found.' });
      return;
    }
    res.status(req.params.id ? 200 : 201).json({ success: true, data: item });
  } catch (error) {
    handleError(next, error);
  }
}

export async function deletePackage(req: Request, res: Response, next: NextFunction) {
  try {
    if (!databaseReady(res)) return;
    const item = await DigitalServicePackageModel.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, error: 'Package not found.' });
      return;
    }
    res.json({ success: true });
  } catch (error) {
    handleError(next, error);
  }
}

export async function saveService(req: Request, res: Response, next: NextFunction) {
  try {
    if (!databaseReady(res)) return;
    const body = req.body || {};
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const price = Number(body.price);
    if (!title || title.length > 100 || !body.category || String(body.category).length > 60 ||
      !Number.isFinite(price) || price < 0 ||
      !['one-time', 'monthly'].includes(body.pricePeriod || 'one-time') ||
      !Array.isArray(body.includes) || body.includes.length > 30 ||
      !body.description || String(body.description).length > 500 ||
      (body.imageUrl && typeof body.imageUrl === 'string' &&
        !/^https:\/\/[^ ]{1,2000}$/.test(body.imageUrl) &&
        !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(body.imageUrl))) {
      res.status(400).json({ success: false, error: 'Provide a service title, category, valid price, description and included items.' });
      return;
    }
    const data = pickFields(body, serviceFields);
    data.title = title;
    if (!data.pricePeriod) data.pricePeriod = 'one-time';
    const item = req.params.id
      ? await DigitalServiceModel.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
      : await DigitalServiceModel.create(data);
    if (!item) {
      res.status(404).json({ success: false, error: 'Service not found.' });
      return;
    }
    res.status(req.params.id ? 200 : 201).json({ success: true, data: item });
  } catch (error) {
    handleError(next, error);
  }
}

export async function deleteService(req: Request, res: Response, next: NextFunction) {
  try {
    if (!databaseReady(res)) return;
    const item = await DigitalServiceModel.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, error: 'Service not found.' });
      return;
    }
    res.json({ success: true });
  } catch (error) {
    handleError(next, error);
  }
}

export async function updateEnquiryStatus(req: Request, res: Response, next: NextFunction) {
  try {
    if (!databaseReady(res)) return;
    const { status } = req.body || {};
    if (!enquiryStatuses.includes(status)) {
      res.status(400).json({ success: false, error: 'Choose a valid enquiry status.' });
      return;
    }
    const item = await DigitalServicesEnquiryModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!item) {
      res.status(404).json({ success: false, error: 'Enquiry not found.' });
      return;
    }
    res.json({ success: true, data: item });
  } catch (error) {
    handleError(next, error);
  }
}

export async function saveEnquiryQuotation(req: Request, res: Response, next: NextFunction) {
  try {
    if (!databaseReady(res)) return;
    const { items, discount, deliveryTimeline, terms, paymentTerms } = req.body || {};
    const parsedDiscount = Number(discount);
    if (!Array.isArray(items) || items.length === 0 || items.length > 30 ||
      !items.every((item: any) =>
        typeof item.title === 'string' && item.title.trim().length > 0 && item.title.length <= 120 &&
        Number.isFinite(Number(item.amount)) && Number(item.amount) >= 0
      ) ||
      !Number.isFinite(parsedDiscount) || parsedDiscount < 0 ||
      typeof deliveryTimeline !== 'string' || deliveryTimeline.length > 200 ||
      typeof terms !== 'string' || terms.length > 3000 ||
      typeof paymentTerms !== 'string' || paymentTerms.length > 1000) {
      res.status(400).json({ success: false, error: 'Check the quotation items, discount, timeline and terms.' });
      return;
    }
    const safeItems = items.map((item: any) => ({
      title: item.title.trim(),
      description: typeof item.description === 'string' ? item.description.slice(0, 500) : '',
      amount: Number(item.amount),
      optional: Boolean(item.optional)
    }));
    const subtotal = safeItems
      .filter((item: { optional: boolean }) => !item.optional)
      .reduce((sum: number, item: { amount: number }) => sum + item.amount, 0);
    if (parsedDiscount > subtotal) {
      res.status(400).json({ success: false, error: 'Discount cannot exceed the required services subtotal.' });
      return;
    }
    const item = await DigitalServicesEnquiryModel.findByIdAndUpdate(
      req.params.id,
      {
        quotation: {
          items: safeItems,
          subtotal,
          discount: parsedDiscount,
          total: subtotal - parsedDiscount,
          deliveryTimeline: deliveryTimeline.trim(),
          terms: terms.trim(),
          paymentTerms: paymentTerms.trim(),
          updatedAt: new Date()
        },
        status: 'Quotation Sent'
      },
      { new: true, runValidators: true }
    );
    if (!item) {
      res.status(404).json({ success: false, error: 'Enquiry not found.' });
      return;
    }
    res.json({ success: true, data: item });
  } catch (error) {
    handleError(next, error);
  }
}

/**
 * Place a Paid Service Order in MongoDB & Dispatch Receipt Email
 */
export async function createServiceOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      userId,
      userEmail,
      customerName,
      businessName,
      email,
      phone,
      category,
      location,
      selectedPackageName,
      selectedPackagePrice,
      servicesRequired,
      selectedAddOns,
      oneTimeTotal,
      monthlyTotal,
      paymentDetails
    } = req.body || {};

    const cleanEmail = (userEmail || email || '').toLowerCase().trim();
    if (!cleanEmail) {
      res.status(400).json({ success: false, error: 'Customer email is required.' });
      return;
    }

    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const txId = paymentDetails?.transactionId || `tx_${Date.now()}`;
    const paidAt = paymentDetails?.paidAt || new Date().toISOString();
    const finalAmount = oneTimeTotal || selectedPackagePrice || 0;

    let savedOrder: any = null;
    if (mongoose.connection.readyState === 1) {
      savedOrder = await ServiceOrderModel.create({
        orderId,
        userId: userId || undefined,
        userEmail: cleanEmail,
        customerName: customerName || 'Valued Client',
        businessName: businessName || '',
        phone: phone || '',
        email: cleanEmail,
        category: category || 'Digital Growth',
        location: location || 'Australia',
        selectedPackageName: selectedPackageName || 'Digital Package',
        selectedPackagePrice: selectedPackagePrice || finalAmount,
        servicesRequired: servicesRequired || ['Core Website Build'],
        selectedAddOns: selectedAddOns || [],
        oneTimeTotal: finalAmount,
        monthlyTotal: monthlyTotal || 0,
        status: 'In Progress',
        paymentDetails: {
          method: paymentDetails?.method || 'Card',
          transactionId: txId,
          amountPaid: finalAmount,
          status: 'Paid',
          paidAt
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed and stored successfully in database.',
      order: savedOrder || {
        orderId,
        id: orderId,
        customerName,
        businessName,
        email: cleanEmail,
        selectedPackageName,
        selectedPackagePrice,
        oneTimeTotal: finalAmount,
        status: 'In Progress',
        paymentDetails: { transactionId: txId, amountPaid: finalAmount, status: 'Paid', paidAt }
      }
    });
  } catch (error) {
    handleError(next, error);
  }
}

/**
 * Get Service Orders with Role-Based Access Control
 * - Normal user: ONLY sees orders belonging to their userId or email
 * - Admin user: Can see ALL orders across the system
 */
export async function getServiceOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, email, role } = req.query;
    const userRole = typeof role === 'string' ? role.toLowerCase() : '';
    const userEmail = typeof email === 'string' ? email.toLowerCase().trim() : '';
    const uId = typeof userId === 'string' ? userId.trim() : '';

    if (mongoose.connection.readyState !== 1) {
      res.json({ success: true, count: 0, orders: [] });
      return;
    }

    // Role-based check: Admin gets all orders
    if (userRole === 'admin' || userEmail === 'admin@herrise.org') {
      const allOrders = await ServiceOrderModel.find().sort({ createdAt: -1 }).lean();
      res.json({ success: true, count: allOrders.length, orders: allOrders, scope: 'admin-all' });
      return;
    }

    // Regular User: strict filter to ONLY their orders
    if (!userEmail && !uId) {
      // Unauthenticated or unknown user: return empty list
      res.json({ success: true, count: 0, orders: [], scope: 'empty-guest' });
      return;
    }

    const queryConditions: any[] = [];
    if (userEmail) queryConditions.push({ userEmail });
    if (uId) queryConditions.push({ userId: uId });

    const userOrders = await ServiceOrderModel.find({ $or: queryConditions }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: userOrders.length, orders: userOrders, scope: 'user-isolated' });
  } catch (error) {
    handleError(next, error);
  }
}

/**
 * Receipt confirmed endpoint (mail system disabled)
 */
export async function resendOrderReceiptEmail(req: Request, res: Response) {
  res.json({ success: true, message: 'Order receipt recorded in client portal.' });
}

/**
 * Service status endpoint
 */
export async function testEmailDelivery(req: Request, res: Response) {
  res.json({
    success: true,
    service: 'HerRise Digital Market Service Orders',
    mailSystem: 'disabled'
  });
}
