import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '../services';
import type { RegisterFormData } from '../validations';

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterFormData) => authService.register(data),
    onSuccess: () => {
      toast.success('Registration successful!', {
        description: 'You can now log in with your credentials.',
      });
      router.push('/auth/login');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    },
  });
}
