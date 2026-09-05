import { TenantThemeData } from '../tokens';

/**
 * Template "Acolhimento" — Quente e Humano.
 * Persona: terapia humanista, acolhedora, tons terrosos.
 * Fundo claro quente, terracota, serifada, bordas arredondadas.
 */
export const acolhimentoPreset: TenantThemeData = {
  templateId: 'acolhimento',
  tokens: {
    colors: {
      primary: '#b45309',
      accent: '#78716c',
      surface: '#f5f0e8',
      background: '#faf7f2',
      text: '#292524',
      textMuted: '#57534e',
    },
    typography: {
      headingFont: 'serif',
      headingWeight: 'normal',
      scale: 'spacious',
    },
    shape: {
      radius: 'full',
      cardStyle: 'elevated',
    },
  },
  sections: [
    { type: 'hero', variant: 'centered', visible: true, order: 0, overrides: {} },
    { type: 'about', variant: 'default', visible: true, order: 1, overrides: {} },
    { type: 'specialties', variant: 'tags', visible: true, order: 2, overrides: {} },
    { type: 'faq', variant: 'cards', visible: true, order: 3, overrides: {} },
    { type: 'contact', variant: 'form', visible: true, order: 4, overrides: {} },
  ],
};
