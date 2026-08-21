import { prisma } from '../lib/prisma';

export abstract class BaseRepository {
  protected tenantId: string;

  constructor(tenantId: string) {
    if (!tenantId) {
      throw new Error('tenantId is required for all repository operations');
    }
    this.tenantId = tenantId;
  }

  protected get tenantFilter() {
    return { tenantId: this.tenantId };
  }

  protected get tenantWhereClause() {
    return { tenantId: this.tenantId };
  }

  protected get softDeleteFilter() {
    return { deletedAt: null };
  }

  protected get baseFilters() {
    return {
      ...this.tenantWhereClause,
      ...this.softDeleteFilter,
    };
  }
}
