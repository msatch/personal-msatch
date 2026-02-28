# Stack Research: v1.1 Additions

**Domain:** Additions to bilingual consulting site -- analytics, cookie consent, case studies, messaging updates
**Researched:** 2026-02-27
**Confidence:** HIGH
**Scope:** Only NEW technologies/patterns needed for v1.1. Existing stack validated in v1.0 research and not re-evaluated.

## Existing Stack (Reference Only -- Do Not Re-Research)

Already installed and validated: Next.js 16.1.6, React 19.2.3, TypeScript 5.x, Tailwind CSS 4, next-intl 4.8.3, Resend 6.9.2, Zod 4.3.6, clsx 2.1.1, tailwind-merge 3.4.1.

---

## New Dependencies for v1.1

### The Answer: Zero New npm Packages

After thorough research, v1.1 requires **no new npm dependencies**. The existing stack plus built-in Next.js capabilities cover everything.

The initial instinct was to add `@next/third-parties@16.1.6` for the `GoogleTagManager` component. However, research revealed a critical limitation: **the `@next/third-parties` GoogleTagManager component does not support Google Consent Mode v2**. The `dataLayer` prop pushes data after GTM initializes, which is too late for consent defaults. Multiple GitHub discussions (vercel/next.js #64497, #66718) confirm this gap remains unresolved as of early 2026. Since consent mode is a hard requirement (the site has a privacy policy and targets markets with privacy regulations), the `@next/third-parties` approach is disqualified.

The correct approach uses `next/script` (already built into Next.js 16) with manual GTM initialization, giving full control over the consent-before-GTM loading order.

---

## Technology Decisions

### Analytics: Manual GTM via next/script (Built-in)

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| next/script | Built into Next.js 16.1.6 | Load GTM container with precise timing control | Provides `beforeInteractive` and `afterInteractive` strategies. Consent defaults script MUST execute before GTM boots -- only `beforeInteractive` guarantees this. `@next/third-parties` GoogleTagManager defers loading post-hydration and has no mechanism for consent defaults. | HIGH |
| Google Tag Manager | N/A (cloud service) | Tag management hub | Manages GA4 + any future tags without code changes. Single GTM container ID in code. GA4 configured as a tag inside GTM, not as a separate script. | HIGH |
| Google Analytics 4 | N/A (cloud service) | Website analytics | Free, industry standard. Configured inside GTM container. Automatic pageview tracking works with Next.js client-side navigations via Enhanced Measurement. | HIGH |

**Why NOT @next/third-parties:**

The official Next.js package (`@next/third-parties/google`) provides `GoogleTagManager` and `sendGTMEvent`. While convenient, it has a fundamental limitation for this project:

1. **No consent mode support.** The component loads GTM after hydration with no hook to set consent defaults before GTM evaluates. Setting `gtag('consent', 'default', { analytics_storage: 'denied' })` MUST happen before GTM's first evaluation, or the first pageview fires without consent. This is a GDPR violation.

2. **GitHub issues confirm the gap.** vercel/next.js Discussion #64497 and #66718 show this has been a known issue since 2024 with no resolution. Community workaround is to use `next/script` directly.

3. **sendGTMEvent is trivially replaceable.** It is just a thin wrapper around `window.dataLayer.push()`. One line of code. Not worth an npm dependency.

**Implementation pattern:**

```typescript
// src/components/analytics/analytics-provider.tsx
'use client';
import Script from 'next/script';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export function AnalyticsProvider() {
  if (!GTM_ID) return null;

  return (
    <>
      {/* Step 1: Set consent defaults BEFORE GTM loads */}
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
      {/* Step 2: Load GTM (respects consent defaults set above) */}
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

**Event tracking (replaces sendGTMEvent):**

```typescript
// Direct dataLayer push -- no library needed
function trackEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({ event, ...data });
  }
}

// Usage:
trackEvent('cta_click', { cta_location: 'hero' });
trackEvent('form_submit', { form_name: 'contact' });
```

### Cookie Consent: Custom Build (No Library)

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| Custom React component | N/A | GDPR-compliant cookie consent banner | Zero additional dependencies. A consent banner is ~100-150 lines of React + localStorage + cookie. The project already has the full UI toolkit (Tailwind, clsx, tailwind-merge, next-intl) to build a banner that matches the site's design system perfectly. | HIGH |

**Why NOT use a cookie consent library:**

| Library | Size | Problem |
|---------|------|---------|
| react-cookie-consent | ~15KB gzip | Ships own CSS (conflicts with Tailwind), no Consent Mode v2 support, limited customization |
| CookieYes / OneTrust / CookieBot | External SaaS | 300-500KB external JS, monthly cost ($10-50/mo), styling FOUT, ironic third-party tracking for consent, violates "free/low-cost" constraint |
| js-cookie | ~2KB gzip | Just for reading/writing cookies -- `document.cookie` is fine for this, no library needed |

**Implementation uses:**
- `localStorage` for fast client-side consent state reads
- `document.cookie` for persistence across sessions (set with `path=/`, `SameSite=Lax`, 1-year expiry)
- `window.gtag('consent', 'update', ...)` to communicate with GTM
- `useTranslations('consent')` from next-intl for bilingual banner text

**Google Consent Mode v2 parameters:**

| Parameter | Purpose | Default | User Can Grant |
|-----------|---------|---------|----------------|
| `analytics_storage` | GA4 cookies | `denied` | Yes (via banner) |
| `ad_storage` | Advertising cookies | `denied` | No (permanently denied -- no ads) |
| `ad_user_data` | User data for ads | `denied` | No (permanently denied) |
| `ad_personalization` | Ad personalization | `denied` | No (permanently denied) |

For this consulting site, only `analytics_storage` is toggleable. The ad-related parameters stay permanently denied since there are no advertising features.

### Case Studies: No New Dependencies

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| next-intl (existing) | 4.8.3 | Bilingual case study content | Case study content goes into existing `messages/es.json` and `messages/en.json` under a new `caseStudies` namespace. Same pattern as services, FAQ, and every other content section. | HIGH |
| Next.js App Router (existing) | 16.1.6 | Case study sections | New Server Components (`CaseStudiesSection`, `CaseStudyCard`) using `getTranslations()`. Zero JavaScript shipped to client. Placed on home page between ProcessSection and CtaBand. | HIGH |

**Why NOT MDX, CMS, or separate data files:**

| Alternative | Why Not |
|-------------|---------|
| @next/mdx + @mdx-js/loader + @mdx-js/react | 3 new dependencies for 3 static case studies. MDX is for long-form rich content; case studies are structured data (title, problem, intervention, result, metric). |
| Sanity / Contentful / Strapi | Adds API latency, dashboard, potential cost, and a dependency for content that changes quarterly. The owner is a developer. |
| `data/case-studies.json` (separate file) | Would require manual locale handling. Putting content in the i18n message files means bilingual switching is automatic. |
| MDX with frontmatter | Reasonable for 10+ case studies with rich formatting. For 3 short narratives, it is unnecessary complexity. |

### Messaging Updates: No New Dependencies

Content-only changes to existing `messages/es.json` and `messages/en.json`:

- Hero section: LatAm differentiation value proposition
- CTA copy: concrete diagnostic deliverable framing ("you receive X")
- New section: competitive positioning (solo consultant vs platforms)

All handled by editing translation JSON files and adding new React Server Components using existing patterns.

### Vercel Deployment: No New Project Dependencies

| Item | Purpose | Notes |
|------|---------|-------|
| Vercel GitHub Integration | Automatic deploys on git push | Zero config for Next.js projects. Push to main = production. Push to branches = preview deploys. |
| Vercel Pro ($20/mo) | Production hosting | Required for commercial use per Vercel terms. Hobby plan is personal/non-commercial only. |
| `npx vercel` (optional) | Local preview deployment testing | Not a project dependency. Runs via npx on demand. |

---

## Installation

```bash
# v1.1 requires ZERO new npm packages.
# All features are built using existing dependencies + built-in Next.js capabilities.
```

**Explanation:** The only candidate for a new dependency was `@next/third-parties`, which was disqualified by its lack of consent mode support. Everything else (cookie consent, case studies, messaging, event tracking) uses the existing stack.

## Environment Variables (New for v1.1)

| Variable | Where | Purpose | Example |
|----------|-------|---------|---------|
| `NEXT_PUBLIC_GTM_ID` | Vercel dashboard + `.env.local` | Google Tag Manager container ID | `GTM-XXXXXXX` |

**Why `NEXT_PUBLIC_` prefix:** GTM ID must be available on the client side (the script tag renders in the browser). The `NEXT_PUBLIC_` prefix exposes it to the client bundle. This is safe -- GTM IDs are public by design (they appear in the page source of every site using GTM).

**Do NOT create environment variables for:**
- GA4 Measurement ID -- configured inside GTM console, not in code
- Cookie consent settings -- stored in user's localStorage/cookie, not server-side

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Manual GTM via `next/script` | `@next/third-parties/google` GoogleTagManager | Only if you do NOT need consent mode (e.g., internal tool with no external users, no privacy requirements). For any public-facing site with cookie consent, manual `next/script` gives necessary loading order control. |
| Manual GTM via `next/script` | `@next/third-parties/google` GoogleAnalytics (standalone) | Only if you refuse to use GTM and want direct GA4 only. But this locks you out of adding future tags (Hotjar, Meta Pixel, etc.) without code changes. GTM is the better long-term hub. |
| Custom cookie consent component | react-cookie-consent npm | If you need complex multi-category consent (functional, analytics, marketing, performance as separate toggles). For a site with analytics-only cookies, custom is simpler and lighter. |
| Custom cookie consent component | CookieYes / OneTrust SaaS | If legal compliance mandates a certified Consent Management Platform. A LatAm consulting site does not need this. |
| JSON locale files for case studies | MDX files | If case studies grow beyond 10+ or need rich formatting (code blocks, embedded media, interactive demos). |
| JSON locale files for case studies | Headless CMS | If a non-developer needs to edit case studies frequently. Matias controls all content. |
| Home page section for case studies | Separate `/case-studies` route | If studies grow beyond 5+ or become long-form (1000+ words each). For 3 concise narratives, a home page section is more effective for conversion. |

## What NOT to Add

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `@next/third-parties` | Lack of consent mode v2 support is a blocking limitation for this project. Verified via GitHub discussions #64497, #66718. | `next/script` (built-in) with manual GTM snippet |
| `react-ga4` | Outdated approach. GA4 should be managed through GTM, not a direct React wrapper. Last meaningful update was 2023. | GTM with GA4 configured as a tag |
| `@analytics/google-analytics` | Over-abstracted analytics library. Adds unnecessary indirection. | Direct `window.dataLayer.push()` calls |
| `js-cookie` | `document.cookie` API is sufficient for one cookie. No need for a library to manage a single consent cookie. | Direct `document.cookie` manipulation |
| `react-cookie-consent` | 15KB for something achievable in ~100 lines. Ships CSS that conflicts with Tailwind. | Custom consent banner component |
| `@next/mdx` / `mdx-bundler` | No MDX content in this project. Case studies are structured data, not freeform documents. | JSON locale files |
| Any CMS SDK | No dynamic content, no non-developer editors, no frequently changing content. | JSON locale files |
| `posthog-js` / PostHog | Adds a second analytics service. GA4 is free and sufficient for consulting lead-gen. | GA4 via GTM |
| Google Consent Mode libraries | `gtag('consent', 'default', ...)` and `gtag('consent', 'update', ...)` are two function calls. No library needed. | Direct gtag calls |

## Custom Event Tracking Strategy

Events fired via `window.dataLayer.push()` from client components, routed by GTM to GA4.

| Event Name | Trigger | Data | Component |
|------------|---------|------|-----------|
| `cta_click` | Any CTA button/link click | `{ cta_location: 'hero' \| 'cta_band' \| 'services_cta' \| 'case_study' }` | TrackedCTA (new Client Component wrapper) |
| `form_start` | First field focus in contact form | `{ form_name: 'contact' }` | ContactForm (existing, modified) |
| `form_submit` | Form submission initiated | `{ form_name: 'contact' }` | ContactForm (existing, modified) |
| `form_success` | Server Action returns success | `{ form_name: 'contact' }` | ContactForm (existing, modified) |
| `whatsapp_click` | WhatsApp button click | `{}` | WhatsAppButton (existing, modified) |
| `case_study_view` | Case study section enters viewport | `{ case_study_id: string }` | CaseStudyCard (new, optional) |

**Note:** Events are pushed to dataLayer regardless of consent state. GTM handles the gating -- tags configured with consent requirements only fire when consent is granted. Do NOT add `if (hasConsent)` checks in component code; this creates a parallel consent system that conflicts with GTM's built-in handling.

## TypeScript Considerations

Add GTM global types for `window.dataLayer` and `window.gtag`:

```typescript
// src/types/gtm.d.ts
interface Window {
  dataLayer: Record<string, unknown>[];
  gtag: (...args: unknown[]) => void;
}
```

This prevents TypeScript errors when calling `window.dataLayer.push()` and `window.gtag()` in client components.

## Version Compatibility (No New Packages)

Since v1.1 adds no new npm packages, there are no new version compatibility concerns. The existing stack versions remain valid as documented in v1.0 STACK.md research.

The only external version consideration is the GTM container configuration, which is managed in the GTM web console and has no npm version.

## Integration Points

### Where the AnalyticsProvider fits in existing layout

The `AnalyticsProvider` renders `<Script>` components inside the `<body>`. It goes OUTSIDE `NextIntlClientProvider` (it needs no translations) but inside `<body>`:

```typescript
// src/app/[locale]/layout.tsx -- conceptual placement
<html lang={locale} suppressHydrationWarning>
  <head>
    {/* existing theme script */}
  </head>
  <body>
    <ThemeSync />
    <AnalyticsProvider />        {/* NEW: consent defaults + GTM script */}
    <NextIntlClientProvider>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <WhatsAppButton />
      <CookieConsentBanner />    {/* NEW: inside provider for translations */}
    </NextIntlClientProvider>
  </body>
</html>
```

### Where case studies fit

A `<CaseStudiesSection />` Server Component on the home page, between `<ProcessSection />` and `<CtaBand />`:

```typescript
// src/app/[locale]/page.tsx -- conceptual placement
<HeroSection />
<ScrollReveal><ProblemSection /></ScrollReveal>
<ScrollReveal delay={100}><ServicesPreview /></ScrollReveal>
<ScrollReveal delay={100}><ProcessSection /></ScrollReveal>
<ScrollReveal><CaseStudiesSection /></ScrollReveal>  {/* NEW */}
<ScrollReveal><CtaBand /></ScrollReveal>
```

### Where messaging updates fit

Direct edits to existing keys in `messages/es.json` and `messages/en.json`. New keys for:
- `home.hero` -- LatAm differentiation angle in subtitle
- `common.cta` -- concrete deliverable framing
- `home.positioning` -- new competitive positioning section (if added as standalone section)

## Sources

- [Next.js Official Docs: Third Party Libraries](https://nextjs.org/docs/app/guides/third-party-libraries) -- Confirmed GoogleTagManager API, official recommendation to use GTM over separate GA4 component. Also confirmed `sendGTMEvent` is just a dataLayer push wrapper. (HIGH confidence, verified 2026-02-27)
- [Next.js GitHub Discussion #64497](https://github.com/vercel/next.js/discussions/64497) -- Consent mode not built into @next/third-parties, custom wrapper via next/script required. Multiple community confirmations. (HIGH confidence)
- [Next.js GitHub Discussion #66718](https://github.com/vercel/next.js/discussions/66718) -- Confirms no consent mode support in GoogleAnalytics component from @next/third-parties. Discussion remains unresolved. (HIGH confidence)
- [Google Consent Mode v2 Official Docs](https://developers.google.com/tag-platform/security/guides/consent) -- Required parameters: analytics_storage, ad_storage, ad_user_data, ad_personalization. Default denied, update on accept. (HIGH confidence)
- [npm: @next/third-parties@16.1.6](https://www.npmjs.com/package/@next/third-parties) -- Version verified via `npm view`. Peer deps: next@^13-16, react@^18-19. Would be compatible, but consent mode gap is the blocker. (HIGH confidence)
- [Build with Matija: Next.js Cookie Consent Banner](https://www.buildwithmatija.com/blog/build-cookie-consent-banner-nextjs-15-server-client) -- No-library approach pattern confirmed viable for Next.js 15+. (MEDIUM confidence)
- [GTM Consent Mode v2 in React/Next.js (Cloud66)](https://blog.cloud66.com/google-tag-manager-consent-mode-v2-in-react) -- Implementation pattern with `beforeInteractive` + `afterInteractive` script strategies. (MEDIUM confidence)
- [Aclarify: GTM with Consent Mode in Next.js](https://www.aclarify.com/blog/how-to-set-up-google-tag-manager-with-consent-mode-in-nextjs) -- Confirmed consent defaults must come before GTM, working Next.js implementation. (MEDIUM confidence)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables) -- `NEXT_PUBLIC_` prefix requirement for client-side access confirmed. (HIGH confidence)
- [Simo Ahava: Consent Mode v2 for Google Tags](https://www.simoahava.com/analytics/consent-mode-v2-google-tags/) -- Authoritative analytics expert on GTM consent implementation patterns. (HIGH confidence)

---
*Stack research for: M. Gripe v1.1 -- analytics, cookie consent, case studies, messaging*
*Researched: 2026-02-27*
