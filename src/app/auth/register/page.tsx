import Link from 'next/link';
import { RegisterForm } from './_components/register-form';
import { AnimatedPanel } from './_components/animated-panel';

export default function RegisterPage() {
  return (
    <div className="h-screen grid grid-cols-1 lg:grid-cols-2">
      <AnimatedPanel />
      <div className="flex flex-col items-center justify-start  bg-[#0D111C] overflow-y-auto">
        <div className="flex flex-col items-center justify-center  w-full h-[calc(100hv)] p-8 lg:p-12 ">
          <RegisterForm />
          <p className="mt-8 text-sm text-center text-gray-400">
            Vous avez déjà un compte?{' '}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
