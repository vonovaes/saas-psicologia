import { prisma } from '../lib/prisma';
import { BaseRepository } from './base.repository';
import { TenantSettings } from '../lib/prisma-client';

export class TenantSettingsRepository extends BaseRepository {
  async findByTenant(): Promise<TenantSettings | null> {
    return prisma.tenantSettings.findUnique({
      where: { tenantId: this.tenantId },
    });
  }

  async create(data: {
    whatsappNumber?: string;
    instagramHandle?: string;
    googleMapsEmbedUrl?: string;
    googleTagManagerId?: string;
    googleAnalyticsId?: string;
    googleAdsId?: string;
    metaPixelId?: string;
  }): Promise<TenantSettings> {
    return prisma.tenantSettings.create({
      data: {
        ...data,
        tenantId: this.tenantId,
      },
    });
  }

  async update(data: Partial<TenantSettings>): Promise<TenantSettings> {
    return prisma.tenantSettings.update({
      where: { tenantId: this.tenantId },
      data,
    });
  }

  async upsert(data: {
    whatsappNumber?: string;
    instagramHandle?: string;
    googleMapsEmbedUrl?: string;
    googleTagManagerId?: string;
    googleAnalyticsId?: string;
    googleAdsId?: string;
    metaPixelId?: string;
  }): Promise<TenantSettings> {
    return prisma.tenantSettings.upsert({
      where: { tenantId: this.tenantId },
      create: {
        ...data,
        tenantId: this.tenantId,
      },
      update: data,
    });
  }
}
