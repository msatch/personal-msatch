# Project Research Summary

**Project:** M. Gripe Consulting Site v1.1 -- Proof & Trust
**Domain:** Additions to bilingual consulting site -- analytics, cookie consent, case studies, messaging refinements
**Researched:** 2026-02-27
**Confidence:** HIGH

## Executive Summary

v1.1 adds social proof (anonymized case studies), sharpened LatAm-focused messaging, analytics with GDPR-compliant cookie consent, and Vercel deployment to the existing bilingual consulting site. The technical scope is deliberately minimal: **zero new npm packages**, a custom cookie consent component, content additions to existing locale JSON files, and deployment configuration. The existing stack (Next.js 16.1.6, next-intl 4.8.3, Tailwind CSS 4, Resend) plus built-in Next.js capabilities cover everything v1.1 requires.

**CRITICAL CONFLICT RESOLVED:** The initial draft of this summary recommended `@next/third-parties/google` for GTM integration. This recommendation is **overturned.** Three of four researchers independently confirmed that `@next/third-parties/google`'s `GoogleTagManager` component has no built-in Google Consent Mode v2 support. The `dataLayer` prop pushes data after GTM initializes, which is too late for consent defaults -- a direct GDPR violation. This is a known, unresolved gap documented in vercel/next.js GitHub discussions #64497, #66718, and #67440. The correct approach is **manual GTM via `next/script`** (built into Next.js), using `strategy="beforeInteractive"` for consent defaults and `strategy="afterInteractive"` for the GTM container. This gives full, explicit control over the consent-before-GTM loading order that Consent Mode v2 requires.

Cookie consent and analytics are architecturally intertwined and must be built as a single phase. The privacy policy update is a non-optional prerequisite: the current cookies section explicitly states "we do not use tracking cookies," which becomes false the moment GA4 goes live. Case studies and messaging updates are entirely independent tracks -- pure content changes to existing i18n JSON files and new Server Components following established patterns.

## Key Findings

### Recommended Stack

v1.1 requires **zero new npm packages.** The only external services are Google Tag Manager and Google Analytics 4, which are cloud services with no package installation required. The `NEXT_PUBLIC_GTM_ID` environment variable is the only new configuration item in the codebase.

**Core technologies:**
- `next/script` (built-in): GTM loading with precise strategy control -- `beforeInteractive` for consent defaults, `afterInteractive` for the GTM container. Only approach that guarantees consent fires before GTM evaluates.
- `Google Tag Manager` (cloud service): Single hub for all tags. GA4 is configured as a tag inside GTM, not as a standalone script alongside it. Prevents the dual-snippet duplicate-event problem.
- `Google Analytics 4` (cloud service): Configured inside GTM, not in code. `NEXT_PUBLIC_GTM_ID` is the only ID that belongs in the Next.js environment.
- `next-intl` (existing, 4.8.3): Case study content, consent banner text, and all messaging updates live in `messages/es.json` and `messages/en.json`. Bilingual support is automatic.
- Custom consent component (no library): ~100-150 lines of React + `localStorage` + `document.cookie`. The project's existing UI toolkit (Tailwind, clsx, tailwind-merge, next-intl) is sufficient. No external consent library justified for analytics-only, accept/decline consent.

**What NOT to add:**
- `@next/third-parties` -- disqualified by lack of Consent Mode v2 support (GitHub #64497, #66718, #67440)
- `react-cookie-consent` -- 15KB for ~100 lines of custom code; ships CSS that conflicts with Tailwind
- `@next/mdx` / any CMS -- 3 structured case studies in translation JSON files is the correct pattern
- `js-cookie` -- `document.cookie` API is sufficient for one consent cookie

### Expected Features

**Must have (table stakes for v1.1):**
- Cookie consent banner -- binary accept/decline for analytics. Bilingual via next-intl. Stores state in `localStorage` AND a cookie with `path=/` (to survive locale switches). Calls `gtag('consent', 'update', ...)` on choice.
- GA4 via GTM integration -- GTM as the single hub. Manual `next/script` implementation with Consent Mode v2. Respects consent state. Automatic page view tracking.
- Custom event tracking -- 5 events: `cta_click` (with location), `form_start`, `form_submit`, `form_success`, `whatsapp_click`. Pushed to `window.dataLayer` unconditionally; GTM/Consent Mode handles the gating.
- 3 anonymized case studies -- Challenge/Intervention/Result format. Mapped to distinct service lines. Stored in i18n JSON, rendered as Server Components on home page. No new routes.
- Concrete diagnostic CTA copy -- update CTA text to specify a deliverable ("you receive a prioritized action brief"). Pure i18n message changes.
- Privacy policy update -- **prerequisite, not optional.** Must update cookies section to accurately describe GA4 analytics cookies before the consent banner goes live.
- Vercel deployment -- production hosting with environment variables.

**Should have (competitive, can defer to v1.1.x):**
- LatAm differentiation messaging -- sharpen after seeing GA4 geo data from initial traffic.
- Competitive positioning content -- add after validating case study engagement via scroll-depth data.
- Distributed social proof placement -- move case study highlights to contact page once initial placement is validated.

**Defer to v1.2+:**
- Named testimonials -- requires real client consent not yet secured.
- Heatmaps / session recording -- warranted only when traffic exceeds 500 sessions/week.
- A/B testing -- statistical power requires 100+ conversions/week per variant.
- Case study detail pages -- warranted when there are 6+ case studies.

### Architecture Approach

The architecture follows existing patterns throughout. GTM scripts and the consent provider integrate at the `[locale]/layout.tsx` level. `AnalyticsProvider` (consent defaults + GTM script) sits outside `NextIntlClientProvider` because it needs no translations and must load as early as possible. `CookieConsentBanner` sits inside `NextIntlClientProvider` because it uses `useTranslations('consent')`. Case studies are pure Server Components reading from `messages/*.json` via `getTranslations('caseStudies')`. CTA tracking uses a `TrackedCTA` leaf Client Component wrapper so parent Server Components (HeroSection, CtaBand, ServicesCta) remain server-rendered.

**Major components:**

1. `AnalyticsProvider` (Client Component, `src/components/analytics/analytics-provider.tsx`) -- renders two `<Script>` tags: consent defaults with `beforeInteractive`, GTM container with `afterInteractive`.
2. `CookieConsentBanner` (Client Component, `src/components/analytics/cookie-consent.tsx`) -- consent UI, reads/writes `localStorage` + `cookie`, calls `gtag('consent', 'update', ...)`, uses `useTranslations('consent')`.
3. `TrackedCTA` (Client Component, `src/components/analytics/tracked-cta.tsx`) -- wraps `<Link>` with `dataLayer.push()` on click. Keeps parent sections as Server Components.
4. `CaseStudiesSection` + `CaseStudyCard` (Server Components, `src/components/case-studies/`) -- static content from i18n JSON, zero JS shipped to client.
5. Modified files: `layout.tsx` (add providers), `contact-form.tsx` (form events), `hero-section.tsx` / `cta-band.tsx` / `services-cta.tsx` (use TrackedCTA), `messages/*.json` (caseStudies, consent, privacy namespaces).

**No new routes.** Case studies are a section on the home page, between `<ProcessSection>` and `<CtaBand>`.

### Critical Pitfalls

1. **`@next/third-parties` with Consent Mode v2** -- Do NOT use. The `GoogleTagManager` component does not set consent defaults before GTM boots. Use `next/script` with `beforeInteractive` for the consent init script and `afterInteractive` for GTM. This is non-negotiable for GDPR compliance. (Source: GitHub #64497, #66718, #67440, confirmed by 3/4 researchers independently.)

2. **Consent banner that does not actually block scripts** -- A cosmetic banner that shows UI without wiring to `gtag('consent', 'default/update', ...)` is a compliance failure. Consent defaults must be set BEFORE GTM loads. `gtag('consent', 'update', ...)` must fire when the user makes a choice. GTM should always load (for Consent Mode modeling), but in denied state.

3. **Consent cookie scoped to locale path** -- Storing the consent cookie with `path=/es/` or `path=/en/` means consent is lost when the user switches locale. Cookie must use `path=/` and a locale-agnostic name (`cookie_consent`). Test explicitly: accept on `/es/`, verify banner does not reappear on `/en/`.

4. **Dual GTM + GA4 snippet (duplicate events)** -- Only one analytics entry in `layout.tsx`: the GTM container. GA4 Measurement ID lives inside the GTM console, never in the Next.js code. Verify in Network tab: `gtm.js` request visible, no separate `gtag/js` request.

5. **Privacy policy not updated before analytics launch** -- The current privacy policy explicitly states no tracking cookies are used. This is a legal prerequisite, not a nice-to-have. Update both `messages/es.json` and `messages/en.json` privacy/cookies sections before the consent banner ships to production.

## Implications for Roadmap

Based on research, the key structural insight is that **cookie consent and analytics must be a single phase**, not sequential. The consent mechanism is architecturally intertwined with GTM initialization -- one cannot be tested or validated without the other. Case studies and messaging updates are fully independent and can be built in parallel with the analytics phase.

### Phase 1: Privacy Policy Update (Prerequisite)

**Rationale:** Non-negotiable prerequisite before analytics goes live. The existing privacy policy states "we do not use tracking cookies" -- this must be corrected before consent or analytics touches production. Content-only change with zero code impact.
**Delivers:** Legally accurate disclosure of GA4 analytics cookies in both languages.
**Addresses:** Privacy policy cookies section update (both locales).
**Avoids:** Legal exposure from shipping analytics before correcting the privacy policy.
**Research flag:** No research needed. Pure content edit to existing translation JSON files.

### Phase 2: Analytics Foundation + Cookie Consent (Combined)

**Rationale:** These two features are architecturally inseparable. Analytics infrastructure (AnalyticsProvider with consent defaults + GTM) must exist before the consent banner can be wired and tested. The consent banner cannot be validated without GTM loaded. Building them sequentially would require re-testing the analytics setup after adding consent. Build together, test together.
**Delivers:** GTM loading with Consent Mode v2 defaults (denied), functional consent banner in ES+EN, verified end-to-end flow: denied by default, granted on accept, persists across locale switches, persists across sessions.
**Addresses:** GA4/GTM integration, cookie consent banner, Consent Mode v2, consent persistence.
**Avoids:** Cosmetic-only consent banner, consent lost on locale switch, duplicate tracking snippets, analytics firing before consent.
**Uses:** `next/script` built-in, `NEXT_PUBLIC_GTM_ID` env var, `messages/*.json` consent namespace.
**Research flag:** No additional research needed. Implementation pattern is fully documented in ARCHITECTURE.md. Key verification: GTM Preview mode + Network tab before and after consent interaction.

### Phase 3: Custom Event Tracking

**Rationale:** Depends on Phase 2 (consent + GTM must be operational). Events are built on top of a working dataLayer. All content (CTAs, form) should be finalized before wiring events so event names and locations are stable.
**Delivers:** 5 events tracked through the conversion funnel: `cta_click` (hero/cta-band/services), `form_start`, `form_submit`, `form_success`, `whatsapp_click`. Verified in GA4 DebugView with consent granted.
**Addresses:** CTA click attribution, form funnel visibility, WhatsApp engagement tracking.
**Avoids:** Events firing before GTM is ready (dataLayer initialized inline, queue processes on GTM boot), client-side consent checks that duplicate GTM's built-in consent gating.
**Implements:** `TrackedCTA` wrapper pattern preserving Server Component parents.
**Research flag:** No additional research needed. Pattern is fully specified in ARCHITECTURE.md.

### Phase 4: Case Studies

**Rationale:** Fully independent of Phases 1-3. Zero shared dependencies with the analytics track (different components, different JSON namespaces, different sections of layout.tsx). Can be built in parallel with Phase 2-3 if resources allow, or sequentially after.
**Delivers:** 3 anonymized case studies in ES+EN rendered on home page between ProcessSection and CtaBand. Challenge/Intervention/Result format with concrete metrics. Replaces the empty `SocialProofSection` placeholder on bio page.
**Addresses:** Social proof gap, empty promise section on bio, conversion evidence for prospects.
**Avoids:** MDX overhead (JSON is correct for 3 structured items), vague anonymization (specific descriptors + concrete numbers required), separate route (inline section is more effective for conversion at this scale).
**Research flag:** No additional research needed. Pattern identical to existing services/FAQ content in translation files.

### Phase 5: Messaging Refinements

**Rationale:** Pure content changes with zero code dependencies. Can be parallelized with any other phase. Suggested after case studies so CTA copy refinements and positioning language can be validated against the social proof context that surrounds them.
**Delivers:** Updated hero subtitle with LatAm differentiation, concrete diagnostic CTA copy specifying a deliverable, competitive positioning content on services page. All changes via `messages/*.json` edits.
**Addresses:** LatAm value proposition, diagnostic CTA deliverable framing, solo consultant vs platforms positioning.
**Avoids:** Copy that breaks mobile layout (test at 375px in ES, the longer language, before committing).
**Research flag:** No additional research needed. Mobile layout testing is the main verification requirement.

### Phase 6: Vercel Deployment

**Rationale:** Final phase after all features are built and tested locally. Infrastructure configuration, not code -- but depends on all code being production-ready.
**Delivers:** Production deployment at custom domain. `NEXT_PUBLIC_GTM_ID` configured in Vercel environment variables. Vercel Pro plan for commercial hosting.
**Addresses:** Production hosting, environment variable configuration, GTM ID live in production.
**Research flag:** Standard Vercel deployment, no research needed. DNS configuration may require brief reference if deploying to a custom domain.

### Phase Ordering Rationale

- Privacy policy update comes first because it is a legal prerequisite that unblocks analytics going to production.
- Analytics + consent are combined into one phase because they are architecturally inseparable -- consent defaults must be tested against a live GTM setup.
- Event tracking follows analytics because it depends on a working dataLayer + GTM, and should be built after content elements (CTAs, form) are finalized.
- Case studies are fully independent and could run in parallel with analytics, but are placed sequentially for developer focus.
- Messaging refinements are pure content and could run in any order; placed late so they can be written with case study context in mind.
- Deployment is last by definition.

### Research Flags

Phases needing deeper research during planning:
- None identified. All implementation patterns are fully documented across STACK.md, FEATURES.md, ARCHITECTURE.md, and PITFALLS.md with code examples.

Phases with standard, well-documented patterns (skip `/gsd:research-phase`):
- **Phase 1 (Privacy Policy):** Pure content edit, no research needed.
- **Phase 2 (Analytics + Consent):** Fully specified. Key implementation reference: ARCHITECTURE.md Pattern 1 and Pattern 2.
- **Phase 3 (Event Tracking):** Fully specified. Key implementation reference: ARCHITECTURE.md Pattern 3.
- **Phase 4 (Case Studies):** Fully specified. Key implementation reference: ARCHITECTURE.md Pattern 4.
- **Phase 5 (Messaging):** Content edits with mobile verification step.
- **Phase 6 (Deployment):** Standard Vercel workflow.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Zero new npm packages conclusion reached independently by all researchers. `@next/third-parties` disqualification verified via 3 GitHub issues and official docs. `next/script` pattern confirmed by multiple authoritative sources including Simo Ahava and Google official docs. |
| Features | HIGH | Feature list clearly scoped. Conflict between FEATURES.md (recommended `@next/third-parties`) and STACK.md/ARCHITECTURE.md/PITFALLS.md (all rejected it) is resolved: manual `next/script` is the consensus approach. The `sendGTMEvent` wrapper is trivially replaced by one line of `window.dataLayer.push()`. |
| Architecture | HIGH | Component boundaries and data flow fully specified with code examples. Integration points (locale layout, TrackedCTA pattern, consent state machine) are concrete and follow existing project conventions. |
| Pitfalls | MEDIUM-HIGH | Consent mode and GTM integration pitfalls verified across official docs and multiple independent community sources. Case study content quality pitfall is based on best practices from marketing research, not technical verification. |

**Overall confidence:** HIGH

### Gaps to Address

- **GTM container setup:** Creating a GTM account and container is a prerequisite for Phase 2. This is an account/configuration task outside code scope. Must be done before starting Phase 2 implementation.
- **GA4 property setup:** Must create a GA4 property and link it as a tag inside GTM before Phase 2 testing. Similarly a configuration prerequisite.
- **Case study content authorship:** The 3 narratives need to be written (anonymized real engagements with specific metrics). Research confirms structure (Problem/Intervention/Result/metric) but content authoring is outside technical scope and should happen before Phase 4 begins.
- **GTM container ID:** `NEXT_PUBLIC_GTM_ID` value (`GTM-XXXXXXX`) is not determined until the GTM account is created. Phase 2 can begin with a placeholder; the real ID is needed for testing.
- **Custom domain DNS:** If deploying to a custom domain during Phase 6, DNS configuration is needed. Vercel handles SSL automatically; DNS propagation can take up to 24 hours.

## Sources

### Primary (HIGH confidence)
- [Google Consent Mode v2 Official Docs](https://developers.google.com/tag-platform/security/guides/consent) -- Consent default/update API, required parameters, loading order requirements.
- [Next.js Third-Party Libraries Guide](https://nextjs.org/docs/app/guides/third-party-libraries) -- Confirmed `GoogleTagManager` props, official recommendation for GTM-only vs combined GA4+GTM.
- [vercel/next.js Discussion #64497](https://github.com/vercel/next.js/discussions/64497) -- Consent mode not built into `@next/third-parties`, manual `next/script` required.
- [vercel/next.js Discussion #66718](https://github.com/vercel/next.js/discussions/66718) -- Confirms no consent mode support in `GoogleAnalytics` component from `@next/third-parties`.
- [vercel/next.js Discussion #67440](https://github.com/vercel/next.js/discussions/67440) -- Additional confirmation of `@next/third-parties` consent mode gap.
- [Simo Ahava: Consent Mode v2 for Google Tags](https://www.simoahava.com/analytics/consent-mode-v2-google-tags/) -- Authoritative analytics expert on GTM consent implementation patterns.
- [Vercel Environment Variables Docs](https://vercel.com/docs/environment-variables) -- `NEXT_PUBLIC_` prefix requirement for client-side access.

### Secondary (MEDIUM confidence)
- [GTM Consent Mode v2 in React (Cloud66)](https://blog.cloud66.com/google-tag-manager-consent-mode-v2-in-react) -- Practical `beforeInteractive` + `afterInteractive` implementation pattern.
- [GTM with Consent Mode in Next.js (Aclarify)](https://www.aclarify.com/blog/how-to-set-up-google-tag-manager-with-consent-mode-in-nextjs) -- Confirmed consent-before-GTM ordering requirement.
- [Cookie Consent in Next.js 15 (BuildWithMatija)](https://www.buildwithmatija.com/blog/build-cookie-consent-banner-nextjs-15-server-client) -- No-library approach confirmed viable for Next.js 15+.
- [GA4 in Next.js 13 with GDPR consent (Gaudion.dev)](https://gaudion.dev/blog/setup-google-analytics-with-gdpr-compliant-cookie-consent-in-nextjs13) -- Working consent update pattern.
- [Top 7 Consent Mode Mistakes (Bounteous)](https://www.bounteous.com/insights/2025/07/30/top-7-google-consent-mode-mistakes-and-how-fix-them-2025/) -- Common pitfalls list.
- [Blue Seedling: Anonymous Case Studies as Secret Weapon](https://www.blueseedling.com/blog/how-to-make-anonymous-case-studies-your-secret-weapon/) -- Anonymization strategies, specificity over logos.
- [Knapsack Creative: Social Proof on Consulting Websites](https://knapsackcreative.com/blog-industry/consulting-website-social-proof) -- Social proof types and strategic placement.
- [Mimiran: CTAs That Convert for Consultants](https://www.mimiran.com/calls-to-action-that-convert-for-independent-consultant-websites/) -- Deliverable framing for diagnostic CTAs.
- [Cookie consent on multilingual sites (CookieScript)](https://cookie-script.com/documentation/cookie-consent-on-multilingual-website) -- `path=/` requirement for locale-agnostic consent persistence.

### Tertiary (LOW confidence)
- [Google Analytics GA4 Implementation for Next.js 16 (Medium)](https://medium.com/@aashari/google-analytics-ga4-implementation-guide-for-next-js-16-a7bbf267dbaa) -- Directional guidance on environment variable naming; details verified against official sources.

---
*Research completed: 2026-02-27*
*Ready for roadmap: yes*
