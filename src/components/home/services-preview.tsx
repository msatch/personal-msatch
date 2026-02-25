import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function ServicesPreview() {
  const t = await getTranslations('home.services');

  return (
    <section className="bg-muted/30 px-4 py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
          {t('title')}
        </h2>
        <p className="mt-4 text-base md:text-lg text-muted text-center max-w-3xl mx-auto">
          {t('subtitle')}
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {['1', '2', '3', '4'].map((id) => (
            <Link
              key={id}
              href="/services"
              className="block p-6 rounded-lg border border-border bg-background hover:border-accent hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <h3 className="text-lg font-bold">
                {t(`items.${id}.title`)}
              </h3>
              <p className="mt-2 text-sm text-muted">
                {t(`items.${id}.description`)}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/services"
            className="inline-block text-accent font-semibold hover:underline"
          >
            {t('viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
}
