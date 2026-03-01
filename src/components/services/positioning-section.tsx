import { getTranslations } from 'next-intl/server';

export async function PositioningSection() {
  const t = await getTranslations('services.positioning');

  return (
    <section className="bg-muted/30 px-4 py-16 md:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
          {t('title')}
        </h2>
        <p className="mt-4 text-base md:text-lg text-muted text-center max-w-3xl mx-auto">
          {t('subtitle')}
        </p>

        <div className="mt-12 space-y-6">
          {['1', '2', '3', '4', '5'].map((id) => (
            <div
              key={id}
              className="rounded-lg border border-border bg-background p-6"
            >
              <h3 className="text-lg font-bold">
                {t(`items.${id}.title`)}
              </h3>
              <p className="mt-2 text-muted leading-relaxed">
                {t(`items.${id}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
