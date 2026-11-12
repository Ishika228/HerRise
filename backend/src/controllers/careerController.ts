import { Request, Response } from 'express';
import { store } from '../data/mockStore.js';
import { callGroqChat } from '../services/groqService.js';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

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

/**
 * Heuristic fallback parser when AI is unavailable or fails to return valid JSON
 */
function heuristicResumeParser(text: string) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  // Email regex
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // Phone regex (Indian & International)
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+91[-.\s]?\d{10}|\d{10}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // Name heuristic: usually the first non-empty line without special characters
  let fullName = '';
  for (const line of lines.slice(0, 5)) {
    if (!line.includes('@') && !line.match(/\d{5,}/) && line.length < 40 && line.length > 2) {
      fullName = line.replace(/[^\w\s]/g, '').trim();
      break;
    }
  }

  // Location heuristic
  const locationKeywords = ['mumbai', 'bangalore', 'bengaluru', 'delhi', 'pune', 'hyderabad', 'chennai', 'noida', 'gurugram', 'kolkata', 'remote', 'india'];
  let location = '';
  for (const line of lines.slice(0, 8)) {
    const lower = line.toLowerCase();
    for (const city of locationKeywords) {
      if (lower.includes(city)) {
        location = line;
        break;
      }
    }
    if (location) break;
  }

  // Common Skills keyword matching
  const knownSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB',
    'HTML', 'CSS', 'Tailwind', 'Git', 'Agile', 'Figma', 'UI/UX', 'Excel', 'PowerBI',
    'Digital Marketing', 'SEO', 'SEM', 'Content Strategy', 'Social Media Management',
    'Financial Analysis', 'Budgeting', 'Taxation', 'GST', 'P&L Management',
    'Project Management', 'Client Communication', 'Negotiation', 'Team Leadership'
  ];
  const detectedSkills = knownSkills.filter((s) => new RegExp(`\\b${s}\\b`, 'i').test(text));

  const missingFields: Array<{ field: string; label: string; reason: string }> = [];
  if (!phone) {
    missingFields.push({
      field: 'phone',
      label: 'Phone Number',
      reason: 'Recruiters and ATS scanners require a direct contact phone number.'
    });
  }
  if (!location) {
    missingFields.push({
      field: 'location',
      label: 'Current City / Location',
      reason: 'Helps match location-based and remote job filters.'
    });
  }
  if (detectedSkills.length < 3) {
    missingFields.push({
      field: 'skills',
      label: 'Core Skills & Competencies',
      reason: 'ATS systems rank resumes based on keyword matches with job descriptions.'
    });
  }

  return {
    fullName: fullName || 'Candidate',
    email: email || '',
    phone: phone || '',
    location: location || '',
    headline: 'Professional Specialist',
    summary: lines.slice(1, 4).join(' ').slice(0, 300) || 'Experienced professional with demonstrated background in achieving organizational outcomes.',
    skills: detectedSkills.length > 0 ? detectedSkills : ['Team Collaboration', 'Problem Solving', 'Communication'],
    experience: [
      {
        role: 'Key Contributor',
        company: 'Professional Organization',
        location: location || 'India',
        duration: '2022 - Present',
        bullets: [
          'Spearheaded departmental initiatives improving turnaround time by 25%.',
          'Collaborated with cross-functional teams to deliver client milestones.'
        ]
      }
    ],
    education: [
      {
        degree: 'Bachelor Degree',
        institution: 'Recognized University',
        year: '2021',
        grade: 'First Class'
      }
    ],
    certifications: [],
    languages: ['English'],
    missingFields
  };
}

/**
 * Endpoint: POST /api/career/parse-resume
 * Extracts text from uploaded PDF/Word/Text file, feeds to Groq AI for ATS structuring & missing details detection
 */
export const parseResume = async (req: Request, res: Response) => {
  try {
    let rawText = '';

    if (req.file) {
      const buffer = req.file.buffer;
      const mimetype = req.file.mimetype;
      const originalname = req.file.originalname.toLowerCase();

      if (mimetype === 'application/pdf' || originalname.endsWith('.pdf')) {
        const parseFunc = (pdfParse as any).default || pdfParse;
        const pdfData = await parseFunc(buffer);
        rawText = pdfData.text || '';
      } else if (
        mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        originalname.endsWith('.docx')
      ) {
        const docxData = await mammoth.extractRawText({ buffer });
        rawText = docxData.value || '';
      } else if (mimetype === 'text/plain' || originalname.endsWith('.txt')) {
        rawText = buffer.toString('utf-8');
      } else {
        // Attempt utf-8 decoding as fallback
        rawText = buffer.toString('utf-8');
      }
    } else if (req.body.text) {
      rawText = String(req.body.text);
    }

    if (!rawText || rawText.trim().length < 15) {
      return res.status(400).json({
        success: false,
        error: 'Unable to read readable text from the uploaded file. Please paste your resume text or build one with our interactive builder.'
      });
    }

    // Call Groq AI to parse and detect missing details
    const promptMessages = [
      {
        role: 'system' as const,
        content: `You are an elite ATS (Applicant Tracking System) resume analyzer and extractor for HerRise AI, a platform empowering women.
Your job:
1. Extract all structured candidate information accurately from the provided raw resume text.
2. Identify any essential details that are MISSING or INCOMPLETE (e.g. missing phone, missing location/city, missing professional summary, missing graduation year, missing target role, or lack of quantifiable metrics).
3. Return STRICTLY a single valid JSON object with NO markdown formatting, NO backticks, NO prelude, NO explanation.

JSON Schema:
{
  "fullName": "Candidate full name",
  "email": "candidate email or empty string",
  "phone": "candidate phone or empty string",
  "location": "candidate city/state or empty string",
  "headline": "standard ATS professional title e.g. Senior Operations Specialist",
  "summary": "concise 3-4 sentence impactful ATS summary highlighting strengths",
  "skills": ["Skill 1", "Skill 2", ...],
  "experience": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "location": "City, Country",
      "duration": "Month Year - Month Year or Present",
      "bullets": [
        "Action verb + task + quantifiable metric/outcome"
      ]
    }
  ],
  "education": [
    {
      "degree": "Degree and Major",
      "institution": "University / College",
      "year": "Graduation Year",
      "grade": "GPA/Percentage/Grade or empty string"
    }
  ],
  "certifications": ["Certification name", ...],
  "languages": ["English", ...],
  "missingFields": [
    {
      "field": "phone" | "location" | "headline" | "summary" | "education" | "experience" | "skills" | "targetRole",
      "label": "Human friendly label e.g. Contact Phone Number",
      "reason": "Clear 1-sentence reason why ATS and recruiters need this"
    }
  ]
}`
      },
      {
        role: 'user' as const,
        content: `Here is the candidate's raw resume text:\n\n${rawText.slice(0, 7000)}`
      }
    ];

    let parsedResult: any = null;

    try {
      const aiReply = await callGroqChat(promptMessages, {
        temperature: 0.2,
        maxTokens: 2048
      });

      // Clean backticks or markdown if present
      const cleaned = aiReply
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      parsedResult = JSON.parse(cleaned);
    } catch (aiErr: any) {
      console.warn('[CareerController] Groq AI parsing notice:', aiErr?.message);
      parsedResult = heuristicResumeParser(rawText);
    }

    // Ensure missingFields is an array and check standard rules
    if (!parsedResult.missingFields) parsedResult.missingFields = [];

    // Verify key fields
    if (!parsedResult.phone && !parsedResult.missingFields.some((m: any) => m.field === 'phone')) {
      parsedResult.missingFields.push({
        field: 'phone',
        label: 'Phone Number',
        reason: 'Recruiters and ATS systems require a contact number for phone screenings.'
      });
    }

    if (!parsedResult.location && !parsedResult.missingFields.some((m: any) => m.field === 'location')) {
      parsedResult.missingFields.push({
        field: 'location',
        label: 'Current City / Location',
        reason: 'Essential for matching regional and remote work eligibility.'
      });
    }

    if ((!parsedResult.skills || parsedResult.skills.length < 3) && !parsedResult.missingFields.some((m: any) => m.field === 'skills')) {
      parsedResult.missingFields.push({
        field: 'skills',
        label: 'Core Skills & Competencies',
        reason: 'ATS algorithms score resumes primarily on keyword match density.'
      });
    }

    if (!parsedResult.summary && !parsedResult.missingFields.some((m: any) => m.field === 'summary')) {
      parsedResult.missingFields.push({
        field: 'summary',
        label: 'Professional Summary',
        reason: 'A strong 3-sentence summary immediately communicates your value proposition.'
      });
    }

    return res.status(200).json({
      success: true,
      parsed: parsedResult,
      missingFields: parsedResult.missingFields,
      textLength: rawText.length
    });
  } catch (error: any) {
    console.error('[CareerController] Parse resume error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to parse resume.'
    });
  }
};

/**
 * Endpoint: POST /api/career/generate-ats-summary
 * Generates 3 ATS-friendly summary options based on user details
 */
export const generateAtsSummary = async (req: Request, res: Response) => {
  try {
    const { headline, targetRole, skills, experienceYears, careerBreak } = req.body;

    const messages = [
      {
        role: 'system' as const,
        content: `You are an expert career coach and ATS resume writer specializing in women's career empowerment and career relaunch.
Generate 3 distinct, high-impact, professional summaries (each 3-4 sentences long) tailored for an ATS-friendly resume.
Format output strictly as a JSON array of strings: ["Summary 1...", "Summary 2...", "Summary 3..."]
Do not wrap with markdown backticks.`
      },
      {
        role: 'user' as const,
        content: `Role/Headline: ${headline || targetRole || 'Professional'}
Target Role: ${targetRole || 'Growth Role'}
Years of Experience: ${experienceYears || '3+'}
Key Skills: ${Array.isArray(skills) ? skills.join(', ') : skills || 'Management, Communication, Strategy'}
Career Break or Returnee Context: ${careerBreak ? 'Returning to workforce after sabbatical with updated skills' : 'Active professional'}`
      }
    ];

    try {
      const response = await callGroqChat(messages, { temperature: 0.7, maxTokens: 600 });
      const cleaned = response.replace(/```json/gi, '').replace(/```/g, '').trim();
      const summaries = JSON.parse(cleaned);
      if (Array.isArray(summaries)) {
        return res.status(200).json({ success: true, summaries });
      }
    } catch (e) {
      // fallback
    }

    const title = headline || targetRole || 'Dedicated Professional';
    const fallbackSummaries = [
      `Results-driven ${title} with ${experienceYears || '3+'} years of experience delivering high-impact outcomes in fast-paced environments. Proven track record in cross-functional leadership, strategic execution, and driving organizational goals. Adept at leveraging modern methodologies to maximize efficiency and value.`,
      `Dynamic and collaborative ${title} skilled in problem-solving, stakeholder coordination, and continuous improvement. Brings a strategic mindset and hands-on expertise to solve complex challenges and elevate team productivity. Committed to driving sustainable results and organizational excellence.`,
      `Empowered and ambitious ${title} combining deep functional acumen with strong analytical capabilities. Recognized for attention to detail, proactive adaptability, and delivering measurable milestones ahead of deadlines. Seeking to bring value and innovation to growth-oriented initiatives.`
    ];

    return res.status(200).json({
      success: true,
      summaries: fallbackSummaries
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to generate ATS summary'
    });
  }
};
