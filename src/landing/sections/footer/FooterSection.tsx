'use client';

import { SiteData } from '@/landing/types';
import { InlineText } from '@/components/features/editor/inline/InlineText';

interface FooterSectionProps {
  data: SiteData;
  editable?: boolean;
  onUpdateContent?: (source: string, value: unknown) => void;
}

export function FooterSection({ data, editable, onUpdateContent }: FooterSectionProps) {
  const { profile, settings } = data;
  if (!profile) return null;

  const update = (key: string) => (value: string) => {
    onUpdateContent?.(`profile.${key}`, value);
  };

  return (
    <footer className="bg-site-bg border-t border-white/5 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid @md:grid-cols-3 gap-6 @sm:p-12 mb-12">
          <div>
            <InlineText
              as="h3"
              className="text-2xl font-light mb-4 text-site-text"
              value={profile.displayName}
              editable={editable}
              onChange={update('displayName')}
              placeholder="Nome do profissional"
            />
            <InlineText
              as="p"
              className="text-site-text-muted font-light"
              value={profile.city}
              editable={editable}
              onChange={update('city')}
              placeholder="Cidade"
            />
            {profile.address && (
              <InlineText
                as="p"
                className="text-site-text-muted font-light mt-2"
                value={profile.address}
                editable={editable}
                onChange={update('address')}
                placeholder="Endereço"
              />
            )}
          </div>
          <div>
            <h3 className="text-lg font-light mb-6 text-site-text">Contato</h3>
            {settings?.whatsappNumber && (
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-site-text-muted hover:text-site-primary transition-colors mb-3 font-light"
              >
                WhatsApp: {settings.whatsappNumber}
              </a>
            )}
            {settings?.instagramHandle && (
              <a
                href={`https://instagram.com/${settings.instagramHandle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-site-text-muted hover:text-site-primary transition-colors font-light"
              >
                Instagram: {settings.instagramHandle}
              </a>
            )}
            <a
              href="/privacy"
              className="block text-site-text-muted hover:text-site-primary transition-colors font-light mt-3"
            >
              Política de Privacidade
            </a>
          </div>
          <div>
            <h3 className="text-lg font-light mb-6 text-site-text">Atendimento</h3>
            <InlineText
              as="p"
              className="text-site-text-muted font-light"
              value={profile.attendanceType}
              editable={editable}
              onChange={update('attendanceType')}
              placeholder="Tipo de atendimento"
            />
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 text-center">
          <p className="text-site-text-muted font-light">
            &copy; {new Date().getFullYear()} {profile.displayName}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
