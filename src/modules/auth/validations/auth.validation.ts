import * as z from 'zod';

export const registerSchema = z.object({
  accountType: z.enum(['personal', 'business']),
  firstName: z.string().min(1, { message: 'Le prénom est requis' }),
  lastName: z.string().min(1, { message: 'Le nom de famille est requis' }),
  email: z.string().email({ message: "L'adresse e-mail n'est pas valide" }),
  phoneNumber: z.string().min(9, { message: 'Le numéro de téléphone est requis' }),
  password: z.string()
    .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    .regex(/[A-Z]/, { message: 'Le mot de passe doit contenir au moins une majuscule' })
    .regex(/[a-z]/, { message: 'Le mot de passe doit contenir au moins une minuscule' })
    .regex(/[0-9]/, { message: 'Le mot de passe doit contenir au moins un chiffre' })
    .regex(/[^A-Za-z0-9]/, { message: 'Le mot de passe doit contenir au moins un caractère spécial' }),
  confirmPassword: z.string(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  // Enterprise fields
  socialRaison: z.string().optional(),
  activityDomain: z.string().optional(),
  contribuableNumber: z.string().optional(),
  smsESenderId: z.string().optional(),
  emailEnterprise: z.string().optional(),
  telephoneEntreprise: z.string().optional(),
  villeEntreprise: z.string().optional(),
  numeroCommerce: z.string().optional(),
  adresseEnterprise: z.string().optional(),
  enterpriseCountryId: z.string().optional(),
  urlSiteweb: z.string().optional(),
})
.superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Les mots de passe ne correspondent pas',
      path: ['confirmPassword'],
    });
  }

  // Personal accounts: country, city, address are required
  if (data.accountType === 'personal') {
    if (!data.country) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Le pays est requis', path: ['country'] });
    if (!data.city) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'La ville est requise', path: ['city'] });
    if (!data.address) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "L'adresse est requise", path: ['address'] });
  }

  // Business accounts: required enterprise fields + personal location
  if (data.accountType === 'business') {
    if (!data.country) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Le pays est requis', path: ['country'] });
    if (!data.city) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'La ville est requise', path: ['city'] });
    if (!data.address) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "L'adresse est requise", path: ['address'] });
    if (!data.activityDomain) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Le domaine d'activité est requis", path: ['activityDomain'] });
    if (!data.contribuableNumber) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Le numéro de contribuable est requis', path: ['contribuableNumber'] });
    if (!data.smsESenderId) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "L'ID de l'expéditeur SMS est requis", path: ['smsESenderId'] });
  }
});

export type RegisterFormData = z.infer<typeof registerSchema>;
