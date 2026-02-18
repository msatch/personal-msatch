# Phase 1: Foundation & i18n Scaffolding - Research

**Researched:** 2026-02-18
**Domain:** Next.js 16 project scaffolding, Tailwind CSS 4 design tokens, next-intl bilingual routing
**Confidence:** HIGH

## Summary

Phase 1 replaces the current vanilla HTML/Node.js MVP with a Next.js 16 App Router project that has bilingual routing (Spanish/English), Tailwind CSS 4 design tokens, and translation infrastructure. The existing `server.mjs`, `web/` directory, and old HTML files will be superseded by the new Next.js project structure.

The three core technical domains are: (1) Next.js 16 with App Router, TypeScript, and static generation via `generateStaticParams`; (2) Tailwind CSS 4 with CSS-first configuration using `@theme` for design tokens; and (3) next-intl 4.x for URL-based locale routing (`/es/`, `/en/`), Accept-Language detection, and cookie-based persistence. All three are mature, well-documented, and work together with verified compatibility.

**Primary recommendation:** Scaffold with `create-next-app@latest`, install `next-intl`, configure the `[locale]` dynamic segment and `proxy.ts` from the first commit, define all design tokens in `globals.css` via `@theme`, and use translation JSON files for every user-visible string from day one. The existing MVP files (`server.mjs`, `web/`) are replaced, not modified.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.x | React meta-framework with App Router, static generation, Turbopack | Industry standard for React on Vercel. Turbopack is default in v16. Static generation for all pages. proxy.ts replaces middleware.ts. |
| React | 19.2.x | UI library (bundled with Next.js 16) | Ships with Next.js 16. Server Components reduce client JS. No separate install. |
| TypeScript | ~5.9.x | Type safety | Next.js 16 requires TS >= 5.1. Use latest stable 5.9.x. |
| Tailwind CSS | 4.1.x | Utility-first CSS with CSS-first configuration | v4 uses `@theme` directive for design tokens. Zero-config content detection. 5x faster builds. No `tailwind.config.js` needed. |
| next-intl | 4.8.x | Bilingual ES/EN i18n with URL routing | De facto i18n for Next.js App Router. Handles locale routing via proxy.ts, Accept-Language detection, cookie persistence. Strictly-typed locales in v4. |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | 2.1.x | Conditional className construction | Every component with dynamic classes. 239B gzipped. |
| tailwind-merge | 3.4.x | Resolve Tailwind class conflicts | Create `cn()` utility combining clsx + twMerge. v3.4 supports Tailwind v4. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| next-intl | next-i18next | Never for App Router. next-i18next is Pages Router only. |
| next-intl | Built-in Next.js i18n | Next.js dropped built-in i18n routing in App Router. next-intl fills this gap. |
| Tailwind CSS 4 | CSS Modules | Tailwind's utility approach is faster for single-dev rapid builds. CSS Modules add naming overhead. |
| @theme (CSS-first) | tailwind.config.js | tailwind.config.js is legacy in v4. CSS-first config is the standard. |

**Installation:**
```bash
# Scaffold project (creates Next.js 16 + TypeScript + Tailwind + App Router)
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir

# Core i18n dependency
npm install next-intl

# Supporting utilities
npm install clsx tailwind-merge
```

## Architecture Patterns

### Recommended Project Structure

```
personal-msatch/
├── public/
│   └── favicon.ico
├── messages/
│   ├── en.json                  # English translations
│   └── es.json                  # Spanish translations (primary)
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx       # Root layout: <html lang>, font classes, NextIntlClientProvider
│   │   │   └── page.tsx         # Home page (placeholder for Phase 1)
│   │   └── not-found.tsx        # Global 404 (minimal for Phase 1)
│   ├── components/
│   │   └── ui/
│   │       └── button.tsx       # Shared button (optional seed)
│   ├── i18n/
│   │   ├── routing.ts           # defineRouting({ locales, defaultLocale })
│   │   ├── navigation.ts        # createNavigation(routing) exports
│   │   └── request.ts           # getRequestConfig (loads messages per locale)
│   ├── lib/
│   │   └── utils.ts             # cn() utility (clsx + tailwind-merge)
│   └── styles/
│       └── globals.css          # @import "tailwindcss" + @theme design tokens
├── proxy.ts                     # next-intl locale detection + routing
├── next.config.ts               # createNextIntlPlugin() wrapper
├── postcss.config.mjs           # @tailwindcss/postcss plugin
├── tsconfig.json
├── package.json
└── .env.local                   # (future: RESEND_API_KEY, GTM_ID)
```

### Pattern 1: Locale-Prefixed Static Generation

**What:** Every page is statically generated at build time for each locale (`/en/`, `/es/`) using `generateStaticParams` + `setRequestLocale`.
**When to use:** All pages on this site -- content is known at build time.
**Source:** next-intl docs (https://next-intl.dev/docs/routing/setup)

```typescript
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**Critical note:** In Next.js 16, `params` is a Promise and must be awaited. This is a breaking change from Next.js 15's synchronous `params`.

### Pattern 2: next-intl Three-File Convention

**What:** Three files in `src/i18n/` define routing config, navigation helpers, and request-scoped message loading.
**Source:** next-intl docs (https://next-intl.dev/docs/routing/setup)

```typescript
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'always',
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365 // 1 year
  }
});
```

```typescript
// src/i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

```typescript
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
```

### Pattern 3: proxy.ts for Locale Detection

**What:** Next.js 16 renamed `middleware.ts` to `proxy.ts`. The exported function must be named `proxy` (or default export). Runs on Node.js runtime only (Edge runtime NOT supported).
**Source:** Next.js 16 upgrade guide (https://nextjs.org/docs/app/guides/upgrading/version-16)

```typescript
// proxy.ts (project root or src/)
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
```

**Locale detection priority (built into next-intl middleware):**
1. Locale prefix in pathname (`/es/about`) -- highest priority
2. `NEXT_LOCALE` cookie -- persists user's choice across visits
3. Accept-Language header -- browser's language preference
4. `defaultLocale` (`es`) -- final fallback

### Pattern 4: Tailwind CSS 4 Design Tokens via @theme

**What:** Define all design tokens (colors, fonts, spacing) in CSS using `@theme` directive. No `tailwind.config.js` needed.
**Source:** Tailwind CSS v4 docs (https://tailwindcss.com/docs/theme)

```css
/* src/styles/globals.css */
@import "tailwindcss";

@theme {
  /* === Colors === */
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
  --color-accent: oklch(0.55 0.15 250);       /* Subtle blue accent */
  --color-accent-light: oklch(0.92 0.05 250);
  --color-muted: #6b7280;
  --color-border: #e5e7eb;

  /* === Typography === */
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;

  /* === Spacing (base unit) === */
  --spacing: 0.25rem;

  /* === Border Radius === */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}

@layer base {
  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
  h1, h2, h3, h4, h5, h6 {
    @apply font-bold tracking-tight;
  }
}
```

**Important: `@theme inline` vs `@theme`:**
- Use `@theme inline` when referencing runtime CSS variables (like `var(--font-geist-sans)` from next/font). The `inline` keyword tells Tailwind to keep the `var()` reference rather than resolving it at build time.
- Use plain `@theme` for static values (colors, spacing) that can be resolved at build time.

### Pattern 5: next/font with Tailwind CSS 4

**What:** Load Google Fonts via `next/font/google`, assign CSS variable names, apply to `<body>`, then reference in `@theme inline` in globals.css.
**Source:** Tailwind CSS discussions, Next.js font docs

```typescript
// src/app/[locale]/layout.tsx
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default async function LocaleLayout({ children, params }: Props) {
  // ...
  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* ... */}
      </body>
    </html>
  );
}
```

```css
/* In globals.css -- reference next/font variables */
@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

### Anti-Patterns to Avoid

- **Using `middleware.ts` instead of `proxy.ts`:** Next.js 16 renamed middleware to proxy. Using `middleware.ts` triggers deprecation warnings. The export must be named `proxy`, not `middleware`.
- **Edge runtime for proxy:** Next.js 16 proxy runs on Node.js runtime ONLY. Do not configure Edge runtime.
- **Hardcoding strings in components:** Every user-visible string must go through `t('key')` from day one. "I'll add i18n later" leads to a costly retrofit.
- **Using `tailwind.config.js`:** Tailwind v4 uses CSS-first configuration with `@theme`. The JS config is legacy.
- **Synchronous `params` access:** Next.js 16 made `params` async. Must use `const { locale } = await params;` -- this is a breaking change from v15.
- **Importing `useTranslations` in Server Components:** Use `getTranslations` from `next-intl/server` in Server Components. `useTranslations` is for Client Components only. Mixing these causes hydration errors.
- **Using `output: 'export'`:** Static export disables proxy, Server Actions, and dynamic routes. Standard Vercel deployment auto-optimizes static pages without this flag.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Locale detection from headers | Custom Accept-Language parser | next-intl middleware (built-in) | Uses `@formatjs/intl-localematcher` with "best fit" algorithm. Handles edge cases (e.g., `es-MX` matching `es`). |
| Cookie-based locale persistence | Manual cookie read/write in proxy | next-intl `localeCookie` config | Automatically sets `NEXT_LOCALE` cookie on locale change. Configurable name, maxAge, sameSite. |
| Locale-aware navigation | Custom Link wrapper with locale prefix | `createNavigation(routing)` from next-intl | Provides `<Link>`, `redirect`, `usePathname`, `useRouter` that automatically handle locale prefixes. |
| URL-based locale routing | Custom `[locale]` segment + manual redirects | next-intl routing + proxy | Handles redirect from `/` to `/es/` or `/en/`, 404 for unknown locales, and cookie/header detection in one package. |
| Design token system | Custom CSS variables + manual utility classes | Tailwind CSS 4 `@theme` directive | Automatically generates utility classes from CSS variables. Single source of truth for tokens. |
| Conditional classNames | String concatenation | `clsx` + `tailwind-merge` (`cn()` utility) | Handles conditional classes, merges conflicting Tailwind utilities correctly (e.g., `p-2` + `p-4` = `p-4`). |

**Key insight:** next-intl handles the entire i18n routing lifecycle (detection, persistence, URL rewriting, navigation helpers) in a single package. Building any of these individually is a common source of subtle bugs.

## Common Pitfalls

### Pitfall 1: Forgetting `setRequestLocale` for Static Generation

**What goes wrong:** Pages fail to statically generate and fall back to server-side rendering. Build warnings about dynamic rendering appear.
**Why it happens:** next-intl uses `setRequestLocale(locale)` to enable static rendering. Without it, the translation hooks cannot determine the locale at build time, forcing dynamic rendering.
**How to avoid:** Call `setRequestLocale(locale)` in every layout AND every page component, before any translation hooks.
**Warning signs:** `next build` output shows pages as "dynamic" (lambda symbol) instead of "static" (circle symbol).

### Pitfall 2: Wrong proxy.ts Location

**What goes wrong:** Locale detection does not work. Visiting `/` does not redirect to `/es/` or `/en/`. All pages render without locale prefix.
**Why it happens:** `proxy.ts` must be at the project root (same level as `next.config.ts`) or inside `src/` if using `--src-dir`. Placing it inside `app/` or `i18n/` has no effect.
**How to avoid:** Verify proxy.ts is at `src/proxy.ts` (when using src directory) or project root `proxy.ts`. Check the matcher regex excludes `_next`, `api`, and static files.
**Warning signs:** No console output from proxy function. No `NEXT_LOCALE` cookie set. No locale prefix in URLs.

### Pitfall 3: Mixing `@theme` and `@theme inline`

**What goes wrong:** Font utility classes like `font-sans` don't apply the correct font. Browser DevTools shows the CSS variable is undefined or empty.
**Why it happens:** `next/font` injects CSS variables at runtime via class names on `<body>`. If you reference `var(--font-geist-sans)` inside plain `@theme` (without `inline`), Tailwind tries to resolve it at build time and fails because the variable doesn't exist yet.
**How to avoid:** Use `@theme inline` for any token that references a runtime CSS variable (like fonts from `next/font`). Use plain `@theme` for static values (hex colors, rem spacing).
**Warning signs:** Font displays as system fallback. DevTools shows `--font-sans: var(--font-geist-sans)` but `--font-geist-sans` is not defined (missing class on body element).

### Pitfall 4: Missing `generateStaticParams` in Nested Pages

**What goes wrong:** Build fails with errors about missing static params, or pages are dynamically rendered instead of static.
**Why it happens:** Every page under `[locale]/` needs `generateStaticParams` to tell Next.js which locale values to pre-render. Forgetting this on a new page means Next.js doesn't know what to generate.
**How to avoid:** Template for every new page file:
```typescript
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  // ...
}
```
**Warning signs:** Build output shows lambda symbol for pages that should be static.

### Pitfall 5: Default Locale Should Be Spanish, Not English

**What goes wrong:** First-time visitors without a Spanish Accept-Language header land on the English version. Since the target market is LatAm, this is backwards.
**Why it happens:** Most tutorials default to `defaultLocale: 'en'`. Copying this without changing it means the fallback is English.
**How to avoid:** Set `defaultLocale: 'es'` in the routing config. Spanish is the primary language for the primary audience.
**Warning signs:** Visiting `/` redirects to `/en/` instead of `/es/` for users with neutral Accept-Language headers.

### Pitfall 6: Translation JSON Files Without Namespace Structure

**What goes wrong:** As the site grows, a flat JSON structure becomes unmanageable. Keys like `title`, `description`, `button` collide across pages.
**Why it happens:** Starting with flat keys (`{ "title": "Hello" }`) seems simpler, but it doesn't scale past one page.
**How to avoid:** Use nested namespace structure from day one:
```json
{
  "metadata": {
    "title": "M. Gripe - Consultoria",
    "description": "..."
  },
  "home": {
    "hero": {
      "title": "...",
      "subtitle": "..."
    }
  },
  "common": {
    "cta": "Agenda tu diagnostico",
    "language": "Idioma"
  }
}
```
Access with: `t('home.hero.title')` or `const t = useTranslations('home.hero')`.
**Warning signs:** Multiple keys with the same name. No clear grouping by page or section.

## Code Examples

Verified patterns from official sources:

### next.config.ts Setup
```typescript
// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
```
Source: next-intl plugin docs (https://next-intl.dev/docs/usage/plugin)

### Translation JSON Structure
```json
// messages/es.json
{
  "metadata": {
    "title": "M. Gripe | Consultoria Tecnica y de Negocios",
    "description": "Ayudo a empresas en LatAm a convertir objetivos de negocio en ejecucion tecnica con claridad, velocidad y resultados medibles."
  },
  "common": {
    "cta": "Agenda tu diagnostico de 45 min",
    "language": "Idioma",
    "nav": {
      "home": "Inicio",
      "bio": "Bio",
      "services": "Servicios",
      "contact": "Contacto"
    }
  },
  "home": {
    "hero": {
      "title": "Convierto objetivos de negocio en ejecucion tecnica",
      "subtitle": "Consultoria estrategica y tecnica para fundadores, gerentes y PYMEs en Latinoamerica"
    }
  }
}
```

```json
// messages/en.json
{
  "metadata": {
    "title": "M. Gripe | Technical & Business Consulting",
    "description": "I help companies in LatAm convert business goals into technical execution with clarity, speed, and measurable outcomes."
  },
  "common": {
    "cta": "Book your 45-min diagnostic",
    "language": "Language",
    "nav": {
      "home": "Home",
      "bio": "Bio",
      "services": "Services",
      "contact": "Contact"
    }
  },
  "home": {
    "hero": {
      "title": "Converting business goals into technical execution",
      "subtitle": "Strategic and technical consulting for founders, managers, and SMEs in Latin America"
    }
  }
}
```

### Using Translations in a Server Component
```typescript
// src/app/[locale]/page.tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home.hero');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center max-w-4xl">
        {t('title')}
      </h1>
      <p className="mt-6 text-lg md:text-xl text-muted text-center max-w-2xl">
        {t('subtitle')}
      </p>
    </main>
  );
}
```

### cn() Utility Function
```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Design Tokens: Complete globals.css
```css
/* src/styles/globals.css */
@import "tailwindcss";

/* Static design tokens */
@theme {
  /* === Brand Colors === */
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
  --color-accent: oklch(0.55 0.15 250);
  --color-accent-light: oklch(0.92 0.05 250);
  --color-accent-dark: oklch(0.40 0.15 250);
  --color-muted: #6b7280;
  --color-muted-foreground: #9ca3af;
  --color-border: #e5e7eb;

  /* === Spacing (base: 0.25rem = 4px) === */
  --spacing: 0.25rem;

  /* === Border Radius === */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}

/* Runtime font tokens (from next/font CSS variables) */
@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

/* Base styles */
@layer base {
  body {
    @apply bg-background text-foreground font-sans antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-bold tracking-tight text-foreground;
  }

  /* Touch-friendly tap targets (DES-04: min 44x44px) */
  button, a, [role="button"] {
    @apply min-h-[44px] min-w-[44px];
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `middleware.ts` | `proxy.ts` | Next.js 16 (2025) | Function export named `proxy`, not `middleware`. Config flags renamed (e.g., `skipProxyUrlNormalize`). Edge runtime not supported for proxy. |
| `tailwind.config.js` | `@theme` in CSS | Tailwind CSS 4.0 (2025) | Design tokens defined in CSS, not JavaScript. Auto-generates CSS variables and utility classes. |
| Synchronous `params` | `params: Promise<{}>` + `await` | Next.js 16 (2025) | All dynamic route params must be awaited. Breaking change from v15. |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` | Tailwind CSS 4.0 (2025) | Single import replaces three directives. |
| Turbopack opt-in (`--turbopack`) | Turbopack default | Next.js 16 (2025) | No `--turbopack` flag needed. Use `--webpack` to opt out. |
| `next lint` command | ESLint CLI directly | Next.js 16 (2025) | `next lint` removed. Use `eslint .` directly. ESLint Flat Config is the default. |
| Zod v3 | Zod v4 (not needed in Phase 1) | July 2025 | Major perf improvements. Use v4 when Contact form is built (Phase 5). |

**Deprecated/outdated:**
- `middleware.ts`: Renamed to `proxy.ts` in Next.js 16. Still works but triggers deprecation warnings.
- `tailwind.config.js`: Legacy configuration method. Tailwind v4 uses CSS-first `@theme`.
- `next lint`: Removed in Next.js 16. Use ESLint directly.
- `next/legacy/image`: Deprecated. Use `next/image`.
- `@tailwind` directives: Replaced by `@import "tailwindcss"` in v4.

## Open Questions

1. **Accent color selection**
   - What we know: Requirements specify "one subtle accent color" (DES-01). The design should be light/white with black typography.
   - What's unclear: The exact accent color is not specified. The project research references visual references "Rania Kalogirou (clean, minimal, CTA-driven)" and "Softlimit (polished, micro-interactions, accent color)" but no specific color.
   - Recommendation: Use a subtle blue accent (oklch-based for Display P3 support). This is neutral, professional, and works well with black typography on white. Easy to change later since it's a single CSS variable in `@theme`. Define it as `--color-accent` and reference everywhere.

2. **Font selection**
   - What we know: Requirements say "Bold typography with strong visual hierarchy" (DES-02) and "Distinctive typography (not generic defaults)" from the master plan.
   - What's unclear: Whether to use the default Geist font from create-next-app or choose a different Google Font.
   - Recommendation: Start with Geist Sans (shipped with create-next-app). It is a modern, professional sans-serif designed for Vercel/Next.js. Add a display font (like Inter or a more distinctive option) later if needed. The font is configured via CSS variable, making it trivial to swap.

3. **Existing files disposition**
   - What we know: The project currently has `server.mjs`, `web/index.html`, `web/styles.css`, `web/app.js` -- a vanilla Node.js MVP.
   - What's unclear: Whether to delete these files or keep them alongside the new Next.js project during development.
   - Recommendation: The new Next.js project replaces the old MVP entirely. These files should be removed once the new project is scaffolded and running, since Next.js provides its own dev server, styling system, and routing. Keeping both creates confusion. Remove `server.mjs`, `web/` directory, and update `package.json` scripts.

4. **PostCSS config format**
   - What we know: Tailwind v4 uses `@tailwindcss/postcss` plugin. create-next-app may generate a `postcss.config.mjs`.
   - What's unclear: Whether create-next-app@latest already generates the correct v4 PostCSS config.
   - Recommendation: Verify the generated config uses `@tailwindcss/postcss`. If it uses the old `tailwindcss` and `autoprefixer` plugins, replace with:
   ```javascript
   export default {
     plugins: {
       "@tailwindcss/postcss": {},
     },
   };
   ```

## Sources

### Primary (HIGH confidence)
- next-intl routing setup docs: https://next-intl.dev/docs/routing/setup -- routing.ts, navigation.ts, request.ts setup
- next-intl proxy/middleware docs: https://next-intl.dev/docs/routing/middleware -- proxy.ts configuration, locale detection, cookie persistence
- next-intl routing configuration: https://next-intl.dev/docs/routing/configuration -- localePrefix, localeCookie, localeDetection options
- next-intl plugin docs: https://next-intl.dev/docs/usage/plugin -- createNextIntlPlugin for next.config.ts
- Next.js 16 upgrade guide: https://nextjs.org/docs/app/guides/upgrading/version-16 -- proxy.ts rename, async params, Turbopack default, breaking changes
- Next.js proxy.ts docs: https://nextjs.org/docs/app/getting-started/proxy -- file convention, matcher, request/response API
- Next.js proxy.ts API reference: https://nextjs.org/docs/app/api-reference/file-conventions/proxy -- detailed API
- Tailwind CSS v4 @theme docs: https://tailwindcss.com/docs/theme -- theme variables, namespaces, @theme inline
- Tailwind CSS v4 release blog: https://tailwindcss.com/blog/tailwindcss-v4 -- CSS-first config, installation, breaking changes
- Tailwind CSS custom styles docs: https://tailwindcss.com/docs/adding-custom-styles -- @layer base, custom utilities

### Secondary (MEDIUM confidence)
- Google Fonts + Tailwind v4 setup: https://www.buildwithmatija.com/blog/how-to-use-custom-google-fonts-in-next-js-15-and-tailwind-v4 -- @theme inline for font variables
- Tailwind v4 font variable discussion: https://github.com/tailwindlabs/tailwindcss/discussions/15267 -- next/font + @theme integration pattern
- Next.js font CSS variables discussion: https://github.com/vercel/next.js/discussions/77337 -- troubleshooting font variables with Tailwind v4
- Tailwind + Next.js setup guide: https://designrevision.com/blog/tailwind-nextjs-setup -- 2026 setup patterns

### Tertiary (LOW confidence)
- None -- all findings verified with primary or secondary sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- All libraries verified via official docs and npm. Versions confirmed. Compatibility verified.
- Architecture: HIGH -- next-intl three-file convention, proxy.ts pattern, and Tailwind @theme are all documented in official sources with exact code examples.
- Pitfalls: HIGH -- Pitfalls drawn from official upgrade guides (async params), documented breaking changes (proxy.ts rename), and verified community patterns (@theme inline for fonts).

**Research date:** 2026-02-18
**Valid until:** 2026-03-18 (stable ecosystem, 30-day validity)
