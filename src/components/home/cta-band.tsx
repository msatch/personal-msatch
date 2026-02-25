import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function CtaBand() {
  const t = await getTranslations('home.ctaBand');
  const tCommon = await getTranslations('common');

  return (
    <section className="bg-foreground px-4 py-16 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
          {t('title')}
        </h2>
        <p className="mt-4 text-base md:text-lg text-white/80">
          {t('subtitle')}
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block px-8 py-4 bg-accent text-white font-bold rounded-lg hover:bg-accent-dark hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-base md:text-lg"
        >
          {tCommon('cta')}
        </Link>
      </div>
    </section>
  );
}
