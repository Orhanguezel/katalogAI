import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { profiles, type Profile, type NewProfile } from './schema';

export async function repoGetProfileById(id: string): Promise<Profile | null> {
  const [profile] = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
  return profile || null;
}

export async function repoUpsertProfile(id: string, data: Partial<NewProfile>): Promise<Profile> {
  const existing = await repoGetProfileById(id);

  if (existing) {
    await db.update(profiles).set({ ...data, updated_at: new Date() }).where(eq(profiles.id, id));
  } else {
    await db.insert(profiles).values({
      id,
      full_name: data.full_name || '',
      phone: data.phone || '',
      avatar_url: data.avatar_url || '',
      bio: data.bio || '',
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  const updated = await repoGetProfileById(id);
  if (!updated) throw new Error('Profile could not be retrieved after upsert');
  return updated;
}
