import { SectionSchema } from '@/landing/types';

export const aboutSchema: SectionSchema = {
  type: 'about',
  name: 'Sobre Mim',
  description: 'Apresentação do profissional, tipo de atendimento, cidade e endereço.',
  variants: [
    { id: 'default', label: 'Padrão (texto + cards)' },
    { id: 'minimal', label: 'Minimalista (só texto)' },
  ],
  settings: [
    { id: 'description', type: 'textarea', label: 'Texto sobre você', source: 'profile.description' },
    { id: 'attendanceType', type: 'select', label: 'Tipo de atendimento', source: 'profile.attendanceType' },
    { id: 'city', type: 'text', label: 'Cidade', source: 'profile.city' },
    { id: 'address', type: 'text', label: 'Endereço', source: 'profile.address' },
    { id: 'title', type: 'text', label: 'Título da seção', default: 'Experiência que transforma' },
  ],
};
