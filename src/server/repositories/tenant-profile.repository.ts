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

  async upsert(data: {
    displayName: string;
    specialties: string[];
    city: string;
    description: string;
    address?: string;
    profileImageUrl?: string;
    attendanceType?: string;
  }): Promise<TenantProfile> {
    return prisma.tenantProfile.upsert({
      where: { tenantId: this.tenantId },
      create: {
        ...data,
        tenantId: this.tenantId,
      },
      update: data,
    });
  }
}
