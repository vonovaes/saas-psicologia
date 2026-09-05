import { TenantThemeRepository } from '../repositories/tenant-theme.repository';
import { AuditLogRepository } from '../repositories';
import { TenantTheme, Prisma } from '../lib/prisma-client';
import {
  TenantThemeData,
  ThemeDraft,
  DEFAULT_THEME,
  tenantThemeSchema,
} from '@/landing/themes/tokens';

export class TenantThemeService {
  private themeRepository: TenantThemeRepository;
  private auditLogRepository: AuditLogRepository;

  constructor(tenantId: string) {
    this.themeRepository = new TenantThemeRepository(tenantId);
    this.auditLogRepository = new AuditLogRepository(tenantId);
  }

  /**
   * Retorna o tema do tenant. Se não existir, retorna o tema padrão (Noite).
   */
  async getTheme(): Promise<TenantThemeData> {
    const theme = await this.themeRepository.findByTenant();
    if (!theme) return DEFAULT_THEME;

    // Mescla com defaults para garantir campos completos
    const parsed = tenantThemeSchema.safeParse({
      templateId: theme.templateId,
      tokens: theme.tokens,
      sections: theme.sections,
    });

    return parsed.success ? parsed.data : DEFAULT_THEME;
  }

  /**
   * Retorna o rascunho (draft) salvo, se existir.
   */
  async getDraft(): Promise<ThemeDraft | null> {
    const theme = await this.themeRepository.findByTenant();
    if (!theme?.draft) return null;
    return theme.draft as ThemeDraft;
  }

  /**
   * Salva um rascunho sem publicar.
   */
  async saveDraft(draft: ThemeDraft): Promise<TenantTheme> {
    const theme = await this.themeRepository.upsert({
      draft: draft as Prisma.InputJsonValue,
    });

    await this.auditLogRepository.create({
      action: 'THEME_DRAFT_SAVED',
      resource: 'TenantTheme',
      metadata: { hasTemplate: !!draft.templateId, sectionsCount: draft.sections?.length },
    });

    return theme;
  }

  /**
   * Publica o tema: aplica o draft (se existir) ou os dados enviados,
   * limpa o draft e registra publishedAt.
   */
  async publish(data?: Partial<TenantThemeData>): Promise<TenantTheme> {
    const existing = await this.themeRepository.findByTenant();
    const draft = (existing?.draft as ThemeDraft | null) ?? {};

    const merged = {
      templateId: data?.templateId ?? draft.templateId ?? existing?.templateId ?? 'noite',
      tokens: (data?.tokens ?? draft.tokens ?? existing?.tokens ?? {}) as Prisma.InputJsonValue,
      sections: (data?.sections ?? draft.sections ?? existing?.sections ?? []) as Prisma.InputJsonValue,
    };

    const theme = await this.themeRepository.upsert({
      ...merged,
      draft: Prisma.JsonNull,
      publishedAt: new Date(),
    });

    await this.auditLogRepository.create({
      action: 'THEME_PUBLISHED',
      resource: 'TenantTheme',
      metadata: { templateId: merged.templateId },
    });

    return theme;
  }

  /**
   * Atualiza o tema publicado diretamente (sem draft).
   */
  async updateTheme(data: Partial<TenantThemeData>): Promise<TenantTheme> {
    const theme = await this.themeRepository.upsert({
      templateId: data.templateId,
      tokens: data.tokens as Prisma.InputJsonValue | undefined,
      sections: data.sections as Prisma.InputJsonValue | undefined,
    });

    await this.auditLogRepository.create({
      action: 'THEME_UPDATED',
      resource: 'TenantTheme',
      metadata: { templateId: data.templateId },
    });

    return theme;
  }
}
