# M. Gripe — Personal Brand & Consulting Site

## What This Is

A multi-page personal brand website for Matias Gripe ("M. Gripe") targeting LatAm founders, managers, and SMEs who need technical and business consulting. The site converts visitors into consulting leads through clear positioning, credibility signals, and a frictionless contact form. Bilingual (Spanish + English) with a language toggle.

## Core Value

A visitor can understand what M. Gripe does, trust his expertise, and contact him — all within 60 seconds of landing on the site.

## Current Milestone: v1.1 Proof & Trust

**Goal:** Transform the site from a well-built brochure into a credible conversion tool — add verifiable proof of delivered value, sharpen differentiation, and enable funnel tracking.

**Target features:**
- 3 anonymized case study narratives (alignment, BI/data, team building)
- LatAm differentiation as value proposition (not just geographic label)
- Concrete diagnostic CTA deliverable ("you receive X" not "free call")
- Competitive positioning content (solo consultant vs platforms)
- GA4 + GTM analytics with cookie consent and custom events
- Deploy to Vercel (carried from v1.0 Phase 7)

## Requirements

### Validated

<!-- Shipped in v1.0 (Phases 1-6). -->

- ✓ Multi-page site: Home, Bio, Services, Contact — Phase 1-2
- ✓ Modern, minimal visual design — Phase 1
- ✓ Bold typography with strong hierarchy — Phase 1
- ✓ Mobile-first responsive design — Phase 1
- ✓ Top navigation with tabs + logo/home link — Phase 2
- ✓ Hero section with value proposition and CTA — Phase 3
- ✓ Problem/solution messaging for LatAm pain points — Phase 3
- ✓ Services page with 4 outcome-based service cards — Phase 4
- ✓ Work method section (3-5 steps) — Phases 3, 4
- ✓ Bio/trust section with credentials — Phase 4
- ✓ FAQ section (scope, timeline, pricing) — Phase 4
- ✓ Contact form with validation and accessible errors — Phase 5
- ✓ Form delivery via Resend — Phase 5
- ✓ Anti-spam honeypot — Phase 5
- ✓ Success/failure feedback on submission — Phase 5
- ✓ Spanish + English with language toggle — Phase 1-2
- ✓ Generated bilingual copy (neutral Spanish + English) — Phases 3-4
- ✓ SEO metadata and title tags per page — Phase 6
- ✓ Accessibility baseline (AA contrast, keyboard nav, focus indicators) — Phase 6
- ✓ Micro-interactions (hover states, scroll reveals) — Phase 6
- ✓ Privacy policy (bilingual) — Phase 6

### Active

- [ ] 3 anonymized case study narratives with problem/intervention/result
- [ ] LatAm differentiation messaging (why LatAm expertise is a value proposition)
- [ ] Concrete diagnostic deliverable framing (tangible takeaway from 45-min call)
- [ ] Competitive positioning (solo consultant vs platforms like Toptal/Clutch)
- [ ] GA4 + GTM analytics integration
- [ ] Cookie consent banner (GDPR/privacy compliance for analytics)
- [ ] Custom event tracking: CTA clicks, form start, form submit, form success
- [ ] Deployed to Vercel (carried from Phase 7)

### Out of Scope

- CRM automation beyond email notification — defer to later sprint
- Blog / content hub — v2+
- A/B testing framework — v2+
- Multi-language beyond ES/EN — not needed
- Mobile native app — web only
- Real-time chat — unnecessary complexity
- Video content hosting — storage/bandwidth cost
- Advanced animations / heavy motion design — restraint over spectacle
- Schema.org markup / Open Graph tags — deferred to v1.2
- Client logo wall / real testimonials — need real client consent first
- Lighthouse optimization pass — post-launch

## Context

- **Market:** Spanish-speaking LatAm — Mexico, Colombia, Chile, Peru, Argentina
- **ICP:** Founders/CEOs (startup/growth), technical/business managers, traditional business owners in digital transition
- **Core pains:** Slow delivery, misaligned teams, weak planning, lack of senior tech guidance
- **Buying triggers:** Scaling pains, failed delivery cycles, digital channel launches, upcoming commitments
- **Positioning:** "I help companies in LatAm convert business goals into technical execution with clarity, speed, and measurable outcomes."
- **Brand voice:** Clear, direct, strategic, senior but approachable, results-oriented
- **Service lines:** Strategic Technical Advisory, Delivery Acceleration, Product & Business Alignment, Fractional Leadership Support
- **Entry offer:** 45-minute diagnostic call + short action brief
- **Visual references:** Rania Kalogirou (clean, minimal, CTA-driven personal site), Softlimit (polished, micro-interactions, strategic use of accent color) — but light theme, not dark
- **Existing docs:** Master plan, sprint plans, and team operating model already in `docs/`

## Constraints

- **No backend:** Static site with serverless function for form only (Vercel serverless + Resend)
- **Stack:** React-based (Next.js or Vite), Tailwind CSS, deployed on Vercel
- **Budget:** Free/low-cost services only (Vercel free tier, Resend free tier)
- **Timeline:** Ship MVP within sprint 01 scope (~10 business days)
- **Copy:** AI-generated in neutral Spanish + English, refined by owner

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Multi-page over single-page scroller | Cleaner navigation, better SEO, matches reference sites | — Pending |
| Resend for form delivery (email only) | Simplest possible pipeline, no database or CRM needed | — Pending |
| Light theme with subtle accent | Matches user preference and consulting credibility aesthetic | — Pending |
| Spanish + English with toggle | Broader reach while prioritizing LatAm market | — Pending |
| "M. Gripe" as brand name | Short, memorable, professional | — Pending |
| Vercel deployment | Free tier, serverless functions included, good DX with Next.js | — Pending |

---
*Last updated: 2026-02-27 after v1.1 milestone start*
