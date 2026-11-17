import { Router } from 'express';
import {
  getGrants,
  checkEligibility,
  getStartupFunding,
  getStartupFundingDetail,
  createFundRequest,
  getUserFundRequests
} from '../controllers/fundController.js';

const router = Router();

router.get('/grants', getGrants);
router.post('/check-eligibility', checkEligibility);

// Live & catalog venture funding routes
router.get('/startups', getStartupFunding);
router.get('/startups/:slug', getStartupFundingDetail);

// Funding Request Submission & User Tracker routes
router.post('/requests', createFundRequest);
router.get('/requests', getUserFundRequests);

export default router;
