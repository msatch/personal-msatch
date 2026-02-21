import { getTranslations } from 'next-intl/server';

export async function PhotoCredentials() {
  const t = await getTranslations('bio');
  const tCred = await getTranslations('bio.credentials');

  return (
    <section className="px-4 py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl">
        {/* Page hero */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            {t('hero.title')}
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Photo + Credentials */}
        <div className="mt-12 flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
          {/* Photo placeholder */}
          <div className="flex-shrink-0 w-40 h-40 md:w-48 md:h-48 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-4xl md:text-5xl font-bold text-accent">
              MG
            </span>
          </div>

          {/* Credentials grid */}
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold">
              {tCred('title')}
            </h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {['1', '2', '3', '4'].map((id) => (
                <div key={id}>
                  <p className="font-semibold">
                    {tCred(`items.${id}.title`)}
                  </p>
                  <p className="text-muted text-sm">
                    {tCred(`items.${id}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
