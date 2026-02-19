import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home.hero');
  const tCommon = await getTranslations('common');

  return (
    <section className="flex flex-col items-center justify-center px-4 py-16 md:py-24">
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center max-w-4xl">
        {t('title')}
      </h1>
      <p className="mt-6 text-base md:text-lg lg:text-xl text-muted text-center max-w-2xl">
        {t('subtitle')}
      </p>
      <button
        className="mt-8 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors text-base md:text-lg"
      >
        {tCommon('cta')}
      </button>
    </section>
  );
}
