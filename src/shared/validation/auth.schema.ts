import * as z from "zod"

// Login validation schema
export const loginSchema = z.object({
  email: z.string().trim().email("Veuillez entrer une adresse e-mail valide").max(254),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").max(128),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Register validation schema (aligned with modules/auth/validations/auth.validation.ts)
export const registerSchema = z.object({
  firstName: z.string().trim().min(2, "Le prénom doit contenir au moins 2 caractères").max(50),
  lastName: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(50),
  email: z.string().trim().email("Veuillez entrer une adresse e-mail valide").max(254),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(128)
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

export type RegisterFormData = z.infer<typeof registerSchema>

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Veuillez entrer une adresse e-mail valide").max(254),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

// Reset password schema
export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(128)
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
