import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.privacy' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

const sectionKeys = [
  'dataCollected',
  'dataUsage',
  'dataProcessing',
  'dataRetention',
  'userRights',
  'cookies',
  'contact',
] as const;

const sectionItemCounts: Record<string, string[]> = {
  dataCollected: ['1', '2', '3', '4', '5'],
  dataUsage: ['1', '2', '3'],
  userRights: ['1', '2', '3'],
};

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('privacy');

  return (
    <article className="px-4 py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          {t('title')}
        </h1>
        <p className="mt-2 text-muted">
          {t('lastUpdated')}
        </p>
        <p className="mt-6 text-base md:text-lg leading-relaxed">
          {t('intro')}
        </p>

        {sectionKeys.map((key) => (
          <section key={key} className="mt-10">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              {t(`sections.${key}.title`)}
            </h2>
            <p className="text-base md:text-lg leading-relaxed">
              {t(`sections.${key}.content`)}
            </p>
            {sectionItemCounts[key] && (
              <ul className="mt-4 list-disc list-inside space-y-2 text-base md:text-lg">
                {sectionItemCounts[key].map((itemKey) => (
                  <li key={itemKey}>
                    {t(`sections.${key}.items.${itemKey}`)}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
