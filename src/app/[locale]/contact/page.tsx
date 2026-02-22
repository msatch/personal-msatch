import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { ContactForm } from '@/components/contact/contact-form';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('contact');

  return (
    <section className="px-4 py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
          {t('title')}
        </h1>
        <p className="mt-4 text-center text-muted text-base md:text-lg">
          {t('subtitle')}
        </p>
        <div className="mt-12">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
