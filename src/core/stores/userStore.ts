import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role } from '@/core/config/enum';

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
  setUser: (user: User) => void;
  clearUser: () => void;
  updateUser: (userData: Partial<User>) => void;
  setActingCompany: (company: { id: string; name: string }) => void;
  clearActingCompany: () => void;
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

      setUser: (user: User) => set({ user, isAuthenticated: true }),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
          actingCompanyId: undefined,
          actingCompanyName: undefined,
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

      isAdmin: () => {
        const { user } = get();
        return user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN;
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
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);
