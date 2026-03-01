'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const CONSENT_KEY = 'cookie_consent_v1';
const CONSENT_COOKIE = 'cookie_consent';
type ConsentChoice = 'accepted' | 'rejected';

export function CookieConsentBanner() {
  const t = useTranslations('consent');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentChoice | null;
    if (stored === 'accepted' || stored === 'rejected') {
      updateGtagConsent(stored);
    } else {
      setVisible(true);
    }
  }, []);

  const handleChoice = useCallback((choice: ConsentChoice) => {
    setVisible(false);
    localStorage.setItem(CONSENT_KEY, choice);
    document.cookie = `${CONSENT_COOKIE}=${choice};max-age=${365 * 24 * 60 * 60};path=/;SameSite=Lax`;
    updateGtagConsent(choice);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t('ariaLabel')}
      className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background shadow-lg"
    >
      <div className="mx-auto max-w-4xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="text-sm flex-1">
          {t('message')}{' '}
          <Link href="/privacy" className="underline text-accent hover:text-accent/80">
            {t('privacyLink')}
          </Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => handleChoice('rejected')}
            className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted/10 transition-colors"
          >
            {t('reject')}
          </button>
          <button
            onClick={() => handleChoice('accepted')}
            className="px-4 py-2 text-sm bg-accent text-on-accent rounded-md hover:bg-accent/90 transition-colors"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}

function updateGtagConsent(choice: ConsentChoice) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: choice === 'accepted' ? 'granted' : 'denied',
    });
  }
}
