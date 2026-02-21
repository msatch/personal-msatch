import { getTranslations } from 'next-intl/server';

export async function FaqSection() {
  const t = await getTranslations('services.faq');

  return (
    <section className="px-4 py-16 md:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
          {t('title')}
        </h2>

        <div className="mt-12">
          {['1', '2', '3', '4', '5', '6'].map((id) => (
            <div
              key={id}
              className="border-b border-border pb-6 mb-6 last:border-0 last:mb-0"
            >
              <h3 className="text-lg font-bold">
                {t(`items.${id}.question`)}
              </h3>
              <p className="mt-2 text-muted leading-relaxed">
                {t(`items.${id}.answer`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
