import { Router } from 'express';
import multer from 'multer';
import {
  getJobs,
  applyJob,
  analyzeResume,
  parseResume,
  generateAtsSummary
} from '../controllers/careerController.js';

const router = Router();

// Configure multer memory storage for fast in-memory file parsing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.get('/jobs', getJobs);
router.post('/apply', applyJob);
router.post('/resume-score', analyzeResume);

// AI Resume Parser & ATS Generator Routes
router.post('/parse-resume', upload.single('resume'), parseResume);
router.post('/generate-summary', generateAtsSummary);

export default router;
