"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@/modules/auth/validations';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { Step1AccountType } from './step-1-account-type';
import { Step2Personal } from './step-2-personal';
import { Step3Security } from './step-3-security';
import { Step4Enterprise } from './step-4-enterprise';
import { Step5SmsConfig } from './step-5-sms-config';
import { StepIndicator } from './step-indicator';
import { useRegister } from '@/core/hooks';

type FormData = RegisterFormData;

export function RegisterForm() {
  const [step, setStep] = useState(0);
  const registerMutation = useRegister();
  const form = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    shouldUnregister: false,
    defaultValues: {
      accountType: 'personal',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      socialRaison: '',
      activityDomain: '',
      contribuableNumber: '',
      emailEnterprise: '',
      telephoneEntreprise: '',
      smsESenderId: '',
      numeroCommerce: '',
      adresseEnterprise: '',
      villeEntreprise: '',
      enterpriseCountryId: '',
    },
  });

  const { isValid } = form.formState;
  const accountType = form.watch('accountType');

  const allSteps = useMemo(() => [
    {
      id: 'Step 1',
      name: 'Type de compte',
      component: Step1AccountType,
      fields: ['accountType'],
      showFor: ['personal', 'business']
    },
    {
      id: 'Step 2',
      name: 'Informations personnelles',
      component: Step2Personal,
      fields: ['firstName', 'lastName', 'email'],
      showFor: ['personal', 'business']
    },
    {
      id: 'Step 3',
      name: 'Sécurité',
      component: Step3Security,
      fields: ['phoneNumber', 'password', 'confirmPassword'],
      showFor: ['personal', 'business']
    },
    {
      id: 'Step 4',
      name: 'Entreprise',
      component: Step4Enterprise,
      fields: ['socialRaison', 'activityDomain', 'contribuableNumber', 'emailEnterprise', 'telephoneEntreprise'],
      showFor: ['business']
    },
    {
      id: 'Step 5',
      name: 'Configuration SMS',
      component: Step5SmsConfig,
      fields: ['smsESenderId', 'numeroCommerce', 'adresseEnterprise', 'villeEntreprise', 'enterpriseCountryId'],
      showFor: ['business']
    },
  ], []);

  const steps = useMemo(() =>
    allSteps.filter(s => s.showFor.includes(accountType)),
    [allSteps, accountType]
  );

  // Reset step if current step exceeds available steps after account type change
  useEffect(() => {
    if (step >= steps.length) {
      setStep(steps.length - 1);
    }
  }, [step, steps.length]);

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
    <div className="w-full max-w-xl text-white">
      <h2 className="text-3xl font-bold mb-2 text-white">Créez votre compte</h2>
      <p className="text-gray-400 mb-8">Remplissez les informations ci-dessous pour commencer</p>
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
                className="bg-transparent border-gray-600 hover:bg-gray-700"
              >
                Précédent
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="ml-auto bg-primary hover:bg-primary/90"
              >
                Suivant
              </Button>
            ) : (
              <Button
                type="submit"
                className="ml-auto bg-primary hover:bg-primary/90"
                disabled={!isValid || registerMutation.isPending}
              >
                {registerMutation.isPending ? 'Soumission...' : 'Soumettre'}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
