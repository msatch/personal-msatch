import { getTranslations } from 'next-intl/server';

export async function CaseStudiesSection() {
  const t = await getTranslations('home.caseStudies');

  return (
    <section className="bg-muted/30 px-4 py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
          {t('title')}
        </h2>
        <p className="mt-4 text-base md:text-lg text-muted text-center max-w-3xl mx-auto">
          {t('subtitle')}
        </p>

        <div className="mt-12 space-y-8 md:space-y-10">
          {['1', '2', '3'].map((id) => (
            <article
              key={id}
              className="p-6 md:p-8 rounded-lg border border-border bg-background"
            >
              <p className="text-sm font-semibold text-accent uppercase tracking-wide">
                {t(`items.${id}.industry`)}
              </p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <h3 className="font-bold text-base">
                    {t('labels.problem')}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {t(`items.${id}.problem`)}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base">
                    {t('labels.intervention')}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {t(`items.${id}.intervention`)}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-base">
                    {t('labels.result')}
                  </h3>
                  <p className="mt-1 text-sm text-muted font-medium">
                    {t(`items.${id}.result`)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
