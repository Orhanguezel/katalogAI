// src/modules/profiles/router.ts
import type { FastifyInstance } from 'fastify';
import { authSecurity, okResponseSchema } from '@/modules/_shared';
import { getMyProfile, updateMyProfile } from './controller';

export async function registerProfiles(app: FastifyInstance) {
  const prefix = '/profiles';

  app.get(`${prefix}/me`, {
    config: { auth: true },
    schema: {
      tags: ['profiles'],
      summary: 'Mevcut profil bilgilerini getir',
      security: authSecurity,
      response: { 200: okResponseSchema },
    },
  }, getMyProfile);

  app.put(`${prefix}/me`, {
    config: { auth: true },
    schema: {
      tags: ['profiles'],
      summary: 'Profil bilgilerini guncelle',
      security: authSecurity,
      response: { 200: okResponseSchema },
    },
  }, updateMyProfile);
}
