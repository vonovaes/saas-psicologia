import { prisma } from '../lib/prisma';
import { BaseRepository } from './base.repository';
import { Tenant, TenantStatus } from '../lib/prisma-client';

export class TenantRepository extends BaseRepository {
  async findById(id: string): Promise<Tenant | null> {
    return prisma.tenant.findUnique({
      where: { id },
    });
  }

  async findByDomain(domain: string): Promise<Tenant | null> {
    const domainRecord = await prisma.domain.findUnique({
      where: { domain },
      include: { tenant: true },
    });

    return domainRecord?.tenant || null;
  }

  async findByStatus(status: TenantStatus): Promise<Tenant[]> {
    return prisma.tenant.findMany({
      where: { status },
    });
  }

  async create(data: {
    name: string;
    crp: string;
    contactEmail: string;
    plan?: string;
  }): Promise<Tenant> {
    return prisma.tenant.create({
      data,
    });
  }

  async update(id: string, data: Partial<Tenant>): Promise<Tenant> {
    return prisma.tenant.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<Tenant> {
    return prisma.tenant.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
