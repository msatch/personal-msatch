# Feature Research

**Domain:** Personal brand consulting website (technical/business advisory, LatAm-focused, bilingual)
**Researched:** 2026-02-16
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Clear hero with value proposition | Visitors decide in 3-5 seconds whether to stay; a vague hero = immediate bounce. Must state who you help, what outcome you deliver, and why it matters | LOW | Single headline + subheadline + CTA button. Outcome-focused, not self-focused |
| Professional navigation (Home, Bio, Services, Contact) | Users expect standard information architecture; non-standard nav confuses | LOW | Sticky header, mobile hamburger. 4 pages keeps it tight |
| Mobile-responsive layout | 60%+ of LatAm web traffic is mobile. Non-responsive = unusable for majority | MEDIUM | Must be mobile-first, not desktop-adapted. Touch-friendly tap targets |
| Contact form | Primary conversion mechanism. No form = no leads. Visitors will not email manually | LOW | Name, email, message. Keep to 3-4 fields max. Phone optional to reduce abandonment (39% to 4% drop) |
| Email delivery on form submission | Form must actually deliver the message reliably. Broken forms silently kill leads | LOW | Resend integration. Confirmation feedback to user. Error handling |
| Services page with clear offerings | Visitors need to understand what you do and whether it matches their problem. Vague "solutions" language drives people away | LOW | Four services with outcome-focused descriptions. Frame around client problems, not consultant activities |
| Bio/About page | Trust-building through credentials, story, and human connection. Consulting is a relationship sale | LOW | Photo, professional narrative, credentials, experience summary. LatAm clients value personal connection |
| SSL/HTTPS | Browser warnings on non-HTTPS sites destroy trust instantly | LOW | Standard with any modern hosting (Vercel, Netlify). Non-negotiable |
| Fast page load (<3s) | Slow sites lose 40% of visitors. Google penalizes slow sites in search rankings | MEDIUM | Static site generation, optimized images, minimal JS bundle. Target <2s LCP |
| Basic SEO (meta tags, semantic HTML) | Must be discoverable via search. No SEO = invisible to organic traffic | LOW | Title tags, meta descriptions, Open Graph tags, semantic heading structure, alt text on images |
| Privacy policy | Legal requirement in most LatAm jurisdictions (Mexico's LFPDPPP, Colombia's Ley 1581, Argentina's PDPA). GDPR applies if any EU visitors | LOW | Static page. Can use template adapted for LatAm data protection laws |
| Spanish as primary language | Target market is Spanish-speaking LatAm. English-only site excludes 90%+ of target audience | LOW | All content authored in Spanish first. This is the default language |
| Accessible design (WCAG 2.1 AA basics) | Demonstrates professionalism. Legal exposure in some markets. Screen reader compatibility, color contrast, keyboard navigation | MEDIUM | Focus on contrast ratios, alt text, semantic HTML, focus indicators. Not full WCAG audit, but solid baseline |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Bilingual toggle (ES/EN) | Signals international capability. Reaches US-based LatAm founders and English-speaking partners. Very few LatAm consultants offer seamless bilingual sites | MEDIUM | Language toggle in header. Label as "English" / "Espanol" (native names, no flags). URL-based routing (/es/, /en/). No auto-redirect based on location |
| Structured data / Schema.org markup | Rich search results (Person schema, ProfessionalService schema) increase CTR by up to 30%. Builds Knowledge Graph presence. Few solo consultants implement this | LOW | Person schema, ProfessionalService, ContactPoint. JSON-LD in head. One-time setup |
| "How it works" process section | Reduces anxiety about engagement model. Shows professionalism. Most LatAm solo consultants skip this | LOW | 3-4 step visual: Discovery Call > Diagnostic > Proposal > Engagement. Sets clear expectations |
| Entry offer prominently positioned (45-min diagnostic) | Low-commitment CTA reduces friction. "Book a free call" converts 2-3x better than "Contact us". Names the specific offer | LOW | Dedicated CTA throughout site. Specific: "45-minute diagnostic call" not generic "get in touch" |
| GA4 analytics with custom events | Understand visitor behavior, optimize conversion funnel, measure which services attract interest. Data-driven iteration | LOW | Track: form submissions, CTA clicks, service section views, language toggle usage, scroll depth. Enhanced measurement covers basics |
| Social proof section (testimonials/logos) | 92% of people trust peer recommendations over advertising. Client logos and specific testimonials reduce perceived risk for consulting purchases | LOW | Start with 2-3 strong testimonials with real names, titles, and specific outcomes. Add client logo wall when available |
| Open Graph + social sharing meta | Links shared on LinkedIn/WhatsApp (primary channels in LatAm B2B) render with proper preview image, title, description | LOW | OG tags per page. Custom OG image. WhatsApp is critical sharing channel in LatAm |
| Performance optimization (Core Web Vitals) | Google ranking signal. Professional signal. Static site should score 95+ on Lighthouse easily | MEDIUM | Image optimization (WebP/AVIF), font loading strategy, minimal client-side JS, proper caching headers |
| Subtle animations / micro-interactions | Polish that signals quality without distraction. Distinguishes from template-looking sites | LOW | Fade-in on scroll, hover states on CTAs, smooth transitions. CSS-only where possible. Restraint is key |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Blog / content section | "Thought leadership" and SEO. Every consulting guide recommends it | Requires ongoing content commitment. Empty or stale blog is worse than no blog. Solo consultant bandwidth is limited. A blog with 2 posts from 6 months ago signals abandonment | Defer to v2+. Use LinkedIn for thought leadership initially. Add blog only when there is a content pipeline and commitment to publish at least 2x/month |
| Calendly / booking widget embed | "Reduce friction, let them book directly" | Adds third-party dependency, iframe styling issues, creates scheduling conflicts if calendar not maintained, exposes availability. For high-value consulting, some friction is appropriate (it qualifies leads) | Contact form as primary CTA. Mention the 45-min diagnostic in form context. Manual scheduling lets you qualify leads before committing time |
| Chatbot / live chat | "Be available 24/7, capture leads instantly" | Solo consultant cannot staff live chat. Bot responses feel impersonal for relationship-based consulting. Adds JS weight and third-party dependency. Creates expectation of instant response that cannot be met | Contact form with clear response time expectation ("I respond within 24 hours"). WhatsApp link as secondary contact for LatAm audience |
| Pricing page / rate display | "Transparency builds trust" | Consulting pricing is contextual. Published rates anchor low or scare away. Removes ability to scope-price. Commoditizes advisory work | Services page describes outcomes and engagement models. Pricing discussed in diagnostic call. "Investment varies by scope" is acceptable |
| Case studies / portfolio page | "Show your work, prove results" | Requires client permission, takes significant effort to produce well, and for a new brand site, having zero case studies is worse than not having the section | Defer to v1.x. Use testimonial quotes initially. Add case studies as client engagements complete and permissions are secured |
| Newsletter signup / email list | "Build an audience, nurture leads" | Requires email marketing infrastructure (ESP), ongoing content creation, compliance (CAN-SPAM, LatAm equivalents). Empty newsletters damage brand | Defer entirely. Focus on direct conversion (diagnostic call). Add only when there is a content strategy and ESP budget |
| Autoplay video on homepage | "Video converts better, show personality" | Increases load time dramatically, annoys users, accessibility issues, requires production investment. Bad video is worse than no video | Static professional photo. If video is desired later, add as click-to-play, not autoplay |
| Client portal / login area | "Premium feel, deliver resources" | Massive scope increase. Auth system, file management, permissions. Completely unnecessary for a lead-generation site | Use Google Drive / Notion for client deliverables. Website is for acquisition, not delivery |
| Pop-ups (exit intent, timed) | "Capture abandoning visitors" | Hostile UX pattern. Particularly annoying on mobile. Damages brand perception for premium consulting. LatAm audiences find pop-ups especially intrusive | Clean, visible CTAs throughout page flow. Sticky CTA bar if needed |
| Multi-page contact wizard | "Qualify leads with detailed intake form" | High abandonment. Each additional field loses visitors. Over-qualification before first contact is premature | 3-4 field contact form. Qualify in the diagnostic call, not the form |

## Feature Dependencies

```
[Spanish content (primary language)]
    +--requires--> [Content architecture / page structure]
    +--requires--> [Contact form]
                       +--requires--> [Email delivery (Resend)]

[Bilingual toggle (ES/EN)]
    +--requires--> [Spanish content (primary language)]
    +--requires--> [i18n routing infrastructure (/es/, /en/)]
    +--requires--> [Translated content for all pages]

[GA4 analytics]
    +--requires--> [Page structure deployed]
    +--enhances--> [Contact form] (track submissions as key events)
    +--enhances--> [Bilingual toggle] (track language preference)
    +--enhances--> [Services page] (track section engagement)

[Structured data / Schema.org]
    +--requires--> [Bio page content] (Person schema)
    +--requires--> [Services page content] (ProfessionalService schema)
    +--enhances--> [Basic SEO]

[Social proof section]
    +--enhances--> [Services page]
    +--enhances--> [Contact page] (testimonial near form reduces friction)

[Entry offer CTA (45-min diagnostic)]
    +--requires--> [Contact form]
    +--enhances--> [Homepage hero]
    +--enhances--> [Services page]

[Performance optimization]
    +--enhances--> [Basic SEO] (Core Web Vitals are ranking signals)
    +--requires--> [Page structure deployed]
```

### Dependency Notes

- **Bilingual toggle requires Spanish content first:** Build and validate the Spanish site fully before adding English translation layer. i18n is an architectural decision that must be made early but English content can be added after Spanish launch.
- **GA4 requires deployed pages:** Analytics instrumentation happens after pages exist but should be wired during build, not retrofitted.
- **Schema.org requires content:** Structured data references content that must exist (bio details, service descriptions). Implement alongside content, not before.
- **Social proof enhances but does not block:** Site can launch without testimonials. Add them as they are collected. Design the layout to accommodate them.
- **Entry offer CTA depends on contact form:** The "Book your 45-min diagnostic" button needs somewhere to send people. Contact form is the destination.

## MVP Definition

### Launch With (v1)

Minimum viable product -- what is needed to start generating leads.

- [ ] **Homepage with hero section** -- value proposition, primary CTA ("Book your 45-min diagnostic"), professional photo. Without this, no visitor converts
- [ ] **Bio page** -- credentials, story, photo. Consulting is a trust sale; people buy people
- [ ] **Services page** -- four services with outcome-focused descriptions and "how it works" process section. Visitors must understand what you do
- [ ] **Contact page with form** -- name, email, optional phone, message, service interest dropdown. This is the conversion point
- [ ] **Email delivery via Resend** -- forms must deliver messages reliably. Broken form = zero leads
- [ ] **Spanish as primary language** -- target market is LatAm Spanish-speaking. English can follow
- [ ] **Mobile-responsive design** -- majority of LatAm traffic is mobile
- [ ] **Basic SEO** -- meta tags, semantic HTML, sitemap, robots.txt
- [ ] **SSL/HTTPS** -- trust baseline
- [ ] **Privacy policy** -- legal requirement in target markets
- [ ] **GA4 basic setup** -- page views, form submission tracking. Needed from day one to measure

### Add After Validation (v1.x)

Features to add once the site is live and generating initial traffic.

- [ ] **Bilingual toggle (ES/EN)** -- add when English content is translated and validated. Trigger: international leads or English-speaking prospects reaching out
- [ ] **Social proof section** -- add when 2-3 strong testimonials with real names and outcomes are available. Trigger: first client engagements completed
- [ ] **Structured data / Schema.org** -- add Person and ProfessionalService schemas. Trigger: site indexed by Google, want to improve rich snippets
- [ ] **Enhanced GA4 events** -- CTA click tracking, scroll depth, service section engagement. Trigger: enough traffic to make data meaningful
- [ ] **Performance optimization pass** -- image formats (WebP/AVIF), font subsetting, caching strategy. Trigger: Lighthouse audit after launch
- [ ] **Open Graph optimization** -- custom OG images per page for LinkedIn/WhatsApp sharing. Trigger: starting active promotion

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **Blog / thought leadership section** -- defer until content pipeline exists and publishing cadence is sustainable (2x/month minimum)
- [ ] **Case studies page** -- defer until 2-3 client engagements with measurable outcomes and permission to publish
- [ ] **Booking widget integration** -- defer until lead volume justifies automated scheduling. Manual qualification is fine for low volume
- [ ] **Newsletter / email capture** -- defer until ESP is selected and content strategy is defined
- [ ] **Client testimonial video embeds** -- defer until video production is feasible and adds clear value over text testimonials

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Homepage hero + value proposition | HIGH | LOW | P1 |
| Services page (4 services, outcomes) | HIGH | LOW | P1 |
| Contact form + Resend email | HIGH | LOW | P1 |
| Bio/About page | HIGH | LOW | P1 |
| Mobile-responsive layout | HIGH | MEDIUM | P1 |
| Spanish primary language | HIGH | LOW | P1 |
| Basic SEO (meta, semantic HTML) | HIGH | LOW | P1 |
| SSL/HTTPS | HIGH | LOW | P1 |
| Privacy policy | MEDIUM | LOW | P1 |
| GA4 basic setup | MEDIUM | LOW | P1 |
| Entry offer CTA (45-min diagnostic) | HIGH | LOW | P1 |
| "How it works" process section | MEDIUM | LOW | P1 |
| Bilingual toggle (ES/EN) | HIGH | MEDIUM | P2 |
| Social proof / testimonials | HIGH | LOW | P2 |
| Structured data / Schema.org | MEDIUM | LOW | P2 |
| Open Graph meta tags | MEDIUM | LOW | P2 |
| Enhanced GA4 custom events | MEDIUM | LOW | P2 |
| Performance optimization (CWV) | MEDIUM | MEDIUM | P2 |
| Subtle animations | LOW | LOW | P2 |
| Blog section | MEDIUM | HIGH | P3 |
| Case studies | MEDIUM | HIGH | P3 |
| Booking widget | LOW | MEDIUM | P3 |
| Newsletter signup | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | LatAm Solo Consultants (typical) | US/EU Consulting Sites (best-in-class) | M. Gripe Approach |
|---------|----------------------------------|----------------------------------------|-------------------|
| Language support | Spanish only, or poor English translation | English only, or professional multilingual | Bilingual ES/EN with proper i18n routing. Spanish-first, polished English second |
| Contact mechanism | WhatsApp link or email address | Calendly embed or multi-step form | Structured contact form + Resend. WhatsApp as secondary link. Simple and reliable |
| Services presentation | Generic list of capabilities | Outcome-focused with case studies | Outcome-focused descriptions for four services. "How it works" process section |
| Social proof | Logos on homepage, no detail | Detailed testimonials with metrics and case studies | Start with placeholder design. Add real testimonials as collected. Target: names, titles, specific outcomes |
| Design quality | WordPress template, often dated | Custom design, strong brand identity | Minimal, light design. Custom but not heavy. Professional typography and whitespace |
| SEO / structured data | Basic or none | Full schema markup, blog, keyword strategy | Solid baseline SEO + Schema.org. Blog deferred. Focus on local/regional discovery |
| Performance | Often slow (heavy themes, shared hosting) | Fast (CDN, SSG, optimized) | Static site generation, modern hosting. Target 95+ Lighthouse score |
| Analytics | Often none or basic GA | Full funnel tracking, heatmaps, A/B testing | GA4 with key event tracking. No heatmaps or A/B testing needed at this scale |
| Entry offer | Vague "contact us" | Named offers ("Free Strategy Session", "30-min Audit") | Named entry offer: "45-minute diagnostic call". Specific, low-commitment, clearly positioned |
| Accessibility | Rarely considered | WCAG compliance, alt text, keyboard nav | WCAG 2.1 AA baseline. Semantic HTML, contrast, focus indicators |

## Sources

- [Knapsack Creative: Best Consulting Websites](https://knapsackcreative.com/best-consulting-websites) -- consulting website design patterns and features
- [Melisa Liberman: Consulting Website Examples](https://www.melisaliberman.com/blog/consulting-website-examples) -- essential elements for consulting sites
- [Consulting Success: Building a Consulting Website](https://www.consultingsuccess.com/consulting-website) -- 10 steps, common mistakes
- [Squarespace: How to Build a Consulting Website](https://www.squarespace.com/blog/how-to-make-consulting-website) -- page structure guidance
- [Digital.gov: Multilingual Website Best Practices](https://digital.gov/resources/top-10-best-practices-for-multilingual-websites) -- i18n and language toggle standards
- [USWDS: Two Languages Pattern](https://designsystem.digital.gov/patterns/select-a-language/two-languages/) -- language toggle UX pattern
- [Knapsack Creative: Social Proof on Consulting Websites](https://knapsackcreative.com/blog-industry/consulting-website-social-proof) -- trust signal strategy
- [Atlas Softweb: Trust Signals for Consulting Sites](https://atlassoftweb.com/6-key-trust-signals-to-include-on-your-consulting-business-website) -- credibility elements
- [WordLift: Structured Data for Personal Branding](https://wordlift.io/blog/en/structured-data-for-personal-branding/) -- Schema.org for personal brands
- [WPForms: Form Conversion Best Practices](https://wpforms.com/research-based-tips-to-improve-contact-form-conversions/) -- contact form optimization
- [SmartBug Media: Contact Page Optimization](https://www.smartbugmedia.com/blog/optimize-your-contact-us-page-for-conversions) -- conversion-focused contact pages
- [Copyfol.io: Personal Brand Websites 2026](https://blog.copyfol.io/personal-brand-website) -- personal brand website features
- [Consultancy.lat](https://www.consultancy.lat/) -- LatAm consulting industry landscape
- [Latinpresarios: Personal Brand Agency](https://latinpresarios.com/) -- LatAm personal branding competitor

---
*Feature research for: Personal brand consulting website (M. Gripe)*
*Researched: 2026-02-16*
