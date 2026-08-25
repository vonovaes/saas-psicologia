import { prisma } from '../lib/prisma';
import { BaseRepository } from './base.repository';
import { Faq } from '../lib/prisma-client';

export class FaqRepository extends BaseRepository {
  async findById(id: string): Promise<Faq | null> {
    return prisma.faq.findFirst({
      where: {
        id,
        ...this.baseFilters,
      },
    });
  }

  async create(data: {
    question: string;
    answer: string;
    position: number;
  }): Promise<Faq> {
    return prisma.faq.create({
      data: {
        ...data,
        tenantId: this.tenantId,
      },
    });
  }

  async update(id: string, data: Partial<Faq>): Promise<Faq> {
    return prisma.faq.updateMany({
      where: {
        id,
        ...this.tenantWhereClause,
      },
      data,
    }).then(() => this.findById(id)) as Promise<Faq>;
  }

  async softDelete(id: string): Promise<Faq> {
    return prisma.faq.updateMany({
      where: {
        id,
        ...this.tenantWhereClause,
      },
      data: { deletedAt: new Date() },
    }).then(() => this.findById(id)) as Promise<Faq>;
  }

  async listAll(): Promise<Faq[]> {
    return prisma.faq.findMany({
      where: this.baseFilters,
      orderBy: { position: 'asc' },
    });
  }

  async updatePositions(updates: { id: string; position: number }[]): Promise<void> {
    await Promise.all(
      updates.map(({ id, position }) =>
        prisma.faq.updateMany({
          where: {
            id,
            ...this.tenantWhereClause,
          },
          data: { position },
        })
      )
    );
  }

  async getNextPosition(): Promise<number> {
    const lastFaq = await prisma.faq.findFirst({
      where: this.baseFilters,
      orderBy: { position: 'desc' },
    });

    return (lastFaq?.position ?? 0) + 1;
  }
}
