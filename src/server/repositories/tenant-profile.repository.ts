import { prisma } from '../lib/prisma';
import { BaseRepository } from './base.repository';
import { TenantProfile } from '../lib/prisma-client';

export class TenantProfileRepository extends BaseRepository {
  async findByTenant(): Promise<TenantProfile | null> {
    return prisma.tenantProfile.findUnique({
      where: { tenantId: this.tenantId },
    });
  }

  async create(data: {
    displayName: string;
    specialties: string[];
    approaches?: string[];
    city: string;
    description: string;
    address?: string;
    profileImageUrl?: string;
    attendanceType?: string;
  }): Promise<TenantProfile> {
    return prisma.tenantProfile.create({
      data: {
        ...data,
        tenantId: this.tenantId,
      },
    });
  }

  async update(data: Partial<TenantProfile>): Promise<TenantProfile> {
    return prisma.tenantProfile.update({
      where: { tenantId: this.tenantId },
      data,
    });
  }

  async upsert(data: Partial<TenantProfile>): Promise<TenantProfile> {
    return prisma.tenantProfile.upsert({
      where: { tenantId: this.tenantId },
      create: {
        tenantId: this.tenantId,
        displayName: data.displayName ?? '',
        specialties: data.specialties ?? [],
        approaches: data.approaches ?? [],
        city: data.city ?? '',
        description: data.description ?? '',
        address: data.address,
        profileImageUrl: data.profileImageUrl,
        attendanceType: data.attendanceType,
      },
      update: data,
    });
  }

  async getProfile(): Promise<TenantProfile | null> {
    return this.findByTenant();
  }

  async softDelete(): Promise<TenantProfile> {
    return prisma.tenantProfile.update({
      where: { tenantId: this.tenantId },
      data: { deletedAt: new Date() },
    });
  }

  async hardDelete(): Promise<void> {
    await prisma.tenantProfile.delete({
      where: { tenantId: this.tenantId },
    });
  }
}
