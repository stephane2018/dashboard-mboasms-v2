import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Role } from '@/core/config/enum';

function syncTokenCookie(token: string | null) {
  if (typeof document === 'undefined') return;
  if (token) {
    document.cookie = `mboasms-access-token=${token}; path=/; max-age=86400; SameSite=Lax`;
  } else {
    document.cookie = 'mboasms-access-token=; path=/; max-age=0; SameSite=Lax';
  }
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  name?: string;
  avatar?: string;
  enterpriseId?: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;

  isImpersonating: boolean;
  originalAuth: {
    token: string;
    refreshToken: string;
    user: AuthUser;
  } | null;

  actingCompanyId?: string;
  actingCompanyName?: string;

  isHydrated: boolean;

  setAuth: (payload: {
    token: string;
    refreshToken: string;
    user: AuthUser;
  }) => void;
  clearAuth: () => void;

  startImpersonation: (payload: {
    token: string;
    refreshToken: string;
    user: AuthUser;
  }) => void;
  stopImpersonation: () => void;

  setActingCompany: (company: { id: string; name: string }) => void;
  clearActingCompany: () => void;

  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      isImpersonating: false,
      originalAuth: null,
      actingCompanyId: undefined,
      actingCompanyName: undefined,
      isHydrated: false,

      setAuth: ({ token, refreshToken, user }) => {
        syncTokenCookie(token);
        set({
          token,
          refreshToken,
          user,
          isImpersonating: false,
          originalAuth: null,
        });
      },

      clearAuth: () => {
        syncTokenCookie(null);
        set({
          token: null,
          refreshToken: null,
          user: null,
          isImpersonating: false,
          originalAuth: null,
          actingCompanyId: undefined,
          actingCompanyName: undefined,
        });
      },

      startImpersonation: ({ token, refreshToken, user }) => {
        const current = get();
        if (!current.token || !current.refreshToken || !current.user) return;
        syncTokenCookie(token);
        set({
          originalAuth: {
            token: current.token,
            refreshToken: current.refreshToken,
            user: current.user,
          },
          token,
          refreshToken,
          user,
          isImpersonating: true,
        });
      },

      stopImpersonation: () => {
        const { originalAuth } = get();
        if (!originalAuth) return;
        syncTokenCookie(originalAuth.token);
        set({
          token: originalAuth.token,
          refreshToken: originalAuth.refreshToken,
          user: originalAuth.user,
          originalAuth: null,
          isImpersonating: false,
          actingCompanyId: undefined,
          actingCompanyName: undefined,
        });
      },

      setActingCompany: ({ id, name }) =>
        set({ actingCompanyId: id, actingCompanyName: name }),

      clearActingCompany: () =>
        set({ actingCompanyId: undefined, actingCompanyName: undefined }),

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: 'mboasms-auth',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return window.localStorage;
      }),
      skipHydration: true,
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isImpersonating: state.isImpersonating,
        originalAuth: state.originalAuth,
        actingCompanyId: state.actingCompanyId,
        actingCompanyName: state.actingCompanyName,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const u = state.user;
          if (u && (
            typeof u.id !== 'string' || !u.id ||
            typeof u.email !== 'string' || !u.email ||
            typeof u.role !== 'string' || !u.role
          )) {
            state.clearAuth();
          } else {
            syncTokenCookie(state.token);
          }
          state.setHydrated(true);
        }
      },
    }
  )
);

export const getAuthToken = () => useAuthStore.getState().token;

export const authRoleHelpers = {
  isAdmin: (role?: Role | null) =>
    role === Role.ADMIN || role === Role.ADMIN_USER || role === Role.SUPER_ADMIN,
  isSuperAdmin: (role?: Role | null) => role === Role.SUPER_ADMIN,
  isRegularUser: (role?: Role | null) => role === Role.USER,
};
