import { httpClient } from '@/core/lib/http-client';
import type { RegisterFormData } from '../validations';

export const authService = {
  async register(data: RegisterFormData) {
    return await httpClient.post('/api/v1/auth/register', data, {
      useToken: false,
    });
  },
};
