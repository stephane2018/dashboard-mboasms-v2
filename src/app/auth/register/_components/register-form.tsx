"use client"

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@/modules/auth/validations';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { Step1Personal } from './step-1-personal';
import { Step2Enterprise } from './step-2-enterprise';
import { Step3SmsConfig } from './step-3-sms-config';
import { StepIndicator } from './step-indicator';
import { useRegister } from '@/modules/auth/hooks';

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
      enterpriseCountryId: 'CM',
    },
  });

  const accountType = form.watch('accountType');
  const { isValid } = form.formState;

  const allSteps = useMemo(() => [
    { id: 'Step 1', name: 'Personal Information', component: Step1Personal, fields: ['accountType', 'firstName', 'lastName', 'email', 'phoneNumber', 'password', 'confirmPassword'] },
    { id: 'Step 2', name: 'Enterprise Information', component: Step2Enterprise, fields: ['socialRaison', 'activityDomain', 'contribuableNumber', 'emailEnterprise', 'telephoneEntreprise'] },
    { id: 'Step 3', name: 'SMS Configuration', component: Step3SmsConfig, fields: ['smsESenderId', 'numeroCommerce', 'adresseEnterprise', 'villeEntreprise', 'enterpriseCountryId'] },
  ], []);

  const steps = allSteps;

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
    <div className="w-full max-w-xl p-8 text-white">
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
            {step > 0 && <Button type="button" variant="outline" onClick={prevStep} className="bg-transparent border-gray-600 hover:bg-gray-700">Précédent</Button>}
            {step < steps.length - 1 ? (
              <Button type="button" onClick={nextStep} className="ml-auto bg-primary hover:bg-primary/90">Suivant</Button>
            ) : (
                            <Button type="submit" className="ml-auto bg-primary hover:bg-primary/90" disabled={!isValid || registerMutation.isPending}>
                {registerMutation.isPending ? 'Soumission...' : 'Soumettre'}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
