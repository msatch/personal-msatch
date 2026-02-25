import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function HeroSection() {
  const t = await getTranslations('home.hero');
  const tCommon = await getTranslations('common');

  return (
    <section className="px-4 py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          {t('title')}
        </h1>
        <p className="mt-6 text-base md:text-lg lg:text-xl text-muted max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-base md:text-lg"
        >
          {tCommon('cta')}
        </Link>
      </div>
    </section>
  );
}
