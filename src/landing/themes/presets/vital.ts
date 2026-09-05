import { TenantThemeData } from '../tokens';

/**
 * Template "Vital" — Natureza e Bem-estar.
 * Persona: terapias integrativas, saúde mental + corpo.
 * Tons de verde oliva, fundo suave, cards com elevação.
 */
export const vitalPreset: TenantThemeData = {
  templateId: 'vital',
  tokens: {
    colors: {
      primary: '#4d7c0f',
      accent: '#a3b18a',
      surface: '#eef3e6',
      background: '#f7f9f4',
      text: '#1a2e05',
      textMuted: '#4d5e3a',
    },
    typography: {
      headingFont: 'sans',
      headingWeight: 'normal',
      scale: 'normal',
    },
    shape: {
      radius: 'lg',
      cardStyle: 'elevated',
    },
  },
  sections: [
    { type: 'hero', variant: 'split', visible: true, order: 0, overrides: {} },
    { type: 'about', variant: 'default', visible: true, order: 1, overrides: {} },
    { type: 'specialties', variant: 'cards', visible: true, order: 2, overrides: {} },
    { type: 'faq', variant: 'accordion', visible: true, order: 3, overrides: {} },
    { type: 'contact', variant: 'whatsapp-only', visible: true, order: 4, overrides: {} },
  ],
};
