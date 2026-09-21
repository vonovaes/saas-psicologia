import { redirect } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { TenantsTable } from '@/components/features/admin/TenantsTable';
import { requireSuperAdmin } from '@/server/lib/admin';
import { prisma } from '@/server/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await requireSuperAdmin();
  if (!session) redirect('/dashboard');

  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      contactEmail: true,
      status: true,
      plan: true,
      createdAt: true,
      _count: {
        select: {
          leads: { where: { deletedAt: null } },
          users: { where: { deletedAt: null } },
        },
      },
      theme: { select: { publishedAt: true } },
      domains: {
        where: { deletedAt: null },
        select: { domain: true, dnsStatus: true, sslStatus: true },
      },
    },
  });

  const rows = tenants.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    contactEmail: t.contactEmail,
    status: t.status,
    plan: t.plan,
    createdAt: t.createdAt.toISOString(),
    leadsCount: t._count.leads,
    usersCount: t._count.users,
    published: t.theme?.publishedAt != null,
    domains: t.domains,
  }));

  const active = tenants.filter((t) => t.status !== 'SUSPENDED').length;

  return (
    <AdminLayout
      title="Administração da plataforma"
      subtitle={`${tenants.length} tenants · ${active} ativos`}
      userEmail={session.user.email}
      maxWidth="7xl"
    >
      <TenantsTable tenants={rows} />
    </AdminLayout>
  );
}
