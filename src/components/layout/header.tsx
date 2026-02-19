'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', labelKey: 'home' },
  { href: '/bio', labelKey: 'bio' },
  { href: '/services', labelKey: 'services' },
  { href: '/contact', labelKey: 'contact' },
] as const;

export function Header() {
  const t = useTranslations('common.nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const otherLocale = locale === 'es' ? 'en' : 'es';

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3"
        aria-label="Main navigation"
      >
        {/* Logo / Home link */}
        <Link href="/" className="text-lg font-bold">
          M. Gripe
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, labelKey }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-accent',
                pathname === href ? 'text-accent' : 'text-foreground'
              )}
            >
              {t(labelKey)}
            </Link>
          ))}
        </div>

        {/* Language toggle + hamburger */}
        <div className="flex items-center gap-3">
          <Link
            href={pathname}
            locale={otherLocale}
            className="text-sm font-medium px-3 py-1.5 rounded-md border border-border hover:bg-accent-light transition-colors"
          >
            {otherLocale.toUpperCase()}
          </Link>

          {/* Hamburger button (mobile only) */}
          <button
            className="md:hidden flex flex-col justify-center gap-1.5 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span
              className={cn(
                'block h-0.5 w-6 bg-foreground transition-transform duration-300',
                mobileMenuOpen && 'translate-y-2 rotate-45'
              )}
            />
            <span
              className={cn(
                'block h-0.5 w-6 bg-foreground transition-opacity duration-300',
                mobileMenuOpen && 'opacity-0'
              )}
            />
            <span
              className={cn(
                'block h-0.5 w-6 bg-foreground transition-transform duration-300',
                mobileMenuOpen && '-translate-y-2 -rotate-45'
              )}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
          mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="border-t border-border px-4 py-4 flex flex-col gap-3">
          {navLinks.map(({ href, labelKey }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'text-base font-medium py-2 transition-colors',
                pathname === href ? 'text-accent' : 'text-foreground'
              )}
            >
              {t(labelKey)}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
