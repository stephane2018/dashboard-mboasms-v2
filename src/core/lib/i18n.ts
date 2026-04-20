import i18next from 'i18next';
import { z } from 'zod';
import { makeZodI18nMap } from 'zod-i18n-map';
import fr from '@/locales/fr.json';
import en from '@/locales/en.json';

function getPersistedLang(): string {
  if (typeof window === 'undefined') return 'fr';
  try {
    const stored = window.localStorage.getItem('mboasms-language');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.state?.lang || 'fr';
    }
  } catch {
    // ignore
  }
  return 'fr';
}

if (!i18next.isInitialized) {
  i18next.init({
    lng: getPersistedLang(),
    fallbackLng: 'fr',
    resources: {
      fr: { translation: fr, zod: fr },
      en: { translation: en, zod: en },
    },
    interpolation: { escapeValue: false },
  });
}

z.setErrorMap(makeZodI18nMap({ ns: 'zod' }));

export { i18next };
