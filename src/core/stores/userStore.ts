import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role } from '@/core/config/enum';
import { tokenManager } from '@/core/lib/token-manager./token-manager';

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
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      actingCompanyId: undefined,
      actingCompanyName: undefined,
      isImpersonating: false,
      originalUser: undefined,

      setUser: (user: User) => {
        console.log(' setUser called with:', user)
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
    }),
    {
      name: 'user-storage',
      onRehydrateStorage: () => (state) => {
        console.log('User store rehydrating, state:', state)
        if (state) {
          console.log('User store hydrated, user:', state.user)
          console.log('User store hydrated, user role:', state.user?.role)

          // Validate token on rehydration - if token is expired, clear user data
          // This prevents stale user data from being loaded when the token is no longer valid
          const token = tokenManager.getToken();
          if (state.user && (!token || tokenManager.isTokenExpired())) {
            console.log('User store: Token expired or missing on rehydration, clearing user')
            state.clearUser();
          }

          state.setHydrated(true);
        }
      },
    }
  )
);
