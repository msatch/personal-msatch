# Project Research Summary

**Project:** M. Gripe — Personal Brand & Consulting Site
**Domain:** Personal brand consulting website (bilingual, static-first, LatAm market)
**Researched:** 2026-02-16
**Confidence:** HIGH

## Executive Summary

This is a multi-page personal brand website for a technical/business consultant targeting LatAm founders and managers. The standard 2025-2026 approach is a statically-generated Next.js site with bilingual routing (next-intl), Tailwind CSS for styling, and a single serverless function for email delivery via Resend. The architecture is deliberately simple: 4 pages, no database, no CMS, no backend beyond the contact form.

The recommended approach prioritizes i18n infrastructure from day one (the costliest pitfall is bolting on bilingual support after building monolingual). Next.js 16 with the App Router, `[locale]` route segments, and next-intl provides mature bilingual routing with static generation. The contact form uses a Server Action + Resend (no separate API route needed). Analytics via GTM as a single hub avoids the common duplicate-event problem.

Key risks are: (1) flat/robotic Spanish copy that fails to connect with LatAm audiences — mitigated by writing Spanish first, not translating from English, and getting native speaker review; (2) missing WhatsApp as a contact channel — critical for LatAm where WhatsApp is the preferred business communication tool; (3) Resend domain verification left to launch day — should be set up early during infrastructure phase. Vercel Hobby plan prohibits commercial use; Pro ($20/mo) is needed before go-live.

## Key Findings

### Recommended Stack

Next.js 16.1.x on Vercel with Tailwind CSS 4.x and next-intl 4.8.x for bilingual routing. Contact form uses react-hook-form + Zod 4.x for validation, Server Action for submission, and Resend 6.9.x for email delivery. Analytics via @next/third-parties GTM integration.

**Core technologies:**
- **Next.js 16.1.x + React 19.2.x**: Static generation, App Router, Server Actions — native Vercel platform
- **next-intl 4.8.x**: Bilingual ES/EN routing with `[locale]` segments and proxy.ts — de facto i18n standard for App Router
- **Tailwind CSS 4.1.x**: Utility-first CSS, zero-config content detection, CSS-first configuration — 5x faster builds in v4
- **Resend 6.9.x**: Email delivery API, 100 emails/day free tier — simplest form delivery option
- **react-hook-form 7.x + Zod 4.x**: Form validation with type-safe schemas shared between client and server
- **@next/third-parties**: Official GTM/GA4 integration with optimized loading

See: `.planning/research/STACK.md` for full version matrix and compatibility notes.

### Expected Features

**Must have (table stakes):**
- Hero with clear value proposition and primary CTA
- 4-page structure (Home, Bio, Services, Contact)
- Mobile-responsive layout (60%+ LatAm traffic is mobile)
- Contact form with email delivery
- Spanish as primary language
- Basic SEO (meta tags, semantic HTML)
- SSL/HTTPS
- Privacy policy (legal requirement in LatAm)
- Entry offer prominently positioned ("45-min diagnostic call")
- "How it works" process section

**Should have (competitive):**
- Bilingual toggle (ES/EN) — few LatAm consultants offer this
- WhatsApp CTA — critical for LatAm conversion
- Structured data / Schema.org markup
- GA4 with custom events
- Open Graph meta for LinkedIn/WhatsApp sharing
- Subtle micro-interactions (scroll reveals, hover states)

**Defer (v2+):**
- Blog / content section (requires ongoing content commitment)
- Calendly / booking widget (some friction is appropriate for consulting)
- Case studies (need completed engagements first)
- Newsletter / email capture (needs ESP and content strategy)

See: `.planning/research/FEATURES.md` for full feature matrix and anti-features list.

### Architecture Approach

Static-first multi-page site with locale-prefixed routing (`/es/`, `/en/`). All pages are statically generated at build time via `generateStaticParams`. The only server-side interaction is the contact form Server Action calling Resend. GTM loads in root layout; GA4 is configured inside GTM (not as a separate script). Translation strings live in `messages/es.json` and `messages/en.json`, never hardcoded in components.

**Major components:**
1. **Presentation Layer** — 4 page components under `app/[locale]/`, shared layout with nav + footer
2. **Internationalization Layer** — next-intl middleware (proxy.ts in Next.js 16), locale routing, message files
3. **Integration Layer** — Server Action for Resend email, GTM for analytics, generateMetadata for SEO
4. **Infrastructure** — Vercel hosting (CDN for static, serverless for form action)

**Build order:** i18n scaffolding → layout shell → pages (parallel) → contact form → polish (SEO, analytics, a11y)

See: `.planning/research/ARCHITECTURE.md` for full system diagram, data flows, and project structure.

### Critical Pitfalls

1. **Robotic neutral Spanish** — AI-generated "espanol neutro" reads like a manual. Write Spanish first (not translate from English), use Mexican Spanish as base, do a "warmth pass," get native speaker review.
2. **i18n bolted on late** — Retrofitting bilingual support touches every component. Set up `[locale]` route segments, middleware, and translation keys from the first commit.
3. **Contact form spam** — Bots find the endpoint fast. Layer: honeypot field + Zod validation + rate limiting. Resend free tier has hard limits (100/day).
4. **Missing WhatsApp CTA** — LatAm founders prefer WhatsApp over email. Add `wa.me` link as primary/secondary CTA. Trivial to implement, outsized conversion impact.
5. **Resend domain not verified at launch** — DNS propagation takes 24-48 hours. Verify domain early, not at launch. Test deliverability to Gmail/Outlook/Yahoo.
6. **SEO metadata not localized** — Each locale needs its own title, description, OG tags, and hreflang tags. Configure `generateMetadata` to be locale-aware from the start.

See: `.planning/research/PITFALLS.md` for full pitfall analysis with warning signs and recovery strategies.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Project Foundation & i18n Scaffolding
**Rationale:** i18n is the costliest thing to retrofit. Must be foundational, not an afterthought.
**Delivers:** Next.js 16 project, Tailwind 4 config, next-intl routing with `[locale]` segments, proxy.ts, message files skeleton, design tokens, global styles, font loading.
**Addresses:** Table stakes (project setup), pitfall #2 (i18n bolted on late)
**Avoids:** The most expensive pitfall — rebuilding routing after pages exist.

### Phase 2: Layout Shell & Navigation
**Rationale:** All pages render inside the layout. Nav and footer are shared across every page.
**Delivers:** Root layout with GTM, responsive navbar with language toggle, footer, shared UI primitives (button, section wrapper, card).
**Addresses:** Table stakes (navigation, language toggle), pitfall #6 (metadata architecture)

### Phase 3: Page Content — Home
**Rationale:** Home page is the primary landing page and conversion entry point.
**Delivers:** Hero section with CTA, problem/solution section, services preview, "how it works" summary, CTA band. Spanish + English copy.
**Addresses:** Table stakes (hero, value proposition, entry offer CTA)

### Phase 4: Page Content — Bio & Services
**Rationale:** Can be built in parallel. Both are content pages with no server interaction.
**Delivers:** Bio page (credentials, story, social proof placeholder), Services page (4 service cards, method steps, FAQ section). Spanish + English copy.
**Addresses:** Table stakes (services, bio, FAQ), differentiator (outcome-based service descriptions)

### Phase 5: Contact Form & Email Delivery
**Rationale:** Depends on page structure existing. The only server-side interaction.
**Delivers:** Contact form (react-hook-form + Zod), Server Action with Resend, honeypot anti-spam, success/error states, WhatsApp CTA.
**Addresses:** Table stakes (contact form, email delivery), pitfall #3 (spam), pitfall #4 (WhatsApp CTA)

### Phase 6: Analytics & Event Tracking
**Rationale:** Pages must exist before analytics can track them. Layout-level integration.
**Delivers:** GTM container config, GA4 via GTM, custom events (CTA clicks, form start/submit/success, language toggle), cookie consent banner.
**Addresses:** Differentiator (GA4 custom events), pitfall (GA4 not tracking language)

### Phase 7: SEO, Accessibility & Performance
**Rationale:** Final polish pass. Touches every page but blocks nothing.
**Delivers:** Localized generateMetadata per page, hreflang tags, Schema.org (Person + ProfessionalService), OG images, sitemap, robots.txt, a11y audit (contrast, keyboard nav, focus indicators), Lighthouse optimization, privacy policy page.
**Addresses:** Table stakes (SEO, a11y, privacy policy), pitfall #5 (SEO not localized), pitfall #6 (Resend domain)

### Phase 8: QA, Deployment & Launch Prep
**Rationale:** Final verification before go-live.
**Delivers:** Cross-browser testing, mobile device testing, form end-to-end test in production, Resend domain verification, Vercel Pro upgrade, custom domain config, "looks done but isn't" checklist completion.
**Addresses:** All verification items from pitfalls research

### Phase Ordering Rationale

- **i18n first** because retrofitting is the most expensive pitfall (HIGH recovery cost)
- **Layout before pages** because pages render inside it
- **Pages before form** because the form needs a page to live on
- **Pages can be parallel** (Home, Bio, Services are independent of each other)
- **Analytics after pages** because events need targets to track
- **SEO/a11y last** because it touches everything and benefits from stable content
- **QA last** because it validates the whole system

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** next-intl 4.x + Next.js 16 proxy.ts integration — the rename from middleware.ts is new and patterns are evolving
- **Phase 5:** Resend Server Action pattern, rate limiting on Vercel serverless (stateless, can't use in-memory counters)

Phases with standard patterns (skip research-phase):
- **Phase 2:** Standard responsive nav + footer patterns
- **Phase 3-4:** Content pages with standard section components
- **Phase 6:** @next/third-parties GTM integration is well-documented

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified via npm and official docs. Compatibility matrix validated. |
| Features | HIGH | Research from multiple consulting website guides, competitor analysis, LatAm market sources. |
| Architecture | HIGH | Standard Next.js App Router patterns verified against official docs. next-intl setup confirmed. |
| Pitfalls | MEDIUM-HIGH | Technical pitfalls well-documented. LatAm-specific items (WhatsApp, Spanish tone) based on ecosystem patterns, not quantitative data. |

**Overall confidence:** HIGH

### Gaps to Address

- **Copy quality:** Generated Spanish copy needs native speaker validation. Cannot be verified by code alone.
- **Resend domain:** Depends on domain purchase (not yet done). Verification must happen before launch.
- **Vercel commercial terms:** Pro plan ($20/mo) needed before publicly promoting. Can develop on Hobby.
- **WhatsApp number:** Need a dedicated business WhatsApp number for the CTA.
- **Professional photo:** Bio page needs a headshot. Placeholder needed until provided.
- **Testimonials:** Social proof section will need placeholder design until real testimonials are available.

## Sources

### Primary (HIGH confidence)
- Next.js 16.1 official blog and docs — framework, proxy.ts, App Router
- next-intl 4.x official docs — i18n routing, App Router setup
- Resend official docs — Next.js integration, domain verification
- Tailwind CSS v4 release blog — configuration, performance
- Vercel docs — hosting plans, commercial terms, environment variables
- npm registry — all package versions verified

### Secondary (MEDIUM confidence)
- Consulting website design guides (Knapsack Creative, Consulting Success, Squarespace)
- LatAm market sources (Greenbook, Consultancy.lat, UXpa Magazine)
- Spanish localization guides (Nimdzi, Vera Content, Trusted Translations)
- Form optimization research (WPForms, SmartBug Media)

### Tertiary (LOW confidence)
- Medium articles on i18n patterns — useful for patterns but not authoritative
- GA4 multilingual tracking guides — approaches vary, needs testing

---
*Research completed: 2026-02-16*
*Ready for roadmap: yes*
