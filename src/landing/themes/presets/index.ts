import { TenantThemeData } from '../tokens';
import { noitePreset } from './noite';
import { acolhimentoPreset } from './acolhimento';
import { serenoPreset } from './sereno';
import { essencialPreset } from './essencial';
import { vitalPreset } from './vital';
import { auroraPreset } from './aurora';
import { oceanoPreset } from './oceano';
import { solarPreset } from './solar';
import { grafitePreset } from './grafite';
import { brotoPreset } from './broto';

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
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Lavanda suave e calma noturna. Para ansiedade, sono e público jovem.',
    mood: 'Sereno e acolhedor',
    preset: auroraPreset,
    swatch: { bg: '#f6f4fc', primary: '#6d5fb8', text: '#241d3d' },
  },
  {
    id: 'oceano',
    name: 'Oceano',
    description: 'Azul-marinho sóbrio e organizado. Para neuropsi e público corporativo.',
    mood: 'Confiança clínica',
    preset: oceanoPreset,
    swatch: { bg: '#f4f8fb', primary: '#1d4e89', text: '#0c2334' },
  },
  {
    id: 'solar',
    name: 'Solar',
    description: 'Terracota quente e otimista. Para psicologia positiva e coaching.',
    mood: 'Energia acolhedora',
    preset: solarPreset,
    swatch: { bg: '#fff8f0', primary: '#c2410c', text: '#2b1a12' },
  },
  {
    id: 'grafite',
    name: 'Grafite',
    description: 'Dark neutro e direto, acento menta. Para psi. organizacional e esportiva.',
    mood: 'Sóbrio e objetivo',
    preset: grafitePreset,
    swatch: { bg: '#111318', primary: '#5eead4', text: '#f1f5f9' },
  },
  {
    id: 'broto',
    name: 'Broto',
    description: 'Pastel alegre e formas redondas. Para psicologia infantil e pais.',
    mood: 'Lúdico e leve',
    preset: brotoPreset,
    swatch: { bg: '#fffdf6', primary: '#d13d6b', text: '#33302b' },
  },
];

export function getTemplateById(id: string): TemplateMeta | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
