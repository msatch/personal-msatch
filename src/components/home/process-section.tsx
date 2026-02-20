import { getTranslations } from 'next-intl/server';

export async function ProcessSection() {
  const t = await getTranslations('home.process');

  return (
    <section className="px-4 py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
          {t('title')}
        </h2>
        <p className="mt-4 text-base md:text-lg text-muted text-center max-w-3xl mx-auto">
          {t('subtitle')}
        </p>

        <div className="mt-12 space-y-8">
          {['1', '2', '3'].map((id) => (
            <div key={id} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg">
                {id}
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {t(`steps.${id}.title`)}
                </h3>
                <p className="mt-1 text-muted">
                  {t(`steps.${id}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
