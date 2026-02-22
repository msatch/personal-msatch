'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import {
  submitContactForm,
  type ContactFormState,
} from '@/app/[locale]/contact/actions';
import { cn } from '@/lib/utils';

const initialState: ContactFormState = { success: null };

const SERVICE_OPTIONS = [
  'advisory',
  'delivery',
  'alignment',
  'fractional',
  'other',
] as const;

export function ContactForm() {
  const t = useTranslations('contact');
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialState,
  );

  // Success state (CONT-06)
  if (state.success === true) {
    return (
      <div className="rounded-lg border border-accent/30 bg-accent/5 p-8 text-center">
        <span className="text-4xl text-accent" aria-hidden="true">
          &#10003;
        </span>
        <h3 className="mt-4 text-xl font-bold">{t('success.title')}</h3>
        <p className="mt-2 text-muted">{t('success.message')}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-6">
      {/* Server error banner (CONT-07) */}
      {state.message === 'server_error' && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 p-4"
        >
          <p className="text-red-800">{t('errors.serverError')}</p>
        </div>
      )}

      {/* Name field (required) */}
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
          placeholder={t('fields.name.placeholder')}
          className={cn(
            'mt-1 w-full rounded-md border px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent',
            state.errors?.name ? 'border-red-500' : 'border-border',
          )}
        />
        <p
          id="name-error"
          aria-live="polite"
          className="mt-1 text-sm text-red-600"
        >
          {state.errors?.name && t('errors.nameRequired')}
        </p>
      </div>

      {/* Email field (required) */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          {t('fields.email.label')} *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          aria-required="true"
          aria-invalid={!!state.errors?.email}
          aria-describedby={state.errors?.email ? 'email-error' : undefined}
          placeholder={t('fields.email.placeholder')}
          className={cn(
            'mt-1 w-full rounded-md border px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent',
            state.errors?.email ? 'border-red-500' : 'border-border',
          )}
        />
        <p
          id="email-error"
          aria-live="polite"
          className="mt-1 text-sm text-red-600"
        >
          {state.errors?.email && t('errors.emailInvalid')}
        </p>
      </div>

      {/* Company field (optional) */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium">
          {t('fields.company.label')}
        </label>
        <input
          id="company"
          name="company"
          type="text"
          placeholder={t('fields.company.placeholder')}
          className="mt-1 w-full rounded-md border border-border px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
        />
      </div>

      {/* Service interest field (optional, CONT-01) */}
      <div>
        <label
          htmlFor="serviceInterest"
          className="block text-sm font-medium"
        >
          {t('fields.serviceInterest.label')}
        </label>
        <select
          id="serviceInterest"
          name="serviceInterest"
          className="mt-1 w-full appearance-none rounded-md border border-border px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
        >
          <option value="">{t('fields.serviceInterest.placeholder')}</option>
          {SERVICE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {t(`fields.serviceInterest.options.${option}`)}
            </option>
          ))}
        </select>
      </div>

      {/* Message field (required) */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          {t('fields.message.label')} *
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-required="true"
          aria-invalid={!!state.errors?.message}
          aria-describedby={
            state.errors?.message ? 'message-error' : undefined
          }
          placeholder={t('fields.message.placeholder')}
          className={cn(
            'mt-1 w-full rounded-md border px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent',
            state.errors?.message ? 'border-red-500' : 'border-border',
          )}
        />
        <p
          id="message-error"
          aria-live="polite"
          className="mt-1 text-sm text-red-600"
        >
          {state.errors?.message && t('errors.messageTooShort')}
        </p>
      </div>

      {/* Honeypot field (CONT-05) */}
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
        className="w-full rounded-lg bg-accent px-6 py-4 font-bold text-white transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? t('fields.submit.sending') : t('fields.submit.label')}
      </button>
    </form>
  );
}
