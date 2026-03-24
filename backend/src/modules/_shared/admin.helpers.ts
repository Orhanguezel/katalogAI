import { pickUserDto } from './dto';
import { toFiniteNumber } from './parse';

type AdminUserRowLike = {
  wallet_balance?: unknown;
} & Parameters<typeof pickUserDto>[0];

export function formatAdminUserRow(u: AdminUserRowLike, role: string) {
  return {
    ...pickUserDto(u, role),
    wallet_balance: toFiniteNumber(u?.wallet_balance),
  };
}
