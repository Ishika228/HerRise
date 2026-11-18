import { Router } from 'express';
import {
  createAdminSession,
  createDigitalServicesEnquiry,
  createServiceOrder,
  getServiceOrders,
  resendOrderReceiptEmail,
  testEmailDelivery,
  deletePackage,
  deleteService,
  getAdminDashboard,
  getDigitalServicesCatalog,
  saveEnquiryQuotation,
  savePackage,
  saveService,
  updateEnquiryStatus
} from '../controllers/digitalServicesController.js';
import { requireDigitalServicesAdmin } from '../middleware/digitalServicesAdminAuth.js';

const router = Router();

router.get('/catalog', getDigitalServicesCatalog);
router.post('/enquiries', createDigitalServicesEnquiry);
router.post('/admin/session', createAdminSession);

// Database Orders & Receipt Email
router.post('/orders', createServiceOrder);
router.get('/orders', getServiceOrders);
router.post('/orders/send-receipt', resendOrderReceiptEmail);
router.get('/orders/test-email', testEmailDelivery);

router.use('/admin', requireDigitalServicesAdmin);
router.get('/admin/dashboard', getAdminDashboard);
router.post('/admin/packages', savePackage);
router.put('/admin/packages/:id', savePackage);
router.delete('/admin/packages/:id', deletePackage);
router.post('/admin/services', saveService);
router.put('/admin/services/:id', saveService);
router.delete('/admin/services/:id', deleteService);
router.patch('/admin/enquiries/:id/status', updateEnquiryStatus);
router.put('/admin/enquiries/:id/quotation', saveEnquiryQuotation);

export default router;
