import { NextRequest, NextResponse } from 'next/server';
import { TenantProfileService } from '@/server/services/tenant-profile.service';
import { TenantSettingsService } from '@/server/services/tenant-settings.service';
import { FaqService } from '@/server/services/faq.service';
import { TenantResolutionService } from '@/server/services/tenant-resolution.service';

export async function GET(request: NextRequest) {
  try {
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
    const [profile, settings, faqs] = await Promise.all([
      new TenantProfileService(tenantId).getProfile(),
      new TenantSettingsService(tenantId).getSettings(),
      new FaqService(tenantId).getAllFaqs(),
    ]);

    return NextResponse.json({
      profile: profile ? {
        displayName: profile.displayName,
        specialties: profile.specialties,
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
    });
  } catch (error) {
    console.error('Error fetching public data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
