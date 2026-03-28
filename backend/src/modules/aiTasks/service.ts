// src/modules/aiTasks/service.ts
// AI task execution service

import { groqCompletion } from './groq-client';
import {
  ENHANCE_DESCRIPTION_SYSTEM,
  TRANSLATE_SYSTEM,
  SEO_SUGGEST_SYSTEM,
  buildEnhancePrompt,
  buildTranslatePrompt,
  buildSeoPrompt,
} from './prompts';
import type { EnhanceDescriptionInput, TranslateInput, SeoSuggestInput } from './validation';

export interface SeoSuggestion {
  title: string;
  description: string;
  keywords: string[];
}

export async function serviceEnhanceDescription(input: EnhanceDescriptionInput): Promise<string> {
  const userPrompt = buildEnhancePrompt(input);
  return groqCompletion({
    systemPrompt: ENHANCE_DESCRIPTION_SYSTEM,
    userPrompt,
    maxTokens: 512,
    temperature: 0.7,
  });
}

export async function serviceTranslate(input: TranslateInput): Promise<string> {
  const userPrompt = buildTranslatePrompt(input.text, input.target_locale);
  return groqCompletion({
    systemPrompt: TRANSLATE_SYSTEM,
    userPrompt,
    maxTokens: 2048,
    temperature: 0.3,
  });
}

export async function serviceSeoSuggest(input: SeoSuggestInput): Promise<SeoSuggestion> {
  const userPrompt = buildSeoPrompt(input);
  const raw = await groqCompletion({
    systemPrompt: SEO_SUGGEST_SYSTEM,
    userPrompt,
    maxTokens: 512,
    temperature: 0.5,
  });

  try {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned) as SeoSuggestion;
  } catch {
    return { title: '', description: '', keywords: [] };
  }
}
