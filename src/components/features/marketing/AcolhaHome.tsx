import {
  Globe,
  LayoutDashboard,
  Lock,
  MessageCircle,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { AcolhaFaq } from '@/components/features/marketing/AcolhaFaq';
import { AcolhaHeader } from '@/components/features/marketing/AcolhaHeader';
import { KnowAcolhaCta } from '@/components/features/marketing/KnowAcolhaCta';
import { Badge } from '@/components/features/marketing/ui/badge';
import { Card, CardDescription, CardTitle } from '@/components/features/marketing/ui/card';
import { MarketingButton } from '@/components/features/marketing/ui/button';

type AcolhaHomeProps = {
  loginHref: string;
  salesContactUrl: string | null;
};

const steps = [
  {
    title: 'Configure seu perfil',
    description: 'Inclua apresentação, CRP, especialidades, foto e forma de atendimento.',
  },
  {
    title: 'Conecte seu domínio',
    description: 'Publique em um endereço próprio, com HTTPS, sem operar certificado na mão.',
  },
  {
    title: 'Receba contatos',
    description: 'Quem visita a página encontra um caminho claro: WhatsApp ou formulário.',
  },
];

const features = [
  {
    title: 'Landing page responsiva',
    description: 'Uma página rápida, mobile-first e pensada para transformar visita em conversa.',
    icon: Smartphone,
  },
  {
    title: 'Painel simples',
    description: 'Atualize perfil, FAQ e informações de contato sem depender de uma equipe técnica.',
    icon: LayoutDashboard,
  },
  {
    title: 'WhatsApp e formulário',
    description: 'Dois caminhos de conversão, com consentimento de privacidade no envio do formulário.',
    icon: MessageCircle,
  },
  {
    title: 'Domínio próprio',
    description: 'Sua página no seu endereço, com certificado gerenciado automaticamente.',
    icon: Globe,
  },
  {
    title: 'Privacidade no fluxo',
    description: 'Leads isolados por profissional, com base para atender pedidos da LGPD.',
    icon: ShieldCheck,
  },
  {
    title: 'Analytics do seu jeito',
    description: 'IDs de GTM, GA4 e anúncios ficam na sua página, sem misturar dados de outros.',
    icon: Lock,
  },
];

export function AcolhaHome({ loginHref, salesContactUrl }: AcolhaHomeProps) {
  return (
    <div className="acolha-home min-h-screen bg-acolha-canvas text-acolha-ink">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        Ir para o conteúdo
      </a>

      <AcolhaHeader loginHref={loginHref} salesContactUrl={salesContactUrl} />

      <main id="conteudo">
        <section className="relative overflow-hidden px-6 pb-20 pt-10 lg:px-8 lg:pb-28 lg:pt-16">
          <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-acolha-mist blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.08fr_.92fr]">
            <div>
              <Badge>Presença digital para psicólogos</Badge>
              <h1 className="mt-6 max-w-3xl text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Uma página profissional para ser encontrado com mais clareza.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-acolha-body">
                O Acolha reúne landing page, domínio próprio e um painel simples para transformar visitas em
                contatos — sem CRM, agenda ou construtor de sites.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <KnowAcolhaCta salesContactUrl={salesContactUrl} />
                <MarketingButton href={loginHref} variant="secondary" size="lg">
                  Entrar
                </MarketingButton>
              </div>
              <p id="acolha-cta-note" className="mt-4 text-sm text-acolha-muted">
                {salesContactUrl
                  ? 'Conversa inicial para entender se o Acolha faz sentido para o seu consultório.'
                  : 'O convite para conhecer o Acolha ainda é uma prévia visual nesta fase.'}
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-[0_28px_80px_-35px_rgba(24,49,43,0.35)]">
              <div className="rounded-[1.4rem] bg-acolha-mist p-7 sm:p-9" aria-hidden="true">
                <div className="mb-10 flex items-center justify-between">
                  <span className="text-sm font-medium text-acolha-accent">Prévia da sua página</span>
                  <span className="h-3 w-3 rounded-full bg-[#8fc3aa]" />
                </div>
                <div className="h-16 w-16 rounded-2xl bg-[#cbe5d7]" />
                <div className="mt-6 h-5 w-48 rounded-full bg-acolha-accent" />
                <div className="mt-3 h-3 w-full rounded-full bg-[#c9dad1]" />
                <div className="mt-2 h-3 w-4/5 rounded-full bg-[#c9dad1]" />
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white p-4 text-sm text-acolha-body">Ansiedade</div>
                  <div className="rounded-xl bg-white p-4 text-sm text-acolha-body">Terapia online</div>
                </div>
                <div className="mt-8 rounded-xl bg-acolha-accent px-5 py-3 text-center text-sm font-semibold text-white">
                  Falar pelo WhatsApp
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="problema" className="px-6 py-20 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-medium tracking-[0.16em] text-acolha-accent uppercase">O cenário</p>
              <h2 className="mt-4 max-w-lg text-3xl font-medium tracking-tight sm:text-4xl">
                Ter presença digital não deveria exigir virar gestor de tecnologia.
              </h2>
            </div>
            <div className="space-y-5 text-lg leading-8 text-acolha-body">
              <p>
                Muitos profissionais precisam de um destino claro para campanhas e indicações, mas acabam
                entre páginas genéricas, ferramentas demais ou um site que ninguém atualiza.
              </p>
              <p>
                O Acolha é enxuto de propósito: uma página de captação, dados sob seu controle e um painel
                para manter o essencial em dia.
              </p>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="bg-acolha-mist px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium tracking-[0.16em] text-acolha-accent uppercase">Simples desde o início</p>
            <h2 className="mt-4 max-w-xl text-3xl font-medium tracking-tight sm:text-4xl">
              Três passos até a sua página estar no ar.
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <Card key={step.title} className="border-0">
                  <span className="text-sm font-semibold text-acolha-accent">0{index + 1}</span>
                  <CardTitle className="mt-8">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="recursos" className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium tracking-[0.16em] text-acolha-accent uppercase">Feito para o essencial</p>
            <h2 className="mt-4 max-w-xl text-3xl font-medium tracking-tight sm:text-4xl">
              O que a plataforma cobre no dia a dia.
            </h2>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-acolha-mist text-acolha-accent">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <CardTitle className="mt-6">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="para-quem" className="bg-acolha-mist px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium tracking-[0.16em] text-acolha-accent uppercase">Para quem é</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl">
              Psicólogos que querem captação sem virar um produto de marketing.
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <Card>
                <CardTitle>Faz sentido se você</CardTitle>
                <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-acolha-body">
                  <li>Precisa de um destino profissional para anúncios ou indicações</li>
                  <li>Quer atualizar a própria página sem pedir ajuda a cada mudança</li>
                  <li>Prefere WhatsApp e formulário a um sistema cheio de módulos</li>
                </ul>
              </Card>
              <Card>
                <CardTitle>Não é o foco se você busca</CardTitle>
                <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-acolha-body">
                  <li>CRM, funis e gestão comercial completa</li>
                  <li>Agenda, prontuário ou recursos clínicos</li>
                  <li>Editor visual ou vários templates para experimentar</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        <section id="perguntas" className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium tracking-[0.16em] text-acolha-accent uppercase">Perguntas frequentes</p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">O essencial, sem promessas vazias.</h2>
            <p className="mt-4 leading-7 text-acolha-body">
              O Acolha não promete volume de pacientes nem resultado clínico. A proposta é uma presença
              clara e um caminho simples para o primeiro contato.
            </p>
            <div className="mt-10">
              <AcolhaFaq />
            </div>
          </div>
        </section>

        <section className="px-6 pb-20 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-[2rem] bg-acolha-accent px-7 py-12 text-center text-white sm:px-12">
            <p className="text-sm font-medium tracking-[0.16em] text-[#b8d9c6] uppercase">Próximo passo</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl">
              Clientes entram no painel. Novos interessados conversam com a gente.
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <KnowAcolhaCta salesContactUrl={salesContactUrl} variant="inverse" describedBy="acolha-cta-final" />
              <MarketingButton href={loginHref} variant="secondary" size="lg" className="border-white/30 bg-transparent text-white hover:bg-white/10">
                Entrar
              </MarketingButton>
            </div>
            <p id="acolha-cta-final" className="mt-4 text-sm text-[#d7ebe0]">
              Ainda não há autosserviço de planos nesta versão.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-acolha-line px-6 py-8 text-sm text-acolha-muted">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Acolha</span>
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Rodapé">
            <a href="/privacy" className="hover:text-acolha-ink">
              Privacidade
            </a>
            <span className="text-acolha-line" title="Página de termos ainda não publicada">
              Termos (em breve)
            </span>
            <a href={loginHref} className="hover:text-acolha-ink">
              Entrar
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
