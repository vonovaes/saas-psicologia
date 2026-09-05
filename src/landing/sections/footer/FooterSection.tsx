'use client';

import { SiteData } from '@/landing/types';

export function FooterSection({ data }: { data: SiteData }) {
  const { profile, settings } = data;
  if (!profile) return null;

  return (
    <footer className="bg-site-bg border-t border-white/5 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-light mb-4 text-site-text">{profile.displayName}</h3>
            <p className="text-site-text-muted font-light">{profile.city}</p>
            {profile.address && (
              <p className="text-site-text-muted font-light mt-2">{profile.address}</p>
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
            <p className="text-site-text-muted font-light">{profile.attendanceType}</p>
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
