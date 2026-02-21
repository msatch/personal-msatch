import { getTranslations } from 'next-intl/server';

export async function NarrativeSection() {
  const t = await getTranslations('bio.narrative');

  return (
    <section className="bg-muted/30 px-4 py-16 md:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold">
          {t('title')}
        </h2>
        {['1', '2', '3'].map((id) => (
          <p
            key={id}
            className="mt-4 text-base md:text-lg text-muted leading-relaxed"
          >
            {t(`paragraphs.${id}`)}
          </p>
        ))}
      </div>
    </section>
  );
}
