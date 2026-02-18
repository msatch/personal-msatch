---
phase: 01-foundation-i18n-scaffolding
plan: 02
subsystem: ui
tags: [tailwind-css-4, next-intl, design-tokens, i18n, responsive, next-font]

# Dependency graph
requires:
  - phase: 01-foundation-i18n-scaffolding
    plan: 01
    provides: "Next.js 16 project with next-intl routing infrastructure and translation JSON files"
provides:
  - "Tailwind CSS 4 design token system via @theme (colors, spacing, radius) and @theme inline (fonts)"
  - "Locale layout with Geist fonts, NextIntlClientProvider, generateStaticParams, and dynamic metadata"
  - "Bilingual test page rendering translated content at /es/ and /en/ from JSON files"
  - "Locale switching via next-intl Link component with cookie persistence"
  - "Global 404 not-found page"
  - "Touch-friendly base styles (44x44px minimum tap targets)"
affects: [02-layout-shell, all-subsequent-phases]

# Tech tracking
tech-stack:
  added: []
  patterns: [design-tokens-via-theme, theme-inline-for-runtime-fonts, root-passthrough-layout, locale-redirect-fallback]

key-files:
  created:
    - src/styles/globals.css
    - src/app/[locale]/layout.tsx
    - src/app/[locale]/page.tsx
    - src/app/not-found.tsx
    - src/app/layout.tsx
    - src/app/page.tsx
  modified: []

key-decisions:
  - "Separated @theme (static tokens) from @theme inline (runtime font variables) to avoid build-time resolution failures"
  - "Root layout.tsx as passthrough (returns children only) to satisfy Next.js type system while [locale] layout owns html/body"
  - "Root page.tsx redirects to /es/ as safety net behind proxy.ts"
  - "Touch targets enforced globally via base layer (button, a, [role=button] min 44x44px)"

patterns-established:
  - "@theme for static design tokens, @theme inline for runtime CSS variables (next/font)"
  - "Root passthrough layout pattern for next-intl [locale] segment"
  - "generateStaticParams + setRequestLocale in every page under [locale]"
  - "getTranslations with nested namespaces (e.g., 'home.hero', 'common.nav')"

requirements-completed: [DES-01, DES-02, DES-03, DES-04, DES-06]

# Metrics
duration: 4min
completed: 2026-02-18
---

# Phase 1 Plan 02: Design Tokens & Bilingual Test Page Summary

**Tailwind CSS 4 design tokens with bilingual locale layout and test page proving full i18n stack at /es/ and /en/**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-18T23:46:23Z
- **Completed:** 2026-02-18T23:50:07Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Defined design token system in globals.css via @theme (brand colors, spacing, radius) and @theme inline (Geist font references)
- Built locale layout with NextIntlClientProvider, Geist Sans/Mono fonts, generateStaticParams, and dynamic metadata from translation files
- Created bilingual test page at /es/ and /en/ with translated hero, CTA, nav items, and locale switch link
- Verified complete i18n stack: / redirects to /es/, locale switching works, static generation for both locales, metadata in correct language

## Task Commits

Each task was committed atomically:

1. **Task 1: Configure design tokens in globals.css and create locale layout** - `fb03a54` (feat)
2. **Task 2: Create bilingual test page and verify full i18n stack** - `12ecf00` (feat)

**Plan metadata:** TBD (docs: complete plan)

## Files Created/Modified
- `src/styles/globals.css` - Tailwind CSS 4 design tokens (@theme for colors/spacing/radius, @theme inline for fonts), base styles with touch targets
- `src/app/[locale]/layout.tsx` - Root locale layout with Geist fonts, NextIntlClientProvider, generateStaticParams, generateMetadata
- `src/app/[locale]/page.tsx` - Bilingual home page with hero, CTA, nav preview, and locale switch link
- `src/app/not-found.tsx` - Global 404 fallback page with minimal markup
- `src/app/layout.tsx` - Root passthrough layout (returns children, no html/body) for Next.js type system compatibility
- `src/app/page.tsx` - Root redirect to /es/ (safety net behind proxy.ts)

## Decisions Made
- **@theme vs @theme inline separation:** Static color/spacing tokens in @theme (resolved at build time), font variables in @theme inline (kept as var() references for runtime injection by next/font). This prevents the Pitfall 3 documented in research.
- **Root passthrough layout:** Next.js 16 type validator requires a root layout.tsx and page.tsx. Created a minimal passthrough layout that returns children (no html/body tags) and a redirect page, letting the [locale]/layout.tsx own the HTML shell.
- **Touch targets in base layer:** Applied min-h-[44px] and min-w-[44px] globally to button, a, and [role="button"] elements to meet DES-04 accessibility requirement from the start.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added root layout.tsx and page.tsx for Next.js type system**
- **Found during:** Task 2 (build verification)
- **Issue:** Deleting src/app/layout.tsx and src/app/page.tsx (as specified in Task 1) caused Next.js 16 type validator to fail: `Type 'Route' does not satisfy the constraint '"/[locale]"'` and `Cannot find module '../../../src/app/page.js'`
- **Fix:** Created minimal root layout.tsx (passthrough returning children) and page.tsx (redirect to /es/) to satisfy the type system while keeping [locale]/layout.tsx as the real layout
- **Files modified:** src/app/layout.tsx, src/app/page.tsx
- **Verification:** `npm run build` passes, both locales generate as static pages
- **Committed in:** 12ecf00 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Required for build to succeed. Root files are minimal passthroughs with no functional impact on the architecture.

## Issues Encountered
None beyond the deviation documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Full i18n stack verified: bilingual routing, locale detection, cookie persistence, translation loading
- Design tokens ready for all future components (colors, spacing, radius, fonts)
- Phase 1 success criteria all met:
  1. `npm run dev` starts and renders pages at localhost
  2. /es/ and /en/ render locale-specific content from translation JSON files
  3. Browser language detection routes to correct locale (proxy.ts)
  4. Locale preference persists across refreshes (NEXT_LOCALE cookie)
  5. Design tokens render correctly (accent color CTA, bold typography, responsive layout)
- Ready for Phase 2: Layout Shell & Navigation

## Self-Check: PASSED

All 6 claimed files verified as existing. Both task commits (fb03a54, 12ecf00) verified in git log.

---
*Phase: 01-foundation-i18n-scaffolding*
*Completed: 2026-02-18*
