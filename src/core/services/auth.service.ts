import { httpClient } from '@/core/lib/http-client';
import { tokenManager } from '@/core/lib/token-manager./token-manager';
import type { RegisterFormData } from '@/modules/auth/validations';
import type { LoginCredentials } from '@/core/types/auth.types';

interface LoginApiResponse {
  token: string;
  refreshToken: string;
  user: any;
}

export const authService = {
  async register(data: RegisterFormData) {
    return await httpClient.post('/api/v1/auth/register', data, {
      useToken: false,
    });
  },
};

export async function login(credentials: LoginCredentials) {
  // Clear any existing tokens before login
  tokenManager.clearTokens();

  const response = await httpClient.post<LoginApiResponse>('/api/v1/auth/login', credentials as any, {
    useToken: false,
  });

  // Store the new tokens
  if (response.token && response.refreshToken) {
    tokenManager.setTokens(response.token, response.refreshToken);
  }

  return response;
}

export async function getProfile() {
  return await httpClient.get('/api/v1/auth/profile');
}

export async function logout() {
  return await httpClient.post('/api/v1/auth/logout');
}

export async function loginAsUser(userEmail: string) {
  return await httpClient.post(`/api/v1/auth/login-as-user/${userEmail}`, {});
}
