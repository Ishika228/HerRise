import { Router } from 'express';
import { generateBusinessPlan } from '../controllers/businessController.js';

const router = Router();

router.post('/generate-plan', generateBusinessPlan);

export default router;

