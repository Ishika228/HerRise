import { Request, Response } from 'express';
import { store } from '../data/mockStore.js';
import { config } from '../config/env.js';

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

/**
 * GET /api/fund/startups
 * Live Startup & Venture Funding Data from StartupDB REST API
 */
export const getStartupFunding = async (req: Request, res: Response) => {
  try {
    const q = String(req.query.q || '').trim();
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 24));
    const offset = Math.max(0, parseInt(req.query.offset as string) || 0);

    const apiBase = config.startupDbApiBase || 'https://startupdb.com/api/v1';
    const targetUrl = q
      ? `${apiBase}/startups?q=${encodeURIComponent(q)}&limit=${limit}&offset=${offset}`
      : `${apiBase}/startups?limit=${limit}&offset=${offset}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const apiRes = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'HerRise-Platform/1.0'
      }
    });
    clearTimeout(timeout);

    if (!apiRes.ok) {
      throw new Error(`StartupDB API returned status ${apiRes.status}`);
    }

    const json: any = await apiRes.json();
    const rawList = Array.isArray(json.data) ? json.data : [];

    const startups = rawList.map((item: any) => {
      const amountVal = item.latestFunding?.amount?.original
        ? Number(item.latestFunding.amount.original)
        : null;
      const currency = item.latestFunding?.amount?.currency || 'USD';

      let amountFormatted = 'Undisclosed';
      if (amountVal && amountVal > 0) {
        if (amountVal >= 1000000000) {
          amountFormatted = `$${(amountVal / 1000000000).toFixed(1)}B ${currency}`;
        } else if (amountVal >= 1000000) {
          amountFormatted = `$${(amountVal / 1000000).toFixed(1)}M ${currency}`;
        } else if (amountVal >= 1000) {
          amountFormatted = `$${(amountVal / 1000).toFixed(0)}K ${currency}`;
        } else {
          amountFormatted = `$${amountVal.toLocaleString()} ${currency}`;
        }
      }

      const industryLabels = item.profile?.sourceIndustryLabels || [];
      const primaryIndustry = industryLabels[0]?.value?.split(';')?.[0]?.trim() || 'Tech & Venture';

      return {
        id: item.id || item.slug,
        slug: item.slug,
        name: item.name,
        domain: item.domain,
        websiteUrl: item.websiteUrl || `https://${item.domain}`,
        logo: item.profile?.brandAssetUrl || null,
        shortDescription: item.profile?.shortDescription || 'Innovative growth venture pioneering new solutions.',
        headquarters: item.profile?.headquartersLocation || 'Global',
        foundedYear: item.profile?.foundedYear || null,
        industry: primaryIndustry,
        investorCount: item.investorCount || 0,
        latestFundingDate: item.latestFundingDate || item.latestFunding?.eventDate || 'Recent',
        roundLabel: item.latestFunding?.roundLabel || 'Venture Round',
        amount: amountVal,
        amountFormatted,
        currency,
        sourceAttribution: 'StartupDB (https://startupdb.com)'
      };
    });

    return res.status(200).json({
      success: true,
      total: json.pagination?.total || startups.length,
      returned: startups.length,
      data: startups,
      source: 'StartupDB Live API'
    });
  } catch (error: any) {
    console.warn('[StartupDB API Error]:', error.message);
    return res.status(200).json({
      success: false,
      error: error.message,
      data: []
    });
  }
};

/**
 * GET /api/fund/startups/:slug
 * Retrieve detailed funding rounds and investors for a single startup
 */
export const getStartupFundingDetail = async (req: Request, res: Response) => {
  try {
    const rawSlug = req.params.slug;
    const slugStr = Array.isArray(rawSlug) ? rawSlug[0] : String(rawSlug || '');
    if (!slugStr) {
      return res.status(400).json({ success: false, error: 'Startup slug is required' });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const apiBase = config.startupDbApiBase || 'https://startupdb.com/api/v1';
    const apiRes = await fetch(`${apiBase}/startups/${encodeURIComponent(slugStr)}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'HerRise-Platform/1.0'
      }
    });
    clearTimeout(timeout);

    if (!apiRes.ok) {
      throw new Error(`StartupDB API returned ${apiRes.status}`);
    }

    const json: any = await apiRes.json();
    return res.status(200).json({
      success: true,
      data: json.data,
      source: 'StartupDB Live API'
    });
  } catch (error: any) {
    console.warn('[StartupDB Detail API Error]:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

