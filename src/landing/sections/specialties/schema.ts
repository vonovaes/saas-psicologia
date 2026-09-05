import { SectionSchema } from '@/landing/types';

export const specialtiesSchema: SectionSchema = {
  type: 'specialties',
  name: 'Especialidades',
  description: 'Áreas de atuação do profissional.',
  variants: [
    { id: 'cards', label: 'Cards' },
    { id: 'tags', label: 'Tags' },
    { id: 'list', label: 'Lista tipográfica' },
  ],
  settings: [
    { id: 'specialties', type: 'list', label: 'Especialidades', source: 'profile.specialties' },
    { id: 'title', type: 'text', label: 'Título da seção', default: 'Áreas de atuação' },
  ],
};
