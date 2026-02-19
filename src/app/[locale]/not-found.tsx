import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFoundPage() {
  const t = useTranslations('notFound');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg text-muted">{t('message')}</p>
      <Link
        href="/"
        className="mt-8 text-accent hover:text-accent-dark transition-colors font-medium"
      >
        {t('backHome')}
      </Link>
    </div>
  );
}
