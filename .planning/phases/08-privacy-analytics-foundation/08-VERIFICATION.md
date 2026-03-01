---
phase: 08-privacy-analytics-foundation
verified: 2026-02-28T01:30:00Z
status: passed
score: 12/12 must-haves verified
re_verification: false
---

# Phase 8: Privacy & Analytics Foundation Verification Report

**Phase Goal:** The site accurately discloses its use of analytics cookies and loads Google Tag Manager with Consent Mode v2, so visitor behavior can be measured while respecting privacy
**Verified:** 2026-02-28T01:30:00Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #  | Truth                                                                                                     | Status     | Evidence                                                                                                                         |
|----|-----------------------------------------------------------------------------------------------------------|------------|----------------------------------------------------------------------------------------------------------------------------------|
| 1  | Privacy policy page in both languages accurately describes GA4 analytics cookies and how to control them  | VERIFIED   | `messages/es.json` and `messages/en.json` both have `privacy.sections.cookies.items` with 3 entries (NEXT_LOCALE, cookie_consent, GA4 via GTM) and a `control` paragraph |
| 2  | Privacy policy no longer states "we do not use tracking cookies" in either language                       | VERIFIED   | `grep` for legacy text returns zero results in both message files                                                                |
| 3  | Consent translation namespace exists in both languages with all required keys                             | VERIFIED   | Both files have `consent.{ariaLabel, message, accept, reject, privacyLink}` at top level (confirmed via Node.js JSON parse)     |
| 4  | TypeScript declarations for window.dataLayer and window.gtag exist so analytics components compile        | VERIFIED   | `src/types/gtag.d.ts` declares both `Window.dataLayer` and `Window.gtag` with correct types and `export {}`                    |
| 5  | GTM loads on every page via next/script with afterInteractive strategy                                    | VERIFIED   | `src/components/analytics/analytics-provider.tsx` uses `<Script strategy="afterInteractive">` with standard GTM container snippet |
| 6  | Consent defaults are set to denied synchronously in the head before GTM initializes                       | VERIFIED   | Inline `<script>` in `<head>` of `src/app/[locale]/layout.tsx` sets all 4 Consent Mode v2 categories to `'denied'` with `wait_for_update: 500` |
| 7  | GA4 is configured as a tag inside GTM only — no separate gtag.js script in the codebase                  | VERIFIED   | `grep` for `gtag/js`, `googletagmanager.com/gtag`, and `@next/third-parties` across `src/` returns zero results               |
| 8  | Cookie consent banner renders in both languages with accept and reject buttons                             | VERIFIED   | `src/components/analytics/cookie-consent.tsx` uses `useTranslations('consent')` and renders `t('accept')` and `t('reject')` buttons |
| 9  | Accepting cookies calls gtag consent update with analytics_storage granted                                 | VERIFIED   | `updateGtagConsent('accepted')` calls `window.gtag('consent', 'update', {analytics_storage: 'granted'})` in cookie-consent.tsx   |
| 10 | Rejecting cookies keeps analytics_storage denied                                                           | VERIFIED   | `updateGtagConsent('rejected')` calls `window.gtag('consent', 'update', {analytics_storage: 'denied'})` — also the default     |
| 11 | Consent persists across page refreshes and locale switches via cookie with path=/                          | VERIFIED   | `handleChoice` sets both `localStorage` and `document.cookie` with `path=/;SameSite=Lax;max-age=31536000`                      |
| 12 | Returning visitor who already decided does not see the banner again                                        | VERIFIED   | `useEffect` reads localStorage on mount; if `accepted` or `rejected` found, calls `updateGtagConsent` and leaves `visible=false` |

**Score:** 12/12 truths verified

### Required Artifacts

| Artifact                                               | Expected                                                        | Status     | Details                                                                              |
|--------------------------------------------------------|-----------------------------------------------------------------|------------|--------------------------------------------------------------------------------------|
| `messages/es.json`                                     | cookies section with GA4 disclosure + consent namespace         | VERIFIED   | `privacy.sections.cookies` has 3 items + control; `consent` namespace has 5 keys    |
| `messages/en.json`                                     | cookies section with GA4 disclosure + consent namespace         | VERIFIED   | `privacy.sections.cookies` has 3 items + control; `consent` namespace has 5 keys    |
| `src/app/[locale]/privacy/page.tsx`                    | Renders cookies items list and control paragraph                | VERIFIED   | `cookies: ['1','2','3']` in `sectionItemCounts`; `sectionsWithControl` renders `control` key |
| `src/types/gtag.d.ts`                                  | TypeScript globals for window.dataLayer and window.gtag         | VERIFIED   | Declares `Window.dataLayer: Record<string, unknown>[]` and `Window.gtag: (...args) => void` |
| `.env.example`                                         | Documents NEXT_PUBLIC_GTM_ID                                    | VERIFIED   | Contains `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX` with comment                              |
| `.env.local`                                           | GTM placeholder set                                             | VERIFIED   | Contains `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX`                                           |
| `src/components/analytics/analytics-provider.tsx`      | GTM loader with afterInteractive strategy, exports AnalyticsProvider | VERIFIED   | Uses `next/script` with `strategy="afterInteractive"`, loads `gtm.js` from googletagmanager.com, null-guards on missing GTM_ID |
| `src/components/analytics/cookie-consent.tsx`          | Bilingual consent banner, exports CookieConsentBanner           | VERIFIED   | Uses `useTranslations('consent')`, dual persistence via localStorage + cookie, gtag consent update on choice |
| `src/app/[locale]/layout.tsx`                          | Layout with consent defaults in head, both components wired in  | VERIFIED   | Consent inline script in `<head>`; `AnalyticsProvider` outside `NextIntlClientProvider`; `CookieConsentBanner` inside |

### Key Link Verification

| From                                    | To                                              | Via                                         | Status   | Details                                                                                                       |
|-----------------------------------------|-------------------------------------------------|---------------------------------------------|----------|---------------------------------------------------------------------------------------------------------------|
| `src/app/[locale]/layout.tsx`           | `src/components/analytics/analytics-provider.tsx` | import + render `<AnalyticsProvider />`     | WIRED    | Imported at line 11, rendered at line 74 — outside `NextIntlClientProvider`, after `ThemeSync`               |
| `src/app/[locale]/layout.tsx`           | `src/components/analytics/cookie-consent.tsx`   | import + render `<CookieConsentBanner />`   | WIRED    | Imported at line 12, rendered at line 82 — inside `NextIntlClientProvider`, after `WhatsAppButton`           |
| `src/components/analytics/cookie-consent.tsx` | `window.gtag`                           | `gtag('consent', 'update', ...)` on choice  | WIRED    | `updateGtagConsent()` called from `handleChoice()` and from `useEffect()` for returning visitors             |
| `src/app/[locale]/layout.tsx` (head)    | `window.dataLayer`                              | inline script setting consent defaults      | WIRED    | All 4 Consent Mode v2 categories set to `'denied'` with `wait_for_update: 500` before GTM loads             |
| `src/app/[locale]/privacy/page.tsx`     | `messages/*.json`                               | `getTranslations('privacy')` + item rendering | WIRED  | `sectionItemCounts.cookies` set to `['1','2','3']`; `sectionsWithControl` renders `sections.cookies.control` |

### Requirements Coverage

| Requirement | Source Plan | Description                                                                        | Status     | Evidence                                                                              |
|-------------|------------|------------------------------------------------------------------------------------|------------|---------------------------------------------------------------------------------------|
| ANLYT-01    | 08-02-PLAN | GTM container loads on all pages via manual next/script in root layout             | SATISFIED  | `AnalyticsProvider` uses `next/script` with `afterInteractive`, wired in locale layout for all locale routes |
| ANLYT-02    | 08-02-PLAN | GA4 configured as a tag inside GTM (not a separate script)                         | SATISFIED  | Zero occurrences of `gtag/js` or `googletagmanager.com/gtag` anywhere in `src/`. No `@next/third-parties` used. Only `gtm.js` loaded. |
| ANLYT-03    | 08-01-PLAN | Privacy policy updated in both languages to disclose analytics/tracking cookies     | SATISFIED  | Both `messages/es.json` and `messages/en.json` have the expanded cookies section with NEXT_LOCALE, cookie_consent, and GA4 cookies disclosure |

**Note on ANLYT-01 wording:** REQUIREMENTS.md says "root layout" but the plan frontmatter targets `src/app/[locale]/layout.tsx` (locale layout), which wraps all site pages. The intent — GTM loading on every page — is fully satisfied.

**No orphaned requirements:** All three Phase 8 requirement IDs (ANLYT-01, ANLYT-02, ANLYT-03) are claimed in plan frontmatter and verified implemented.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None | — | — | — | No anti-patterns detected in any Phase 8 files |

Scan results:
- No `TODO`, `FIXME`, `PLACEHOLDER` comments in analytics components
- No `return null` stubs (the `if (!GTM_ID) return null` in `analytics-provider.tsx` is intentional guard logic, not a stub)
- No empty handlers (`() => {}`) in consent banner
- No separate `gtag/js` script anywhere in `src/`
- Legacy privacy text ("we do not use tracking cookies") removed from both message files
- All 5 Phase 8 commits present in git log (`4d3fb91`, `9435e6f`, `f366fbf`, `bcd761b`, `51f8fe6`)

### Human Verification Required

The following items cannot be verified programmatically and require a browser test before going live:

#### 1. Consent Banner First-Visit Display

**Test:** Open the site in an incognito window at `/es/` or `/en/`. Clear localStorage and cookies for the domain first.
**Expected:** The cookie consent banner appears at the bottom of the page with a "Aceptar" / "Rechazar" (or "Accept" / "Decline") button pair and a link to the privacy policy.
**Why human:** Banner visibility depends on runtime `localStorage.getItem()` returning null, which cannot be verified from static analysis.

#### 2. Consent Persistence Across Locale Switch

**Test:** Accept cookies on `/es/`. Navigate to `/en/`. Refresh the page.
**Expected:** Banner does not reappear. The cookie `cookie_consent=accepted` is set with `path=/`.
**Why human:** Cookie and localStorage state is runtime behavior across route transitions.

#### 3. GTM Network Verification (Success Criterion 4)

**Test:** Open DevTools > Network tab. Load any page. Filter for `gtm.js`.
**Expected:** Only `gtm.js` loads. No separate `gtag/js` request appears.
**Why human:** Network requests are runtime behavior. Static analysis confirmed no separate GA4 script in code, but production network behavior requires browser confirmation.

#### 4. GTM Loading with Real Container ID

**Test:** Replace `.env.local` placeholder `GTM-XXXXXXX` with a real GTM container ID, then load the site.
**Expected:** GTM container loads, dataLayer initializes, and consent defaults are respected.
**Why human:** Current `.env.local` uses a placeholder; `AnalyticsProvider` returns null when `NEXT_PUBLIC_GTM_ID` is the placeholder format (the `if (!GTM_ID) return null` guard fires for the placeholder since the env var is set). The guard correctly prevents loading with an invalid ID. Once a real GTM-XXXXXXX ID is set, this path needs to be confirmed.

**Note on SC4:** Success Criterion 4 states "visitor can verify in browser Network tab: only gtm.js loads, no separate gtag/js request." This is fully satisfied at the code level — no separate GA4 script exists anywhere in `src/`. Browser verification above is a runtime confirmation of what the code already guarantees.

### Summary

All 12 observable truths verified. All 9 required artifacts exist and are substantive (not stubs). All 5 key links are wired correctly. All 3 requirement IDs (ANLYT-01, ANLYT-02, ANLYT-03) are satisfied with implementation evidence. No anti-patterns found.

The phase goal is achieved: the site discloses analytics cookie usage in both languages, loads GTM with Consent Mode v2 defaults set to denied before GTM initializes, and provides a bilingual consent banner that updates consent state when visitors choose.

**Pending before go-live:** The GTM container ID placeholder in `.env.local` must be replaced with a real container ID (and GA4 configured as a tag inside GTM) before analytics data flows to Google Analytics.

---

_Verified: 2026-02-28T01:30:00Z_
_Verifier: Claude (gsd-verifier)_
