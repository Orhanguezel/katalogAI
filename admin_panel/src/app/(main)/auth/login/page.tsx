// src/app/(main)/auth/login/page.tsx
'use client';

import { Suspense } from 'react';
import { LoginForm } from '../_components/login-form';

function LoginFormFallback() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-full rounded-md bg-white/5 animate-pulse" />
      <div className="h-10 w-full rounded-md bg-white/5 animate-pulse" />
      <div className="h-10 w-full rounded-md bg-white/5 animate-pulse" />
    </div>
  );
}

export default function Login() {
  return (
    <div className="flex min-h-dvh bg-katalog-bg-deep">
      {/* Sol — brand */}
      <div className="hidden lg:flex lg:w-2/5 items-center justify-center bg-linear-to-br from-katalog-bg-panel to-katalog-bg-deep p-12">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-katalog-gold text-3xl font-bold text-katalog-bg-deep shadow-2xl shadow-katalog-gold/30">
            K
          </div>
          <div>
            <h1 className="font-serif text-4xl font-bold text-white italic">
              Katalog<span className="text-katalog-gold">AI</span>
            </h1>
            <p className="mt-2 text-sm text-katalog-text-muted">
              Profesyonel Katalog Oluşturma Platformu
            </p>
          </div>
          <div className="w-12 h-0.5 bg-katalog-gold/30" />
          <p className="text-xs text-katalog-text-dim max-w-xs leading-relaxed">
            Farklı veritabanlarından ürün çekerek profesyonel kataloglar oluşturun, düzenleyin ve paylaşın.
          </p>
        </div>
      </div>

      {/* Sağ — form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-3/5">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobil logo */}
          <div className="flex flex-col items-center gap-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-katalog-gold text-xl font-bold text-katalog-bg-deep">
              K
            </div>
            <span className="font-serif text-2xl font-bold text-white italic">
              Katalog<span className="text-katalog-gold">AI</span>
            </span>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold text-white">Giriş Yap</h2>
            <p className="text-sm text-katalog-text-muted">
              Hesabınıza giriş yaparak devam edin.
            </p>
          </div>

          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>

          <p className="text-center text-katalog-text-dim text-[10px]">
            © {new Date().getFullYear()} KatalogAI. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  );
}
