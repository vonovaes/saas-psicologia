import { prisma } from '../lib/prisma';
import { BaseRepository } from './base.repository';
import { Domain, DomainDnsStatus, DomainSslStatus } from '../lib/prisma-client';

export class DomainRepository extends BaseRepository {
  async findById(id: string): Promise<Domain | null> {
    return prisma.domain.findFirst({
      where: {
        id,
        ...this.baseFilters,
      },
    });
  }

  async findByDomain(domain: string): Promise<Domain | null> {
    return prisma.domain.findFirst({
      where: {
        domain,
        ...this.baseFilters,
      },
    });
  }

  async findPrimary(): Promise<Domain | null> {
    return prisma.domain.findFirst({
      where: {
        ...this.baseFilters,
        isPrimary: true,
      },
    });
  }

  async create(data: {
    domain: string;
    isPrimary?: boolean;
  }): Promise<Domain> {
    return prisma.domain.create({
      data: {
        ...data,
        tenantId: this.tenantId,
      },
    });
  }

  async update(id: string, data: Partial<Domain>): Promise<Domain> {
    return prisma.domain.updateMany({
      where: {
        id,
        ...this.tenantWhereClause,
      },
      data,
    }).then(() => this.findById(id)) as Promise<Domain>;
  }

  async updateDnsStatus(id: string, status: DomainDnsStatus): Promise<Domain> {
    return this.update(id, { dnsStatus: status });
  }

  async updateSslStatus(id: string, status: DomainSslStatus): Promise<Domain> {
    return this.update(id, { sslStatus: status });
  }

  async setPrimary(id: string): Promise<Domain> {
    await prisma.domain.updateMany({
      where: {
        ...this.tenantWhereClause,
        isPrimary: true,
      },
      data: { isPrimary: false },
    });

    return this.update(id, { isPrimary: true });
  }

  async softDelete(id: string): Promise<Domain> {
    return prisma.domain.updateMany({
      where: {
        id,
        ...this.tenantWhereClause,
      },
      data: { deletedAt: new Date() },
    }).then(() => this.findById(id)) as Promise<Domain>;
  }

  async listAll(): Promise<Domain[]> {
    return prisma.domain.findMany({
      where: this.baseFilters,
      orderBy: { createdAt: 'desc' },
    });
  }
}
