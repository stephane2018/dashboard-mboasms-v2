"use client"

import Link from 'next/link';
import { RegisterForm } from './_components/register-form';
import { AnimatedPanel } from './_components/animated-panel';
import { ThemeToggle } from '@/shared/landing_components/components/ui/theme-toggle';
import { useT } from '@/core/hooks';

export default function RegisterPage() {
  const { t } = useT();

  return (
    <div className="h-screen grid grid-cols-1 lg:grid-cols-2">
      <AnimatedPanel />
      <div className="relative flex flex-col items-center justify-start bg-background overflow-y-auto">
        <div className="absolute top-6 right-6 z-10">
          <ThemeToggle />
        </div>
        <div className="flex flex-col items-center justify-center w-full min-h-screen p-8 lg:p-12">
          <RegisterForm />
          <div className="mt-8 flex flex-col items-center gap-3">
            <p className="text-sm text-center text-muted-foreground">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link href="/auth/login" className="font-semibold text-primary hover:underline transition-colors">
                {t('auth.login')}
              </Link>
            </p>
            <Link
              href="/"
              className="text-sm font-semibold text-primary hover:underline transition-colors"
            >
              {t('auth.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
