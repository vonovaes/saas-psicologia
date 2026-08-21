import { NextRequest, NextResponse } from 'next/server';
import { TenantResolutionService } from '../../../server/services/tenant-resolution.service';

const tenantResolutionService = new TenantResolutionService();

export async function GET(request: NextRequest) {
  try {
    const host = request.nextUrl.searchParams.get('host') || 'localhost:3000';

    // Testar resolução
    const resolution = await tenantResolutionService.resolveByHost(host);

    // Testar cache
    const cacheStats = tenantResolutionService.getCacheStats();

    return NextResponse.json({
      host,
      resolution: resolution ? {
        tenantId: resolution.tenant.id,
        tenantName: resolution.tenant.name,
        status: resolution.tenant.status,
        domainId: resolution.domain?.id,
        domain: resolution.domain?.domain,
        isActive: resolution.isActive,
      } : null,
      cacheStats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Test tenant resolution error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
