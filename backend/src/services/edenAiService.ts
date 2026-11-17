import { config } from '../config/env.js';

export interface EdenAIParsedResume {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  summary: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    location: string;
    duration: string;
    highlights: string[];
  }>;
  projects: Array<{
    title: string;
    technologies: string[];
    role: string;
    link: string;
    description: string;
    highlights: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    grade: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
  achievements: string[];
  qualityScore: number;
}

/**
 * Call Eden AI Resume Parser API (POST https://api.edenai.run/v2/ocr/resume_parser)
 * Uses the key configured in .env: EDENAI_API_KEY
 */
export async function parseResumeWithEdenAI(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<{ success: boolean; parsed?: EdenAIParsedResume; rawText?: string; provider?: string; error?: string }> {
  const apiKey = config.edenAiApiKey;
  if (!apiKey) {
    return { success: false, error: 'Eden AI API key is not configured' };
  }

  const providers = ['affinda', 'hireability', 'extracta', 'klippa'];

  for (const provider of providers) {
    try {
      const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      const safeName = fileName || 'resume.pdf';
      const safeMime = mimeType || 'application/pdf';

      const pre = Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="providers"\r\n\r\n${provider}\r\n` +
        `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${safeName}"\r\nContent-Type: ${safeMime}\r\n\r\n`
      );
      const post = Buffer.from(`\r\n--${boundary}--\r\n`);
      const body = Buffer.concat([pre, fileBuffer, post]);

      const response = await fetch('https://api.edenai.run/v2/ocr/resume_parser', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': `multipart/form-data; boundary=${boundary}`
        },
        body
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[EdenAI] Provider ${provider} returned HTTP ${response.status}:`, errText.slice(0, 160));
        continue;
      }

      const json: any = await response.json();
      const provData = json[provider];
      if (!provData || provData.status === 'fail' || !provData.extracted_data) {
        console.warn(`[EdenAI] Provider ${provider} did not return extracted data.`);
        continue;
      }

      const extracted = provData.extracted_data;
      const personal = extracted.personal_infos || {};

      // Name extraction
      const nameObj = personal.name || {};
      const fullName = (
        nameObj.raw_name ||
        `${nameObj.first_name || ''} ${nameObj.last_name || ''}`
      ).trim() || 'Extracted Candidate';

      const email = personal.mails?.[0] || '';
      const phone = personal.phones?.[0] || '';
      const location = personal.address?.formatted_location || personal.address?.city || '';

      // Skills extraction
      const skills: string[] = (extracted.skills || [])
        .map((s: any) => (typeof s === 'string' ? s : s.name))
        .filter(Boolean);

      // Work Experience extraction
      const experience = (extracted.work_experience?.entries || []).map((exp: any) => ({
        title: exp.title || 'Specialist',
        company: exp.company || 'Enterprise Organization',
        location: exp.location?.formatted_location || '',
        duration: exp.start_date && exp.end_date
          ? `${exp.start_date} – ${exp.end_date}`
          : exp.start_date || 'Previous',
        highlights: exp.description ? [exp.description] : []
      }));

      // Education extraction
      const education = (extracted.education?.entries || []).map((edu: any) => ({
        degree: edu.title || edu.degree || 'Degree Qualification',
        institution: edu.establishment || 'University / Institution',
        year: edu.end_date || edu.start_date || '',
        grade: edu.gpa || ''
      }));

      // Certifications extraction
      const certifications = (extracted.certifications || []).map((cert: any) => ({
        name: typeof cert === 'string' ? cert : cert.name || 'Professional Certification',
        issuer: cert.organization || 'Accredited Authority',
        year: cert.year || ''
      }));

      const parsed: EdenAIParsedResume = {
        fullName,
        email,
        phone,
        location,
        headline: personal.current_profession || experience[0]?.title || 'Professional Specialist',
        summary: extracted.objective || personal.summary || '',
        skills: skills.length > 0 ? skills : ['Strategic Execution', 'Communication', 'Problem Solving'],
        experience,
        projects: [],
        education,
        certifications,
        achievements: [],
        qualityScore: Math.min(95, Math.max(70, 70 + skills.length * 2))
      };

      console.log(`[EdenAI] Successfully parsed resume for "${fullName}" using provider: ${provider}`);
      return {
        success: true,
        parsed,
        provider,
        rawText: extracted.raw_text || ''
      };
    } catch (err: any) {
      console.warn(`[EdenAI] Provider ${provider} exception:`, err?.message);
    }
  }

  return { success: false, error: 'All Eden AI resume parser providers failed or credit exhausted' };
}

/**
 * Call Eden AI text/chat for detailed resume evaluation if credits allow
 */
export async function analyzeResumeWithEdenAI(
  resumeText: string,
  targetJobDescription?: string
): Promise<any | null> {
  const apiKey = config.edenAiApiKey;
  if (!apiKey) return null;

  try {
    const prompt = `You are a Senior Technical Talent Director and AI Resume Evaluator.
Analyze this resume text thoroughly. Provide an estimated quality assessment score (0 to 100), detailed category breakdown, identified strengths, actionable improvements, missing high-impact keywords, and improved bullet points.

Resume Content:
${resumeText.slice(0, 3500)}

Target Job Description:
${(targetJobDescription || 'Standard Industry Professional').slice(0, 800)}

Return ONLY valid JSON matching this schema:
{
  "overallScore": number (e.g. 85),
  "summaryRating": "Strong" | "Good" | "Needs Improvement",
  "categoryScores": {
    "impactAndMetrics": number (0-100),
    "skillsAlignment": number (0-100),
    "formattingAndClarity": number (0-100),
    "experienceDepth": number (0-100)
  },
  "strengths": ["string", "string", "string"],
  "improvements": ["string", "string", "string"],
  "missingKeywords": ["string", "string", "string"],
  "improvedSampleBullets": [
    {
      "original": "string",
      "improved": "string"
    }
  ]
}`;

    const response = await fetch('https://api.edenai.run/v2/text/chat', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        providers: 'openai',
        text: prompt,
        temperature: 0.2
      })
    });

    if (response.ok) {
      const data: any = await response.json();
      const content = data.openai?.generated_text || data.openai?.message?.[0]?.content;
      if (content) {
        const clean = content.replace(/```json|```/g, '').trim();
        return JSON.parse(clean);
      }
    }
  } catch (err: any) {
    console.warn('[EdenAI Text Analysis]:', err?.message);
  }

  return null;
}
