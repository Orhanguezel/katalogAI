import type { FastifyInstance } from 'fastify';
import { authSecurity, fromZodSchema, okResponseSchema } from '@/modules/_shared';
import {
  passwordResetConfirmBody,
  passwordResetRequestBody,
  signupBody,
  tokenBody,
  updateBody,
} from './validation';
import { signup, token, refresh, passwordResetRequest, passwordResetConfirm, me, status, update, logout } from './controller';

export async function registerAuth(app: FastifyInstance) {
  const B = '/auth';
  const signupSchema = fromZodSchema(signupBody, 'AuthSignupBody');
  const tokenSchema = fromZodSchema(tokenBody, 'AuthTokenBody');
  const updateSchema = fromZodSchema(updateBody, 'AuthUpdateBody');
  const resetRequestSchema = fromZodSchema(passwordResetRequestBody, 'AuthPasswordResetRequestBody');
  const resetConfirmSchema = fromZodSchema(passwordResetConfirmBody, 'AuthPasswordResetConfirmBody');

  app.post(`${B}/signup`, {
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], summary: 'Yeni kullanici kaydi', body: signupSchema, response: { 200: okResponseSchema } },
  }, signup);
  app.post(`${B}/register`, {
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], summary: 'Yeni kullanici kaydi (alias)', body: signupSchema, response: { 200: okResponseSchema } },
  }, signup);
  app.post(`${B}/token`, {
    config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], summary: 'Email ve parola ile giris', body: tokenSchema, response: { 200: okResponseSchema } },
  }, token);
  app.post(`${B}/login`, {
    config: { rateLimit: { max: 30, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], summary: 'Email ve parola ile giris (alias)', body: tokenSchema, response: { 200: okResponseSchema } },
  }, token);
  app.post(`${B}/token/refresh`, {
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], summary: 'Refresh token yenile', response: { 200: okResponseSchema } },
  }, refresh);
  app.post(`${B}/password-reset/request`, {
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], summary: 'Sifre sifirlama baglantisi iste', body: resetRequestSchema, response: { 200: okResponseSchema } },
  }, passwordResetRequest);
  app.post(`${B}/password-reset/confirm`, {
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
    schema: { tags: ['auth'], summary: 'Sifre sifirlama tamamla', body: resetConfirmSchema, response: { 200: okResponseSchema } },
  }, passwordResetConfirm);

  app.get(`${B}/user`, {
    schema: { tags: ['auth'], summary: 'Mevcut kullanici bilgisi', security: authSecurity, response: { 200: okResponseSchema } },
  }, me);
  app.get(`${B}/status`, {
    schema: { tags: ['auth'], summary: 'Auth durumu', response: { 200: okResponseSchema } },
  }, status);
  app.put(`${B}/user`, {
    schema: { tags: ['auth'], summary: 'Kullanici bilgisi guncelle', security: authSecurity, body: updateSchema, response: { 200: okResponseSchema } },
  }, update);
  app.post(`${B}/logout`, {
    schema: { tags: ['auth'], summary: 'Oturumu kapat', security: authSecurity, response: { 200: okResponseSchema } },
  }, logout);
}
