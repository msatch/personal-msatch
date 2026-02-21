import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { OfferingsSection } from '@/components/services/offerings-section';
import { ProcessSection } from '@/components/services/process-section';
import { FaqSection } from '@/components/services/faq-section';
import { ServicesCta } from '@/components/services/services-cta';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <OfferingsSection />
      <ProcessSection />
      <FaqSection />
      <ServicesCta />
    </>
  );
}
