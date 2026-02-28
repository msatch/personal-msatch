# Phase 8: Privacy & Analytics Foundation - Research

**Researched:** 2026-02-28
**Domain:** Google Tag Manager integration with Consent Mode v2, privacy policy update, bilingual Next.js 16 site
**Confidence:** HIGH

## Summary

Phase 8 integrates Google Tag Manager with Consent Mode v2 into the existing bilingual consulting site and updates the privacy policy to accurately disclose analytics cookies. The scope is deliberately contained: three requirements (ANLYT-01, ANLYT-02, ANLYT-03), zero new npm packages, and two new Client Components plus translation file updates.

The critical technical challenge is ensuring consent defaults are set **before** GTM initializes, which is non-trivial in the project's architecture. The project uses a pass-through root layout (`app/layout.tsx` returns only `children`) with the real layout in `app/[locale]/layout.tsx`. The `beforeInteractive` script strategy in Next.js requires placement in the root `app/layout.tsx`, which conflicts with this i18n routing structure. Research confirms two viable solutions: (1) use a raw `<script>` tag with `dangerouslySetInnerHTML` directly in the `<head>` of the locale layout (the same pattern already used for theme detection), or (2) use `next/script` with `afterInteractive` for both the consent defaults and GTM loader, relying on script ordering within the same strategy tier. Option 1 is recommended because it guarantees synchronous execution before any other scripts.

**Primary recommendation:** Use a raw inline `<script>` tag in the locale layout's `<head>` for consent defaults (identical pattern to the existing theme detection script), `next/script` with `afterInteractive` for the GTM container, and a custom `CookieConsentBanner` Client Component with `useTranslations('consent')` for the bilingual consent UI. No new npm packages.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ANLYT-01 | Google Tag Manager container loads on all pages via manual next/script in root layout | Architecture Pattern 1: Manual GTM via `next/script` with `afterInteractive`. Consent defaults via raw `<script>` in `<head>`. `NEXT_PUBLIC_GTM_ID` env var. Placement in locale layout (covers all pages). |
| ANLYT-02 | GA4 configured as a tag inside GTM (not a separate script) | Anti-Pattern 1 (no dual snippets). GA4 Measurement ID is configured in GTM console only. Only `GTM-XXXXXXX` appears in code. Verification: Network tab shows `gtm.js`, no standalone `gtag/js`. |
| ANLYT-03 | Privacy policy updated in both languages to disclose analytics/tracking cookies | Current privacy policy cookies section explicitly says "we do not use tracking cookies" -- must be updated in both `messages/es.json` and `messages/en.json`. Content change only, no code changes to privacy page component. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next/script` | Built into Next.js 16.1.6 | Load GTM container script with `afterInteractive` strategy | Official Next.js API for third-party script loading; provides deduplication, strategy control, and streaming support |
| Raw `<script>` in `<head>` | N/A (HTML) | Set consent defaults synchronously before GTM loads | Same pattern used for theme detection in this project; guarantees execution before any Next.js hydration |
| `Google Tag Manager` | Cloud service | Single hub for all tags; GA4 configured as a tag inside GTM | Industry standard for tag management; enables Consent Mode v2 without code changes |
| `Google Analytics 4` | Cloud service (inside GTM) | Analytics tracking; receives data when consent granted | Configured inside GTM console, NOT as a separate script in the codebase |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next-intl` | 4.8.3 (existing) | Bilingual consent banner text and privacy policy content | All new user-visible strings in consent banner and updated privacy policy |
| `localStorage` | Web API | Fast client-side read of consent state on page load | Consent state persistence; read on mount to avoid showing banner to returning visitors |
| `document.cookie` | Web API | Cookie with `path=/` for locale-agnostic consent persistence | Primary persistence layer; `path=/` ensures consent survives locale switches from `/es/` to `/en/` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Raw `<script>` in `<head>` | `next/script` with `beforeInteractive` | `beforeInteractive` must go in root `app/layout.tsx`, but the project's root layout is a pass-through (returns only `children`, no `<html>`/`<body>`). Would require restructuring the root layout to render `<html>` and `<body>`, breaking the current i18n architecture. Raw `<script>` in `<head>` achieves the same synchronous execution without restructuring. |
| Raw `<script>` in `<head>` | `next/script` with `afterInteractive` for consent defaults | `afterInteractive` runs after some hydration, creating a race condition where GTM might read consent state before defaults are set. The raw `<script>` approach is more deterministic. |
| Custom consent component | `react-cookie-consent` library | 15KB for ~100 lines of custom code; ships CSS that conflicts with Tailwind; not bilingual-aware. Overkill for binary accept/decline. |
| Custom consent component | CookieYes / OneTrust / CookieBot | Enterprise-grade CMPs (50-150KB JS) designed for sites with dozens of cookie categories. Massive overkill for a consulting site with only analytics cookies. |
| `@next/third-parties` GoogleTagManager | Manual `next/script` | `@next/third-parties` GoogleTagManager component has no built-in Consent Mode v2 support. The `dataLayer` prop pushes data after GTM initializes, too late for consent defaults. Confirmed in Next.js GitHub discussions #64497, #66718, #67440. |

**Installation:**
```bash
# No packages to install. All capabilities are built into Next.js 16 and browser APIs.
# Only a new environment variable is needed:
echo "NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX" >> .env.local
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   └── analytics/                     # NEW folder
│       ├── analytics-provider.tsx     # GTM script loader (Client Component)
│       └── cookie-consent.tsx         # Consent banner (Client Component)
├── types/
│   └── gtag.d.ts                      # NEW: TypeScript declarations for window.gtag & window.dataLayer
├── app/
│   └── [locale]/
│       └── layout.tsx                 # MODIFIED: add consent defaults in <head>, AnalyticsProvider and CookieConsentBanner
└── messages/
    ├── es.json                        # MODIFIED: add 'consent' namespace, update 'privacy.sections.cookies'
    └── en.json                        # MODIFIED: same changes
```

### Pattern 1: Consent Defaults via Raw Inline Script in `<head>`

**What:** Set Consent Mode v2 defaults synchronously in the `<head>` before any other scripts load.

**When to use:** When using i18n routing with `app/[locale]/layout.tsx` as the real layout (the root `app/layout.tsx` is a pass-through) and `beforeInteractive` strategy is not available.

**Why this approach:** The project already uses this exact pattern for theme detection -- a raw `<script>` with `dangerouslySetInnerHTML` in the `<head>` of the locale layout. The theme script runs synchronously before React hydrates, preventing flash of wrong theme. Consent defaults need the same guarantee: they must be set before GTM evaluates any tags.

**Critical insight:** Google's official documentation states: "The order of the code here is vital. If your consent code is called out of order, consent defaults will not work." A raw `<script>` in `<head>` is the most reliable way to guarantee this ordering in this project's architecture.

**Example:**
```tsx
// In src/app/[locale]/layout.tsx <head> section
// Source: Google Consent Mode v2 docs + existing project pattern
<head>
  {/* Existing: theme detection */}
  <script dangerouslySetInnerHTML={{ __html: `(function(){...theme...})()` }} />

  {/* NEW: Consent Mode v2 defaults -- MUST run before GTM */}
  <script
    dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer=window.dataLayer||[];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent','default',{
          'ad_storage':'denied',
          'ad_user_data':'denied',
          'ad_personalization':'denied',
          'analytics_storage':'denied',
          'wait_for_update':500
        });
      `,
    }}
  />
</head>
```

**Key details:**
- `wait_for_update: 500` gives the consent banner 500ms to call `gtag('consent', 'update', ...)` before tags fire. If the user has previously consented, the banner component reads localStorage on mount and fires the update within this window.
- All four Consent Mode v2 parameters must be declared: `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`. Only `analytics_storage` will ever be granted on this site (no advertising).
- This script is NOT wrapped in `next/script` because `beforeInteractive` cannot be used in `app/[locale]/layout.tsx` (only in root `app/layout.tsx`). A raw `<script>` tag in JSX renders synchronously in the `<head>`, achieving the same effect.

### Pattern 2: GTM Container via `next/script` with `afterInteractive`

**What:** Load the GTM container script after the consent defaults are set.

**When to use:** Always -- GTM should load on every page via the locale layout.

**Example:**
```tsx
// src/components/analytics/analytics-provider.tsx
'use client';

import Script from 'next/script';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export function AnalyticsProvider() {
  if (!GTM_ID) return null;

  return (
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
  );
}
```

**Source:** Google Tag Manager installation snippet, standard implementation. Using `afterInteractive` ensures GTM loads after the page hydrates but still early in the page lifecycle.

**Why not `beforeInteractive`:** The `beforeInteractive` strategy must be placed in the root `app/layout.tsx` per Next.js docs. This project's root layout is a pass-through. Additionally, loading GTM with `beforeInteractive` can delay LCP on slow mobile connections (LatAm 3G/4G). `afterInteractive` is the recommended strategy for tag managers per Next.js official docs.

### Pattern 3: Cookie Consent Banner with Bilingual Support

**What:** A Client Component that shows a consent banner, reads/writes consent state, and calls `gtag('consent', 'update', ...)`.

**When to use:** Renders on every page via the locale layout, inside `NextIntlClientProvider` for translation support.

**Example:**
```tsx
// src/components/analytics/cookie-consent.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

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
      // Don't show banner -- user already decided
    } else {
      setVisible(true);
    }
  }, []);

  const handleChoice = useCallback((choice: ConsentChoice) => {
    setVisible(false);
    localStorage.setItem(CONSENT_KEY, choice);
    document.cookie = `${CONSENT_COOKIE}=${choice};max-age=${365*24*60*60};path=/;SameSite=Lax`;
    updateGtagConsent(choice);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t('ariaLabel')}
      className="fixed bottom-0 inset-x-0 z-50 p-4 bg-surface border-t border-border shadow-lg"
    >
      <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm flex-1">{t('message')}</p>
        <div className="flex gap-3 shrink-0">
          <button onClick={() => handleChoice('rejected')} className="...">{t('reject')}</button>
          <button onClick={() => handleChoice('accepted')} className="...">{t('accept')}</button>
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
```

**Source:** Custom implementation following Google Consent Mode v2 official docs pattern + existing project patterns (useTranslations, Tailwind classes).

### Pattern 4: Layout Integration Order

**What:** The exact placement of analytics components in the locale layout.

**Why order matters:** Consent defaults must be set before GTM loads. The consent banner must be inside `NextIntlClientProvider` for translations but the GTM script does not need translations.

**Example:**
```tsx
// src/app/[locale]/layout.tsx (modified)
export default async function LocaleLayout({ children, params }: Props) {
  // ... existing setup ...
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* EXISTING: theme detection */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){...theme...})()` }} />
        {/* NEW: consent defaults -- runs synchronously before GTM */}
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{'ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','analytics_storage':'denied','wait_for_update':500});` }} />
      </head>
      <body className={...}>
        <a href="#main-content" className="sr-only ...">...</a>
        <ThemeSync />
        {/* NEW: GTM script (outside NextIntlClientProvider -- no translations needed) */}
        <AnalyticsProvider />
        <NextIntlClientProvider>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
          {/* NEW: Consent banner (inside provider for translations) */}
          <CookieConsentBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Anti-Patterns to Avoid

- **Using `@next/third-parties` GoogleTagManager:** No Consent Mode v2 support. The `dataLayer` prop pushes data after GTM initializes, too late for consent defaults. Confirmed in GitHub #64497, #66718, #67440.
- **Using `beforeInteractive` in `app/[locale]/layout.tsx`:** The `beforeInteractive` strategy only works in the root `app/layout.tsx`. In this project, the root layout is a pass-through (returns `children` only). Using it in the locale layout will either be silently ignored or cause build errors.
- **Conditionally rendering GTM based on consent:** GTM should always load. Consent Mode v2 is designed to let GTM load in denied state -- Google uses cookieless pings for modeling. Blocking GTM entirely loses this capability.
- **Loading GA4 via a separate `gtag.js` script:** GA4 must be configured inside GTM only. Having both GTM and a standalone `gtag.js` causes duplicate page views and events.
- **Using `next/script` with `beforeInteractive` for inline consent defaults:** The `beforeInteractive` strategy with `dangerouslySetInnerHTML` was fixed in Next.js v12.1.6+, but it still requires placement in the root `app/layout.tsx`. In this i18n architecture, a raw `<script>` in the locale layout's `<head>` is the correct alternative.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tag management | Custom script injection logic | Google Tag Manager (cloud service) | GTM handles tag sequencing, consent gating, version control, and debugging. Building custom is unmaintainable. |
| Consent mode protocol | Custom consent-to-script blocking logic | Google Consent Mode v2 API (`gtag('consent', ...)`) | The protocol handles cookieless pings, modeling, and tag gating. Re-implementing it is impossible to get right. |
| Cookie consent library | Complex multi-category consent manager | Custom ~100-line component | The site has ONE category (analytics). Enterprise CMPs like CookieYes/OneTrust add 50-150KB for dozens of categories we don't need. |

**Key insight:** The analytics infrastructure is almost entirely cloud-side (GTM + GA4 configuration). The codebase contribution is minimal: one inline script, one Script component, one consent banner component, and translation strings.

## Common Pitfalls

### Pitfall 1: Consent Defaults Not Set Before GTM Loads
**What goes wrong:** GTM reads consent state before defaults are set. Tags fire with no consent context, potentially collecting data without permission.
**Why it happens:** Using `afterInteractive` for both the consent default script and GTM loader creates a race condition where execution order is not guaranteed. Or using `@next/third-parties` which pushes to dataLayer after GTM initializes.
**How to avoid:** Place consent defaults in a raw `<script>` tag in `<head>` (synchronous execution). GTM loads via `next/script` with `afterInteractive` -- always after `<head>` scripts complete.
**Warning signs:** GTM Preview/Debug mode shows "A tag read consent state before a default was set" warning.

### Pitfall 2: Consent Cookie Scoped to Locale Path
**What goes wrong:** User accepts consent on `/es/`, switches to `/en/`, and the banner reappears because the cookie was set with `path=/es/`.
**Why it happens:** Default cookie behavior or accidental scoping. `document.cookie = "consent=yes"` without explicit `path=/` uses the current URL path.
**How to avoid:** Always set `path=/` on the consent cookie: `document.cookie = "cookie_consent=accepted;max-age=31536000;path=/;SameSite=Lax"`. Cookie name must be locale-agnostic (`cookie_consent`, not `cookie_consent_es`).
**Warning signs:** Consent banner appears after locale switch. Cookie inspector shows `path=/es/` or `path=/en/`.

### Pitfall 3: Privacy Policy Not Updated Before Analytics Launch
**What goes wrong:** The site starts collecting analytics data while the privacy policy still says "we do not use tracking cookies." This is a direct legal contradiction.
**Why it happens:** Privacy policy update is treated as a nice-to-have instead of a prerequisite. Developers focus on the technical implementation and forget the legal disclosure.
**How to avoid:** Update privacy policy translation strings FIRST, before adding any analytics code. The current cookies section in both `messages/es.json` and `messages/en.json` explicitly states: "This site uses only a technical cookie (NEXT_LOCALE) to remember your language preference. We do not use tracking, analytics, or advertising cookies." This text must be replaced.
**Warning signs:** Grep for "We do not use tracking" or "No utilizamos cookies de seguimiento" in translation files.

### Pitfall 4: Dual GTM + GA4 Snippets Causing Duplicate Events
**What goes wrong:** Both a GTM container script and a separate GA4 `gtag.js` script are loaded. Every page view and event fires twice. Analytics data is useless.
**Why it happens:** Developer follows a "GA4 in Next.js" tutorial (which uses `gtag.js` directly) and separately follows a "GTM in Next.js" tutorial, not understanding that GA4 should be configured inside GTM.
**How to avoid:** Only the GTM container ID (`GTM-XXXXXXX`) appears in the codebase. The GA4 Measurement ID (`G-XXXXXXXXXX`) is configured inside the GTM console as a tag. Verify in Network tab: only `gtm.js` loads, no separate `gtag/js` request.
**Warning signs:** Network tab shows both `googletagmanager.com/gtm.js` and `googletagmanager.com/gtag/js` loading.

### Pitfall 5: GTM Degrading LCP on Mobile
**What goes wrong:** Adding GTM pushes LCP past the 2.5s target on slow mobile connections (common in LatAm secondary cities -- 3G with 300ms RTT).
**Why it happens:** GTM loads, then fetches GA4's analytics.js. Two sequential script fetches on slow connections add 600ms+.
**How to avoid:** Use `afterInteractive` strategy (not `beforeInteractive`). Keep GTM container lean: only GA4 tag + consent mode. With Consent Mode defaults set to denied, GTM loads but does minimal work until consent is granted, naturally reducing performance impact. Verify LCP delta < 300ms with and without GTM.
**Warning signs:** Lighthouse Performance score drops > 5 points after adding GTM.

### Pitfall 6: Consent Banner Covering Mobile CTA
**What goes wrong:** The consent banner at the bottom of the viewport covers the hero CTA button on mobile. The user's first interaction is dismissing a banner instead of reading the value proposition.
**How to avoid:** Design the banner as a slim bar (2 lines max). Test at 375px width. Ensure it does not overlap the hero CTA button. The existing WhatsApp button is positioned at `bottom-6 right-6` -- the consent banner must not conflict with it either.
**Warning signs:** The primary CTA is not visible or tappable when the consent banner is showing.

## Code Examples

### TypeScript Global Declarations
```typescript
// src/types/gtag.d.ts
// Source: TypeScript community pattern for GTM + GA4
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

export {};
```

### Consent Namespace in Translation Files
```json
// In messages/es.json (add new "consent" namespace)
{
  "consent": {
    "ariaLabel": "Preferencias de cookies",
    "message": "Usamos cookies de analisis para entender como se utiliza este sitio y mejorar tu experiencia. Puedes aceptar o rechazar su uso.",
    "accept": "Aceptar",
    "reject": "Rechazar",
    "privacyLink": "Politica de privacidad"
  }
}
```

```json
// In messages/en.json (add new "consent" namespace)
{
  "consent": {
    "ariaLabel": "Cookie preferences",
    "message": "We use analytics cookies to understand how this site is used and improve your experience. You can accept or decline their use.",
    "accept": "Accept",
    "reject": "Decline",
    "privacyLink": "Privacy policy"
  }
}
```

### Updated Privacy Policy Cookies Section
```json
// In messages/es.json -- replace privacy.sections.cookies
{
  "cookies": {
    "title": "Cookies",
    "content": "Este sitio utiliza los siguientes tipos de cookies:",
    "items": {
      "1": "Cookie tecnica (NEXT_LOCALE): recuerda tu preferencia de idioma. Es estrictamente necesaria para el funcionamiento del sitio.",
      "2": "Cookie de consentimiento (cookie_consent): almacena tu decision sobre cookies de analisis. Expira en 1 ano.",
      "3": "Cookies de Google Analytics (via Google Tag Manager): si aceptas las cookies de analisis, GA4 utiliza cookies como _ga y _ga_* para generar informacion estadistica sobre el uso del sitio, como paginas visitadas y duracion de la visita. Estos datos son anonimos y se procesan de forma agregada."
    },
    "control": "Puedes gestionar tus preferencias de cookies en cualquier momento. Si rechazas las cookies de analisis, no se recopilara ningun dato de navegacion. Para retirar tu consentimiento, puedes eliminar las cookies de tu navegador."
  }
}
```

```json
// In messages/en.json -- replace privacy.sections.cookies
{
  "cookies": {
    "title": "Cookies",
    "content": "This site uses the following types of cookies:",
    "items": {
      "1": "Technical cookie (NEXT_LOCALE): remembers your language preference. Strictly necessary for site functionality.",
      "2": "Consent cookie (cookie_consent): stores your analytics cookie decision. Expires in 1 year.",
      "3": "Google Analytics cookies (via Google Tag Manager): if you accept analytics cookies, GA4 uses cookies such as _ga and _ga_* to generate statistical information about site usage, such as pages visited and visit duration. This data is anonymous and processed in aggregate."
    },
    "control": "You can manage your cookie preferences at any time. If you decline analytics cookies, no browsing data will be collected. To withdraw your consent, you can clear cookies from your browser."
  }
}
```

### Privacy Page Component Update
The privacy page component (`src/app/[locale]/privacy/page.tsx`) currently renders the cookies section with only a title and content (no items list). After updating the cookies namespace to include `items` and `control`, the `sectionItemCounts` map in the component must be updated to include the cookies section:

```typescript
// Update sectionItemCounts to include cookies items
const sectionItemCounts: Record<string, string[]> = {
  dataCollected: ['1', '2', '3', '4', '5'],
  dataUsage: ['1', '2', '3'],
  userRights: ['1', '2', '3'],
  cookies: ['1', '2', '3'],  // NEW: analytics cookie items
};
```

The `control` paragraph needs a small rendering addition after the items list for the cookies section. This can be handled by checking if a `sections.${key}.control` key exists and rendering it as an additional paragraph.

### Environment Variable
```bash
# .env.local -- add this line
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# .env.example -- add documentation
# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

The `NEXT_PUBLIC_` prefix is required because the GTM ID is used in client-side code (the `AnalyticsProvider` component). Source: [Vercel Environment Variables docs](https://vercel.com/docs/environment-variables).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@next/third-parties` GoogleTagManager | Manual `next/script` + raw `<script>` | Ongoing (2024-2026) | `@next/third-parties` still does not support Consent Mode v2. Manual approach is required for GDPR compliance. GitHub #64497, #66718, #67440 remain open. |
| Consent Mode v1 (2 parameters) | Consent Mode v2 (4 parameters) | November 2023 | `ad_user_data` and `ad_personalization` are now required alongside `ad_storage` and `analytics_storage`. Implementations missing the new parameters are not v2-compliant. |
| Block GTM until consent | Always load GTM in denied state | 2023+ (Google recommendation) | GTM loads immediately, but tags are held. Cookieless pings enable Google's conversion modeling even without consent. Blocking GTM entirely loses this capability. |
| Separate GA4 `gtag.js` + GTM | GA4 as a tag inside GTM only | Best practice since GTM inception | Single entry point. No duplicate events. Simpler to manage and debug. |

**Deprecated/outdated:**
- `@next/third-parties/google` `GoogleTagManager` component for consent-aware implementations: Not deprecated as a package, but functionally inadequate for Consent Mode v2. Use manual `next/script` instead.
- Consent Mode v1 (missing `ad_user_data` and `ad_personalization`): Technically still works, but Google requires v2 for full EEA compliance and conversion modeling.

## Open Questions

1. **GTM Container ID**
   - What we know: The environment variable `NEXT_PUBLIC_GTM_ID` must contain a `GTM-XXXXXXX` value.
   - What's unclear: Whether the GTM container and GA4 property have already been created in Google accounts.
   - Recommendation: Implementation can begin with a placeholder value. The real GTM container ID is needed for end-to-end testing. Creating the GTM account/container and GA4 property is a cloud configuration task outside code scope -- should be done before testing begins.

2. **Privacy Policy "control" Section Rendering**
   - What we know: The current privacy page renders sections with optional `items` lists. The cookies section needs a new `control` paragraph after the items list.
   - What's unclear: Whether to add a general mechanism for `control` fields to any section, or special-case it for cookies only.
   - Recommendation: Add a simple conditional: if `sections.${key}.control` exists in translations, render it as a paragraph after the items list. This is a minimal, non-breaking change to the privacy page component.

3. **Consent Banner Z-Index and WhatsApp Button Overlap**
   - What we know: The WhatsApp button is positioned at `bottom-6 right-6` with a z-index. The consent banner should be fixed at the bottom of the viewport.
   - What's unclear: Exact z-index values and whether the consent banner might overlap the WhatsApp button on mobile.
   - Recommendation: Test at 375px width. The consent banner should use `z-50` (same as WhatsApp button). When the banner is visible, the WhatsApp button should be pushed up or the banner should not extend to the far right. Alternatively, hide WhatsApp button while consent banner is showing (since it's the first visit).

## Sources

### Primary (HIGH confidence)
- [Next.js Script Component API Reference](https://nextjs.org/docs/app/api-reference/components/script) -- Confirmed `beforeInteractive` must be in root `app/layout.tsx`. Confirmed `afterInteractive` is default and recommended for tag managers. Confirmed inline scripts with `dangerouslySetInnerHTML` work with `afterInteractive`.
- [Next.js Scripts Guide](https://nextjs.org/docs/app/guides/scripts) -- Official placement guidance for application-wide scripts in App Router.
- [Google Consent Mode v2 Official Docs](https://developers.google.com/tag-platform/security/guides/consent) -- Authoritative source for consent default/update API, required parameters, loading order.
- [Simo Ahava: Consent Mode v2 for Google Tags](https://www.simoahava.com/analytics/consent-mode-v2-google-tags/) -- Authoritative analytics expert. Confirmed inline `gtag('consent','default',...)` before GTM pattern. Clarified basic vs advanced consent mode.
- [Next.js GitHub Discussion #64497](https://github.com/vercel/next.js/discussions/64497) -- Confirms `@next/third-parties` GoogleTagManager has no consent mode support.
- [Next.js GitHub Discussion #66718](https://github.com/vercel/next.js/discussions/66718) -- Same confirmation for GoogleAnalytics component.
- [Next.js GitHub Discussion #67440](https://github.com/vercel/next.js/discussions/67440) -- Additional confirmation.
- [Next.js GitHub Issue #31275](https://github.com/vercel/next.js/issues/31275) -- Confirmed `dangerouslySetInnerHTML` + `beforeInteractive` fix in v12.1.6+, but root layout constraint remains.

### Secondary (MEDIUM confidence)
- [GTM Consent Mode v2 in React/Next.js (Cloud66)](https://blog.cloud66.com/google-tag-manager-consent-mode-v2-in-react) -- Practical implementation pattern with `afterInteractive` for both consent defaults and GTM.
- [GTM with Consent Mode in Next.js (Aclarify)](https://www.aclarify.com/blog/how-to-set-up-google-tag-manager-with-consent-mode-in-nextjs) -- Confirmed Next.js 15+ implementation using `afterInteractive` and `dangerouslySetInnerHTML`. Uses `Suspense` boundary for `useSearchParams`.
- [Analytics Mania: "A tag read consent state before a default was set"](https://www.analyticsmania.com/post/a-tag-read-consent-state-before-a-default-was-set/) -- Diagnostic guidance for consent timing issues. Recommends CMP firing on Consent Initialization trigger or moving consent defaults outside GTM (inline on page).
- [Cookie Consent on Multilingual Sites (CookieScript)](https://cookie-script.com/documentation/cookie-consent-on-multilingual-website) -- `path=/` requirement for locale-agnostic consent persistence.
- [Basic vs Advanced Google Consent Mode for GA4 2026 Guide](https://www.unifiedinfotech.net/blog/unlock-the-power-of-google-consent-mode-with-basic-vs-advanced-for-ga4-in-2026/) -- Confirms all four parameters required for v2 compliance.
- [Top 7 Consent Mode Mistakes (Bounteous)](https://www.bounteous.com/insights/2025/07/30/top-7-google-consent-mode-mistakes-and-how-fix-them-2025/) -- Common pitfall validation.

### Tertiary (LOW confidence)
- [Configuring Google Cookies Consent with Next.js 15 (Medium)](https://medium.com/@sdanvudi/configuring-google-cookies-consent-with-next-js-15-ca159a2bea13) -- Directional guidance. Confirmed `afterInteractive` approach viable.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Zero new packages. All capabilities verified against official Next.js 16.1.6 and Google Consent Mode v2 docs. `@next/third-parties` disqualification confirmed via 3 GitHub discussions.
- Architecture: HIGH -- `beforeInteractive` constraint in root layout verified against official docs. Raw `<script>` alternative validated by existing project pattern (theme detection). Component placement order verified against Google's loading order requirement.
- Pitfalls: HIGH -- All pitfalls verified across official docs (Google Consent Mode, Next.js Script API) and multiple independent community sources. Consent-locale interaction pitfall verified against CookieScript documentation.

**Research date:** 2026-02-28
**Valid until:** 2026-03-28 (stable domain -- Consent Mode v2 and Next.js Script API are mature)
