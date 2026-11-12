import { config } from '../config/env.js';

export interface GroqChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Call Groq Cloud API using native fetch
 * Supported models include: 'llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'
 */
export async function callGroqChat(
  messages: GroqChatMessage[],
  options: GroqChatOptions = {}
): Promise<string> {
  const apiKey = config.groqApiKey;

  if (!apiKey) {
    console.warn('[GroqService] Warning: GROQ_API_KEY is not configured in backend/.env');
    return 'GROQ_API_KEY is missing. Please set your key in backend/.env to enable live AI responses.';
  }

  const model = options.model || 'llama-3.3-70b-versatile';
  const temperature = options.temperature ?? 0.7;
  const max_tokens = options.maxTokens ?? 1024;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API returned HTTP ${response.status}: ${errorText}`);
    }

    const data: any = await response.json();
    return data.choices?.[0]?.message?.content || 'No response generated from Groq.';
  } catch (error: any) {
    console.error('[GroqService Error]:', error);
    throw error;
  }
}
