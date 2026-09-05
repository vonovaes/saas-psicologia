import { SectionSchema } from '@/landing/types';

export const contactSchema: SectionSchema = {
  type: 'contact',
  name: 'Contato',
  description: 'Formulário de contato, WhatsApp e Instagram.',
  variants: [
    { id: 'form', label: 'Formulário completo' },
    { id: 'whatsapp-only', label: 'Apenas WhatsApp' },
  ],
  settings: [
    { id: 'whatsappNumber', type: 'text', label: 'WhatsApp', source: 'settings.whatsappNumber' },
    { id: 'instagramHandle', type: 'text', label: 'Instagram', source: 'settings.instagramHandle' },
    { id: 'title', type: 'text', label: 'Título da seção', default: 'Entre em contato' },
    { id: 'subtitle', type: 'text', label: 'Subtítulo', default: 'Tire suas dúvidas ou agende sua primeira consulta' },
  ],
};
