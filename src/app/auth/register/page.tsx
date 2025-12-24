import Link from 'next/link';
import { RegisterForm } from './_components/register-form';
import { AnimatedPanel } from './_components/animated-panel';

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <AnimatedPanel />
                  <div className="flex flex-col items-center justify-center p-8 lg:p-12 bg-[#0D111C]">
        <RegisterForm />
        <p className="mt-8 text-sm text-center text-gray-400">
          Vous avez déjà un compte?{' '}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
