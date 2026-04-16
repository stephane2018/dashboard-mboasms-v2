'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore, authRoleHelpers, type AuthUser } from '@/core/stores/authStore';
import { getCompagnieConnectedDetails } from '@/core/services/CompanyService';
import type { EnterpriseType } from '@/core/models';
import { Role } from '@/core/config/enum';

interface ContextUser extends AuthUser {
  companyId?: string;
}

interface AuthContextValue {
  token: string | null;
  user: ContextUser | null;
  role: Role | null;
  enterprise: EnterpriseType | null;
  isAuthenticated: boolean;
  isConnected: boolean;
  isHydrated: boolean;
  isLoadingEnterprise: boolean;
  isLoadingProfile: boolean;
  isImpersonating: boolean;
  actingCompanyId?: string;
  actingCompanyName?: string;

  isAdmin: boolean;
  isSuperAdmin: boolean;
  isRegularUser: boolean;

  refetchEnterprise: () => Promise<unknown>;
  clearUser: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isImpersonating = useAuthStore((s) => s.isImpersonating);
  const actingCompanyId = useAuthStore((s) => s.actingCompanyId);
  const actingCompanyName = useAuthStore((s) => s.actingCompanyName);
  const setHydrated = useAuthStore((s) => s.setHydrated);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    void useAuthStore.persist.rehydrate();
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }
  }, [setHydrated]);

  const userId = user?.id ?? null;
  const enterpriseId = user?.enterpriseId ?? null;

  const enterpriseQuery = useQuery<EnterpriseType>({
    queryKey: ['auth', 'enterprise', enterpriseId, userId],
    queryFn: () => getCompagnieConnectedDetails(enterpriseId as string, userId as string),
    enabled: Boolean(isHydrated && userId && enterpriseId && token),
    staleTime: 60_000,
  });

  const enterprise = enterpriseQuery.data ?? null;

  const value = useMemo<AuthContextValue>(() => {
    const role = user?.role ?? null;
    const contextUser: ContextUser | null = user
      ? { ...user, companyId: enterprise?.id }
      : null;

    return {
      token,
      user: contextUser,
      role,
      enterprise,
      isAuthenticated: Boolean(token && user),
      isConnected: Boolean(token && user),
      isHydrated,
      isLoadingEnterprise: enterpriseQuery.isLoading,
      isLoadingProfile: enterpriseQuery.isLoading,
      isImpersonating,
      actingCompanyId,
      actingCompanyName,
      isAdmin: authRoleHelpers.isAdmin(role),
      isSuperAdmin: authRoleHelpers.isSuperAdmin(role),
      isRegularUser: authRoleHelpers.isRegularUser(role),
      refetchEnterprise: enterpriseQuery.refetch,
      clearUser: clearAuth,
    };
  }, [
    token,
    user,
    enterprise,
    isHydrated,
    isImpersonating,
    actingCompanyId,
    actingCompanyName,
    enterpriseQuery.isLoading,
    enterpriseQuery.refetch,
    clearAuth,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within <AuthProvider>');
  }
  return ctx;
}
