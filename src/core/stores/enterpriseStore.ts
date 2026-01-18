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
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);
