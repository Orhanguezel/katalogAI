// src/app/(main)/auth/register/page.tsx
'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { RegisterForm } from '../_components/register-form';
import { BASE_URL } from '@/integrations/api-base';

const LOGO_URL = `${BASE_URL.replace('/api', '')}/uploads/media/logo/katalogai-logo.png`;
const LOGO_DARK_URL = `${BASE_URL.replace('/api', '')}/uploads/media/logo/katalogai-logo-dark.png`;

function RegisterFormFallback() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-full rounded-md bg-white/5 animate-pulse" />
      <div className="h-10 w-full rounded-md bg-white/5 animate-pulse" />
      <div className="h-10 w-full rounded-md bg-white/5 animate-pulse" />
    </div>
  );
}

export default function Register() {
  return (
    <div className="flex min-h-dvh bg-katalog-bg-deep">
      {/* Sol — brand */}
      <div className="hidden lg:flex lg:w-2/5 items-center justify-center bg-linear-to-br from-katalog-bg-panel to-katalog-bg-deep p-12">
        <div className="flex flex-col items-center gap-8 text-center">
          <img src={LOGO_DARK_URL} alt="KatalogAI" className="h-20 w-auto object-contain" />
          <div>
            <h1 className="font-serif text-4xl font-bold text-white italic">
              Katalog<span className="text-katalog-gold">AI</span>
            </h1>
            <p className="mt-2 text-sm text-katalog-text-muted">
              Profesyonel Katalog Oluşturma Platformu
            </p>
          </div>
        </div>
      </div>

      {/* Sağ — form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-3/5">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex flex-col items-center gap-3 lg:hidden">
            <img src={LOGO_URL} alt="KatalogAI" className="h-14 w-auto object-contain" />
            <span className="font-serif text-2xl font-bold text-white italic">
              Katalog<span className="text-katalog-gold">AI</span>
            </span>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold text-white">Hesap Oluştur</h2>
            <p className="text-sm text-katalog-text-muted">
              KatalogAI hesabınızı oluşturun.
            </p>
          </div>

          <Suspense fallback={<RegisterFormFallback />}>
            <RegisterForm />
          </Suspense>

          <p className="text-center text-katalog-text-dim text-xs">
            Zaten hesabınız var mı?{' '}
            <Link href="/auth/login" className="text-katalog-gold hover:underline">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
