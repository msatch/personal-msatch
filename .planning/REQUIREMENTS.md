# Requirements: M. Gripe -- Personal Brand & Consulting Site

**Defined:** 2026-02-17
**Core Value:** A visitor can understand what M. Gripe does, trust his expertise, and contact him -- all within 60 seconds.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Structure & Navigation

- [ ] **NAV-01**: Site has 4 pages: Home, Bio, Services, Contact
- [ ] **NAV-02**: Sticky top navigation with links to all 4 pages + logo/home link
- [ ] **NAV-03**: Mobile hamburger menu with smooth open/close
- [ ] **NAV-04**: Language toggle (ES/EN) visible in navigation on all viewports
- [ ] **NAV-05**: Footer with contact info, legal links (privacy policy), and social links

### Home Page

- [ ] **HOME-01**: Hero section with clear value proposition headline and subheadline in Spanish/English
- [ ] **HOME-02**: Primary CTA button in hero ("Book your 45-min diagnostic" / "Agenda tu diagnostico de 45 min")
- [ ] **HOME-03**: Problem/solution section mirroring LatAm pain points
- [ ] **HOME-04**: Services preview cards linking to Services page
- [ ] **HOME-05**: "How it works" summary (3-5 steps)
- [ ] **HOME-06**: CTA band section repeating primary CTA

### Bio Page

- [ ] **BIO-01**: Professional narrative framed through client outcomes, not CV-style
- [ ] **BIO-02**: Photo placeholder (replaceable with real headshot)
- [ ] **BIO-03**: Credentials and experience summary relevant to LatAm market
- [ ] **BIO-04**: Social proof placeholder section (design accommodates future testimonials/logos)

### Services Page

- [ ] **SERV-01**: 4 outcome-based service cards (Strategic Technical Advisory, Delivery Acceleration, Product & Business Alignment, Fractional Leadership Support)
- [ ] **SERV-02**: Each service card describes the client problem, approach, and expected outcome
- [ ] **SERV-03**: "How it works" detailed process section (3-5 steps)
- [ ] **SERV-04**: FAQ section addressing scope, timeline, pricing model, communication cadence
- [ ] **SERV-05**: CTA linking to contact page with entry offer messaging

### Contact & Conversion

- [ ] **CONT-01**: Contact form with fields: name, email, message (required) + company, service interest (optional)
- [ ] **CONT-02**: Client-side form validation with accessible error messages in current language
- [ ] **CONT-03**: Server-side validation with Zod before sending email
- [ ] **CONT-04**: Email delivery via Resend Server Action on form submission
- [ ] **CONT-05**: Honeypot hidden field to catch spam bots (silent discard)
- [ ] **CONT-06**: Clear success message after submission with response time expectation
- [ ] **CONT-07**: Clear error message if submission fails with retry option
- [ ] **CONT-08**: WhatsApp CTA button visible on all pages (sticky on mobile)
- [ ] **CONT-09**: WhatsApp link with pre-filled Spanish message via wa.me URL

### Internationalization

- [ ] **I18N-01**: Bilingual site with Spanish (primary) and English
- [ ] **I18N-02**: URL-based locale routing (/es/, /en/) via next-intl
- [ ] **I18N-03**: All user-visible strings in translation JSON files (zero hardcoded text)
- [ ] **I18N-04**: Language toggle in navigation labeled "ES" / "EN" (not flags)
- [ ] **I18N-05**: Language preference persists across page navigation and refresh (cookie-based)
- [ ] **I18N-06**: Default locale detection from browser Accept-Language header

### Copy & Content

- [ ] **COPY-01**: Generated Spanish copy in neutral-warm tone (Mexican Spanish base, conversational connectors)
- [ ] **COPY-02**: Generated English copy matching Spanish content and brand voice
- [ ] **COPY-03**: Brand voice: clear, direct, strategic, senior but approachable, results-oriented
- [ ] **COPY-04**: Entry offer messaging throughout site ("45-minute diagnostic call")

### Design & Responsiveness

- [ ] **DES-01**: Light/white background with black typography and one subtle accent color
- [ ] **DES-02**: Bold typography with strong visual hierarchy
- [ ] **DES-03**: Mobile-first responsive layout (default styles = mobile, md/lg for larger)
- [ ] **DES-04**: Touch-friendly tap targets (min 44x44px on mobile)
- [ ] **DES-05**: Subtle micro-interactions (hover states on CTAs, smooth page transitions)
- [ ] **DES-06**: Design tokens in Tailwind config (colors, fonts, spacing)

### Technical Baseline

- [ ] **TECH-01**: Next.js 16 with App Router and TypeScript
- [ ] **TECH-02**: Tailwind CSS 4 for styling
- [ ] **TECH-03**: Static generation for all pages via generateStaticParams
- [ ] **TECH-04**: Deployed to Vercel
- [ ] **TECH-05**: Basic SEO: semantic HTML, title tags, meta descriptions per page per locale
- [ ] **TECH-06**: Accessibility baseline: AA contrast, keyboard navigation, focus indicators, semantic structure
- [ ] **TECH-07**: Privacy policy page in both languages
- [ ] **TECH-08**: 404 page in both languages
- [ ] **TECH-09**: Fast performance: LCP < 2.5s on mobile, minimal JS bundle

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Analytics & Tracking

- **ANLYT-01**: GA4 + GTM integration with optimized loading
- **ANLYT-02**: Custom events: CTA clicks, form start, form submit, form success
- **ANLYT-03**: Language toggle usage tracking
- **ANLYT-04**: Cookie consent banner

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
- **TRUST-03**: Case study page (when engagements complete)

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
| CRM automation | Beyond email notification -- defer to later sprint |
| A/B testing framework | Premature optimization for initial launch |
| Multi-language beyond ES/EN | Not needed for target market |
| Mobile native app | Web only |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| NAV-01 | Phase 2 | Pending |
| NAV-02 | Phase 2 | Pending |
| NAV-03 | Phase 2 | Pending |
| NAV-04 | Phase 2 | Pending |
| NAV-05 | Phase 2 | Pending |
| HOME-01 | Phase 3 | Pending |
| HOME-02 | Phase 3 | Pending |
| HOME-03 | Phase 3 | Pending |
| HOME-04 | Phase 3 | Pending |
| HOME-05 | Phase 3 | Pending |
| HOME-06 | Phase 3 | Pending |
| BIO-01 | Phase 4 | Pending |
| BIO-02 | Phase 4 | Pending |
| BIO-03 | Phase 4 | Pending |
| BIO-04 | Phase 4 | Pending |
| SERV-01 | Phase 4 | Pending |
| SERV-02 | Phase 4 | Pending |
| SERV-03 | Phase 4 | Pending |
| SERV-04 | Phase 4 | Pending |
| SERV-05 | Phase 4 | Pending |
| CONT-01 | Phase 5 | Pending |
| CONT-02 | Phase 5 | Pending |
| CONT-03 | Phase 5 | Pending |
| CONT-04 | Phase 5 | Pending |
| CONT-05 | Phase 5 | Pending |
| CONT-06 | Phase 5 | Pending |
| CONT-07 | Phase 5 | Pending |
| CONT-08 | Phase 5 | Pending |
| CONT-09 | Phase 5 | Pending |
| I18N-01 | Phase 1 | Pending |
| I18N-02 | Phase 1 | Pending |
| I18N-03 | Phase 1 | Pending |
| I18N-04 | Phase 2 | Pending |
| I18N-05 | Phase 1 | Pending |
| I18N-06 | Phase 1 | Pending |
| COPY-01 | Phase 3 | Pending |
| COPY-02 | Phase 3 | Pending |
| COPY-03 | Phase 3 | Pending |
| COPY-04 | Phase 4 | Pending |
| DES-01 | Phase 1 | Pending |
| DES-02 | Phase 1 | Pending |
| DES-03 | Phase 1 | Pending |
| DES-04 | Phase 1 | Pending |
| DES-05 | Phase 6 | Pending |
| DES-06 | Phase 1 | Pending |
| TECH-01 | Phase 1 | Pending |
| TECH-02 | Phase 1 | Pending |
| TECH-03 | Phase 1 | Pending |
| TECH-04 | Phase 7 | Pending |
| TECH-05 | Phase 6 | Pending |
| TECH-06 | Phase 6 | Pending |
| TECH-07 | Phase 6 | Pending |
| TECH-08 | Phase 2 | Pending |
| TECH-09 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 54 total
- Mapped to phases: 54
- Unmapped: 0

---
*Requirements defined: 2026-02-17*
*Last updated: 2026-02-17 after roadmap creation*
