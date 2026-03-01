# Roadmap: M. Gripe -- Personal Brand & Consulting Site

## Milestones

- Phases 1-6 shipped 2026-02-24 (v1.0 MVP)
- Phases 7-10 in progress (v1.1 Proof & Trust)

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

<details>
<summary>v1.0 MVP (Phases 1-6) -- SHIPPED 2026-02-24</summary>

- [x] **Phase 1: Foundation & i18n Scaffolding** - Next.js project with bilingual routing, design tokens, and responsive baseline
- [x] **Phase 2: Layout Shell & Navigation** - Shared layout, responsive nav, footer, language toggle, and 404 page
- [x] **Phase 3: Home Page** - Hero, problem/solution, services preview, process summary, and bilingual copy
- [x] **Phase 4: Bio & Services Pages** - Bio narrative, credentials, service cards, FAQ, and entry offer copy
- [x] **Phase 5: Contact Form & Conversion** - Form with validation, email delivery via Resend, anti-spam, and WhatsApp CTA
- [x] **Phase 6: Polish, Accessibility & SEO** - Micro-interactions, SEO metadata, a11y audit, privacy policy, and performance

</details>

### v1.1 Proof & Trust

- [ ] **Phase 8: Privacy & Analytics Foundation** - Privacy policy update, GTM with Consent Mode v2, and GA4 integration
- [ ] **Phase 9: Case Study Narratives** - 3 anonymized case studies with measurable outcomes in both languages
- [ ] **Phase 10: Messaging & Positioning** - LatAm differentiation, concrete diagnostic CTA, and competitive positioning
- [ ] **Phase 7: Deployment & Launch** - Production deployment to Vercel with full launch verification

## Phase Details

<details>
<summary>v1.0 MVP (Phases 1-6) -- SHIPPED 2026-02-24</summary>

### Phase 1: Foundation & i18n Scaffolding
**Goal**: A developer can run the project locally and navigate between /es/ and /en/ routes with locale detection, persistence, and translation infrastructure ready for content
**Depends on**: Nothing (first phase)
**Requirements**: TECH-01, TECH-02, TECH-03, DES-01, DES-02, DES-03, DES-04, DES-06, I18N-01, I18N-02, I18N-03, I18N-05, I18N-06
**Success Criteria** (what must be TRUE):
  1. Running `npm run dev` starts the application and renders a page at localhost
  2. Navigating to /es/ and /en/ renders locale-specific content from translation JSON files
  3. Browser language detection routes a first-time visitor to the correct locale
  4. Locale preference persists across page refreshes (cookie-based)
  5. Design tokens (colors, fonts, spacing) are defined in Tailwind config and a test page renders with correct typography, accent color, and mobile-first responsive layout
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md -- Scaffold Next.js 16 project, install deps, configure next-intl i18n infrastructure and translation files
- [x] 01-02-PLAN.md -- Design tokens via Tailwind CSS 4 @theme, locale layout, bilingual test page

### Phase 2: Layout Shell & Navigation
**Goal**: Every page renders inside a shared layout with a responsive navigation bar, language toggle, footer, and a styled 404 page
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, NAV-05, I18N-04, TECH-08
**Success Criteria** (what must be TRUE):
  1. A sticky top navigation shows links to Home, Bio, Services, and Contact plus a logo/home link, visible on all pages
  2. On mobile viewports, navigation collapses into a hamburger menu that opens and closes smoothly
  3. Language toggle labeled "ES" / "EN" is visible in the navigation on all viewport sizes and switches locale
  4. Footer displays contact info, privacy policy link placeholder, and social link placeholders on every page
  5. Visiting a nonexistent URL shows a styled 404 page in the current locale
**Plans**: 2 plans

Plans:
- [x] 02-01-PLAN.md -- Layout shell: Header, Footer, stub pages, translation keys, layout integration
- [x] 02-02-PLAN.md -- Localized 404 page (three-file pattern) and home page cleanup

### Phase 3: Home Page
**Goal**: A visitor lands on the Home page, immediately understands what M. Gripe does, sees the entry offer, and can click through to Services or Contact
**Depends on**: Phase 2
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, COPY-01, COPY-02, COPY-03
**Success Criteria** (what must be TRUE):
  1. Hero section displays a clear value proposition headline, subheadline, and a primary CTA button in the current locale
  2. Problem/solution section presents LatAm pain points and M. Gripe's approach, with copy that reads naturally in both Spanish and English
  3. Services preview cards link to the Services page, and a "How it works" section summarizes the engagement process in 3-5 steps
  4. A CTA band repeats the primary call-to-action lower on the page
  5. All visible text comes from translation files with zero hardcoded strings, and the brand voice is clear, direct, and results-oriented
**Plans**: 2 plans

Plans:
- [x] 03-01-PLAN.md -- Bilingual copy generation, translation JSON expansion, hero section and CTA band components
- [x] 03-02-PLAN.md -- Problem/solution, services preview, process sections, and full page composition

### Phase 4: Bio & Services Pages
**Goal**: A visitor can learn about M. Gripe's background and expertise on the Bio page, and evaluate specific service offerings with clear outcomes on the Services page
**Depends on**: Phase 2
**Requirements**: BIO-01, BIO-02, BIO-03, BIO-04, SERV-01, SERV-02, SERV-03, SERV-04, SERV-05, COPY-04
**Success Criteria** (what must be TRUE):
  1. Bio page presents a professional narrative framed through client outcomes (not a CV), with a photo placeholder, credentials summary, and a social proof placeholder section
  2. Services page displays 4 outcome-based service cards, each describing the client problem, approach, and expected outcome
  3. Services page includes a detailed "How it works" process section (3-5 steps) and an FAQ section addressing scope, timeline, pricing model, and communication cadence
  4. Services page has a CTA linking to the Contact page with entry offer messaging ("45-minute diagnostic call")
  5. All copy on both pages is available in Spanish and English, matching the brand voice
**Plans**: 2 plans

Plans:
- [x] 04-01-PLAN.md -- Bio page: bilingual copy, photo placeholder, credentials, narrative, social proof, CTA
- [x] 04-02-PLAN.md -- Services page: 4 service cards, 5-step process, FAQ, CTA with entry offer

### Phase 5: Contact Form & Conversion
**Goal**: A visitor can contact M. Gripe through a validated form that delivers an email notification, or reach out via WhatsApp with one tap
**Depends on**: Phase 2
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-07, CONT-08, CONT-09
**Success Criteria** (what must be TRUE):
  1. Contact page displays a form with name, email, message (required) and company, service interest (optional), with client-side validation showing accessible error messages in the current language
  2. Submitting a valid form triggers a Server Action that validates with Zod and sends an email via Resend, and the visitor sees a clear success message with response time expectation
  3. If submission fails, the visitor sees a clear error message with a retry option
  4. A honeypot hidden field silently discards bot submissions
  5. A WhatsApp CTA button with a pre-filled Spanish message is visible on all pages (sticky on mobile), linking via wa.me URL
**Plans**: 2 plans

Plans:
- [x] 05-01-PLAN.md -- Install deps, Zod schema, Resend client, server action, and bilingual contact translations
- [x] 05-02-PLAN.md -- Contact form UI with accessible validation, success/error states, and WhatsApp floating CTA button

### Phase 6: Polish, Accessibility & SEO
**Goal**: The site meets professional quality standards for SEO discoverability, accessibility compliance, performance, and visual refinement
**Depends on**: Phases 3, 4, 5
**Requirements**: DES-05, TECH-05, TECH-06, TECH-07, TECH-09
**Success Criteria** (what must be TRUE):
  1. Subtle micro-interactions are present: hover states on CTAs, smooth page transitions, and section scroll reveals
  2. Every page has locale-specific title tags and meta descriptions with semantic HTML structure
  3. The site passes AA contrast checks, supports full keyboard navigation with visible focus indicators, and all form fields have proper labels
  4. A privacy policy page exists in both Spanish and English
  5. Mobile LCP is under 2.5 seconds with a minimal JS bundle
**Plans**: 2 plans

Plans:
- [x] 06-01-PLAN.md -- Per-page SEO metadata for all pages and bilingual privacy policy page
- [x] 06-02-PLAN.md -- Accessibility foundations, scroll reveal animations, and enhanced CTA hover states

</details>

### v1.1 Proof & Trust

**Milestone Goal:** Transform the site from a well-built brochure into a credible conversion tool -- add verifiable proof of delivered value, sharpen differentiation, and enable funnel tracking.

### Phase 8: Privacy & Analytics Foundation
**Goal**: The site accurately discloses its use of analytics cookies and loads Google Tag Manager with Consent Mode v2, so visitor behavior can be measured while respecting privacy
**Depends on**: Phase 6
**Requirements**: ANLYT-01, ANLYT-02, ANLYT-03
**Success Criteria** (what must be TRUE):
  1. The privacy policy page in both languages accurately describes the use of GA4 analytics cookies, what data is collected, and how visitors can control it
  2. Google Tag Manager loads on every page via manual next/script with consent defaults set to "denied" before GTM initializes
  3. GA4 is configured as a tag inside GTM (no separate gtag.js script in the codebase) and receives page view data when consent is granted
  4. Visitor can verify in browser Network tab: only gtm.js loads, no separate gtag/js request
**Plans**: 2 plans

Plans:
- [ ] 08-01-PLAN.md -- Privacy policy update, consent translations, TypeScript declarations, env var setup
- [ ] 08-02-PLAN.md -- GTM integration with Consent Mode v2, cookie consent banner, locale layout wiring

### Phase 9: Case Study Narratives
**Goal**: A visitor sees concrete evidence of M. Gripe's delivered value through 3 anonymized case studies that demonstrate real business outcomes
**Depends on**: Phase 6 (uses existing home page layout and i18n patterns)
**Requirements**: PROOF-01, PROOF-02, PROOF-03
**Success Criteria** (what must be TRUE):
  1. Home page displays 3 case study narratives between the process section and the CTA band, each with a clear problem/intervention/result structure
  2. Each case study includes industry context (e.g., "Series A fintech," "mid-size logistics company") and specific measurable outcomes (timelines, team sizes, efficiency gains)
  3. Case study content is fully bilingual -- reading the page in Spanish or English shows complete, naturally-written narratives (not machine-translated)
  4. Case studies render as Server Components with zero client-side JavaScript overhead
**Plans**: TBD

Plans:
- [ ] 09-01: TBD

### Phase 10: Messaging & Positioning
**Goal**: The site's copy differentiates M. Gripe through LatAm expertise framing, a concrete diagnostic deliverable, and explicit positioning against platform alternatives
**Depends on**: Phase 9 (messaging should be written with case study context in place)
**Requirements**: MSG-01, MSG-02, MSG-03
**Success Criteria** (what must be TRUE):
  1. LatAm expertise is framed as a value proposition -- the copy explains WHY local market knowledge matters (regulatory, cultural, timezone), not just that the consultant is based in LatAm
  2. Every diagnostic CTA on the site describes a concrete deliverable the visitor receives (e.g., "prioritized action brief") rather than just "free 45-min call"
  3. The services page includes positioning content that addresses why a solo senior consultant delivers better outcomes than staffing platforms (Toptal, Clutch, etc.)
  4. All messaging updates render correctly at 375px width in Spanish (the longer language) without layout breaks
**Plans**: TBD

Plans:
- [ ] 10-01: TBD

### Phase 7: Deployment & Launch
**Goal**: The site is live on Vercel, accessible via public URL, and verified working in production with all v1.1 features
**Depends on**: Phases 8, 9, 10 (all features must be built before deployment)
**Requirements**: DEPLOY-01, DEPLOY-02, DEPLOY-03
**Success Criteria** (what must be TRUE):
  1. The site is deployed to Vercel and accessible via a public URL
  2. All pages render correctly in production -- both /es/ and /en/ routes including case studies, updated messaging, and privacy policy
  3. Contact form submits successfully in production and delivers email via Resend
  4. GTM loads in production with the real NEXT_PUBLIC_GTM_ID, and GA4 receives page view events when consent is granted
  5. WhatsApp CTA works on mobile devices in production
**Plans**: TBD

Plans:
- [ ] 07-01: TBD

## Progress

**Execution Order:**
v1.1 phases execute: 8 -> 9 -> 10 -> 7
Note: Phases 8 and 9 depend only on Phase 6 (complete) and could execute in parallel. Phase 10 follows Phase 9 for messaging context. Phase 7 is last after all features are built.

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation & i18n Scaffolding | v1.0 | 2/2 | Complete | 2026-02-19 |
| 2. Layout Shell & Navigation | v1.0 | 2/2 | Complete | 2026-02-18 |
| 3. Home Page | v1.0 | 2/2 | Complete | 2026-02-19 |
| 4. Bio & Services Pages | v1.0 | 2/2 | Complete | 2026-02-21 |
| 5. Contact Form & Conversion | v1.0 | 2/2 | Complete | 2026-02-22 |
| 6. Polish, Accessibility & SEO | v1.0 | 2/2 | Complete | 2026-02-24 |
| 8. Privacy & Analytics Foundation | v1.1 | 0/TBD | Not started | - |
| 9. Case Study Narratives | v1.1 | 0/TBD | Not started | - |
| 10. Messaging & Positioning | v1.1 | 0/TBD | Not started | - |
| 7. Deployment & Launch | v1.1 | 0/TBD | Not started | - |
