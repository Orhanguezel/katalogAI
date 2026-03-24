import type { FastifyInstance } from 'fastify';

type MysqlHealthRow = { ok: number };

export async function repoCheckHealth(app: FastifyInstance) {
  const [rows] = await app.db.query<MysqlHealthRow[]>('SELECT 1 AS ok');
  const dbOk = rows?.[0]?.ok === 1;
  const redisReply = app.redis ? await app.redis.ping().catch(() => 'FAIL') : 'SKIP';
  const redisOk = redisReply === 'PONG';

  return {
    status: dbOk && (app.redis ? redisOk : true) ? 'ok' : 'error',
    db: dbOk ? 'ok' : 'error',
    redis: app.redis ? (redisOk ? 'ok' : 'error') : 'disabled',
    uptime: process.uptime(),
  };
}
