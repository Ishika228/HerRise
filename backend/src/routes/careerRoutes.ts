import { Router } from 'express';
import { getJobs, applyJob, analyzeResume } from '../controllers/careerController.js';

const router = Router();

router.get('/jobs', getJobs);
router.post('/apply', applyJob);
router.post('/resume-score', analyzeResume);

export default router;

