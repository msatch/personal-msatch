# Phase 10: Messaging & Positioning - Research

**Researched:** 2026-02-28
**Domain:** Bilingual consulting copy -- value proposition framing, CTA deliverable specificity, competitive positioning
**Confidence:** HIGH

## Summary

Phase 10 is a **copy-only phase** that modifies translation JSON files and potentially adds one new section to the services page component. No new npm packages, no new components beyond one possible positioning block, and no architectural changes. The entire technical surface is: `messages/es.json`, `messages/en.json`, and potentially `src/components/services/positioning-section.tsx` + its integration in `src/app/[locale]/services/page.tsx`.

The phase addresses three distinct messaging gaps identified in the requirements: (1) LatAm expertise is currently mentioned but never framed as a *why-it-matters* value proposition, (2) diagnostic CTAs say "free 45-min call" without describing what the visitor *receives*, and (3) there is no content addressing why a solo consultant outperforms staffing platforms. All changes must work in both Spanish and English, with Spanish being the longer language that constrains mobile layout.

**Primary recommendation:** Split into two plans -- Plan 1 rewrites all CTA and LatAm messaging in both translation files (MSG-01, MSG-02), Plan 2 adds the competitive positioning section to the services page (MSG-03) and performs the 375px mobile verification for all changes.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MSG-01 | LatAm expertise framed as value proposition explaining WHY local market knowledge matters | Audit of 8 translation keys across 4 pages that currently mention LatAm as geographic label; specific keys identified for rewrite in "Change Map" below |
| MSG-02 | Diagnostic CTA describes concrete deliverable (e.g., "prioritized action brief") not just "free 45-min call" | Audit found 13 instances of "diagnostic/45-min" across translation files + 4 component references to `common.cta`; all locations mapped |
| MSG-03 | Services page addresses why solo consultant vs platforms (Toptal, Clutch) with explicit positioning content | Services page currently has 4 sections (offerings, process, FAQ, CTA); positioning section must be added as new component between FAQ and CTA |
</phase_requirements>

## Standard Stack

### Core (no changes needed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next-intl | existing | Bilingual string management | Already configured; all copy lives in `messages/es.json` and `messages/en.json` |
| Next.js 16 | existing | App Router, Server Components | Existing infrastructure handles all rendering |
| Tailwind CSS 4 | existing | Styling for any new sections | Design tokens already defined in `globals.css` |

### Supporting
No new libraries needed. Zero npm installs for this phase. This aligns with the project decision: "Zero new npm packages for v1.1."

### Alternatives Considered
None applicable -- this is a copy/content phase, not a technology decision.

## Architecture Patterns

### Translation File Structure (existing pattern)
All user-visible strings live in `messages/es.json` and `messages/en.json`. Components consume them via `getTranslations()` (Server Components) or `useTranslations()` (Client Components). This phase modifies existing keys and adds new keys within the established JSON structure.

### Component Pattern for New Sections
The services page follows a clear pattern: each section is a standalone Server Component in `src/components/services/`, imported and wrapped in `<ScrollReveal>` in the page file. Any new positioning section follows this same pattern.

```
src/components/services/
  offerings-section.tsx    # existing
  process-section.tsx      # existing
  faq-section.tsx          # existing
  positioning-section.tsx  # NEW for MSG-03
  services-cta.tsx         # existing
```

### CTA Reference Pattern
The global CTA button text lives at `common.cta` and is referenced in 4 places:
1. `src/components/home/hero-section.tsx` -- `tCommon('cta')`
2. `src/components/home/cta-band.tsx` -- `tCommon('cta')`
3. `src/app/[locale]/bio/page.tsx` -- `tCommon('cta')`
4. `src/components/services/services-cta.tsx` -- `tCommon('cta')`

Changing `common.cta` updates ALL CTA buttons site-wide in one edit. This is the primary lever for MSG-02.

### Anti-Patterns to Avoid
- **Hardcoding copy in components:** All text must go through translation files. Never put Spanish or English strings directly in TSX.
- **Changing component structure when only copy changes are needed:** Most of MSG-01 and MSG-02 are pure JSON edits. Do not refactor components unless the messaging requires new structural elements (MSG-03 does).
- **Forgetting to update both language files simultaneously:** Every key change must happen in both `es.json` and `en.json` in the same plan.

## Change Map: Full Audit of Affected Translation Keys

### MSG-01: LatAm Value Proposition Framing

Current copy mentions LatAm as a geographic label without explaining WHY local knowledge matters. The following keys need rewriting to frame LatAm expertise as a value proposition (regulatory knowledge, cultural context, timezone alignment, regional market dynamics):

| Translation Key | File Location | Current Issue |
|-----------------|---------------|---------------|
| `home.hero.subtitle` | Both | Says "in Latin America" as location, not value prop |
| `home.problem.subtitle` | Both | "in LatAm" as label |
| `home.problem.solution.description` | Both | Opportunity to add LatAm-specific value framing |
| `bio.hero.subtitle` | Both | "LatAm companies" without why |
| `bio.narrative.paragraphs.3` | Both | Best existing LatAm framing but lacks regulatory/cultural/timezone specifics |
| `bio.credentials.items.2` | Both | "50+ companies across LatAm" -- geographic, not value |
| `metadata.description` (root) | Both | "companies in LatAm" as label |
| `metadata.services.description` | Both | "for LatAm companies" as label |

**Key insight:** The bio page paragraph 3 (`bio.narrative.paragraphs.3`) is the closest existing content to a value proposition but only mentions "tight budgets, distributed talent, need to do more with less." It should be enriched with regulatory complexity (compliance, tax, labor law variations by country), cultural nuances (communication styles, decision-making patterns), and timezone advantage (real-time collaboration within the Americas).

### MSG-02: Concrete Diagnostic Deliverable

The CTA currently says "Agenda tu diagnostico de 45 min" / "Book your 45-min diagnostic" -- describes the *format* (a call) but not the *deliverable* (what the visitor walks away with). All diagnostic references need to describe a concrete output.

| Translation Key | Current Text (ES summary) | Change Needed |
|-----------------|---------------------------|---------------|
| `common.cta` | "Agenda tu diagnostico de 45 min" | Reframe around deliverable: e.g., "Recibe tu brief de accion personalizado" |
| `services.cta.title` | "Empieza con un diagnostico gratuito de 45 minutos" | Include deliverable name |
| `services.cta.subtitle` | Generic exploration language | Describe what they receive |
| `bio.cta.subtitle` | "llamada de diagnostico de 45 minutos" | Include deliverable |
| `home.ctaBand.subtitle` | "recibe un plan de accion personalizado" | Already partial -- strengthen |
| `home.process.steps.1.description` | Describes the call, not the output | Add deliverable mention |
| `home.process.steps.2.description` | "brief con prioridades" | Already good -- ensure consistency |
| `services.process.steps.1.description` | Describes the call format | Add what visitor receives |
| `metadata.contact.description` | "Agenda tu diagnostico" | Include deliverable |
| `services.faq.items.5.answer` | "insights valiosos" | More specific deliverable language |

**Deliverable naming convention:** The copy should name a specific deliverable consistently. Based on what the existing process steps already hint at ("brief con prioridades", "plan de accion"), the recommended term is:
- **ES:** "brief de accion priorizado" or "brief estrategico personalizado"
- **EN:** "prioritized action brief" or "personalized strategy brief"

This must be used consistently across all CTA touchpoints.

### MSG-03: Solo Consultant vs. Platform Positioning

Currently NO content on the services page (or anywhere) addresses why hiring M. Gripe directly is better than using Toptal, Clutch, or similar staffing platforms. This requires:

1. **New translation keys** under `services.positioning` namespace
2. **New component** `PositioningSection` (Server Component)
3. **Integration** in services page between FAQ and CTA sections

**Positioning arguments to cover:**
- Direct senior engagement (no account managers, no handoffs)
- LatAm-specific context (platforms match on skills, not market knowledge)
- Accountability to outcomes (not hourly billing, not interchangeable talent)
- Continuity (same person throughout, builds institutional knowledge)
- Speed (no matching/interviewing cycle, starts immediately)

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bilingual text management | Custom string interpolation | `next-intl` translation files | Already set up and working across all pages |
| Responsive text layout | Custom media queries for text | Tailwind responsive utilities | `text-base md:text-lg lg:text-xl` pattern used everywhere |
| New section component | Complex custom architecture | Copy existing Server Component pattern | `CaseStudiesSection` is the most recent template to follow |

## Common Pitfalls

### Pitfall 1: Spanish Text Overflow at 375px
**What goes wrong:** Spanish copy is typically 20-30% longer than English. After rewriting CTAs and adding value proposition language, the Spanish version may overflow containers or cause awkward line breaks on 375px mobile screens.
**Why it happens:** English is written first, fits perfectly, and Spanish is an afterthought.
**How to avoid:** Write Spanish copy FIRST (or simultaneously), then verify at 375px. The CTA button (`common.cta`) at 375px is the highest risk -- currently "Agenda tu diagnostico de 45 min" (37 chars) already tight. If the new CTA is longer, the button text may need to be shorter or the button styling needs `text-center` with wrapping.
**Warning signs:** Button text wrapping to 3+ lines, text truncation, horizontal scroll appearing.

### Pitfall 2: Inconsistent Deliverable Naming
**What goes wrong:** The diagnostic deliverable gets called different things in different places ("action brief" here, "strategy report" there, "plan de accion" elsewhere).
**Why it happens:** Copy is written in multiple passes, different keys modified at different times.
**How to avoid:** Define the deliverable name ONCE in both languages, then use that exact phrase everywhere. Create a reference table before writing any copy.
**Warning signs:** Searching the JSON for the deliverable name returns fewer hits than expected CTA locations.

### Pitfall 3: Breaking Existing FAQ Answers
**What goes wrong:** FAQ answers reference "diagnostico gratuito" and "45-minute call" in ways that must stay consistent with the new CTA language. Updating CTAs without updating FAQ creates contradictions.
**Why it happens:** FAQ text is deep in the JSON structure and easy to overlook.
**How to avoid:** Use the Change Map above to ensure ALL diagnostic references are updated, including FAQ items 1, 3, and 5.

### Pitfall 4: Positioning Section Feels Like an Attack
**What goes wrong:** Competitive positioning against Toptal/Clutch comes across as defensive or negative rather than confident.
**Why it happens:** Naming competitors directly can feel adversarial.
**How to avoid:** Frame as "what to consider when evaluating options" not "why competitors are bad." Use a comparison structure that highlights M. Gripe's advantages without disparaging alternatives. Consider using language like "plataformas de staffing" / "staffing platforms" rather than naming specific companies in the visible copy. Specific names (Toptal, Clutch) can appear in meta descriptions or be implied.

### Pitfall 5: Overwriting Bio LatAm Paragraph Tone
**What goes wrong:** The bio page paragraph 3 about LatAm currently has a warm, personal tone ("I chose to focus on Latin America because..."). Adding regulatory/compliance language can make it feel corporate.
**Why it happens:** Value proposition language tends toward business-speak.
**How to avoid:** Keep the personal framing but weave in concrete reasons. "I know firsthand the regulatory complexity across jurisdictions" still sounds personal if embedded in the existing narrative voice.

## Code Examples

### Pattern: Server Component Section (from existing CaseStudiesSection)
```typescript
// Source: src/components/home/case-studies-section.tsx
import { getTranslations } from 'next-intl/server';

export async function PositioningSection() {
  const t = await getTranslations('services.positioning');

  return (
    <section className="px-4 py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
          {t('title')}
        </h2>
        <p className="mt-4 text-base md:text-lg text-muted text-center max-w-3xl mx-auto">
          {t('subtitle')}
        </p>
        {/* Positioning content cards or comparison items */}
      </div>
    </section>
  );
}
```

### Pattern: Integration in Services Page
```typescript
// Source: src/app/[locale]/services/page.tsx (existing pattern)
import { PositioningSection } from '@/components/services/positioning-section';

// In return JSX, between FaqSection and ServicesCta:
<ScrollReveal delay={100}>
  <PositioningSection />
</ScrollReveal>
```

### Pattern: Translation Key Structure for Positioning
```json
{
  "services": {
    "positioning": {
      "title": "...",
      "subtitle": "...",
      "items": {
        "1": { "title": "...", "description": "..." },
        "2": { "title": "...", "description": "..." },
        "3": { "title": "...", "description": "..." }
      }
    }
  }
}
```

### Convention: Unaccented Spanish
Per project decision log: "Unaccented Spanish text maintained in translation files to match existing convention." All new Spanish copy MUST follow this -- no accented characters in translation JSON values.

Wait -- let me verify this. Checking the existing files...

**CORRECTION:** The existing translation files use a MIX. The privacy, consent, footer, and notFound sections use unaccented Spanish (e.g., "Politica de Privacidad", "pagina"). However, the main content sections (home, services, bio, contact) DO use accents (e.g., "Agenda tu diagnostico", "Consult**o**ria Tecnica").

Actually, looking more carefully: the services section DOES use accents (e.g., "Asesoría Técnica Estratégica", "diagnóstico"). The unaccented convention was established for Phase 8+ content only (privacy, consent, case studies used "desafio" not "desafio").

**Resolution:** The Phase 9 decision says "Unaccented Spanish text maintained in case study content per existing convention" and Phase 8 says "Unaccented Spanish text maintained in translation files to match existing convention." But the pre-existing v1.0 content (home, services, bio, contact) uses accented Spanish. Since Phase 10 MODIFIES existing v1.0 keys, follow the convention of the keys being modified. If editing `home.hero.subtitle`, match the accented style already there. If adding brand new keys (like `services.positioning`), follow the Phase 8/9 unaccented convention for consistency with recent additions.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| "45-min diagnostic call" CTA | Deliverable-focused CTA ("Get your prioritized action brief") | Phase 10 | Better conversion -- visitors understand what they receive |
| LatAm as geographic label | LatAm as value proposition (regulatory, cultural, timezone) | Phase 10 | Differentiates from generic consultants |
| No competitive positioning | Explicit solo consultant vs. platform comparison | Phase 10 | Addresses objection before it becomes a blocker |

## Detailed Change Scope

### Files Modified (no new files for MSG-01/MSG-02)
- `messages/es.json` -- modify ~15 translation keys
- `messages/en.json` -- modify ~15 translation keys (same keys)

### Files Created (MSG-03 only)
- `src/components/services/positioning-section.tsx` -- new Server Component
- Translation keys added to both JSON files under `services.positioning`

### Files Modified for Integration (MSG-03 only)
- `src/app/[locale]/services/page.tsx` -- import and render `PositioningSection`

### Files NOT Modified
- No component TSX files need changes for MSG-01 or MSG-02 (all changes are in translation JSON)
- No CSS/styling changes needed (existing design system handles everything)
- No routing changes
- No package.json changes

## Plan Recommendations

### Plan 10-01: LatAm Value Proposition + Diagnostic CTA Rewrite (MSG-01, MSG-02)
**Scope:** Modify translation keys in both `es.json` and `en.json`
**Work:**
1. Define the deliverable name in both languages (consistency reference)
2. Rewrite `common.cta` in both languages with deliverable focus
3. Rewrite all diagnostic CTA text (services CTA, bio CTA, home CTA band, home process step 1, services process step 1, FAQ items 1/3/5)
4. Rewrite LatAm references to frame as value proposition (home hero subtitle, home problem subtitle, bio narrative paragraph 3, bio credentials item 2, metadata descriptions)
5. Verify Spanish character count on CTA button text stays reasonable for 375px

**Risk:** LOW -- pure translation file edits, no component changes
**Estimated effort:** ~3 min (based on project velocity)

### Plan 10-02: Competitive Positioning Section + Mobile Verification (MSG-03)
**Scope:** New positioning section for services page + 375px verification
**Work:**
1. Add `services.positioning` keys to both translation files (title, subtitle, 3-4 comparison items)
2. Create `PositioningSection` Server Component following existing pattern
3. Integrate into services page between FAQ and CTA
4. Verify all Phase 10 changes render correctly at 375px in Spanish
5. Verify no layout breaks on the CTA buttons with new text

**Risk:** LOW -- follows established component pattern, one new section
**Estimated effort:** ~2 min

## Open Questions

1. **Exact deliverable name**
   - What we know: The process already mentions "brief" and "plan de accion" in various places
   - What's unclear: The exact branding of the diagnostic output (is it a "brief de accion priorizado"? "informe estrategico"? "hoja de ruta inicial"?)
   - Recommendation: Use "brief de accion priorizado" (ES) / "prioritized action brief" (EN) -- it's specific, tangible, and already hinted at in existing copy

2. **Whether to name competitors explicitly**
   - What we know: The requirement says "Toptal, Clutch, etc." in the success criteria
   - What's unclear: Whether to use these names in visible copy or just use "plataformas de staffing"
   - Recommendation: Use generic "staffing platforms" / "plataformas de staffing" in headings and body copy for longevity and professionalism; the concept is clear without naming names

## Sources

### Primary (HIGH confidence)
- Direct codebase audit: `messages/es.json`, `messages/en.json` (all translation keys)
- Direct codebase audit: All component files in `src/components/home/`, `src/components/services/`, `src/components/bio/`
- Project requirements: `.planning/REQUIREMENTS.md` (MSG-01, MSG-02, MSG-03 definitions)
- Project state: `.planning/STATE.md` (decision log, conventions)
- Project roadmap: `.planning/ROADMAP.md` (phase dependencies, success criteria)

### Secondary (MEDIUM confidence)
- Consulting positioning best practices (training knowledge): framing competitive differentiation as value comparison rather than competitor criticism

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new libraries, pure content phase
- Architecture: HIGH -- follows established Server Component + translation file pattern exactly
- Change scope: HIGH -- complete audit of all affected translation keys performed against actual source files
- Pitfalls: HIGH -- specific to this project's bilingual constraints and mobile requirements

**Research date:** 2026-02-28
**Valid until:** Indefinite (content/copy research, not library versions)
