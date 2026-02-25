import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { HeroSection } from '@/components/home/hero-section';
import { ProblemSection } from '@/components/home/problem-section';
import { ServicesPreview } from '@/components/home/services-preview';
import { ProcessSection } from '@/components/home/process-section';
import { CtaBand } from '@/components/home/cta-band';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <ScrollReveal>
        <ProblemSection />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <ServicesPreview />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <ProcessSection />
      </ScrollReveal>
      <ScrollReveal>
        <CtaBand />
      </ScrollReveal>
    </>
  );
}
