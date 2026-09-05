import { SectionSchema } from '@/landing/types';

export const mapSchema: SectionSchema = {
  type: 'map',
  name: 'Localização',
  description: 'Mapa do consultório via Google Maps embed.',
  variants: [
    { id: 'embed', label: 'Mapa incorporado' },
  ],
  settings: [
    { id: 'googleMapsEmbedUrl', type: 'text', label: 'URL de embed do Google Maps', source: 'settings.googleMapsEmbedUrl' },
    { id: 'address', type: 'text', label: 'Endereço', source: 'profile.address' },
    { id: 'title', type: 'text', label: 'Título da seção', default: 'Onde atendo' },
  ],
};
