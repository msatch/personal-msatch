'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Contact info */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-3">
              {t('contact.title')}
            </h3>
            <p className="text-sm text-muted">{t('contact.email')}</p>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-3">
              {t('legal.title')}
            </h3>
            <Link
              href="/privacy"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              {t('legal.privacy')}
            </Link>
          </div>

          {/* Social links (placeholders) */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-3">
              {t('social.title')}
            </h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted">
          <p>&copy; {new Date().getFullYear()} M. Gripe. {t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
