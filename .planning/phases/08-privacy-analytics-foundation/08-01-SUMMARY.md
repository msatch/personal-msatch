---
phase: 08-privacy-analytics-foundation
plan: 01
subsystem: ui
tags: [privacy, cookies, ga4, gtm, i18n, consent, typescript]

# Dependency graph
requires:
  - phase: 06-polish-accessibility-seo
    provides: privacy page component and translation structure
provides:
  - Updated privacy policy disclosing GA4 analytics cookies in both languages
  - Consent banner translations (accept, reject, message, ariaLabel, privacyLink)
  - TypeScript global declarations for window.dataLayer and window.gtag
  - GTM environment variable placeholder and documentation
affects: [08-02-analytics-components]

# Tech tracking
tech-stack:
  added: []
  patterns: [sectionsWithControl array for conditional control paragraph rendering]

key-files:
  created:
    - src/types/gtag.d.ts
    - .env.local
  modified:
    - messages/es.json
    - messages/en.json
    - src/app/[locale]/privacy/page.tsx
    - .env.example

key-decisions:
  - "Used consistent unaccented text in Spanish translations to match existing convention in message files"
  - "sectionsWithControl pattern used for extensible control paragraph rendering"

patterns-established:
  - "sectionsWithControl: array-based conditional rendering for sections with control/management paragraphs"
  - "consent namespace: top-level translation key for cookie consent banner text"

requirements-completed: [ANLYT-03]

# Metrics
duration: 3min
completed: 2026-02-28
---

# Phase 8 Plan 01: Privacy Policy & Analytics Groundwork Summary

**Privacy policy updated to disclose GA4 cookies in both languages, consent banner translations added, and TypeScript GTM declarations created**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-01T00:49:16Z
- **Completed:** 2026-03-01T00:51:49Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- Privacy policy in both languages now accurately describes technical cookies, consent cookies, and GA4 analytics cookies with a control paragraph
- Consent namespace added to both translation files with banner text for accept, reject, message, ariaLabel, and privacyLink
- TypeScript global declarations created for window.dataLayer and window.gtag
- GTM environment variable documented in .env.example and placeholder set in .env.local

## Task Commits

Each task was committed atomically:

1. **Task 1: Update privacy policy translations and add consent namespace** - `4d3fb91` (feat)
2. **Task 2: Update privacy page component to render cookie items and control paragraph** - `9435e6f` (feat)
3. **Task 3: Create TypeScript global declarations and environment variable setup** - `f366fbf` (feat)

## Files Created/Modified
- `messages/es.json` - Updated cookies section with GA4 disclosure, added consent namespace
- `messages/en.json` - Updated cookies section with GA4 disclosure, added consent namespace
- `src/app/[locale]/privacy/page.tsx` - Added cookies to sectionItemCounts, added sectionsWithControl rendering
- `src/types/gtag.d.ts` - TypeScript global declarations for Window.dataLayer and Window.gtag
- `.env.example` - Added NEXT_PUBLIC_GTM_ID documentation
- `.env.local` - Created with GTM placeholder (gitignored)

## Decisions Made
- Used unaccented text in Spanish translations to match existing convention in the message files (the project does not use accented characters in translation strings)
- Created sectionsWithControl as an extensible pattern rather than hardcoding cookies-specific logic, so future sections can reuse the control paragraph rendering

## Deviations from Plan

None - plan executed exactly as written.

## User Setup Required

GTM container and GA4 property must be configured before analytics goes live (Plan 02). The `user_setup` section in the plan frontmatter documents the steps:
- Create a GTM container (Web type) at https://tagmanager.google.com/
- Create a GA4 property and add it as a tag inside the GTM container
- Copy the Container ID (GTM-XXXXXXX) to `.env.local` as `NEXT_PUBLIC_GTM_ID`

## Next Phase Readiness
- Privacy policy is updated and accurately discloses analytics usage -- prerequisite for ANLYT-03
- Consent translations are ready for the consent banner component in Plan 02
- TypeScript declarations are in place for GTM/GA4 component development
- GTM environment variable is documented and ready for real container ID

## Self-Check: PASSED

All 6 files verified present. All 3 task commits verified in git log.

---
*Phase: 08-privacy-analytics-foundation*
*Completed: 2026-02-28*
