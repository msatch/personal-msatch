# Phase 7: Deployment & Launch - Research

**Researched:** 2026-03-01
**Domain:** Vercel deployment, Next.js 16 production, Resend email production, GTM production
**Confidence:** HIGH

## Summary

Phase 7 deploys the completed v1.1 site to Vercel and verifies all features work in production. The project is a Next.js 16 App Router application with next-intl for i18n (ES/EN), Resend for email delivery via Server Actions, and GTM/GA4 for analytics with cookie consent. All code is complete -- this phase is purely about infrastructure configuration, deployment, and production verification.

The project already builds successfully locally (`next build` produces 14 static pages across both locales). It uses `proxy.ts` (Next.js 16's replacement for `middleware.ts`) for locale routing, `generateStaticParams` for static generation, and Server Actions for the contact form. The GitHub remote (`msatch/personal-msatch`) is ready for Vercel's Git integration.

**Primary recommendation:** Use Vercel's GitHub integration (not CLI-only) to import the repository. Configure environment variables in the Vercel dashboard before the first production deployment. Verify Resend domain before going live so emails deliver from a custom domain, not `onboarding@resend.dev`.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DEPLOY-01 | Site deployed to Vercel and accessible via public URL | Vercel GitHub integration import, auto-detection of Next.js 16, proxy.ts compatible with Vercel Node.js runtime |
| DEPLOY-02 | All pages render correctly in production (both /es/ and /en/ routes) | generateStaticParams pre-renders all locale routes; proxy.ts handles locale routing; build output confirms 14 static pages |
| DEPLOY-03 | Contact form submits successfully in production and delivers email via Resend | Server Action uses RESEND_API_KEY (server-side env var); Resend domain verification required for production email delivery |
</phase_requirements>

## Standard Stack

### Core (Already in Project)
| Library | Version | Purpose | Production Notes |
|---------|---------|---------|-----------------|
| Next.js | 16.1.6 | App Router framework | Vercel auto-detects, builds with `next build` |
| next-intl | 4.8.3 | i18n routing via proxy.ts | proxy.ts runs on Node.js runtime (not Edge) on Vercel |
| Resend | 6.9.2 | Email delivery from contact form | Needs RESEND_API_KEY env var in Vercel dashboard |
| Tailwind CSS | 4 | Styling | Build-time only, no production config needed |
| Zod | 4.3.6 | Form validation | Server-side, no production config needed |

### External Services (Require Configuration)
| Service | Purpose | Configuration Needed |
|---------|---------|---------------------|
| Vercel | Hosting + serverless | Import GitHub repo, set env vars |
| Resend | Email delivery | API key, domain verification (DNS records) |
| Google Tag Manager | Analytics container | Real GTM container ID in NEXT_PUBLIC_GTM_ID |
| Google Analytics 4 | Page tracking | GA4 property created, tag configured inside GTM |

### No New Packages Needed

This phase requires zero new npm packages. All deployment configuration happens at the infrastructure level (Vercel dashboard, Resend dashboard, GTM console).

## Architecture Patterns

### Environment Variables Map

The project uses 4 environment variables that must be configured in Vercel:

```
Server-side only (no NEXT_PUBLIC_ prefix):
  RESEND_API_KEY        - Resend API key for email delivery
  RESEND_FROM_EMAIL     - Sender address (e.g., "M. Gripe Website <noreply@mgripe.com>")
  RESEND_TO_EMAIL       - Recipient address (e.g., "contact@mgripe.com")

Client-side (NEXT_PUBLIC_ prefix):
  NEXT_PUBLIC_GTM_ID    - Google Tag Manager container ID (e.g., "GTM-XXXXXXX")
```

**Critical:** `RESEND_API_KEY` must NOT have the `NEXT_PUBLIC_` prefix -- it is accessed in Server Actions only. The current code is correct.

**Fallback behavior in code:**
- `RESEND_FROM_EMAIL` defaults to `'M. Gripe Website <onboarding@resend.dev>'`
- `RESEND_TO_EMAIL` defaults to `'contact@mgripe.com'`
- `NEXT_PUBLIC_GTM_ID` -- if unset, `AnalyticsProvider` renders `null` (GTM does not load)
- `RESEND_API_KEY` -- if unset, Resend constructor gets `undefined`, emails will fail

### Build Output Structure

The `next build` output shows:
```
Route (app)
  /                          (Static - root redirect)
  /_not-found                (Static)
  /[locale]                  (SSG - es, en)
  /[locale]/[...rest]        (Dynamic - catch-all for 404s)
  /[locale]/bio              (SSG - es/bio, en/bio)
  /[locale]/contact          (SSG - es/contact, en/contact)
  /[locale]/privacy          (SSG - es/privacy, en/privacy)
  /[locale]/services         (SSG - es/services, en/services)

  Proxy (proxy.ts)           - Node.js runtime locale routing
```

All pages except `[...rest]` are statically generated. The contact form uses a Server Action (serverless function), not a separate API route.

### Deployment Flow

```
1. Push all code to GitHub (main branch)
2. Import repo in Vercel dashboard (vercel.com/new)
3. Vercel auto-detects Next.js 16
4. Add environment variables in Vercel project settings
5. Deploy (automatic on import)
6. Verify all routes, form submission, and analytics in production
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CI/CD pipeline | Custom GitHub Actions for deploy | Vercel Git Integration | Auto-detects Next.js, handles builds, preview deploys, zero config |
| SSL certificates | Manual cert management | Vercel automatic HTTPS | Free, auto-renewed, covers custom domains |
| CDN configuration | Custom CDN setup | Vercel Edge Network | Static assets served from edge automatically |
| Serverless functions | Custom lambda setup | Vercel auto-detects Server Actions | Next.js Server Actions become serverless functions automatically |
| Domain routing | nginx/redirect config | Vercel domain settings | Built-in www redirect, custom domain CNAME |

**Key insight:** Vercel is the canonical deployment target for Next.js. Every feature in this project (proxy.ts, Server Actions, generateStaticParams, next/script) is natively supported with zero additional configuration files needed.

## Common Pitfalls

### Pitfall 1: Missing Environment Variables
**What goes wrong:** Site deploys but contact form returns 500 errors, or GTM does not load.
**Why it happens:** Environment variables from `.env.local` are NOT automatically transferred to Vercel. They must be manually added in the Vercel dashboard.
**How to avoid:** Add all 4 environment variables (RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL, NEXT_PUBLIC_GTM_ID) in Vercel project settings BEFORE the first production deployment.
**Warning signs:** Contact form submission fails silently; GTM container not loading in Network tab.

### Pitfall 2: Resend Sending From onboarding@resend.dev
**What goes wrong:** Emails send but arrive from `onboarding@resend.dev` instead of `noreply@mgripe.com`, or emails only deliver to the account owner's email.
**Why it happens:** Without domain verification in Resend, you can only send test emails to the account holder's email using the sandbox domain. The current code defaults to `onboarding@resend.dev` if `RESEND_FROM_EMAIL` is not set.
**How to avoid:** Verify the sending domain in Resend dashboard (requires adding SPF and DKIM DNS records). DNS propagation takes up to 48 hours -- start this before deployment day.
**Warning signs:** Emails arrive from unexpected sender; emails to non-owner addresses fail.

### Pitfall 3: NEXT_PUBLIC_GTM_ID Placeholder Value
**What goes wrong:** GTM script loads but sends no data to GA4.
**Why it happens:** The `.env.local` currently has `GTM-XXXXXXX` as a placeholder. If this placeholder is copied to Vercel, GTM loads a non-existent container.
**How to avoid:** Create the actual GTM container at tagmanager.google.com, set up GA4 tag inside it, then use the real container ID (format: `GTM-XXXXXX`).
**Warning signs:** GTM script loads (200 response) but GA4 Realtime report shows no users.

### Pitfall 4: WhatsApp Placeholder Phone Number
**What goes wrong:** WhatsApp CTA opens but targets the wrong number.
**Why it happens:** The WhatsApp number `5215512345678` is hardcoded as a placeholder in `whatsapp-button.tsx`. This is a code-level placeholder, not an environment variable.
**How to avoid:** Update the `WHATSAPP_NUMBER` constant in `src/components/layout/whatsapp-button.tsx` with the real business phone number before deploying.
**Warning signs:** Mobile users tap WhatsApp button and reach a wrong or non-existent number.

### Pitfall 5: Forgetting to Redeploy After Env Var Changes
**What goes wrong:** Environment variable is set in Vercel but the old deployment still uses the old value.
**Why it happens:** `NEXT_PUBLIC_*` variables are inlined at build time. Changing them in Vercel settings does NOT take effect until a new deployment is triggered.
**How to avoid:** After changing any environment variable (especially `NEXT_PUBLIC_GTM_ID`), trigger a redeployment from the Vercel dashboard or push a new commit.
**Warning signs:** Dashboard shows new env var value, but production still uses old one.

### Pitfall 6: next-intl Locale Cookie on Vercel
**What goes wrong:** Language preference resets when navigating between pages after switching locale.
**Why it happens:** Known community-reported issue with next-intl cookie handling on Vercel. The project uses `localeCookie` with name `NEXT_LOCALE` and 1-year `maxAge`.
**How to avoid:** Test locale switching thoroughly on the preview deployment. The project's proxy.ts and routing configuration appear correct. If issues arise, check that the cookie `NEXT_LOCALE` is being set correctly in production (browser DevTools > Application > Cookies).
**Warning signs:** User switches to EN, navigates, and page reverts to ES.

## Code Examples

### Vercel Environment Variables Configuration

These are the exact key-value pairs to add in Vercel Project Settings > Environment Variables:

```
Key: RESEND_API_KEY
Value: re_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  (from resend.com/api-keys)
Environment: Production, Preview

Key: RESEND_FROM_EMAIL
Value: M. Gripe Website <noreply@mgripe.com>
Environment: Production

Key: RESEND_TO_EMAIL
Value: contact@mgripe.com  (or owner's actual email)
Environment: Production

Key: NEXT_PUBLIC_GTM_ID
Value: GTM-XXXXXXX  (real ID from tagmanager.google.com)
Environment: Production
```

### Resend Domain Verification DNS Records

Add these to the domain's DNS provider (example for mgripe.com):

```
Type: TXT
Name: resend._domainkey
Value: (provided by Resend dashboard after adding domain)

Type: TXT
Name: @
Value: v=spf1 include:amazonses.com ~all  (provided by Resend)

Type: TXT (optional but recommended)
Name: _dmarc
Value: v=DMARC1; p=none;  (minimum DMARC policy)
```

### Production Verification Checklist

```
Routes to verify (both locales):
  https://{domain}/           -> redirects to /es/
  https://{domain}/es         -> Home page (ES)
  https://{domain}/en         -> Home page (EN)
  https://{domain}/es/bio     -> Bio page (ES)
  https://{domain}/en/bio     -> Bio page (EN)
  https://{domain}/es/services -> Services page (ES)
  https://{domain}/en/services -> Services page (EN)
  https://{domain}/es/contact  -> Contact page (ES)
  https://{domain}/en/contact  -> Contact page (EN)
  https://{domain}/es/privacy  -> Privacy policy (ES)
  https://{domain}/en/privacy  -> Privacy policy (EN)
  https://{domain}/es/nonexistent -> 404 page (ES)
  https://{domain}/en/nonexistent -> 404 page (EN)

Functional checks:
  - Contact form submit -> email arrives at RESEND_TO_EMAIL
  - Language toggle ES <-> EN -> URL changes, content switches, preference persists
  - WhatsApp button (mobile) -> opens WhatsApp with pre-filled message
  - Cookie consent banner -> appears on first visit, Accept/Reject persists
  - GTM container -> loads in Network tab (gtm.js request)
  - GA4 Realtime -> shows page view after consent accepted
  - Dark mode toggle -> works, persists across navigation
  - 404 page -> shows for invalid routes in both locales
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| middleware.ts (Edge) | proxy.ts (Node.js) | Next.js 16 (Oct 2025) | proxy.ts is the correct file for Vercel; middleware.ts still works but deprecated |
| Separate API routes for forms | Server Actions in page files | Next.js 13+ (stable) | Contact form uses Server Action -- becomes serverless function automatically on Vercel |
| Manual GTM noscript in body | Script component with afterInteractive | next/script | AnalyticsProvider uses Script component, loads GTM after hydration |
| vercel.json required | Zero-config deployment | Current | No vercel.json needed -- Vercel auto-detects Next.js framework settings |

## Open Questions

1. **Custom Domain**
   - What we know: Vercel provides a `*.vercel.app` URL on free tier. Custom domains are supported (free SSL).
   - What's unclear: Whether the user wants to use a custom domain (e.g., mgripe.com) or the Vercel-provided URL initially.
   - Recommendation: Deploy first with the Vercel URL. Custom domain can be added later without redeployment -- just DNS configuration.

2. **Resend Domain Ownership**
   - What we know: The code references `mgripe.com` as the email domain. Resend requires domain verification for production sending.
   - What's unclear: Whether the user owns `mgripe.com` and can add DNS records.
   - Recommendation: If domain is not yet owned or DNS is not accessible, deploy with Resend's sandbox (onboarding@resend.dev) first -- emails will only deliver to the account holder's email but the integration works. Upgrade to verified domain when ready.

3. **GTM Container Status**
   - What we know: STATE.md notes "GTM container and GA4 property must be created (cloud config) before Phase 8 testing."
   - What's unclear: Whether the GTM container and GA4 property have been created in their respective consoles.
   - Recommendation: This is a prerequisite. If not done, the deployment can proceed with `NEXT_PUBLIC_GTM_ID` unset (GTM simply will not load), and analytics can be enabled later by adding the env var and redeploying.

4. **WhatsApp Business Number**
   - What we know: STATE.md notes "WhatsApp button has placeholder phone number (5215512345678) -- update when business number is known."
   - What's unclear: Whether the real number is available.
   - Recommendation: Update the hardcoded number in `whatsapp-button.tsx` before deployment if the real number is known. If not, deploy with placeholder and update in a follow-up commit.

## Sources

### Primary (HIGH confidence)
- Local project analysis: `package.json`, `next.config.ts`, `proxy.ts`, `layout.tsx`, `actions.ts`, `analytics-provider.tsx`, `cookie-consent.tsx`, build output
- [Vercel Environment Variables docs](https://vercel.com/docs/environment-variables)
- [Vercel Git Integration docs](https://vercel.com/docs/git/vercel-for-github)
- [Vercel CLI docs](https://vercel.com/docs/cli)
- [Next.js generateStaticParams docs](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction)
- [Resend Vercel integration](https://resend.com/docs/send-with-vercel-functions)

### Secondary (MEDIUM confidence)
- [next-intl production deployment community reports](https://community.vercel.com/t/next-intl-i18n-language-reset-to-previous-locale-in-vercel/6231) - locale cookie issues reported by community
- [Next.js 16 proxy.ts docs](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) - proxy.ts confirmed as replacement for middleware.ts
- [Vercel free tier limits](https://vercel.com/docs/limits) - 100GB bandwidth, 100 builds/day, 10s function timeout

### Tertiary (LOW confidence)
- None -- all findings verified against official sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries are already in the project; deployment uses native Vercel support
- Architecture: HIGH - Build verified locally; all routes generate correctly; env vars mapped from source code
- Pitfalls: HIGH - Common issues (env vars, domain verification, placeholder values) documented from official docs and community reports

**Research date:** 2026-03-01
**Valid until:** 2026-04-01 (Vercel deployment is stable; unlikely to change)
