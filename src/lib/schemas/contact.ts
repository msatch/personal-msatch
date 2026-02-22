import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, { error: 'Required' }).max(200),
  email: z.string().min(1, { error: 'Required' }).email({ error: 'Invalid email' }),
  message: z.string().min(10, { error: 'Too short' }).max(5000),
  company: z.string().max(200).optional(),
  serviceInterest: z.string().max(100).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
