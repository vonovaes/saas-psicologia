import { TenantThemeData } from '../tokens';

/**
 * Template "Aurora" — Calma Noturna.
 * Persona: ansiedade, sono, público jovem e feminino.
 * Lavanda suave, violeta acinzentado, serifada espaçosa.
 */
export const auroraPreset: TenantThemeData = {
  templateId: 'aurora',
  tokens: {
    colors: {
      primary: '#6d5fb8',
      accent: '#8b7cc8',
      surface: '#ece8fb',
      background: '#f6f4fc',
      text: '#241d3d',
      textMuted: '#5d5679',
    },
    typography: {
      headingFont: 'serif',
      headingWeight: 'normal',
      scale: 'spacious',
    },
    shape: {
      radius: 'lg',
      cardStyle: 'elevated',
    },
  },
  sections: [
    { type: 'hero', variant: 'centered', visible: true, order: 0, overrides: {} },
    { type: 'about', variant: 'default', visible: true, order: 1, overrides: {} },
    { type: 'specialties', variant: 'tags', visible: true, order: 2, overrides: {} },
    { type: 'faq', variant: 'accordion', visible: true, order: 3, overrides: {} },
    { type: 'contact', variant: 'form', visible: true, order: 4, overrides: {} },
  ],
};
