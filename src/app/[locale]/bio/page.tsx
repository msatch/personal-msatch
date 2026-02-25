import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { PhotoCredentials } from '@/components/bio/photo-credentials';
import { NarrativeSection } from '@/components/bio/narrative-section';
import { SocialProofSection } from '@/components/bio/social-proof-section';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.bio' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function BioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('bio.cta');
  const tCommon = await getTranslations('common');

  return (
    <>
      <PhotoCredentials />
      <NarrativeSection />
      <SocialProofSection />

      {/* CTA Band */}
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
            className="mt-8 inline-block px-8 py-4 bg-accent text-white font-bold rounded-lg hover:bg-accent-dark transition-colors text-base md:text-lg"
          >
            {tCommon('cta')}
          </Link>
        </div>
      </section>
    </>
  );
}
