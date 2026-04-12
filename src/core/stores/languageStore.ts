import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = "fr" | "en";

const SUPPORTED_LANGS: Lang[] = ["fr", "en"];

export function detectBrowserLang(): Lang {
  if (typeof window === 'undefined') return 'fr';
  const browserLang = navigator.language?.split('-')[0]?.toLowerCase();
  if (browserLang && SUPPORTED_LANGS.includes(browserLang as Lang)) {
    return browserLang as Lang;
  }
  return 'fr';
}

interface LanguageState {
  lang: Lang;
  /** true only when the user has explicitly picked a language via the switcher */
  userHasChosen: boolean;
  setLang: (lang: Lang) => void;
  /** Internal: set language without marking as user-chosen (used after rehydration) */
  _syncBrowserLang: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      lang: 'fr', // placeholder — overwritten by rehydration or _syncBrowserLang
      userHasChosen: false,
      setLang: (lang: Lang) => set({ lang, userHasChosen: true }),
      _syncBrowserLang: () => {
        const browserLang = detectBrowserLang();
        set({ lang: browserLang });
      },
    }),
    {
      name: 'mboasms-language',
      skipHydration: true,
      partialize: (state) => ({
        lang: state.lang,
        userHasChosen: state.userHasChosen,
      }),
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
