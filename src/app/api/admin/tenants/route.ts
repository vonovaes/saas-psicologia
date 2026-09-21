import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/server/lib/prisma';
import { requireSuperAdmin } from '@/server/lib/admin';

const updateStatusSchema = z.object({
  tenantId: z.string().min(1),
  status: z.enum(['TRIAL', 'ACTIVE', 'SUSPENDED']),
});

/**
 * GET /api/admin/tenants — Lista todos os tenants (somente super admin).
 */
export async function GET() {
  const session = await requireSuperAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
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

    return NextResponse.json({
      tenants: tenants.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        contactEmail: t.contactEmail,
        status: t.status,
        plan: t.plan,
        createdAt: t.createdAt,
        leadsCount: t._count.leads,
        usersCount: t._count.users,
        published: t.theme?.publishedAt != null,
        domains: t.domains,
      })),
    });
  } catch (error) {
    console.error('Error listing tenants:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/tenants — Altera o status de um tenant (somente super admin).
 */
export async function PATCH(request: NextRequest) {
  const session = await requireSuperAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = updateStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const { tenantId, status } = parsed.data;

    const tenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: { status },
      select: { id: true, name: true, slug: true, status: true },
    });

    await prisma.auditLog.create({
      data: {
        tenantId,
        userId: session.user.id,
        action: 'TENANT_STATUS_CHANGED',
        resource: 'Tenant',
        metadata: { status, by: session.user.email },
      },
    });

    return NextResponse.json({ tenant });
  } catch (error) {
    console.error('Error updating tenant status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
