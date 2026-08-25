import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { AcolhaHome } from '@/components/features/marketing/AcolhaHome';
import TenantLandingPage from '@/components/features/tenant/TenantLandingPage';
import { getLoginHref, getSalesContactUrl, isPlatformHost } from '@/lib/platform-host';

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get('host') ?? 'localhost';

  if (isPlatformHost(host)) {
    return {
      title: 'Acolha — Presença digital para psicólogos',
      description:
        'Landing page profissional, domínio próprio e painel simples para psicólogos captarem contatos por WhatsApp ou formulário.',
    };
  }

  return {
    title: 'Atendimento psicológico',
    description: 'Conheça o profissional e entre em contato para iniciar um atendimento.',
  };
}

export default async function Home() {
  const host = (await headers()).get('host') ?? 'localhost';

  if (isPlatformHost(host)) {
    return <AcolhaHome loginHref={getLoginHref()} salesContactUrl={getSalesContactUrl()} />;
  }

  return <TenantLandingPage />;
}
