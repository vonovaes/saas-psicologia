import { TenantThemeData } from '../tokens';

/**
 * Template "Noite" — Premium Dark.
 * Persona: profissional sofisticado, urbano, consultório moderno.
 * É o tema legado: visual atual da landing, preservado.
 */
export const noitePreset: TenantThemeData = {
  templateId: 'noite',
  tokens: {
    colors: {
      primary: '#f59e0b',
      accent: '#f59e0b',
      surface: '#1a1b1e',
      background: '#0a0b0c',
      text: '#ffffff',
      textMuted: '#9ca3af',
    },
    typography: {
      headingFont: 'sans',
      headingWeight: 'light',
      scale: 'normal',
    },
    shape: {
      radius: 'lg',
      cardStyle: 'glass',
    },
  },
  sections: [
    { type: 'hero', variant: 'split', visible: true, order: 0, overrides: {} },
    { type: 'about', variant: 'default', visible: true, order: 1, overrides: {} },
    { type: 'specialties', variant: 'cards', visible: true, order: 2, overrides: {} },
    { type: 'faq', variant: 'accordion', visible: true, order: 3, overrides: {} },
    { type: 'contact', variant: 'form', visible: true, order: 4, overrides: {} },
  ],
};
