import { Router } from 'express';
import { getGrants, checkEligibility } from '../controllers/fundController.js';

const router = Router();

router.get('/grants', getGrants);
router.post('/check-eligibility', checkEligibility);

export default router;
