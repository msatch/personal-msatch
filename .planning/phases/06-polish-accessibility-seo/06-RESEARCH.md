# Phase 6: Polish, Accessibility & SEO - Research

**Researched:** 2026-02-24
**Domain:** Micro-interactions, SEO metadata, WCAG AA accessibility, performance optimization, privacy policy
**Confidence:** HIGH

## Summary

Phase 6 covers five distinct but complementary domains: subtle micro-interactions (hover states, scroll reveals, page transitions), per-page localized SEO metadata, WCAG AA accessibility (contrast, keyboard nav, focus indicators, form labels), a bilingual privacy policy page, and performance optimization targeting sub-2.5s mobile LCP.

The existing codebase is well-structured for these improvements. The site already uses semantic HTML sections, has `aria-*` attributes on interactive elements (form, hamburger menu, WhatsApp button), and leverages `generateMetadata` in the locale layout for global title/description. The main gaps are: no per-page metadata (bio, services, contact pages inherit from layout), no visible focus indicators beyond browser defaults, no scroll reveal animations, no privacy policy page, and no audit of color contrast ratios for the OKLCH accent color against various backgrounds.

**Primary recommendation:** Split this phase into three plans: (1) Micro-interactions and visual polish, (2) Per-page SEO metadata + privacy policy page, (3) Accessibility audit and fixes + performance verification.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DES-05 | Subtle micro-interactions (hover states on CTAs, smooth page transitions) | Scroll reveal via custom useInView hook + IntersectionObserver, enhanced hover/transition states on CTAs and cards, Next.js 16 experimental viewTransition for page transitions |
| TECH-05 | Basic SEO: semantic HTML, title tags, meta descriptions per page per locale | Per-page generateMetadata using next-intl getTranslations with page-specific namespace, add metadata translation keys to es.json/en.json |
| TECH-06 | Accessibility baseline: AA contrast, keyboard navigation, focus indicators, semantic structure | Global focus-visible ring styles in globals.css, contrast verification of oklch accent color, skip-to-content link, aria-label audit |
| TECH-07 | Privacy policy page in both languages | New /privacy route with bilingual content via translation JSON, consulting-specific privacy policy covering contact form data, email processing |
| TECH-09 | Fast performance: LCP < 2.5s on mobile, minimal JS bundle | Already mostly static (Server Components), verify bundle size, audit client components, check font loading strategy |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.1.6 | Framework with App Router, generateMetadata, viewTransition | Already in project |
| next-intl | ^4.8.3 | i18n with getTranslations for localized metadata | Already in project |
| tailwindcss | ^4 | Utility-first CSS with focus-visible, transition, animation utilities | Already in project |
| clsx + tailwind-merge | ^2.1.1 / ^3.4.1 | Conditional class composition via cn() utility | Already in project |

### No New Dependencies Needed

This phase requires **zero new npm packages**. All features can be implemented with:
- Native CSS for animations and transitions
- Native IntersectionObserver API for scroll reveals
- Tailwind CSS 4 utilities for focus indicators and hover states
- Next.js built-in generateMetadata for SEO
- next-intl getTranslations for localized metadata
- Standard React hooks (useEffect, useRef, useState) for the useInView hook

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom useInView hook | react-intersection-observer npm package | Adds dependency for 15 lines of custom code; not worth it for this simple use case |
| CSS transitions for scroll reveal | Framer Motion | Massive bundle increase (30+ KB); overkill for fade-in-on-scroll |
| Custom privacy policy | Generator service (getterms.io, iubenda) | External dependency; simple static page is better for a consulting site with minimal data collection |

## Architecture Patterns

### Per-Page Metadata Pattern (TECH-05)

Each page file exports its own `generateMetadata` alongside the page component. The locale layout already does this for global metadata; individual pages override with page-specific titles and descriptions.

```typescript
// src/app/[locale]/bio/page.tsx
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.bio' });
  return {
    title: t('title'),
    description: t('description'),
  };
}
```

Translation JSON structure addition:
```json
{
  "metadata": {
    "title": "M. Gripe | Consultoria Tecnica y de Negocios",
    "description": "...",
    "bio": {
      "title": "Bio | M. Gripe",
      "description": "Consultor tecnico senior..."
    },
    "services": {
      "title": "Servicios | M. Gripe",
      "description": "Asesoria tecnica estrategica..."
    },
    "contact": {
      "title": "Contacto | M. Gripe",
      "description": "Agenda tu diagnostico..."
    },
    "privacy": {
      "title": "Politica de Privacidad | M. Gripe",
      "description": "..."
    }
  }
}
```

### Scroll Reveal Pattern (DES-05)

Custom `useInView` hook using IntersectionObserver, paired with Tailwind transition classes:

```typescript
// src/hooks/use-in-view.ts
'use client';

import { useEffect, useRef, useState } from 'react';

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element); // Only animate once
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}
```

Wrapper component for sections:

```typescript
// src/components/ui/scroll-reveal.tsx
'use client';

import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function ScrollReveal({ children, className }: Props) {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className
      )}
    >
      {children}
    </div>
  );
}
```

**Critical:** Must respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  .transition-all {
    transition-duration: 0.01ms !important;
  }
}
```

### Enhanced Hover States Pattern (DES-05)

CTA buttons already have `hover:bg-accent-dark transition-colors`. Enhance with scale transform and shadow:

```typescript
// Enhanced CTA pattern
className="... transition-all duration-200 hover:bg-accent-dark hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"

// Service card hover pattern (already partially done)
className="... transition-all duration-200 hover:border-accent hover:shadow-md hover:-translate-y-1"
```

### Page Transitions (DES-05)

Next.js 16 supports experimental View Transitions. Enable in config:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
};
```

**Caveat:** This is marked as experimental and "not recommended for production" in Next.js 16.1.6 docs. The recommendation is to add the config flag but keep transitions minimal (cross-fade only). The feature triggers automatically on client-side navigations. If it causes any issues, it can be removed without code changes.

An alternative is to skip `viewTransition` entirely and rely on CSS transitions within page content (scroll reveals) for the "smooth transitions" requirement. This is the safer path.

### Focus Indicators Pattern (TECH-06)

Add global focus-visible styles in globals.css:

```css
@layer base {
  /* Focus indicators for keyboard navigation (TECH-06) */
  :focus-visible {
    @apply outline-2 outline-offset-2 outline-accent;
  }

  /* Remove default outline, rely on focus-visible */
  :focus:not(:focus-visible) {
    outline: none;
  }
}
```

### Skip-to-Content Link (TECH-06)

Standard accessibility pattern for keyboard users:

```typescript
// In locale layout, before <Header />
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-md"
>
  {t('skipToContent')}
</a>

// On <main> element
<main id="main-content" className="flex-1">
```

### Privacy Policy Page Structure (TECH-07)

```
src/app/[locale]/privacy/page.tsx    # Page with generateMetadata + generateStaticParams
messages/es.json -> privacy: { ... }  # Spanish privacy policy content
messages/en.json -> privacy: { ... }  # English privacy policy content
```

The privacy policy for a consulting site with a contact form needs to cover:
1. What data is collected (name, email, company, message)
2. How data is used (to respond to inquiries)
3. How data is processed (Resend email service)
4. Data retention policy
5. User rights (access, deletion)
6. Contact information for privacy questions

### Anti-Patterns to Avoid
- **Animation library dependency:** Do NOT add Framer Motion, GSAP, or any animation library. CSS transitions + IntersectionObserver covers all requirements with zero bundle cost.
- **Overriding browser focus styles without replacement:** Always provide visible focus-visible indicators before removing default outlines.
- **Animating layout properties:** Only animate `opacity` and `transform` for scroll reveals. Never animate `width`, `height`, `margin`, `padding` (causes layout thrashing and poor LCP).
- **Client Components for metadata:** generateMetadata MUST be in Server Components. Never use `useTranslations` for metadata.
- **Blocking animations:** Never use animations that block content visibility on initial load. Scroll reveals should only affect content below the fold.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Color contrast calculation | Manual hex-to-ratio math | WebAIM Contrast Checker or browser DevTools | Rounding errors in manual OKLCH-to-sRGB conversion; use tools |
| Privacy policy legal text | Write from scratch | Template-based approach with consulting-specific sections | Legal compliance needs proper structure; adapt a template |
| Bundle analysis | Guessing which imports are heavy | `@next/bundle-analyzer` or `npx next build` output | Built-in build output shows page sizes, JS bundle breakdown |
| Focus management for modals/menus | Custom focus trap code | Existing HTML dialog element patterns, or the already-implemented Escape key handler | The hamburger menu already handles Escape; focus trapping is only needed for true modal dialogs (none in this site) |

**Key insight:** This phase is primarily about CSS additions and content (translations), not new JavaScript logic. The only new JS is the ~15-line useInView hook. Everything else is configuration, CSS, and translation JSON content.

## Common Pitfalls

### Pitfall 1: Accent Color Contrast on White Background
**What goes wrong:** The accent color `oklch(0.55 0.15 250)` may not meet 4.5:1 contrast ratio against white `#ffffff` for normal text, or 3:1 for large text and UI components.
**Why it happens:** OKLCH lightness of 0.55 is mid-range; the resulting blue might be too light for small text on white.
**How to avoid:** Before any work begins, verify the contrast ratio using WebAIM Contrast Checker or browser DevTools. The approximate hex of `oklch(0.55 0.15 250)` is in the `#2E6CC0` range (medium blue). This should pass AA for normal text (contrast ~5:1 against white) but must be verified. If it fails, darken to `oklch(0.45 0.15 250)`.
**Warning signs:** Lighthouse accessibility audit flags contrast issues.

### Pitfall 2: Accent Color on Dark Backgrounds
**What goes wrong:** The CTA band uses `bg-foreground` (#0a0a0a) with white text and accent-colored buttons. The accent button text is white (`text-white`) on accent background -- this needs checking too.
**Why it happens:** White text on the accent color needs 4.5:1 contrast as well.
**How to avoid:** Verify white (#ffffff) on accent meets 4.5:1 contrast. At oklch(0.55 ...) this should pass, but verify.
**Warning signs:** CTA buttons fail automated accessibility scans.

### Pitfall 3: The text-muted Color (#6b7280) on White
**What goes wrong:** `text-muted` (#6b7280) on `bg-background` (#ffffff) has a contrast ratio of approximately 4.6:1 -- this barely passes AA for normal text (4.5:1 minimum) but could fail after rounding.
**Why it happens:** Gray-on-white is the most common accessibility failure on the web.
**How to avoid:** Verify this specific pair. If it's borderline, darken `--color-muted` slightly to `#5b6370` (which would give ~5.5:1).
**Warning signs:** Some automated tools round differently and flag it.

### Pitfall 4: Scroll Reveal Hiding Content from Search Engines
**What goes wrong:** If scroll reveal sets `opacity: 0` in CSS (not just classes), search engines might consider content hidden.
**Why it happens:** Google historically penalized hidden content.
**How to avoid:** Use the Tailwind class approach (not inline styles), and ensure the `opacity-0` is only applied via JavaScript after hydration. Server-rendered HTML should show content at full opacity. The `useInView` hook only runs client-side, so SSR output will show the `opacity-0 translate-y-8` classes. However, since this is a statically generated site, Googlebot renders JavaScript. The safest approach: use `noscript`-friendly initial state or accept that modern Googlebot handles this correctly.
**Warning signs:** Content appears blank in Google cache or "View Page Source."

### Pitfall 5: Touch Target Size Regression
**What goes wrong:** The existing global rule `button, a, [role="button"] { @apply min-h-[44px] min-w-[44px]; }` might cause layout issues with inline text links or footer links.
**Why it happens:** Applying min-width/min-height to ALL anchor elements is aggressive; small inline links get oversized tap targets.
**How to avoid:** Audit the current rendering. If footer social links or inline text links look oddly spaced, this rule may need scoping to only navigation/CTA links. However, since the site has been built through 5 phases without reported issues, this is likely fine.
**Warning signs:** Unusually large click targets on text-only links.

### Pitfall 6: viewTransition Breaking Static Export
**What goes wrong:** Enabling experimental.viewTransition might cause build warnings or runtime errors.
**Why it happens:** It's an experimental feature in Next.js 16.1.6.
**How to avoid:** Add the flag, run a full build, and verify no errors. If issues arise, remove the flag -- the site's smooth experience comes from scroll reveals, not page transitions. Consider this a nice-to-have.
**Warning signs:** Build warnings about experimental features, console errors during navigation.

### Pitfall 7: Missing Form Label Association
**What goes wrong:** Screen readers cannot associate labels with form fields.
**Why it happens:** Missing `for`/`id` pairing or missing labels.
**How to avoid:** The existing contact form already uses proper `htmlFor`/`id` pairing and `aria-required`, `aria-invalid`, `aria-describedby` attributes. Verify this is correct during the accessibility audit. The select field for service interest should be confirmed to have proper labeling.
**Warning signs:** aXe or Lighthouse flags "Form elements do not have associated labels."

## Code Examples

### Per-Page Metadata with next-intl (Verified Pattern)
```typescript
// Source: next-intl official docs + existing project pattern in [locale]/layout.tsx
// Apply to each page: bio/page.tsx, services/page.tsx, contact/page.tsx, privacy/page.tsx

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.bio' });
  return {
    title: t('title'),
    description: t('description'),
  };
}
```

### Global Focus Indicator Styles
```css
/* Source: WCAG 2.2 SC 2.4.7 Focus Visible + SC 2.4.11 Focus Appearance */
@layer base {
  *:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  /* Respect reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

### Privacy Policy Page
```typescript
// src/app/[locale]/privacy/page.tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';

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

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('privacy');

  return (
    <article className="px-4 py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl prose prose-neutral">
        <h1>{t('title')}</h1>
        <p className="text-muted">{t('lastUpdated')}</p>
        {/* Render sections from translation keys */}
      </div>
    </article>
  );
}
```

### Scroll Reveal Wrapper
```typescript
// src/components/ui/scroll-reveal.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function ScrollReveal({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) {
      setIsInView(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Framer Motion for scroll animations | CSS transitions + IntersectionObserver | 2024-2025 | Zero bundle cost, same visual quality |
| :focus outline styling | :focus-visible with ring utilities | 2023+ (WCAG 2.2) | Keyboard-only indicators, no mouse flash |
| next-seo package for metadata | Built-in generateMetadata API | Next.js 13+ (2023) | No extra dependency needed |
| Page transition libraries (next-page-transitions) | Experimental View Transitions API | Next.js 16 (2025) | Native browser API, zero JS overhead |
| Manual viewport meta tags | Next.js automatic viewport handling | Next.js 14+ | Framework handles viewport, charset automatically |

**Deprecated/outdated:**
- `next-seo` package: Unnecessary since Next.js 13+ has built-in Metadata API
- Framer Motion for simple scroll reveals: Overkill; adds 30+ KB to bundle
- `middleware.ts` for locale detection: This project uses `proxy.ts` (Next.js 16 convention)

## Open Questions

1. **Exact accent color contrast ratio**
   - What we know: `oklch(0.55 0.15 250)` is approximately a medium blue, likely `#2E6CC0` or similar
   - What's unclear: Exact contrast ratio against white and against dark backgrounds
   - Recommendation: First task in implementation should be running contrast checks. If any pair fails AA, adjust the oklch lightness value. This is a 1-line CSS change.

2. **viewTransition stability**
   - What we know: Next.js 16.1.6 marks it as experimental and "not recommended for production"
   - What's unclear: Whether it causes any issues with static generation or next-intl routing
   - Recommendation: Try enabling it. If the build passes and navigations work, keep it. If any issue arises, remove it. The scroll reveals provide the primary "smooth transitions" experience.

3. **Privacy policy legal sufficiency**
   - What we know: The site collects name, email, company, message via contact form, processes via Resend
   - What's unclear: Whether any specific LatAm data protection laws (e.g., Mexico's LFPDPPP, Brazil's LGPD) require specific language
   - Recommendation: Create a professional but general privacy policy that covers standard data collection, usage, and rights. Flag to the client that legal review may be needed for specific market compliance. This is sufficient for v1 launch.

## Sources

### Primary (HIGH confidence)
- [Next.js viewTransition docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition) - Experimental flag configuration, caveats
- [Next.js generateMetadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) - Per-page metadata pattern
- [next-intl metadata docs](https://next-intl.dev/docs/environments/actions-metadata-route-handlers) - Localized metadata with getTranslations
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) - Accessibility for animations
- [Tailwind CSS state variants](https://tailwindcss.com/docs/hover-focus-and-other-states) - focus-visible, hover, active utilities

### Secondary (MEDIUM confidence)
- [Next.js accessibility guide](https://nextjs.org/docs/architecture/accessibility) - Built-in a11y features, ESLint plugin
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - Standard tool for contrast ratio verification
- [WCAG 2.2 Focus Appearance](https://www.wcag.com/designers/2-4-13-focus-appearance/) - Focus indicator requirements
- [Chrome entry/exit animations blog](https://developer.chrome.com/blog/entry-exit-animations) - @starting-style CSS feature
- [MDN IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) - Scroll detection API

### Tertiary (LOW confidence)
- Various Medium articles on LCP optimization patterns - General guidance, project-specific results will vary
- Privacy policy template services (getterms.io, termly.io) - Structure reference only, content must be customized

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - No new dependencies, all patterns verified against official docs
- Architecture: HIGH - generateMetadata pattern already exists in the codebase (locale layout), extending to pages
- Micro-interactions: HIGH - IntersectionObserver + CSS transitions is the standard zero-dependency approach
- Accessibility: HIGH - WCAG 2.2 AA requirements are well-documented; focus-visible is the modern standard
- Privacy policy: MEDIUM - Legal sufficiency depends on jurisdiction; technical implementation is straightforward
- Performance: HIGH - Site is already mostly Server Components with static generation; LCP should be well under 2.5s
- Pitfalls: HIGH - Color contrast verification is the main risk; all other patterns are well-established

**Research date:** 2026-02-24
**Valid until:** 2026-03-24 (30 days - stable domain, established patterns)
