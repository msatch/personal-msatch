# Phase 2: Layout Shell & Navigation - Research

**Researched:** 2026-02-18
**Domain:** Next.js App Router shared layouts, responsive navigation, next-intl locale switching, localized 404 pages
**Confidence:** HIGH

## Summary

Phase 2 wraps all pages in a shared layout containing a sticky top navigation bar, a responsive mobile hamburger menu, a language toggle (ES/EN), and a footer with contact info and link placeholders. It also delivers a styled, localized 404 page. The entire implementation uses the existing stack from Phase 1: Next.js 16 App Router, Tailwind CSS 4, and next-intl 4.x. No new libraries are needed.

The navigation is a Client Component (`'use client'`) because it needs `useState` for the hamburger menu toggle and `usePathname` / `useLocale` from next-intl for active link highlighting and locale switching. The header and footer are placed inside the `[locale]/layout.tsx` file, wrapping `{children}` so every page inherits them. The 404 page requires a three-file pattern: a root `not-found.tsx` (fallback for non-locale paths), a `[locale]/not-found.tsx` (localized content), and a `[locale]/[...rest]/page.tsx` catch-all that calls `notFound()` to trigger the localized 404 for unknown routes within a locale.

**Primary recommendation:** Build the header as a `'use client'` component with React `useState` for mobile menu toggle, Tailwind CSS transitions for smooth open/close, and next-intl's `Link` component with `locale` prop for the language switcher. Place header + footer in `[locale]/layout.tsx`. Create the localized 404 using the catch-all route pattern from the next-intl docs. No new npm dependencies are required.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| NAV-01 | Site has 4 pages: Home, Bio, Services, Contact | Stub pages under `[locale]/` with `generateStaticParams` and `setRequestLocale`. Pattern from Phase 1 research. |
| NAV-02 | Sticky top navigation with links to all 4 pages + logo/home link | `sticky top-0 z-50` classes on `<header>`. next-intl `Link` for locale-aware navigation. Active link via `usePathname`. |
| NAV-03 | Mobile hamburger menu with smooth open/close | `'use client'` component with `useState` toggle + Tailwind `transition-all duration-300` classes. `aria-expanded` and `aria-controls` for accessibility. |
| NAV-04 | Language toggle (ES/EN) visible in navigation on all viewports | next-intl `Link` with `locale` prop pointing to opposite locale while preserving current `pathname`. Always visible (not inside hamburger). |
| NAV-05 | Footer with contact info, legal links (privacy policy), and social links | `<footer>` element in layout with placeholder links. Translated via next-intl. |
| I18N-04 | Language toggle in navigation labeled "ES" / "EN" (not flags) | Text-only toggle using `useLocale()` to determine current locale, displays opposite locale label as link. |
| TECH-08 | 404 page in both languages | Three-file pattern: root `not-found.tsx`, `[locale]/not-found.tsx` with translations, `[locale]/[...rest]/page.tsx` catch-all calling `notFound()`. |
</phase_requirements>

## Standard Stack

### Core (already installed -- no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.x | App Router layouts, shared layout wrapping all pages | Layout file convention renders header/footer on every page automatically. |
| React | 19.2.x | `useState` for hamburger toggle, `useEffect` for body scroll lock | Client Components for interactive navigation. |
| Tailwind CSS | 4.1.x | All styling: sticky header, responsive breakpoints, transitions, flex/grid layouts | `sticky top-0 z-50`, `md:hidden`, `transition-all duration-300`, responsive utilities. |
| next-intl | 4.8.x | Locale-aware `Link`, `usePathname`, `useLocale`, translations for nav/footer/404 | Built-in locale prefix handling. `Link` with `locale` prop for language switcher. |
| clsx + tailwind-merge | 2.1.x / 3.4.x | `cn()` utility for conditional classes (active link styling) | Already installed from Phase 1. |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none) | -- | -- | No new dependencies needed for Phase 2 |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| React `useState` for menu toggle | Headless UI / Radix | Overkill for a single hamburger toggle. `useState` + aria attributes is sufficient for a 4-link menu. |
| CSS transitions (Tailwind) | Framer Motion | Adds 40KB+ to bundle. Tailwind `transition-all duration-300` is enough for menu slide. |
| next-intl `Link` locale prop | `useRouter().replace()` with locale | `Link` is simpler for a toggle that navigates to the same page in another locale. `useRouter` is for programmatic cases. |
| Inline SVG hamburger icon | lucide-react / heroicons | A 3-bar hamburger is trivial SVG (3 lines). No icon library needed for a single icon. |

**Installation:**
```bash
# No new packages needed. Everything is in place from Phase 1.
```

## Architecture Patterns

### Recommended Project Structure (Phase 2 additions)

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx           # MODIFY: Add Header + Footer wrapping {children}
│   │   ├── page.tsx             # MODIFY: Simplify (layout now handles shell)
│   │   ├── not-found.tsx        # NEW: Localized 404 page
│   │   ├── bio/
│   │   │   └── page.tsx         # NEW: Stub page (NAV-01)
│   │   ├── services/
│   │   │   └── page.tsx         # NEW: Stub page (NAV-01)
│   │   ├── contact/
│   │   │   └── page.tsx         # NEW: Stub page (NAV-01)
│   │   └── [...rest]/
│   │       └── page.tsx         # NEW: Catch-all → notFound() (TECH-08)
│   ├── layout.tsx               # KEEP: Root passthrough (no changes)
│   ├── not-found.tsx            # MODIFY: Styled root 404 fallback
│   └── page.tsx                 # KEEP: Redirect to default locale
├── components/
│   ├── layout/
│   │   ├── header.tsx           # NEW: Sticky nav with hamburger + language toggle
│   │   ├── footer.tsx           # NEW: Footer with contact/legal/social
│   │   ├── mobile-nav.tsx       # NEW: Mobile menu overlay/drawer (or inline in header)
│   │   └── language-toggle.tsx  # NEW: ES/EN toggle component
│   └── ui/
│       └── (future components)
├── i18n/
│   ├── routing.ts               # KEEP: No changes
│   ├── navigation.ts            # KEEP: No changes
│   └── request.ts               # KEEP: No changes
└── styles/
    └── globals.css              # MODIFY: Add scroll-padding-top for sticky header
```

### Pattern 1: Shared Layout Shell

**What:** Place `<Header>` and `<Footer>` inside `[locale]/layout.tsx` so every page inherits the navigation shell without repeating it.
**When to use:** Always -- this is the core deliverable of Phase 2.
**Source:** Next.js App Router layout convention (https://nextjs.org/docs/app/getting-started/layouts-and-pages)

```typescript
// src/app/[locale]/layout.tsx
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextIntlClientProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Pattern 2: Sticky Navigation Header

**What:** A `<header>` with `sticky top-0 z-50` that stays visible as the user scrolls. Contains logo/home link, navigation links, and language toggle.
**When to use:** NAV-02.
**Source:** Standard Tailwind CSS pattern, verified across multiple sources.

```typescript
// src/components/layout/header.tsx
'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
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

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
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
            <span className={cn(
              'block h-0.5 w-6 bg-foreground transition-transform duration-300',
              mobileMenuOpen && 'translate-y-2 rotate-45'
            )} />
            <span className={cn(
              'block h-0.5 w-6 bg-foreground transition-opacity duration-300',
              mobileMenuOpen && 'opacity-0'
            )} />
            <span className={cn(
              'block h-0.5 w-6 bg-foreground transition-transform duration-300',
              mobileMenuOpen && '-translate-y-2 -rotate-45'
            )} />
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
```

**Key design decisions in this pattern:**
- Language toggle is OUTSIDE the hamburger menu (always visible per NAV-04, I18N-04)
- Active link detection uses `usePathname()` from next-intl (returns path without locale prefix)
- Hamburger icon animates to X using CSS transforms on 3 `<span>` elements
- Mobile menu uses `max-h-0/max-h-64` + `opacity` transition for smooth open/close
- `backdrop-blur-sm` gives the header a frosted glass effect over scrolled content

### Pattern 3: Language Toggle with next-intl Link

**What:** A simple anchor that navigates to the current page in the opposite locale, using next-intl's `Link` component with the `locale` prop.
**When to use:** I18N-04. Must be visible on all viewport sizes (not collapsed into hamburger).
**Source:** next-intl Navigation APIs docs (https://next-intl.dev/docs/routing/navigation)

```typescript
// Within the Header component:
const locale = useLocale();
const pathname = usePathname();
const otherLocale = locale === 'es' ? 'en' : 'es';

<Link href={pathname} locale={otherLocale}>
  {otherLocale.toUpperCase()}
</Link>
```

**How it works:**
1. `useLocale()` returns `'es'` or `'en'` (the current locale)
2. `usePathname()` returns the path without locale prefix (e.g., `/bio`, not `/es/bio`)
3. `Link` with `locale={otherLocale}` navigates to the same path in the opposite locale
4. next-intl automatically updates the `NEXT_LOCALE` cookie when clicking this link
5. The label shows the TARGET locale (`"EN"` when on Spanish, `"ES"` when on English)

### Pattern 4: Localized 404 Page (Three-File Pattern)

**What:** Three files work together to show a styled, translated 404 page for any unmatched URL within a locale segment.
**When to use:** TECH-08.
**Source:** next-intl error files docs (https://next-intl.dev/docs/environments/error-files)

**File 1: `src/app/[locale]/[...rest]/page.tsx`** -- Catch-all that triggers 404
```typescript
import { notFound } from 'next/navigation';

export default function CatchAllPage() {
  notFound();
}
```

**File 2: `src/app/[locale]/not-found.tsx`** -- Localized 404 content
```typescript
import { useTranslations } from 'next-intl';

export default function NotFoundPage() {
  const t = useTranslations('notFound');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg text-muted">{t('message')}</p>
      <a href="/" className="mt-8 text-accent hover:text-accent-dark transition-colors font-medium">
        {t('backHome')}
      </a>
    </div>
  );
}
```

**File 3: `src/app/not-found.tsx`** -- Root fallback (non-locale paths)
```typescript
'use client';

export default function RootNotFound() {
  return (
    <html lang="es">
      <body>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="mt-4 text-gray-500">Page not found / Pagina no encontrada</p>
          </div>
        </div>
      </body>
    </html>
  );
}
```

**How the flow works:**
1. User visits `/es/nonexistent` --> matches `[locale]/[...rest]/page.tsx` --> calls `notFound()` --> renders `[locale]/not-found.tsx` with locale context (translated)
2. User visits `/nonexistent` --> proxy.ts redirects to `/es/nonexistent` (or `/en/nonexistent`) --> same flow as above
3. User visits something that bypasses proxy entirely (e.g., bad request) --> renders root `not-found.tsx` (bilingual fallback)

### Pattern 5: Active Link Styling

**What:** Highlight the current page link in the navigation using `usePathname()` from next-intl.
**When to use:** Always in navigation components.
**Source:** next-intl Navigation APIs (https://next-intl.dev/docs/routing/navigation)

```typescript
'use client';

import { usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

// usePathname() returns '/' for home, '/bio' for bio, etc. (no locale prefix)
const pathname = usePathname();

<Link
  href="/bio"
  className={cn(
    'text-sm font-medium',
    pathname === '/bio' ? 'text-accent' : 'text-foreground'
  )}
>
  Bio
</Link>
```

### Pattern 6: Footer Component

**What:** A `<footer>` element with contact info, privacy policy link placeholder, and social link placeholders, translated via next-intl.
**When to use:** NAV-05.

```typescript
// src/components/layout/footer.tsx
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
            <Link href="/privacy" className="text-sm text-muted hover:text-foreground transition-colors">
              {t('legal.privacy')}
            </Link>
          </div>

          {/* Social links (placeholders) */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-3">
              {t('social.title')}
            </h3>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">
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
```

### Anti-Patterns to Avoid

- **Putting the language toggle inside the hamburger menu:** NAV-04 and I18N-04 require the toggle to be visible on ALL viewport sizes. It must be outside the collapsible menu, next to the hamburger button on mobile.
- **Using `useRouter().replace()` for language toggle instead of `Link`:** The `Link` component is simpler and gives proper anchor semantics (`<a>` tag) which is better for accessibility and crawlability. `useRouter` is for programmatic navigation (e.g., form redirects).
- **Making the entire header a Client Component tree:** Only the interactive parts (hamburger toggle, active link detection) need `'use client'`. The footer can be a Server Component using `getTranslations` from `next-intl/server` if no interactivity is needed. However, since `useTranslations` works in both contexts when inside `NextIntlClientProvider`, using it in a non-async component is fine.
- **Forgetting `generateStaticParams` on stub pages:** Every new page under `[locale]/` must export `generateStaticParams()` and call `setRequestLocale(locale)` for static generation to work.
- **Using `position: fixed` instead of `position: sticky`:** Fixed positioning removes the element from document flow, requiring manual padding on `<main>`. Sticky positioning keeps the header in flow while making it stick on scroll -- simpler and more reliable.
- **Forgetting scroll-padding-top on html:** When the header is sticky and the page has anchor links, content can scroll behind the header. Adding `scroll-pt-[header-height]` to `<html>` prevents this.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Locale-aware navigation links | Custom `<a>` tags with manual `/es/bio` prefixes | next-intl `Link` from `@/i18n/navigation` | Automatically adds locale prefix, handles `hreflang`, updates cookie. |
| Active link detection | Manual URL parsing to extract locale and compare paths | `usePathname()` from next-intl | Returns path WITHOUT locale prefix. Compare directly: `pathname === '/bio'`. |
| Language switcher | Custom cookie manipulation + page reload | `<Link href={pathname} locale={otherLocale}>` | One line. Handles cookie, URL rewrite, and navigation in a single component. |
| Mobile menu animation | JavaScript-driven height calculation + requestAnimationFrame | `max-h-0`/`max-h-64` + Tailwind `transition-all duration-300` | CSS-only animation. No JS measurement needed. Smooth and performant. |
| Hamburger icon animation | Separate SVG sprites for open/closed states | Three `<span>` elements with CSS transforms | Tiny DOM footprint. Animates from bars to X using `rotate-45` and `translate-y`. |
| Localized 404 page | Custom error boundary + locale detection | next-intl catch-all + `not-found.tsx` pattern | Official pattern. Handles locale context automatically. |

**Key insight:** The navigation shell requires zero new npm dependencies. React `useState` + Tailwind CSS transitions + next-intl navigation APIs cover all requirements. Adding libraries for this scope would be over-engineering.

## Common Pitfalls

### Pitfall 1: Mobile Menu Not Closing on Navigation

**What goes wrong:** User taps a link in the mobile menu, navigates to the new page, but the hamburger menu stays open.
**Why it happens:** Client-side navigation in Next.js does not trigger a full page reload. The `useState` value persists across navigation.
**How to avoid:** Add `onClick={() => setMobileMenuOpen(false)}` to every nav link inside the mobile menu. This closes the menu before navigation occurs.
**Warning signs:** On mobile, tapping a link navigates but the overlay stays visible on the next page.

### Pitfall 2: Body Scroll When Mobile Menu is Open

**What goes wrong:** While the mobile menu overlay is visible, the user can still scroll the page content behind it.
**Why it happens:** The overlay is positioned on top of the page, but the body scroll is not locked.
**How to avoid:** Toggle `overflow-hidden` on `<body>` when the mobile menu is open. Use a `useEffect` cleanup to restore scroll on unmount or close:
```typescript
useEffect(() => {
  if (mobileMenuOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  return () => { document.body.style.overflow = ''; };
}, [mobileMenuOpen]);
```
**Note:** This is only necessary if the mobile menu is a full-screen overlay. If it is a collapsible panel within the header (sliding down), body scroll lock is NOT needed because the menu is part of the normal flow.
**Warning signs:** Page scrolls behind the menu overlay on mobile.

### Pitfall 3: Missing `generateStaticParams` on New Stub Pages

**What goes wrong:** Build fails or pages render dynamically (server-side) instead of statically.
**Why it happens:** Each page under `[locale]/` needs `generateStaticParams` to enumerate locale values for static generation.
**How to avoid:** Use this template for every new page:
```typescript
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PageName({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  // ...
}
```
**Warning signs:** Build output shows lambda symbol instead of circle for pages that should be static.

### Pitfall 4: Catch-All Route Interfering with Valid Routes

**What goes wrong:** The `[...rest]` catch-all matches valid routes like `/es/bio`, causing them to 404.
**Why it happens:** Next.js route matching gives priority to more specific segments over catch-all segments. A file at `[locale]/bio/page.tsx` is more specific than `[locale]/[...rest]/page.tsx`. However, if the specific page file is missing or incorrectly placed, the catch-all wins.
**How to avoid:** Create all stub pages BEFORE adding the catch-all route. Verify each page loads correctly. The catch-all should be the LAST thing added.
**Warning signs:** Valid pages return 404 after adding the catch-all.

### Pitfall 5: Hamburger Menu Inaccessible to Screen Readers

**What goes wrong:** Screen reader users cannot discover or operate the mobile menu. The button has no label, and the expanded/collapsed state is not announced.
**Why it happens:** Missing `aria-expanded`, `aria-controls`, and `aria-label` attributes on the hamburger button.
**How to avoid:** Always include these attributes:
```tsx
<button
  aria-expanded={mobileMenuOpen}
  aria-controls="mobile-menu"
  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
>
```
Also add `role="navigation"` and `aria-label` to the `<nav>` element. Support Escape key to close the menu.
**Warning signs:** Lighthouse accessibility audit flags "Buttons do not have an accessible name" or "ARIA attributes do not match their roles."

### Pitfall 6: Sticky Header Breaks with overflow: hidden Ancestor

**What goes wrong:** The header does not stick to the top of the viewport during scroll. It scrolls away with the rest of the content.
**Why it happens:** `position: sticky` requires no ancestor between the sticky element and the scroll container to have `overflow: hidden`, `overflow: scroll`, or `overflow: auto`.
**How to avoid:** Do not set `overflow: hidden` on `<body>`, `<main>`, or any wrapper between `<header>` and the scroll container. If overflow clipping is needed, use `overflow-x-clip` (CSS `overflow-x: clip`) which clips without creating a scroll container.
**Warning signs:** Header scrolls out of view despite having `sticky top-0` classes.

### Pitfall 7: Touch Targets Too Small on Navigation Links

**What goes wrong:** Mobile users struggle to tap navigation links, especially in the collapsed hamburger menu.
**Why it happens:** Default link sizing may be smaller than 44x44px.
**How to avoid:** Phase 1 already set a global base rule: `button, a, [role="button"] { min-h-[44px] min-w-[44px] }`. Verify all nav links inherit this. For the mobile menu, add generous vertical padding (`py-3` or more).
**Warning signs:** Lighthouse flags "Tap targets are not sized appropriately."

## Code Examples

Verified patterns from official sources:

### Translation Keys for Navigation and Footer

```json
// messages/es.json (additions for Phase 2)
{
  "common": {
    "nav": {
      "home": "Inicio",
      "bio": "Bio",
      "services": "Servicios",
      "contact": "Contacto"
    }
  },
  "footer": {
    "contact": {
      "title": "Contacto",
      "email": "hola@mgripe.com"
    },
    "legal": {
      "title": "Legal",
      "privacy": "Politica de privacidad"
    },
    "social": {
      "title": "Redes"
    },
    "copyright": "Todos los derechos reservados."
  },
  "notFound": {
    "title": "Pagina no encontrada",
    "message": "Lo sentimos, la pagina que buscas no existe.",
    "backHome": "Volver al inicio"
  }
}
```

```json
// messages/en.json (additions for Phase 2)
{
  "common": {
    "nav": {
      "home": "Home",
      "bio": "Bio",
      "services": "Services",
      "contact": "Contact"
    }
  },
  "footer": {
    "contact": {
      "title": "Contact",
      "email": "hello@mgripe.com"
    },
    "legal": {
      "title": "Legal",
      "privacy": "Privacy policy"
    },
    "social": {
      "title": "Social"
    },
    "copyright": "All rights reserved."
  },
  "notFound": {
    "title": "Page not found",
    "message": "Sorry, the page you are looking for does not exist.",
    "backHome": "Back to home"
  }
}
```

### Stub Page Template

```typescript
// src/app/[locale]/bio/page.tsx (same pattern for services, contact)
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function BioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold">Bio</h1>
        <p className="mt-4 text-muted">Content coming in Phase 4.</p>
      </div>
    </section>
  );
}
```

### Scroll Padding for Sticky Header

```css
/* Addition to src/styles/globals.css */
@layer base {
  html {
    @apply scroll-pt-16; /* 4rem = approximate header height */
  }
}
```

### Escape Key to Close Mobile Menu

```typescript
// Inside Header component
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };
  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, [mobileMenuOpen]);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate `Navbar` component per page | App Router `layout.tsx` with shared components | Next.js 13+ (2023) | Layout shell is automatic -- no prop drilling or repeated imports. |
| CSS-only hamburger (checkbox hack) | React `useState` + CSS transitions | React 18+ (standard) | Better accessibility (aria attributes), easier state management. |
| Icon libraries for hamburger (Font Awesome, etc.) | Inline SVG or CSS-drawn bars | 2023+ best practice | Zero dependency, smaller bundle, full animation control. |
| `position: fixed` + body padding for header | `position: sticky` | CSS native (widely supported) | Stays in document flow. No manual padding needed. Simpler. |
| JavaScript scroll-to offset for anchor links | `scroll-padding-top` CSS property | CSS native (widely supported) | One line of CSS. No JS needed. |
| Flags for language toggle | Text labels "ES" / "EN" | UX best practice | Flags are ambiguous (which Spanish flag?), text is universal and accessible. |

**Deprecated/outdated:**
- Using `middleware.ts` for locale routing: Renamed to `proxy.ts` in Next.js 16
- Using `next/router` (Pages Router): Use `useRouter` from `@/i18n/navigation` (App Router)
- Checkbox hack for hamburger menu: Poor accessibility, complex CSS, no screen reader support

## Open Questions

1. **Header height value for scroll-padding-top**
   - What we know: The header height depends on padding, font size, and content. Tailwind `scroll-pt-16` (4rem = 64px) is a common default.
   - What's unclear: The exact header height after styling is applied.
   - Recommendation: Start with `scroll-pt-16` (64px). Adjust after the header is built if the actual height differs. This is a single token change.

2. **Mobile menu style: slide-down panel vs full-screen overlay**
   - What we know: With only 4 nav links, a full-screen overlay is excessive. A slide-down panel beneath the header is simpler and more proportional.
   - What's unclear: User preference for menu animation style.
   - Recommendation: Use a slide-down panel (the `max-h` transition pattern shown in code examples). It keeps the page visible behind the menu, is lighter on JS, and does not require body scroll lock.

3. **Footer contact email**
   - What we know: The footer needs contact info (NAV-05). The actual email address is not confirmed.
   - What's unclear: Whether to use a real email or placeholder.
   - Recommendation: Use a placeholder `hola@mgripe.com` / `hello@mgripe.com` in translation files. Owner can update before launch.

4. **Social media links in footer**
   - What we know: NAV-05 requires social link placeholders.
   - What's unclear: Which platforms (LinkedIn, GitHub, Twitter/X?).
   - Recommendation: Add LinkedIn and GitHub as placeholders with `href="#"`. Owner will provide real URLs later. The structure supports adding more links trivially.

## Sources

### Primary (HIGH confidence)
- next-intl error files docs: https://next-intl.dev/docs/environments/error-files -- localized 404 pattern, catch-all route, root not-found
- next-intl navigation APIs: https://next-intl.dev/docs/routing/navigation -- Link locale prop, usePathname, useRouter for locale switching
- next-intl server/client components: https://next-intl.dev/docs/environments/server-client-components -- useLocale, useTranslations in Client Components
- Next.js App Router layouts: https://nextjs.org/docs/app/getting-started/layouts-and-pages -- shared layout convention
- Next.js generateStaticParams: https://nextjs.org/docs/app/api-reference/functions/generate-static-params -- static generation for dynamic routes
- Tailwind CSS theme docs: https://tailwindcss.com/docs/theme -- design tokens, scroll-padding utilities

### Secondary (MEDIUM confidence)
- MDN aria-expanded reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/menu_role -- accessible menu patterns
- W3C WAI mobile menus: https://w3c.github.io/wai-mobile-intro/mobile/mobile-menus/ -- WCAG-compliant mobile navigation
- Accessible hamburger menu patterns: https://a11ymatters.com/pattern/mobile-nav/ -- aria attributes for hamburger menus
- Tailwind sticky header patterns: multiple verified sources confirming `sticky top-0 z-50` as standard approach

### Tertiary (LOW confidence)
- None -- all findings verified with primary or secondary sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- No new dependencies. All tools already installed and verified in Phase 1.
- Architecture: HIGH -- Layout shell, sticky nav, and 404 patterns are official Next.js and next-intl documented patterns with exact code examples.
- Pitfalls: HIGH -- Pitfalls drawn from official docs (catch-all route priority), accessibility standards (WCAG aria attributes), and well-documented CSS behavior (sticky + overflow).

**Research date:** 2026-02-18
**Valid until:** 2026-03-18 (stable ecosystem, 30-day validity)
