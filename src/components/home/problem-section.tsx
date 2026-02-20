import { getTranslations } from 'next-intl/server';

export async function ProblemSection() {
  const t = await getTranslations('home.problem');

  return (
    <section className="px-4 py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
          {t('title')}
        </h2>
        <p className="mt-4 text-base md:text-lg text-muted text-center max-w-3xl mx-auto">
          {t('subtitle')}
        </p>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Pain points */}
          <div className="space-y-6">
            {['1', '2', '3', '4'].map((id) => (
              <div key={id}>
                <h3 className="font-semibold text-lg">
                  {t(`painPoints.${id}.title`)}
                </h3>
                <p className="mt-1 text-muted">
                  {t(`painPoints.${id}.description`)}
                </p>
              </div>
            ))}
          </div>

          {/* Solution */}
          <div>
            <h3 className="text-xl font-bold">
              {t('solution.title')}
            </h3>
            <p className="mt-3 text-muted leading-relaxed">
              {t('solution.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
