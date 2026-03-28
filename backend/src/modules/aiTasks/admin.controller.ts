// src/modules/aiTasks/admin.controller.ts

import type { FastifyReply, FastifyRequest } from 'fastify';
import { handleRouteError } from '@/modules/_shared';
import { enhanceDescriptionSchema, translateSchema, seoSuggestSchema } from './validation';
import { serviceEnhanceDescription, serviceTranslate, serviceSeoSuggest } from './service';

/**
 * POST /ai/enhance-description
 */
export async function handleEnhanceDescription(req: FastifyRequest, reply: FastifyReply) {
  try {
    const input = enhanceDescriptionSchema.parse(req.body);
    const result = await serviceEnhanceDescription(input);
    return reply.status(200).send({ result });
  } catch (e) {
    return handleRouteError(reply, req, e, 'ai_enhance_description');
  }
}

/**
 * POST /ai/translate
 */
export async function handleTranslate(req: FastifyRequest, reply: FastifyReply) {
  try {
    const input = translateSchema.parse(req.body);
    const result = await serviceTranslate(input);
    return reply.status(200).send({ result });
  } catch (e) {
    return handleRouteError(reply, req, e, 'ai_translate');
  }
}

/**
 * POST /ai/seo-suggest
 */
export async function handleSeoSuggest(req: FastifyRequest, reply: FastifyReply) {
  try {
    const input = seoSuggestSchema.parse(req.body);
    const result = await serviceSeoSuggest(input);
    return reply.status(200).send({ result });
  } catch (e) {
    return handleRouteError(reply, req, e, 'ai_seo_suggest');
  }
}
