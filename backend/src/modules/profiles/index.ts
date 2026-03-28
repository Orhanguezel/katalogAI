// src/modules/profiles/index.ts
// Minimal profiles schema — used by auth module

export { profiles } from './schema';
export type { Profile, NewProfile } from './schema';
export { registerProfiles } from './router';
