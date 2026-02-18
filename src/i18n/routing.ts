import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'always',
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365 // 1 year
  }
});
