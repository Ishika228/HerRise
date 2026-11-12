import { Request, Response } from 'express';
import { store } from '../data/mockStore.js';

export const getJobs = (req: Request, res: Response) => {
  return res.status(200).json({ success: true, count: store.jobs.length, data: store.jobs });
};

export const applyJob = (req: Request, res: Response) => {
  const { jobId, coverLetter } = req.body;
  const job = store.jobs.find((j) => j.id === jobId);

  if (!job) {
    return res.status(404).json({ success: false, error: 'Job not found' });
  }

  return res.status(200).json({
    success: true,
    message: `Application submitted successfully for ${job.title} at ${job.company}`
  });
};

export const analyzeResume = (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    data: {
      score: 87,
      strengths: ['Clear impact metrics in past roles', 'Strong keyword match for Growth Strategy', 'Clean design layout'],
      improvements: ['Add quantitative ROI on recent brand partnerships', 'Highlight open-source or mentorship contributions'],
      readiness: 'High Match for Senior Product & Strategy roles'
    }
  });
};
