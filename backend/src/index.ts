// src/index.ts
import { createApp } from './app';
import { env } from '@/core/env';
import type { FastifyInstance } from 'fastify';

function checkSecurityDefaults() {
  const isProd = env.NODE_ENV === 'production';
  if (isProd && env.JWT_SECRET === 'change-me') {
    console.error('[GUVENLIK] JWT_SECRET varsayilan deger! Production icin degistirin.');
    process.exit(1);
  }
  if (isProd && env.COOKIE_SECRET === 'cookie-secret') {
    console.warn('[GUVENLIK] COOKIE_SECRET varsayilan deger — degistirmeniz onerilir.');
  }
  if (isProd && !env.CORS_ORIGIN.length) {
    console.warn('[GUVENLIK] CORS_ORIGIN tanimlanmamis — tum origin\'ler reddedilecek.');
  }
}

async function main() {
  checkSecurityDefaults();
  const app: FastifyInstance = await createApp();
  await app.listen({ port: env.PORT, host: '0.0.0.0' });
  console.log(`API listening :${env.PORT} [${env.NODE_ENV}]`);
}

main().catch((e) => {
  console.error('Server failed', e);
  process.exit(1);
});
