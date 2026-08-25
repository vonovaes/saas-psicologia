import { NextRequest, NextResponse } from 'next/server';
import { TenantResolutionService } from '../../../server/services/tenant-resolution.service';
import { prisma } from '../../../server/lib/prisma';

const tenantResolutionService = new TenantResolutionService();

export async function GET(request: NextRequest) {
  try {
    const host = request.nextUrl.searchParams.get('host') || 'localhost';

    // Testar busca direta no banco
    const directDomain = await prisma.domain.findUnique({
      where: { domain: host },
      include: { tenant: true },
    });

    const resolution = await tenantResolutionService.resolveByHost(host);

    return NextResponse.json({
      host,
      directDomain: directDomain ? {
        id: directDomain.id,
        domain: directDomain.domain,
        tenantId: directDomain.tenantId,
        tenantName: directDomain.tenant.name,
      } : null,
      resolution: resolution ? {
        tenantId: resolution.tenant.id,
        tenantName: resolution.tenant.name,
        status: resolution.tenant.status,
        domainId: resolution.domain?.id,
        domain: resolution.domain?.domain,
        isActive: resolution.isActive,
      } : null,
      cacheStats: tenantResolutionService.getCacheStats(),
    });
  } catch (error) {
    console.error('Test resolve error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
