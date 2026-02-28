# Architecture Research: v1.1 Integration

**Domain:** GA4/GTM analytics, cookie consent, and case study content integration into existing bilingual Next.js 16 consulting site
**Researched:** 2026-02-27
**Confidence:** HIGH

## Existing Architecture (v1.0 Baseline)

The site currently uses this stack and structure:

```
Next.js 16.1.6 (App Router) + React 19
next-intl 4.8.3 (proxy.ts + [locale] route segment)
Tailwind CSS 4 (@theme tokens)
Zod 4 (validation) + Resend (email)
Server Components by default, Client Components where needed
```

**Existing routes:** `/[locale]/` (home), `/[locale]/bio`, `/[locale]/services`, `/[locale]/contact`, `/[locale]/privacy`

**Existing Client Components:** Header, Footer, ContactForm, ScrollReveal, ThemeToggle, ThemeSync, WhatsAppButton

**Key integration constraint:** The `<html>` tag lives in `src/app/[locale]/layout.tsx`, not in the root layout (which is a pass-through). All new scripts and providers must be added to the locale layout.

---

## System Overview: v1.1 Additions

```
┌──────────────────────────────────────────────────────────────────────┐
│                     NEW: Cookie Consent Layer                         │
│  ┌───────────────────┐  ┌────────────────┐  ┌──────────────────┐    │
│  │ CookieConsent     │  │ consent-store  │  │ consent cookie   │    │
│  │ Banner (Client)   │→ │ (localStorage) │→ │ (cookie_consent) │    │
│  └────────┬──────────┘  └────────────────┘  └──────────────────┘    │
│           │ gtag('consent','update',...)                              │
│           ↓                                                           │
├──────────────────────────────────────────────────────────────────────┤
│                     NEW: Analytics Layer                               │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │
│  │ GTM Script       │  │ Consent Mode v2  │  │ Event Tracking   │    │
│  │ (next/script)    │  │ (default:denied) │  │ (sendGTMEvent)   │    │
│  └─────────────────┘  └──────────────────┘  └──────────────────┘    │
├──────────────────────────────────────────────────────────────────────┤
│                     NEW: Case Studies Content                         │
│  ┌───────────────┐  ┌─────────────────┐  ┌──────────────────────┐  │
│  │ /case-studies  │  │ case study data │  │ messages/*.json      │  │
│  │ page (Server)  │  │ (in messages)   │  │ + caseStudies ns     │  │
│  └───────────────┘  └─────────────────┘  └──────────────────────┘  │
├──────────────────────────────────────────────────────────────────────┤
│                     EXISTING: Presentation Layer                      │
│  ┌────────┐  ┌────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐  │
│  │ Home   │  │  Bio   │  │ Services │  │ Contact │  │ Privacy  │  │
│  └────────┘  └────────┘  └──────────┘  └─────────┘  └──────────┘  │
├──────────────────────────────────────────────────────────────────────┤
│                     EXISTING: i18n + Infrastructure                   │
└──────────────────────────────────────────────────────────────────────┘
```

## Component Map: New vs Modified

### NEW Components

| Component | Type | Location | Responsibility |
|-----------|------|----------|----------------|
| `CookieConsentBanner` | Client Component | `src/components/analytics/cookie-consent.tsx` | Renders consent UI, reads/writes consent state, calls `gtag('consent','update',...)` |
| `AnalyticsProvider` | Client Component | `src/components/analytics/analytics-provider.tsx` | Loads GTM script with consent defaults, exposes `trackEvent()` helper |
| `CaseStudyCard` | Server Component | `src/components/case-studies/case-study-card.tsx` | Renders one case study (problem/intervention/result) |
| `CaseStudiesSection` | Server Component | `src/components/case-studies/case-studies-section.tsx` | Renders all 3 case studies with heading and layout |

### MODIFIED Files

| File | Change | Why |
|------|--------|-----|
| `src/app/[locale]/layout.tsx` | Add `<AnalyticsProvider>` and `<CookieConsentBanner>` | GTM script must load early; consent banner must render on every page |
| `src/components/contact/contact-form.tsx` | Add event tracking calls | Track `form_start`, `form_submit`, `form_success` events |
| `src/components/home/hero-section.tsx` | Wrap CTA link in tracked component or add `onClick` | Track `cta_click` with location context |
| `src/components/home/cta-band.tsx` | Same as hero -- add CTA click tracking | Track `cta_click` events |
| `src/components/services/services-cta.tsx` | Same as above | Track `cta_click` events |
| `src/app/[locale]/page.tsx` | Add `<CaseStudiesSection>` import and placement | Case studies appear on homepage |
| `src/app/[locale]/privacy/page.tsx` | Update cookies section in translations | Must describe analytics cookies and consent mechanism |
| `messages/es.json` | Add `caseStudies`, `consent`, `analytics` namespaces | All new UI text |
| `messages/en.json` | Same as above | English translations |

### NEW Routes

| Route | File | Type |
|-------|------|------|
| None needed | -- | Case studies render as a section on existing pages, not a separate route |

---

## Architecture Pattern 1: Manual GTM with Consent Mode v2

### Why NOT use `@next/third-parties/google`

Research confirmed a critical limitation: `@next/third-parties/google` `GoogleTagManager` component has **no built-in consent mode support**. The `dataLayer` prop accepts initial data but does not reliably set consent defaults before GTM loads. Multiple GitHub discussions (vercel/next.js #64497, #66718, #67440) confirm this gap remains unresolved as of early 2026.

**Decision:** Use `next/script` with inline consent initialization instead. This is the approach recommended by the community and aligns with Google's official Consent Mode v2 documentation.

### Implementation

```typescript
// src/components/analytics/analytics-provider.tsx
'use client';

import Script from 'next/script';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export function AnalyticsProvider() {
  if (!GTM_ID) return null;

  return (
    <>
      {/* 1. Initialize dataLayer + set consent defaults BEFORE GTM loads */}
      <Script
        id="gtm-consent-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'wait_for_update': 500
            });
          `,
        }}
      />
      {/* 2. Load GTM container (respects consent defaults above) */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
    </>
  );
}
```

**Script loading order is critical:**
1. `beforeInteractive`: Consent defaults set (analytics denied)
2. `afterInteractive`: GTM loads, sees denied consent, holds all tags
3. User interacts with banner: `gtag('consent', 'update', ...)` fires
4. GTM releases held tags if consent granted

### Why this order matters

Google's official docs state: "The order of the code is vital -- if your consent code is called out of order, consent defaults will not work." The `beforeInteractive` strategy in Next.js ensures the consent default script runs before any other scripts, including GTM.

---

## Architecture Pattern 2: Cookie Consent State Machine

### Consent States

```
                 ┌──────────────┐
                 │  no_decision  │ ← Initial state (no cookie)
                 └──────┬───────┘
                        │ User sees banner
                 ┌──────┴───────┐
         ┌───────┤   banner_    ├───────┐
         │       │   visible    │       │
         ▼       └──────────────┘       ▼
  ┌──────────┐                   ┌──────────┐
  │ accepted │                   │ rejected │
  └──────────┘                   └──────────┘
         │                              │
         ▼                              ▼
  gtag('consent',                gtag('consent',
   'update', {                   'update', {
   analytics_storage:            analytics_storage:
   'granted'})                   'denied'})
```

### State persistence

- **Cookie:** `cookie_consent=accepted|rejected` with 1-year expiry. Readable server-side for future SSR decisions.
- **localStorage:** `cookie_consent_v1` stores the same value for faster client-side reads (avoids cookie parsing overhead in JS).
- **On page load:** Check cookie/localStorage. If value exists, apply stored consent and do not show banner. If no value, show banner.

### Component structure

```typescript
// src/components/analytics/cookie-consent.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

const CONSENT_KEY = 'cookie_consent_v1';
const CONSENT_COOKIE = 'cookie_consent';

type ConsentState = 'undecided' | 'accepted' | 'rejected';

export function CookieConsentBanner() {
  const t = useTranslations('consent');
  const [state, setState] = useState<ConsentState>('undecided');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentState | null;
    if (stored === 'accepted' || stored === 'rejected') {
      setState(stored);
      updateGtagConsent(stored);
      // Don't show banner
    } else {
      setVisible(true);
    }
  }, []);

  const handleChoice = useCallback((choice: 'accepted' | 'rejected') => {
    setState(choice);
    setVisible(false);
    localStorage.setItem(CONSENT_KEY, choice);
    // Set cookie for server-side access (1 year)
    document.cookie = `${CONSENT_COOKIE}=${choice};max-age=${365*24*60*60};path=/;SameSite=Lax`;
    updateGtagConsent(choice);
  }, []);

  if (!visible) return null;

  return (
    <div role="dialog" aria-label={t('ariaLabel')} /* ... styles ... */>
      <p>{t('message')}</p>
      <div>
        <button onClick={() => handleChoice('rejected')}>{t('reject')}</button>
        <button onClick={() => handleChoice('accepted')}>{t('accept')}</button>
      </div>
    </div>
  );
}

function updateGtagConsent(choice: ConsentState) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: choice === 'accepted' ? 'granted' : 'denied',
    });
  }
}
```

**Key design decisions:**
- Only `analytics_storage` needs consent granting (no ads on this site)
- `ad_storage`, `ad_user_data`, `ad_personalization` stay permanently denied
- Banner is a Client Component because it needs `useEffect`, `useState`, `localStorage`
- All text comes from `useTranslations('consent')` for bilingual support
- `role="dialog"` and `aria-label` for accessibility

---

## Architecture Pattern 3: Event Tracking Wrapper

### Problem

CTA links are currently Server Components (`HeroSection`, `CtaBand`). You cannot call `sendGTMEvent` from a Server Component. But converting entire sections to Client Components just for tracking wastes the SSR benefit.

### Solution: Tracked CTA Link (Client Component wrapper)

```typescript
// src/components/analytics/tracked-cta.tsx
'use client';

import { Link } from '@/i18n/navigation';
import { useCallback } from 'react';

type Props = {
  href: string;
  children: React.ReactNode;
  eventName?: string;
  eventLocation?: string;
  className?: string;
};

export function TrackedCTA({
  href,
  children,
  eventName = 'cta_click',
  eventLocation = 'unknown',
  className,
}: Props) {
  const handleClick = useCallback(() => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        cta_location: eventLocation,
        cta_url: href,
      });
    }
  }, [eventName, eventLocation, href]);

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
```

**Usage in Server Components:** Replace the `<Link>` CTA in HeroSection, CtaBand, and ServicesCta with `<TrackedCTA>`:

```typescript
// In hero-section.tsx (remains a Server Component)
import { TrackedCTA } from '@/components/analytics/tracked-cta';

export async function HeroSection() {
  const t = await getTranslations('home.hero');
  const tCommon = await getTranslations('common');

  return (
    <section>
      <h1>{t('title')}</h1>
      <TrackedCTA
        href="/contact"
        eventLocation="hero"
        className="mt-8 inline-block px-6 py-3 bg-accent ..."
      >
        {tCommon('cta')}
      </TrackedCTA>
    </section>
  );
}
```

**Why this works:** The Server Component can render `<TrackedCTA>` because it is a leaf Client Component. The parent section remains server-rendered for SEO and performance. Only the link itself hydrates on the client.

### Contact Form Event Tracking

The ContactForm is already a Client Component, so tracking is straightforward -- add `dataLayer.push()` calls at key interaction points:

| Event | Trigger | Data |
|-------|---------|------|
| `form_start` | First field receives focus | `{ event: 'form_start', form_name: 'contact' }` |
| `form_submit` | Form submission initiated | `{ event: 'form_submit', form_name: 'contact' }` |
| `form_success` | Server Action returns success | `{ event: 'form_success', form_name: 'contact' }` |
| `form_error` | Server Action returns error | `{ event: 'form_error', form_name: 'contact', error_type: 'validation|server' }` |

Implementation: add a `useRef` to track whether `form_start` has fired (fire only once per session), then push events at the appropriate moments in the existing form logic.

---

## Architecture Pattern 4: Case Study Content in Translation Files

### Why JSON translations (not MDX, not separate data files)

The case studies are 3 short narratives with structured fields (title, problem, intervention, result, industry, metric). This is identical in structure to how the existing service offerings are stored in `messages/*.json`. Using the same pattern:

1. **Consistency:** Same access pattern (`getTranslations` / `useTranslations`) as all other content
2. **Bilingual by default:** Both languages handled by existing next-intl infrastructure
3. **No new dependencies:** No MDX parser, no file-reading utilities, no content layer
4. **Same deployment model:** Content changes = edit JSON + commit, same as current workflow

### Translation namespace structure

```json
{
  "caseStudies": {
    "sectionTitle": "Resultados que hablan por si mismos",
    "sectionSubtitle": "Casos reales de empresas en LatAm...",
    "items": {
      "1": {
        "title": "Alineacion de equipos en empresa SaaS",
        "industry": "SaaS B2B",
        "teamSize": "40 personas",
        "problem": "El equipo tecnico y el area comercial...",
        "intervention": "Diagnostico de 3 semanas...",
        "result": "Reduccion de 35% en ciclo de delivery...",
        "metric": "35%",
        "metricLabel": "reduccion en ciclo de delivery"
      },
      "2": { /* ... */ },
      "3": { /* ... */ }
    }
  }
}
```

This follows the exact same nested object pattern used by `services.offerings`, `services.faq.items`, and `home.services.items` in the existing translation files.

### Case Study Component Architecture

```
CaseStudiesSection (Server Component)
├── getTranslations('caseStudies')
├── Renders section heading + subtitle
├── Maps over items ["1", "2", "3"]
│   └── CaseStudyCard (Server Component)
│       ├── Industry + team size badge
│       ├── Problem paragraph
│       ├── Intervention paragraph
│       ├── Result paragraph with highlighted metric
│       └── Optional decorative element
└── ScrollReveal wrapper (existing Client Component)
```

**All Server Components.** Case studies are static content with no interactivity. They render server-side, benefit from streaming, and ship zero JavaScript.

---

## Data Flow: v1.1 Additions

### Cookie Consent Flow

```
Page loads
    │
    ├─ AnalyticsProvider renders:
    │   1. Inline script: gtag('consent','default',{analytics_storage:'denied'})
    │   2. GTM script loads (holds all tags due to denied consent)
    │
    ├─ CookieConsentBanner mounts:
    │   ├─ Check localStorage for prior decision
    │   │   ├─ Found 'accepted' → gtag('consent','update',{analytics_storage:'granted'})
    │   │   │                     → GTM releases held tags → GA4 starts tracking
    │   │   ├─ Found 'rejected' → no update (stays denied)
    │   │   └─ Not found → show banner
    │   │
    │   └─ User clicks Accept/Reject:
    │       ├─ Save to localStorage + cookie
    │       ├─ gtag('consent','update',{...})
    │       └─ Hide banner
    │
    └─ Subsequent pages: banner hidden, consent restored from storage
```

### Event Tracking Flow

```
User clicks CTA (TrackedCTA client component)
    │
    ├─ onClick: window.dataLayer.push({ event:'cta_click', cta_location:'hero' })
    │
    ├─ GTM receives dataLayer event
    │   ├─ If consent granted: routes to GA4 tag → recorded
    │   └─ If consent denied: event held/discarded by consent mode
    │
    └─ Next.js navigation proceeds normally (Link component)
```

### Case Study Content Flow

```
messages/es.json (or en.json)
    │
    └─ src/i18n/request.ts loads messages for locale
        │
        └─ CaseStudiesSection (Server Component)
            │
            ├─ const t = await getTranslations('caseStudies')
            │
            ├─ t('sectionTitle') → section heading
            │
            └─ ['1','2','3'].map(key => t(`items.${key}.title`), etc.)
                │
                └─ CaseStudyCard renders static HTML (zero JS)
```

---

## Integration Points in Locale Layout

The `src/app/[locale]/layout.tsx` is the central integration point. Here is how new components fit:

```tsx
// src/app/[locale]/layout.tsx — MODIFIED
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  // ... existing validation and locale setup ...

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* EXISTING: theme detection script */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){...})()` }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col`}>
        {/* EXISTING: skip-to-content link */}
        <a href="#main-content" className="sr-only focus:not-sr-only ...">
          {tCommon('skipToContent')}
        </a>
        {/* EXISTING: theme sync */}
        <ThemeSync />

        {/* NEW: Analytics scripts (consent defaults + GTM) */}
        <AnalyticsProvider />

        <NextIntlClientProvider>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />

          {/* NEW: Cookie consent banner (inside provider for translations) */}
          <CookieConsentBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**Placement rationale:**
- `AnalyticsProvider` goes OUTSIDE `NextIntlClientProvider` because it does not need translations and must load scripts as early as possible
- `CookieConsentBanner` goes INSIDE `NextIntlClientProvider` because it uses `useTranslations()` for bilingual banner text
- Banner renders at the bottom of the body (visually fixed to viewport bottom via CSS)

---

## New Project Structure (additions only)

```
src/
├── components/
│   ├── analytics/                    # NEW folder
│   │   ├── analytics-provider.tsx    # GTM script + consent defaults
│   │   ├── cookie-consent.tsx        # Consent banner (Client Component)
│   │   └── tracked-cta.tsx           # CTA link with event tracking (Client Component)
│   └── case-studies/                 # NEW folder
│       ├── case-studies-section.tsx   # Section wrapper (Server Component)
│       └── case-study-card.tsx        # Individual case study (Server Component)
```

**No new routes.** Case studies render as a section within existing pages (homepage between ProcessSection and CtaBand, or on a dedicated section of the bio page).

**No new dependencies.** Everything uses `next/script` (built into Next.js) and the `window.dataLayer` / `window.gtag` global APIs. No `@next/third-parties` needed.

---

## Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_GTM_ID` | `.env.local` | GTM container ID (e.g., `GTM-XXXXXXX`). `NEXT_PUBLIC_` prefix required because it is used in client-side script. |

No other new env vars needed. GA4 Measurement ID is configured inside GTM, not in the codebase.

---

## Anti-Patterns

### Anti-Pattern 1: Using `@next/third-parties` GoogleTagManager with Consent Mode

**What people do:** Import `GoogleTagManager` from `@next/third-parties/google` and try to pass consent defaults via the `dataLayer` prop.
**Why it's wrong:** The component does not reliably set consent defaults before GTM initializes. Multiple GitHub issues confirm this gap. The `dataLayer` prop pushes data after the GTM script loads, which is too late for consent defaults.
**Do this instead:** Use `next/script` with `strategy="beforeInteractive"` for consent defaults and `strategy="afterInteractive"` for the GTM container script. Full control over loading order.

### Anti-Pattern 2: Conditionally Rendering GTM Based on Consent

**What people do:** Only render the GTM script tag after the user accepts cookies.
**Why it's wrong:** This means GTM has no data for users who haven't decided yet. Google's Consent Mode v2 is designed to let GTM load immediately but hold all tags until consent is granted. With Consent Mode, Google can still model conversions using cookieless pings (consent-mode modeling), which is lost if GTM never loads.
**Do this instead:** Always load GTM. Set consent defaults to `denied`. GTM loads but does nothing until consent is granted. This is the officially recommended Google approach.

### Anti-Pattern 3: Case Studies as MDX/Markdown for 3 Items

**What people do:** Set up a full MDX pipeline with `@next/mdx`, frontmatter parsing, and file-system content loading for a handful of case studies.
**Why it's wrong:** Massive over-engineering for 3 items of structured content. MDX adds a build dependency, requires a content loading layer, and breaks the existing translation pattern.
**Do this instead:** Put case study content in `messages/*.json` using the same nested namespace pattern as services and FAQ. No new dependencies, same bilingual workflow.

### Anti-Pattern 4: Converting Server Components to Client for Tracking

**What people do:** Add `'use client'` to `HeroSection` or `CtaBand` just to call `sendGTMEvent` on a button click.
**Why it's wrong:** These are content-heavy sections that benefit from server rendering (zero JS, instant paint, SEO). Converting them to Client Components ships their entire JS bundle to the browser.
**Do this instead:** Create a small `TrackedCTA` Client Component that wraps only the interactive link. The parent section stays as a Server Component. Only the click handler hydrates.

---

## Build Order for v1.1 Features

Dependencies dictate this order:

```
Phase 1: Analytics Foundation (no UI dependencies)
├── src/components/analytics/analytics-provider.tsx
├── NEXT_PUBLIC_GTM_ID env var setup
├── GTM container creation + GA4 tag configuration in GTM
└── Verify: GTM loads, consent defaults to denied, no data collected

Phase 2: Cookie Consent (depends on Phase 1)
├── messages/*.json: add 'consent' namespace (both locales)
├── src/components/analytics/cookie-consent.tsx
├── Modify src/app/[locale]/layout.tsx: add both new components
├── Update privacy page translations: describe analytics cookies
└── Verify: banner shows, accept/reject works, GA4 collects on accept only

Phase 3: Event Tracking (depends on Phase 2)
├── src/components/analytics/tracked-cta.tsx
├── Modify hero-section.tsx, cta-band.tsx, services-cta.tsx: use TrackedCTA
├── Modify contact-form.tsx: add form_start, form_submit, form_success events
├── Configure GA4 custom dimensions in GTM (cta_location, form_name, etc.)
└── Verify: events appear in GA4 DebugView

Phase 4: Case Studies (independent of Phases 1-3)
├── messages/*.json: add 'caseStudies' namespace (both locales)
├── src/components/case-studies/case-study-card.tsx
├── src/components/case-studies/case-studies-section.tsx
├── Modify src/app/[locale]/page.tsx: add CaseStudiesSection
└── Verify: case studies render in both languages
```

**Phase 4 (case studies) has zero dependency on Phases 1-3 (analytics).** They can be built in parallel if desired. The only shared dependency is the locale layout file, but the modifications are additive and non-conflicting.

**Phase ordering rationale:**
- Analytics foundation first because consent banner depends on GTM being loadable
- Consent before event tracking because events are pointless without consent infrastructure
- Case studies are pure content with no analytics dependency -- fully parallel

---

## Scaling Considerations

| Concern | Current (v1.1) | If Traffic Grows |
|---------|----------------|------------------|
| GTM/GA4 | Single container, 4-5 custom events | No change needed until A/B testing (v2+) |
| Cookie consent | localStorage + cookie, no backend | Could add geo-detection for EU-only banner via Vercel Edge middleware, but overkill for LatAm-focused site |
| Case studies | 3 items in JSON | If growing to 10+, consider MDX files or a CMS. Under 10, JSON is fine. |
| Event volume | Minimal (~100-1K events/day) | GA4 free tier handles 500K events/day. No concern. |

---

## Sources

- [Google Consent Mode v2 Official Docs](https://developers.google.com/tag-platform/security/guides/consent) -- HIGH confidence. Authoritative source for consent default/update API.
- [Next.js Third-Party Libraries Guide](https://nextjs.org/docs/app/guides/third-party-libraries) -- HIGH confidence. Official docs for `@next/third-parties/google`, confirmed `GoogleTagManager` props and limitations.
- [vercel/next.js Discussion #64497: Consent + GoogleTagManager](https://github.com/vercel/next.js/discussions/64497) -- HIGH confidence. Confirms lack of built-in consent mode support in `@next/third-parties`.
- [vercel/next.js Discussion #67440: GA compliance](https://github.com/vercel/next.js/discussions/67440) -- HIGH confidence. Confirms `@next/third-parties` does not support consent mode as of early 2026.
- [GTM Consent Mode v2 in React (Cloud66 Blog)](https://blog.cloud66.com/google-tag-manager-consent-mode-v2-in-react) -- MEDIUM confidence. Practical implementation guide with dataLayer patterns.
- [GA4 Consent Mode in Next.js (Gaudion.dev)](https://gaudion.dev/blog/setup-google-analytics-with-gdpr-compliant-cookie-consent-in-nextjs13) -- MEDIUM confidence. Working implementation with consent update pattern.
- [Cookie Consent in Next.js 15 (BuildWithMatija)](https://www.buildwithmatija.com/blog/build-cookie-consent-banner-nextjs-15-server-client) -- MEDIUM confidence. No-library approach confirmed viable.
- [Simo Ahava: Consent Mode v2 for Google Tags](https://www.simoahava.com/analytics/consent-mode-v2-google-tags/) -- HIGH confidence. Authoritative analytics expert on GTM consent implementation.
- [Top 7 Consent Mode Mistakes (Bounteous)](https://www.bounteous.com/insights/2025/07/30/top-7-google-consent-mode-mistakes-and-how-fix-them-2025/) -- MEDIUM confidence. Common pitfalls with consent mode in 2025.

---
*Architecture research for: M. Gripe v1.1 -- GA4/GTM, cookie consent, case studies integration*
*Researched: 2026-02-27*
