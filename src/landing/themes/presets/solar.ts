import { TenantThemeData } from '../tokens';

/**
 * Template "Solar" — Energia Acolhedora.
 * Persona: psicologia positiva, coaching, desenvolvimento pessoal.
 * Creme quente, terracota, títulos display marcantes.
 */
export const solarPreset: TenantThemeData = {
  templateId: 'solar',
  tokens: {
    colors: {
      primary: '#c2410c',
      accent: '#9a3412',
      surface: '#ffeedd',
      background: '#fff8f0',
      text: '#2b1a12',
      textMuted: '#7c5c4b',
    },
    typography: {
      headingFont: 'display',
      headingWeight: 'bold',
      scale: 'normal',
    },
    shape: {
      radius: 'lg',
      cardStyle: 'elevated',
    },
  },
  sections: [
    { type: 'hero', variant: 'centered', visible: true, order: 0, overrides: { eyebrow: 'Psicologia Positiva' } },
    { type: 'specialties', variant: 'tags', visible: true, order: 1, overrides: { title: 'Caminhos de desenvolvimento' } },
    { type: 'about', variant: 'default', visible: true, order: 2, overrides: { title: 'Leveza com propósito' } },
    { type: 'faq', variant: 'cards', visible: true, order: 3, overrides: {} },
    { type: 'contact', variant: 'whatsapp-only', visible: true, order: 4, overrides: { subtitle: 'Vamos conversar sobre seus objetivos?' } },
  ],
};
