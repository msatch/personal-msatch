---
phase: 06-polish-accessibility-seo
plan: 02
subsystem: ui
tags: [accessibility, a11y, focus-visible, scroll-reveal, intersection-observer, reduced-motion, skip-to-content, micro-interactions]

# Dependency graph
requires:
  - phase: 06-polish-accessibility-seo
    provides: SEO metadata and privacy policy (plan 01 complete)
  - phase: 01-foundation-i18n
    provides: Tailwind design tokens, globals.css base layer, next-intl translations
  - phase: 02-layout-shell-nav
    provides: Locale layout with header/footer shell
provides:
  - Global focus-visible keyboard indicators on all interactive elements
  - Skip-to-content link (bilingual) for keyboard navigation
  - prefers-reduced-motion media query disabling all animations
  - ScrollReveal component with IntersectionObserver-based fade-in animations
  - Enhanced CTA hover states (scale + shadow) and active states (scale-down)
  - Service card lift effect on hover
affects: [07-deployment-launch]

# Tech tracking
tech-stack:
  added: []
  patterns: [useInView hook wrapping IntersectionObserver with reduced-motion bypass, ScrollReveal client component wrapping server-rendered sections]

key-files:
  created:
    - src/hooks/use-in-view.ts
    - src/components/ui/scroll-reveal.tsx
  modified:
    - src/styles/globals.css
    - src/app/[locale]/layout.tsx
    - src/app/[locale]/page.tsx
    - src/app/[locale]/bio/page.tsx
    - src/app/[locale]/services/page.tsx
    - src/components/home/hero-section.tsx
    - src/components/home/cta-band.tsx
    - src/components/home/services-preview.tsx
    - src/components/services/services-cta.tsx
    - messages/es.json
    - messages/en.json

key-decisions:
  - "ScrollReveal wraps server-rendered sections at the page level (not inside each section component) to preserve Server Component purity"
  - "useInView hook checks prefers-reduced-motion and immediately sets isInView=true, skipping IntersectionObserver entirely"
  - "Skip-to-content link placed outside NextIntlClientProvider using server-side getTranslations for translation access"

patterns-established:
  - "Scroll reveal pattern: useInView hook + ScrollReveal wrapper at page level, only for below-the-fold content"
  - "CTA hover pattern: hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all duration-200"
  - "Accessibility base: focus-visible for keyboard, :focus:not(:focus-visible) for mouse, prefers-reduced-motion for animation control"

requirements-completed: [DES-05, TECH-06, TECH-09]

# Metrics
duration: 3min
completed: 2026-02-24
---

# Phase 6 Plan 2: Accessibility & Micro-interactions Summary

**Focus-visible keyboard indicators, skip-to-content link, scroll reveal animations via IntersectionObserver, and enhanced CTA hover/active states with full prefers-reduced-motion support**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-25T00:09:38Z
- **Completed:** 2026-02-25T00:12:43Z
- **Tasks:** 2
- **Files modified:** 13

## Accomplishments
- All interactive elements show visible accent-colored focus rings on keyboard navigation, with no focus ring on mouse click
- Skip-to-content link appears when tabbing from top of page, bilingual (ES: "Ir al contenido principal", EN: "Skip to main content"), targets #main-content
- Below-the-fold sections on home, bio, and services pages fade in with translate-y animation as they enter the viewport
- CTA buttons across all pages have enhanced hover (scale 1.02 + shadow-lg) and active (scale 0.98) states
- Service preview cards lift on hover with -translate-y-1 effect
- All animations and transitions are disabled when user prefers reduced motion

## Task Commits

Each task was committed atomically:

1. **Task 1: Accessibility foundations -- focus indicators, skip-to-content, reduced motion** - `8aa30d4` (feat)
2. **Task 2: Scroll reveal animations and enhanced CTA hover states** - `c851ae9` (feat)

## Files Created/Modified
- `src/hooks/use-in-view.ts` - Custom hook wrapping IntersectionObserver with reduced-motion bypass
- `src/components/ui/scroll-reveal.tsx` - Client component wrapper for fade-in scroll reveal animation
- `src/styles/globals.css` - Focus-visible indicators, :focus:not(:focus-visible) rule, prefers-reduced-motion media query
- `src/app/[locale]/layout.tsx` - Skip-to-content link (sr-only, visible on focus) and id="main-content" on main element
- `src/app/[locale]/page.tsx` - ScrollReveal wrapping ProblemSection, ServicesPreview, ProcessSection, CtaBand
- `src/app/[locale]/bio/page.tsx` - ScrollReveal wrapping NarrativeSection, SocialProofSection, CTA band; enhanced CTA hover
- `src/app/[locale]/services/page.tsx` - ScrollReveal wrapping ProcessSection, FaqSection, ServicesCta
- `src/components/home/hero-section.tsx` - Enhanced CTA hover/active states
- `src/components/home/cta-band.tsx` - Enhanced CTA hover/active states
- `src/components/home/services-preview.tsx` - Service card hover:-translate-y-1 lift effect
- `src/components/services/services-cta.tsx` - Enhanced CTA hover/active states
- `messages/es.json` - Added common.skipToContent key
- `messages/en.json` - Added common.skipToContent key

## Decisions Made
- ScrollReveal wraps server-rendered sections at the page level rather than inside each section component, preserving Server Component purity
- useInView hook checks prefers-reduced-motion first and immediately sets isInView=true to skip animation entirely (not just fast-forward it)
- Skip-to-content link placed outside NextIntlClientProvider but uses server-side getTranslations for bilingual text
- Hero section and above-the-fold content (PhotoCredentials, OfferingsSection) are NOT wrapped in ScrollReveal to avoid content flash

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 6 (Polish, Accessibility & SEO) is now fully complete (both plans done)
- All accessibility foundations are in place: focus indicators, skip-to-content, reduced motion
- All micro-interactions are active: scroll reveals, CTA hover/active states, card lift effects
- Ready for Phase 7 (Deployment & Launch)

## Self-Check: PASSED

All 13 files verified present. Both task commits (8aa30d4, c851ae9) verified in git log.

---
*Phase: 06-polish-accessibility-seo*
*Completed: 2026-02-24*
