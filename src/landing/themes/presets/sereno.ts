import { TenantThemeData } from '../tokens';

/**
 * Template "Sereno" — Clínico e Calmo.
 * Persona: TCC, neuropsicologia, abordagem técnica e limpa.
 * Fundo branco, teal, layout limpo e organizado.
 */
export const serenoPreset: TenantThemeData = {
  templateId: 'sereno',
  tokens: {
    colors: {
      primary: '#0d9488',
      accent: '#2dd4bf',
      surface: '#f0fdfa',
      background: '#ffffff',
      text: '#134e4a',
      textMuted: '#5f7a76',
    },
    typography: {
      headingFont: 'sans',
      headingWeight: 'normal',
      scale: 'normal',
    },
    shape: {
      radius: 'md',
      cardStyle: 'bordered',
    },
  },
  sections: [
    { type: 'hero', variant: 'split', visible: true, order: 0, overrides: {} },
    { type: 'specialties', variant: 'cards', visible: true, order: 1, overrides: {} },
    { type: 'about', variant: 'default', visible: true, order: 2, overrides: {} },
    { type: 'faq', variant: 'accordion', visible: true, order: 3, overrides: {} },
    { type: 'contact', variant: 'form', visible: true, order: 4, overrides: {} },
  ],
};
