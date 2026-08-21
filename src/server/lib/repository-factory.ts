import { TenantContext } from './tenant-context';
import {
  BaseRepository,
  TenantRepository,
  UserRepository,
  DomainRepository,
  TenantProfileRepository,
  LeadRepository,
  FaqRepository,
  TenantSettingsRepository,
  AuditLogRepository,
} from '../repositories';

/**
 * Factory para criar repositories com o tenantId do contexto atual
 * Facilita o uso em server components e route handlers
 */
export class RepositoryFactory {
  static async createTenantRepository(): Promise<TenantRepository> {
    const tenantId = await TenantContext.requireTenantId();
    return new TenantRepository(tenantId);
  }

  static async createUserRepository(): Promise<UserRepository> {
    const tenantId = await TenantContext.requireTenantId();
    return new UserRepository(tenantId);
  }

  static async createDomainRepository(): Promise<DomainRepository> {
    const tenantId = await TenantContext.requireTenantId();
    return new DomainRepository(tenantId);
  }

  static async createTenantProfileRepository(): Promise<TenantProfileRepository> {
    const tenantId = await TenantContext.requireTenantId();
    return new TenantProfileRepository(tenantId);
  }

  static async createLeadRepository(): Promise<LeadRepository> {
    const tenantId = await TenantContext.requireTenantId();
    return new LeadRepository(tenantId);
  }

  static async createFaqRepository(): Promise<FaqRepository> {
    const tenantId = await TenantContext.requireTenantId();
    return new FaqRepository(tenantId);
  }

  static async createTenantSettingsRepository(): Promise<TenantSettingsRepository> {
    const tenantId = await TenantContext.requireTenantId();
    return new TenantSettingsRepository(tenantId);
  }

  static async createAuditLogRepository(): Promise<AuditLogRepository> {
    const tenantId = await TenantContext.requireTenantId();
    return new AuditLogRepository(tenantId);
  }

  /**
   * Cria repositories opcionais (retorna null se não houver contexto)
   * Útil para componentes que podem funcionar sem tenant
   */
  static async createTenantRepositorySafe(): Promise<TenantRepository | null> {
    const tenantId = await TenantContext.getTenantId();
    return tenantId ? new TenantRepository(tenantId) : null;
  }

  static async createUserRepositorySafe(): Promise<UserRepository | null> {
    const tenantId = await TenantContext.getTenantId();
    return tenantId ? new UserRepository(tenantId) : null;
  }

  static async createDomainRepositorySafe(): Promise<DomainRepository | null> {
    const tenantId = await TenantContext.getTenantId();
    return tenantId ? new DomainRepository(tenantId) : null;
  }

  static async createTenantProfileRepositorySafe(): Promise<TenantProfileRepository | null> {
    const tenantId = await TenantContext.getTenantId();
    return tenantId ? new TenantProfileRepository(tenantId) : null;
  }

  static async createLeadRepositorySafe(): Promise<LeadRepository | null> {
    const tenantId = await TenantContext.getTenantId();
    return tenantId ? new LeadRepository(tenantId) : null;
  }

  static async createFaqRepositorySafe(): Promise<FaqRepository | null> {
    const tenantId = await TenantContext.getTenantId();
    return tenantId ? new FaqRepository(tenantId) : null;
  }

  static async createTenantSettingsRepositorySafe(): Promise<TenantSettingsRepository | null> {
    const tenantId = await TenantContext.getTenantId();
    return tenantId ? new TenantSettingsRepository(tenantId) : null;
  }

  static async createAuditLogRepositorySafe(): Promise<AuditLogRepository | null> {
    const tenantId = await TenantContext.getTenantId();
    return tenantId ? new AuditLogRepository(tenantId) : null;
  }
}
