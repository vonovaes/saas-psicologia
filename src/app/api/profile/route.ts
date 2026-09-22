import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/lib/auth';
import { TenantProfileService } from '@/server/services/tenant-profile.service';
import { TenantSettingsService } from '@/server/services/tenant-settings.service';
import { prisma } from '@/server/lib/prisma';

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
    
    const profileService = new TenantProfileService(tenantId);
    const settingsService = new TenantSettingsService(tenantId);

    const [profile, settings, tenant] = await Promise.all([
      profileService.getProfile(),
      settingsService.getSettings(),
      prisma.tenant.findUnique({ where: { id: tenantId }, select: { slug: true } }),
    ]);

    return NextResponse.json({
      tenantSlug: tenant?.slug,
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
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const tenantId = session.user.tenantId;
    const body = await request.json();

    const profileService = new TenantProfileService(tenantId);
    const settingsService = new TenantSettingsService(tenantId);

    // Whitelist de campos editáveis — evita 500 por campo desconhecido
    // e impede escrita de campos sensíveis (ex: tenantId).
    if (body.profile && typeof body.profile === 'object') {
      const allowed = [
        'displayName', 'specialties', 'approaches', 'city',
        'description', 'address', 'profileImageUrl', 'attendanceType',
      ] as const;
      const patch = Object.fromEntries(
        allowed.filter((k) => k in body.profile).map((k) => [k, body.profile[k]])
      );
      if (Object.keys(patch).length) await profileService.upsertProfile(patch);
    }

    if (body.settings && typeof body.settings === 'object') {
      const allowed = [
        'whatsappNumber', 'instagramHandle', 'googleMapsEmbedUrl',
        'googleTagManagerId', 'googleAnalyticsId', 'googleAdsId', 'metaPixelId',
      ] as const;
      const patch = Object.fromEntries(
        allowed.filter((k) => k in body.settings).map((k) => [k, body.settings[k]])
      );
      if (Object.keys(patch).length) await settingsService.upsertSettings(patch);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
