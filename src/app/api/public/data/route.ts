import { NextRequest, NextResponse } from 'next/server';
import { TenantProfileService } from '@/server/services/tenant-profile.service';
import { TenantSettingsService } from '@/server/services/tenant-settings.service';
import { TenantThemeService } from '@/server/services/tenant-theme.service';
import { FaqService } from '@/server/services/faq.service';
import { TenantResolutionService } from '@/server/services/tenant-resolution.service';
import { publicApiRateLimiter } from '@/server/lib/rate-limit';
import { validatePublicRequest, addCSRFHeaders } from '@/server/lib/csrf-public';

export async function GET(request: NextRequest) {
  try {
    // CSRF protection for public requests
    if (!validatePublicRequest(request)) {
      return NextResponse.json(
        { error: 'Invalid request origin' },
        { status: 403 }
      );
    }

    // Rate limiting check
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown';
    
    const rateLimit = publicApiRateLimiter.check(ip);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          error: 'Too many requests',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '30',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          }
        }
      );
    }

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

    // Buscar dados do tenant
    const [profile, settings, faqs, theme] = await Promise.all([
      new TenantProfileService(tenantId).getProfile(),
      new TenantSettingsService(tenantId).getSettings(),
      new FaqService(tenantId).getAllFaqs(),
      new TenantThemeService(tenantId).getTheme(),
    ]);

    const response = NextResponse.json({
      profile: profile ? {
        displayName: profile.displayName,
        specialties: profile.specialties,
        approaches: profile.approaches,
        city: profile.city,
        description: profile.description,
        address: profile.address,
        attendanceType: profile.attendanceType,
        profileImageUrl: profile.profileImageUrl,
      } : null,
      settings: settings ? {
        whatsappNumber: settings.whatsappNumber,
        instagramHandle: settings.instagramHandle,
        googleMapsEmbedUrl: settings.googleMapsEmbedUrl,
      } : null,
      faqs: faqs || [],
      theme,
    });

    return addCSRFHeaders(response);
  } catch (error) {
    console.error('Error fetching public data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
