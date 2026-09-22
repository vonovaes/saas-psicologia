import type { Metadata } from 'next';

interface TenantProfileMeta {
  displayName: string;
  description?: string | null;
  city?: string | null;
  specialties?: string[];
  profileImageUrl?: string | null;
}

function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

function fallbackDescription(profile: TenantProfileMeta | null): string {
  if (!profile) return 'Conheça o profissional e entre em contato para iniciar um atendimento.';
  const parts: string[] = [];
  if (profile.city) parts.push(`Psicólogo(a) em ${profile.city}`);
  if (profile.specialties?.length) parts.push(profile.specialties.slice(0, 3).join(', '));
  if (!parts.length) return 'Conheça o profissional e entre em contato para iniciar um atendimento.';
  return truncate(`${parts.join(' — ')}. Agende uma sessão.`);
}

/**
 * Metadata (SEO + Open Graph + Twitter) da página pública de um tenant.
 * Usada tanto em /p/[slug] quanto na resolução por domínio em /.
 * A foto de perfil vira o og:image — é o card que aparece ao
 * compartilhar o link no WhatsApp/redes sociais.
 */
export function buildTenantMetadata(
  profile: TenantProfileMeta | null,
  fallbackName: string,
): Metadata {
  const name = profile?.displayName ?? fallbackName;
  const title = `${name} — Atendimento psicológico`;
  const description = profile?.description
    ? truncate(profile.description)
    : fallbackDescription(profile);
  const image = profile?.profileImageUrl ?? undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pt_BR',
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
