import { RegisterForm } from './_components/register-form';
import { AnimatedPanel } from './_components/animated-panel';

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <AnimatedPanel />
            <div className="flex items-center justify-center p-8 lg:p-12 bg-[#0D111C]">
        <RegisterForm />
      </div>
    </div>
  );
}
