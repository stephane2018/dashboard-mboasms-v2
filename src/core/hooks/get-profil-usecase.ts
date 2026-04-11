import { useQuery } from "@tanstack/react-query";
import { loginQueryKey } from "@/core/config/querykey";
import { getProfile, getEmailFromToken } from "@/core/services/auth.service";
import { tokenManager } from "@/core/lib/token-manager/token-manager";
import { useUserStore } from "@/core/stores/userStore";

export const useGetProfile = (enabled = true) => {
  const user = useUserStore((s) => s.user);

  return useQuery({
    queryKey: loginQueryKey.profile,
    queryFn: () => {
      const email = user?.email || getEmailFromToken(tokenManager.getToken() || '');
      if (!email) throw new Error('Email introuvable pour récupérer le profil');
      return getProfile(email);
    },
    enabled: enabled,
  });
};
