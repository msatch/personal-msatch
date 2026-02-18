import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home.hero');
  const tCommon = await getTranslations('common');
  const tNav = await getTranslations('common.nav');

  const otherLocale = locale === 'es' ? 'en' : 'es';

  return (
    <main className="min-h-screen flex flex-col">
      {/* Temporary locale switch link (will be replaced by nav in Phase 2) */}
      <div className="flex justify-end p-4">
        <Link
          href="/"
          locale={otherLocale}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-border hover:bg-accent-light transition-colors"
        >
          {otherLocale.toUpperCase()}
        </Link>
      </div>

      {/* Hero section - demonstrates typography hierarchy and accent color */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24">
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

      {/* Navigation links preview - demonstrates translation of nav items */}
      <nav className="border-t border-border py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          <span className="text-sm text-muted">{tCommon('language')}: {locale.toUpperCase()}</span>
          <span className="hidden md:inline text-border">|</span>
          <div className="flex gap-4">
            <span className="text-sm font-medium">{tNav('home')}</span>
            <span className="text-sm font-medium">{tNav('bio')}</span>
            <span className="text-sm font-medium">{tNav('services')}</span>
            <span className="text-sm font-medium">{tNav('contact')}</span>
          </div>
        </div>
      </nav>
    </main>
  );
}
