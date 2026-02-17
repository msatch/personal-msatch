# M. Gripe — Personal Brand & Consulting Site

## What This Is

A multi-page personal brand website for Matias Gripe ("M. Gripe") targeting LatAm founders, managers, and SMEs who need technical and business consulting. The site converts visitors into consulting leads through clear positioning, credibility signals, and a frictionless contact form. Bilingual (Spanish + English) with a language toggle.

## Core Value

A visitor can understand what M. Gripe does, trust his expertise, and contact him — all within 60 seconds of landing on the site.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Multi-page site: Home (landing), Bio, Services, Contact
- [ ] Modern, minimal visual design — white/light background, black typography, subtle accent color
- [ ] Bold typography with strong hierarchy, easy to scan
- [ ] Mobile-first responsive design
- [ ] Simple top navigation with 3 tabs (Bio / Services / Contact) + logo/home link
- [ ] Hero section with clear value proposition and primary CTA
- [ ] Problem/solution messaging that mirrors LatAm pain points
- [ ] Services page with outcome-based service cards (4 service lines)
- [ ] Work method section ("How we work" in 3-5 steps)
- [ ] Bio/trust section with credentials and social proof
- [ ] FAQ section addressing scope, timeline, pricing model
- [ ] Contact form: name, email, company, objective, budget range (optional), message
- [ ] Form validation with accessible error states
- [ ] Form delivery via Resend (email notification on submit)
- [ ] Anti-spam: honeypot field + rate limiting
- [ ] Clear success/failure feedback after form submission
- [ ] Spanish + English with language toggle
- [ ] Generated copy in neutral Spanish (and English equivalent)
- [ ] GA4 + GTM analytics: CTA clicks, form start, form submit, form success
- [ ] SEO metadata, Open Graph tags, schema markup (ProfessionalService)
- [ ] Accessibility baseline: AA contrast, keyboard nav, semantic HTML, form labels
- [ ] Performance: fast LCP on mobile, minimal JS, optimized fonts/images
- [ ] Subtle micro-interactions (hover effects, smooth scrolls, section reveals)
- [ ] Deployed to Vercel (custom domain later)

### Out of Scope

- CRM automation beyond email notification — defer to later sprint
- Blog / content hub — v2+
- A/B testing framework — v2+
- Multi-language beyond ES/EN — not needed
- Mobile native app — web only
- Real-time chat — unnecessary complexity
- Video content hosting — storage/bandwidth cost
- Advanced animations / heavy motion design — restraint over spectacle

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
*Last updated: 2026-02-16 after initialization*
