'use client';

import { useEffect } from 'react';

export function ThemeSync() {
  useEffect(() => {
    try {
      const theme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      const shouldBeDark = theme === 'dark' || (!theme && prefersDark);
      document.documentElement.classList.toggle('dark', shouldBeDark);
    } catch {}
  }); // No deps — runs after every render to survive locale navigations
  return null;
}
