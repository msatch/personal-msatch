# Phase 3: Home Page - Research

**Researched:** 2026-02-19
**Domain:** Landing page component composition, bilingual copywriting for consulting sites, next-intl structured translations, Tailwind CSS section layout patterns
**Confidence:** HIGH

## Summary

Phase 3 transforms the existing minimal home page (hero-only placeholder from Phase 2) into a full conversion-oriented landing page with five distinct sections: Hero, Problem/Solution, Services Preview, How It Works, and CTA Band. The implementation is entirely within the existing stack -- Next.js 16 App Router, Tailwind CSS 4, and next-intl 4.x. No new npm dependencies are needed.

The core challenge is NOT technical -- it is content architecture. The page must communicate M. Gripe's value proposition to LatAm founders and managers in under 60 seconds, with copy that reads naturally in both Spanish and English. The translation file structure must support rich, multi-paragraph content sections while remaining maintainable. Each section is a Server Component (no client-side interactivity needed beyond the existing header), and the CTA button links to the Contact page using next-intl's `Link` component. The services preview cards link to the Services page (`/services`), which currently exists as a stub page from Phase 2.

The home page is a single `page.tsx` file that composes 5 section components. Each section pulls translations from a nested namespace under `home.*`. The brand voice is defined in COPY-03: clear, direct, strategic, senior but approachable, results-oriented. Spanish copy uses neutral-warm Mexican Spanish base with conversational connectors (COPY-01). English copy matches the Spanish content and voice (COPY-02).

**Primary recommendation:** Build 5 section components under `src/components/home/`, compose them in `[locale]/page.tsx`, and structure all copy in translation JSON files under `home.hero`, `home.problem`, `home.services`, `home.process`, and `home.ctaBand` namespaces. Use Server Components throughout (no `'use client'` needed). The CTA button should be a reusable `Link`-based component pointing to `/contact`. Services preview cards use the 4 service lines from SERV-01 as preview items, linking to `/services`.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HOME-01 | Hero section with clear value proposition headline and subheadline in Spanish/English | Expand existing `home.hero.title` and `home.hero.subtitle` translations. Server Component with responsive typography (`text-3xl md:text-5xl lg:text-6xl`). Current placeholder hero already works; enhance with better copy and layout. |
| HOME-02 | Primary CTA button in hero ("Book your 45-min diagnostic" / "Agenda tu diagnostico de 45 min") | Already exists as `common.cta` translation key. Wrap in next-intl `Link` pointing to `/contact`. Style as prominent button with `bg-accent text-white`. |
| HOME-03 | Problem/solution section mirroring LatAm pain points | New section component + new translation namespace `home.problem`. Content: 3-4 pain points (slow delivery, misaligned teams, weak planning, lack of senior guidance) paired with M. Gripe's approach. Two-column layout on desktop, stacked on mobile. |
| HOME-04 | Services preview cards linking to Services page | New section component + `home.services` namespace. 4 cards matching SERV-01 service lines (Strategic Technical Advisory, Delivery Acceleration, Product & Business Alignment, Fractional Leadership Support). Each card: title + one-line description + link to `/services`. Responsive grid (`grid-cols-1 md:grid-cols-2`). |
| HOME-05 | "How it works" summary (3-5 steps) | New section component + `home.process` namespace. 3-4 numbered steps describing the engagement process. Visual: numbered badges or step indicators with titles and descriptions. |
| HOME-06 | CTA band section repeating primary CTA | New section component + `home.ctaBand` namespace. Full-width band with accent background color, headline text, and the same CTA button linking to `/contact`. Uses `common.cta` for the button text. |
| COPY-01 | Generated Spanish copy in neutral-warm tone (Mexican Spanish base, conversational connectors) | Translation file `messages/es.json` expanded with all home page section content. Tone: professional but warm, "tu" form (not "usted"), connectors like "es decir", "por ejemplo", "en otras palabras". Avoid region-specific slang. |
| COPY-02 | Generated English copy matching Spanish content and brand voice | Translation file `messages/en.json` expanded with matching content. Same structure, parallel meaning, natural English phrasing (not literal translation). |
| COPY-03 | Brand voice: clear, direct, strategic, senior but approachable, results-oriented | Applied across all copy. Short sentences. Active voice. Outcome-focused language ("deliver", "accelerate", "align", "measure"). Avoid jargon, buzzwords, and vague promises. |
</phase_requirements>

## Standard Stack

### Core (already installed -- no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.x | App Router, Server Components for all page sections, `generateStaticParams` for static generation | All home page sections are Server Components. No client interactivity needed beyond existing header. |
| React | 19.2.x | JSX composition, component tree | Standard React component patterns. No hooks needed for static content sections. |
| Tailwind CSS | 4.1.x | Section layouts, responsive grid, typography, spacing, accent color backgrounds | All design tokens already defined in Phase 1. Uses `max-w-6xl`, responsive grid, text utilities, background colors. |
| next-intl | 4.8.x | `getTranslations` for Server Components, structured namespaces, `Link` for locale-aware navigation | Server-side translations via `getTranslations('home.hero')` etc. `Link` for CTA and service card links. |
| clsx + tailwind-merge | 2.1.x / 3.4.x | `cn()` utility for conditional/merged class names | Already available from Phase 1. |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none) | -- | -- | No new dependencies needed for Phase 3 |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Plain `<section>` components | Headless UI sections / Radix primitives | Overkill for static content sections. No interactivity needed. Plain HTML sections with Tailwind are sufficient. |
| next-intl `Link` for CTA buttons | `<a>` tags with manual locale prefix | next-intl `Link` handles locale prefix automatically. Use it consistently. |
| Inline translations in page.tsx | Separate content markdown files | JSON translation files are already the established pattern. Keep consistent. Markdown would require a parser and break the i18n workflow. |
| Server Components for all sections | Client Components with `useTranslations` | Server Components are the right choice for static content -- zero client-side JS, better performance, faster LCP. |

**Installation:**
```bash
# No new packages needed. Everything is in place from Phase 1.
```

## Architecture Patterns

### Recommended Project Structure (Phase 3 additions)

```
src/
├── app/
│   └── [locale]/
│       └── page.tsx                    # MODIFY: Compose all 5 home sections
├── components/
│   └── home/
│       ├── hero-section.tsx            # NEW: Hero with headline, subtitle, CTA
│       ├── problem-section.tsx         # NEW: Pain points + solution approach
│       ├── services-preview.tsx        # NEW: 4 service preview cards
│       ├── process-section.tsx         # NEW: "How it works" steps
│       └── cta-band.tsx               # NEW: Full-width CTA repeat
messages/
├── es.json                             # MODIFY: Add home.problem, home.services, home.process, home.ctaBand
└── en.json                             # MODIFY: Same structure in English
```

### Pattern 1: Section Component with Server-Side Translations

**What:** Each home page section is an async Server Component that receives translations via `getTranslations` and renders static HTML with Tailwind classes. No `'use client'` directive needed.
**When to use:** Every section on the home page.
**Source:** next-intl Server Components docs, verified in Phase 1/2 patterns.

```typescript
// src/components/home/hero-section.tsx
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function HeroSection() {
  const t = await getTranslations('home.hero');
  const tCommon = await getTranslations('common');

  return (
    <section className="px-4 py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          {t('title')}
        </h1>
        <p className="mt-6 text-base md:text-lg lg:text-xl text-muted max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-dark transition-colors text-base md:text-lg"
        >
          {tCommon('cta')}
        </Link>
      </div>
    </section>
  );
}
```

**Key points:**
- `async function` because `getTranslations` is async (Server Component pattern)
- CTA uses next-intl `Link` to `/contact` (automatically adds locale prefix)
- No `'use client'` -- this is a Server Component, zero client JS
- Uses existing design tokens: `bg-accent`, `text-muted`, `hover:bg-accent-dark`

### Pattern 2: Page Composition with Multiple Async Sections

**What:** The home page.tsx imports and composes all 5 section components. Since all are async Server Components, they render on the server and ship as static HTML.
**When to use:** The `[locale]/page.tsx` file.

```typescript
// src/app/[locale]/page.tsx
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { HeroSection } from '@/components/home/hero-section';
import { ProblemSection } from '@/components/home/problem-section';
import { ServicesPreview } from '@/components/home/services-preview';
import { ProcessSection } from '@/components/home/process-section';
import { CtaBand } from '@/components/home/cta-band';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <ProblemSection />
      <ServicesPreview />
      <ProcessSection />
      <CtaBand />
    </>
  );
}
```

**Key points:**
- `setRequestLocale(locale)` must be called before any translation calls (established pattern from Phase 1)
- Fragment wrapper `<>...</>` since the layout already provides `<main>`
- Each section is self-contained with its own `getTranslations` call
- Section order matters for conversion flow: hook (hero) -> pain (problem) -> solution preview (services) -> clarity (process) -> action (CTA)

### Pattern 3: Translation Namespace Structure for Rich Content

**What:** Organize translation keys in nested namespaces that mirror the component structure. Use arrays for lists (pain points, steps) via indexed keys.
**When to use:** All translation content for home page sections.

```json
// messages/es.json (expanded home namespace)
{
  "home": {
    "hero": {
      "title": "...",
      "subtitle": "..."
    },
    "problem": {
      "title": "...",
      "subtitle": "...",
      "painPoints": {
        "1": { "title": "...", "description": "..." },
        "2": { "title": "...", "description": "..." },
        "3": { "title": "...", "description": "..." },
        "4": { "title": "...", "description": "..." }
      },
      "solutionTitle": "...",
      "solutionDescription": "..."
    },
    "services": {
      "title": "...",
      "subtitle": "...",
      "viewAll": "...",
      "items": {
        "1": { "title": "...", "description": "..." },
        "2": { "title": "...", "description": "..." },
        "3": { "title": "...", "description": "..." },
        "4": { "title": "...", "description": "..." }
      }
    },
    "process": {
      "title": "...",
      "subtitle": "...",
      "steps": {
        "1": { "title": "...", "description": "..." },
        "2": { "title": "...", "description": "..." },
        "3": { "title": "...", "description": "..." }
      }
    },
    "ctaBand": {
      "title": "...",
      "subtitle": "..."
    }
  }
}
```

**Important:** next-intl does NOT support array values in JSON. Use object keys with string indices (`"1"`, `"2"`, `"3"`) instead of arrays. Access via `t('painPoints.1.title')`.

### Pattern 4: Service Preview Card with Link

**What:** A card component that previews a service and links to the full Services page. Uses next-intl `Link` for locale-aware navigation.
**When to use:** HOME-04 services preview section.

```typescript
// Inside services-preview.tsx
import { Link } from '@/i18n/navigation';

// For each service card:
<Link
  href="/services"
  className="block p-6 rounded-lg border border-border hover:border-accent hover:shadow-md transition-all"
>
  <h3 className="text-lg font-bold">{t(`items.${id}.title`)}</h3>
  <p className="mt-2 text-sm text-muted">{t(`items.${id}.description`)}</p>
</Link>
```

**Key points:**
- Each card links to `/services` (the full services page, built in Phase 4)
- The entire card is a clickable link (block-level `Link`)
- Hover state: border color change + shadow for visual feedback
- The 4 service titles match SERV-01: Strategic Technical Advisory, Delivery Acceleration, Product & Business Alignment, Fractional Leadership Support

### Pattern 5: CTA Band with Accent Background

**What:** A full-width section with accent background color, contrasting text, and a prominent CTA button.
**When to use:** HOME-06 CTA band at the bottom of the page.

```typescript
// src/components/home/cta-band.tsx
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function CtaBand() {
  const t = await getTranslations('home.ctaBand');
  const tCommon = await getTranslations('common');

  return (
    <section className="bg-accent px-4 py-16 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
          {t('title')}
        </h2>
        <p className="mt-4 text-base md:text-lg text-white/80">
          {t('subtitle')}
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block px-8 py-4 bg-white text-accent font-bold rounded-lg hover:bg-white/90 transition-colors text-base md:text-lg"
        >
          {tCommon('cta')}
        </Link>
      </div>
    </section>
  );
}
```

**Key points:**
- Background uses `bg-accent` (the brand accent color from design tokens)
- Text is white on accent background for contrast
- CTA button is inverted: white background with accent text
- `text-white/80` for subtitle provides visual hierarchy within the band

### Pattern 6: Responsive Content Grid

**What:** Two-column layout for problem/solution or services cards that stacks on mobile.
**When to use:** HOME-03 (problem/solution) and HOME-04 (services preview).

```typescript
// Two-column grid for service cards
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Card 1 */}
  {/* Card 2 */}
  {/* Card 3 */}
  {/* Card 4 */}
</div>

// Two-column split for problem/solution
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
  <div>{/* Pain points column */}</div>
  <div>{/* Solution column */}</div>
</div>
```

### Anti-Patterns to Avoid

- **Making home page sections Client Components:** There is ZERO client-side interactivity on this page. Every section should be a Server Component (`async function` with `getTranslations` from `next-intl/server`). Adding `'use client'` would increase the JS bundle for no reason.
- **Hardcoding any visible text:** COPY-01/02/03 and I18N-03 require ALL user-visible strings in translation files. Every heading, paragraph, button label, and descriptive text must come from `t('key')`. Zero exceptions.
- **Using array values in translation JSON:** next-intl does not support arrays. Use indexed object keys (`"1"`, `"2"`, `"3"`) instead.
- **Creating a separate CTA component with `onClick` handlers:** The CTA is a navigation link, not a button with JavaScript behavior. Use `Link` from next-intl, not `<button>`. This makes it a standard anchor tag that works without JavaScript.
- **Putting all 5 sections directly in page.tsx:** This makes the file unmanageably long and hard to edit. Extract each section into its own component file under `components/home/`.
- **Copying Spanish copy and only translating to English:** Write Spanish copy first (primary market), then write natural English copy that conveys the same meaning. Do not literally translate word-for-word.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Locale-aware CTA links | `<a href="/es/contact">` with manual locale prefix | next-intl `Link` from `@/i18n/navigation` with `href="/contact"` | Locale prefix is automatic. Consistent with all other links in the project. |
| Responsive grid layouts | Custom flexbox with media query breakpoints | Tailwind `grid grid-cols-1 md:grid-cols-2 gap-6` | One utility class. Responsive. No custom CSS. |
| Section spacing system | Custom spacing variables or wrapper components | Tailwind `py-16 md:py-20 lg:py-24` on each `<section>` | Consistent vertical rhythm using existing spacing tokens. |
| Translation key iteration for lists | Manual copy-paste of repeated JSX | Loop over known indices: `[1, 2, 3, 4].map(id => ...)` with `t(\`items.${id}.title\`)` | DRY. Easy to add/remove items by editing translation JSON only. |
| Brand voice consistency | Ad-hoc copy per section | Define copy principles first, then apply: short sentences, active voice, outcome language, "tu" form in Spanish | Consistent voice across all sections. |

**Key insight:** This phase is 80% content and 20% code. The technical patterns (Server Components, translations, Tailwind layout) are already established from Phases 1-2. The primary challenge is writing bilingual copy that converts visitors into consulting leads.

## Common Pitfalls

### Pitfall 1: Translation Keys Don't Match Component Expectations

**What goes wrong:** Runtime error "MISSING_MESSAGE" because the translation key path in the component does not match the key path in the JSON file.
**Why it happens:** Deep nesting like `home.problem.painPoints.1.title` is easy to mistype or mismatch between the JSON structure and the component code.
**How to avoid:** Define the full JSON structure FIRST (both es.json and en.json), then write components that reference those exact paths. Use a consistent pattern: section name -> sub-item -> field (`home.services.items.1.title`).
**Warning signs:** Yellow console warnings from next-intl about missing messages. Text renders as the raw key path.

### Pitfall 2: Forgetting `setRequestLocale` Before Section Components

**What goes wrong:** Translation calls in section components fail or return wrong locale.
**Why it happens:** In static generation mode, `setRequestLocale(locale)` must be called at the page level before any `getTranslations` call. If the page.tsx does not call it, downstream Server Components cannot resolve the locale.
**How to avoid:** The `page.tsx` MUST call `setRequestLocale(locale)` as the first action, before rendering any section component. This is already the established pattern from Phases 1-2.
**Warning signs:** All sections render in the default locale regardless of URL, or "Unable to find next-intl locale" error.

### Pitfall 3: CTA Button Not Meeting Touch Target Size

**What goes wrong:** On mobile, the CTA button is hard to tap.
**Why it happens:** Phase 1 set a global `min-h-[44px] min-w-[44px]` for buttons and links, but if the CTA uses a `Link` component with insufficient padding, the visual target may be adequate while the actual touch target is not.
**How to avoid:** Use generous padding on CTA links: `px-6 py-3` or larger. The Phase 1 global rule covers the minimum, but CTAs should exceed the minimum for usability.
**Warning signs:** Lighthouse flags "Tap targets not sized appropriately."

### Pitfall 4: Spanish Copy Reads as Translated English

**What goes wrong:** Spanish-speaking visitors perceive the copy as unnatural or robotic.
**Why it happens:** Writing English first and then translating produces stilted Spanish. English sentence structure, idioms, and rhythm do not map 1:1 to natural Spanish.
**How to avoid:** Write Spanish copy FIRST (it is the primary market language). Use conversational connectors ("es decir", "en otras palabras"), natural "tu" form, and Mexican Spanish base (neutral LatAm without region-specific slang). Then write English copy that conveys the same meaning in natural English.
**Warning signs:** Spanish copy has very short sentences (English rhythm), formal "usted" form where warmth is needed, or literal translations of English idioms.

### Pitfall 5: Service Preview Cards Link to Non-Functional Page

**What goes wrong:** Users click a service preview card and land on a stub page with "Content coming soon."
**Why it happens:** The Services page is built in Phase 4. In Phase 3, it is still a stub.
**How to avoid:** This is expected and acceptable. The preview cards should link to `/services` which exists as a stub from Phase 2. When Phase 4 is executed, the stub will be replaced with real content. The links will work correctly without changes. Do NOT create anchor links to individual service sections (e.g., `/services#advisory`) because those anchors do not exist yet.
**Warning signs:** None -- this is the expected behavior during Phase 3. The stub pages were created specifically for this scenario.

### Pitfall 6: Inconsistent Section Width and Spacing

**What goes wrong:** Each section looks like it belongs to a different site -- different max-widths, padding, spacing.
**Why it happens:** Each section component is built independently without a shared layout convention.
**How to avoid:** Establish a convention for all sections:
- Outer: `<section className="px-4 py-16 md:py-20 lg:py-24">`
- Inner: `<div className="mx-auto max-w-6xl">` (or `max-w-4xl` for text-heavy sections like hero)
- Section titles: `text-2xl md:text-3xl lg:text-4xl font-bold`
- Section subtitles: `mt-4 text-base md:text-lg text-muted`
- The CTA band is the exception: full-width accent background, but inner content still constrained to `max-w-3xl`
**Warning signs:** Visual inconsistency between sections when scrolling the page.

### Pitfall 7: CTA Band Accent Color Insufficient Contrast

**What goes wrong:** White text on the accent background fails AA contrast check.
**Why it happens:** The accent color (`oklch(0.55 0.15 250)`) may not provide 4.5:1 contrast ratio against white text for normal-sized text.
**How to avoid:** Use `bg-accent-dark` (`oklch(0.40 0.15 250)`) for the CTA band background instead of `bg-accent`, or use large text (which only requires 3:1 ratio). Verify with a contrast checker. Alternatively, use `bg-foreground` (near-black) for guaranteed contrast.
**Warning signs:** Phase 6 accessibility audit flags contrast failure. Easier to get it right now.

## Code Examples

Verified patterns from project codebase and official sources:

### Translation JSON Structure for Home Page

```json
// messages/es.json - home section (additions for Phase 3)
{
  "home": {
    "hero": {
      "title": "[Compelling value proposition headline]",
      "subtitle": "[Supporting description for LatAm market]"
    },
    "problem": {
      "title": "[Section title about client challenges]",
      "subtitle": "[Brief intro to pain points]",
      "painPoints": {
        "1": {
          "title": "[Pain point 1 title]",
          "description": "[Pain point 1 explanation]"
        },
        "2": {
          "title": "[Pain point 2 title]",
          "description": "[Pain point 2 explanation]"
        },
        "3": {
          "title": "[Pain point 3 title]",
          "description": "[Pain point 3 explanation]"
        },
        "4": {
          "title": "[Pain point 4 title]",
          "description": "[Pain point 4 explanation]"
        }
      },
      "solution": {
        "title": "[How M. Gripe addresses these]",
        "description": "[Approach summary]"
      }
    },
    "services": {
      "title": "[Services section title]",
      "subtitle": "[Brief services intro]",
      "viewAll": "[Link text to full services page]",
      "items": {
        "1": {
          "title": "Asesoria Tecnica Estrategica",
          "description": "[One-line description]"
        },
        "2": {
          "title": "Aceleracion de Delivery",
          "description": "[One-line description]"
        },
        "3": {
          "title": "Alineacion de Producto y Negocio",
          "description": "[One-line description]"
        },
        "4": {
          "title": "Liderazgo Fraccional",
          "description": "[One-line description]"
        }
      }
    },
    "process": {
      "title": "[How it works title]",
      "subtitle": "[Process intro]",
      "steps": {
        "1": {
          "title": "[Step 1 title]",
          "description": "[Step 1 description]"
        },
        "2": {
          "title": "[Step 2 title]",
          "description": "[Step 2 description]"
        },
        "3": {
          "title": "[Step 3 title]",
          "description": "[Step 3 description]"
        }
      }
    },
    "ctaBand": {
      "title": "[Closing CTA headline]",
      "subtitle": "[Supporting urgency/value text]"
    }
  }
}
```

### Iterating Over Indexed Translation Keys

```typescript
// Pattern for rendering lists from translation JSON
const serviceIds = ['1', '2', '3', '4'] as const;

{serviceIds.map((id) => (
  <Link
    key={id}
    href="/services"
    className="block p-6 rounded-lg border border-border hover:border-accent hover:shadow-md transition-all"
  >
    <h3 className="text-lg font-bold">{t(`items.${id}.title`)}</h3>
    <p className="mt-2 text-sm text-muted">{t(`items.${id}.description`)}</p>
  </Link>
))}
```

### Process Steps with Numbered Badges

```typescript
// Pattern for "How it works" numbered steps
const stepIds = ['1', '2', '3'] as const;

{stepIds.map((id) => (
  <div key={id} className="flex gap-4">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">
      {id}
    </div>
    <div>
      <h3 className="font-bold text-lg">{t(`steps.${id}.title`)}</h3>
      <p className="mt-1 text-muted">{t(`steps.${id}.description`)}</p>
    </div>
  </div>
))}
```

### Full Section Spacing Convention

```typescript
// Standard section wrapper used by all home page sections
<section className="px-4 py-16 md:py-20 lg:py-24">
  <div className="mx-auto max-w-6xl">
    {/* Section content */}
  </div>
</section>

// Exception: CTA band uses accent background and tighter content width
<section className="bg-accent px-4 py-16 md:py-20">
  <div className="mx-auto max-w-3xl text-center">
    {/* CTA content */}
  </div>
</section>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Client Components with `useTranslations` for all sections | Server Components with `getTranslations` for static content | next-intl 3.x+ (2024) | Zero client JS for content sections. Better LCP. Smaller bundle. |
| Separate page sections via CSS-in-JS styled components | Tailwind utility classes directly in JSX | Tailwind v3/v4 (standard) | No runtime CSS overhead. Design tokens via `@theme`. |
| Translation files with flat key structure | Nested namespaces (`home.hero.title`) | Established in Phase 1 | Better organization as content grows. Each section has its own namespace. |
| `<button onClick={...}>` for CTAs | `<Link href="/contact">` for navigation CTAs | React/Next.js best practice | Proper anchor semantics. Works without JS. Better SEO. Better accessibility. |
| Manual responsive breakpoints | Tailwind responsive prefixes (`md:`, `lg:`) | Tailwind v1+ (mature) | Mobile-first design built into the utility system. |

**Deprecated/outdated:**
- Using `useTranslations` in Server Components: Use `getTranslations` from `next-intl/server` instead (async, server-only)
- Using `<button>` for navigation: Use `Link` for any click that navigates to another page
- Using `className="..."` with string concatenation: Use `cn()` utility from Phase 1

## Open Questions

1. **Exact copy content for each section**
   - What we know: The brand positioning, service lines, ICP, pain points, and entry offer are all defined in PROJECT.md.
   - What's unclear: The specific wording for headlines, subheadlines, pain point descriptions, and process steps.
   - Recommendation: The planner should include a task that generates the full copy for both languages and adds it to the translation files. Copy generation should follow COPY-01/02/03 guidelines. This is the largest task in the phase.

2. **Problem/solution section layout: single column vs. two columns**
   - What we know: The section needs to present pain points and M. Gripe's approach.
   - What's unclear: Whether to use a two-column layout (pain left, solution right) or a sequential layout (pain points first, then solution below).
   - Recommendation: Two-column on desktop (`lg:grid-cols-2`), stacked on mobile. This creates a visual "before/after" that is more compelling for consulting positioning.

3. **Whether service preview cards should have icons**
   - What we know: The requirements specify "services preview cards" but do not mention icons.
   - What's unclear: Whether adding icons would improve scannability.
   - Recommendation: No icons in Phase 3. Adding icons would require either an icon library (new dependency) or custom SVGs (design work). Keep cards text-only with strong titles. Icons can be added in Phase 6 (polish) if desired.

4. **CTA band background color contrast**
   - What we know: The accent color is `oklch(0.55 0.15 250)` and the dark variant is `oklch(0.40 0.15 250)`.
   - What's unclear: Exact contrast ratio of white text on either shade.
   - Recommendation: Use `bg-foreground` (near-black `#0a0a0a`) for the CTA band for guaranteed contrast, or verify the accent-dark variant meets AA contrast for large text (3:1). This should be validated during implementation.

## Sources

### Primary (HIGH confidence)
- Project codebase: `src/app/[locale]/page.tsx`, `src/components/layout/header.tsx`, `messages/es.json`, `messages/en.json` -- established patterns from Phases 1-2
- Phase 1 Research: `.planning/phases/01-foundation-i18n-scaffolding/01-RESEARCH.md` -- stack decisions, translation structure
- Phase 2 Research: `.planning/phases/02-layout-shell-navigation/02-RESEARCH.md` -- layout patterns, component conventions
- REQUIREMENTS.md: HOME-01 through HOME-06, COPY-01 through COPY-03 -- exact specification
- PROJECT.md: Brand positioning, ICP, service lines, entry offer -- content source for copy generation
- next-intl Server Components: https://next-intl.dev/docs/environments/server-client-components -- `getTranslations` for async Server Components
- next-intl Navigation: https://next-intl.dev/docs/routing/navigation -- `Link` component for locale-aware navigation

### Secondary (MEDIUM confidence)
- Tailwind CSS grid utilities: https://tailwindcss.com/docs/grid-template-columns -- responsive grid patterns
- WCAG 2.1 contrast requirements: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html -- AA contrast ratios for text
- Consulting site conversion best practices: hero -> pain -> solution -> social proof -> CTA is the standard conversion page flow

### Tertiary (LOW confidence)
- None -- all findings verified with primary project sources and official documentation.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- No new dependencies. All tools already installed and verified in Phases 1-2. Server Components for static content is an established pattern.
- Architecture: HIGH -- Component composition, section layout, translation namespace structure all follow established project patterns. No novel technical challenges.
- Pitfalls: HIGH -- Pitfalls drawn from project history (setRequestLocale pattern), next-intl documentation (no array values), and accessibility standards (contrast ratios).
- Copy/Content: MEDIUM -- The copy guidelines (COPY-01/02/03) are clear, but the actual copy needs to be written. This is creative work, not technical implementation. Quality depends on execution.

**Research date:** 2026-02-19
**Valid until:** 2026-03-19 (stable ecosystem, 30-day validity)
