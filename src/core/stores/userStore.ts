import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role } from '@/core/config/enum';
import { tokenManager } from '@/core/lib/token-manager/token-manager';

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  phone?: string;
  companyId?: string;
  smsSenderId?: string;
  isSenderIdVerified?: boolean;
  smsBalance?: number;
  smsQuota?: number;
  planName?: string;
}

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isTokenHydrated: boolean;
  actingCompanyId?: string;
  actingCompanyName?: string;
  isImpersonating: boolean;
  originalUser?: User;
  setUser: (user: User) => void;
  clearUser: () => void;
  updateUser: (userData: Partial<User>) => void;
  setActingCompany: (company: { id: string; name: string }) => void;
  clearActingCompany: () => void;
  setImpersonating: (isImpersonating: boolean, originalUser?: User) => void;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  isRegularUser: () => boolean;
  setHydrated: (hydrated: boolean) => void;
  setTokenHydrated: (hydrated: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      isTokenHydrated: false,
      actingCompanyId: undefined,
      actingCompanyName: undefined,
      isImpersonating: false,
      originalUser: undefined,

      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      },

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
          actingCompanyId: undefined,
          actingCompanyName: undefined,
          isImpersonating: false,
          originalUser: undefined,
        }),

      updateUser: (userData: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      setActingCompany: (company: { id: string; name: string }) =>
        set({
          actingCompanyId: company.id,
          actingCompanyName: company.name,
        }),

      clearActingCompany: () =>
        set({
          actingCompanyId: undefined,
          actingCompanyName: undefined,
        }),

      setImpersonating: (isImpersonating: boolean, originalUser?: User) =>
        set({
          isImpersonating,
          originalUser: isImpersonating ? originalUser : undefined,
        }),

      isAdmin: () => {
        const { user } = get();
        return user?.role === Role.ADMIN || user?.role === Role.ADMIN_USER || user?.role === Role.SUPER_ADMIN;
      },

      isSuperAdmin: () => {
        const { user } = get();
        return user?.role === Role.SUPER_ADMIN;
      },

      isRegularUser: () => {
        const { user } = get();
        return user?.role === Role.USER;
      },

      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
      setTokenHydrated: (hydrated: boolean) => set({ isTokenHydrated: hydrated }),
    }),
    {
      name: 'user-storage',
      // Skip auto-hydration at store creation time — Zustand v5 fires onRehydrateStorage
      // synchronously during render with synchronous storage (sessionStorage), which calls
      // set({ isHydrated: true }) and notifies subscribers while a component is rendering,
      // causing React Error #300. Instead, AuthProvider manually calls
      // useUserStore.persist.rehydrate() inside a useEffect (after render).
      skipHydration: true,
      // Exclude runtime-only flags from sessionStorage — they must always start false
      // isHydrated: set by onRehydrateStorage callback after rehydration completes
      // isTokenHydrated: set by AuthProvider after hydrateFromServer() async call
      // Persisting these would cause ProtectedRoute to skip the hydration wait on reload
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        actingCompanyId: state.actingCompanyId,
        actingCompanyName: state.actingCompanyName,
        isImpersonating: state.isImpersonating,
        originalUser: state.originalUser,
      }),
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          const value = window.sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return;
          window.sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return;
          window.sessionStorage.removeItem(name);
        },
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Do NOT validate token here — tokenManager stores tokens in memory
          // and hydrateFromServer() (which loads them from httpOnly cookies)
          // runs later in AuthProvider. Checking here would always find null
          // tokens and incorrectly clear the user.
          // Token validation is handled by AuthProvider after hydration.
          state.setHydrated(true);
        }
      },
    }
  )
);
