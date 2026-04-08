import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { i18next } from '@/core/lib/i18n';
import { authService } from '@/core/services/auth.service';
import type { RegisterFormData } from '@/modules/auth/validations';

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterFormData) => authService.register(data),
    onSuccess: () => {
      toast.success(i18next.t('auth.registrationSuccess'), {
        description: i18next.t('auth.registrationSuccessDesc'),
      });
      router.push('/auth/login');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || i18next.t('auth.registrationError');
      toast.error(errorMessage);
    },
  });
}
