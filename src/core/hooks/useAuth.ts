import { useAuthContext } from '@/core/providers/auth-provider';

/**
 * Hook unique d'authentification.
 * Expose : token, user, role, enterprise (avec solde), flags de rôle, impersonation.
 */
export function useAuth() {
  return useAuthContext();
}
