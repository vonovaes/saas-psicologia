import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/lib/auth';
import { TenantProfileService } from '@/server/services/tenant-profile.service';
import { TenantSettingsService } from '@/server/services/tenant-settings.service';

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

    const [profile, settings] = await Promise.all([
      profileService.getProfile(),
      settingsService.getSettings(),
    ]);

    return NextResponse.json({
      profile: profile ? {
        displayName: profile.displayName,
        specialties: profile.specialties,
        approaches: profile.approaches,
        city: profile.city,
        description: profile.description,
        address: profile.address,
        attendanceType: profile.attendanceType,
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

    // Atualizar perfil se fornecido
    if (body.profile) {
      await profileService.updateProfile(body.profile);
    }

    // Atualizar configurações se fornecido
    if (body.settings) {
      await settingsService.updateSettings(body.settings);
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
