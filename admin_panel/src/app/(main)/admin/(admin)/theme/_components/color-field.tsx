'use client';

import { Input } from '@/components/ui/input';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import {
  COLOR_TOKEN_LABELS,
  THEME_COLOR_HEX_PLACEHOLDER,
  type ColorTokens,
} from '@/integrations/shared';

export type ColorFieldProps = {
  tokenKey: keyof ColorTokens;
  value: string;
  onChange: (key: keyof ColorTokens, val: string) => void;
};

export function ColorField({ tokenKey, value, onChange }: ColorFieldProps) {
  const t = useAdminT('admin.theme');
  const meta = COLOR_TOKEN_LABELS[tokenKey];
  const label = t(`colors.keys.${tokenKey}`) || meta.label;

  return (
    <div className="flex items-center gap-3">
      <label
        className="relative size-10 shrink-0 cursor-pointer overflow-hidden rounded-md border"
        title={label}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(tokenKey, e.target.value)}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
        <span className="block size-full rounded-md" style={{ backgroundColor: value }} />
      </label>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{label}</div>
        <Input
          value={value}
          onChange={(e) => onChange(tokenKey, e.target.value)}
          className="mt-1 h-7 font-mono text-xs"
          maxLength={7}
          placeholder={THEME_COLOR_HEX_PLACEHOLDER}
        />
      </div>
    </div>
  );
}
