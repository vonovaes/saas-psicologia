import { TenantThemeData } from '../tokens';

/**
 * Template "Oceano" — Confiança Clínica.
 * Persona: neuropsicologia, público corporativo, avaliações.
 * Azul-marinho sóbrio, superfície azul-gelo, cards com borda.
 */
export const oceanoPreset: TenantThemeData = {
  templateId: 'oceano',
  tokens: {
    colors: {
      primary: '#1d4e89',
      accent: '#1668a8',
      surface: '#e8f0f7',
      background: '#f4f8fb',
      text: '#0c2334',
      textMuted: '#4a6172',
    },
    typography: {
      headingFont: 'sans',
      headingWeight: 'bold',
      scale: 'compact',
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
