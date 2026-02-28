# Feature Research

**Domain:** Consulting site v1.1 -- Social proof, messaging refinements, analytics with cookie consent
**Researched:** 2026-02-27
**Confidence:** HIGH
**Scope:** NEW features only. Existing v1.0 features (hero, services, contact form, bilingual, SEO, accessibility, scroll animations, privacy policy) are already shipped.

## Feature Landscape

### Table Stakes (Users Expect These)

Features that visitors to a professional consulting site assume exist once the site has a privacy policy and claims professionalism. Missing any of these in v1.1 creates a gap between the site's polish level and its trust signals.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Cookie consent banner | Site already has a privacy policy page with a cookies section (currently states "no tracking cookies"). Adding GA4 means tracking cookies exist. Showing no consent banner while running analytics violates GDPR and LatAm privacy laws (Mexico LFPDPPP, Colombia Ley 1581, Argentina PDPA). Visitors from EU/regulated markets will immediately notice | MEDIUM | Must block analytics scripts until consent is granted. Bilingual (ES/EN) matching existing i18n. Bottom banner pattern, not modal. Must integrate with GA4 Consent Mode v2. Privacy policy cookies section needs updating |
| GA4 analytics integration | Cannot optimize conversion funnel without data. The site has CTAs, a contact form, and WhatsApp -- but zero visibility into what works. Every serious business site tracks page views at minimum | LOW | Use `@next/third-parties/google` -- official Next.js package, already optimized for performance. `GoogleTagManager` component in root layout. Tracks page views automatically including client-side navigations |
| Custom event tracking (CTA clicks, form interactions) | GA4 page views alone are vanity metrics. Need to track the conversion funnel: CTA click -> form start -> form submit -> form success. Without this, impossible to know if messaging changes improve conversion | LOW | 4 key events: `cta_click` (all CTA buttons), `form_start` (first field focus), `form_submit` (submit button click), `form_success` (server returns success). Use `sendGTMEvent` from `@next/third-parties/google` in existing client components |
| Case study / social proof section | The bio page already has a placeholder `SocialProofSection` component saying "Real client experiences and results will be shared here soon." This explicitly promises content. An empty promise section is worse than no section -- it signals the consultant has no clients. Must fill this | MEDIUM | 3 anonymized case studies with Challenge -> Intervention -> Result structure. Place on homepage (1-2 highlights) and dedicated section on services page. Replace the empty bio social proof placeholder with real content |

### Differentiators (Competitive Advantage)

Features that set M. Gripe apart from typical LatAm solo consultants and even platform competitors like Toptal/Clutch. Not required, but convert visitors who are comparison-shopping.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Anonymized case studies with extreme specificity | Most LatAm solo consultants have zero case studies. Those that do use vague language ("helped a company improve"). Anonymous case studies that are deeply specific about the problem, process, and measurable outcomes are actually MORE persuasive than named studies because they force compelling narrative instead of relying on logo recognition. Research confirms "anonymous case studies can be more potent selling tools than named counterparts" | MEDIUM | 3 narratives mapped to service lines: (1) alignment/strategy, (2) BI/data delivery acceleration, (3) team building/fractional leadership. Use descriptors like "a 120-person fintech in Mexico City" not "Company X." Include specific metrics: "delivery cadence improved from 6-week to 2-week cycles" |
| LatAm differentiation messaging | Current site mentions LatAm as a geographic label but does not position regional expertise as a value proposition. Most consulting sites treat geography as a detail, not a selling point. For LatAm founders choosing between a generic US consultant and someone who understands regional dynamics (tight budgets, distributed talent, cultural nuance), this is the deciding factor | LOW | Content additions to existing sections. Bio narrative paragraph 3 already touches this but needs sharpening. Add a dedicated "Why LatAm Expertise Matters" subsection on homepage or services page. Frame around pain: "US playbooks don't work in LatAm without adaptation" |
| Concrete diagnostic CTA deliverable | Current CTA is "Book your 45-min diagnostic" -- good but generic. Research shows CTAs that specify a tangible takeaway convert 2-3x better. "You'll receive X" beats "Let's talk." Framing the diagnostic as delivering a mini-deliverable (brief/action plan) rather than "just a call" reduces perceived risk and increases commitment | LOW | Messaging refinement only, no new components. Change CTA copy to specify deliverable: "Book your diagnostic -- you'll receive a prioritized action brief within 48 hours." Update hero subtitle, CTA band text, services CTA section. All through i18n message changes |
| Competitive positioning content | Solo consultant vs. freelance platforms (Toptal, Clutch) vs. agencies is a real comparison prospects make. Addressing it directly shows confidence and gives prospects language to justify the choice internally. Few solo consultants address this; most pretend competitors don't exist | LOW | Content section comparing approaches without naming competitors directly. Focus on what a senior embedded consultant provides that platforms and agencies cannot: continuity, strategic depth, accountability, regional knowledge. NOT a comparison table (that commoditizes), but narrative positioning |
| GA4 Consent Mode v2 integration | Goes beyond basic cookie consent to tell GA4 exactly what's allowed. When consent is denied, GA4 still collects anonymized/modeled data (pings with no cookies) which preserves ~70% of insights. When consent is granted, full measurement activates. This is the modern standard and prevents total data loss from consent-deniers | LOW | Set `gtag('consent', 'default', { analytics_storage: 'denied' })` before GTM loads. Update to 'granted' when user accepts. No additional libraries needed. Custom implementation using cookies API and dataLayer |
| Strategic social proof placement | Research shows social proof should be distributed throughout the site, not concentrated in one location. 1-2 case study highlights on homepage near CTA band, relevant case studies on service pages near their corresponding offering, one testimonial-style quote near the contact form. This surrounds the conversion funnel with evidence | LOW | No new components needed. Reuse the case study card pattern in multiple locations. Homepage gets abbreviated versions (headline + metric + link to full). Contact page gets a single quote. Services page gets full narratives |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem logical for v1.1 but should be avoided.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Real client testimonials with names/photos | "Named testimonials are more credible" | Requires actual client consent which is not yet secured. Creating placeholder testimonials with fake names destroys trust if discovered. The PROJECT.md explicitly lists "Client logo wall / real testimonials" as out of scope, needing real client consent first | Anonymized case studies with extreme specificity on outcomes. Descriptive client context ("a Series B fintech in Colombia") provides credibility without needing permission. Add named testimonials in v1.2 when consent is secured |
| Full analytics dashboard / heatmaps | "Need to understand user behavior deeply" | Adds complexity (Hotjar/Clarity), additional cookie consent categories, heavier JS payload, minimal value at current traffic levels. The site likely gets <100 visits/week initially | GA4 with 4 custom events covers the conversion funnel. Enhanced measurement in GA4 already tracks scrolls, outbound clicks, site search. Add heatmaps only when traffic exceeds 500 sessions/week |
| A/B testing framework | "Test which messaging converts better" | Requires meaningful traffic volume (100+ conversions per variant). Adding Optimizely/VWO increases page weight, adds another consent category, and the site won't have statistical power for months. PROJECT.md explicitly defers this | Track conversion rate via GA4 events. Make messaging changes based on qualitative feedback and funnel analysis first. Add A/B testing in v2+ when traffic justifies it |
| Granular cookie consent categories | "Let users choose analytics vs. marketing vs. functional cookies" | The site only uses ONE type of non-essential cookie (GA4 analytics). Showing a complex multi-category consent dialog for a single cookie type is confusing UX theater. Over-engineering consent for a simple setup | Binary consent: "Accept analytics" or "Decline." One toggle, one cookie type. If marketing cookies are added later (retargeting, etc.), upgrade the consent UI then |
| Case study detail pages (separate routes) | "Each case study deserves its own page for SEO" | 3 anonymized case studies don't warrant dedicated pages. Thin pages hurt SEO more than help. Navigation overhead for the user. Over-engineering at this scale | Inline sections on the services page (or a dedicated section on the homepage). Use anchor links for direct reference. Add dedicated pages only when there are 6+ case studies |
| Blog posts about case studies | "Repurpose case studies as blog content" | Blog is explicitly out of scope for v1.1. Creating blog infrastructure for 3 posts is not worth the engineering effort | Keep case studies as structured sections within existing pages. Content can be repurposed for LinkedIn posts (the actual thought leadership channel) without building blog infrastructure |
| Cookie consent SaaS (CookieBot, OneTrust, Termly) | "Compliance out of the box, legally safe" | Monthly cost ($10-50/month), external JS dependency (300-500KB), styling conflicts with existing design, overkill for a single analytics cookie. Violates the "free/low-cost services only" constraint in PROJECT.md | Custom cookie consent banner. ~100 lines of code. Full control over styling and bilingual support. Stores consent in localStorage. Integrates directly with GA4 Consent Mode v2 |
| Schema.org markup in this milestone | "Improve search visibility alongside other improvements" | Different concern from the v1.1 focus. Adds scope without supporting the trust/proof/analytics narrative. Better as a standalone task | Defer to v1.2 alongside Open Graph tags. Both are SEO enhancements that can be batched together |

## Feature Dependencies

```
[Cookie Consent Banner]
    +--requires--> [Privacy Policy Update] (cookies section must reflect analytics cookies)
    +--requires--> [Bilingual i18n Messages] (banner text in ES + EN)
    +--blocks----> [GA4/GTM Integration] (analytics must not load before consent)

[GA4/GTM Integration]
    +--requires--> [Cookie Consent Banner] (must respect consent state)
    +--requires--> [@next/third-parties package install]
    +--enhances--> [Contact Form] (form_start, form_submit, form_success events)
    +--enhances--> [All CTA Buttons] (cta_click events)
    +--enhances--> [WhatsApp Button] (whatsapp_click event)

[Custom Event Tracking]
    +--requires--> [GA4/GTM Integration] (dataLayer must exist)
    +--requires--> [Cookie Consent Banner] (events only fire when consent granted)
    +--enhances--> [Contact Form] (funnel visibility)
    +--enhances--> [CTA Buttons] (click attribution)

[Anonymized Case Studies]
    +--requires--> [Content Writing] (3 narratives in ES + EN)
    +--requires--> [Bilingual i18n Messages] (case study text in both languages)
    +--enhances--> [Homepage] (case study highlights near CTA band)
    +--enhances--> [Services Page] (full case studies near relevant offerings)
    +--replaces--> [Bio SocialProofSection placeholder] (no more "coming soon")

[LatAm Differentiation Messaging]
    +--enhances--> [Bio Page] (sharpen narrative paragraph 3)
    +--enhances--> [Homepage] (add value proposition context)
    +--independent (content changes only, no new components)

[Concrete Diagnostic CTA Deliverable]
    +--enhances--> [Hero Section CTA text]
    +--enhances--> [CTA Band text]
    +--enhances--> [Services CTA text]
    +--enhances--> [Process Section step 1 text]
    +--independent (i18n message changes only)

[Competitive Positioning Content]
    +--enhances--> [Services Page] (new section or expanded FAQ)
    +--requires--> [Bilingual i18n Messages]
    +--independent-of--> [Case Studies] (different content, can parallelize)

[Vercel Deployment]
    +--requires--> [All above features complete]
    +--requires--> [Environment variables] (GTM_ID, GA4_ID in Vercel env)
    +--independent (infrastructure, not feature)
```

### Dependency Notes

- **Cookie consent MUST come before GA4:** Loading analytics scripts without consent is a legal violation. The consent banner is the critical path blocker for all analytics work. Build it first.
- **Case studies and messaging are independent of analytics:** Content work (case studies, CTA refinement, LatAm messaging, competitive positioning) can proceed in parallel with the cookie consent + analytics track.
- **Privacy policy needs updating:** The current cookies section says "This site uses only a technical cookie (NEXT_LOCALE) to remember your language preference. We do not use tracking, analytics, or advertising cookies." This becomes false when GA4 is added. Must update before analytics goes live.
- **Bio SocialProofSection replacement depends on case study content:** The placeholder component currently renders "coming soon" text. It should be replaced entirely, not augmented. The replacement content is the case study narratives.
- **All content changes go through i18n messages:** Every piece of new text (case studies, CTA refinements, consent banner, positioning content) must exist in both `messages/es.json` and `messages/en.json`. This is not a dependency on new infrastructure -- the i18n system is already built -- but it doubles the content writing effort.

## MVP Definition

### Launch With (v1.1)

These features collectively transform the site from "polished brochure" to "credible conversion tool with measurable funnel."

- [ ] **3 anonymized case studies** -- Replace the empty social proof placeholder. Challenge/Intervention/Result format. Mapped to service lines: alignment, delivery/data, team/leadership. Without this, the site promises proof it doesn't deliver
- [ ] **Cookie consent banner** -- Binary accept/decline for analytics cookies. Bilingual. Stores preference in localStorage. Integrates with GA4 Consent Mode v2. Legally required before adding analytics
- [ ] **GA4 via GTM integration** -- `@next/third-parties/google` GoogleTagManager component in root layout. Respects consent state. Automatic page view tracking. Without this, no conversion data
- [ ] **Custom event tracking** -- 4 events: `cta_click`, `form_start`, `form_submit`, `form_success`. Plus `whatsapp_click`. Fired via `sendGTMEvent`. These define the measurable conversion funnel
- [ ] **Concrete diagnostic CTA deliverable framing** -- Update CTA copy across all instances to specify what the prospect receives (action brief/diagnostic summary). Pure i18n message changes
- [ ] **Privacy policy update** -- Revise cookies section to accurately reflect GA4 analytics cookies. Add what cookies are set, their purpose, and retention period
- [ ] **Vercel deployment** -- Carried from v1.0 Phase 7. All features are meaningless without production hosting. Environment variables for GTM/GA4 IDs

### Add After Validation (v1.1.x)

Features to add once v1.1 is live and generating initial data.

- [ ] **LatAm differentiation messaging** -- Sharpen after seeing which visitors convert (geo data from GA4). Trigger: GA4 data shows significant non-LatAm traffic, or conversion rate from LatAm visitors is notably different
- [ ] **Competitive positioning content** -- Add once the case studies are validated (do they get read? do visitors who read them convert?). Trigger: GA4 scroll depth data on case study sections
- [ ] **Strategic social proof placement (distributed)** -- Move case study highlights to homepage and contact page once the section designs are validated on services page. Trigger: case study content is live and engagement data exists

### Future Consideration (v1.2+)

- [ ] **Named testimonials** -- Add when real client consent is secured. Replace anonymized quotes with attributed ones
- [ ] **Video case studies** -- Add when production quality is feasible and traffic warrants the bandwidth cost
- [ ] **Heatmap/session recording** -- Add when traffic exceeds 500 sessions/week. Requires additional consent category
- [ ] **A/B testing** -- Add when traffic exceeds 100+ conversions/week per variant
- [ ] **Case study detail pages** -- Add when there are 6+ case studies warranting dedicated routes

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Cookie consent banner (bilingual, Consent Mode v2) | HIGH | MEDIUM | P1 |
| GA4/GTM integration via @next/third-parties | HIGH | LOW | P1 |
| Custom event tracking (4 funnel events) | HIGH | LOW | P1 |
| 3 anonymized case studies (ES + EN content) | HIGH | MEDIUM | P1 |
| Concrete diagnostic CTA deliverable copy | HIGH | LOW | P1 |
| Privacy policy cookies section update | HIGH | LOW | P1 |
| Vercel deployment | HIGH | LOW | P1 |
| LatAm differentiation messaging refinement | MEDIUM | LOW | P2 |
| Competitive positioning content section | MEDIUM | LOW | P2 |
| Distributed social proof placement (homepage, contact) | MEDIUM | LOW | P2 |
| Bio SocialProofSection redesign (replace placeholder) | MEDIUM | LOW | P2 |

**Priority key:**
- P1: Must ship in v1.1. These features are interdependent and collectively deliver the milestone goal.
- P2: Should ship in v1.1 if time allows. Each adds value independently and can be deferred to v1.1.x without blocking the milestone.

## Competitor Feature Analysis

| Feature | Typical LatAm Solo Consultant | Freelance Platforms (Toptal/Clutch) | M. Gripe v1.1 Approach |
|---------|-------------------------------|-------------------------------------|-------------------------|
| Case studies | None, or vague "I helped a company grow" | Platform shows verified reviews with project details. Client names visible. Large volume (100s of reviews) | 3 deeply specific anonymized narratives. Challenge/Intervention/Result with real metrics. "A 120-person fintech in Mexico City" level of context. Quality over quantity |
| Social proof | Client logos (if any), no detail | Star ratings, verified reviews, standardized format | Anonymized case studies with quantified outcomes. Distributed across homepage and services page. Specific > vague |
| Cookie consent | Rarely implemented. Many run GA without consent | Platform handles compliance centrally | Custom bilingual banner. Binary accept/decline. GA4 Consent Mode v2. Lightweight (~100 lines, no external deps) |
| Analytics | Google Analytics (often Universal Analytics, now deprecated) or none | Platform-level analytics, individual profiles don't control | GA4 via GTM with 4 custom conversion events. Consent-gated. Full funnel: CTA click -> form start -> submit -> success |
| CTA specificity | "Contact me" or just a WhatsApp link | "Hire [Name]" with standardized intake flow | "Book your diagnostic -- receive a prioritized action brief within 48h." Named deliverable, specific timeframe |
| Regional positioning | "I work with companies in [country]" -- geography as fact | No regional specialization, positioned as global | LatAm expertise as differentiator: understanding of regional dynamics, cultural fit, adapted playbooks. Geographic expertise = strategic value |
| Competitive positioning | Ignores competitors | N/A (they ARE the competitor) | Narrative positioning of embedded consultant vs. platform rotation vs. agency overhead. Addresses the real comparison without naming names |

## Sources

- [Articulate Marketing: Effective Case Study Section Design](https://www.articulatemarketing.com/blog/how-to-design-an-effective-case-study-section-for-your-website) -- case study UX patterns, card layouts, navigation
- [Blue Seedling: Anonymous Case Studies as Secret Weapon](https://www.blueseedling.com/blog/how-to-make-anonymous-case-studies-your-secret-weapon/) -- anonymization strategies, specificity over logos
- [Knapsack Creative: Social Proof on Consulting Websites](https://knapsackcreative.com/blog-industry/consulting-website-social-proof) -- social proof types, strategic placement throughout site
- [Next.js Official Docs: Third Party Libraries](https://nextjs.org/docs/app/guides/third-party-libraries) -- GoogleTagManager, GoogleAnalytics components, sendGTMEvent API (v16.1.6)
- [Google Developers: Consent Mode Setup](https://developers.google.com/tag-platform/security/guides/consent) -- Consent Mode v2, default denied, update on accept
- [Simo Ahava: Basic Consent Mode Guide](https://www.simoahava.com/analytics/basic-consent-mode-the-guide/) -- implementation patterns for consent + GTM
- [Simo Ahava: Consent Mode V2 for Google Tags](https://www.simoahava.com/analytics/consent-mode-v2-google-tags/) -- advanced vs basic consent mode, data modeling
- [Build with Matija: Cookie Consent Banner in Next.js 15](https://www.buildwithmatija.com/blog/build-cookie-consent-banner-nextjs-15-server-client) -- custom implementation without libraries, server/client patterns
- [Mimiran: CTAs That Convert for Consultants](https://www.mimiran.com/calls-to-action-that-convert-for-independent-consultant-websites/) -- value-first CTAs, deliverable framing, lead magnet vs consultation
- [Knapsack Creative: Consulting Website CTA Guide](https://knapsackcreative.com/blog-industry/consulting-website-cta-guide) -- CTA specificity, friction reduction
- [Big Red Jelly: Make Free Consultation CTA More Effective](https://bigredjelly.com/blog/3-ways-to-make-your-free-consultation-cta-more-effective/) -- framing deliverable, reducing anxiety
- [Consulting Success: Testimonials and Case Studies](https://www.consultingsuccess.com/consulting-testimonials) -- building social proof pipeline for consultants
- [Orange Marketing: Compelling Anonymous Case Studies](https://blog.orangemarketing.com/writing-compelling-anonymous-case-studies) -- anonymization methods, client descriptors
- [The Visible Authority: Positioning Lessons for Consultancies](https://www.thevisibleauthority.com/blog/positioning-lessons-every-consultancy-should-internalize) -- differentiation vs comparison, strategic positioning
- [Consultancy.lat](https://www.consultancy.lat/) -- LatAm consulting landscape, competitor reference

---
*Feature research for: M. Gripe Consulting v1.1 -- Proof & Trust milestone*
*Researched: 2026-02-27*
