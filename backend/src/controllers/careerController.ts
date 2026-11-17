import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { store } from '../data/mockStore.js';
import { callGroqChat } from '../services/groqService.js';
import { parseResumeWithEdenAI, analyzeResumeWithEdenAI } from '../services/edenAiService.js';
import { fetchAustralianJobs, fallbackAustralianJobs } from '../services/jobDataService.js';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import {
  CareerProfileModel,
  ResumeModel,
  JobListingModel,
  JobApplicationModel,
  InterviewSessionModel,
  CareerRoadmapModel,
  CareerBreakProfileModel
} from '../models/careerModels.js';

// Australian verified jobs (AUD) powered by live job data service
export const defaultJobListings = fallbackAustralianJobs;

// In-memory fallback stores (clean initial state, populated only by database/user actions)
let memoryResumes: any[] = [];
let memoryApplications: any[] = [];

// ==========================================
// 1. Overview & Dashboard Endpoint
// ==========================================
export const getCareerOverview = async (req: Request, res: Response) => {
  try {
    const resumesCount = memoryResumes.length;
    const auJobs = await fetchAustralianJobs();
    const recommendedJobsCount = auJobs.length;
    const applicationsCount = memoryApplications.length;
    const interviewSessionsCount = 0;
    const skillsCompletedCount = 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalResumes: resumesCount,
        recommendedJobs: recommendedJobsCount,
        applicationsSubmitted: applicationsCount,
        interviewPrepProgress: 0,
        skillsCompleted: skillsCompletedCount,
        readinessScore: 0
      },
      recentJobs: auJobs.slice(0, 3),
      recentApplications: memoryApplications.slice(0, 3),
      upcomingInterviews: [],
      aiInsights: []
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 2. Resumes CRUD & AI Enhancement
// ==========================================
export const getResumes = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const dbResumes = await ResumeModel.find().sort({ updatedAt: -1 }).limit(10);
      if (dbResumes && dbResumes.length > 0) {
        return res.status(200).json({ success: true, resumes: dbResumes });
      }
    }
    return res.status(200).json({ success: true, resumes: memoryResumes });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const saveResume = async (req: Request, res: Response) => {
  try {
    const resumeData = req.body;
    const id = resumeData.id || `res-${Date.now()}`;

    const formatted = {
      ...resumeData,
      id,
      userId: resumeData.userId || 'usr-101',
      updatedAt: new Date().toISOString()
    };

    if (mongoose.connection.readyState === 1) {
      try {
        await ResumeModel.findOneAndUpdate(
          { userId: formatted.userId, title: formatted.title },
          formatted,
          { upsert: true, new: true }
        );
      } catch (err) {
        console.warn('[CareerController] MongoDB resume save note:', err);
      }
    }

    const idx = memoryResumes.findIndex((r) => r.id === id);
    if (idx >= 0) {
      memoryResumes[idx] = formatted;
    } else {
      memoryResumes.unshift(formatted);
    }

    return res.status(200).json({ success: true, resume: formatted });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteResume = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    memoryResumes = memoryResumes.filter((r) => r.id !== id);
    if (mongoose.connection.readyState === 1) {
      try {
        await ResumeModel.deleteOne({ _id: id });
      } catch {}
    }
    return res.status(200).json({ success: true, message: 'Resume deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * AI Bullet Enhancer: Converts rough responsibilities into strong, quantified achievements
 */
export const aiEnhanceResumeBullet = async (req: Request, res: Response) => {
  try {
    const { bulletText, roleTitle } = req.body;
    if (!bulletText || !bulletText.trim()) {
      return res.status(400).json({ success: false, error: 'Bullet text is required.' });
    }

    const messages = [
      {
        role: 'system' as const,
        content: `You are an elite executive resume writer. Your job is to convert a raw job duty/bullet into 3 high-impact, achievement-oriented bullets with strong action verbs and quantified impact metrics.
Output valid JSON format:
{
  "enhancedBullets": [
    "Spearheaded...",
    "Engineered...",
    "Accelerated..."
  ]
}`
      },
      {
        role: 'user' as const,
        content: `Role: ${roleTitle || 'Software Engineer'}\nOriginal bullet: ${bulletText}`
      }
    ];

    try {
      const response = await callGroqChat(messages, {
        temperature: 0.6,
        maxTokens: 500,
        responseFormat: { type: 'json_object' }
      });
      const parsed = JSON.parse(response);
      if (Array.isArray(parsed.enhancedBullets)) {
        return res.status(200).json({ success: true, bullets: parsed.enhancedBullets });
      }
    } catch (e) {
      console.warn('[AI Enhance Bullet Groq error]:', e);
    }

    // Heuristic fallback
    const fallback = [
      `Spearheaded ${bulletText.toLowerCase()}, delivering a 25% increase in operational efficiency and team throughput.`,
      `Engineered and optimized ${bulletText.toLowerCase()}, eliminating system bottlenecks and reducing cycle turnaround time by 30%.`,
      `Collaborated across cross-functional stakeholders to successfully deliver ${bulletText.toLowerCase()}, boosting engagement and client satisfaction.`
    ];

    return res.status(200).json({ success: true, bullets: fallback });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * AI Suggest Skills for a target role
 */
export const aiSuggestSkills = async (req: Request, res: Response) => {
  try {
    const { targetRole } = req.body;
    const role = targetRole || 'Full Stack Developer';

    const messages = [
      {
        role: 'system' as const,
        content: `You are an expert tech recruiter. Given a target job title, recommend the top 8 technical skills and top 4 soft skills currently in high market demand.
Output valid JSON format:
{
  "technical": ["Skill 1", "Skill 2", ...],
  "soft": ["Skill A", "Skill B", ...]
}`
      },
      {
        role: 'user' as const,
        content: `Target Role: ${role}`
      }
    ];

    try {
      const response = await callGroqChat(messages, {
        temperature: 0.2,
        maxTokens: 400,
        responseFormat: { type: 'json_object' }
      });
      const parsed = JSON.parse(response);
      if (parsed.technical && parsed.soft) {
        return res.status(200).json({ success: true, skills: parsed });
      }
    } catch (e) {
      console.warn('[AI Suggest Skills Groq error]:', e);
    }

    return res.status(200).json({
      success: true,
      skills: {
        technical: ['React.js', 'TypeScript', 'Node.js', 'REST APIs', 'PostgreSQL', 'Tailwind CSS', 'Git & CI/CD', 'Docker'],
        soft: ['Cross-functional Collaboration', 'Problem Solving', 'Strategic Thinking', 'Stakeholder Communication']
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 3. AI Resume Analyzer & Evaluator
// ==========================================
export const analyzeResumeDetailed = async (req: Request, res: Response) => {
  try {
    const { targetJobDescription } = req.body;
    let textToAnalyze = req.body.resumeText || req.body.text || '';

    // If structured resume data is passed, synthesize into full analysis text
    if (!textToAnalyze && req.body.resumeData) {
      const d = req.body.resumeData;
      textToAnalyze = [
        d.fullName || d.personalInfo?.fullName || '',
        d.headline || d.title || d.personalInfo?.headline || '',
        d.summary || '',
        d.skills ? `Skills: ${Array.isArray(d.skills) ? d.skills.join(', ') : (d.skills.technical || []).join(', ')}` : '',
        d.experience?.length
          ? `Work Experience:\n${d.experience.map((e: any) => `${e.title || e.role} at ${e.company} (${e.duration}): ${Array.isArray(e.highlights) ? e.highlights.join(' ') : (e.description || '')}`).join('\n')}`
          : '',
        d.education?.length
          ? `Education:\n${d.education.map((ed: any) => `${ed.degree} from ${ed.institution} (${ed.year || ''})`).join('\n')}`
          : '',
        d.projects?.length
          ? `Projects:\n${d.projects.map((p: any) => `${p.title}: ${p.description || ''} (${(p.technologies || []).join(', ')})`).join('\n')}`
          : ''
      ].filter(Boolean).join('\n\n');
    }

    if (!textToAnalyze || textToAnalyze.trim().length < 15) {
      return res.status(400).json({
        success: false,
        error: 'Resume content is required for evaluation. Please upload a file or paste resume text.'
      });
    }

    // 1. Attempt Eden AI Resume Analysis (using user's pasted API key)
    try {
      const edenAnalysis = await analyzeResumeWithEdenAI(textToAnalyze, targetJobDescription);
      if (edenAnalysis && typeof edenAnalysis.overallScore === 'number') {
        if (edenAnalysis.overallScore <= 10) edenAnalysis.overallScore = Math.round(edenAnalysis.overallScore * 10);
        return res.status(200).json({ success: true, analysis: edenAnalysis, engine: 'eden-ai' });
      }
    } catch (edenErr: any) {
      console.warn('[EdenAI Resume Analysis notice]:', edenErr?.message);
    }

    // 2. Call Groq Cloud LLM (openai/gpt-oss-120b)
    const messages = [
      {
        role: 'system' as const,
        content: `You are an AI Resume Evaluator and Senior Technical Talent Director.
Analyze the candidate's resume text thoroughly. Provide an estimated quality assessment score (0 to 100), detailed feedback on structure, weak points, spelling/grammar check, skills analysis, and missing high-impact keywords.
Important: Always present the score as an estimated quality assessment on a 0 to 100 integer scale.

Output valid JSON format matching this exact schema:
{
  "overallScore": number (between 65 and 96, e.g. 84),
  "summaryRating": "Strong" | "Good" | "Needs Improvement",
  "categoryScores": {
    "impactAndMetrics": number (between 50 and 95),
    "skillsAlignment": number (between 50 and 95),
    "formattingAndClarity": number (between 50 and 95),
    "experienceDepth": number (between 50 and 95)
  },
  "strengths": [
    "Specific strength from candidate background...",
    "Another distinct strength...",
    "Third distinct strength..."
  ],
  "improvements": [
    "Actionable improvement 1...",
    "Actionable improvement 2...",
    "Actionable improvement 3..."
  ],
  "missingKeywords": ["Keyword 1", "Keyword 2", "Keyword 3", "Keyword 4"],
  "improvedSampleBullets": [
    {
      "original": "Weak bullet or summary point from candidate resume",
      "improved": "Quantified, achievement-oriented replacement using strong action verbs"
    }
  ]
}`
      },
      {
        role: 'user' as const,
        content: `Resume Content:\n${textToAnalyze.slice(0, 4000)}\n\nTarget Job Description (Optional):\n${(targetJobDescription || 'Standard Industry Professional').slice(0, 1000)}`
      }
    ];

    try {
      const response = await callGroqChat(messages, {
        temperature: 0.2,
        maxTokens: 1200,
        responseFormat: { type: 'json_object' }
      });
      const parsed = JSON.parse(response);
      if (parsed && typeof parsed.overallScore === 'number') {
        // Normalize 0-10 score to 0-100 if model outputs single digit
        if (parsed.overallScore <= 10) {
          parsed.overallScore = Math.min(100, Math.round(parsed.overallScore * 10));
        }
        if (parsed.categoryScores) {
          for (const key of Object.keys(parsed.categoryScores)) {
            if (typeof parsed.categoryScores[key] === 'number' && parsed.categoryScores[key] <= 10) {
              parsed.categoryScores[key] = Math.min(100, Math.round(parsed.categoryScores[key] * 10));
            }
          }
        }
        return res.status(200).json({ success: true, analysis: parsed, engine: 'groq' });
      }
    } catch (e: any) {
      console.warn('[AI Resume Detailed Analyzer error]:', e?.message);
    }

    // 3. Dynamic Heuristic Evaluation Engine (Calculated directly from candidate text)
    const lower = textToAnalyze.toLowerCase();
    const wordCount = textToAnalyze.split(/\s+/).length;

    // Detect quantifiable metrics
    const metricsMatches = textToAnalyze.match(/(\d+[\d,.]*%|\$\s*\d+[\d,.]*|\b\d+\s*(?:k|million|users|clients|customers|projects|hours|team|x)\b)/gi) || [];
    const metricCount = metricsMatches.length;

    // Detect action verbs
    const actionVerbs = ['architected', 'developed', 'engineered', 'led', 'managed', 'designed', 'built', 'spearheaded', 'optimized', 'implemented', 'orchestrated', 'delivered', 'reduced', 'increased', 'streamlined'];
    const actionVerbsFound = actionVerbs.filter(v => lower.includes(v));

    // Detect sections
    const hasExp = /experience|employment|work history/i.test(textToAnalyze);
    const hasEdu = /education|university|college|degree|bachelor|master|diploma/i.test(textToAnalyze);
    const hasSkills = /skills|technologies|proficiencies|tools/i.test(textToAnalyze);
    const hasProjects = /projects|portfolio|initiatives/i.test(textToAnalyze);

    // Compute category scores based on actual document characteristics
    const impactScore = Math.min(95, Math.max(62, 60 + metricCount * 4 + actionVerbsFound.length * 2));
    const skillsScore = Math.min(96, Math.max(68, hasSkills ? 82 + Math.min(12, actionVerbsFound.length) : 70));
    const formatScore = Math.min(95, Math.max(70, 68 + (hasExp ? 8 : 0) + (hasEdu ? 8 : 0) + (wordCount > 150 ? 8 : 0)));
    const depthScore = Math.min(94, Math.max(65, 65 + (wordCount > 250 ? 15 : wordCount > 120 ? 8 : 0) + (hasProjects ? 10 : 0)));
    const overallScore = Math.round((impactScore * 0.3) + (skillsScore * 0.3) + (formatScore * 0.2) + (depthScore * 0.2));

    const rating = overallScore >= 85 ? 'Strong' : overallScore >= 75 ? 'Good' : 'Needs Improvement';

    const dynamicStrengths = [
      actionVerbsFound.length > 0
        ? `Effective use of leadership and execution action verbs (${actionVerbsFound.slice(0, 3).join(', ')})`
        : 'Clear chronological background presentation',
      hasSkills
        ? 'Well-organized technical proficiencies and tooling representation'
        : 'Solid functional overview of career milestones',
      metricCount > 0
        ? `Included ${metricCount} quantified impact indicators, boosting recruiter recall`
        : 'Consistent structural layout aligned with ATS scanning norms'
    ];

    const dynamicImprovements = [];
    if (metricCount < 3) {
      dynamicImprovements.push('Add more quantified outcomes (e.g. % performance increase, cost reduction, client count) to work experience bullets.');
    }
    if (actionVerbsFound.length < 3) {
      dynamicImprovements.push('Lead bullet points with active verbs like "Architected", "Engineered", or "Spearheaded" rather than passive phrasing.');
    }
    if (!hasProjects) {
      dynamicImprovements.push('Include a dedicated Projects or Key Initiatives section demonstrating hands-on technical execution.');
    }
    if (dynamicImprovements.length < 3) {
      dynamicImprovements.push('Customize summary statement directly matching keywords from your target job description.');
    }

    const missingKeywords = targetJobDescription
      ? (targetJobDescription as string).split(/\W+/).filter((w: string) => w.length > 5 && !lower.includes(w.toLowerCase())).slice(0, 4)
      : ['System Design', 'CI/CD Pipelines', 'Performance Optimization', 'Agile Collaboration'];

    return res.status(200).json({
      success: true,
      analysis: {
        overallScore,
        summaryRating: rating,
        categoryScores: {
          impactAndMetrics: impactScore,
          skillsAlignment: skillsScore,
          formattingAndClarity: formatScore,
          experienceDepth: depthScore
        },
        strengths: dynamicStrengths,
        improvements: dynamicImprovements,
        missingKeywords: missingKeywords.length > 0 ? missingKeywords : ['Technical Strategy', 'Cross-functional Leadership', 'API Architecture'],
        improvedSampleBullets: [
          {
            original: 'Responsible for developing features and supporting team deliverables.',
            improved: 'Spearheaded end-to-end development of core product features, improving system responsiveness by 28% and accelerating deployment cycles.'
          }
        ]
      },
      engine: 'intelligent-heuristic'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 4. Job Search & AI Matching
function getQualificationFitScore(userEdu: string, job: any): number {
  if (!userEdu) return 0;
  const edu = userEdu.toLowerCase();
  const q = (job.qualification || '').toLowerCase();
  const cat = (job.qualificationCategory || '').toLowerCase();
  const title = (job.title || '').toLowerCase();

  // Tech / Software / CS
  if (/(tech|computer|software|developer|engineer|cs\b|it\b|bca|mca|programming|frontend|backend|cloud)/.test(edu)) {
    if (cat.includes('technology') || cat.includes('software')) return 100;
    if (cat.includes('data')) return 85;
    if (cat.includes('design')) return 75;
  }
  // Nursing / Healthcare
  if (/(nurse|nursing|health|medical|clinical|ahpra|doctor|hospital|biotech)/.test(edu)) {
    if (cat.includes('healthcare') || cat.includes('nursing') || cat.includes('science')) return 100;
    if (cat.includes('education')) return 70;
  }
  // Finance / Commerce / Accounting
  if (/(commerce|b\.?com|accounting|accountancy|finance|cpa|ca\b|cma|banking|tax|bookkeep)/.test(edu)) {
    if (cat.includes('finance') || cat.includes('accounting')) return 100;
    if (cat.includes('data') || cat.includes('compliance')) return 85;
    if (cat.includes('retail')) return 75;
  }
  // Data / Analytics / Math / Statistics
  if (/(data|analytics|statistics|math|bi\b|machine learning)/.test(edu)) {
    if (cat.includes('data') || cat.includes('analytics')) return 100;
    if (cat.includes('technology') || cat.includes('finance')) return 85;
  }
  // Marketing / Media / Communications
  if (/(marketing|communication|media|journalism|pr\b|content|social)/.test(edu)) {
    if (cat.includes('marketing') || cat.includes('media')) return 100;
    if (cat.includes('business') || cat.includes('design')) return 80;
  }
  // Design / UI / UX / Arts
  if (/(design|ui|ux|graphic|arts|fine art|multimedia)/.test(edu)) {
    if (cat.includes('design') || cat.includes('creative')) return 100;
    if (cat.includes('marketing')) return 80;
  }
  // Education / Teaching
  if (/(educat|teach|childcare|early childhood|b\.?ed|m\.?ed|pedagogy)/.test(edu)) {
    if (cat.includes('education') || cat.includes('teaching')) return 100;
    if (cat.includes('human resources')) return 75;
  }
  // HR / Psychology
  if (/(hr\b|human resource|psychology|talent|people)/.test(edu)) {
    if (cat.includes('human resources') || cat.includes('people')) return 100;
    if (cat.includes('business')) return 80;
  }
  // Law / Compliance
  if (/(law|legal|compliance|regulatory)/.test(edu)) {
    if (cat.includes('legal') || cat.includes('compliance')) return 100;
    if (cat.includes('finance')) return 80;
  }
  // Hospitality / Events
  if (/(hospitality|hotel|tourism|event)/.test(edu)) {
    if (cat.includes('hospitality') || cat.includes('events')) return 100;
    if (cat.includes('retail')) return 80;
  }

  // Direct substring check
  if (q.includes(edu) || edu.includes(q) || cat.includes(edu) || title.includes(edu)) return 90;
  return 50;
}

// ==========================================
export const getJobs = async (req: Request, res: Response) => {
  const { search, workMode, type, returneeFriendly, qualification, category, userEducation } = req.query;

  try {
    const auJobs = await fetchAustralianJobs();
    let filtered = [...auJobs];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q)) ||
          j.location.toLowerCase().includes(q) ||
          (j.qualification && j.qualification.toLowerCase().includes(q)) ||
          (j.qualificationCategory && j.qualificationCategory.toLowerCase().includes(q))
      );
    }

    if (workMode && workMode !== 'All') {
      filtered = filtered.filter((j) => j.workMode.toLowerCase() === (workMode as string).toLowerCase());
    }

    if (type && type !== 'All') {
      filtered = filtered.filter((j) => j.employmentType.toLowerCase() === (type as string).toLowerCase());
    }

    if (returneeFriendly === 'true') {
      filtered = filtered.filter((j) => j.returneeFriendly);
    }

    if (category && typeof category === 'string' && category !== 'All') {
      const cat = category.toLowerCase();
      filtered = filtered.filter((j) => (j.qualificationCategory || '').toLowerCase().includes(cat));
    }

    if (qualification && typeof qualification === 'string' && qualification !== 'All') {
      const q = qualification.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          (j.qualification || '').toLowerCase().includes(q) ||
          (j.qualificationCategory || '').toLowerCase().includes(q)
      );
    }

    // Sort by user's qualification fit if userEducation parameter is provided
    if (userEducation && typeof userEducation === 'string' && userEducation.trim().length > 0) {
      const uEdu = userEducation.trim();
      filtered.sort((a, b) => {
        const scoreA = getQualificationFitScore(uEdu, a);
        const scoreB = getQualificationFitScore(uEdu, b);
        return scoreB - scoreA;
      });
    }

    return res.status(200).json({ success: true, count: filtered.length, jobs: filtered, market: 'Australia (AUD)' });
  } catch (error: any) {
    return res.status(200).json({ success: true, count: defaultJobListings.length, jobs: defaultJobListings });
  }
};

/**
 * AI Match Job with Profile
 */
export const matchJobWithProfile = async (req: Request, res: Response) => {
  try {
    const { userSkills, userExperience, userQualification, job } = req.body;
    if (!job) {
      return res.status(400).json({ success: false, error: 'Job details required' });
    }

    const messages = [
      {
        role: 'system' as const,
        content: `You are an AI Career & Education Matchmaker. Evaluate how well a candidate fits a job opening based on both their qualification/education and their skills.
Output valid JSON format:
{
  "matchPercentage": number (0-100),
  "qualificationEligibility": {
    "status": "Fully Qualified" | "Eligible via Transferable Skills" | "Upskilling Recommended",
    "details": "1-2 sentence assessment of candidate qualification vs required qualification"
  },
  "suitabilityReason": "Clear, encouraging 2-3 sentence explanation of why this job fits the candidate",
  "matchingSkills": ["Skill 1", "Skill 2"],
  "missingSkills": ["Skill A", "Skill B"],
  "recommendedPrep": "Actionable 1-line suggestion before applying"
}`
      },
      {
        role: 'user' as const,
        content: `Candidate Qualification: ${userQualification || 'Bachelor Degree / Relevant Training'}\nCandidate Skills: ${JSON.stringify(userSkills || ['React', 'JavaScript', 'HTML/CSS'])}\nCandidate Experience: ${userExperience || '3 years'}\nJob Title: ${job.title}\nCompany: ${job.company}\nJob Required Qualification: ${job.qualification || 'Relevant Degree / Experience'}\nJob Skills Required: ${JSON.stringify(job.skills || [])}`
      }
    ];

    try {
      const response = await callGroqChat(messages, {
        temperature: 0.2,
        maxTokens: 500,
        responseFormat: { type: 'json_object' }
      });
      const parsed = JSON.parse(response);
      return res.status(200).json({ success: true, match: parsed });
    } catch (e) {
      console.warn('[AI Match Job Groq error]:', e);
    }

    const fitScore = userQualification ? getQualificationFitScore(userQualification, job) : 88;
    return res.status(200).json({
      success: true,
      match: {
        matchPercentage: Math.max(75, fitScore),
        qualificationEligibility: {
          status: fitScore >= 85 ? 'Fully Qualified' : fitScore >= 70 ? 'Eligible via Transferable Skills' : 'Upskilling Recommended',
          details: `Your background in ${userQualification || 'your field'} fulfills the prerequisites for ${job.title} at ${job.company}.`
        },
        suitabilityReason: `Your profile aligns closely with ${job.company}'s requirements for ${job.title}. Your qualification and skills provide a strong foundation.`,
        matchingSkills: (job.skills || []).slice(0, 3),
        missingSkills: (job.skills || []).slice(3, 5),
        recommendedPrep: 'Highlight your qualification milestones and project achievements in your application notes.'
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 5. Job Application Tracker
// ==========================================
export const getApplications = (req: Request, res: Response) => {
  return res.status(200).json({ success: true, count: memoryApplications.length, applications: memoryApplications });
};

export const createApplication = (req: Request, res: Response) => {
  const { company, title, location, salary, status, appliedDate, interviewDate, notes } = req.body;
  if (!company || !title) {
    return res.status(400).json({ success: false, error: 'Company and Title are required.' });
  }

  const newApp = {
    id: `app-${Date.now()}`,
    company,
    title,
    location: location || 'Remote',
    salary: salary || '',
    status: status || 'Applied',
    appliedDate: appliedDate || new Date().toISOString().split('T')[0],
    interviewDate,
    notes: notes || ''
  };

  memoryApplications.unshift(newApp);
  return res.status(201).json({ success: true, application: newApp });
};

export const updateApplication = (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const idx = memoryApplications.findIndex((a) => a.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Application not found' });
  }

  memoryApplications[idx] = { ...memoryApplications[idx], ...updates };
  return res.status(200).json({ success: true, application: memoryApplications[idx] });
};

export const deleteApplication = (req: Request, res: Response) => {
  const { id } = req.params;
  memoryApplications = memoryApplications.filter((a) => a.id !== id);
  return res.status(200).json({ success: true, message: 'Application removed' });
};

// ==========================================
// 6. AI Interview Preparation
// ==========================================
export const startInterview = async (req: Request, res: Response) => {
  try {
    const { targetRole, category, difficulty } = req.body;
    const role = targetRole || 'Software Engineer';
    const cat = category || 'Technical Interview';
    const diff = difficulty || 'Intermediate';

    const messages = [
      {
        role: 'system' as const,
        content: `You are an expert interview simulator and hiring committee lead.
Generate 5 realistic, industry-standard interview questions tailored for the given role, category, and difficulty.
Output valid JSON format:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text...",
      "expectedKeyPoints": ["Point 1", "Point 2"]
    }
  ]
}`
      },
      {
        role: 'user' as const,
        content: `Role: ${role}\nCategory: ${cat}\nDifficulty: ${diff}`
      }
    ];

    try {
      const response = await callGroqChat(messages, {
        temperature: 0.5,
        maxTokens: 700,
        responseFormat: { type: 'json_object' }
      });
      const parsed = JSON.parse(response);
      if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return res.status(200).json({ success: true, questions: parsed.questions });
      }
    } catch (e) {
      console.warn('[Start Interview Groq error]:', e);
    }

    // High quality fallback questions
    return res.status(200).json({
      success: true,
      questions: [
        {
          id: 'q1',
          question: `Can you walk me through a challenging problem you solved in your recent work as a ${role}, and how you measured success?`,
          expectedKeyPoints: ['Problem context', 'Technical or strategic solution', 'Measurable outcome']
        },
        {
          id: 'q2',
          question: 'How do you prioritize technical debt against urgent feature delivery requests from product stakeholders?',
          expectedKeyPoints: ['Impact vs effort evaluation', 'Stakeholder communication', 'Incremental refactoring']
        },
        {
          id: 'q3',
          question: 'Describe a time when you received constructive feedback or encountered a disagreement in team code review. How did you handle it?',
          expectedKeyPoints: ['Active listening', 'Objective evaluation', 'Growth mindset']
        }
      ]
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const evaluateInterviewAnswer = async (req: Request, res: Response) => {
  try {
    const { question, userAnswer, role } = req.body;
    if (!userAnswer || !userAnswer.trim()) {
      return res.status(400).json({ success: false, error: 'User answer is required.' });
    }

    const messages = [
      {
        role: 'system' as const,
        content: `You are an elite interview coach. Evaluate the candidate's spoken/typed answer to an interview question.
Provide constructive, motivating feedback, score out of 100, identify key missed points, and offer an ideal model answer.
Output valid JSON format:
{
  "score": number (0-100),
  "rating": "Exceptional" | "Solid" | "Needs Practice",
  "clarityAndTone": "Feedback on communication style",
  "keyStrengths": ["Strength 1", "Strength 2"],
  "pointsMissed": ["Missed point 1", "Missed point 2"],
  "idealSampleAnswer": "A polished 3-4 sentence response demonstrating best practices."
}`
      },
      {
        role: 'user' as const,
        content: `Role: ${role || 'Professional'}\nQuestion: ${question}\nCandidate Answer: ${userAnswer}`
      }
    ];

    try {
      const response = await callGroqChat(messages, {
        temperature: 0.3,
        maxTokens: 800,
        responseFormat: { type: 'json_object' }
      });
      const parsed = JSON.parse(response);
      return res.status(200).json({ success: true, evaluation: parsed });
    } catch (e) {
      console.warn('[Evaluate Interview Groq error]:', e);
    }

    return res.status(200).json({
      success: true,
      evaluation: {
        score: 84,
        rating: 'Solid',
        clarityAndTone: 'Clear, authentic delivery with good problem structuring.',
        keyStrengths: ['Demonstrated ownership', 'Good emphasis on collaboration'],
        pointsMissed: ['Could include specific metrics or timelines to quantify the result'],
        idealSampleAnswer:
          'In my previous role, I addressed this by conducting a root-cause breakdown with team leads. We isolated the primary bottleneck, deployed an automated testing pipeline, and reduced defect escape rates by 28% within 60 days.'
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 7. Career Roadmap & Skill Gap Analysis
// ==========================================
export const generateCareerRoadmap = async (req: Request, res: Response) => {
  try {
    const { currentSkills, targetRole, yearsOfExperience } = req.body;
    const role = targetRole || 'Data Analyst';

    const messages = [
      {
        role: 'system' as const,
        content: `You are a Career Architect and Curriculum Director.
Compare current skills against target role requirements, identify critical skill gaps, and construct a phased 3-stage learning roadmap with milestones, courses, and estimated weeks.
Output valid JSON format:
{
  "targetRole": "${role}",
  "missingSkills": [
    {
      "skill": "Skill name",
      "priority": "high" | "medium" | "low",
      "estimatedHours": number,
      "recommendedCourse": "Course name or cert"
    }
  ],
  "phases": [
    {
      "phase": "Phase 1: Foundations",
      "durationWeeks": 4,
      "milestone": "Milestone title",
      "tasks": ["Task 1", "Task 2", "Task 3"]
    },
    {
      "phase": "Phase 2: Core Projects & Portfolio",
      "durationWeeks": 6,
      "milestone": "Milestone title",
      "tasks": ["Task 1", "Task 2"]
    },
    {
      "phase": "Phase 3: Interview Mastery & Applications",
      "durationWeeks": 3,
      "milestone": "Milestone title",
      "tasks": ["Task 1", "Task 2"]
    }
  ]
}`
      },
      {
        role: 'user' as const,
        content: `Target Role: ${role}\nCurrent Skills: ${JSON.stringify(currentSkills || ['Excel', 'Communication'])}\nExperience: ${yearsOfExperience || '1 year'}`
      }
    ];

    try {
      const response = await callGroqChat(messages, {
        temperature: 0.3,
        maxTokens: 1000,
        responseFormat: { type: 'json_object' }
      });
      const parsed = JSON.parse(response);
      return res.status(200).json({ success: true, roadmap: parsed });
    } catch (e) {
      console.warn('[Career Roadmap Groq error]:', e);
    }

    return res.status(200).json({
      success: true,
      roadmap: {
        targetRole: role,
        missingSkills: [
          { skill: 'SQL & Database Architecture', priority: 'high', estimatedHours: 25, recommendedCourse: 'Mastering PostgreSQL & BigQuery' },
          { skill: 'Power BI & Visual Analytics', priority: 'high', estimatedHours: 20, recommendedCourse: 'Executive BI Dashboard Masterclass' },
          { skill: 'Python for Data Analysis (Pandas)', priority: 'medium', estimatedHours: 30, recommendedCourse: 'Practical Python Data Science' }
        ],
        phases: [
          {
            phase: 'Phase 1: Core Fundamentals & Querying',
            durationWeeks: 4,
            milestone: 'Master SQL aggregation, window functions, and schema design',
            tasks: ['Complete SQL 100 challenge', 'Design 3 normalized database schemas', 'Write complex CTE queries']
          },
          {
            phase: 'Phase 2: Portfolio Projects & Dashboards',
            durationWeeks: 6,
            milestone: 'Publish 2 end-to-end interactive Power BI / Python case studies',
            tasks: ['Clean messy public dataset', 'Build executive financial overview dashboard', 'Write project documentation on GitHub']
          },
          {
            phase: 'Phase 3: Interview Mastery & Targeted Applications',
            durationWeeks: 3,
            milestone: 'Pass 3 mock technical screens and submit 15 targeted applications',
            tasks: ['Practice take-home analytics challenges', 'Optimize resume with project metrics', 'Apply to verified returnee-friendly openings']
          }
        ]
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 8. Career Restart for Women (Returnee Track)
// ==========================================
export const generateCareerBreakNarrative = async (req: Request, res: Response) => {
  try {
    const { breakDurationYears, breakReason, previousRole, targetRole, newSkills } = req.body;

    const messages = [
      {
        role: 'system' as const,
        content: `You are an empowering Women Career Comeback Strategist.
Help women returning to work after a career break explain their career gap professionally, positively, and with confidence. Never downgrade or apologize for career breaks. Highlight transferable skills such as resilience, organization, crisis management, multitasking, and recent learning.
Output valid JSON format:
{
  "resumeSummaryNarrative": "A dignified, compelling 3-4 sentence professional summary that naturally bridges the previous career and current readiness.",
  "interviewTalkingPoints": [
    "Talking point 1 on how to address the break confidently...",
    "Talking point 2 on how recent projects/skills make you battle-ready...",
    "Talking point 3 turning personal growth into workplace strength..."
  ],
  "transferableSkillsIdentified": ["Agile Adaptation", "Stakeholder Empathy", "Time & Budget Orchestration", "Critical Thinking"],
  "recommendedComebackStrategy": "Actionable 2-sentence advice for approaching recruiters."
}`
      },
      {
        role: 'user' as const,
        content: `Break Duration: ${breakDurationYears || '3'} years\nReason: ${breakReason || 'Childcare & Family Caregiving'}\nPrevious Role: ${previousRole || 'Software Developer'}\nTarget Role: ${targetRole || 'Full Stack Engineer'}\nNew/Refreshed Skills: ${newSkills || 'React, Modern TypeScript, Cloud APIs'}`
      }
    ];

    try {
      const response = await callGroqChat(messages, {
        temperature: 0.5,
        maxTokens: 800,
        responseFormat: { type: 'json_object' }
      });
      const parsed = JSON.parse(response);
      return res.status(200).json({ success: true, restartData: parsed });
    } catch (e) {
      console.warn('[Career Break Narrative Groq error]:', e);
    }

    return res.status(200).json({
      success: true,
      restartData: {
        resumeSummaryNarrative: `Results-driven ${previousRole || 'Professional'} returning to full-time workforce with refreshed competencies in ${newSkills || 'modern cloud technologies'}. Combines foundational engineering rigor with exceptional stakeholder coordination and adaptive problem-solving, poised to deliver immediate impact in ${targetRole || 'growth-oriented teams'}.`,
        interviewTalkingPoints: [
          'Frame the pause clearly and briefly: "I took deliberate time to focus on family, while maintaining continuous curiosity in modern software ecosystems."',
          'Pivot immediately to your current readiness: "Over the past 6 months, I completed intensive project sprints in modern React and TypeScript, delivering production-grade applications."',
          'Highlight mature perspective: "The break reinforced my resilience, prioritization, and ability to coordinate complex priorities with poise."'
        ],
        transferableSkillsIdentified: ['Complex Prioritization', 'Conflict Resolution & Empathy', 'Resource Orchestration', 'Continuous Adaptability'],
        recommendedComebackStrategy: 'Target organizations with recognized Returnship programs and emphasize recent GitHub repositories alongside past institutional tenure.'
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 9. HerCareer AI Chat Assistant
// ==========================================
export const careerAiAssistant = async (req: Request, res: Response) => {
  try {
    const { prompt, history, userProfile } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, error: 'Prompt is required.' });
    }

    const conversation: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      {
        role: 'system',
        content: `You are HerCareer AI Assistant, an elite, empowering, and empathetic career advisor designed for women, fresh graduates, and career relaunchers on the HerRise platform.
You give actionable, structured, encouraging, and honest advice about resume crafting, interview prep, skill roadmaps, job search tactics, and career comeback strategies.
Keep advice clear, professional, and practical with bullet points where appropriate.`
      }
    ];

    if (Array.isArray(history)) {
      history.slice(-6).forEach((h) => {
        if (h.role && h.content) {
          conversation.push({ role: h.role, content: h.content });
        }
      });
    }

    conversation.push({
      role: 'user' as const,
      content: `${userProfile ? `[Context: Candidate target role is ${userProfile.targetRole || 'Software Engineer'}]\n` : ''}${prompt}`
    });

    try {
      const response = await callGroqChat(conversation, {
        temperature: 0.7,
        maxTokens: 800
      });
      return res.status(200).json({ success: true, reply: response });
    } catch (e: any) {
      console.warn('[HerCareer AI Assistant Groq error]:', e?.message);
    }

    return res.status(200).json({
      success: true,
      reply: `Here are 3 key strategies for "${prompt}":\n\n1. **Highlight Quantified Impact**: In modern hiring, outcomes matter more than lists of tasks. Use metrics (e.g. "accelerated deployment by 30%").\n2. **Tailor Your Key Skills**: Ensure the top 5 skills mentioned in the job description appear naturally in your professional summary.\n3. **Network Proactively**: Connect with 2 peers or alumnae in your target company before submitting your application.`
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 10. Universal PDF & DOCX File Parsers
// ==========================================
async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const pAny = pdfParse as any;
    const PDFClass = pAny.PDFParse || (pAny.default && pAny.default.PDFParse);
    if (PDFClass) {
      const parser = new PDFClass({ data: buffer });
      await parser.load();
      const textResult = await parser.getText();
      await parser.destroy();
      if (textResult && typeof textResult.text === 'string' && textResult.text.trim()) {
        return textResult.text;
      }
    }
  } catch (err: any) {
    console.warn('[CareerController] PDFParse v2 notice:', err?.message);
  }

  try {
    const fn = (pdfParse as any).default || pdfParse;
    if (typeof fn === 'function') {
      const res = await fn(buffer);
      if (res && res.text) return res.text;
    }
  } catch (err2: any) {
    console.warn('[CareerController] PDFParse v1 notice:', err2?.message);
  }

  return buffer.toString('utf-8');
}

async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    const res = await mammoth.extractRawText({ buffer });
    if (res && res.value && res.value.trim().length > 0) {
      return res.value;
    }
  } catch (err: any) {
    console.warn('[CareerController] Mammoth docx error:', err?.message);
  }
  return buffer.toString('utf-8');
}

export const parseResume = async (req: Request, res: Response) => {
  try {
    let rawText = '';
    const file = req.file;

    if (file) {
      // 1. Try Eden AI Resume Parser using the user's configured live key
      try {
        const edenResult = await parseResumeWithEdenAI(file.buffer, file.originalname, file.mimetype);
        if (edenResult.success && edenResult.parsed) {
          return res.status(200).json({
            success: true,
            parsed: edenResult.parsed,
            rawText: edenResult.rawText || '',
            textLength: (edenResult.rawText || '').length,
            engine: `eden-ai (${edenResult.provider || 'affinda'})`
          });
        }
      } catch (edenErr: any) {
        console.warn('[EdenAI Parser attempt notice]:', edenErr?.message);
      }

      // 2. Extract text locally from PDF / Word
      const mime = file.mimetype;
      const originalName = file.originalname.toLowerCase();

      if (mime.includes('pdf') || originalName.endsWith('.pdf')) {
        rawText = await extractTextFromPdf(file.buffer);
      } else if (
        mime.includes('wordprocessingml') ||
        originalName.endsWith('.docx') ||
        originalName.endsWith('.doc')
      ) {
        rawText = await extractTextFromDocx(file.buffer);
      } else {
        rawText = file.buffer.toString('utf-8');
      }
    } else if (req.body.resumeText || req.body.text) {
      rawText = req.body.resumeText || req.body.text;
    }

    if (!rawText || rawText.trim().length < 15) {
      return res.status(400).json({ success: false, error: 'Could not extract text from the provided file.' });
    }

    // Call Groq LLM (openai/gpt-oss-120b) to parse extracted text into structured resume fields
    const messages = [
      {
        role: 'system' as const,
        content: `You are an expert ATS Resume Parsing Engine. Extract comprehensive, structured resume information accurately from the raw text provided. Extract the actual candidate details without fabricating data.

CRITICAL INSTRUCTIONS:
1. STRICT DIVISION BETWEEN WORK EXPERIENCE AND PROJECTS:
   - "experience" MUST ONLY contain formal employment, corporate roles, faculty/trainer jobs, or verified internships at companies or institutions.
   - "projects" MUST contain technical applications, web platforms, software apps, personal/academic capstones, or open-source software.
   - NEVER place software/web projects inside "experience". Always place them in "projects".
   - If the candidate has NO formal corporate employment, leave "experience" as an empty array [] - NEVER fabricate companies or inject placeholders.
2. EXTRACT ALL PROJECTS CAREFULLY:
   - For every project, extract its name in "title", tech stack in "technologies" (array of strings), summary in "description", and key features/accomplishments in "highlights".
3. INTERNSHIPS, CERTIFICATIONS & ACHIEVEMENTS:
   - Put training, micro-internships, and certifications in "certifications".
   - Put research papers, conference presentations, and leadership roles in "achievements".

Output valid JSON matching this schema:
{
  "fullName": "Candidate Full Name or empty string",
  "email": "Email address or empty string",
  "phone": "Phone number or empty string",
  "location": "City, State / Country or empty string",
  "headline": "Target role or professional title extracted from resume",
  "summary": "Professional summary extracted from resume or concise synthesis of background",
  "skills": ["Skill 1", "Skill 2", ...],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company / Organization Name",
      "location": "Location if present or empty string",
      "duration": "Dates (e.g. Month Year – Month Year or Present)",
      "highlights": ["Responsibility or quantifiable achievement 1"]
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "technologies": ["Technology 1", "Technology 2"],
      "role": "Role (e.g. Developer / Lead)",
      "link": "URL or repository if present, else empty string",
      "description": "Short project overview",
      "highlights": ["Feature or achievement 1"]
    }
  ],
  "education": [
    {
      "degree": "Degree or Qualification Name",
      "institution": "University / College / School Name",
      "year": "Graduation Year or Date Range",
      "grade": "GPA, Percentage or Grade if present, else empty string"
    }
  ],
  "certifications": [
    {
      "name": "Certification or Training Name",
      "issuer": "Issuing Organization",
      "year": "Year or duration"
    }
  ],
  "achievements": [
    "Achievement, paper, or award 1"
  ],
  "qualityScore": 85
}`
      },
      {
        role: 'user' as const,
        content: `Raw resume text:\n${rawText.slice(0, 5000)}`
      }
    ];

    try {
      const response = await callGroqChat(messages, {
        temperature: 0.1,
        maxTokens: 1800,
        responseFormat: { type: 'json_object' }
      });
      const parsed = JSON.parse(response);

      // Post-processing guard: strictly separate any projects accidentally placed in experience
      if (Array.isArray(parsed.experience)) {
        const cleanExp: any[] = [];
        const extraProjects: any[] = [];

        for (const exp of parsed.experience) {
          const t = (exp.title || exp.role || '').toLowerCase();
          const c = (exp.company || '').toLowerCase();
          const isProj =
            t.startsWith('project:') ||
            t.includes('personal project') ||
            t.includes('capstone project') ||
            c.startsWith('project:') ||
            c.includes('personal project') ||
            c.includes('academic project');

          if (isProj) {
            extraProjects.push({
              title: (exp.title || exp.role || 'Project').replace(/^Project:\s*/i, '').trim(),
              role: exp.role || exp.title || 'Contributor',
              technologies: Array.isArray(exp.technologies) ? exp.technologies : [],
              link: exp.link || '',
              description: exp.description || (exp.highlights && exp.highlights[0]) || '',
              highlights: exp.highlights || []
            });
          } else {
            cleanExp.push(exp);
          }
        }

        parsed.experience = cleanExp;
        if (!Array.isArray(parsed.projects)) {
          parsed.projects = [];
        }
        parsed.projects = [...parsed.projects, ...extraProjects];
      }

      return res.status(200).json({ success: true, parsed, rawText, textLength: rawText.length, engine: 'groq' });
    } catch (e) {
      console.warn('[Parse Resume Groq error]:', e);
    }

    return res.status(200).json({
      success: true,
      parsed: {
        fullName: 'Extracted Candidate',
        email: '',
        phone: '',
        location: 'India',
        headline: 'Professional Specialist',
        summary: rawText.slice(0, 200).trim(),
        skills: ['Communication', 'Problem Solving', 'Strategic Planning'],
        experience: [],
        projects: [],
        education: [],
        certifications: [],
        achievements: [],
        qualityScore: 80
      },
      rawText,
      textLength: rawText.length,
      engine: 'fallback'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const applyJob = async (req: Request, res: Response) => {
  const { jobId, coverLetter } = req.body;
  const auJobs = await fetchAustralianJobs();
  const job = auJobs.find((j) => j.jobId === jobId) || defaultJobListings.find((j) => j.jobId === jobId);

  if (!job) {
    return res.status(404).json({ success: false, error: 'Job not found' });
  }

  // Add to applications
  memoryApplications.unshift({
    id: `app-${Date.now()}`,
    company: job.company,
    title: job.title,
    location: job.location,
    salary: job.salaryRange,
    status: 'Applied',
    appliedDate: new Date().toISOString().split('T')[0],
    notes: coverLetter ? `Cover Letter: ${coverLetter.slice(0, 100)}...` : 'Applied via HerRise Platform'
  });

  return res.status(200).json({
    success: true,
    message: `Application submitted successfully for ${job.title} at ${job.company}`,
    applyUrl: job.applyUrl
  });
};

export const generateAtsSummary = async (req: Request, res: Response) => {
  try {
    const { headline, targetRole, skills, experienceYears, careerBreak } = req.body;

    const messages = [
      {
        role: 'system' as const,
        content: `You are an expert career coach and ATS resume writer specializing in women's career empowerment and career relaunch.
Generate 3 distinct, high-impact, professional summaries (each 3-4 sentences long) tailored for an ATS-friendly resume.
Return valid JSON:
{
  "summaries": ["Summary 1...", "Summary 2...", "Summary 3..."]
}`
      },
      {
        role: 'user' as const,
        content: `Role: ${headline || targetRole || 'Professional'}\nTarget: ${targetRole || 'Growth Role'}\nExperience: ${experienceYears || '3+'}\nSkills: ${Array.isArray(skills) ? skills.join(', ') : skills || 'Strategy'}\nCareer Break: ${careerBreak ? 'Yes' : 'No'}`
      }
    ];

    try {
      const response = await callGroqChat(messages, {
        temperature: 0.7,
        maxTokens: 600,
        responseFormat: { type: 'json_object' }
      });
      const parsed = JSON.parse(response);
      if (Array.isArray(parsed.summaries)) {
        return res.status(200).json({ success: true, summaries: parsed.summaries });
      }
    } catch (e) {}

    const title = headline || targetRole || 'Dedicated Professional';
    return res.status(200).json({
      success: true,
      summaries: [
        `Results-driven ${title} with ${experienceYears || '3+'} years of experience delivering high-impact outcomes in fast-paced environments. Proven track record in cross-functional leadership, strategic execution, and driving organizational goals. Adept at leveraging modern methodologies to maximize efficiency and value.`,
        `Dynamic and collaborative ${title} skilled in problem-solving, stakeholder coordination, and continuous improvement. Brings a strategic mindset and hands-on expertise to solve complex challenges and elevate team productivity. Committed to driving sustainable results and organizational excellence.`,
        `Empowered and ambitious ${title} combining deep functional acumen with strong analytical capabilities. Recognized for attention to detail, proactive adaptability, and delivering measurable milestones ahead of deadlines. Seeking to bring value and innovation to growth-oriented initiatives.`
      ]
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
};
