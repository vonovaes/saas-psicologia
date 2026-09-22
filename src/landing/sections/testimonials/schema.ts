import { SectionSchema } from '@/landing/types';

export const testimonialsSchema: SectionSchema = {
  type: 'testimonials',
  name: 'Depoimentos',
  description: 'Depoimentos de pacientes (anonimizados recomendado).',
  warning:
    'Atenção: a Resolução CFP 06/2019 restringe o uso de depoimentos de pacientes em publicidade de psicólogos. Verifique as normas do seu conselho antes de publicar.',
  variants: [
    { id: 'cards', label: 'Cards' },
    { id: 'quotes', label: 'Citações' },
  ],
  settings: [
    {
      id: 'items', type: 'list', label: 'Depoimentos',
      listFields: [
        { key: 'name', label: 'Nome/Iniciais' },
        { key: 'text', label: 'Depoimento' },
      ],
    },
    { id: 'title', type: 'text', label: 'Título da seção', default: 'O que dizem os pacientes' },
  ],
};
