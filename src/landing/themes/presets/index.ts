import { TenantThemeData } from '../tokens';
import { noitePreset } from './noite';
import { acolhimentoPreset } from './acolhimento';
import { serenoPreset } from './sereno';
import { essencialPreset } from './essencial';
import { vitalPreset } from './vital';

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  mood: string;
  preset: TenantThemeData;
  /** Cores usadas no card de preview da galeria */
  swatch: { bg: string; primary: string; text: string };
}

/**
 * Catálogo de templates disponíveis para o tenant escolher.
 */
export const TEMPLATES: TemplateMeta[] = [
  {
    id: 'noite',
    name: 'Noite',
    description: 'Premium dark, elegante e moderno. Ideal para um perfil urbano e sofisticado.',
    mood: 'Elegante e exclusivo',
    preset: noitePreset,
    swatch: { bg: '#0a0b0c', primary: '#f59e0b', text: '#ffffff' },
  },
  {
    id: 'acolhimento',
    name: 'Acolhimento',
    description: 'Quente e humano, tons terrosos e tipografia serifada. Para terapias acolhedoras.',
    mood: 'Caloroso e orgânico',
    preset: acolhimentoPreset,
    swatch: { bg: '#faf7f2', primary: '#b45309', text: '#292524' },
  },
  {
    id: 'sereno',
    name: 'Sereno',
    description: 'Clínico e calmo, layout limpo com verde-água. Para abordagens técnicas como TCC.',
    mood: 'Confiança e clareza',
    preset: serenoPreset,
    swatch: { bg: '#ffffff', primary: '#0d9488', text: '#134e4a' },
  },
  {
    id: 'essencial',
    name: 'Essencial',
    description: 'Minimalista e editorial, preto e branco tipográfico. Para perfis intelectuais.',
    mood: 'Sofisticado e atemporal',
    preset: essencialPreset,
    swatch: { bg: '#ffffff', primary: '#111111', text: '#111111' },
  },
  {
    id: 'vital',
    name: 'Vital',
    description: 'Natureza e bem-estar, verde oliva e fundo suave. Para terapias integrativas.',
    mood: 'Vitalidade e equilíbrio',
    preset: vitalPreset,
    swatch: { bg: '#f7f9f4', primary: '#4d7c0f', text: '#1a2e05' },
  },
];

export function getTemplateById(id: string): TemplateMeta | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
