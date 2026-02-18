# Stack Research

**Domain:** Personal brand consulting website (multi-page, bilingual, serverless contact form)
**Researched:** 2026-02-16
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| Next.js | 16.1.x (latest 16.1.6) | React meta-framework, SSG, routing, API routes | Industry standard for React websites on Vercel. App Router is stable in v16. Turbopack default for dev/build. Static export support for near-zero cost hosting. Built-in image optimization. | HIGH |
| React | 19.2.x (bundled with Next.js 16) | UI library | Ships with Next.js 16. Server Components reduce client JS bundle. No separate install needed. | HIGH |
| TypeScript | ~5.9.x (stable: 5.9.3) | Type safety | Next.js 16 requires TS >= 5.1. Use latest stable 5.9.x. Do NOT use 6.0 beta in production. | HIGH |
| Tailwind CSS | 4.1.x (latest 4.1.18) | Utility-first CSS | v4 is 5x faster full builds, 100x faster incremental. Zero-config with automatic content detection. CSS-first configuration (no tailwind.config.js). Perfect for minimal/light design with accent colors via CSS custom properties. | HIGH |
| next-intl | 4.8.x (latest 4.8.3) | Bilingual ES/EN internationalization | De facto i18n standard for Next.js App Router. Strictly-typed locales and ICU arguments in v4. Works with Server Components and static rendering. Handles locale routing via `proxy.ts` (renamed from middleware.ts in Next.js 16). | HIGH |

### Email & Contact Form

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| Resend | 6.9.x (latest 6.9.2) | Serverless email delivery API | Developer-first email API. Generous free tier (100 emails/day, 3,000/month). Works natively with Next.js API routes / Server Actions. Simple SDK. No SMTP config. | HIGH |
| @react-email/components | 0.0.x (latest) | Email template components | Build email templates as React components. Works with Resend's `react` parameter. Supports Tailwind 4. Optional but recommended for styled confirmation emails. | MEDIUM |
| react-hook-form | 7.71.x (latest 7.71.1) | Form state management | Minimal re-renders, uncontrolled inputs by default. 8,500+ dependents on npm. Best DX for single contact form. | HIGH |
| @hookform/resolvers | 5.2.x (latest 5.2.2) | Schema validation bridge | Connects Zod schemas to react-hook-form. v5 added type inference from schema. | HIGH |
| Zod | 4.3.x (latest 4.3.6) | Schema validation | TypeScript-first validation. Shared schema between client form and server API route. v4 has major perf improvements over v3. Use with @hookform/resolvers >= 5.2.1 (which requires zod >= 3.25.0 for zod/v4/core). | HIGH |

### Analytics

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| @next/third-parties | 16.1.x (latest 16.1.6) | GTM + GA4 integration | Official Next.js package. Optimized loading (no layout shift). GoogleTagManager and GoogleAnalytics components. sendGTMEvent for custom events. | HIGH |
| Google Tag Manager | N/A (cloud service) | Tag management | Manages GA4 + any future tags (Meta Pixel, LinkedIn, etc.) without code changes. Single GTM container ID in code. | HIGH |
| Google Analytics 4 | N/A (cloud service) | Website analytics | Free, industry standard. Configure via GTM for zero-code event additions. | HIGH |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | 2.1.1 | Conditional className construction | Every component with dynamic classes. 239B gzipped. |
| tailwind-merge | 3.4.x (latest 3.4.1) | Resolve Tailwind class conflicts | Create a `cn()` utility combining clsx + twMerge. Essential for component variants. v3.4 supports Tailwind v4. |
| lucide-react | 0.564.x (latest 0.564.0) | SVG icon library | Icons for nav, services cards, contact info, language toggle. Tree-shakeable. 1,500+ icons. |
| motion | 12.34.x (latest 12.34.0) | Page/element animations | Scroll animations, page transitions, hero entrance effects. Successor to framer-motion (same package maintainer, new name). Use `motion` not `framer-motion` for new projects. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint | Linting | Ships with `npx create-next-app`. Next.js 16 includes eslint-config-next. |
| Prettier | Code formatting | Add prettier-plugin-tailwindcss for automatic class sorting. |
| next dev --inspect | Debugging | New in Next.js 16.1 for easier server-side debugging. |

### Infrastructure

| Technology | Purpose | Why Recommended | Confidence |
|------------|---------|-----------------|------------|
| Vercel | Hosting + Serverless | Native Next.js platform. Free SSL, CDN, preview deployments. Serverless functions for contact form API route. **WARNING: Hobby (free) plan is personal/non-commercial use ONLY. A consulting website that generates revenue likely requires Pro plan ($20/mo). See "Pitfalls" section.** | HIGH |
| Vercel Pro | Production hosting | $20/month. Required for commercial use. 1M function invocations, 1TB bandwidth, 24,000 build minutes. Recommended for a consulting website. | HIGH |
| Node.js | Runtime | >= 20.x required by Next.js 16. proxy.ts (formerly middleware.ts) runs on Node.js runtime only (Edge runtime NOT supported in Next.js 16 proxy). | HIGH |

## Installation

```bash
# Scaffold project
npx create-next-app@latest mgripe --typescript --tailwind --eslint --app --src-dir

# Core dependencies (most ship with create-next-app)
npm install next-intl resend react-hook-form @hookform/resolvers zod

# Analytics
npm install @next/third-parties

# Supporting
npm install clsx tailwind-merge lucide-react motion

# Dev dependencies
npm install -D prettier prettier-plugin-tailwindcss @react-email/components
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| next-intl | next-i18next | Never for App Router. next-i18next is Pages Router only. next-intl is the clear winner for App Router. |
| next-intl | Built-in Next.js i18n | Next.js dropped built-in i18n routing in App Router. next-intl fills this gap. |
| Resend | SendGrid | If you need >3,000 emails/month on free tier (SendGrid offers 100/day). Resend has better DX and React Email integration. |
| Resend | EmailJS | If you want zero-backend client-side email (no API route). But exposes API keys in client, less secure, limited templates. |
| Zod | Yup | Never for new TypeScript projects. Zod has native TS inference, Yup bolted it on. Zod v4 is significantly faster. |
| react-hook-form | Formik | Never. Formik is effectively unmaintained. react-hook-form has better perf (uncontrolled inputs) and active development. |
| motion | framer-motion | Same library, rebranded. `motion` is the new package name. `framer-motion` still works but `motion` is the forward path. |
| motion | CSS animations only | For a minimal site, CSS @keyframes + Tailwind animate utilities may suffice. Use motion only if you want scroll-triggered or orchestrated animations. |
| Tailwind CSS | CSS Modules | Never for this project. Tailwind's utility approach is faster for rapid single-dev builds. CSS Modules add naming overhead with no team coordination benefit for a solo project. |
| lucide-react | react-icons | react-icons bundles entire icon sets, larger bundle. lucide-react is tree-shakeable with consistent design language. |
| Vercel | Netlify | If Vercel commercial terms are a blocker. Netlify has similar free tier without the strict non-commercial clause. But Next.js runs best on Vercel (native platform). |
| Vercel | Cloudflare Pages | If you want truly free hosting with no commercial restrictions. But Next.js support on Cloudflare is via @cloudflare/next-on-pages adapter and has limitations (no ISR, limited API route compat). |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `framer-motion` (package name) | Rebranded to `motion`. `framer-motion` still works but is legacy. New projects should use the new name. | `motion` |
| Formik | Effectively unmaintained since 2023. Last meaningful release was years ago. Performance issues with controlled inputs. | `react-hook-form` |
| next-i18next | Only works with Pages Router. Does not support App Router or Server Components. | `next-intl` |
| i18next + react-i18next (raw) | Requires manual setup for App Router, no built-in routing support, no proxy.ts integration. next-intl wraps all of this. | `next-intl` |
| styled-components / Emotion | CSS-in-JS has runtime cost. Server Components don't support them well. Tailwind is zero-runtime. | Tailwind CSS |
| Nodemailer | Requires SMTP server configuration. More setup, more moving parts. Resend is a managed service with simpler API. | `resend` |
| Pages Router | Legacy routing system. App Router is stable and default in Next.js 16. All new projects should use App Router. | App Router |
| middleware.ts | Renamed to proxy.ts in Next.js 16. Using middleware.ts will trigger deprecation warnings. | `proxy.ts` |
| Edge Runtime (for proxy) | Next.js 16 proxy.ts runs on Node.js runtime only. Edge runtime is NOT supported for proxy. Don't configure it. | Node.js runtime (default) |
| Zod v3 | v4 released July 2025 with major perf improvements. @hookform/resolvers v5.2.1+ requires zod >= 3.25.0 anyway for v4/core. | Zod v4 (^4.3.0) |
| CMS (Contentful, Sanity, etc.) | Overkill for 4 static pages with known content. Adds complexity, API calls, and potential cost. Content lives in code/JSON. | Hardcoded content in locale JSON files |
| Database (Supabase, PlanetScale, etc.) | No dynamic data. Contact form sends email, no storage needed. If you later want form submission history, add a DB then. | None (stateless contact form) |

## Stack Patterns by Variant

**If motion animations feel heavy for a minimal site:**
- Use Tailwind CSS `animate-*` utilities + `@keyframes` in globals.css
- Because: Zero additional JS. Tailwind 4 has built-in animation utilities.

**If Vercel commercial terms are a dealbreaker:**
- Use Vercel Pro ($20/mo) for production
- Because: Native Next.js support, best DX, preview deployments. The $20/mo is trivial for a consulting business.

**If you want to start free and upgrade later:**
- Deploy on Vercel Hobby during development/pre-launch
- Upgrade to Pro before publicly promoting the consulting services
- Because: Same infrastructure, just a plan change. No migration needed.

**If email volume grows beyond Resend free tier:**
- Resend Pro starts at $20/mo for 50,000 emails/month
- Because: Same API, no code changes. Just a billing upgrade.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| next@16.1.x | react@19.2.x, react-dom@19.2.x | React ships with Next.js. Do not install separately. |
| next@16.1.x | typescript@>=5.1 | Use 5.9.x stable. Do NOT use 6.0 beta. |
| next@16.1.x | node@>=20 | Node 20 LTS or 22 LTS. |
| next-intl@4.8.x | next@>=14 | Fully compatible with Next.js 16 App Router. Uses proxy.ts. |
| tailwind-merge@3.4.x | tailwindcss@4.0-4.1 | v3.4 explicitly supports Tailwind v4. Do NOT use tailwind-merge v2 with Tailwind v4. |
| @hookform/resolvers@5.2.x | zod@>=3.25.0 or zod@^4.0.0 | v5.2.1 depends on zod/v4/core. Works with Zod 4.3.x. |
| @hookform/resolvers@5.2.x | react-hook-form@^7.0.0 | Stable pairing. |
| @next/third-parties@16.1.x | next@16.1.x | Version should match your Next.js version. |
| @react-email/components | react@^19.0.0 | React Email 5.0 supports React 19.2. |
| motion@12.x | react@>=18 | Supports React 19. |

## Key Architecture Note: Next.js 16 proxy.ts

Next.js 16 renamed `middleware.ts` to `proxy.ts`. This is NOT just cosmetic:
- The exported function must be named `proxy` (not `middleware`)
- Config flags renamed: `skipMiddlewareUrlNormalize` -> `skipProxyUrlNormalize`
- Runs on Node.js runtime ONLY (Edge runtime dropped for proxy)
- next-intl documentation references this change; use their proxy.ts setup guide

A codemod is available: `npx @next/codemod@latest upgrade` handles the rename automatically.

## Vercel Hosting: Commercial Use Warning

**Critical for this project:** Vercel's Hobby (free) plan is restricted to personal, non-commercial use. A consulting website that promotes paid services and generates business leads is commercial use. Options:

1. **Vercel Pro ($20/mo)** -- Recommended. Same platform, compliant with terms.
2. **Develop on Hobby, launch on Pro** -- Use free tier during build phase, upgrade before go-live.
3. **Netlify free tier** -- No explicit commercial restriction but inferior Next.js support.

The $20/month is a negligible business expense for a consulting practice.

## Sources

- [Next.js 16.1 blog post](https://nextjs.org/blog/next-16-1) -- Turbopack stable, React Compiler stable
- [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16) -- proxy.ts rename, TS/Node requirements
- [next-intl 4.0 release](https://next-intl.dev/blog/next-intl-4-0) -- Strictly-typed locales, revamped types
- [next-intl App Router docs](https://next-intl.dev/docs/getting-started/app-router) -- Setup with proxy.ts
- [Tailwind CSS v4.0 release](https://tailwindcss.com/blog/tailwindcss-v4) -- CSS-first config, perf improvements
- [Resend Next.js docs](https://resend.com/docs/send-with-nextjs) -- API route integration
- [React Email 5.0](https://resend.com/blog/react-email-5) -- React 19.2, Tailwind 4 support
- [@next/third-parties docs](https://nextjs.org/docs/app/guides/third-party-libraries) -- GTM/GA4 components
- [Vercel Hobby plan docs](https://vercel.com/docs/plans/hobby) -- Non-commercial restriction
- [Vercel Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines) -- Commercial usage definition
- [Next.js proxy.ts rename](https://nextjs.org/docs/messages/middleware-to-proxy) -- Migration details
- [Zod v4 release notes](https://zod.dev/v4) -- Performance improvements, new API
- [npm: resend@6.9.2](https://www.npmjs.com/package/resend) -- Latest version verified
- [npm: next-intl@4.8.3](https://www.npmjs.com/package/next-intl) -- Latest version verified
- [npm: motion@12.34.0](https://www.npmjs.com/package/motion) -- Latest version verified
- [npm: tailwindcss@4.1.18](https://www.npmjs.com/package/tailwindcss) -- Latest version verified
- [npm: react-hook-form@7.71.1](https://www.npmjs.com/package/react-hook-form) -- Latest version verified
- [npm: zod@4.3.6](https://www.npmjs.com/package/zod) -- Latest version verified
- [npm: @hookform/resolvers@5.2.2](https://www.npmjs.com/package/@hookform/resolvers) -- Latest version verified
- [npm: lucide-react@0.564.0](https://www.npmjs.com/package/lucide-react) -- Latest version verified
- [npm: tailwind-merge@3.4.1](https://www.npmjs.com/package/tailwind-merge) -- Latest version verified

---
*Stack research for: M. Gripe personal brand consulting website*
*Researched: 2026-02-16*
