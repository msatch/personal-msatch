import { Resend } from 'resend';

// Server-only: do NOT use NEXT_PUBLIC_ prefix for this key.
// The Resend API key must never be exposed to the client.
export const resend = new Resend(process.env.RESEND_API_KEY);
