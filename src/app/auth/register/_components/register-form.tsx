"use client"

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@/modules/auth/validations';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { ArrowRight2 } from 'iconsax-react';
import { Step2Personal } from './step-2-personal';
import { Step3Security } from './step-3-security';
import { StepIndicator } from './step-indicator';
import { useRegister, useT } from '@/core/hooks';

type FormData = RegisterFormData;

export function RegisterForm() {
  const [step, setStep] = useState(0);
  const registerMutation = useRegister();
  const { t } = useT();
  const form = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    shouldUnregister: false,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      country: '',
      city: '',
      address: '',
    },
  });

  const steps = useMemo(() => [
    {
      id: 'Step 1',
      name: t('auth.personalInfo'),
      component: Step2Personal,
      fields: ['firstName', 'lastName', 'email', 'phoneNumber'],
    },
    {
      id: 'Step 2',
      name: t('auth.security'),
      component: Step3Security,
      fields: ['password', 'confirmPassword', 'country', 'city', 'address'],
    },
  ], [t]);

  const nextStep = async () => {
    const currentStepFields = steps[step]?.fields;
    if (!currentStepFields) return;

    const output = await form.trigger(currentStepFields as (keyof FormData)[], { shouldFocus: true });

    if (!output) return;

    if (step < steps.length - 1) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  const onSubmit = (data: FormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-xl text-foreground">
      <h2 className="text-3xl font-bold mb-2">{t('auth.createAccount')}</h2>
      <p className="text-muted-foreground mb-8">{t('auth.createAccountDesc')}</p>
      <StepIndicator currentStep={step} totalSteps={steps.length} stepNames={steps.map(s => s.name)} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            {steps.map((stepInfo, index) => (
              <div key={stepInfo.id} className={step !== index ? 'hidden' : ''}>
                {React.createElement(stepInfo.component)}
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="rounded-xl border-border hover:border-primary/40 hover:bg-primary/5 font-semibold active:scale-[0.98] transition-all duration-200"
              >
                {t('common.previous')}
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="ml-auto rounded-xl bg-primary text-white font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
              >
                {t('common.next')}
                <ArrowRight2 size="16" color="currentColor" className="ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="ml-auto rounded-xl bg-primary text-white font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('auth.creatingAccount')}
                  </span>
                ) : t('auth.createMyAccount')}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
