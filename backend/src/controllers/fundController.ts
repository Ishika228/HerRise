import { Request, Response } from 'express';
import { store } from '../data/mockStore.js';

export const getGrants = (req: Request, res: Response) => {
  return res.status(200).json({ success: true, count: store.grants.length, data: store.grants });
};

export const checkEligibility = (req: Request, res: Response) => {
  const { businessType, womenOwnershipPercentage, annualRevenue } = req.body;
  const isEligible = Number(womenOwnershipPercentage || 100) >= 51;

  return res.status(200).json({
    success: true,
    data: {
      eligible: isEligible,
      schemesMatched: isEligible
        ? ['Stand-Up India Scheme (Up to ₹1 Cr)', 'Mudra Tarun Scheme', 'HerRise Catalyst Micro-Grant']
        : ['General Startup Seed Fund'],
      recommendation: isEligible
        ? 'Your business qualifies for subsidized interest rates (2-3% concession) under SIDBI special windows.'
        : 'Ensure at least 51% equity is held by women founders to unlock priority women entrepreneur schemes.'
    }
  });
};
