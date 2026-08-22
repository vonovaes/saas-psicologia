import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/lib/auth';
import { LeadService } from '@/server/services/lead.service';
import { TenantResolutionService } from '@/server/services/tenant-resolution.service';
import { createLeadSchema } from '@/server/dtos/lead.dto';
import { leadRateLimiter } from '@/server/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const tenantId = session.user.tenantId;
    const { searchParams } = new URL(request.url);
    
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const leadService = new LeadService(tenantId);
    
    const leads = await leadService.getLeadsByDateRange(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown';
    
    const rateLimit = leadRateLimiter.check(ip);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          error: 'Too many requests',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          }
        }
      );
    }

    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const host = searchParams.get('host') || request.headers.get('host') || 'localhost';

    // Normalizar host removendo porta
    const normalizedHost = host.split(':')[0];

    // Resolver tenant pelo host
    const tenantResolutionService = new TenantResolutionService();
    const resolution = await tenantResolutionService.resolveByHost(normalizedHost);

    if (!resolution || !resolution.isActive) {
      return NextResponse.json(
        { error: 'Tenant not found or inactive' },
        { status: 404 }
      );
    }

    const tenantId = resolution.tenant.id;

    // Validar dados
    const validatedData = createLeadSchema.parse(body);

    const leadService = new LeadService(tenantId);
    const lead = await leadService.createLead(validatedData);

    return NextResponse.json(
      { lead }, 
      { 
        status: 201,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
        }
      }
    );
  } catch (error) {
    console.error('Error creating lead:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
