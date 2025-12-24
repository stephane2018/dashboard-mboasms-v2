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
  socialRaison: z.string().optional(),
  activityDomain: z.string().optional(),
  contribuableNumber: z.string().optional(),
  emailEnterprise: z.string().email().optional(),
  telephoneEntreprise: z.string().optional(),
  smsESenderId: z.string().optional(),
  villeEntreprise: z.string().optional(),
  numeroCommerce: z.string().optional(),
  adresseEnterprise: z.string().optional(),
  enterpriseCountryId: z.string().optional(),
})
.superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Les mots de passe ne correspondent pas',
      path: ['confirmPassword'],
    });
  }

  if (data.accountType === 'business') {
    if (!data.socialRaison) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'La raison sociale est requise', path: ['socialRaison'] });
    if (!data.activityDomain) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Le domaine d'activité est requis", path: ['activityDomain'] });
    if (!data.contribuableNumber) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Le numéro de contribuable est requis', path: ['contribuableNumber'] });
    if (!data.emailEnterprise) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "L'e-mail de l'entreprise est requis", path: ['emailEnterprise'] });
    if (!data.telephoneEntreprise) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Le téléphone de l'entreprise est requis", path: ['telephoneEntreprise'] });
    if (!data.smsESenderId) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "L'ID de l'expéditeur SMS est requis", path: ['smsESenderId'] });
    if (!data.villeEntreprise) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La ville de l'entreprise est requise", path: ['villeEntreprise'] });
    if (!data.numeroCommerce) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Le numéro de commerce est requis', path: ['numeroCommerce'] });
    if (!data.adresseEnterprise) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "L'adresse de l'entreprise est requise", path: ['adresseEnterprise'] });
    if (!data.enterpriseCountryId) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Le pays de l'entreprise est requis", path: ['enterpriseCountryId'] });
  }
});

export type RegisterFormData = z.infer<typeof registerSchema>;
