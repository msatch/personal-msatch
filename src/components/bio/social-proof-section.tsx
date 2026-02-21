import { getTranslations } from 'next-intl/server';

export async function SocialProofSection() {
  const t = await getTranslations('bio.socialProof');

  return (
    <section className="px-4 py-16 md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold">
          {t('title')}
        </h2>
        <p className="mt-4 text-muted">
          {t('subtitle')}
        </p>
        <div className="mt-8 text-sm text-muted-foreground italic">
          {t('comingSoon')}
        </div>
      </div>
    </section>
  );
}
