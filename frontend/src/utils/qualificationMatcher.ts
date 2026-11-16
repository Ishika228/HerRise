import { JobListing } from '../types/career';

export const QUALIFICATION_CATEGORIES = [
  'All Qualifications',
  'Technology & Software',
  'Healthcare & Nursing',
  'Finance & Accounting',
  'Data & Analytics',
  'Design & Creative',
  'Marketing & Media',
  'Education & Teaching',
  'Human Resources & People',
  'Legal & Compliance',
  'Hospitality & Events',
  'Retail & Hospitality',
  'Business & Operations'
] as const;

export type QualificationCategory = typeof QUALIFICATION_CATEGORIES[number];

/**
 * Infer the user's primary discipline/category from an education string
 */
export function inferCategoryFromEducation(userEducation: string): string {
  if (!userEducation) return 'All Qualifications';
  const e = userEducation.toLowerCase();

  if (/(tech|computer|software|developer|engineer|cs\b|it\b|bca|mca|programming|frontend|backend|cloud)/.test(e)) {
    return 'Technology & Software';
  }
  if (/(nurse|nursing|health|medical|clinical|ahpra|doctor|hospital|biotech|pharma)/.test(e)) {
    return 'Healthcare & Nursing';
  }
  if (/(commerce|b\.?com|accounting|accountancy|finance|cpa|ca\b|cma|banking|tax|bookkeep)/.test(e)) {
    return 'Finance & Accounting';
  }
  if (/(data|analytics|statistics|math|bi\b|machine learning|artificial intelligence)/.test(e)) {
    return 'Data & Analytics';
  }
  if (/(design|ui\/?ux|graphic|arts|fine art|multimedia|creative)/.test(e)) {
    return 'Design & Creative';
  }
  if (/(marketing|communication|media|journalism|pr\b|content|social media)/.test(e)) {
    return 'Marketing & Media';
  }
  if (/(educat|teach|childcare|early childhood|b\.?ed|m\.?ed|pedagogy|school)/.test(e)) {
    return 'Education & Teaching';
  }
  if (/(hr\b|human resource|psychology|talent|people|culture)/.test(e)) {
    return 'Human Resources & People';
  }
  if (/(law|legal|compliance|regulatory|criminology)/.test(e)) {
    return 'Legal & Compliance';
  }
  if (/(hospitality|hotel|tourism|event|catering)/.test(e)) {
    return 'Hospitality & Events';
  }
  if (/(retail|store|merchandis|sales)/.test(e)) {
    return 'Retail & Hospitality';
  }
  if (/(bba|mba|business|management|operations|admin)/.test(e)) {
    return 'Business & Operations';
  }

  return 'General / Cross-Disciplinary';
}

export interface QualificationFitResult {
  score: number; // 0 - 100
  isMatch: boolean;
  status: 'Direct Match' | 'Transferable Fit' | 'Eligible' | 'Adjacent Field';
  badgeText: string;
  badgeClass: string;
  explanation: string;
}

/**
 * Compare candidate qualification against a job listing
 */
export function calculateQualificationFit(userEducation: string, job: JobListing): QualificationFitResult {
  if (!userEducation || !userEducation.trim()) {
    return {
      score: 75,
      isMatch: false,
      status: 'Eligible',
      badgeText: 'Qualification Details Open',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      explanation: 'Add your qualification to unlock instant verified ATS eligibility score.'
    };
  }

  const edu = userEducation.toLowerCase().trim();
  const jobQual = (job.qualification || '').toLowerCase();
  const jobCat = (job.qualificationCategory || '').toLowerCase();
  const userCat = inferCategoryFromEducation(userEducation).toLowerCase();
  const title = job.title.toLowerCase();

  // 1. Direct Category Match
  if (jobCat && userCat && jobCat === userCat) {
    return {
      score: 98,
      isMatch: true,
      status: 'Direct Match',
      badgeText: '100% Qualification Match',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
      explanation: `Your degree in ${userEducation} directly fulfills ${job.company}'s hiring prerequisites.`
    };
  }

  // 2. Keyword overlaps (e.g. CS -> Tech, Nursing -> Health, B.Com -> Accounting)
  const isTechUser = /(tech|computer|software|developer|engineer|cs\b|it\b|bca|mca|cloud)/.test(edu);
  const isHealthUser = /(nurse|nursing|health|medical|clinical|ahpra|doctor)/.test(edu);
  const isFinanceUser = /(commerce|b\.?com|accounting|finance|cpa|ca\b|cma|banking)/.test(edu);
  const isDataUser = /(data|analytics|statistics|math|bi\b)/.test(edu);
  const isDesignUser = /(design|ui\/?ux|graphic|arts|fine art)/.test(edu);
  const isMarketingUser = /(marketing|communication|media|journalism|content)/.test(edu);
  const isEduUser = /(educat|teach|childcare|early childhood|b\.?ed)/.test(edu);
  const isHrUser = /(hr\b|human resource|psychology|talent)/.test(edu);
  const isLawUser = /(law|legal|compliance)/.test(edu);

  if (isTechUser && (jobCat.includes('technology') || jobCat.includes('software') || title.includes('engineer') || title.includes('developer'))) {
    return {
      score: 98,
      isMatch: true,
      status: 'Direct Match',
      badgeText: 'Direct Tech Qualification Match',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
      explanation: `Your technical qualification in ${userEducation} matches ${job.title} specifications.`
    };
  }

  if (isHealthUser && (jobCat.includes('healthcare') || jobCat.includes('nursing') || title.includes('nurse') || title.includes('care'))) {
    return {
      score: 99,
      isMatch: true,
      status: 'Direct Match',
      badgeText: 'AHPRA / Nursing Degree Match',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
      explanation: `Your clinical healthcare credentials align with ${job.company}'s practitioner criteria.`
    };
  }

  if (isFinanceUser && (jobCat.includes('finance') || jobCat.includes('accounting') || title.includes('account') || title.includes('finance'))) {
    return {
      score: 98,
      isMatch: true,
      status: 'Direct Match',
      badgeText: 'Finance Degree Match',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
      explanation: `Your commercial / financial education satisfies ${job.company}'s requirements.`
    };
  }

  if (isDataUser && (jobCat.includes('data') || title.includes('analyst') || title.includes('intelligence'))) {
    return {
      score: 96,
      isMatch: true,
      status: 'Direct Match',
      badgeText: 'Analytics Qualification Match',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
      explanation: `Your analytical background aligns directly with data modeling requirements.`
    };
  }

  if (isDesignUser && (jobCat.includes('design') || title.includes('design') || title.includes('ui/ux'))) {
    return {
      score: 96,
      isMatch: true,
      status: 'Direct Match',
      badgeText: 'Creative Qualification Match',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
      explanation: `Your creative / visual arts background matches this design position.`
    };
  }

  if (isMarketingUser && (jobCat.includes('marketing') || title.includes('marketing') || title.includes('content'))) {
    return {
      score: 96,
      isMatch: true,
      status: 'Direct Match',
      badgeText: 'Marketing Degree Match',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
      explanation: `Your communications background is a direct match for this brand campaign role.`
    };
  }

  if (isEduUser && (jobCat.includes('education') || title.includes('educator') || title.includes('teacher'))) {
    return {
      score: 98,
      isMatch: true,
      status: 'Direct Match',
      badgeText: 'Teaching Qualification Match',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
      explanation: `Your education credentials fulfill Australian early learning & teaching standards.`
    };
  }

  if (isHrUser && (jobCat.includes('human') || title.includes('hr') || title.includes('culture'))) {
    return {
      score: 97,
      isMatch: true,
      status: 'Direct Match',
      badgeText: 'HR Qualification Match',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
      explanation: `Your human resources background matches this people & culture role.`
    };
  }

  if (isLawUser && (jobCat.includes('legal') || title.includes('compliance') || title.includes('risk'))) {
    return {
      score: 97,
      isMatch: true,
      status: 'Direct Match',
      badgeText: 'Legal & Risk Match',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
      explanation: `Your legal studies background directly supports regulatory oversight.`
    };
  }

  // 3. Cross-disciplinary Transferable Fit
  if ((isTechUser && jobCat.includes('data')) || (isDataUser && jobCat.includes('technology')) || (isFinanceUser && jobCat.includes('data'))) {
    return {
      score: 86,
      isMatch: true,
      status: 'Transferable Fit',
      badgeText: 'Strong Transferable Fit',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      explanation: `Your quantitative skills in ${userEducation} transfer seamlessly to this role.`
    };
  }

  if (jobCat.includes('operations') || jobCat.includes('retail') || jobCat.includes('business')) {
    return {
      score: 82,
      isMatch: true,
      status: 'Eligible',
      badgeText: 'Graduate Eligible',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
      explanation: `Open to all recognized graduate qualifications and relevant practical experience.`
    };
  }

  // 4. Substring check
  if (jobQual.includes(edu) || edu.includes(jobQual)) {
    return {
      score: 92,
      isMatch: true,
      status: 'Direct Match',
      badgeText: 'Degree Requirement Met',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      explanation: `Meets employer minimum qualification requirements.`
    };
  }

  return {
    score: 65,
    isMatch: false,
    status: 'Adjacent Field',
    badgeText: 'Related Field (Upskilling Helpful)',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    explanation: `Different discipline; your transferable skills and certifications can bridge the gap.`
  };
}

/**
 * Filter and sort jobs so the user's best qualification matches are ranked first
 */
export function filterAndRankJobsByQualification(
  jobs: JobListing[],
  userEducation: string,
  selectedCategory: string = 'All Qualifications',
  onlyMatching: boolean = false
): JobListing[] {
  let list = [...jobs];

  // 1. Filter by explicit category dropdown
  if (selectedCategory && selectedCategory !== 'All Qualifications') {
    const targetCat = selectedCategory.toLowerCase();
    list = list.filter((j) => (j.qualificationCategory || '').toLowerCase().includes(targetCat));
  }

  // 2. Score every job against user's qualification
  const scored = list.map((job) => {
    const fit = calculateQualificationFit(userEducation, job);
    return {
      job,
      fit,
      finalScore: fit.score
    };
  });

  // 3. If onlyMatching toggle is on, keep only direct/transferable matches
  const filtered = onlyMatching ? scored.filter((item) => item.fit.isMatch) : scored;

  // 4. Sort descending by qualification score
  filtered.sort((a, b) => b.finalScore - a.finalScore);

  return filtered.map((item) => ({
    ...item.job,
    matchScore: item.fit.score,
    suitabilityReason: item.fit.explanation
  }));
}
