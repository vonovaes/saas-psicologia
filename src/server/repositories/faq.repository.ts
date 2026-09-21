import { prisma } from '../lib/prisma';
import { BaseRepository } from './base.repository';
import { Faq } from '../lib/prisma-client';

export class FaqRepository extends BaseRepository {
  async listAll(): Promise<Faq[]> {
    return prisma.faq.findMany({
      where: this.baseFilters,
      orderBy: { position: 'asc' },
    });
  }

  /**
   * Substitui todas as FAQs do tenant (usado no publish do editor).
   * Hard delete para não colidir com o índice único (tenantId, position).
   */
  async replaceAll(items: { question: string; answer: string }[]): Promise<Faq[]> {
    return prisma.$transaction(async (tx) => {
      await tx.faq.deleteMany({ where: this.tenantWhereClause });
      await tx.faq.createMany({
        data: items.map((item, i) => ({
          ...item,
          position: i + 1,
          tenantId: this.tenantId,
        })),
      });
      return tx.faq.findMany({
        where: this.baseFilters,
        orderBy: { position: 'asc' },
      });
    });
  }
}
