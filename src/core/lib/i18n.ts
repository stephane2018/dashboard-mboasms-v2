import i18next from 'i18next';
import { z } from 'zod';
import { makeZodI18nMap } from 'zod-i18n-map';
import fr from '@/locales/fr.json';

i18next.init({
  lng: 'fr',
  resources: {
    fr: {
      zod: fr,
    },
  },
});

z.setErrorMap(makeZodI18nMap({ ns: 'zod' }));

export { i18next };
