import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/server/lib/prisma';
import { SiteRenderer } from '@/landing/SiteRenderer';
import { TenantThemeData } from '@/landing/themes/tokens';
import { SiteData } from '@/landing/types';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getTenantBySlug(slug: string) {
  return prisma.tenant.findUnique({
    where: { slug },
    include: {
      profile: true,
      settings: true,
      faqs: { where: { deletedAt: null }, orderBy: { position: 'asc' } },
      theme: true,
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await getTenantBySlug(slug);

  if (!tenant || tenant.deletedAt || (tenant.status !== 'ACTIVE' && tenant.status !== 'TRIAL')) {
    return { title: 'Página não encontrada' };
  }

  const name = tenant.profile?.displayName ?? tenant.name;
  return {
    title: `${name} — Atendimento psicológico`,
    description: tenant.profile?.description ?? 'Conheça o profissional e entre em contato.',
  };
}

/**
 * Página pública do tenant via path: /p/[slug]
 * Alternativa ao domínio personalizado — usada enquanto o tenant
 * não configura um domínio próprio.
 */
export default async function PublicTenantPage({ params }: Props) {
  const { slug } = await params;
  const tenant = await getTenantBySlug(slug);

  if (!tenant || tenant.deletedAt || (tenant.status !== 'ACTIVE' && tenant.status !== 'TRIAL')) {
    notFound();
  }

  const { profile, settings, faqs, theme } = tenant;

  const data: SiteData = {
    profile: profile
      ? {
          displayName: profile.displayName,
          specialties: profile.specialties,
          approaches: profile.approaches,
          city: profile.city,
          description: profile.description,
          address: profile.address ?? '',
          attendanceType: profile.attendanceType ?? '',
          profileImageUrl: profile.profileImageUrl,
        }
      : null,
    settings: settings
      ? {
          whatsappNumber: settings.whatsappNumber ?? '',
          instagramHandle: settings.instagramHandle ?? '',
          googleMapsEmbedUrl: settings.googleMapsEmbedUrl ?? '',
        }
      : null,
    faqs: faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer })),
  };

  const themeData = theme
    ? ({
        templateId: theme.templateId,
        tokens: theme.tokens,
        sections: theme.sections,
      } as unknown as TenantThemeData)
    : undefined;

  return <SiteRenderer data={data} theme={themeData} />;
}
