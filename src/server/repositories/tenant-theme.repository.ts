import { prisma } from '../lib/prisma';
import { BaseRepository } from './base.repository';
import { TenantTheme, Prisma } from '../lib/prisma-client';
import { ThemeDraft } from '@/landing/themes/tokens';

interface ThemeDataInput {
  templateId?: string;
  tokens?: Prisma.InputJsonValue;
  sections?: Prisma.InputJsonValue;
  draft?: Prisma.InputJsonValue | typeof Prisma.JsonNull;
  publishedAt?: Date;
}

export class TenantThemeRepository extends BaseRepository {
  async findByTenant(): Promise<TenantTheme | null> {
    return prisma.tenantTheme.findUnique({
      where: { tenantId: this.tenantId },
    });
  }

  async create(data: {
    templateId?: string;
    tokens?: Prisma.InputJsonValue;
    sections?: Prisma.InputJsonValue;
  }): Promise<TenantTheme> {
    return prisma.tenantTheme.create({
      data: {
        tenantId: this.tenantId,
        templateId: data.templateId ?? 'noite',
        tokens: data.tokens ?? {},
        sections: data.sections ?? [],
      },
    });
  }

  async update(data: ThemeDataInput): Promise<TenantTheme> {
    return prisma.tenantTheme.update({
      where: { tenantId: this.tenantId },
      data,
    });
  }

  async upsert(data: ThemeDataInput): Promise<TenantTheme> {
    return prisma.tenantTheme.upsert({
      where: { tenantId: this.tenantId },
      create: {
        tenantId: this.tenantId,
        templateId: data.templateId ?? 'noite',
        tokens: data.tokens ?? {},
        sections: data.sections ?? [],
      },
      update: data,
    });
  }
}
