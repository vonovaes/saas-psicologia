import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { AcolhaHome } from '@/components/features/marketing/AcolhaHome';
import TenantLandingPage from '@/components/features/tenant/TenantLandingPage';
import { getHostname, getLoginHref, getSalesContactUrl, isPlatformHost } from '@/lib/platform-host';
import { TenantResolutionService } from '@/server/services';

const tenantResolutionService = new TenantResolutionService();

// Um host *.vercel.app pode ser um domínio customizado registrado por um
// tenant na tabela Domain. Só cai na home da plataforma se não estiver
// registrado (URL principal do deploy, previews de branch).
async function isTenantHost(host: string): Promise<boolean> {
  if (!isPlatformHost(host)) return true;
  if (!getHostname(host).endsWith('.vercel.app')) return false;
  return (await tenantResolutionService.resolveByHost(host)) !== null;
}

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get('host') ?? 'localhost';

  if (!(await isTenantHost(host))) {
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

  if (!(await isTenantHost(host))) {
    return <AcolhaHome loginHref={getLoginHref()} salesContactUrl={getSalesContactUrl()} />;
  }

  return <TenantLandingPage />;
}
