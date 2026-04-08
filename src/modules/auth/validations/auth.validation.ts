import * as z from 'zod';

export const registerSchema = z.object({
  accountType: z.enum(['personal', 'business']),
  firstName: z.string().trim().min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }).max(50),
  lastName: z.string().trim().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }).max(50),
  email: z.string().trim().email({ message: "L'adresse e-mail n'est pas valide" }).max(254),
  phoneNumber: z.string().trim()
    .min(9, { message: 'Le numéro de téléphone est requis' })
    .max(15)
    .regex(/^\+?\d{9,15}$/, { message: 'Format de téléphone invalide' }),
  password: z.string()
    .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    .max(128)
    .regex(/[A-Z]/, { message: 'Le mot de passe doit contenir au moins une majuscule' })
    .regex(/[a-z]/, { message: 'Le mot de passe doit contenir au moins une minuscule' })
    .regex(/[0-9]/, { message: 'Le mot de passe doit contenir au moins un chiffre' })
    .regex(/[^A-Za-z0-9]/, { message: 'Le mot de passe doit contenir au moins un caractère spécial' }),
  confirmPassword: z.string(),
  country: z.string().trim().max(100).optional(),
  city: z.string().trim().max(100).optional(),
  address: z.string().trim().max(300).optional(),
  // Enterprise fields
  socialRaison: z.string().trim().max(200).optional(),
  activityDomain: z.string().trim().max(200).optional(),
  contribuableNumber: z.string().trim().max(50).optional(),
  smsESenderId: z.string().trim().max(11).optional(),
  emailEnterprise: z.string().trim().email().max(254).optional().or(z.literal('')),
  telephoneEntreprise: z.string().trim().max(15).regex(/^\+?\d{0,15}$/, { message: 'Format invalide' }).optional().or(z.literal('')),
  villeEntreprise: z.string().trim().max(100).optional(),
  numeroCommerce: z.string().trim().max(50).optional(),
  adresseEnterprise: z.string().trim().max(300).optional(),
  enterpriseCountryId: z.string().trim().max(100).optional(),
  urlSiteweb: z.string().trim().url({ message: 'URL invalide' }).max(500).optional().or(z.literal('')),
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
