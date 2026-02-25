---
phase: 06-polish-accessibility-seo
plan: 01
subsystem: seo
tags: [next-intl, metadata, seo, privacy-policy, generateMetadata, i18n]

# Dependency graph
requires:
  - phase: 05-contact-form-conversion
    provides: Contact form collecting user data (triggers need for privacy policy)
  - phase: 01-foundation-i18n
    provides: next-intl translation infrastructure and routing
provides:
  - Per-page SEO metadata (generateMetadata) on bio, services, contact, and privacy pages
  - Bilingual privacy policy page at /[locale]/privacy
  - Privacy translation namespace with full legal content in both locales
affects: [06-02-PLAN (accessibility and semantic improvements)]

# Tech tracking
tech-stack:
  added: []
  patterns: [per-page generateMetadata with nested namespace lookup via next-intl]

key-files:
  created:
    - src/app/[locale]/privacy/page.tsx
  modified:
    - messages/es.json
    - messages/en.json
    - src/app/[locale]/bio/page.tsx
    - src/app/[locale]/services/page.tsx
    - src/app/[locale]/contact/page.tsx

key-decisions:
  - "Used nested metadata namespaces (metadata.bio, metadata.services, etc.) for clean separation from layout-level metadata"
  - "Privacy policy content covers all 7 required sections: data collected, usage, processing, retention, rights, cookies, contact"
  - "Privacy page uses static sectionKeys array and sectionItemCounts map to iterate sections without hardcoding JSX per section"

patterns-established:
  - "Per-page generateMetadata: import getTranslations with locale namespace, return title and description from translations"
  - "Content-heavy pages: use article element with prose-like spacing (px-4 py-16 md:py-20 lg:py-24, max-w-3xl)"

requirements-completed: [TECH-05, TECH-07]

# Metrics
duration: 2min
completed: 2026-02-24
---

# Phase 6 Plan 1: SEO Metadata & Privacy Policy Summary

**Per-page generateMetadata on bio/services/contact pages with nested next-intl namespaces, plus bilingual privacy policy page covering data collection, processing via Resend, retention, user rights, and cookies**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-25T00:04:56Z
- **Completed:** 2026-02-25T00:06:56Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Every page now has a unique, locale-specific title tag and meta description (bio, services, contact, privacy)
- Privacy policy page exists at /es/privacy and /en/privacy with complete bilingual content
- Privacy content covers all required topics: data collected, usage, processing (Resend), retention, user rights, cookies (NEXT_LOCALE only), and contact
- Footer privacy link navigates correctly to the new privacy page

## Task Commits

Each task was committed atomically:

1. **Task 1: Add per-page SEO metadata and privacy translation keys** - `f10ea76` (feat)
2. **Task 2: Create bilingual privacy policy page** - `be40a45` (feat)

## Files Created/Modified
- `src/app/[locale]/privacy/page.tsx` - New privacy policy page with generateStaticParams, generateMetadata, and 7 content sections
- `src/app/[locale]/bio/page.tsx` - Added generateMetadata with metadata.bio namespace
- `src/app/[locale]/services/page.tsx` - Added generateMetadata with metadata.services namespace (added getTranslations import)
- `src/app/[locale]/contact/page.tsx` - Added generateMetadata with metadata.contact namespace
- `messages/es.json` - Added metadata.bio/services/contact/privacy nested keys and privacy namespace with full Spanish content
- `messages/en.json` - Added metadata.bio/services/contact/privacy nested keys and privacy namespace with full English content

## Decisions Made
- Used nested metadata namespaces (metadata.bio, metadata.services, etc.) to keep page metadata cleanly separated from the layout-level metadata.title/description that serves as default
- Privacy policy content independently written per locale (not literal translation) following project convention
- Privacy page uses data-driven section rendering (sectionKeys array + sectionItemCounts map) rather than hardcoded JSX per section, keeping the component concise

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All pages now have proper SEO metadata for search discoverability
- Privacy policy page complete for legal compliance
- Ready for plan 06-02 (accessibility, semantic HTML, and remaining polish)

## Self-Check: PASSED

All 6 files verified present. Both task commits (f10ea76, be40a45) verified in git log.

---
*Phase: 06-polish-accessibility-seo*
*Completed: 2026-02-24*
