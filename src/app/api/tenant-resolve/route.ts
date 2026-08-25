import { NextRequest, NextResponse } from 'next/server';
import { TenantResolutionService } from '../../../server/services/tenant-resolution.service';

const tenantResolutionService = new TenantResolutionService();

export async function GET(request: NextRequest) {
  try {
    const host = request.nextUrl.searchParams.get('host');

    if (!host) {
      return NextResponse.json(
        { error: 'Host parameter is required' },
        { status: 400 }
      );
    }

    const resolution = await tenantResolutionService.resolveByHost(host);

    if (!resolution) {
      return NextResponse.json(
        { error: 'Domain not found' },
        { status: 404 }
      );
    }

    if (!resolution.isActive) {
      return NextResponse.json(
        { error: 'Tenant suspended' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      tenantId: resolution.tenant.id,
      status: resolution.tenant.status,
      domainId: resolution.domain?.id || null,
    });
  } catch (error) {
    console.error('Tenant resolution error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
