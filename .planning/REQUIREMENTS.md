# Requirements: M. Gripe -- Personal Brand & Consulting Site

**Defined:** 2026-02-17
**Core Value:** A visitor can understand what M. Gripe does, trust his expertise, and contact him -- all within 60 seconds.

## v1.0 Requirements (Shipped)

Delivered in Phases 1-6. All verified complete except TECH-04 (deployment, carried to v1.1).

### Structure & Navigation

- [x] **NAV-01**: Site has 4 pages: Home, Bio, Services, Contact — Phase 2
- [x] **NAV-02**: Sticky top navigation with links to all 4 pages + logo/home link — Phase 2
- [x] **NAV-03**: Mobile hamburger menu with smooth open/close — Phase 2
- [x] **NAV-04**: Language toggle (ES/EN) visible in navigation on all viewports — Phase 2
- [x] **NAV-05**: Footer with contact info, legal links (privacy policy), and social links — Phase 2

### Home Page

- [x] **HOME-01**: Hero section with clear value proposition headline and subheadline — Phase 3
- [x] **HOME-02**: Primary CTA button in hero — Phase 3
- [x] **HOME-03**: Problem/solution section mirroring LatAm pain points — Phase 3
- [x] **HOME-04**: Services preview cards linking to Services page — Phase 3
- [x] **HOME-05**: "How it works" summary (3-5 steps) — Phase 3
- [x] **HOME-06**: CTA band section repeating primary CTA — Phase 3

### Bio Page

- [x] **BIO-01**: Professional narrative framed through client outcomes — Phase 4
- [x] **BIO-02**: Photo placeholder (replaceable with real headshot) — Phase 4
- [x] **BIO-03**: Credentials and experience summary relevant to LatAm market — Phase 4
- [x] **BIO-04**: Social proof placeholder section — Phase 4

### Services Page

- [x] **SERV-01**: 4 outcome-based service cards — Phase 4
- [x] **SERV-02**: Each service card: problem, approach, expected outcome — Phase 4
- [x] **SERV-03**: "How it works" detailed process section (5 steps) — Phase 4
- [x] **SERV-04**: FAQ section (scope, timeline, pricing, communication) — Phase 4
- [x] **SERV-05**: CTA linking to contact page with entry offer — Phase 4

### Contact & Conversion

- [x] **CONT-01**: Contact form (name, email, message + company, service interest) — Phase 5
- [x] **CONT-02**: Client-side validation with accessible error messages — Phase 5
- [x] **CONT-03**: Server-side validation with Zod — Phase 5
- [x] **CONT-04**: Email delivery via Resend Server Action — Phase 5
- [x] **CONT-05**: Honeypot hidden field for spam — Phase 5
- [x] **CONT-06**: Clear success message with response time expectation — Phase 5
- [x] **CONT-07**: Error message with retry option — Phase 5
- [x] **CONT-08**: WhatsApp CTA button (sticky on mobile) — Phase 5
- [x] **CONT-09**: WhatsApp link with pre-filled Spanish message — Phase 5

### Internationalization

- [x] **I18N-01**: Bilingual site (Spanish primary, English) — Phase 1
- [x] **I18N-02**: URL-based locale routing (/es/, /en/) via next-intl — Phase 1
- [x] **I18N-03**: All user-visible strings in translation JSON files — Phase 1
- [x] **I18N-04**: Language toggle labeled "ES" / "EN" — Phase 2
- [x] **I18N-05**: Language preference persists (cookie-based) — Phase 1
- [x] **I18N-06**: Default locale detection from Accept-Language — Phase 1

### Copy & Content

- [x] **COPY-01**: Spanish copy in neutral-warm tone — Phase 3
- [x] **COPY-02**: English copy matching brand voice — Phase 3
- [x] **COPY-03**: Brand voice: clear, direct, strategic, approachable — Phase 3
- [x] **COPY-04**: Entry offer messaging ("45-minute diagnostic") — Phase 4

### Design & Responsiveness

- [x] **DES-01**: Light/white background with subtle accent color — Phase 1
- [x] **DES-02**: Bold typography with strong hierarchy — Phase 1
- [x] **DES-03**: Mobile-first responsive layout — Phase 1
- [x] **DES-04**: Touch-friendly tap targets (44x44px min) — Phase 1
- [x] **DES-05**: Subtle micro-interactions (hover, scroll reveals) — Phase 6
- [x] **DES-06**: Design tokens in Tailwind config — Phase 1

### Technical Baseline

- [x] **TECH-01**: Next.js 16 with App Router and TypeScript — Phase 1
- [x] **TECH-02**: Tailwind CSS 4 for styling — Phase 1
- [x] **TECH-03**: Static generation via generateStaticParams — Phase 1
- [x] **TECH-05**: SEO: semantic HTML, title tags, meta descriptions — Phase 6
- [x] **TECH-06**: Accessibility: AA contrast, keyboard nav, focus indicators — Phase 6
- [x] **TECH-07**: Privacy policy page in both languages — Phase 6
- [x] **TECH-08**: 404 page in both languages — Phase 2
- [x] **TECH-09**: LCP < 2.5s on mobile, minimal JS bundle — Phase 6

## v1.1 Requirements

Requirements for milestone v1.1: Proof & Trust. Adds social proof, messaging refinements, analytics, and deployment.

### Social Proof

- [ ] **PROOF-01**: Home page displays 3 anonymized case study narratives with problem/intervention/result structure — Phase 9
- [ ] **PROOF-02**: Each case narrative includes industry context and specific measurable outcomes (timelines, team sizes, efficiency gains) — Phase 9
- [ ] **PROOF-03**: Case study content is bilingual (ES/EN) via existing i18n message files — Phase 9

### Messaging

- [ ] **MSG-01**: LatAm expertise is framed as a value proposition explaining why local market knowledge matters — not just a geographic label — Phase 10
- [ ] **MSG-02**: Diagnostic CTA describes a concrete deliverable the visitor receives (e.g., "prioritized action brief") not just "free 45-min call" — Phase 10
- [ ] **MSG-03**: Site addresses why hiring a solo consultant vs platforms (Toptal, Clutch, etc.) with explicit positioning content — Phase 10

### Analytics

- [x] **ANLYT-01**: Google Tag Manager container loads on all pages via manual next/script in root layout — Phase 8
- [x] **ANLYT-02**: GA4 configured as a tag inside GTM (not a separate script) — Phase 8
- [x] **ANLYT-03**: Privacy policy updated in both languages to disclose analytics/tracking cookies — Phase 8

### Deployment

- [ ] **DEPLOY-01**: Site deployed to Vercel and accessible via public URL (carried from v1.0 TECH-04) — Phase 7
- [ ] **DEPLOY-02**: All pages render correctly in production (both /es/ and /en/ routes) — Phase 7
- [ ] **DEPLOY-03**: Contact form submits successfully in production and delivers email via Resend — Phase 7

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Analytics Enhancement

- **ANLYT-04**: Cookie consent banner with Google Consent Mode v2
- **ANLYT-05**: Custom events: CTA clicks, form start, form submit, form success
- **ANLYT-06**: Language toggle usage tracking

### SEO Enhancement

- **SEO-01**: Schema.org markup (Person + ProfessionalService)
- **SEO-02**: Open Graph tags per page with localized content
- **SEO-03**: Custom OG images per page
- **SEO-04**: hreflang alternate link tags
- **SEO-05**: XML sitemap and robots.txt
- **SEO-06**: Keyword-aligned heading structure

### Trust & Social Proof

- **TRUST-01**: Client testimonials with real names, titles, and specific outcomes
- **TRUST-02**: Client logo wall
- **TRUST-03**: Dedicated case study page (when engagements complete)

### Performance

- **PERF-01**: Image optimization (WebP/AVIF formats)
- **PERF-02**: Font subsetting and optimal loading strategy
- **PERF-03**: Lighthouse score > 95 across Performance, SEO, Accessibility

## Out of Scope

| Feature | Reason |
|---------|--------|
| Blog / content section | Requires ongoing content commitment; empty blog worse than no blog |
| Calendly / booking widget | Some friction is appropriate for consulting; qualifies leads |
| Chatbot / live chat | Solo consultant cannot staff; creates false availability expectation |
| Pricing page | Consulting pricing is contextual; published rates commoditize advisory |
| Newsletter / email capture | Needs ESP infrastructure and content strategy |
| Client portal / login | Massive scope increase; website is for acquisition, not delivery |
| Pop-ups (exit intent) | Hostile UX; damages premium brand perception |
| Multi-page contact wizard | High abandonment; over-qualification before first contact |
| Autoplay video | Increases load time; bad video worse than no video |
| CRM automation | Beyond email notification — defer to later sprint |
| A/B testing framework | Premature optimization for initial launch |
| Multi-language beyond ES/EN | Not needed for target market |
| Mobile native app | Web only |

## Traceability

### v1.0 (Phases 1-6: Complete)

| Requirement | Phase | Status |
|-------------|-------|--------|
| NAV-01 through NAV-05 | Phase 2 | Complete |
| HOME-01 through HOME-06 | Phase 3 | Complete |
| BIO-01 through BIO-04 | Phase 4 | Complete |
| SERV-01 through SERV-05 | Phase 4 | Complete |
| CONT-01 through CONT-09 | Phase 5 | Complete |
| I18N-01 through I18N-06 | Phases 1-2 | Complete |
| COPY-01 through COPY-04 | Phases 3-4 | Complete |
| DES-01 through DES-06 | Phases 1, 6 | Complete |
| TECH-01 through TECH-03 | Phase 1 | Complete |
| TECH-05 through TECH-09 | Phases 2, 6 | Complete |

### v1.1 (Phases 7-10)

| Requirement | Phase | Status |
|-------------|-------|--------|
| ANLYT-01 | Phase 8 | Complete |
| ANLYT-02 | Phase 8 | Complete |
| ANLYT-03 | Phase 8 | Complete |
| PROOF-01 | Phase 9 | Pending |
| PROOF-02 | Phase 9 | Pending |
| PROOF-03 | Phase 9 | Pending |
| MSG-01 | Phase 10 | Pending |
| MSG-02 | Phase 10 | Pending |
| MSG-03 | Phase 10 | Pending |
| DEPLOY-01 | Phase 7 | Pending |
| DEPLOY-02 | Phase 7 | Pending |
| DEPLOY-03 | Phase 7 | Pending |

**Coverage:**
- v1.0 requirements: 53 total, 53 complete
- v1.1 requirements: 12 total
- Mapped to phases: 12/12
- Unmapped: 0

---
*Requirements defined: 2026-02-17*
*Last updated: 2026-02-28 after v1.1 roadmap creation*
