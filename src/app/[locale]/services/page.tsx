import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { OfferingsSection } from '@/components/services/offerings-section';
import { ProcessSection } from '@/components/services/process-section';
import { FaqSection } from '@/components/services/faq-section';
import { ServicesCta } from '@/components/services/services-cta';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.services' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <OfferingsSection />
      <ScrollReveal>
        <ProcessSection />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <FaqSection />
      </ScrollReveal>
      <ScrollReveal>
        <ServicesCta />
      </ScrollReveal>
    </>
  );
}
