import { z } from 'zod';
import { httpClient } from '@/core/lib/http-client';
import { tokenManager } from '@/core/lib/token-manager/token-manager';
import type { RegisterFormData } from '@/modules/auth/validations';
import type { LoginCredentials } from '@/core/types/auth.types';
import { Role } from '@/core/config/enum';

// Zod schema for login API response validation
const LoginUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.nativeEnum(Role),
  avatar: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  companyId: z.string().optional().nullable(),
  smsSenderId: z.string().optional().nullable(),
  isSenderIdVerified: z.boolean().optional(),
  smsBalance: z.number().optional(),
  smsQuota: z.number().optional(),
  planName: z.string().optional().nullable(),
});

const LoginApiResponseSchema = z.object({
  token: z.string().min(1),
  refreshToken: z.string().min(1),
  // Backend may return user data at root level or nested
  user: LoginUserSchema.optional(),
  // Or flat at root
  id: z.string().optional(),
  email: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  name: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  avatar: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  companyId: z.string().optional().nullable(),
  userEnterprise: z.object({ id: z.string() }).optional().nullable(),
  smsSenderId: z.string().optional().nullable(),
  isSenderIdVerified: z.boolean().optional(),
  smsBalance: z.number().optional(),
  smsQuota: z.number().optional(),
  planName: z.string().optional().nullable(),
});

export type LoginApiResponse = z.infer<typeof LoginApiResponseSchema>;

// Profile response schema
const ProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.nativeEnum(Role),
  avatar: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  companyId: z.string().optional().nullable(),
  smsSenderId: z.string().optional().nullable(),
  isSenderIdVerified: z.boolean().optional(),
  smsBalance: z.number().optional(),
  smsQuota: z.number().optional(),
  planName: z.string().optional().nullable(),
});

export type ProfileResponse = z.infer<typeof ProfileSchema>;

export const authService = {
  async register(data: RegisterFormData) {
    return await httpClient.post('/api/v1/auth/register', data, {
      useToken: false,
    });
  },
};

export async function login(credentials: LoginCredentials) {
  tokenManager.clearTokens();

  const response = await httpClient.post<LoginApiResponse>(
    '/api/v1/auth/login',
    { email: credentials.email, password: credentials.password },
    { useToken: false }
  );

  // Validate API response shape
  const parsed = LoginApiResponseSchema.safeParse(response);
  if (!parsed.success) {
    throw new Error('Réponse du serveur invalide');
  }

  const validated = parsed.data;
  if (validated.token && validated.refreshToken) {
    tokenManager.setTokens(validated.token, validated.refreshToken);
  }

  return validated;
}

/** Decode the email from a JWT payload without verifying the signature. */
function getEmailFromToken(token: string): string | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    const email = decoded?.email || decoded?.sub || null;
    return typeof email === 'string' && email.includes('@') ? email : null;
  } catch {
    return null;
  }
}

export async function getProfile(): Promise<ProfileResponse> {
  const token = tokenManager.getToken();
  const email = token ? getEmailFromToken(token) : null;

  if (!email) {
    console.error('[getProfile] Cannot extract email from token — aborting profile fetch');
    throw new Error('Email introuvable dans le token');
  }

  const encodedEmail = encodeURIComponent(email);
  const response = await httpClient.get<unknown>(`/api/v1/auth/${encodedEmail}`);

  const parsed = ProfileSchema.safeParse(response);
  if (!parsed.success) {
    console.error('[getProfile] Zod validation failed:', parsed.error.issues);
    console.error('[getProfile] Raw API response:', JSON.stringify(response));
    throw new Error('Réponse profil invalide');
  }

  return parsed.data;
}

export async function logout() {
  return await httpClient.post('/api/v1/auth/logout');
}

export async function loginAsUser(userEmail: string) {
  const sanitizedEmail = encodeURIComponent(userEmail.trim());
  return await httpClient.post(`/api/v1/auth/login-as-user/${sanitizedEmail}`, {});
}
