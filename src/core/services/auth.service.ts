import { httpClient } from '@/core/lib/http-client';
import type { RegisterFormData } from '@/modules/auth/validations';
import type { LoginCredentials } from '@/core/types/auth.types';

export const authService = {
  async register(data: RegisterFormData) {
    return await httpClient.post('/api/v1/auth/register', data, {
      useToken: false,
    });
  },
};

export async function login(credentials: LoginCredentials) {
  return await httpClient.post('/api/v1/auth/login', credentials as any, {
    useToken: false,
  });
}

export async function getProfile() {
  return await httpClient.get('/api/v1/auth/profile');
}

export async function logout() {
  return await httpClient.post('/api/v1/auth/logout');
}
