'use client';

type AssistInput = {
  title?: string;
  summary?: string;
  content?: string;
  tags?: string;
  locale?: string;
  target_locales?: string[];
  module_key?: string;
  action?: string;
};

type AssistResultItem = {
  locale: string;
  title?: string;
  slug?: string;
  summary?: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
};

export function useAIContentAssist() {
  return {
    loading: false,
    assist: async (_input: AssistInput): Promise<AssistResultItem[] | null> => null,
  };
}

