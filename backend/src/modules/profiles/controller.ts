import type { FastifyReply, FastifyRequest } from 'fastify';
import { handleRouteError } from '../_shared';
import { repoGetProfileById, repoUpsertProfile } from './repository';
import type { NewProfile } from './schema';

export async function getMyProfile(req: FastifyRequest, reply: FastifyReply) {
  const user = (req as any).user as { id?: string; sub?: string; email?: string } | undefined;
  const userId = user?.id || user?.sub;
  if (!userId) {
    return reply.status(401).send({ error: { message: 'unauthorized' } });
  }

  try {
    let profile = await repoGetProfileById(userId);
    
    if (!profile) {
      profile = await repoUpsertProfile(userId, {
        full_name: '',
        phone: '',
        avatar_url: '',
      });
    }

    return reply.send(profile);
  } catch (error) {
    return handleRouteError(reply, req, error, 'get_my_profile');
  }
}

export async function updateMyProfile(req: FastifyRequest, reply: FastifyReply) {
  const user = (req as any).user as { id?: string; sub?: string } | undefined;
  const userId = user?.id || user?.sub;
  if (!userId) {
    return reply.status(401).send({ error: { message: 'unauthorized' } });
  }

  try {
    const body = (req.body || {}) as { profile?: Partial<NewProfile> };
    const data = body.profile || (req.body as Partial<NewProfile>);

    const profile = await repoUpsertProfile(userId, data);
    return reply.send(profile);
  } catch (error) {
    return handleRouteError(reply, req, error, 'update_my_profile');
  }
}
