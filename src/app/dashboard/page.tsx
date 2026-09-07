import { auth } from '@/server/lib/auth';
import { redirect } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { CopyButton } from '@/components/ui/CopyButton';
import { prisma } from '@/server/lib/prisma';
import Link from 'next/link';

const card =
  'rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md';
const iconBadge =
  'flex h-10 w-10 items-center justify-center rounded-xl';

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const tenantId = session.user.tenantId;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [tenant, profile, theme, leadsCount, recentLeads, faqsCount] =
    await Promise.all([
      prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { name: true, slug: true, status: true },
      }),
      prisma.tenantProfile.findUnique({ where: { tenantId } }),
      prisma.tenantTheme.findUnique({ where: { tenantId } }),
      prisma.lead.count({ where: { tenantId } }),
      prisma.lead.count({ where: { tenantId, createdAt: { gte: thirtyDaysAgo } } }),
      prisma.faq.count({ where: { tenantId, deletedAt: null } }),
    ]);

  const firstName = session.user.name?.split(' ')[0] ?? tenant?.name ?? '';
  const publicPath = tenant?.slug ? `/p/${tenant.slug}` : null;
  const isPublished = !!theme?.publishedAt;
  const hasDraft = !!theme?.draft;

  // Checklist de configuração — cada item verifica um pré-requisito real
  const checklist = [
    {
      label: 'Preencher perfil básico (cidade e descrição)',
      done: !!profile?.city && (profile?.description?.length ?? 0) >= 20,
      href: '/editor',
    },
    {
      label: 'Adicionar especialidades',
      done: (profile?.specialties?.length ?? 0) > 0,
      href: '/editor',
    },
    {
      label: 'Configurar WhatsApp de contato',
      done: !!(await prisma.tenantSettings.findUnique({ where: { tenantId } }))?.whatsappNumber,
      href: '/editor',
    },
    {
      label: 'Publicar a página',
      done: isPublished,
      href: '/editor',
    },
    {
      label: 'Compartilhar o link com pacientes',
      done: leadsCount > 0,
      href: publicPath ?? '/dashboard',
    },
  ];
  const doneCount = checklist.filter((i) => i.done).length;
  const progress = Math.round((doneCount / checklist.length) * 100);

  const actions = [
    {
      href: '/editor',
      title: 'Editor de Página',
      desc: 'Personalize sua landing page visualmente',
      iconBg: 'bg-acolha-accent text-white',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      ),
    },
    {
      href: '/leads',
      title: 'Leads',
      desc: `${leadsCount} contato${leadsCount === 1 ? '' : 's'} recebido${leadsCount === 1 ? '' : 's'}`,
      iconBg: 'bg-purple-100 text-purple-600',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      ),
    },
    {
      href: '/faq',
      title: 'Perguntas frequentes',
      desc: `${faqsCount} pergunta${faqsCount === 1 ? '' : 's'} na sua página`,
      iconBg: 'bg-amber-100 text-amber-600',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.091 0 3.228.835 3.772 2 2.091 0 3.228-.835 3.772-2.091V9c-1.087-.766-2.287-1.322-3.515-1.89V5.356c0-1.673-1.107-3.006-2.573-3.006-1.466 0-2.573 1.333-2.573 3.006v1.754C8.228 6.35 7.028 6.906 5.94 7.672V9c.544 1.255 1.681 2.091 3.772 2.091 2.091 0 3.228-.836 3.772-2.091V9c-1.087.766-2.287 1.322-3.515 1.89v1.754c0 1.673 1.107 3.006 2.573 3.006 1.466 0 2.573-1.333 2.573-3.006v-1.754c1.228-.568 2.428-1.124 3.515-1.89V9c-.544-1.255-1.681-2.091-3.772-2.091z" />
      ),
    },
    {
      href: '/profile',
      title: 'Minha Conta',
      desc: 'Dados de acesso, endereço e senha',
      iconBg: 'bg-blue-100 text-blue-600',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      ),
    },
    {
      href: '/data-rights',
      title: 'Direitos de Dados',
      desc: 'Acesso, correção e exclusão (LGPD)',
      iconBg: 'bg-emerald-100 text-emerald-600',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      ),
    },
  ];

  return (
    <AdminLayout
      title={`Olá, ${firstName} 👋`}
      subtitle={tenant?.name}
      userEmail={session.user.email}
      maxWidth="xl"
      actions={
        tenant?.status === 'TRIAL' ? (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            Período de teste
          </span>
        ) : undefined
      }
    >
      {/* ── Banner da página pública ─────────────────────────── */}
      <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-acolha-accent to-[#2e6b57] text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  isPublished ? 'bg-emerald-300' : 'bg-amber-300'
                }`}
              />
              <p className="text-sm font-medium text-white/80">
                {isPublished ? 'Sua página está publicada' : 'Sua página ainda é um rascunho'}
                {hasDraft && ' · há alterações não publicadas'}
              </p>
            </div>
            {publicPath && (
              <p className="mt-1 truncate font-mono text-sm text-white">
                {publicPath}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {publicPath && (
              <>
                <a
                  href={publicPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-acolha-accent transition-colors hover:bg-acolha-mist"
                >
                  Abrir página ↗
                </a>
                <CopyButton
                  text={publicPath}
                  className="rounded-full border border-white/40 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
                />
              </>
            )}
            <Link
              href="/editor"
              className="rounded-full border border-white/40 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Editar página
            </Link>
          </div>
        </div>
      </div>

      {/* ── Métricas ─────────────────────────────────────────── */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className={card}>
          <p className="text-3xl font-semibold text-gray-900">{recentLeads}</p>
          <p className="mt-1 text-sm text-gray-500">Leads nos últimos 30 dias</p>
        </div>
        <div className={card}>
          <p className="text-3xl font-semibold text-gray-900">{leadsCount}</p>
          <p className="mt-1 text-sm text-gray-500">Leads no total</p>
        </div>
        <div className={card}>
          <p className="text-3xl font-semibold text-gray-900">{faqsCount}</p>
          <p className="mt-1 text-sm text-gray-500">Perguntas no FAQ</p>
        </div>
        <div className={card}>
          <p className="text-3xl font-semibold text-gray-900">
            {isPublished ? '🟢' : '🟡'}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {isPublished ? 'Página no ar' : 'Página em rascunho'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* ── Checklist de progresso ─────────────────────────── */}
        <div className={`${card} lg:col-span-2`}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Primeiros passos</h3>
            <span className="text-sm font-medium text-acolha-accent">{progress}%</span>
          </div>
          <div className="mb-5 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-acolha-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <ul className="space-y-3">
            {checklist.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="group flex items-center gap-3 text-sm"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      item.done
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'border-2 border-gray-300 text-transparent group-hover:border-acolha-accent'
                    }`}
                  >
                    ✓
                  </span>
                  <span
                    className={
                      item.done
                        ? 'text-gray-400 line-through'
                        : 'text-gray-700 group-hover:text-acolha-accent'
                    }
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Ações rápidas ──────────────────────────────────── */}
        <div className="lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2">
            {actions.map((a) => (
              <Link key={a.href} href={a.href} className={`${card} group block`}>
                <div className="flex items-start justify-between">
                  <div className={`${iconBadge} ${a.iconBg}`}>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {a.icon}
                    </svg>
                  </div>
                  <span className="text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-acolha-accent">
                    →
                  </span>
                </div>
                <h4 className="mt-4 font-semibold text-gray-900 group-hover:text-acolha-accent">
                  {a.title}
                </h4>
                <p className="mt-1 text-sm text-gray-500">{a.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
