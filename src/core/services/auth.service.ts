import { z } from 'zod';
import { httpClient } from '@/core/lib/http-client';
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
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  gender: z.string().optional().nullable(),
  token: z.string().optional(),
  refreshToken: z.string().optional(),
  expirationTime: z.string().optional(),
  userEnterprise: z.object({
    id: z.string(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    version: z.number().optional(),
    socialRaison: z.string().optional().nullable(),
    numeroCommerce: z.string().optional().nullable(),
    urlImage: z.string().optional().nullable(),
    urlSiteweb: z.string().optional().nullable(),
    telephoneEnterprise: z.string().optional().nullable(),
    emailEnterprise: z.string().optional().nullable(),
    villeEnterprise: z.string().optional().nullable(),
    adresseEnterprise: z.string().optional().nullable(),
    smsESenderId: z.string().optional().nullable(),
    smsCredit: z.number().optional().nullable(),
    internationalCredit: z.number().optional().nullable(),
    activityDomain: z.string().optional().nullable(),
    contribuableNumber: z.string().optional().nullable(),
    pays: z.object({
      id: z.string(),
      code: z.string(),
      nom: z.string(),
      continent: z.string().optional(),
      imageUrl: z.string().optional().nullable(),
      archived: z.boolean().optional(),
    }).optional().nullable(),
    groupes: z.array(z.any()).optional().nullable(),
    archived: z.boolean().optional(),
  }).passthrough().optional().nullable(),
  archived: z.boolean().optional(),
});

const LoginApiResponseSchema = z.object({
  statusCode: z.number(),
  error: z.string().nullable(),
  message: z.string(),
  token: z.string().min(1),
  refreshToken: z.string().min(1),
  expirationTime: z.string().optional(),
  // User data at root level based on new API response
  id: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  version: z.number().optional(),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  name: z.string().optional(),
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  gender: z.string().nullable().optional(),
  role: z.nativeEnum(Role),
  avatar: z.string().optional().nullable(),
  smsSenderId: z.string().optional().nullable(),
  isSenderIdVerified: z.boolean().optional(),
  smsBalance: z.number().optional(),
  smsQuota: z.number().optional(),
  planName: z.string().optional().nullable(),
  userEnterprise: z.object({
    id: z.string(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    version: z.number().optional(),
    socialRaison: z.string().optional().nullable(),
    numeroCommerce: z.string().optional().nullable(),
    urlImage: z.string().optional().nullable(),
    urlSiteweb: z.string().optional().nullable(),
    telephoneEnterprise: z.string().optional().nullable(),
    emailEnterprise: z.string().optional().nullable(),
    villeEnterprise: z.string().optional().nullable(),
    adresseEnterprise: z.string().optional().nullable(),
    smsESenderId: z.string().optional().nullable(),
    smsCredit: z.number().optional().nullable(),
    internationalCredit: z.number().optional().nullable(),
    activityDomain: z.string().optional().nullable(),
    contribuableNumber: z.string().optional().nullable(),
    pays: z.object({
      id: z.string(),
      code: z.string(),
      nom: z.string(),
      continent: z.string().optional(),
      imageUrl: z.string().optional().nullable(),
      archived: z.boolean().optional(),
    }).optional().nullable(),
    groupes: z.array(z.any()).optional().nullable(),
    archived: z.boolean().optional(),
  }).passthrough().optional().nullable(),
  recharges: z.array(z.any()).optional().nullable(),
  archived: z.boolean().optional(),
});

export type LoginApiResponse = z.infer<typeof LoginApiResponseSchema>;

export const authService = {
  async register(data: RegisterFormData) {
    return await httpClient.post('/api/v1/auth/register', data, {
      useToken: false,
    });
  },
};

export async function login(credentials: LoginCredentials) {
  const response = await httpClient.post<LoginApiResponse>(
    '/api/v1/auth/login',
    { email: credentials.email, password: credentials.password },
    { useToken: false }
  );

  const parsed = LoginApiResponseSchema.safeParse(response);
  if (!parsed.success) {
    throw new Error('Réponse du serveur invalide');
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

export async function blockUser(id: string) {
  return await httpClient.put(`/api/v1/auth/${id}/block`);
}

export async function unblockUser(id: string) {
  return await httpClient.put(`/api/v1/auth/${id}/unblock`);
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  socialRaison?: string;
  smsSenderId?: string;
  activityDomain?: string;
  contribuableNumber?: string;
  villeEntreprise?: string;
  pays?: string;
  user?: string;
}

export async function updateUser(id: string, payload: UpdateUserPayload) {
  return await httpClient.put(`/api/v1/auth/update-user/${id}`, payload);
}
