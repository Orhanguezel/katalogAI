// =============================================================
// FILE: src/modules/audit/stream.routes.ts
// KatalogAI – Audit Stream Routes (SSE)
//   - ONLY route definitions
//   - Admin guards are applied at the app.ts level
// =============================================================

import type { FastifyInstance } from 'fastify';
import { handleAuditStreamSse } from './stream.controller';

export async function registerAuditStream(app: FastifyInstance) {
  app.get('/audit/stream', handleAuditStreamSse);
}
