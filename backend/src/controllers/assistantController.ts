import { Request, Response } from 'express';
import { config } from '../config/env.js';
import { callGroqChat, GroqChatMessage } from '../services/groqService.js';
import { generateSmartAssistantResponse, detectCrossDiscipline } from '../services/aiKnowledgeEngine.js';

export const chatWithAssistant = async (req: Request, res: Response) => {
  try {
    const { query, prompt, topic = 'general', history = [], userProfile } = req.body;
    const userQuery = (query || prompt || '').trim();

    if (!userQuery) {
      return res.status(400).json({
        success: false,
        error: 'Query or prompt is required.'
      });
    }

    // -----------------------------------------------------------------------
    // CROSS-DISCIPLINE GUARD — runs BEFORE the LLM.
    // If the user is in a specific specialist tab (not 'general') and their
    // question belongs to a DIFFERENT specialist, return the referral
    // immediately without ever calling the LLM.
    // -----------------------------------------------------------------------
    const activeTopic = (topic || 'general').toLowerCase();
    if (activeTopic !== 'general') {
      const crossMatch = detectCrossDiscipline(userQuery, activeTopic);
      if (crossMatch) {
        return res.status(200).json({
          success: true,
          source: 'knowledge-engine',
          data: {
            response: crossMatch.response,
            title: crossMatch.title,
            suggestedActions: crossMatch.suggestedActions,
            topic
          }
        });
      }
    }

    // Try calling Groq LLM if API Key is configured
    if (config.groqApiKey) {
      try {
        const topicInstructions: Record<string, string> = {
          general: 'Guide the user holistically across careers, budgeting, business launch, funding, and mentorship.',
          finance: 'Act as an empathetic personal finance advisor covering 50/30/20 budgets, emergency funds, and SIPs.',
          career: 'Act as an elite career coach covering resume polishing, interview prep, career breaks, and promotions.',
          business: 'Act as a startup mentor covering business validation, pricing formulas, 55%+ gross margins, and client acquisition.',
          fund: 'Act as a government schemes & funding specialist covering Stand-Up India, Mudra loans, and investor pitch decks.',
          market: 'Act as an e-commerce strategist covering product listings, sustainable packaging, and repeat order retention.',
          learn: 'Act as an academic and technical mentor advising on courses, certifications, and technical learning roadmaps.',
          network: 'Act as a community and mentorship coordinator helping the user connect with experienced women leaders.'
        };

        const systemContent = `You are the Unified HerRise AI Assistant, an elite, empowering, empathetic, and executive copilot for women professionals, entrepreneurs, students, and career relaunchers.
Discipline Focus: ${topic.toUpperCase()} (${topicInstructions[topic] || topicInstructions.general})
User Context: ${userProfile ? `Candidate: ${userProfile.name || 'Member'}, Target Role: ${userProfile.targetRole || 'Growth Professional'}` : 'HerRise Member'}

Tone & Formatting Guidelines:
- Provide structured, practical, inspiring, and executive guidance with clean Markdown formatting (headers '### ', bolding, bullet points, numbered lists).
- If the question involves numbers (budgeting, pricing, margins), provide clear formulas and concrete examples.
- Include actionable next steps referencing HerRise tools (HerCareer, HerFinance, HerBusiness, HerFund, HerMarket, HerLearn, HerNetwork) where relevant.
- DISCIPLINE BOUNDARY & SPECIALIST REFERRAL RULE:
  The user is currently consulting with the ${topic.toUpperCase()} advisor (${topicInstructions[topic] || topicInstructions.general}).
  If topic is NOT 'general' and the user asks a question that belongs to another discipline (e.g., asking about ATS resumes, job interviews, or career breaks while in FINANCE, or asking about mutual funds/SIPs while in CAREER, or asking about government loan schemes while in FINANCE):
  1. Politely state that they have currently selected the ${topic.toUpperCase()} specialist, but their query is specifically handled by our dedicated specialist (HerCareer Coach, HerFinance Advisor, HerBusiness Strategist, HerFund Guide, or HerMarket Optimizer).
  2. Instruct them politely to switch to that specialist's tab in the Focus Discipline bar above (or open that module) to get dedicated, domain-specific tools and guidance.
  3. Do NOT provide off-topic or unsolicited advice from your own discipline. Keep the reassignment referral polite, concise, and professional.
- Under NO circumstances mention backend vendor or model names (such as Groq, Gemini, OpenAI, LPU, or internal APIs). You are HerRise AI.`;

        const messages: GroqChatMessage[] = [{ role: 'system', content: systemContent }];

        if (Array.isArray(history)) {
          history.slice(-6).forEach((h: any) => {
            const role = h.role || (h.sender === 'user' ? 'user' : 'assistant');
            const content = h.content || h.text;
            if (content && (role === 'user' || role === 'assistant')) {
              messages.push({ role, content });
            }
          });
        }

        messages.push({ role: 'user', content: userQuery });

        const groqResponse = await callGroqChat(messages, {
          temperature: 0.7,
          maxTokens: 1024
        });

        if (groqResponse && !groqResponse.includes('GROQ_API_KEY is missing')) {
          return res.status(200).json({
            success: true,
            source: 'groq-llm',
            data: {
              response: groqResponse,
              topic
            }
          });
        }
      } catch (err: any) {
        console.warn('[Assistant Groq LLM fallback]:', err?.message || err);
      }
    }

    // High-fidelity knowledge engine fallback
    const match = generateSmartAssistantResponse(userQuery, topic, userProfile);

    return res.status(200).json({
      success: true,
      source: 'knowledge-engine',
      data: {
        response: match.response,
        title: match.title,
        suggestedActions: match.suggestedActions,
        topic
      }
    });
  } catch (error: any) {
    console.error('[Assistant Controller Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while processing assistant query'
    });
  }
};
