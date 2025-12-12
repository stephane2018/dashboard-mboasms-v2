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
  setUser: (user: User) => void;
  clearUser: () => void;
  updateUser: (userData: Partial<User>) => void;
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

      setUser: (user: User) => set({ user, isAuthenticated: true }),

      clearUser: () => set({ user: null, isAuthenticated: false }),

      updateUser: (userData: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

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
