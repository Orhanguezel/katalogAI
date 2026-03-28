// src/modules/aiTasks/groq-client.ts
// Groq LLM client wrapper

import Groq from 'groq-sdk';
import { env } from '@/core/env';

let client: Groq | null = null;

function getClient(): Groq {
  if (!client) {
    if (!env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured');
    }
    client = new Groq({ apiKey: env.GROQ_API_KEY });
  }
  return client;
}

interface CompletionOpts {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
}

export async function groqCompletion(opts: CompletionOpts): Promise<string> {
  const groq = getClient();

  const response = await groq.chat.completions.create({
    model: env.GROQ_MODEL,
    messages: [
      { role: 'system', content: opts.systemPrompt },
      { role: 'user', content: opts.userPrompt },
    ],
    max_tokens: opts.maxTokens ?? 1024,
    temperature: opts.temperature ?? 0.7,
  });

  return response.choices[0]?.message?.content?.trim() ?? '';
}
