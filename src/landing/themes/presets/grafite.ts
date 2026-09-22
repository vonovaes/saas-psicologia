import { TenantThemeData } from '../tokens';

/**
 * Template "Grafite" — Sóbrio e Direto.
 * Persona: psicologia organizacional, esportiva, público masculino.
 * Dark neutro (sem dourado), menta como acento, lista tipográfica.
 */
export const grafitePreset: TenantThemeData = {
  templateId: 'grafite',
  tokens: {
    colors: {
      primary: '#5eead4',
      accent: '#94a3b8',
      surface: '#1c1f26',
      background: '#111318',
      text: '#f1f5f9',
      textMuted: '#94a3b8',
    },
    typography: {
      headingFont: 'display',
      headingWeight: 'light',
      scale: 'compact',
    },
    shape: {
      radius: 'sm',
      cardStyle: 'bordered',
    },
  },
  sections: [
    { type: 'hero', variant: 'minimal', visible: true, order: 0, overrides: { eyebrow: 'Psicologia Organizacional' } },
    { type: 'specialties', variant: 'list', visible: true, order: 1, overrides: { title: 'Frentes de atuação' } },
    { type: 'about', variant: 'minimal', visible: true, order: 2, overrides: { title: 'Resultado com método' } },
    { type: 'faq', variant: 'accordion', visible: true, order: 3, overrides: {} },
    { type: 'contact', variant: 'whatsapp-only', visible: true, order: 4, overrides: {} },
  ],
};
