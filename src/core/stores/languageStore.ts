import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = "fr" | "en";

interface LanguageState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      lang: "fr",
      setLang: (lang: Lang) => set({ lang }),
    }),
    {
      name: 'mboasms-language',
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          const value = window.localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return;
          window.localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return;
          window.localStorage.removeItem(name);
        },
      },
    }
  )
);
