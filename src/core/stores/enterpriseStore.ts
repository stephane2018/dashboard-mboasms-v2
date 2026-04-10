import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EnterpriseType } from '@/core/models/company';

interface EnterpriseStore {
  enterprise: EnterpriseType | null;
  setEnterprise: (enterprise: EnterpriseType) => void;
  clearEnterprise: () => void;
  updateEnterprise: (enterpriseData: Partial<EnterpriseType>) => void;
  isHydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
}

export const useEnterpriseStore = create<EnterpriseStore>()(
  persist(
    (set, get) => ({
      enterprise: null,
      isHydrated: false,

      setEnterprise: (enterprise: EnterpriseType) => set({ enterprise }),

      clearEnterprise: () => set({ enterprise: null }),

      updateEnterprise: (enterpriseData: Partial<EnterpriseType>) =>
        set((state) => ({
          enterprise: state.enterprise ? { ...state.enterprise, ...enterpriseData } : null,
        })),

      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
    }),
    {
      name: 'enterprise-storage',
      // Skip auto-hydration: Zustand v5 with synchronous storage fires set() during render,
      // which can cause React errors. Hydration is handled manually in AuthProvider's useEffect.
      skipHydration: true,
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
          state.setHydrated(true);
        }
      },
    }
  )
);
