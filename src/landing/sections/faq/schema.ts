import { SectionSchema } from '@/landing/types';

export const faqSchema: SectionSchema = {
  type: 'faq',
  name: 'Perguntas Frequentes',
  description: 'Lista de perguntas e respostas em accordion.',
  variants: [
    { id: 'accordion', label: 'Accordion' },
    { id: 'cards', label: 'Cards' },
  ],
  settings: [
    { id: 'faqs', type: 'list', label: 'Perguntas e respostas', source: 'faqs' },
    { id: 'title', type: 'text', label: 'Título da seção', default: 'Perguntas Frequentes' },
  ],
};
