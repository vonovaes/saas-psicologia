import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/server/lib/auth';
import { prisma } from '@/server/lib/prisma';
import { vercelService } from '@/server/services/vercel.service';
import { DomainService } from '@/server/services/domain.service';
import { TenantResolutionService } from '@/server/services/tenant-resolution.service';
import { DomainDnsStatus, DomainSslStatus } from '@/server/lib/prisma-client';

const domainSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(
    /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/,
    'Domínio inválido (ex: seudominio.com.br)'
  );

function getProjectId() {
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!projectId) throw new Error('VERCEL_PROJECT_ID não configurado');
  return projectId;
}

async function requireTenant() {
  const session = await auth();
  if (!session?.user?.tenantId) return null;
  return session.user.tenantId;
}

function isVerified(result: any): boolean {
  return result?.verified === true;
}

/**
 * GET /api/vercel/domains
 *   Sem params → lista domínios do tenant autenticado.
 *   ?domain=x  → verifica o domínio na Vercel e atualiza o status no banco.
 */
export async function GET(req: NextRequest) {
  try {
    const tenantId = await requireTenant();
    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const domainService = new DomainService(tenantId);
    const domainParam = new URL(req.url).searchParams.get('domain')?.trim().toLowerCase();

    // Lista todos os domínios do tenant
    if (!domainParam) {
      const domains = await domainService.listDomains();
      return NextResponse.json({ ok: true, domains });
    }

    // Verificação de um domínio específico (precisa pertencer ao tenant)
    const dbDomain = await domainService.getDomainByDomain(domainParam);
    if (!dbDomain) {
      return NextResponse.json({ error: 'Domínio não encontrado' }, { status: 404 });
    }

    const result = await vercelService.getDomain(getProjectId(), domainParam);

    let updatedDomain = dbDomain;
    if (isVerified(result) && dbDomain.dnsStatus !== DomainDnsStatus.VERIFIED) {
      await domainService.updateDnsStatus(dbDomain.id, DomainDnsStatus.VERIFIED);
      await domainService.updateSslStatus(dbDomain.id, DomainSslStatus.ACTIVE);
      new TenantResolutionService().invalidateCache(domainParam);
      updatedDomain = (await domainService.getDomainById(dbDomain.id)) ?? dbDomain;
    }

    return NextResponse.json({ ok: true, result, domain: updatedDomain });
  } catch (err: any) {
    console.error('Error in /api/vercel/domains (GET)', err);
    return NextResponse.json({ error: err?.message || 'unknown' }, { status: 500 });
  }
}

/**
 * POST /api/vercel/domains
 * Body: { domain: string }
 * Adiciona o domínio ao projeto Vercel e registra no banco vinculado ao tenant.
 */
export async function POST(req: NextRequest) {
  try {
    const tenantId = await requireTenant();
    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = domainSchema.safeParse(body?.domain);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Domínio inválido' },
        { status: 400 }
      );
    }
    const domain = parsed.data;

    // O domínio é único globalmente: se já existe no banco, só pode ser do próprio tenant
    const existing = await prisma.domain.findFirst({
      where: { domain, deletedAt: null },
    });
    if (existing && existing.tenantId !== tenantId) {
      return NextResponse.json(
        { error: 'Este domínio já está em uso por outra conta' },
        { status: 409 }
      );
    }

    const domainService = new DomainService(tenantId);
    const projectId = getProjectId();

    // Se já existe para este tenant, só re-verifica na Vercel
    if (existing) {
      const result = await vercelService.getDomain(projectId, domain);
      return NextResponse.json({ ok: true, result, domain: existing, alreadyExists: true });
    }

    const result = await vercelService.addDomain(projectId, domain);
    const dbDomain = await domainService.createDomain({ domain });

    // Se a Vercel já retornou verificado (domínio re-adicionado), atualiza status
    if (isVerified(result)) {
      await domainService.updateDnsStatus(dbDomain.id, DomainDnsStatus.VERIFIED);
      await domainService.updateSslStatus(dbDomain.id, DomainSslStatus.ACTIVE);
      new TenantResolutionService().invalidateCache(domain);
    }

    return NextResponse.json({ ok: true, result, domain: dbDomain });
  } catch (err: any) {
    console.error('Error in /api/vercel/domains (POST)', err);
    return NextResponse.json({ error: err?.message || 'unknown' }, { status: 500 });
  }
}

/**
 * DELETE /api/vercel/domains?domain=x
 * Remove o domínio do projeto Vercel e marca como removido no banco.
 */
export async function DELETE(req: NextRequest) {
  try {
    const tenantId = await requireTenant();
    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const domainParam = new URL(req.url).searchParams.get('domain')?.trim().toLowerCase();
    if (!domainParam) {
      return NextResponse.json({ error: 'domain query param is required' }, { status: 400 });
    }

    const domainService = new DomainService(tenantId);
    const dbDomain = await domainService.getDomainByDomain(domainParam);
    if (!dbDomain) {
      return NextResponse.json({ error: 'Domínio não encontrado' }, { status: 404 });
    }

    // Remove na Vercel; se já não existir lá, segue mesmo assim para limpar o banco
    try {
      await vercelService.removeDomain(getProjectId(), domainParam);
    } catch (vercelErr) {
      console.warn('Vercel removeDomain failed (continuing):', vercelErr);
    }

    await domainService.softDeleteDomain(dbDomain.id);
    new TenantResolutionService().invalidateCache(domainParam);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Error in /api/vercel/domains (DELETE)', err);
    return NextResponse.json({ error: err?.message || 'unknown' }, { status: 500 });
  }
}
