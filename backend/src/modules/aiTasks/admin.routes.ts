// src/modules/aiTasks/admin.routes.ts

import type { FastifyInstance } from 'fastify';
import { handleEnhanceDescription, handleTranslate, handleSeoSuggest } from './admin.controller';

export async function registerAiTasksAdmin(app: FastifyInstance) {
  app.post('/ai/enhance-description', handleEnhanceDescription);
  app.post('/ai/translate', handleTranslate);
  app.post('/ai/seo-suggest', handleSeoSuggest);
}
