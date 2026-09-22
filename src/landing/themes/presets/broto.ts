import { TenantThemeData } from '../tokens';

/**
 * Template "Broto" — Lúdico e Leve.
 * Persona: psicologia infantil, psicopedagogia, atendimento a pais.
 * Creme claro, rosa-pêssego, formas totalmente arredondadas.
 */
export const brotoPreset: TenantThemeData = {
  templateId: 'broto',
  tokens: {
    colors: {
      primary: '#d13d6b',
      accent: '#3aa6a0',
      surface: '#fdf1e7',
      background: '#fffdf6',
      text: '#33302b',
      textMuted: '#6b6459',
    },
    typography: {
      headingFont: 'display',
      headingWeight: 'bold',
      scale: 'normal',
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
    { type: 'contact', variant: 'whatsapp-only', visible: true, order: 4, overrides: {} },
  ],
};
