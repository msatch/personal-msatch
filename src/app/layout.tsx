import type { ReactNode } from 'react';

// Root layout required by Next.js for the not-found.tsx page.
// The actual locale layout with fonts and i18n is in [locale]/layout.tsx.
// This layout MUST NOT include <html> or <body> tags to avoid conflicts
// with the [locale] layout which provides them.

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return children;
}
