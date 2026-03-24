import type { WalletStatus, WalletTxStatus } from '@/integrations/shared/wallet-types';
import type { WalletTxType } from '@/integrations/shared/wallet-types';

export type WalletTransactionsProps = {
  walletId: string;
};

export const ADMIN_WALLET_LIST_PAGE_SIZE = 20;
export const ADMIN_WALLET_TRANSACTIONS_PAGE_SIZE = 20;

export function formatAdminWalletAmount(amount: string, currency = 'TRY') {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(
    parseFloat(amount) || 0,
  );
}

export function formatAdminWalletDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const ADMIN_WALLET_STATUS_BADGE_CLASS: Record<WalletStatus, string> = {
  active: 'bg-green-100 text-green-800',
  suspended: 'bg-yellow-100 text-yellow-800',
  closed: 'bg-red-100 text-red-800',
};

export const ADMIN_WALLET_TX_STATUS_BADGE_CLASS: Record<WalletTxStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-blue-100 text-blue-800',
};

export const ADMIN_WALLET_TX_TYPE_BADGE_CLASS: Record<WalletTxType, string> = {
  credit: 'bg-green-100 text-green-700',
  debit: 'bg-red-100 text-red-700',
};

export const ADMIN_WALLET_TX_AMOUNT_CLASS: Record<WalletTxType, string> = {
  credit: 'text-green-600',
  debit: 'text-red-600',
};

export function getAdminWalletSignedAmountPrefix(type: WalletTxType) {
  return type === 'credit' ? '+' : '-';
}
