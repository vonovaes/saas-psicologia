import { SectionSchema } from '@/landing/types';

export const heroSchema: SectionSchema = {
  type: 'hero',
  name: 'Cabeçalho Principal',
  description: 'Primeira dobra da página: nome, cidade, descrição, especialidades e foto.',
  variants: [
    { id: 'split', label: 'Dividido (texto + foto)' },
    { id: 'centered', label: 'Centralizado' },
    { id: 'minimal', label: 'Minimalista' },
  ],
  settings: [
    { id: 'displayName', type: 'text', label: 'Nome de exibição', source: 'profile.displayName' },
    { id: 'city', type: 'text', label: 'Cidade', source: 'profile.city' },
    { id: 'description', type: 'textarea', label: 'Descrição', source: 'profile.description' },
    { id: 'photo', type: 'image', label: 'Foto profissional', source: 'profile.profileImageUrl' },
    { id: 'attendanceType', type: 'select', label: 'Tipo de atendimento', source: 'profile.attendanceType' },
    { id: 'ctaText', type: 'text', label: 'Texto do botão', default: 'Agendar Consulta' },
    { id: 'eyebrow', type: 'text', label: 'Rótulo superior', default: 'Psicologia Clínica' },
  ],
};
