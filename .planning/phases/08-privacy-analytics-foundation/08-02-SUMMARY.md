---
phase: 08-privacy-analytics-foundation
plan: 02
subsystem: ui
tags: [gtm, ga4, consent-mode-v2, cookie-consent, analytics, next-script, i18n]

# Dependency graph
requires:
  - phase: 08-privacy-analytics-foundation
    provides: consent translations, TypeScript gtag globals, GTM env var placeholder
provides:
  - AnalyticsProvider component loading GTM via next/script afterInteractive
  - CookieConsentBanner with bilingual accept/reject and gtag consent update
  - Consent Mode v2 defaults inline script in layout head (all denied before GTM)
  - Layout integration wiring both components into the page rendering pipeline
affects: [07-deployment]

# Tech tracking
tech-stack:
  added: []
  patterns: [Consent Mode v2 default-before-load, localStorage+cookie dual persistence]

key-files:
  created:
    - src/components/analytics/analytics-provider.tsx
    - src/components/analytics/cookie-consent.tsx
  modified:
    - src/app/[locale]/layout.tsx

key-decisions:
  - "Used bg-background instead of bg-surface for consent banner (bg-surface not in design system)"
  - "AnalyticsProvider placed outside NextIntlClientProvider (no translations needed); CookieConsentBanner inside (uses useTranslations)"
  - "Dual persistence via localStorage (fast client read) and cookie with path=/ (survives locale switches)"

patterns-established:
  - "Consent Mode v2 defaults: synchronous inline script in head before GTM loads, all categories denied by default"
  - "GTM-only analytics: GA4 configured as tag inside GTM, no separate gtag.js script in codebase"
  - "Cookie consent persistence: localStorage key + cookie with path=/ for cross-locale durability"

requirements-completed: [ANLYT-01, ANLYT-02]

# Metrics
duration: 2min
completed: 2026-02-28
---

# Phase 8 Plan 02: GTM Analytics Provider & Cookie Consent Banner Summary

**GTM container loader with Consent Mode v2 defaults and bilingual cookie consent banner integrated into locale layout**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-01T00:54:22Z
- **Completed:** 2026-03-01T00:56:32Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- AnalyticsProvider loads GTM container via next/script with afterInteractive strategy (ANLYT-01)
- GA4 configured as GTM tag only -- no separate gtag.js script exists in codebase (ANLYT-02)
- Consent Mode v2 defaults set synchronously in layout head before GTM initializes (all 4 parameters denied)
- Bilingual cookie consent banner renders accept/reject buttons with next-intl translations
- Consent persists across page refreshes and locale switches via localStorage + cookie with path=/
- Returning visitors who already decided do not see the banner again

## Task Commits

Each task was committed atomically:

1. **Task 1: Create AnalyticsProvider and CookieConsentBanner components** - `bcd761b` (feat)
2. **Task 2: Wire analytics into locale layout with consent defaults in head** - `51f8fe6` (feat)

## Files Created/Modified
- `src/components/analytics/analytics-provider.tsx` - GTM container script loader using next/script afterInteractive
- `src/components/analytics/cookie-consent.tsx` - Bilingual consent banner with accept/reject, localStorage+cookie persistence, gtag consent update
- `src/app/[locale]/layout.tsx` - Added consent defaults inline script in head, AnalyticsProvider after ThemeSync, CookieConsentBanner inside NextIntlClientProvider

## Decisions Made
- Used `bg-background` instead of `bg-surface` for the consent banner background, since `bg-surface` is not defined in the project's design system (only `bg-surface-inverted` exists). This is a Rule 1 auto-fix deviation.
- AnalyticsProvider placed outside NextIntlClientProvider since it has no translation needs; CookieConsentBanner placed inside to access useTranslations('consent')
- Dual persistence strategy: localStorage for fast client-side reads on mount, plus a cookie with path=/ and SameSite=Lax so consent survives locale switches between /es/ and /en/

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed invalid CSS class bg-surface to bg-background**
- **Found during:** Task 1 (CookieConsentBanner component)
- **Issue:** Plan specified `bg-surface` CSS class which does not exist in the project's Tailwind design system
- **Fix:** Used `bg-background` which maps to `var(--bg)` in the theme tokens
- **Files modified:** src/components/analytics/cookie-consent.tsx
- **Verification:** Build passes, banner renders with correct background color
- **Committed in:** bcd761b (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Trivial CSS class correction. No scope creep.

## Issues Encountered
None

## User Setup Required

GTM container and GA4 property must be configured before analytics goes live:
- Create a GTM container (Web type) at https://tagmanager.google.com/
- Create a GA4 property and add it as a tag inside the GTM container
- Copy the Container ID (GTM-XXXXXXX) to `.env.local` as `NEXT_PUBLIC_GTM_ID`

## Next Phase Readiness
- Phase 8 (Privacy & Analytics Foundation) is fully complete
- GTM loads on all pages with consent defaults denied before initialization
- Cookie consent banner is bilingual and persists choices across locales
- Ready for Phase 9 (Case Studies) or Phase 10 (WhatsApp Enhancement) development
- Deployment (Phase 7) can proceed with NEXT_PUBLIC_GTM_ID configured

## Self-Check: PASSED

All 3 files verified present. All 2 task commits verified in git log.

---
*Phase: 08-privacy-analytics-foundation*
*Completed: 2026-02-28*
