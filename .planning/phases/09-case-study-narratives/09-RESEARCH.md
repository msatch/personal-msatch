# Phase 9: Case Study Narratives - Research

**Researched:** 2026-02-28
**Domain:** Bilingual case study section as Server Components on existing Next.js 16 home page with next-intl i18n
**Confidence:** HIGH

## Summary

Phase 9 adds a case study narratives section to the home page, positioned between the existing ProcessSection and CtaBand. The scope is tightly contained: one new Server Component (`CaseStudiesSection`), translation content in both `messages/es.json` and `messages/en.json`, and a single-line import + JSX insertion in the home page (`src/app/[locale]/page.tsx`). No new npm packages. No new pages. No client-side JavaScript.

The technical implementation is straightforward because the project already has a well-established pattern for content-driven Server Components that pull structured data from translation files. Every existing home page section (HeroSection, ProblemSection, ServicesPreview, ProcessSection, CtaBand) follows the identical pattern: async Server Component using `getTranslations()` from `next-intl/server`, iterating over numbered keys (`'1'`, `'2'`, `'3'`) via `.map()`, rendering semantic HTML with Tailwind utility classes. The case study section follows this same pattern exactly.

The primary challenge is **content quality, not code**. The success criteria require "naturally-written narratives (not machine-translated)" in both Spanish and English, with industry context and specific measurable outcomes. The translation content must feel authentic in both languages. The anonymization must be specific enough to be credible (e.g., "Series A fintech with a 12-person engineering team") without being identifiable. The problem/intervention/result structure must demonstrate clear cause-and-effect with concrete metrics.

**Primary recommendation:** Create a single `CaseStudiesSection` async Server Component using `getTranslations('home.caseStudies')`, add structured bilingual content under `home.caseStudies` in both message files with `industry`, `problem`, `intervention`, and `result` fields per case study, insert the component between ProcessSection and CtaBand in the home page, and wrap it in a `ScrollReveal`. Zero new packages. Zero client-side JS.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PROOF-01 | Home page displays 3 anonymized case study narratives with problem/intervention/result structure | Architecture Pattern 1: CaseStudiesSection Server Component placed between ProcessSection and CtaBand. Each narrative has `industry`, `problem`, `intervention`, `result` fields in translation JSON. Card-based layout with clear visual separation between narrative parts. |
| PROOF-02 | Each case narrative includes industry context and specific measurable outcomes (timelines, team sizes, efficiency gains) | Content Pattern: `industry` field provides company type + context (e.g., "Series A fintech, 12-person engineering team"). `result` field contains specific metrics (e.g., "Reduced delivery cycles from 6 weeks to 2 weeks"). Narrative voice matches brand: direct, specific, outcome-focused. |
| PROOF-03 | Case study content is bilingual (ES/EN) via existing i18n message files | Standard i18n pattern: Content lives in `home.caseStudies.items.{1,2,3}` namespace in both `messages/es.json` and `messages/en.json`. Component uses `getTranslations('home.caseStudies')`. Each language version is independently authored, not machine-translated. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next-intl/server` | 4.8.3 (existing) | `getTranslations()` for Server Component i18n | Already used by every home page section. Async API provides type-safe access to nested translation keys. |
| Next.js App Router | 16.1.6 (existing) | Server Components rendering with zero client JS | Home page already renders as Server Components. Case studies follow the same pattern. |
| Tailwind CSS 4 | Existing | Styling via utility classes | All existing sections use Tailwind. Design tokens (colors, spacing, typography) are already defined in `globals.css`. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `ScrollReveal` component | Existing Client Component | Scroll-triggered reveal animation | Wrap `CaseStudiesSection` in the home page, same as all other sections. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline case studies on home page | Dedicated `/case-studies` page with cards linking to individual pages | Premature for 3 narratives. A dedicated page is appropriate when there are 6+ case studies or when individual case studies are long-form. Requirements explicitly say "home page displays." |
| Translation JSON for content | MDX files for case study content | MDX is better for long-form content with custom components. For 3 short narratives (~4 fields each), translation JSON is simpler, consistent with all existing content, and supports bilingual rendering natively via next-intl. |
| Static content in translation files | CMS (Contentful, Sanity, etc.) | Massive over-engineering for 3 static narratives. CMS adds deployment complexity, API latency, and a new dependency. Appropriate when the client wants to edit case studies without developer involvement. Not in scope. |

**Installation:**
```bash
# No packages to install. All capabilities are built into the existing stack.
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   └── home/
│       ├── hero-section.tsx           # Existing
│       ├── problem-section.tsx        # Existing
│       ├── services-preview.tsx       # Existing
│       ├── process-section.tsx        # Existing
│       ├── case-studies-section.tsx   # NEW: 3 anonymized case study narratives
│       └── cta-band.tsx              # Existing
├── app/
│   └── [locale]/
│       └── page.tsx                   # MODIFIED: import + insert CaseStudiesSection
└── messages/
    ├── es.json                        # MODIFIED: add home.caseStudies namespace
    └── en.json                        # MODIFIED: add home.caseStudies namespace
```

### Pattern 1: Server Component with `getTranslations()` (Established Project Pattern)

**What:** An async Server Component that uses `getTranslations()` from `next-intl/server` to render bilingual content with zero client-side JavaScript.

**When to use:** For any content-driven section that does not need interactivity (clicks, hover state changes, form inputs).

**Why this approach:** Every existing home page section uses this exact pattern. It guarantees: (1) zero client JS bundle impact, (2) full bilingual support, (3) static rendering via `generateStaticParams`, and (4) consistent developer experience.

**Example:**
```typescript
// src/components/home/case-studies-section.tsx
// Source: Established project pattern (see process-section.tsx, problem-section.tsx)
import { getTranslations } from 'next-intl/server';

export async function CaseStudiesSection() {
  const t = await getTranslations('home.caseStudies');

  return (
    <section className="px-4 py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
          {t('title')}
        </h2>
        <p className="mt-4 text-base md:text-lg text-muted text-center max-w-3xl mx-auto">
          {t('subtitle')}
        </p>

        <div className="mt-12 space-y-8 md:space-y-10">
          {['1', '2', '3'].map((id) => (
            <div
              key={id}
              className="p-6 md:p-8 rounded-lg border border-border bg-background"
            >
              <p className="text-sm font-semibold text-accent uppercase tracking-wide">
                {t(`items.${id}.industry`)}
              </p>
              <div className="mt-4 space-y-3">
                <div>
                  <h3 className="font-bold text-lg">{t(`items.${id}.problemLabel`)}</h3>
                  <p className="mt-1 text-muted">{t(`items.${id}.problem`)}</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t(`items.${id}.interventionLabel`)}</h3>
                  <p className="mt-1 text-muted">{t(`items.${id}.intervention`)}</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t(`items.${id}.resultLabel`)}</h3>
                  <p className="mt-1 text-muted">{t(`items.${id}.result`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Pattern 2: Home Page Composition with ScrollReveal

**What:** Insert the new section into the existing home page between ProcessSection and CtaBand, wrapped in ScrollReveal.

**When to use:** When adding any new section to the home page.

**Example:**
```typescript
// src/app/[locale]/page.tsx (modified)
// Source: Existing home page pattern
import { CaseStudiesSection } from '@/components/home/case-studies-section';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <ScrollReveal>
        <ProblemSection />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <ServicesPreview />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <ProcessSection />
      </ScrollReveal>
      {/* NEW: Case studies between process and CTA */}
      <ScrollReveal>
        <CaseStudiesSection />
      </ScrollReveal>
      <ScrollReveal>
        <CtaBand />
      </ScrollReveal>
    </>
  );
}
```

### Pattern 3: Translation JSON Structure for Case Studies

**What:** Structured content in the translation JSON using the numbered-key pattern established throughout the project.

**When to use:** For any repeatable content items (the project uses `'1'`, `'2'`, `'3'` indexed objects everywhere: pain points, service cards, process steps, FAQ items, credentials).

**Example:**
```json
{
  "home": {
    "caseStudies": {
      "title": "Results in the real world",
      "subtitle": "Anonymized examples from recent engagements showing measurable impact.",
      "labels": {
        "problem": "The challenge",
        "intervention": "What we did",
        "result": "The outcome"
      },
      "items": {
        "1": {
          "industry": "Series A Fintech -- 12-person engineering team",
          "problem": "The team was shipping features but delivery cycles...",
          "intervention": "We restructured the sprint cadence...",
          "result": "Delivery cycles shortened from 6 weeks to 2 weeks..."
        },
        "2": {
          "industry": "Mid-size logistics company -- 45 employees",
          "problem": "Technology decisions were made without...",
          "intervention": "We conducted a full architecture review...",
          "result": "The technical roadmap was aligned with..."
        },
        "3": {
          "industry": "Regional SaaS platform -- Series B, 30-person team",
          "problem": "Product and engineering operated in silos...",
          "intervention": "We facilitated cross-functional workshops...",
          "result": "Sprint output with business impact increased..."
        }
      }
    }
  }
}
```

**Key detail:** The `labels` object provides the section subheadings ("The challenge", "What we did", "The outcome") as translatable strings, keeping the component code clean and allowing each language to use natural phrasing for these labels. This avoids hardcoding English labels in the component.

### Anti-Patterns to Avoid

- **Using a Client Component for static content:** The case studies section has zero interactivity. Making it a Client Component (`'use client'`) would add unnecessary JavaScript to the bundle. Use an async Server Component with `getTranslations()` from `next-intl/server`.
- **Hardcoding content in the component:** All text belongs in translation files, not JSX strings. Even if content seems "static," it must be bilingual and managed through the i18n system.
- **Creating a separate page for 3 short narratives:** The requirements explicitly state "Home page displays 3 case study narratives." A dedicated `/case-studies` route is out of scope and premature for 3 items. This belongs inline on the home page.
- **Using machine translation for the second language:** The success criteria specifically say "naturally-written narratives (not machine-translated)." Both Spanish and English versions must be independently authored with natural phrasing, not translated from one to the other.
- **Using `t.raw()` to pull structured objects:** While `t.raw()` can return JSON objects, accessing individual translation keys via `t('items.1.problem')` is the established pattern and provides better type safety and consistency with the rest of the codebase.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bilingual content rendering | Custom locale switching or conditional rendering | `getTranslations()` from `next-intl/server` | Already handles locale routing, key resolution, and message file selection. Every section in the project uses this. |
| Scroll reveal animation | Custom Intersection Observer logic | Existing `ScrollReveal` component | Already built, tested, and used by every home page section. Includes threshold, delay, and reduced-motion support via CSS. |
| Card layout / responsive grid | Custom CSS grid system | Tailwind utility classes with existing design tokens | Project already has `border-border`, `bg-background`, `text-muted`, `text-accent`, and responsive breakpoints (`md:`, `lg:`) established. |

**Key insight:** Phase 9 is a content phase, not a technical phase. The architecture, i18n infrastructure, component patterns, and design system are all in place. The primary work is crafting high-quality bilingual narratives and mapping them to a single new component that follows existing patterns.

## Common Pitfalls

### Pitfall 1: Generic or Vague Case Study Content
**What goes wrong:** Case studies say things like "improved efficiency" or "better results" without specific numbers. They fail to build trust because they could describe anyone's work.
**Why it happens:** Fear of being too specific with anonymized content, or lack of real engagement data to reference.
**How to avoid:** Every `result` field must include at least one specific metric: a timeline ("6 weeks to 2 weeks"), a percentage ("40% reduction in deployment failures"), a team size ("from 4 to 12 engineers"), or a concrete deliverable ("12-month technical roadmap with quarterly milestones"). Use industry descriptors that are specific enough to be credible but generic enough to protect confidentiality.
**Warning signs:** Any result field that does not contain a number or quantified outcome.

### Pitfall 2: Machine-Translated or Unnatural Second-Language Copy
**What goes wrong:** One language reads naturally while the other feels stiff, uses awkward phrasing, or has grammatical patterns clearly lifted from the source language.
**Why it happens:** Writing content in one language first and translating it, rather than independently authoring both versions.
**How to avoid:** Each language version should be authored with native phrasing in mind. Spanish should feel conversational and direct (matching the existing brand voice in `es.json`). English should be clear and professional (matching `en.json`). Both should convey the same story with the same data points but in naturally flowing prose for each language.
**Warning signs:** Both language versions have identical sentence structure, or one version has unnatural word order (e.g., literal translation of Spanish possessive constructions into English).

### Pitfall 3: Case Studies Breaking Mobile Layout
**What goes wrong:** Long narrative text in Spanish (typically 10-20% longer than English) overflows cards or creates excessively tall sections on mobile.
**Why it happens:** Designing and testing only in English or only on desktop.
**How to avoid:** Test at 375px width in Spanish first (the longer language). Keep each narrative field to 1-3 sentences. Use consistent text density across all 3 case studies. The card layout should use `space-y` for vertical flow rather than fixed heights.
**Warning signs:** One case study card is significantly taller than the others, or text runs past the card boundary.

### Pitfall 4: Section Placement Disrupting Page Flow
**What goes wrong:** The case studies section feels disconnected from the surrounding content, creating an awkward break in the page's narrative arc.
**Why it happens:** Not considering how the home page reads as a sequential story: problem -> services -> process -> [proof] -> CTA.
**How to avoid:** The home page narrative flow is: (1) Hero: value proposition, (2) Problems: LatAm pain points, (3) Services: how I help, (4) Process: how we work, (5) Case studies: proof it works, (6) CTA: next step. Case studies go between process and CTA because they answer the visitor's mental question "Does this actually work?" right before the call to action.
**Warning signs:** The case studies section has a visual style that clashes with surrounding sections (e.g., different background pattern, different card style, different typography scale).

### Pitfall 5: Inconsistent Content Structure Across Case Studies
**What goes wrong:** Case study 1 has a detailed problem and short result. Case study 3 has a short problem and long result. The visual rhythm is broken.
**Why it happens:** Writing each case study independently without a template or length guideline.
**How to avoid:** All 3 case studies should follow the same content template: `industry` (1 phrase), `problem` (1-2 sentences), `intervention` (1-2 sentences), `result` (1-2 sentences with at least one metric). Keep all 3 at approximately equal length.
**Warning signs:** Significant height differences between case study cards when rendered.

## Code Examples

Verified patterns from official sources and existing project code:

### Complete Server Component
```typescript
// src/components/home/case-studies-section.tsx
// Source: Follows established pattern from process-section.tsx and problem-section.tsx
import { getTranslations } from 'next-intl/server';

export async function CaseStudiesSection() {
  const t = await getTranslations('home.caseStudies');

  return (
    <section className="bg-muted/30 px-4 py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
          {t('title')}
        </h2>
        <p className="mt-4 text-base md:text-lg text-muted text-center max-w-3xl mx-auto">
          {t('subtitle')}
        </p>

        <div className="mt-12 space-y-8 md:space-y-10">
          {['1', '2', '3'].map((id) => (
            <article
              key={id}
              className="p-6 md:p-8 rounded-lg border border-border bg-background"
            >
              <p className="text-sm font-semibold text-accent uppercase tracking-wide">
                {t(`items.${id}.industry`)}
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <h3 className="font-bold text-base">
                    {t('labels.problem')}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {t(`items.${id}.problem`)}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {t('labels.intervention')}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {t(`items.${id}.intervention`)}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {t('labels.result')}
                  </h3>
                  <p className="mt-1 text-sm text-muted font-medium">
                    {t(`items.${id}.result`)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Design rationale:**
- `bg-muted/30` background: Matches the alternating pattern used by ServicesPreview (which also uses `bg-muted/30`). Creates visual separation from the ProcessSection above (plain background) and CtaBand below (inverted background).
- `article` element: Semantic HTML for self-contained content blocks. Better than `div` for accessibility and SEO.
- `md:grid-cols-3` for problem/intervention/result: On desktop, the 3-column layout makes the before-during-after structure visually scannable. On mobile, it stacks vertically.
- `text-accent` for industry tag: Draws the eye to the company context first, creating an anchor for the narrative.
- `font-medium` on result text: Subtle emphasis on outcomes to draw the eye.

### Translation Content Structure (English)
```json
{
  "home": {
    "caseStudies": {
      "title": "Real results from real engagements",
      "subtitle": "Anonymized examples from recent consulting engagements, each following a clear problem-to-outcome arc.",
      "labels": {
        "problem": "The challenge",
        "intervention": "The intervention",
        "result": "The outcome"
      },
      "items": {
        "1": {
          "industry": "Series A Fintech -- 12-person engineering team",
          "problem": "...",
          "intervention": "...",
          "result": "..."
        },
        "2": {
          "industry": "Mid-size logistics company -- 45 employees, 8-person dev team",
          "problem": "...",
          "intervention": "...",
          "result": "..."
        },
        "3": {
          "industry": "Regional SaaS platform -- Series B, 30-person product & engineering team",
          "problem": "...",
          "intervention": "...",
          "result": "..."
        }
      }
    }
  }
}
```

### Translation Content Structure (Spanish)
```json
{
  "home": {
    "caseStudies": {
      "title": "Resultados reales de proyectos reales",
      "subtitle": "Ejemplos anonimizados de consultorías recientes, cada uno con una estructura clara de problema, intervención y resultado.",
      "labels": {
        "problem": "El desafio",
        "intervention": "La intervención",
        "result": "El resultado"
      },
      "items": {
        "1": {
          "industry": "Fintech Serie A -- equipo de ingeniería de 12 personas",
          "problem": "...",
          "intervention": "...",
          "result": "..."
        },
        "2": {
          "industry": "Empresa de logística mediana -- 45 empleados, equipo de desarrollo de 8 personas",
          "problem": "...",
          "intervention": "...",
          "result": "..."
        },
        "3": {
          "industry": "Plataforma SaaS regional -- Serie B, equipo de producto e ingeniería de 30 personas",
          "problem": "...",
          "intervention": "...",
          "result": "..."
        }
      }
    }
  }
}
```

**Content authoring notes:**
- The `...` placeholders must be replaced with real narrative content during implementation. Content should be authored by the consultant or with consultant input to ensure authenticity.
- Spanish text uses unaccented characters in the `labels` section to match the existing project convention (as noted in STATE.md: "Unaccented Spanish text maintained in translation files to match existing convention").
- Industry descriptors should map to M. Gripe's actual service areas: strategic advisory, delivery acceleration, product-business alignment, and fractional leadership. Each case study should implicitly demonstrate one or two of these services.
- Each `result` field should contain at least one number (timeline, percentage, team size change, etc.).

### Home Page Integration
```typescript
// src/app/[locale]/page.tsx (only the changed lines)
import { CaseStudiesSection } from '@/components/home/case-studies-section';

// In the JSX, between ProcessSection and CtaBand:
<ScrollReveal>
  <CaseStudiesSection />
</ScrollReveal>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Dedicated case study pages with CMS | Inline case study narratives in translation files | N/A -- approach depends on volume | For 3 short narratives, inline is correct. Dedicated pages make sense at 6+ case studies. |
| Client logos + testimonial quotes | Anonymized problem/intervention/result narratives | Growing trend 2024-2026 | Solo consultants often cannot use client logos or names. Anonymized narratives with specific metrics build trust without requiring client permission. |
| Grid of result metrics (numbers only) | Narrative arcs with embedded metrics | B2B content marketing trend 2025 | Stories are more persuasive than statistics alone. B2B case studies with challenge-solution framing have 28% higher persuasive impact than pure metric displays (per Bounteous research). |

**Deprecated/outdated:**
- No technical deprecations apply. This phase uses only established, stable patterns.

## Open Questions

1. **Case study content authorship**
   - What we know: Three anonymized case studies are needed with industry context, problem/intervention/result structure, and specific measurable outcomes.
   - What's unclear: Whether the consultant (M. Gripe) has drafted or outlined the 3 case studies yet. STATE.md notes: "Case study content (3 anonymized narratives) must be authored before Phase 9 implementation."
   - Recommendation: The planner should include a content authoring task. If the consultant has not provided content outlines, the implementation can use realistic placeholder narratives that match the service areas described in the Services page. These should be clearly marked as placeholders requiring consultant review and approval. The structure and component code do not depend on final content -- they can be built with draft narratives.

2. **Visual design: stacked cards vs. 3-column grid**
   - What we know: The success criteria require a "clear problem/intervention/result structure."
   - What's unclear: Whether each case study should display problem/intervention/result in a horizontal 3-column layout (on desktop) or a vertical stacked layout.
   - Recommendation: Use a responsive approach: 3-column grid on desktop (`md:grid-cols-3`), stacked on mobile. This makes the before-during-after progression visually scannable on desktop while remaining readable on mobile. Matches the project's mobile-first responsive pattern.

3. **Background color for visual rhythm**
   - What we know: The home page alternates backgrounds: plain (hero) -> plain (problems) -> `bg-muted/30` (services preview) -> plain (process) -> inverted (CTA band).
   - What's unclear: Whether the case studies section should have `bg-muted/30` or plain background to maintain the alternating rhythm.
   - Recommendation: Use `bg-muted/30` for the case studies section. This creates a visual pattern of: plain -> plain -> tinted -> plain -> **tinted** -> inverted. The tinted background groups the case studies as a distinct "social proof" band, differentiating them from the process steps above. This also mirrors how the services preview (another content-rich card section) uses the same background.

## Sources

### Primary (HIGH confidence)
- Existing codebase: `src/components/home/process-section.tsx`, `problem-section.tsx`, `services-preview.tsx`, `cta-band.tsx` -- established Server Component patterns with `getTranslations()` and numbered key iteration
- Existing codebase: `src/app/[locale]/page.tsx` -- home page composition with `ScrollReveal` wrapper pattern
- Existing codebase: `messages/es.json`, `messages/en.json` -- translation file structure with nested numbered-key objects
- Existing codebase: `src/styles/globals.css` -- design tokens, color system, and accessibility CSS
- [next-intl Translations Usage](https://next-intl.dev/docs/usage/translations) -- Confirmed `getTranslations()` async API for Server Components, nested key access via dot notation, and `t.raw()` for structured data

### Secondary (MEDIUM confidence)
- [Thrive Themes Case Study Template](https://thrivethemes.com/case-study-template/) -- Problem-solution-result framework for conversion-focused case studies
- [Articulate Marketing Case Study Design](https://www.articulatemarketing.com/blog/how-to-design-an-effective-case-study-section-for-your-website) -- Card patterns, progressive disclosure, and outcome-driven headlines
- [B2B Case Study Template (Thelogonaut)](https://www.thelogonaut.com/post/b2b-case-study-template-10-examples-2025-best-practices) -- Situation-trigger-barrier-solution-results flow; anonymization using industry descriptors
- [Libril B2B Case Study Framework](https://libril.com/blog/b2b-case-study-template) -- Problem-solution-results structure with emphasis on specificity and metrics in result sections
- [Brixon Group B2B Case Studies 2025](https://brixongroup.com/en/compelling-case-studies-how-to-create-impactful-b2b-success-stories-in/) -- Challenge-solution framing yields 28% higher persuasive impact; before/after comparison pattern

### Tertiary (LOW confidence)
- None. All findings are well-supported by codebase evidence and multiple sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Zero new packages. Entire implementation uses existing libraries, components, and patterns already proven in Phases 1-6.
- Architecture: HIGH -- Component pattern, translation structure, home page composition, and ScrollReveal integration are all established patterns copied directly from existing sections.
- Pitfalls: HIGH -- Content quality pitfalls are well-documented in B2B marketing literature. Technical pitfalls are minimal because the architecture is identical to existing working code.

**Research date:** 2026-02-28
**Valid until:** 2026-04-28 (very stable domain -- no moving parts, no external dependencies, no evolving APIs)
