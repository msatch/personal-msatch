import { getTranslations } from 'next-intl/server';

export async function OfferingsSection() {
  const t = await getTranslations('services');

  return (
    <section className="px-4 py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            {t('hero.title')}
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted">
            {t('hero.subtitle')}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {['1', '2', '3', '4'].map((id) => (
            <div
              key={id}
              className="p-6 md:p-8 rounded-lg border border-border bg-background"
            >
              <h3 className="text-xl md:text-2xl font-bold">
                {t(`offerings.${id}.title`)}
              </h3>
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">
                    {t('labels.problem')}
                  </h4>
                  <p className="mt-1">
                    {t(`offerings.${id}.problem`)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">
                    {t('labels.approach')}
                  </h4>
                  <p className="mt-1">
                    {t(`offerings.${id}.approach`)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-accent">
                    {t('labels.outcome')}
                  </h4>
                  <p className="mt-1">
                    {t(`offerings.${id}.outcome`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
