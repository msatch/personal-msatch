# Architecture Research

**Domain:** Multi-page personal brand consulting website (bilingual, static-first)
**Researched:** 2026-02-16
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Presentation Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Home    │  │   Bio    │  │ Services │  │ Contact  │       │
│  │  Page    │  │   Page   │  │   Page   │  │   Page   │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │              │             │              │             │
│  ┌────┴──────────────┴─────────────┴──────────────┴──────┐     │
│  │              Shared Layout (Nav + Footer)              │     │
│  └───────────────────────┬───────────────────────────────┘     │
├──────────────────────────┼──────────────────────────────────────┤
│                  Internationalization Layer                     │
│  ┌───────────┐  ┌────────┴────────┐  ┌───────────────┐        │
│  │ Middleware │→ │  [locale] Route  │→ │  messages/    │        │
│  │ (detect)  │  │  (en | es)       │  │  en.json      │        │
│  └───────────┘  └─────────────────┘  │  es.json      │        │
│                                       └───────────────┘        │
├─────────────────────────────────────────────────────────────────┤
│                     Integration Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Server Action │  │    GTM       │  │  SEO / OG    │         │
│  │ (Resend API) │  │ (Analytics)  │  │  (Metadata)  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
├─────────────────────────────────────────────────────────────────┤
│                     Infrastructure                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Vercel     │  │  Resend API  │  │  GA4 (via    │         │
│  │  (Hosting)   │  │  (Email)     │  │   GTM)       │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Root Layout | HTML shell, `<html lang>`, font loading, GTM script, `NextIntlClientProvider` | `app/[locale]/layout.tsx` — Server Component |
| Page Components | Route-specific UI: Hero, cards, form, bio sections | `app/[locale]/page.tsx`, `app/[locale]/bio/page.tsx`, etc. — Server Components |
| Shared UI | Navigation bar, footer, language toggle, CTA button | `components/` — mix of Server and Client Components |
| Contact Form | Client-side form with validation, calls Server Action | `components/contact-form.tsx` — Client Component (`'use client'`) |
| Server Action | Validates input, sends email via Resend SDK | `app/actions/send-email.ts` — Server-only (`'use server'`) |
| i18n Routing | Locale detection, redirect, URL prefix management | `src/i18n/routing.ts` + `middleware.ts` |
| i18n Navigation | Locale-aware `<Link>`, `redirect`, `useRouter` | `src/i18n/navigation.ts` (wraps next-intl helpers) |
| i18n Request Config | Loads correct message file per locale | `src/i18n/request.ts` |
| Analytics | GTM container loads GA4; event tracking via `sendGTMEvent` | `@next/third-parties/google` `GoogleTagManager` in root layout |
| SEO | Per-page metadata, Open Graph, JSON-LD schema | `generateMetadata()` in each `page.tsx` + shared `metadata.ts` helpers |

## Recommended Project Structure

```
personal-msatch/
├── public/
│   ├── images/               # Static images (headshot, logos, OG image)
│   ├── fonts/                # Self-hosted font files (if not using next/font)
│   └── favicon.ico
├── messages/
│   ├── en.json               # English translations (flat namespace per page)
│   └── es.json               # Spanish translations
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx    # Root layout: html, body, nav, footer, providers
│   │   │   ├── page.tsx      # Home page
│   │   │   ├── bio/
│   │   │   │   └── page.tsx  # Bio / About page
│   │   │   ├── services/
│   │   │   │   └── page.tsx  # Services page
│   │   │   └── contact/
│   │   │       └── page.tsx  # Contact page
│   │   └── not-found.tsx     # Global 404
│   ├── components/
│   │   ├── layout/
│   │   │   ├── navbar.tsx    # Navigation bar + language toggle
│   │   │   └── footer.tsx    # Site footer
│   │   ├── ui/
│   │   │   ├── button.tsx    # Shared button component
│   │   │   ├── card.tsx      # Service card
│   │   │   └── section.tsx   # Reusable section wrapper
│   │   ├── home/
│   │   │   ├── hero.tsx      # Hero section
│   │   │   ├── problems.tsx  # Pain points section
│   │   │   └── cta-band.tsx  # CTA banner
│   │   ├── services/
│   │   │   ├── service-card.tsx
│   │   │   └── method-steps.tsx
│   │   ├── bio/
│   │   │   ├── credentials.tsx
│   │   │   └── social-proof.tsx
│   │   └── contact/
│   │       ├── contact-form.tsx   # Client Component: form + validation
│   │       └── form-success.tsx   # Success state after submission
│   ├── actions/
│   │   └── send-email.ts         # Server Action: validate + Resend
│   ├── i18n/
│   │   ├── routing.ts            # defineRouting({ locales, defaultLocale })
│   │   ├── navigation.ts         # createNavigation(routing) exports
│   │   └── request.ts            # getRequestConfig (loads messages)
│   ├── lib/
│   │   ├── metadata.ts           # Shared metadata/OG helpers
│   │   ├── schema.ts             # JSON-LD schema generators
│   │   └── analytics.ts          # GTM event helpers (thin wrappers)
│   └── styles/
│       └── globals.css           # Tailwind directives + custom CSS vars
├── middleware.ts                  # next-intl locale detection middleware
├── tailwind.config.ts
├── next.config.ts                # createNextIntlPlugin() wrapper
├── tsconfig.json
├── package.json
└── .env.local                    # RESEND_API_KEY, GTM_ID
```

### Structure Rationale

- **`messages/` at root:** next-intl convention. Keeps translations separate from code. One JSON per locale with nested keys by page/section (`home.hero.title`, `services.card1.title`).
- **`src/app/[locale]/`:** All routes nested under dynamic locale segment. next-intl middleware detects language from headers or cookie and redirects to `/es/` or `/en/`. Every page gets locale via params.
- **`src/components/` by domain:** Components grouped by the page they serve (`home/`, `bio/`, `services/`, `contact/`), plus shared `layout/` and `ui/` folders. This avoids a flat pile of files and makes it clear which component belongs where.
- **`src/actions/`:** Server Actions isolated from components. Only `send-email.ts` for now. Easy to add more later without touching component tree.
- **`src/i18n/`:** Three-file convention from next-intl docs: `routing.ts` (config), `navigation.ts` (locale-aware Link/router), `request.ts` (server message loading).
- **`src/lib/`:** Pure utility functions with no React dependencies. Metadata helpers, JSON-LD generators, analytics event wrappers.

## Architectural Patterns

### Pattern 1: Locale-Prefixed Static Generation

**What:** Every page is statically generated at build time for each locale (`/en/`, `/es/`, `/en/bio/`, `/es/bio/`, etc.) using `generateStaticParams` + `setRequestLocale`.
**When to use:** All pages on this site — content is known at build time, no dynamic data.
**Trade-offs:** Fastest possible page loads and zero server cost. Requires rebuild to change content (acceptable for a personal site with infrequent updates).

**Example:**
```typescript
// app/[locale]/layout.tsx
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
```

### Pattern 2: Server Action for Contact Form

**What:** The contact form is a Client Component (`'use client'`) that calls a Server Action marked with `'use server'`. The Server Action validates input, calls Resend API, and returns a result. No API route needed.
**When to use:** The contact form — the only server-side interaction on the site.
**Trade-offs:** Simpler than a separate API route (fewer files, no fetch boilerplate). Resend API key stays on the server. The form page itself cannot be fully static (the action is server-side), but the form UI renders from static HTML and hydrates on client.

**Example:**
```typescript
// src/actions/send-email.ts
'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  // Honeypot check
  if (formData.get('website')) {
    return { success: true }; // Silent discard
  }

  const { error } = await resend.emails.send({
    from: 'M. Gripe Site <noreply@yourdomain.com>',
    to: 'matias@yourdomain.com',
    subject: `Contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  });

  if (error) {
    return { success: false, error: 'Failed to send message.' };
  }
  return { success: true };
}
```

### Pattern 3: GTM as Single Analytics Hub

**What:** Load Google Tag Manager via `@next/third-parties/google` in the root layout. Configure GA4 inside the GTM container (not as a separate script). Track custom events via `sendGTMEvent`.
**When to use:** All analytics needs — pageviews, CTA clicks, form interactions.
**Trade-offs:** One script tag instead of two. All tracking configuration lives in GTM (can be updated without code deploys). Slightly more GTM setup but avoids the duplicate-event problem that happens when loading both GA4 and GTM scripts.

**Example:**
```typescript
// In app/[locale]/layout.tsx
import { GoogleTagManager } from '@next/third-parties/google';

export default function Layout({ children }) {
  return (
    <html>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
      <body>{children}</body>
    </html>
  );
}

// In a Client Component for event tracking
'use client';
import { sendGTMEvent } from '@next/third-parties/google';

function CTAButton() {
  return (
    <button onClick={() => sendGTMEvent({ event: 'cta_click', value: 'hero' })}>
      Book a call
    </button>
  );
}
```

## Data Flow

### Page Request Flow (Static)

```
Browser requests /es/services
    |
    v
Vercel CDN serves pre-built static HTML + JS
    |
    v
Browser hydrates React components
    |
    v
next-intl reads locale from URL segment → loads es.json messages
    |
    v
Components render with Spanish translations
```

### Contact Form Submission Flow

```
User fills form (Client Component)
    |
    v
Form calls Server Action (sendContactEmail)
    |
    v
Server Action validates fields + checks honeypot
    |
    v
Resend SDK sends email (server-side, API key hidden)
    |
    v
Server Action returns { success: true/false }
    |
    v
Client Component shows success message or error
    |
    v
sendGTMEvent({ event: 'form_submit', status: 'success' })
```

### Language Toggle Flow

```
User clicks language toggle (Client Component)
    |
    v
next-intl navigation.ts redirect() or <Link> to /en/* or /es/*
    |
    v
Next.js navigates client-side (no full reload)
    |
    v
New locale loads from URL segment → different messages/*.json
    |
    v
All translated components re-render with new locale strings
```

### Analytics Event Flow

```
User interaction (click, form start, scroll)
    |
    v
Client Component calls sendGTMEvent({ event, data })
    |
    v
GTM dataLayer receives event
    |
    v
GTM container routes to GA4 (configured inside GTM)
    |
    v
GA4 records event
```

### Key Data Flows Summary

1. **Content flow:** `messages/*.json` --> `next-intl request.ts` --> Server Components via `getTranslations()` or Client Components via `useTranslations()`. All text content lives in translation files, not hardcoded in components.
2. **Form data flow:** Client Component (FormData) --> Server Action --> Resend API --> Email inbox. Unidirectional; no database, no state persistence.
3. **Analytics flow:** User interaction --> `sendGTMEvent` --> GTM dataLayer --> GA4. GTM owns all routing decisions.
4. **Navigation flow:** `next-intl` `<Link>` and `useRouter` handle locale-prefixed URLs. Middleware handles initial locale detection from Accept-Language header or cookie.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k visitors/month | Current architecture is perfect. Static pages served from CDN. Zero server cost on Vercel free tier. Resend free tier (100 emails/day) is more than sufficient. |
| 1k-10k visitors/month | No changes needed. Static CDN scales linearly. Consider adding rate limiting to the contact Server Action if spam becomes an issue. |
| 10k+ visitors/month | Still fine architecturally. Consider: (1) Adding a blog with MDX for content marketing (ISR or static), (2) Upgrading Resend plan if form volume increases, (3) Adding Cloudflare or Vercel WAF rules for protection. |

### Scaling Priorities

1. **First concern (spam):** Honeypot field handles basic bots. If volume increases, add server-side rate limiting (Vercel Edge Middleware with IP-based throttling) or a lightweight CAPTCHA (hCaptcha is lighter than reCAPTCHA).
2. **Second concern (content growth):** If blog is added later, use MDX files in the repo with `generateStaticParams` — same static generation pattern, no database needed.

## Anti-Patterns

### Anti-Pattern 1: Loading Both GA4 and GTM Scripts

**What people do:** Include both `<GoogleAnalytics gaId="G-XXX" />` and `<GoogleTagManager gtmId="GTM-XXX" />` in the layout.
**Why it's wrong:** Sends duplicate events — once directly to GA4 and once through GTM. Inflates metrics and makes debugging impossible.
**Do this instead:** Use GTM only. Configure the GA4 Measurement ID inside the GTM container. One script, one data flow.

### Anti-Pattern 2: Hardcoding Text in Components

**What people do:** Write Spanish text directly in JSX (`<h1>Servicios</h1>`) and plan to "add i18n later."
**Why it's wrong:** Extracting hardcoded strings after building multiple pages is tedious and error-prone. You miss strings, break layouts, introduce key mismatches.
**Do this instead:** Use translation keys from day one. Every user-visible string goes through `t('key')` from the start. The overhead is minimal and saves hours of refactoring.

### Anti-Pattern 3: API Route Instead of Server Action for Form

**What people do:** Create `app/api/send/route.ts` and have the Client Component POST to it via `fetch()`.
**Why it's wrong:** For a single form, an API route adds unnecessary indirection — you need to define the route, serialize/deserialize the request, and handle CORS. Server Actions do this automatically.
**Do this instead:** Use a Server Action (`'use server'` function) called directly from the form's `action` prop or via `useActionState`. Fewer files, type-safe, no fetch boilerplate.

### Anti-Pattern 4: Using `next export` (Static Export) When You Need Server Actions

**What people do:** Set `output: 'export'` in `next.config.ts` to get a fully static site.
**Why it's wrong:** `output: 'export'` disables Server Actions, API routes, middleware, and dynamic routes. The contact form Server Action and next-intl middleware both require a server. Vercel's default deployment mode gives you static pages where possible and serverless functions only where needed.
**Do this instead:** Use standard Vercel deployment (no `output: 'export'`). Pages without server logic are automatically statically optimized. The Server Action runs as a serverless function only when the form is submitted.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Resend | Server Action calls `resend.emails.send()` | API key in `.env.local`. Free tier: 100 emails/day, 3,000/month. Sufficient for consulting leads. |
| Google Tag Manager | `@next/third-parties/google` `GoogleTagManager` component in root layout | GTM container ID in env var. GA4 configured inside GTM, not as separate script. |
| Vercel | `git push` triggers build + deploy. Static pages to CDN, Server Action to serverless function. | Free tier: 100 GB bandwidth, serverless functions included. Custom domain added later. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Page Components <-> Translation System | `getTranslations()`/`useTranslations()` with namespace keys | Server Components use async `getTranslations`, Client Components use `useTranslations` hook. Both read from same `messages/*.json`. |
| Contact Form (Client) <-> Server Action | Direct function call via React `action` prop or `useActionState` | Type-safe. FormData passed automatically. No manual serialization. |
| Components <-> Analytics | `sendGTMEvent()` from `@next/third-parties/google` | Only in Client Components (needs `'use client'`). Fire-and-forget; no response handling. |
| Middleware <-> Routing | next-intl middleware intercepts all requests, detects locale, rewrites URL | Runs on Edge. Matcher excludes `/_next/`, `/api/`, and static files. |

## Build Order (Dependency Chain)

Components have clear dependencies that dictate build order:

```
Phase 1: Foundation (no dependencies)
├── next.config.ts + tailwind.config.ts + tsconfig.json
├── src/i18n/ (routing.ts, navigation.ts, request.ts)
├── middleware.ts
├── messages/en.json + messages/es.json (initial keys)
└── src/styles/globals.css (Tailwind + CSS vars + fonts)

Phase 2: Shell (depends on Phase 1)
├── app/[locale]/layout.tsx (requires i18n, GTM, fonts)
├── components/layout/navbar.tsx (requires i18n navigation)
└── components/layout/footer.tsx (requires i18n)

Phase 3: Pages — can be built in parallel (depends on Phase 2)
├── Home page + components (hero, problems, cta-band)
├── Bio page + components (credentials, social-proof)
├── Services page + components (service-card, method-steps)
└── Contact page (static shell — form added in Phase 4)

Phase 4: Contact Form (depends on Phase 3 contact page)
├── src/actions/send-email.ts (Server Action + Resend)
├── components/contact/contact-form.tsx (Client Component)
└── components/contact/form-success.tsx

Phase 5: Polish (depends on Phases 3-4)
├── src/lib/metadata.ts + generateMetadata in each page
├── src/lib/schema.ts (JSON-LD)
├── src/lib/analytics.ts (GTM event wrappers)
├── Micro-interactions (scroll reveals, hover states)
└── Accessibility audit (contrast, keyboard nav, labels)
```

**Rationale:** i18n must be wired first because every component depends on translation keys. Layout shell must exist before pages (pages render inside it). Pages are independent of each other and can be built in parallel. The contact form is the only interactive component and has a Server Action dependency, so it comes after the static pages. SEO/analytics/polish layer is last because it touches everything but blocks nothing.

## Sources

- [Next.js App Router: Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages) (official docs, v16.1.6, updated 2026-02-11) — HIGH confidence
- [Next.js Third-Party Libraries Guide](https://nextjs.org/docs/app/guides/third-party-libraries) (official docs, v16.1.6, updated 2026-02-11) — HIGH confidence
- [next-intl App Router Setup](https://next-intl.dev/docs/getting-started/app-router) (official docs) — HIGH confidence
- [next-intl Routing Setup](https://next-intl.dev/docs/routing/setup) (official docs) — HIGH confidence
- [Resend: Send emails with Next.js](https://resend.com/nextjs) (official docs) — HIGH confidence
- [Next.js Internationalization Guide](https://nextjs.org/docs/app/guides/internationalization) (official docs) — HIGH confidence
- [Next.js Server Actions and Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) (official docs) — HIGH confidence
- [GA4 Implementation with GTM in Next.js](https://blog.devgenius.io/integrating-google-analytics-4-google-tag-manager-in-react-and-next-js-1db0b9c43949) — MEDIUM confidence

---
*Architecture research for: M. Gripe personal brand consulting website*
*Researched: 2026-02-16*
