import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

// Root page redirects to default locale.
// The actual home page is at [locale]/page.tsx.
// This redirect is a safety net -- normally proxy.ts handles locale routing
// before this page is ever reached.
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
