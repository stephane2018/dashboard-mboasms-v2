import * as z from 'zod';

export const registerSchema = z.object({
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
  country: z.string().trim().min(1, { message: 'Le pays est requis' }).max(100),
  city: z.string().trim().min(1, { message: 'La ville est requise' }).max(100),
  address: z.string().trim().min(1, { message: "L'adresse est requise" }).max(300),
  socialRaison: z.string().trim().min(1, { message: 'La raison sociale est requise' }).max(200),
  activityDomain: z.string().trim().min(1, { message: "Le domaine d'activité est requis" }).max(200),
  contribuableNumber: z.string().trim().min(1, { message: 'Le numéro de contribuable est requis' }).max(50),
  smsESenderId: z.string().trim().min(1, { message: "L'ID de l'expéditeur SMS est requis" }).max(11),
  emailEnterprise: z.string().trim().email({ message: "L'e-mail entreprise n'est pas valide" }).max(254),
  telephoneEntreprise: z.string().trim()
    .min(9, { message: "Le téléphone de l'entreprise est requis" })
    .max(15)
    .regex(/^\+?\d{9,15}$/, { message: 'Format invalide' }),
  villeEntreprise: z.string().trim().min(1, { message: "La ville de l'entreprise est requise" }).max(100),
  numeroCommerce: z.string().trim().min(1, { message: 'Le numéro de commerce est requis' }).max(50),
  adresseEnterprise: z.string().trim().min(1, { message: "L'adresse de l'entreprise est requise" }).max(300),
  enterpriseCountryId: z.string().trim().min(1, { message: "Le pays de l'entreprise est requis" }).max(100),
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
});

export type RegisterFormData = z.infer<typeof registerSchema>;
