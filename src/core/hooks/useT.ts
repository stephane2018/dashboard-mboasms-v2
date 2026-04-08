"use client"

import { useEffect } from 'react';
import { useLanguageStore } from '@/core/stores/languageStore';
import { i18next } from '@/core/lib/i18n';

/**
 * Custom hook that syncs the language store with i18next
 * and returns the translation function.
 *
 * Usage:
 *   const { t } = useT()
 *   t('common.save') // "Enregistrer" or "Save"
 */
export function useT() {
  const { lang } = useLanguageStore();

  useEffect(() => {
    if (i18next.isInitialized && i18next.language !== lang) {
      i18next.changeLanguage(lang);
    }
  }, [lang]);

  const t = (key: string, options?: Record<string, unknown>): string => {
    return i18next.t(key, options as any) as string;
  };

  return { t, lang };
}
