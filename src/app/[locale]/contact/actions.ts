'use server';

import { contactSchema, type ContactFormData } from '@/lib/schemas/contact';
import { resend } from '@/lib/resend';

export type ContactFormState = {
  success: boolean | null;
  errors?: Record<string, string[]>;
  message?: string;
};

function buildEmailHtml(data: ContactFormData): string {
  const companyRow = data.company
    ? `<tr><td style="padding:8px 12px;font-weight:600;color:#374151;vertical-align:top;">Company</td><td style="padding:8px 12px;color:#111827;">${data.company}</td></tr>`
    : '';

  const serviceRow = data.serviceInterest
    ? `<tr><td style="padding:8px 12px;font-weight:600;color:#374151;vertical-align:top;">Service Interest</td><td style="padding:8px 12px;color:#111827;">${data.serviceInterest}</td></tr>`
    : '';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f9fafb;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <h1 style="font-size:20px;color:#111827;margin:0 0 16px;">New Contact Form Submission</h1>
    <table style="width:100%;border-collapse:collapse;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <tr><td style="padding:8px 12px;font-weight:600;color:#374151;vertical-align:top;">Name</td><td style="padding:8px 12px;color:#111827;">${data.name}</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:8px 12px;font-weight:600;color:#374151;vertical-align:top;">Email</td><td style="padding:8px 12px;color:#111827;">${data.email}</td></tr>
      ${companyRow}
      ${serviceRow}
    </table>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
    <div style="background:#ffffff;padding:16px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <h2 style="font-size:14px;color:#6b7280;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.05em;">Message</h2>
      <p style="font-size:15px;color:#111827;line-height:1.6;margin:0;white-space:pre-wrap;">${data.message}</p>
    </div>
  </div>
</body>
</html>`.trim();
}

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Honeypot check: silently discard bot submissions with a fake success
  const honeypot = formData.get('website_url');
  if (honeypot) {
    return { success: true, message: 'success' };
  }

  // Extract raw data from form
  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    message: formData.get('message') as string,
    company: (formData.get('company') as string) || undefined,
    serviceInterest: (formData.get('serviceInterest') as string) || undefined,
  };

  // Validate with Zod
  const result = contactSchema.safeParse(rawData);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  // Send email via Resend
  try {
    await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        'M. Gripe Website <onboarding@resend.dev>',
      to: [process.env.RESEND_TO_EMAIL || 'contact@mgripe.com'],
      replyTo: result.data.email,
      subject: `New contact from ${result.data.name}`,
      html: buildEmailHtml(result.data),
    });

    return { success: true, message: 'success' };
  } catch (error) {
    console.error('Resend email error:', error);
    return { success: false, message: 'server_error' };
  }
}
