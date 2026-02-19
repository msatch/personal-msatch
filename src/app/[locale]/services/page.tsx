import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('pages.services');

  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold">{t('title')}</h1>
        <p className="mt-4 text-muted">{t('placeholder')}</p>
      </div>
    </section>
  );
}
