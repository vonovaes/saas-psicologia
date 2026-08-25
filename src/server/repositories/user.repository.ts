import { prisma } from '../lib/prisma';
import { BaseRepository } from './base.repository';
import { User, UserRole } from '../lib/prisma-client';

export class UserRepository extends BaseRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        id,
        ...this.baseFilters,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        email,
        ...this.baseFilters,
      },
    });
  }

  async create(data: {
    email: string;
    passwordHash: string;
    role?: UserRole;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        ...data,
        tenantId: this.tenantId,
      },
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.updateMany({
      where: {
        id,
        ...this.tenantWhereClause,
      },
      data,
    }).then(() => this.findById(id)) as Promise<User>;
  }

  async softDelete(id: string): Promise<User> {
    return prisma.user.updateMany({
      where: {
        id,
        ...this.tenantWhereClause,
      },
      data: { deletedAt: new Date() },
    }).then(() => this.findById(id)) as Promise<User>;
  }

  async listAll(): Promise<User[]> {
    return prisma.user.findMany({
      where: this.baseFilters,
      orderBy: { createdAt: 'desc' },
    });
  }

  async hardDelete(id: string): Promise<void> {
    await prisma.user.deleteMany({
      where: {
        id,
        ...this.tenantWhereClause,
      },
    });
  }
}
