import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateUser, type UpdateUserPayload } from '@/core/services/auth.service';
import { useAuth } from '@/core/hooks/useAuth';

export function useUpdateUser() {
  const { refetchEnterprise } = useAuth();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: async () => {
      await refetchEnterprise();
      toast.success('Profil mis à jour', {
        description: 'Vos informations ont été enregistrées',
      });
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Erreur lors de la mise à jour';
      toast.error('Mise à jour échouée', { description: msg });
    },
  });
}
