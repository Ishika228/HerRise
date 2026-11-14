import { config } from '../config/env.js';

export interface GroqChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: { type: 'json_object' };
}

/**
 * Call Groq Cloud API using native fetch
 * Supported models on this key: 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b', 'openai/gpt-oss-120b'
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

  const modelCandidates = [
    options.model || 'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'mixtral-8x7b-32768',
    'gemma2-9b-it'
  ];

  const temperature = options.temperature ?? 0.7;
  const max_tokens = options.maxTokens ?? 1024;

  let lastError: any = null;

  for (const model of modelCandidates) {
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
          max_tokens,
          ...(options.responseFormat ? { response_format: options.responseFormat } : {})
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API returned HTTP ${response.status} for ${model}: ${errorText}`);
      }

      const data: any = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        return content;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[GroqService] Model ${model} failed, trying next candidate...`);
    }
  }

  throw lastError || new Error('All Groq model candidates failed.');
}

