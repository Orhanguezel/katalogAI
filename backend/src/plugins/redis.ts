import fp from 'fastify-plugin';
import fastifyRedis from '@fastify/redis';
import type { Redis } from 'ioredis';
import { env } from '@/core/env';

let redisClient: Redis | null = null;

export function getRedisClient() {
  return redisClient;
}

export default fp(async (app) => {
  await app.register(fastifyRedis, {
    url: env.REDIS_URL || undefined,
    host: env.REDIS_URL ? undefined : env.REDIS_HOST,
    port: env.REDIS_URL ? undefined : env.REDIS_PORT,
    password: env.REDIS_PASSWORD || undefined,
    closeClient: true,
  });

  if (!app.redis) {
    app.log.error('Redis plugin did not initialize');
    throw new Error('Redis not initialized');
  }

  redisClient = app.redis;
  
  try {
    const pong = await app.redis.ping().catch(() => 'FAIL');
    app.log.info({ redisOk: pong === 'PONG' }, 'Redis connection check');
  } catch (e) {
    app.log.error('Redis ping failed, but continuing...');
  }

  app.addHook('onClose', async () => {
    redisClient = null;
  });
});
