import { TenantSettingsRepository, AuditLogRepository } from '../repositories';
import { TenantSettings } from '../lib/prisma-client';

export class TenantSettingsService {
  private settingsRepository: TenantSettingsRepository;
  private auditLogRepository: AuditLogRepository;

  constructor(tenantId: string) {
    this.settingsRepository = new TenantSettingsRepository(tenantId);
    this.auditLogRepository = new AuditLogRepository(tenantId);
  }

  async getSettings(): Promise<TenantSettings | null> {
    return this.settingsRepository.findByTenant();
  }

  async createSettings(data: {
    whatsappNumber?: string;
    instagramHandle?: string;
    googleMapsEmbedUrl?: string;
    googleTagManagerId?: string;
    googleAnalyticsId?: string;
    googleAdsId?: string;
    metaPixelId?: string;
  }): Promise<TenantSettings> {
    const settings = await this.settingsRepository.create(data);

    await this.auditLogRepository.create({
      action: 'SETTINGS_CREATED',
      resource: 'TenantSettings',
      metadata: { hasWhatsApp: !!settings.whatsappNumber },
    });

    return settings;
  }

  async updateSettings(data: Partial<TenantSettings>): Promise<TenantSettings> {
    const settings = await this.settingsRepository.update(data);

    await this.auditLogRepository.create({
      action: 'SETTINGS_UPDATED',
      resource: 'TenantSettings',
      metadata: { changes: data },
    });

    return settings;
  }

  async upsertSettings(data: {
    whatsappNumber?: string;
    instagramHandle?: string;
    googleMapsEmbedUrl?: string;
    googleTagManagerId?: string;
    googleAnalyticsId?: string;
    googleAdsId?: string;
    metaPixelId?: string;
  }): Promise<TenantSettings> {
    const existingSettings = await this.getSettings();
    const settings = await this.settingsRepository.upsert(data);

    const action = existingSettings ? 'SETTINGS_UPDATED' : 'SETTINGS_CREATED';

    await this.auditLogRepository.create({
      action,
      resource: 'TenantSettings',
      metadata: { changes: data },
    });

    return settings;
  }

  async updateAnalyticsIds(data: {
    googleTagManagerId?: string;
    googleAnalyticsId?: string;
    googleAdsId?: string;
    metaPixelId?: string;
  }): Promise<TenantSettings> {
    return this.updateSettings(data);
  }

  async updateContactInfo(data: {
    whatsappNumber?: string;
    instagramHandle?: string;
  }): Promise<TenantSettings> {
    return this.updateSettings(data);
  }

  async updateLocationInfo(data: {
    googleMapsEmbedUrl?: string;
  }): Promise<TenantSettings> {
    return this.updateSettings(data);
  }
}
