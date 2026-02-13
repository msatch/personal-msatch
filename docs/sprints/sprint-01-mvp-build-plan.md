# Sprint 01 - MVP Build Plan

## Goal
Ship a production-ready MVP landing page with a working contact form, analytics instrumentation, and baseline technical quality.

## Duration
- 10 business days

## Scope (Must-Have)
1. Modern one-page landing layout
- Hero
- Problem/Solution
- Services
- Work method
- Trust section
- FAQ
- Contact section

2. Contact form
- Required validation
- Success/error states
- Anti-spam baseline (honeypot + rate limiting or equivalent)
- Delivery pipeline (email + logging destination)

3. Analytics
- CTA click events
- Form start
- Form submit
- Form success

4. Baseline quality
- Mobile-first responsiveness
- Accessibility checks
- SEO metadata and semantic structure

## Out of Scope (For Sprint 02+)
- Advanced A/B testing framework
- Multi-page content hub
- Multi-language toggle
- CRM automation beyond initial routing

## Architecture Decisions
- Frontend framework: React-based stack (Next.js or Vite)
- Deployment: Vercel (or equivalent static/app host)
- Form handling: server endpoint/action with backend validation
- Tracking: GA4 + GTM events

## Work Breakdown

### Track A - UX/UI Implementation
1. Build design tokens and layout primitives
2. Implement section components
3. Integrate motion and interaction polish
4. Responsive pass for mobile/tablet/desktop

### Track B - Contact and Backend Flow
1. Implement form schema and validation
2. Add anti-spam and rate-limit controls
3. Implement send + persistence route
4. Add confirmation and failure handling UX

### Track C - Data and Analytics
1. Define event naming convention
2. Implement client event hooks
3. Verify event payload consistency
4. Validate events in analytics debug view

### Track D - QA and Hardening
1. Functional QA for all sections
2. Browser/device coverage
3. Accessibility checks and fixes
4. SEO and performance baseline checks

## Day-by-Day Plan

### Days 1-2
- Project setup and design system foundation
- Wireframe-to-component scaffold

### Days 3-4
- Core section implementation
- Copy integration and CTA placements

### Days 5-6
- Contact form backend flow and anti-spam
- Analytics event instrumentation

### Days 7-8
- QA cycles, accessibility, responsive fixes
- Performance and SEO optimization pass

### Days 9-10
- Production deployment and smoke tests
- Documentation and handoff

## Acceptance Criteria
1. User can understand the offer in under 20 seconds from hero + services.
2. User can submit form successfully with clear confirmation.
3. Invalid form input surfaces accessible, actionable errors.
4. Core events are visible in analytics.
5. Lighthouse and manual QA show no critical blockers.

## Definition of Done
- MVP deployed to production URL
- Form tested end-to-end in production
- Analytics event checklist verified
- Sprint report published with outcomes and open follow-ups
