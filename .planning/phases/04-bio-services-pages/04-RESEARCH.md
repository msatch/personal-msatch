# Phase 4: Bio & Services Pages - Research

**Researched:** 2026-02-21
**Domain:** Content page composition, bilingual consulting copy, outcome-based service card design, FAQ accordion patterns, Next.js Image placeholder strategy
**Confidence:** HIGH

## Summary

Phase 4 replaces the stub Bio and Services pages (created in Phase 2) with fully content-rich pages. The Bio page presents M. Gripe's professional narrative framed through client outcomes (not a resume), with a photo placeholder, credentials summary, and a social proof placeholder section. The Services page displays 4 outcome-based service cards (each with client problem, approach, and expected outcome), a detailed "How it works" process section, an FAQ section, and a CTA linking to the Contact page with entry offer messaging.

The technical implementation is straightforward -- both pages follow the exact same patterns established in Phase 3 (async Server Components, `getTranslations` from `next-intl/server`, Tailwind layout, next-intl `Link` for navigation). No new npm dependencies are required. The primary challenge is content architecture: structuring the translation JSON to support richer content blocks (multi-field service cards, FAQ question/answer pairs, credentials lists) while keeping the files maintainable. The secondary challenge is writing compelling bilingual copy that positions consulting services through client outcomes rather than features.

Both pages are content-heavy and static. Every section is a Server Component with zero client-side JavaScript. The FAQ section does NOT need an accordion/toggle behavior for v1 -- all questions can be visible by default (no JavaScript needed). If interactive accordion behavior is desired later, it can be added in Phase 6 polish. The photo placeholder uses a styled `<div>` with initials or an icon, not `next/image` with a dummy file, so it is easily replaceable with a real headshot later.

**Primary recommendation:** Build section components under `src/components/bio/` and `src/components/services/`, compose them in their respective page files, and structure all copy in translation JSON files under `bio.*` and `services.*` namespaces. Follow the established Phase 3 patterns exactly: async Server Components, indexed object keys for lists, `Link` for CTAs, consistent section spacing. Write Spanish copy first, then natural English copy.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| BIO-01 | Professional narrative framed through client outcomes, not CV-style | New `bio.narrative` namespace in translations. Structure as 2-3 paragraphs that describe M. Gripe's work through the lens of client results, not job titles. Server Component renders translated paragraphs with semantic HTML. |
| BIO-02 | Photo placeholder (replaceable with real headshot) | A styled `<div>` placeholder with initials "MG" on an accent background, sized appropriately (e.g., 200x200 rounded-full). When a real photo is available, replace with `next/image` `Image` component. No dummy image file needed. |
| BIO-03 | Credentials and experience summary relevant to LatAm market | New `bio.credentials` namespace with indexed items. Each credential: title + description (e.g., "15+ years in tech leadership", "Worked with 50+ LatAm companies"). Render as a compact list or grid. |
| BIO-04 | Social proof placeholder section (design accommodates future testimonials/logos) | New `bio.socialProof` namespace with placeholder structure. Render an empty-state section with a title and placeholder text/design that can be filled with real testimonials and logos later (TRUST-01, TRUST-02 in v2). |
| SERV-01 | 4 outcome-based service cards (Strategic Technical Advisory, Delivery Acceleration, Product & Business Alignment, Fractional Leadership Support) | New `services.offerings` namespace with 4 indexed items. Each has: title, problem, approach, outcome fields. Render as cards in a responsive grid. Service titles must match the 4 service lines from PROJECT.md and the home page preview. |
| SERV-02 | Each service card describes the client problem, approach, and expected outcome | Each service card in translations has 3 sub-fields: `problem`, `approach`, `outcome`. Cards render all three clearly with visual hierarchy (problem as "The challenge", approach as "How we address it", outcome as "What you get"). |
| SERV-03 | "How it works" detailed process section (3-5 steps) | New `services.process` namespace with 5 indexed steps (more detailed than the 3-step home page version). Steps describe the full engagement lifecycle: diagnostic call, assessment, action plan, execution, review. Reuse the numbered badge pattern from Phase 3. |
| SERV-04 | FAQ section addressing scope, timeline, pricing model, communication cadence | New `services.faq` namespace with 4-6 indexed question/answer pairs. Render as a simple list of Q&A blocks (no accordion needed for v1). Topics: scope of engagement, typical timeline, pricing model, communication cadence, what happens after the diagnostic, industries served. |
| SERV-05 | CTA linking to contact page with entry offer messaging | Reuse the CTA band pattern from Phase 3 (`bg-foreground` background, white text, `Link` to `/contact`). The messaging emphasizes the entry offer: "45-minute diagnostic call." Create a reusable CTA band component or import from `components/home/cta-band.tsx` if messaging can be parameterized, or create a services-specific variant. |
| COPY-04 | Entry offer messaging throughout site ("45-minute diagnostic call") | The "45-minute diagnostic call" messaging appears in: Services page CTA band, Bio page CTA, and references within service card outcomes. Uses existing `common.cta` translation key for button text. Additional entry offer copy in section context (e.g., "Start with a free 45-minute diagnostic call"). |
</phase_requirements>

## Standard Stack

### Core (already installed -- no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.x | App Router, Server Components, `generateStaticParams` for static generation | Both pages are Server Components. No client interactivity needed. Identical pattern to Phase 3. |
| React | 19.2.x | JSX composition | Standard React component patterns. No hooks needed for static content pages. |
| Tailwind CSS | 4.1.x | Page layouts, card styling, responsive grid, typography | All design tokens already defined. Uses existing color, spacing, and typography utilities. |
| next-intl | 4.8.x | `getTranslations` for Server Components, `Link` for locale-aware navigation | Server-side translations. `Link` for CTA buttons and internal navigation. |
| clsx + tailwind-merge | 2.1.x / 3.4.x | `cn()` utility for conditional class names | Already available from Phase 1. |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none) | -- | -- | No new dependencies needed for Phase 4 |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Static FAQ (all visible) | Radix Accordion or Headless UI Disclosure | Adds a client-side dependency and `'use client'` for a section with 4-6 items. Overkill for v1. All questions visible is acceptable for a short FAQ. Add accordion in Phase 6 if needed. |
| Styled `<div>` photo placeholder | `next/image` with a placeholder image file | `next/image` needs an actual image file. A styled div is simpler to replace later with a real headshot. No image optimization needed for a placeholder. |
| Separate CTA band per page | Shared parameterized CTA band component | Could extract a shared CTA band, but the messaging differs between pages (home vs. services vs. bio). Simpler to have page-specific CTA sections that follow the same visual pattern. Component reuse can be refactored later if needed. |
| Anchor links to individual services (e.g., `/services#advisory`) | Service cards on separate routes | Individual service pages are overkill for 4 services. A single page with anchor-scrollable sections or a full card display is the standard approach for consulting sites with few offerings. |

**Installation:**
```bash
# No new packages needed. Everything is in place from Phase 1.
```

## Architecture Patterns

### Recommended Project Structure (Phase 4 additions)

```
src/
├── app/
│   └── [locale]/
│       ├── bio/
│       │   └── page.tsx                    # MODIFY: Replace stub with section composition
│       └── services/
│           └── page.tsx                    # MODIFY: Replace stub with section composition
├── components/
│   ├── bio/
│   │   ├── narrative-section.tsx           # NEW: Professional narrative (BIO-01)
│   │   ├── photo-credentials.tsx          # NEW: Photo placeholder + credentials (BIO-02, BIO-03)
│   │   └── social-proof-section.tsx       # NEW: Social proof placeholder (BIO-04)
│   └── services/
│       ├── offerings-section.tsx           # NEW: 4 service cards (SERV-01, SERV-02)
│       ├── process-section.tsx            # NEW: Detailed "How it works" (SERV-03)
│       ├── faq-section.tsx                # NEW: FAQ Q&A list (SERV-04)
│       └── services-cta.tsx               # NEW: Services page CTA (SERV-05, COPY-04)
messages/
├── es.json                                 # MODIFY: Add bio.* and services.* namespaces
└── en.json                                 # MODIFY: Same structure in English
```

### Pattern 1: Page Stub Replacement

**What:** Replace the existing stub page (placeholder heading + "Content coming soon") with a full page that composes multiple section components.
**When to use:** Both bio/page.tsx and services/page.tsx.

```typescript
// src/app/[locale]/bio/page.tsx (replacing stub)
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { NarrativeSection } from '@/components/bio/narrative-section';
import { PhotoCredentials } from '@/components/bio/photo-credentials';
import { SocialProofSection } from '@/components/bio/social-proof-section';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function BioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PhotoCredentials />
      <NarrativeSection />
      <SocialProofSection />
    </>
  );
}
```

**Key points:**
- Same pattern as Phase 3 home page: `setRequestLocale`, `generateStaticParams`, fragment wrapper, imported section components.
- Remove the old stub content (h1 + placeholder paragraph).
- Each section is a self-contained async Server Component.

### Pattern 2: Rich Service Card with Three Sub-Fields

**What:** A service card that displays the client problem, M. Gripe's approach, and the expected outcome. Each sub-field has its own visual treatment.
**When to use:** SERV-01 and SERV-02 -- the 4 service offering cards.

```typescript
// Inside offerings-section.tsx
{['1', '2', '3', '4'].map((id) => (
  <div
    key={id}
    className="p-6 md:p-8 rounded-lg border border-border bg-background"
  >
    <h3 className="text-xl font-bold">
      {t(`offerings.${id}.title`)}
    </h3>
    <div className="mt-4 space-y-4">
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">
          {t('labels.problem')}
        </h4>
        <p className="mt-1 text-foreground">
          {t(`offerings.${id}.problem`)}
        </p>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted">
          {t('labels.approach')}
        </h4>
        <p className="mt-1 text-foreground">
          {t(`offerings.${id}.approach`)}
        </p>
      </div>
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-accent">
          {t('labels.outcome')}
        </h4>
        <p className="mt-1 font-medium text-foreground">
          {t(`offerings.${id}.outcome`)}
        </p>
      </div>
    </div>
  </div>
))}
```

**Key points:**
- Each card has a clear visual hierarchy: title (bold), then 3 labeled sub-sections.
- The "outcome" label uses `text-accent` to visually distinguish results from process.
- Labels ("The challenge", "Approach", "Expected outcome") are themselves translated via `t('labels.problem')` etc.
- Cards use a 2-column grid on desktop (`md:grid-cols-2`), stacking on mobile.

### Pattern 3: FAQ as Static Q&A List (No Accordion)

**What:** A simple list of question/answer pairs rendered as static HTML. No JavaScript toggle needed.
**When to use:** SERV-04 FAQ section.

```typescript
// Inside faq-section.tsx
{['1', '2', '3', '4', '5', '6'].map((id) => (
  <div key={id} className="border-b border-border pb-6">
    <h3 className="text-lg font-bold">
      {t(`items.${id}.question`)}
    </h3>
    <p className="mt-2 text-muted leading-relaxed">
      {t(`items.${id}.answer`)}
    </p>
  </div>
))}
```

**Key points:**
- All Q&A pairs are visible by default -- no toggle, no JavaScript.
- `border-b` separates items visually without needing card containers.
- For v1 with 4-6 questions, this is adequate. An interactive accordion can be added in Phase 6 if the list grows or UX testing suggests it.
- This keeps the component as a Server Component (no `'use client'`).

### Pattern 4: Photo Placeholder with Initials

**What:** A styled circular placeholder where the real headshot will go. Shows initials "MG" on an accent-tinted background.
**When to use:** BIO-02 photo placeholder.

```typescript
// Inside photo-credentials.tsx
<div className="flex-shrink-0 w-40 h-40 md:w-48 md:h-48 rounded-full bg-accent-light flex items-center justify-center">
  <span className="text-4xl md:text-5xl font-bold text-accent">
    MG
  </span>
</div>
```

**Key points:**
- Uses `bg-accent-light` (defined in design tokens: `oklch(0.92 0.05 250)`) for a subtle, on-brand background.
- Initials "MG" in `text-accent` for consistency.
- When a real photo is available, replace this `<div>` with `<Image src="/images/headshot.jpg" alt="M. Gripe" width={192} height={192} className="rounded-full" />`.
- Size is generous (160-192px) for visual impact on a bio page.

### Pattern 5: Social Proof Placeholder

**What:** A section that establishes the visual space for future testimonials and client logos, with a placeholder state for launch.
**When to use:** BIO-04 social proof placeholder.

```typescript
// Inside social-proof-section.tsx
<section className="bg-muted/30 px-4 py-16 md:py-20">
  <div className="mx-auto max-w-4xl text-center">
    <h2 className="text-2xl md:text-3xl font-bold">
      {t('title')}
    </h2>
    <p className="mt-4 text-muted">
      {t('subtitle')}
    </p>
    {/* Placeholder: future testimonials will go here */}
    <div className="mt-8 text-sm text-muted-foreground italic">
      {t('comingSoon')}
    </div>
  </div>
</section>
```

**Key points:**
- The section exists in the layout, establishing the visual pattern.
- A "coming soon" or subtle placeholder text signals that content is forthcoming.
- When real testimonials arrive (TRUST-01 in v2), the placeholder text is replaced with testimonial cards.
- Uses `bg-muted/30` for subtle background differentiation (established pattern from Phase 3 services-preview).

### Pattern 6: CTA Band Variant for Services Page

**What:** A CTA band at the bottom of the Services page with entry offer messaging, following the same visual pattern as the home page CTA band.
**When to use:** SERV-05 and COPY-04.

```typescript
// src/components/services/services-cta.tsx
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function ServicesCta() {
  const t = await getTranslations('services.cta');
  const tCommon = await getTranslations('common');

  return (
    <section className="bg-foreground px-4 py-16 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
          {t('title')}
        </h2>
        <p className="mt-4 text-base md:text-lg text-white/80">
          {t('subtitle')}
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block px-8 py-4 bg-accent text-white font-bold rounded-lg hover:bg-accent-dark transition-colors text-base md:text-lg"
        >
          {tCommon('cta')}
        </Link>
      </div>
    </section>
  );
}
```

**Key points:**
- Same visual pattern as home page CTA band: `bg-foreground`, white text, accent CTA button.
- Different copy: services-specific messaging emphasizing the entry offer.
- Uses its own translation namespace `services.cta` so messaging can be tailored.
- The button text uses `common.cta` for consistency across all CTAs site-wide.

### Anti-Patterns to Avoid

- **Writing a CV/resume for the Bio page:** BIO-01 explicitly says "framed through client outcomes, not CV-style." Do not list job titles and companies. Instead, describe expertise through the lens of what clients achieved. "I helped 50+ LatAm companies accelerate delivery" not "VP Engineering at Company X, 2018-2022."
- **Adding client-side JavaScript for FAQ accordion:** For 4-6 questions, a static list is fine. Adding `'use client'` and state management for toggle behavior is unnecessary complexity. Save it for Phase 6 polish if needed.
- **Using `next/image` for the photo placeholder:** There is no real image file yet. `next/image` requires an actual file or external URL. A styled `<div>` placeholder is simpler and more explicit about being a placeholder.
- **Creating separate routes for each service:** 4 services do not need 4 separate pages. A single `/services` page with all cards is standard for consulting sites with limited service lines. Separate pages would create thin content and unnecessary navigation complexity.
- **Duplicating the home page service previews on the Services page:** The home page has brief preview cards. The Services page should have expanded cards with problem/approach/outcome. Do NOT copy-paste the home page cards. The Services page content is deeper and more detailed.
- **Hardcoding the "45-minute diagnostic" text:** COPY-04 says this messaging appears throughout the site. Use translation keys, not hardcoded strings. The `common.cta` key already contains this. Additional entry offer references should also be translated.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Locale-aware CTA links | Manual `href="/es/contact"` | next-intl `Link` from `@/i18n/navigation` | Locale prefix handled automatically. Consistent with all existing links. |
| Responsive card grids | Custom flexbox with breakpoint logic | Tailwind `grid grid-cols-1 md:grid-cols-2 gap-6` | One utility class. Established pattern from Phase 3. |
| FAQ toggle/accordion | Custom state management + CSS transitions | Static Q&A list for v1 (no JS needed) | For 4-6 items, all-visible is fine. Interactive version can use `<details>/<summary>` HTML elements (zero JS) or Radix Accordion later. |
| Photo placeholder | A grey box with no meaning | Styled `<div>` with initials on accent background | Looks intentional, communicates the brand, trivially replaceable with `next/image` later. |
| Translation key iteration | Manual copy-paste of repeated JSX | `['1','2','3','4'].map(id => ...)` with `t(\`offerings.${id}.title\`)` | DRY pattern established in Phase 3. Easy to add/remove items via translation JSON. |
| Entry offer messaging consistency | Different wording on each page | `common.cta` for button text; page-specific `*.cta.title/subtitle` for context | Single source of truth for the button label. Page-specific copy for surrounding context. |

**Key insight:** This phase is 80% content and 20% code, just like Phase 3. The component patterns, layout approach, and translation structure are all established. The primary work is writing compelling bilingual copy for two content-heavy pages.

## Common Pitfalls

### Pitfall 1: Bio Page Reads Like a Resume

**What goes wrong:** The bio page lists job titles, companies, and dates instead of client-relevant outcomes.
**Why it happens:** Defaulting to the familiar resume format when describing professional background.
**How to avoid:** Frame every credential through client impact. Instead of "10 years as VP Engineering," write "Over 10 years leading engineering teams, I've helped companies reduce delivery cycles by 40% and align technical execution with business goals." The reader should think "this person can help me" not "this person has an impressive resume."
**Warning signs:** Job titles, company names, or dates appear prominently. The narrative is chronological. The word "I" appears more than "you" or "your."

### Pitfall 2: Service Cards Are Feature Lists Instead of Outcome Stories

**What goes wrong:** Each service card reads "We do X, Y, Z" instead of "Your problem is A, we address it through B, and you get C."
**Why it happens:** Describing services from the provider's perspective rather than the client's perspective.
**How to avoid:** Each card has three mandatory sections: Problem (what the client is struggling with), Approach (how M. Gripe addresses it), Outcome (what the client gets). The problem comes first because clients recognize their pain before they evaluate solutions.
**Warning signs:** Cards start with "We offer" or "Our service includes." No mention of client pain points. Outcomes are vague ("improved results" instead of "30% faster delivery cycles").

### Pitfall 3: Translation Key Structure Mismatch Between es.json and en.json

**What goes wrong:** Runtime "MISSING_MESSAGE" errors because keys exist in one language file but not the other.
**Why it happens:** Adding content to es.json first and forgetting to add the parallel structure to en.json (or vice versa).
**How to avoid:** Define the full JSON structure for BOTH files at the same time. Write Spanish content first (primary market), then immediately write the English equivalent in the same session. Use the same key paths. Validate both files parse as valid JSON after editing.
**Warning signs:** Yellow console warnings from next-intl. Text renders as raw key paths on one language version but works on the other.

### Pitfall 4: Inconsistent Section Spacing with Phase 3 Home Page

**What goes wrong:** Bio and Services pages feel visually different from the Home page -- different spacing, different max-widths, different heading sizes.
**Why it happens:** Building new page sections without referencing the established spacing conventions from Phase 3.
**How to avoid:** Follow the exact same section spacing convention:
- Outer: `<section className="px-4 py-16 md:py-20 lg:py-24">`
- Inner: `<div className="mx-auto max-w-6xl">` (or `max-w-4xl` for text-heavy content)
- Section titles: `text-2xl md:text-3xl lg:text-4xl font-bold`
- Section subtitles: `mt-4 text-base md:text-lg text-muted`
**Warning signs:** Heading sizes differ between pages. Sections on Bio/Services feel tighter or more spacious than Home page sections.

### Pitfall 5: Services Page "How it Works" Conflicts with Home Page Version

**What goes wrong:** Two "How it works" sections with different content confuse users or create inconsistency.
**Why it happens:** The Home page (Phase 3) has a 3-step process section. The Services page (Phase 4) also requires a process section per SERV-03.
**How to avoid:** The Services page process section should be an expanded, more detailed version of the Home page version. The Home page shows the high-level flow (3 steps: diagnose, plan, execute). The Services page shows the detailed engagement lifecycle (5 steps: diagnostic call, deep assessment, action plan delivery, execution with support, periodic review). Different content, same visual pattern. Use different translation namespaces (`home.process` vs. `services.process`).
**Warning signs:** Same exact 3 steps appearing on both pages. Or wildly different visual treatment between the two versions.

### Pitfall 6: FAQ Answers Are Too Short or Too Long

**What goes wrong:** FAQ answers are either one-liners that don't satisfy the question, or multi-paragraph essays that overwhelm the reader.
**Why it happens:** No guideline for FAQ answer length.
**How to avoid:** Each FAQ answer should be 2-3 sentences. Enough to address the question substantively, short enough to scan. If an answer needs more detail, it should link to another section or page. Topics per SERV-04: scope of engagement, typical timeline, pricing model (value-based, not hourly rate), communication cadence (weekly syncs, async updates), and what happens after the diagnostic call.
**Warning signs:** Answers that are one sentence or more than 5 sentences.

### Pitfall 7: Entry Offer Messaging Inconsistency (COPY-04)

**What goes wrong:** Different pages describe the entry offer differently -- "free consultation" on one, "45-minute diagnostic" on another, "strategy call" on a third.
**Why it happens:** Writing copy for each page independently without checking what other pages say.
**How to avoid:** The canonical entry offer is "45-minute diagnostic call" (EN) / "diagnostico de 45 minutos" (ES). The CTA button text is already defined in `common.cta`. All contextual references should use consistent language. Variations in surrounding copy are fine ("Start with a free diagnostic" vs. "Your next step: a 45-minute diagnostic"), but the offer itself should always be "45-minute diagnostic."
**Warning signs:** "Free consultation," "strategy call," "introductory meeting" appearing in copy where "45-minute diagnostic" should be.

## Code Examples

Verified patterns from project codebase and official sources:

### Translation JSON Structure for Bio Page

```json
// messages/es.json - bio namespace (new for Phase 4)
{
  "bio": {
    "pageTitle": "Sobre M. Gripe",
    "narrative": {
      "title": "[Section heading]",
      "paragraphs": {
        "1": "[First paragraph - outcome-framed introduction]",
        "2": "[Second paragraph - expertise and approach]",
        "3": "[Third paragraph - why LatAm, why this work]"
      }
    },
    "credentials": {
      "title": "[Credentials heading]",
      "items": {
        "1": { "title": "[Credential 1]", "description": "[Brief explanation]" },
        "2": { "title": "[Credential 2]", "description": "[Brief explanation]" },
        "3": { "title": "[Credential 3]", "description": "[Brief explanation]" },
        "4": { "title": "[Credential 4]", "description": "[Brief explanation]" }
      }
    },
    "socialProof": {
      "title": "[Social proof heading]",
      "subtitle": "[Placeholder subtitle]",
      "comingSoon": "[Placeholder text for future testimonials]"
    },
    "cta": {
      "title": "[Bio page CTA heading with entry offer reference]",
      "subtitle": "[Supporting text]"
    }
  }
}
```

### Translation JSON Structure for Services Page

```json
// messages/es.json - services namespace (new for Phase 4, replacing pages.services stub)
{
  "services": {
    "pageTitle": "Servicios",
    "hero": {
      "title": "[Services page headline]",
      "subtitle": "[Brief positioning statement]"
    },
    "labels": {
      "problem": "[The challenge]",
      "approach": "[Approach]",
      "outcome": "[Expected outcome]"
    },
    "offerings": {
      "1": {
        "title": "Asesoria Tecnica Estrategica",
        "problem": "[Client pain this service addresses]",
        "approach": "[How M. Gripe addresses it]",
        "outcome": "[What the client gets]"
      },
      "2": {
        "title": "Aceleracion de Delivery",
        "problem": "[...]",
        "approach": "[...]",
        "outcome": "[...]"
      },
      "3": {
        "title": "Alineacion de Producto y Negocio",
        "problem": "[...]",
        "approach": "[...]",
        "outcome": "[...]"
      },
      "4": {
        "title": "Liderazgo Fraccional",
        "problem": "[...]",
        "approach": "[...]",
        "outcome": "[...]"
      }
    },
    "process": {
      "title": "[Detailed process heading]",
      "subtitle": "[Process intro]",
      "steps": {
        "1": { "title": "[Step 1]", "description": "[Detail]" },
        "2": { "title": "[Step 2]", "description": "[Detail]" },
        "3": { "title": "[Step 3]", "description": "[Detail]" },
        "4": { "title": "[Step 4]", "description": "[Detail]" },
        "5": { "title": "[Step 5]", "description": "[Detail]" }
      }
    },
    "faq": {
      "title": "[FAQ heading]",
      "items": {
        "1": { "question": "[Q about scope]", "answer": "[A]" },
        "2": { "question": "[Q about timeline]", "answer": "[A]" },
        "3": { "question": "[Q about pricing model]", "answer": "[A]" },
        "4": { "question": "[Q about communication]", "answer": "[A]" },
        "5": { "question": "[Q about after diagnostic]", "answer": "[A]" },
        "6": { "question": "[Q about industries]", "answer": "[A]" }
      }
    },
    "cta": {
      "title": "[Services CTA heading with entry offer]",
      "subtitle": "[Supporting text about the 45-min diagnostic]"
    }
  }
}
```

### Bio Page Composition

```typescript
// src/app/[locale]/bio/page.tsx
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { PhotoCredentials } from '@/components/bio/photo-credentials';
import { NarrativeSection } from '@/components/bio/narrative-section';
import { SocialProofSection } from '@/components/bio/social-proof-section';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function BioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PhotoCredentials />
      <NarrativeSection />
      <SocialProofSection />
    </>
  );
}
```

### Services Page Composition

```typescript
// src/app/[locale]/services/page.tsx
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { OfferingsSection } from '@/components/services/offerings-section';
import { ProcessSection } from '@/components/services/process-section';
import { FaqSection } from '@/components/services/faq-section';
import { ServicesCta } from '@/components/services/services-cta';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <OfferingsSection />
      <ProcessSection />
      <FaqSection />
      <ServicesCta />
    </>
  );
}
```

### Section Spacing Convention (Reference)

```typescript
// Standard section: white background
<section className="px-4 py-16 md:py-20 lg:py-24">
  <div className="mx-auto max-w-6xl">
    {/* Content */}
  </div>
</section>

// Text-heavy section: narrower
<section className="px-4 py-16 md:py-20 lg:py-24">
  <div className="mx-auto max-w-4xl">
    {/* Content */}
  </div>
</section>

// Alternating background section
<section className="bg-muted/30 px-4 py-16 md:py-20 lg:py-24">
  <div className="mx-auto max-w-6xl">
    {/* Content */}
  </div>
</section>

// CTA band: dark background
<section className="bg-foreground px-4 py-16 md:py-20">
  <div className="mx-auto max-w-3xl text-center">
    {/* CTA content */}
  </div>
</section>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| FAQ as interactive accordion (JS-dependent) | Static Q&A list for short FAQs, `<details>/<summary>` for zero-JS toggle if needed | HTML5 native elements | No JS bundle cost. Accessible by default. Server Component compatible. |
| Placeholder images via dummy files | Styled div placeholders with initials/icons | Modern web practice | No image files to manage. Explicit placeholder intent. Trivially replaceable. |
| Feature-based service descriptions | Outcome-based service cards (problem/approach/outcome) | Consulting UX best practice | Client-centered framing increases conversion. Mirrors how buyers evaluate consulting services. |
| `useTranslations` with `'use client'` for all pages | `getTranslations` from `next-intl/server` for static pages | next-intl 3.x+ (2024) | Zero client JS for content pages. Better LCP. Smaller bundle. |

**Deprecated/outdated:**
- Using `useTranslations` in Server Components: Use `getTranslations` from `next-intl/server` (async, server-only)
- Accordion components for short FAQs: Static rendering or native `<details>` is simpler and more accessible
- Placeholder image files (grey squares): Styled divs with meaningful content are better UX

## Open Questions

1. **Bio narrative content depth**
   - What we know: BIO-01 requires "professional narrative framed through client outcomes." PROJECT.md provides positioning, ICP, and service lines. The brand voice is defined (COPY-03).
   - What's unclear: How much biographical detail to include. The narrative should not be a CV, but some career context builds credibility.
   - Recommendation: 2-3 paragraphs total. First paragraph: what M. Gripe does and for whom (outcome-framed). Second paragraph: the expertise and approach (why this works). Third paragraph: the LatAm connection and personal motivation. Keep it concise -- the Bio page is a trust signal, not a memoir.

2. **Number of credentials items (BIO-03)**
   - What we know: Credentials should be "relevant to LatAm market." No specific credential list is provided.
   - What's unclear: Exact credentials to display.
   - Recommendation: 4-5 credential items that emphasize LatAm relevance, technical depth, and business impact. Examples: years of experience, number of companies helped, languages spoken, technical domains covered, geographic focus. These can be refined by the owner after launch.

3. **Whether Bio page needs its own CTA band**
   - What we know: SERV-05 specifies a CTA on the Services page. BIO requirements do not explicitly mention a CTA.
   - What's unclear: Whether the Bio page should also end with a CTA.
   - Recommendation: Yes, add a CTA section at the bottom of the Bio page as well. Every page should guide the visitor toward contact. The Bio page CTA can be softer ("Want to discuss how I can help your team?" vs. the Services page's more direct "Start with a 45-minute diagnostic"). This also satisfies COPY-04 (entry offer messaging throughout site).

4. **Services page hero section**
   - What we know: The services page needs a heading and context-setting intro before the service cards.
   - What's unclear: Whether this needs to be a full "hero" section or just a page heading.
   - Recommendation: A simple page header section (not a full hero with CTA). Title + subtitle paragraph that positions the services collectively. This sets context before the detailed cards. Much lighter than the home page hero.

5. **Translation namespace organization: `services.*` vs. `pages.services.*`**
   - What we know: The current stub uses `pages.services` namespace. Phase 3 home page uses `home.*` (top-level namespace, not `pages.home`).
   - What's unclear: Whether to nest under `pages.services` or use top-level `services.*`.
   - Recommendation: Use top-level `services.*` and `bio.*` namespaces, consistent with the `home.*` pattern from Phase 3. Remove or keep the `pages.services` and `pages.bio` stub keys (they can be cleaned up). The top-level namespace is cleaner and matches the component directory structure.

## Sources

### Primary (HIGH confidence)
- Project codebase: `src/app/[locale]/bio/page.tsx`, `src/app/[locale]/services/page.tsx` (existing stubs), `src/components/home/*` (established patterns), `messages/es.json`, `messages/en.json` -- component patterns, translation structure, design conventions
- Phase 3 Research: `.planning/phases/03-home-page/03-RESEARCH.md` -- Server Component patterns, translation namespace structure, section spacing conventions, anti-patterns
- Phase 3 Plans: `.planning/phases/03-home-page/03-01-PLAN.md`, `03-02-PLAN.md` -- task structure, copy guidelines, verification patterns
- REQUIREMENTS.md: BIO-01 through BIO-04, SERV-01 through SERV-05, COPY-04 -- exact specifications
- PROJECT.md: Brand positioning, ICP, service lines, entry offer, brand voice -- content source for copy generation
- STATE.md: Phase 3 complete, established decisions and conventions

### Secondary (MEDIUM confidence)
- Consulting website UX best practices: outcome-based service framing (problem/approach/outcome) is standard for professional services sites
- HTML5 `<details>/<summary>` for accessible, zero-JS FAQ toggles: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
- next-intl Server Components: https://next-intl.dev/docs/environments/server-client-components -- verified pattern from Phase 1/3

### Tertiary (LOW confidence)
- None -- all findings verified with primary project sources and established codebase patterns.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- No new dependencies. All tools already installed and verified in Phases 1-3. Same Server Component patterns throughout.
- Architecture: HIGH -- Component composition, page structure, translation namespaces all follow established Phase 3 patterns. No novel technical challenges.
- Pitfalls: HIGH -- Pitfalls drawn from Phase 3 experience (translation key mismatches, spacing conventions), content strategy best practices (outcome-framing), and COPY-04 consistency requirements.
- Copy/Content: MEDIUM -- The copy guidelines are clear, but the actual copy for 2 content-heavy pages needs to be written. This is the largest effort in the phase and quality depends on execution.

**Research date:** 2026-02-21
**Valid until:** 2026-03-21 (stable ecosystem, 30-day validity)
