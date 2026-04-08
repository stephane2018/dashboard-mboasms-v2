"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@/modules/auth/validations';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { ArrowRight2 } from 'iconsax-react';
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
      country: '',
      city: '',
      address: '',
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
      urlSiteweb: '',
    },
  });

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
      fields: ['firstName', 'lastName', 'email', 'phoneNumber'],
      showFor: ['personal', 'business']
    },
    {
      id: 'Step 3',
      name: 'Sécurité & Localisation',
      component: Step3Security,
      fields: ['password', 'confirmPassword', 'country', 'city', 'address'],
      showFor: ['personal', 'business']
    },
    {
      id: 'Step 4',
      name: 'Informations entreprise',
      component: Step4Enterprise,
      fields: ['socialRaison', 'activityDomain', 'contribuableNumber', 'smsESenderId'],
      showFor: ['business']
    },
    {
      id: 'Step 5',
      name: 'Détails entreprise',
      component: Step5SmsConfig,
      fields: ['emailEnterprise', 'telephoneEntreprise', 'numeroCommerce', 'adresseEnterprise', 'villeEntreprise', 'urlSiteweb', 'enterpriseCountryId'],
      showFor: ['business']
    },
  ], []);

  const steps = useMemo(() =>
    allSteps.filter(s => s.showFor.includes(accountType)),
    [allSteps, accountType]
  );

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
    if (data.accountType !== 'business') {
      data.socialRaison = data.socialRaison?.trim() || 'RAS';
      data.adresseEnterprise = data.adresseEnterprise?.trim() || 'RAS';
      data.contribuableNumber = data.contribuableNumber?.trim() || 'RAS';
      data.emailEnterprise = data.emailEnterprise?.trim() || 'RAS';
      data.enterpriseCountryId = data.enterpriseCountryId?.trim() || 'RAS';
      data.numeroCommerce = data.numeroCommerce?.trim() || 'RAS';
      data.smsESenderId = data.smsESenderId?.trim() || 'RAS';
      data.telephoneEntreprise = data.telephoneEntreprise?.trim() || 'RAS';
      data.urlSiteweb = data.urlSiteweb?.trim() || 'RAS';
      data.villeEntreprise = data.villeEntreprise?.trim() || 'RAS';
      data.activityDomain = data.activityDomain?.trim() || 'RAS';
    }
    registerMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-xl text-foreground">
      <h2 className="text-3xl font-bold mb-2">Créez votre compte</h2>
      <p className="text-muted-foreground mb-8">Remplissez les informations ci-dessous pour commencer</p>
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
                Précédent
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="ml-auto rounded-xl bg-primary text-white font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
              >
                Suivant
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
                    Création en cours...
                  </span>
                ) : 'Créer mon compte'}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
