"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { Step1Personal } from './step-1-personal';
import { Step2Enterprise } from './step-2-enterprise';
import { Step3SmsConfig } from './step-3-sms-config';

const schema = z.object({
  accountType: z.enum(['personal', 'business']),
  firstName: z.string().min(1, { message: 'validation.firstNameRequired' }),
  lastName: z.string().min(1, { message: 'validation.lastNameRequired' }),
  socialRaison: z.string().min(1, { message: 'validation.socialRaisonRequired' }),
  activityDomain: z.string().min(1, { message: 'validation.activityDomainRequired' }),
  contribuableNumber: z.string().min(1, { message: 'validation.contribuableNumberRequired' }),
  email: z.string().email({ message: 'validation.emailInvalid' }),
  emailEnterprise: z.string().email({ message: 'validation.emailEnterpriseInvalid' }),
  phoneNumber: z.string().min(9, { message: 'validation.phoneNumberRequired' }),
  telephoneEntreprise: z.string().min(9, { message: 'validation.telephoneEntrepriseRequired' }),
  country: z.string().min(1, { message: 'validation.countryRequired' }),
  city: z.string().min(1, { message: 'validation.cityRequired' }),
  address: z.string().min(1, { message: 'validation.addressRequired' }),
  smsESenderId: z.string().min(1, { message: 'validation.smsESenderIdRequired' }).max(11, { message: 'validation.smsESenderIdMax' }),
  password: z.string()
    .min(8, { message: 'passwordValidation.minLength' })
    .regex(/[A-Z]/, { message: 'passwordValidation.hasUppercase' })
    .regex(/[a-z]/, { message: 'passwordValidation.hasLowercase' })
    .regex(/[0-9]/, { message: 'passwordValidation.hasNumber' })
    .regex(/[^A-Za-z0-9]/, { message: 'passwordValidation.hasSpecial' }),
  villeEntreprise: z.string().min(1, { message: 'validation.villeEntrepriseRequired' }),
  numeroCommerce: z.string().min(1, { message: 'validation.numeroCommerceRequired' }),
  adresseEnterprise: z.string().min(1, { message: 'validation.adresseEnterpriseRequired' }),
  enterpriseCountryId: z.string().min(1, { message: 'validation.enterpriseCountryRequired' }),
  urlImage: z.string().optional(),
  urlSiteweb: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
    const [step, setStep] = useState(0);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const steps = [
        { id: 'Step 1', name: 'Personal Information', fields: ['accountType', 'firstName', 'lastName', 'email', 'phoneNumber', 'password'] },
    { id: 'Step 2', name: 'Enterprise Information', fields: ['socialRaison', 'activityDomain', 'contribuableNumber', 'emailEnterprise', 'telephoneEntreprise'] },
    { id: 'Step 3', name: 'SMS Configuration', fields: ['smsESenderId', 'numeroCommerce', 'adresseEnterprise', 'villeEntreprise', 'enterpriseCountryId'] },
  ];

  const nextStep = async () => {
    const fields = steps[step].fields;
    const output = await form.trigger(fields as any, { shouldFocus: true });

    if (!output) return;

    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Handle form submission
  };

  return (
            <div className="w-full max-w-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-2 text-white">Bon retour sur MboaSMS</h2>
      <p className="text-gray-400 mb-8">Connectez-vous pour continuer</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 0 && <Step1Personal />}
          {step === 1 && <Step2Enterprise />}
          {step === 2 && <Step3SmsConfig />}

          <div className="flex justify-between pt-4">
            {step > 0 &&             <Button type="button" variant="outline" onClick={prevStep} className="bg-transparent border-gray-600 hover:bg-gray-700">Previous</Button>}
            {step < steps.length - 1 ? (
                            <Button type="button" onClick={nextStep} className="ml-auto bg-primary hover:bg-primary/90">Next</Button>
            ) : (
                            <Button type="submit" className="ml-auto bg-primary hover:bg-primary/90">Submit</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
