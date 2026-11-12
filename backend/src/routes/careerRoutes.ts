import { Router } from 'express';
import multer from 'multer';
import {
  getCareerOverview,
  getResumes,
  saveResume,
  deleteResume,
  aiEnhanceResumeBullet,
  aiSuggestSkills,
  analyzeResumeDetailed,
  parseResume,
  generateAtsSummary,
  getJobs,
  applyJob,
  matchJobWithProfile,
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  startInterview,
  evaluateInterviewAnswer,
  generateCareerRoadmap,
  generateCareerBreakNarrative,
  careerAiAssistant
} from '../controllers/careerController.js';

const router = Router();

// Configure multer memory storage for file parsing (PDF/DOCX)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Overview & Dashboard
router.get('/overview', getCareerOverview);

// Resumes CRUD & AI Enhancements
router.get('/resumes', getResumes);
router.post('/resumes', saveResume);
router.delete('/resumes/:id', deleteResume);
router.post('/enhance-bullet', aiEnhanceResumeBullet);
router.post('/suggest-skills', aiSuggestSkills);
router.post('/generate-summary', generateAtsSummary);

// Resume Analysis & Parsing
router.post('/analyze-resume', analyzeResumeDetailed);
router.post('/parse-resume', upload.single('resume'), parseResume);

// Jobs & AI Matching
router.get('/jobs', getJobs);
router.post('/apply', applyJob);
router.post('/match-job', matchJobWithProfile);

// Job Application Tracker
router.get('/applications', getApplications);
router.post('/applications', createApplication);
router.put('/applications/:id', updateApplication);
router.delete('/applications/:id', deleteApplication);

// AI Interview Preparation
router.post('/interview/start', startInterview);
router.post('/interview/evaluate', evaluateInterviewAnswer);

// Career Roadmap & Skill Gap Analysis
router.post('/roadmap/generate', generateCareerRoadmap);

// Career Restart (Women Returnee Track)
router.post('/restart/narrative', generateCareerBreakNarrative);

// HerCareer AI Assistant
router.post('/assistant', careerAiAssistant);

export default router;
