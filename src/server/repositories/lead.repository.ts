import { prisma } from '../lib/prisma';
import { BaseRepository } from './base.repository';
import { Lead, LeadSource } from '../lib/prisma-client';

export class LeadRepository extends BaseRepository {
  async findById(id: string): Promise<Lead | null> {
    return prisma.lead.findFirst({
      where: {
        id,
        ...this.baseFilters,
      },
    });
  }

  async create(data: {
    name: string;
    phone: string;
    message?: string;
    source?: LeadSource;
    consentedAt: Date;
  }): Promise<Lead> {
    return prisma.lead.create({
      data: {
        ...data,
        tenantId: this.tenantId,
      },
    });
  }

  async softDelete(id: string): Promise<Lead> {
    return prisma.lead.updateMany({
      where: {
        id,
        ...this.tenantWhereClause,
      },
      data: { deletedAt: new Date() },
    }).then(() => this.findById(id)) as Promise<Lead>;
  }

  async listAll(options?: {
    limit?: number;
    offset?: number;
    source?: LeadSource;
  }): Promise<Lead[]> {
    const { limit = 50, offset = 0, source } = options || {};

    return prisma.lead.findMany({
      where: {
        ...this.baseFilters,
        ...(source && { source }),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async count(options?: { source?: LeadSource }): Promise<number> {
    const { source } = options || {};

    return prisma.lead.count({
      where: {
        ...this.baseFilters,
        ...(source && { source }),
      },
    });
  }

  async findByDateRange(startDate?: Date, endDate?: Date): Promise<Lead[]> {
    const dateFilter: any = {};
    
    if (startDate) {
      dateFilter.gte = startDate;
    }
    if (endDate) {
      dateFilter.lte = endDate;
    }

    return prisma.lead.findMany({
      where: {
        ...this.baseFilters,
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
