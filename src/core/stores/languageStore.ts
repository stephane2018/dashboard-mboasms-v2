import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = "fr" | "en";

const SUPPORTED_LANGS: Lang[] = ["fr", "en"];

/**
 * Detect browser language on first visit.
 * Returns "en" if browser is English, "fr" otherwise (default).
 */
function detectBrowserLang(): Lang {
  if (typeof window === 'undefined') return 'fr';
  const browserLang = navigator.language?.split('-')[0]?.toLowerCase();
  if (browserLang && SUPPORTED_LANGS.includes(browserLang as Lang)) {
    return browserLang as Lang;
  }
  return 'fr';
}

/**
 * Check if the user has already saved a language preference.
 */
function hasPersistedLang(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem('mboasms-language') !== null;
}

interface LanguageState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      // First visit: detect browser language. Subsequent visits: Zustand hydrates from localStorage.
      lang: hasPersistedLang() ? "fr" : detectBrowserLang(),
      setLang: (lang: Lang) => set({ lang }),
    }),
    {
      name: 'mboasms-language',
      // Skip auto-hydration: Zustand v5 with synchronous storage fires set() during render,
      // which can cause React concurrent-mode errors. Rehydration is triggered manually
      // in AuthProvider's useEffect via useLanguageStore.persist.rehydrate().
      skipHydration: true,
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
