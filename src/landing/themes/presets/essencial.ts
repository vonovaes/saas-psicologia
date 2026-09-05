import { TenantThemeData } from '../tokens';

/**
 * Template "Essencial" — Minimalista Editorial.
 * Persona: psicanálise, perfil intelectual, "menos é mais".
 * Monocromático, tipografia serifada de destaque, sem cards pesados.
 */
export const essencialPreset: TenantThemeData = {
  templateId: 'essencial',
  tokens: {
    colors: {
      primary: '#111111',
      accent: '#111111',
      surface: '#ffffff',
      background: '#ffffff',
      text: '#111111',
      textMuted: '#6b7280',
    },
    typography: {
      headingFont: 'serif',
      headingWeight: 'normal',
      scale: 'spacious',
    },
    shape: {
      radius: 'none',
      cardStyle: 'flat',
    },
  },
  sections: [
    { type: 'hero', variant: 'minimal', visible: true, order: 0, overrides: {} },
    { type: 'about', variant: 'minimal', visible: true, order: 1, overrides: {} },
    { type: 'specialties', variant: 'list', visible: true, order: 2, overrides: {} },
    { type: 'faq', variant: 'cards', visible: true, order: 3, overrides: {} },
    { type: 'contact', variant: 'form', visible: true, order: 4, overrides: {} },
  ],
};
