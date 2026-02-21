# Phase 5: Contact Form & Conversion - Research

**Researched:** 2026-02-21
**Domain:** Contact form with server-side validation, email delivery via Resend, honeypot spam protection, WhatsApp CTA integration, accessible bilingual error handling
**Confidence:** HIGH

## Summary

Phase 5 replaces the Contact page stub with a fully functional contact form and adds a WhatsApp CTA button visible on all pages. The form collects name, email, message (required) plus company and service interest (optional), validates client-side with HTML attributes and server-side with Zod, and sends an email notification via Resend when submission succeeds. A honeypot hidden field silently discards bot submissions. The WhatsApp button links via `wa.me` with a pre-filled Spanish message.

This phase introduces the first client-side interactivity beyond the mobile menu. The contact form requires `'use client'` because it uses React 19's `useActionState` hook for managing form state, pending status, and server action responses. The server action itself runs exclusively on the server (marked with `'use server'`), validates with Zod, checks the honeypot, and calls the Resend API. The Zod validation schema is shared between server action and client to enable both server validation (authoritative) and client-side validation (UX convenience). Error messages are displayed using `aria-live="polite"` regions for screen reader accessibility and are translated via next-intl.

The WhatsApp CTA is a separate concern -- a sticky floating button on mobile and a visible button in the layout on all pages. It requires modification to the locale layout or a new global component rendered within the `NextIntlClientProvider`. The button links to `https://wa.me/{PHONE}?text={encoded_message}` with a pre-filled Spanish message.

New dependencies are needed: `resend` (email API SDK) and `zod` (schema validation). Both are lightweight, stable, and the standard stack for this pattern in the Next.js ecosystem. The `.env.example` already defines `LEADS_FILE`, `MAX_SUBMISSIONS_PER_WINDOW`, and `RATE_LIMIT_WINDOW_MS` variables, suggesting a previously discussed file-based backup and rate limiting strategy. The requirements specify email via Resend (CONT-04), so Resend is the primary delivery mechanism. Rate limiting protects against abuse beyond what the honeypot catches.

**Primary recommendation:** Build the contact form as a client component (`src/components/contact/contact-form.tsx`) using `useActionState` with a server action in `src/app/[locale]/contact/actions.ts`. Use Zod 4 for validation with a shared schema in `src/lib/schemas/contact.ts`. Use Resend's `html` parameter (no react-email dependency needed for a simple notification email). Add the WhatsApp floating button as a layout-level component in `src/components/layout/whatsapp-button.tsx`. All error and success messages must be in the translation files under a `contact.*` namespace.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONT-01 | Contact form with fields: name, email, message (required) + company, service interest (optional) | Form component with 5 fields. Required fields use HTML `required` attribute + Zod `.min(1)`. Optional fields use Zod `.optional()`. Service interest as `<select>` dropdown with 4 service options + "Other". All labels and placeholders from `contact.*` translations. |
| CONT-02 | Client-side form validation with accessible error messages in current language | HTML5 `required` + `type="email"` for basic client-side validation. Zod schema can also be used client-side for richer validation. Error messages rendered in `<p aria-live="polite">` regions below each field. Messages from translation files (`contact.errors.*` namespace). `aria-describedby` links inputs to their error messages. `aria-invalid` on fields with errors. |
| CONT-03 | Server-side validation with Zod before sending email | Zod schema with `safeParse()` in the server action. Schema validates: name (string, min 1, max 200), email (string, email format), message (string, min 10, max 5000), company (string, optional), serviceInterest (string, optional). Returns flattened field errors on failure. Uses Zod 4 unified `error` parameter for custom messages. |
| CONT-04 | Email delivery via Resend Server Action on form submission | Server action calls `resend.emails.send()` with `html` parameter (simple HTML template, no react-email dependency needed). Sends to site owner's email. `from` uses verified Resend domain. `replyTo` set to the submitter's email for easy response. `RESEND_API_KEY` env variable. Free tier: 3,000 emails/month (sufficient for contact form). |
| CONT-05 | Honeypot hidden field to catch spam bots (silent discard) | Hidden input field rendered via CSS (`position: absolute; left: -9999px; opacity: 0`). Field name should be plausible (e.g., `website` or `company_url`). `autocomplete="one-time-code"` prevents browser autofill. `tabindex="-1"` prevents keyboard focus. Server action checks if field has value; if so, returns fake success (silent discard). |
| CONT-06 | Clear success message after submission with response time expectation | On successful submission, server action returns `{ success: true }`. Form component renders a success panel replacing the form. Message: "Thank you! We'll respond within 24-48 business hours." / Spanish equivalent. Translated via `contact.success.*` namespace. |
| CONT-07 | Clear error message if submission fails with retry option | On Resend API failure, server action returns `{ success: false, error: 'server_error' }`. Form renders error message with a "Try again" button. `useActionState` preserves form field values so the user does not lose their input. Error message from `contact.errors.serverError` translation key. |
| CONT-08 | WhatsApp CTA button visible on all pages (sticky on mobile) | New `WhatsAppButton` component in `src/components/layout/whatsapp-button.tsx`. Rendered in the locale layout (inside `NextIntlClientProvider`). On mobile: fixed position bottom-right, floating above content (`fixed bottom-4 right-4 z-40`). On desktop: same position or integrated in footer. Uses WhatsApp green brand color. SVG WhatsApp icon. |
| CONT-09 | WhatsApp link with pre-filled Spanish message via wa.me URL | Link format: `https://wa.me/{PHONE_NUMBER}?text={URL_ENCODED_MESSAGE}`. Phone number in international format without +, spaces, or dashes. Pre-filled message in Spanish (primary market): "Hola, me interesa conocer mas sobre tus servicios de consultoria." URL-encoded. WhatsApp number should be configurable (env var or config constant). |
</phase_requirements>

## Standard Stack

### Core (already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.x | App Router, Server Actions (`'use server'`), `useActionState` from React 19 | Server Actions are the official pattern for form handling. No API routes needed. |
| React | 19.2.x | `useActionState` hook for form state management, `'use client'` directive | React 19 `useActionState` replaces the old `useFormState`. Returns `[state, formAction, pending]`. |
| Tailwind CSS | 4.1.x | Form styling, responsive layout, floating button positioning | All design tokens already defined. Form inputs use border/focus utilities. |
| next-intl | 4.8.x | `useTranslations` for client component, `getTranslations` for server side, translated error messages | Contact form is a client component (`useTranslations`). Page wrapper uses `getTranslations`. |
| clsx + tailwind-merge | 2.1.x / 3.4.x | `cn()` for conditional class names | Error state styling, pending state styling. |

### New Dependencies

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|-------------|
| zod | ^4.3.x | Form validation schema (shared between client and server) | Official recommendation from Next.js docs for server action validation. Zod 4 is current stable with unified `error` parameter, 14x faster parsing. |
| resend | ^6.9.x | Email delivery API | Requirements specify Resend (CONT-04). Official Next.js integration. Free tier: 3,000 emails/month. Simple SDK: `resend.emails.send()`. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zod 4 (`zod@^4`) | Zod 3 (`zod@^3`) | Zod 4 is current stable, 14x faster, smaller bundle (5.4kb gzip vs 12.5kb). Unified `error` parameter replaces `message`/`required_error`/`invalid_type_error`. Use Zod 4. |
| Resend (API) | Nodemailer + SMTP | Nodemailer requires SMTP server configuration, credential management, and connection handling. Resend is a single API call. Free tier is adequate for a contact form. |
| Resend with `html` string | Resend with react-email components | react-email adds a dependency for beautifully styled emails. For a simple contact notification email to the site owner, an HTML string is sufficient. Add react-email later if customer-facing emails are needed. |
| react-hook-form + Zod resolver | Native form + useActionState + Zod | react-hook-form adds a dependency and `ref` registration complexity. For a 5-field form, native `useActionState` + Zod is simpler and aligns with the official Next.js pattern. No additional library needed. |
| reCAPTCHA | Honeypot field | reCAPTCHA adds Google dependency, cookie consent implications, UX friction, and accessibility issues. Honeypot is invisible to real users, zero-friction, and effective against most bots. Adequate for a low-traffic consulting site. |
| In-memory rate limiting | Redis-based rate limiting (Upstash) | For a solo consultant's contact form deployed on Vercel, in-memory rate limiting is adequate. It resets on cold starts but that is acceptable. Redis adds cost and complexity for negligible benefit at this scale. |

**Installation:**
```bash
npm install zod resend
```

## Architecture Patterns

### Recommended Project Structure (Phase 5 additions)

```
src/
├── app/
│   └── [locale]/
│       ├── contact/
│       │   ├── page.tsx                        # MODIFY: Replace stub with form composition
│       │   └── actions.ts                      # NEW: Server action for form submission
│       └── layout.tsx                          # MODIFY: Add WhatsAppButton component
├── components/
│   ├── contact/
│   │   └── contact-form.tsx                   # NEW: Client component with useActionState
│   └── layout/
│       └── whatsapp-button.tsx                # NEW: Floating WhatsApp CTA
├── lib/
│   ├── schemas/
│   │   └── contact.ts                         # NEW: Shared Zod validation schema
│   └── resend.ts                              # NEW: Resend client initialization
messages/
├── es.json                                     # MODIFY: Add contact.* namespace
└── en.json                                     # MODIFY: Add contact.* namespace
.env.example                                    # MODIFY: Add RESEND_API_KEY, WHATSAPP_NUMBER
```

### Pattern 1: Server Action with useActionState

**What:** A server action that receives `prevState` as its first argument (required by `useActionState`) and `FormData` as its second. Returns a typed state object with success/error information.
**When to use:** CONT-03, CONT-04, CONT-05, CONT-06, CONT-07 -- the core form submission flow.

```typescript
// src/app/[locale]/contact/actions.ts
'use server';

import { z } from 'zod';
import { Resend } from 'resend';
import { contactSchema } from '@/lib/schemas/contact';

const resend = new Resend(process.env.RESEND_API_KEY);

export type ContactFormState = {
  success: boolean | null;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // 1. Honeypot check (CONT-05)
  const honeypot = formData.get('website_url');
  if (honeypot) {
    // Silently discard -- return fake success
    return { success: true, message: 'success' };
  }

  // 2. Extract and validate (CONT-03)
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    company: formData.get('company') || undefined,
    serviceInterest: formData.get('serviceInterest') || undefined,
  };

  const result = contactSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  // 3. Send email via Resend (CONT-04)
  try {
    await resend.emails.send({
      from: 'M. Gripe Website <noreply@mgripe.com>',
      to: ['contact@mgripe.com'],
      replyTo: result.data.email,
      subject: `New contact: ${result.data.name}`,
      html: buildEmailHtml(result.data),
    });

    return { success: true, message: 'success' };
  } catch {
    return {
      success: false,
      message: 'server_error',
    };
  }
}
```

### Pattern 2: Client Form Component with useActionState

**What:** A `'use client'` component that manages form state, pending status, and displays validation errors or success messages accessibly.
**When to use:** CONT-01, CONT-02, CONT-06, CONT-07 -- the form UI.

```typescript
// src/components/contact/contact-form.tsx
'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { submitContactForm, type ContactFormState } from '@/app/[locale]/contact/actions';

const initialState: ContactFormState = {
  success: null,
};

export function ContactForm() {
  const t = useTranslations('contact');
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  // Show success panel after successful submission
  if (state.success === true) {
    return (
      <div className="rounded-lg border border-accent bg-accent-light p-8 text-center">
        <h3 className="text-xl font-bold">{t('success.title')}</h3>
        <p className="mt-2 text-muted">{t('success.message')}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-6">
      {/* Server error message (CONT-07) */}
      {state.message === 'server_error' && (
        <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4">
          <p className="text-red-800">{t('errors.serverError')}</p>
        </div>
      )}

      {/* Name field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          {t('fields.name.label')} *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          aria-required="true"
          aria-invalid={!!state.errors?.name}
          aria-describedby={state.errors?.name ? 'name-error' : undefined}
          className="mt-1 w-full rounded-md border border-border px-4 py-3 ..."
        />
        {state.errors?.name && (
          <p id="name-error" aria-live="polite" className="mt-1 text-sm text-red-600">
            {t('errors.nameRequired')}
          </p>
        )}
      </div>

      {/* ... more fields ... */}

      {/* Honeypot (CONT-05) */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
      >
        <label htmlFor="website_url">Website</label>
        <input
          id="website_url"
          name="website_url"
          type="text"
          tabIndex={-1}
          autoComplete="one-time-code"
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent px-6 py-4 font-bold text-white ..."
      >
        {pending ? t('fields.submit.sending') : t('fields.submit.label')}
      </button>
    </form>
  );
}
```

### Pattern 3: Shared Zod Validation Schema

**What:** A single Zod schema used in both the server action (authoritative validation) and optionally on the client for immediate feedback.
**When to use:** CONT-02, CONT-03 -- single source of truth for validation rules.

```typescript
// src/lib/schemas/contact.ts
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, { error: 'Required' }).max(200),
  email: z.string().min(1, { error: 'Required' }).email({ error: 'Invalid email' }),
  message: z.string().min(10, { error: 'Too short' }).max(5000),
  company: z.string().max(200).optional(),
  serviceInterest: z.string().max(100).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
```

**Note on Zod 4:** Uses the unified `error` parameter (not `message`). The `safeParse` return type and `.flatten()` method work the same as Zod 3.

### Pattern 4: Honeypot Hidden Field

**What:** A hidden form field that tricks bots into filling it out while remaining invisible and inaccessible to real users.
**When to use:** CONT-05 -- spam prevention.

```typescript
// Key attributes for the honeypot:
<div
  aria-hidden="true"
  style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
>
  <label htmlFor="website_url">Website</label>
  <input
    id="website_url"
    name="website_url"
    type="text"
    tabIndex={-1}
    autoComplete="one-time-code"
  />
</div>
```

**Critical details:**
- `aria-hidden="true"` hides from screen readers.
- CSS positioning moves it off-screen (do NOT use `display: none` -- some bots detect that).
- `tabIndex={-1}` prevents keyboard users from accidentally tabbing into it.
- `autoComplete="one-time-code"` prevents browsers from autofilling (key source of false positives).
- Field name should be plausible (e.g., `website_url`, `company_url`) to fool bots.
- The wrapper `<div>` has the hiding styles, not the input itself.

### Pattern 5: WhatsApp Floating CTA Button

**What:** A sticky floating button linking to WhatsApp with a pre-filled message, visible on all pages.
**When to use:** CONT-08, CONT-09.

```typescript
// src/components/layout/whatsapp-button.tsx
'use client';

import { useTranslations } from 'next-intl';

const WHATSAPP_NUMBER = '5215512345678'; // International format, no + or dashes
const WHATSAPP_MESSAGE = 'Hola, me interesa conocer más sobre tus servicios de consultoría.';

export function WhatsAppButton() {
  const t = useTranslations('common');

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsapp')}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20BD5C] transition-colors"
    >
      {/* WhatsApp SVG icon */}
      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}
```

**Key details:**
- Fixed positioning: `fixed bottom-6 right-6 z-40` for sticky behavior on all viewports.
- WhatsApp brand green: `#25D366` (official brand color).
- `target="_blank"` opens in new window/WhatsApp app.
- SVG icon embedded (no icon library dependency needed).
- `aria-label` for accessibility (from translations).
- The message is always in Spanish (CONT-09 requirement) regardless of current locale.
- Phone number in international format without +, spaces, or dashes.

### Pattern 6: Contact Page Composition

**What:** The contact page composes a server component wrapper with the client form component.
**When to use:** CONT-01 -- page structure.

```typescript
// src/app/[locale]/contact/page.tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { ContactForm } from '@/components/contact/contact-form';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  return (
    <section className="px-4 py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
          {t('title')}
        </h1>
        <p className="mt-4 text-center text-muted text-base md:text-lg">
          {t('subtitle')}
        </p>
        <div className="mt-12">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
```

### Anti-Patterns to Avoid

- **Using an API route (`/api/contact`) instead of a Server Action:** Server Actions are the Next.js recommended pattern. They handle CSRF protection, work with `useActionState`, and do not require manual fetch calls. No need for a separate API route.
- **Putting the Resend API key in client-side code:** The `RESEND_API_KEY` must be server-only. Server Actions guarantee this. Do NOT prefix with `NEXT_PUBLIC_`.
- **Using `display: none` for the honeypot:** Some bots detect `display: none` elements and skip them. Use `position: absolute; left: -9999px; opacity: 0` instead.
- **Throwing errors in the server action:** `useActionState` expects errors as return values, not thrown exceptions. Return `{ success: false, errors: ... }` instead of throwing.
- **Resetting form fields manually after submission:** When `useActionState` returns a success state, render a success panel that replaces the form entirely. No need to clear individual fields.
- **Adding `noValidate` without providing custom validation UI:** If using `noValidate` on the form (to suppress browser validation bubbles), you MUST provide custom error messages for all validation rules. Otherwise the form submits without feedback. The pattern above uses `noValidate` with Zod + aria-live error messages.
- **Hardcoding error messages in English:** All error messages must come from translation files. The Zod schema defines generic error markers; the UI maps these to translated strings from `contact.errors.*`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form state management | Custom useState + fetch + loading state | `useActionState` from React 19 | Built into React 19. Handles pending state, sequential submissions, progressive enhancement. Official Next.js pattern. |
| Email delivery | SMTP client, nodemailer configuration | Resend SDK (`resend.emails.send()`) | Single API call. No SMTP configuration. Free tier adequate. Official Next.js integration. |
| Form validation | Custom regex validators per field | Zod schema with `safeParse()` | Type-safe. Shared between client and server. Error formatting built in. |
| Spam protection | reCAPTCHA, Cloudflare Turnstile | Honeypot hidden field | Zero user friction. No third-party dependency. No cookie consent implications. Adequate for low-traffic site. |
| Email HTML templates | react-email component library | Simple HTML string template | For a notification email to the site owner, a basic HTML string is sufficient. react-email is overkill until customer-facing emails are needed. |
| WhatsApp icon | Icon library (lucide, heroicons) | Inline SVG | One icon does not justify an icon library dependency. SVG is 1KB and self-contained. |

**Key insight:** This phase uses well-established patterns (React 19 `useActionState`, Zod, Resend) that are officially recommended by the Next.js documentation. The primary complexity is in the UX details: accessible error messages, translated validation feedback, honeypot implementation, and the WhatsApp button positioning.

## Common Pitfalls

### Pitfall 1: useActionState Signature Mismatch

**What goes wrong:** The server action receives `FormData` as the first argument instead of `prevState`, causing runtime errors or incorrect behavior.
**Why it happens:** When using `useActionState`, the function signature changes. The first argument becomes the previous state, and `FormData` moves to the second argument. This is different from a plain form action where `FormData` is the only argument.
**How to avoid:** Always define the server action as `async function submitContactForm(prevState: ContactFormState, formData: FormData)`. The `prevState` parameter is required even if you don't use it.
**Warning signs:** TypeScript errors about argument types. `formData.get()` returns `null` for every field. The action runs but fields are always empty.

### Pitfall 2: Honeypot Causes False Positives from Browser Autofill

**What goes wrong:** Real users' browsers autofill the honeypot field, causing their legitimate submissions to be silently discarded.
**Why it happens:** Browser autofill algorithms scan all form fields, including hidden ones, and populate them with saved data.
**How to avoid:** Set `autoComplete="one-time-code"` on the honeypot input. This attribute tells browsers not to autofill with standard data. Also use `tabIndex={-1}` so keyboard users never reach the field. Place the honeypot in a container that is positioned off-screen but not `display: none`.
**Warning signs:** Users report form submission "succeeded" but no email arrives. Difficult to detect because the honeypot returns fake success.

### Pitfall 3: Zod Error Messages Not Translated

**What goes wrong:** Validation error messages appear in English hardcoded strings (from Zod) instead of the user's current language.
**Why it happens:** Zod's built-in error messages are in English. If you pass error messages directly to the UI, they will not be translated.
**How to avoid:** Do NOT use Zod's error messages directly in the UI. Instead, use the error field names from `flatten().fieldErrors` to look up translated error messages. For example, if `errors.name` exists, display `t('errors.nameRequired')` from the translation file. The Zod schema uses generic markers; the UI maps them to translated strings.
**Warning signs:** Error messages appear in English when the site is in Spanish mode. Error text is technical ("String must contain at least 1 character(s)") instead of user-friendly.

### Pitfall 4: Missing aria-live Region for Screen Readers

**What goes wrong:** Screen readers do not announce validation errors or success messages to users.
**Why it happens:** Error messages are rendered dynamically but without `aria-live` attributes, so screen readers do not know to announce them.
**How to avoid:** Add `aria-live="polite"` to error message containers. Add `aria-describedby` on inputs pointing to their error element IDs. Add `aria-invalid="true"` on inputs with errors. For the success panel, use `role="status"` or `aria-live="polite"`. The `aria-live` element MUST exist in the DOM before content changes (use conditional content, not conditional rendering of the container).
**Warning signs:** Submit the form with errors while using VoiceOver or NVDA. If errors are not announced, the aria setup is wrong.

### Pitfall 5: Resend API Key Leaked to Client

**What goes wrong:** The `RESEND_API_KEY` environment variable is accidentally exposed to the browser.
**Why it happens:** Using `NEXT_PUBLIC_RESEND_API_KEY` or importing the Resend client in a `'use client'` component.
**How to avoid:** Keep the Resend client initialization and usage exclusively in `'use server'` functions or server-only modules. The environment variable should NOT have the `NEXT_PUBLIC_` prefix. The server action pattern guarantees server-only execution.
**Warning signs:** DevTools Network tab shows the API key in requests. Build warnings about server-only code in client bundles.

### Pitfall 6: WhatsApp Button Overlaps Content on Mobile

**What goes wrong:** The floating WhatsApp button covers important content, form submit buttons, or footer elements on small screens.
**Why it happens:** Fixed positioning without considering the page content layout and scroll position.
**How to avoid:** Use `fixed bottom-6 right-6` with appropriate `z-40` z-index (below the header at `z-50` but above page content). Add bottom padding to the page content or footer to account for the button. Test on multiple viewport sizes. Consider hiding the button when the user is actively typing in the contact form (optional).
**Warning signs:** Button overlaps the footer copyright text. Button covers the form submit button when scrolled to the bottom of the contact page.

### Pitfall 7: Form Does Not Preserve Input on Validation Error

**What goes wrong:** When server-side validation fails, the form re-renders empty and the user must re-type everything.
**Why it happens:** Not using `useActionState` properly, or re-rendering the form without maintaining the input values.
**How to avoid:** `useActionState` with native form submission preserves input values automatically because the browser form state is maintained. If you add `defaultValue` props from state, make sure the server action returns the submitted values on error. The simplest approach is to let the browser handle input persistence (native form behavior with `action` prop).
**Warning signs:** After a validation error, all fields are empty. User must re-type their message.

### Pitfall 8: Translation Key Mismatch Between es.json and en.json

**What goes wrong:** Runtime "MISSING_MESSAGE" errors because the `contact.*` namespace keys exist in one language but not the other.
**Why it happens:** Adding translations to es.json first and forgetting the parallel en.json structure.
**How to avoid:** Define the complete `contact.*` namespace structure in BOTH files simultaneously. Use the same key paths. This is the same pitfall and prevention from Phase 4.
**Warning signs:** Yellow console warnings from next-intl. Error message containers show raw key paths.

## Code Examples

Verified patterns from official sources:

### Resend Email Send (from official docs)

```typescript
// Source: https://resend.com/docs/send-with-nextjs
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const { data, error } = await resend.emails.send({
  from: 'Acme <onboarding@resend.dev>',
  to: ['delivered@resend.dev'],
  subject: 'hello world',
  html: '<p>it works!</p>',
  replyTo: 'user@example.com',
});
```

### useActionState Form Pattern (from Next.js official docs)

```typescript
// Source: https://nextjs.org/docs/app/guides/forms
'use client';

import { useActionState } from 'react';
import { createUser } from '@/app/actions';

const initialState = { message: '' };

export function Signup() {
  const [state, formAction, pending] = useActionState(createUser, initialState);

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" required />
      <p aria-live="polite">{state?.message}</p>
      <button disabled={pending}>Sign up</button>
    </form>
  );
}
```

### Server Action with Zod Validation (from Next.js official docs)

```typescript
// Source: https://nextjs.org/docs/app/guides/forms
'use server';

import { z } from 'zod';

const schema = z.object({
  email: z.string({ invalid_type_error: 'Invalid Email' }),
});

export async function createUser(prevState: any, formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Mutate data
}
```

### WhatsApp wa.me URL Format

```typescript
// Source: https://wa.me documentation (verified across multiple sources)
const phoneNumber = '5215512345678'; // International format, no +, no dashes
const message = 'Hola, me interesa conocer más sobre tus servicios de consultoría.';
const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
// Result: https://wa.me/5215512345678?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20tus%20servicios%20de%20consultor%C3%ADa.
```

### Accessible Form Error Pattern

```typescript
// Source: https://nextjs.org/learn/dashboard-app/improving-accessibility
// and https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-errormessage
<div>
  <label htmlFor="email">Email *</label>
  <input
    id="email"
    name="email"
    type="email"
    required
    aria-required="true"
    aria-invalid={!!errors?.email}
    aria-describedby={errors?.email ? 'email-error' : undefined}
    className={cn(
      'w-full rounded-md border px-4 py-3',
      errors?.email ? 'border-red-500' : 'border-border'
    )}
  />
  <p
    id="email-error"
    aria-live="polite"
    className="mt-1 text-sm text-red-600"
  >
    {errors?.email && t('errors.emailInvalid')}
  </p>
</div>
```

### Translation JSON Structure for Contact Page

```json
{
  "contact": {
    "title": "Hablemos",
    "subtitle": "Completa el formulario y te responderemos en 24-48 horas hábiles.",
    "fields": {
      "name": {
        "label": "Nombre",
        "placeholder": "Tu nombre completo"
      },
      "email": {
        "label": "Email",
        "placeholder": "tu@email.com"
      },
      "company": {
        "label": "Empresa",
        "placeholder": "Tu empresa (opcional)"
      },
      "serviceInterest": {
        "label": "Servicio de interés",
        "placeholder": "Selecciona un servicio (opcional)",
        "options": {
          "advisory": "Asesoría Técnica Estratégica",
          "delivery": "Aceleración de Delivery",
          "alignment": "Alineación de Producto y Negocio",
          "fractional": "Liderazgo Fraccional",
          "other": "Otro"
        }
      },
      "message": {
        "label": "Mensaje",
        "placeholder": "Cuéntanos sobre tu proyecto o desafío..."
      },
      "submit": {
        "label": "Enviar mensaje",
        "sending": "Enviando..."
      }
    },
    "errors": {
      "nameRequired": "El nombre es obligatorio.",
      "emailRequired": "El email es obligatorio.",
      "emailInvalid": "Por favor ingresa un email válido.",
      "messageRequired": "El mensaje es obligatorio.",
      "messageTooShort": "El mensaje debe tener al menos 10 caracteres.",
      "serverError": "Hubo un error al enviar tu mensaje. Por favor intenta nuevamente."
    },
    "success": {
      "title": "¡Mensaje enviado!",
      "message": "Gracias por contactarnos. Te responderemos dentro de 24-48 horas hábiles."
    }
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `useFormState` from `react-dom` | `useActionState` from `react` | React 19 (2024) | New hook name, lives in `react` package instead of `react-dom`. Returns `[state, action, pending]` (3 values, not 2). |
| API routes for form submission | Server Actions with `'use server'` | Next.js 14+ stable (2024) | No separate API endpoint needed. Direct function call from form. Built-in CSRF protection. Works with `useActionState`. |
| Zod 3 `message` parameter | Zod 4 unified `error` parameter | Zod 4 (2025) | `message`, `required_error`, `invalid_type_error` deprecated. Use `error` for all custom messages. `error` can be a string or function for dynamic messages. |
| reCAPTCHA / hCaptcha | Honeypot + rate limiting | Ongoing shift | Zero-friction for users. No cookie consent needed. Adequate for low-traffic forms. Not suitable for high-traffic public APIs. |
| Custom email HTML templates | react-email components | 2023+ | For complex emails, react-email provides React component-based templates. For simple notifications, plain HTML strings remain adequate. |
| Resend v4-5 | Resend v6.9.x | 2025 | Stable SDK. Same `resend.emails.send()` API. Minor improvements in types and error handling. |

**Deprecated/outdated:**
- `useFormState` from `react-dom`: Replaced by `useActionState` from `react` in React 19. Same concept, different import and slightly different API.
- `useFormStatus` as primary form hook: Still useful for nested submit buttons, but `useActionState` is the primary hook for managing form action state.
- Zod 3 `message` parameter: Still works but deprecated. Use `error` in Zod 4.

## Open Questions

1. **Resend domain verification status**
   - What we know: STATE.md notes "Resend domain verification needs 24-48 hours DNS propagation -- start before Phase 7." The `.env.example` already has some relevant variables defined.
   - What's unclear: Whether mgripe.com domain is already verified in Resend, or whether this needs to happen as part of Phase 5.
   - Recommendation: Domain verification should start immediately if not already done. Development can use `onboarding@resend.dev` as the `from` address (Resend's test domain, free tier). Switch to verified domain before deployment.

2. **WhatsApp business number**
   - What we know: STATE.md notes "WhatsApp business number needed before Phase 5 (CONT-08, CONT-09)."
   - What's unclear: Whether the number has been secured. The phone number in international format needs to be provided.
   - Recommendation: Use a placeholder number during development. The number should be a configuration constant or env variable that is easy to update. The pre-filled message is always in Spanish per CONT-09.

3. **Rate limiting scope and implementation**
   - What we know: `.env.example` defines `MAX_SUBMISSIONS_PER_WINDOW=5` and `RATE_LIMIT_WINDOW_MS=600000` (10 minutes). This suggests rate limiting was previously discussed.
   - What's unclear: Whether to implement rate limiting in Phase 5 or defer to Phase 6 polish. The requirements (CONT-01 through CONT-09) do not explicitly mention rate limiting.
   - Recommendation: Implement basic in-memory rate limiting in the server action as a lightweight guard. 5 submissions per 10-minute window per IP is reasonable. Uses `headers()` from `next/headers` to get the `x-forwarded-for` IP. This is not a phase requirement but is good practice and the env variables are already defined.

4. **File-based lead backup (LEADS_FILE)**
   - What we know: `.env.example` has `LEADS_FILE=tmp/leads.ndjson`, suggesting file-based lead storage was considered.
   - What's unclear: Whether this is still desired alongside Resend email delivery.
   - Recommendation: This is not in the phase requirements. Defer to later if desired. The primary delivery mechanism is Resend email per CONT-04. If file backup is needed, it can be a simple `appendFile` call in the server action, but it adds complexity and Vercel's filesystem is ephemeral.

5. **Service interest dropdown options**
   - What we know: CONT-01 specifies "service interest (optional)" as a field. The 4 service lines are defined in REQUIREMENTS.md and the Services page.
   - What's unclear: Exact options for the dropdown.
   - Recommendation: Use the 4 service titles + "Other" as dropdown options. Translate them via `contact.fields.serviceInterest.options.*`. Match the service titles from the `services.offerings.*.title` translations.

## Sources

### Primary (HIGH confidence)
- Next.js official docs (v16.1.6, updated 2026-02-20): Forms guide with `useActionState`, Server Actions, Zod validation -- https://nextjs.org/docs/app/guides/forms
- React official docs (React 19): `useActionState` API reference -- https://react.dev/reference/react/useActionState
- Resend official docs: Send with Next.js, API reference -- https://resend.com/docs/send-with-nextjs, https://resend.com/docs/api-reference/emails/send-email
- Zod 4 release notes: New unified `error` parameter, performance improvements -- https://zod.dev/v4
- Project codebase: Existing component patterns, translation structure, design tokens, layout composition -- all verified from project files

### Secondary (MEDIUM confidence)
- Resend pricing: Free tier 3,000 emails/month, 1 domain -- https://resend.com/pricing
- npm package versions: resend@6.9.2, zod@4.3.6 -- https://www.npmjs.com/package/resend, https://www.npmjs.com/package/zod
- Accessible form error patterns: aria-live, aria-describedby, aria-invalid -- https://nextjs.org/learn/dashboard-app/improving-accessibility, https://hidde.blog/how-to-make-inline-error-messages-accessible/
- WhatsApp wa.me link format: pre-filled message URL encoding -- https://quadlayers.com/how-to-create-a-whatsapp-link-wa-me-with-a-pre-filled-message/

### Tertiary (LOW confidence)
- Honeypot `autoComplete="one-time-code"` for preventing browser autofill false positives -- https://www.nikolailehbr.ink/blog/prevent-form-spamming-honeypot/ (community source, but the attribute itself is standard HTML)
- In-memory rate limiting pattern for server actions -- https://nextjsweekly.com/blog/rate-limiting-server-actions (community pattern, simple enough to verify by reading)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Zod and Resend are the officially recommended tools in Next.js docs. Versions verified on npm. `useActionState` is the React 19 standard.
- Architecture: HIGH -- Server action + useActionState pattern is directly from Next.js official docs. WhatsApp button is a simple fixed-position link. All code patterns verified from official sources.
- Pitfalls: HIGH -- Most pitfalls are well-documented (useActionState signature, honeypot false positives, Zod error translation). Drawn from official docs, community experience, and project history.
- Integration: MEDIUM -- Resend domain verification timing and WhatsApp number availability are external dependencies noted in STATE.md blockers.

**Research date:** 2026-02-21
**Valid until:** 2026-03-21 (stable ecosystem, 30-day validity)
