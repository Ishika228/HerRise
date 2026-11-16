import { Router } from 'express';
import {
  getGrants,
  checkEligibility,
  getStartupFunding,
  getStartupFundingDetail
} from '../controllers/fundController.js';

const router = Router();

router.get('/grants', getGrants);
router.post('/check-eligibility', checkEligibility);

// Live StartupDB venture funding routes
router.get('/startups', getStartupFunding);
router.get('/startups/:slug', getStartupFundingDetail);

export default router;

