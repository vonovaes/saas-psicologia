import { prisma } from '../lib/prisma';
import { BaseRepository } from './base.repository';
import { AuditLog, Prisma } from '../lib/prisma-client';

export class AuditLogRepository extends BaseRepository {
  async create(data: {
    action: string;
    resource: string;
    userId?: string;
    metadata?: Prisma.InputJsonValue;
  }): Promise<AuditLog> {
    return prisma.auditLog.create({
      data: {
        ...data,
        tenantId: this.tenantId,
      },
    });
  }

  async findByUserId(userId: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<AuditLog[]> {
    const { limit = 100, offset = 0 } = options || {};

    return prisma.auditLog.findMany({
      where: {
        userId,
        ...this.tenantWhereClause,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async findByResource(resource: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<AuditLog[]> {
    const { limit = 100, offset = 0 } = options || {};

    return prisma.auditLog.findMany({
      where: {
        resource,
        ...this.tenantWhereClause,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async listAll(options?: {
    limit?: number;
    offset?: number;
  }): Promise<AuditLog[]> {
    const { limit = 100, offset = 0 } = options || {};

    return prisma.auditLog.findMany({
      where: this.tenantWhereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async count(): Promise<number> {
    return prisma.auditLog.count({
      where: this.tenantWhereClause,
    });
  }
}
