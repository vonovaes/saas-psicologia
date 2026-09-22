import { Inter, Fraunces, Sora } from 'next/font/google';

/**
 * Fontes do site do tenant. Os tokens de tipografia (sans/serif/display)
 * mapeiam para estas CSS vars — ver tokensToCssVars.
 */
export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-site-sans',
  display: 'swap',
});

export const fontSerif = Fraunces({
  subsets: ['latin'],
  variable: '--font-site-serif',
  display: 'swap',
});

export const fontDisplay = Sora({
  subsets: ['latin'],
  variable: '--font-site-display',
  display: 'swap',
});
