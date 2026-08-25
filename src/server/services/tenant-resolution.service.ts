import { TenantRepository } from '../repositories';
import { Tenant, Domain } from '../lib/prisma-client';
import { prisma } from '../lib/prisma';

interface TenantResolutionResult {
  tenant: Tenant;
  domain: Domain | null;
  isActive: boolean;
}

export class TenantResolutionService {
  private tenantRepository: TenantRepository;
  private cache: Map<string, { result: TenantResolutionResult; expiresAt: number }>;
  private cacheTTL: number;

  constructor() {
    this.tenantRepository = new TenantRepository('system');
    this.cache = new Map();
    this.cacheTTL = 5 * 60 * 1000; // 5 minutos
  }

  async resolveByHost(host: string): Promise<TenantResolutionResult | null> {
    // Normalizar host (remover www, portas, etc.)
    const normalizedHost = this.normalizeHost(host);

    // Verificar cache
    const cached = this.cache.get(normalizedHost);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.result;
    }

    // Buscar domínio no banco diretamente (sem filtros de tenant)
    const domain = await prisma.domain.findUnique({
      where: { domain: normalizedHost },
      include: { tenant: true },
    });

    if (!domain) {
      return null;
    }

    // Verificar se tenant está ativo
    const isActive = domain.tenant.status === 'ACTIVE' || domain.tenant.status === 'TRIAL';

    const result: TenantResolutionResult = {
      tenant: domain.tenant as Tenant,
      domain: domain as Domain,
      isActive,
    };

    // Salvar no cache
    this.cache.set(normalizedHost, {
      result,
      expiresAt: Date.now() + this.cacheTTL,
    });

    return result;
  }

  async resolveByTenantId(tenantId: string): Promise<Tenant | null> {
    // Verificar cache por tenantId
    const cacheKey = `tenant:${tenantId}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.result.tenant;
    }

    // Buscar tenant no banco
    const tenant = await this.tenantRepository.findById(tenantId);
    if (!tenant) {
      return null;
    }

    // Salvar no cache
    this.cache.set(cacheKey, {
      result: { tenant, domain: null, isActive: tenant.status === 'ACTIVE' || tenant.status === 'TRIAL' },
      expiresAt: Date.now() + this.cacheTTL,
    });

    return tenant;
  }

  invalidateCache(host?: string): void {
    if (host) {
      const normalizedHost = this.normalizeHost(host);
      this.cache.delete(normalizedHost);
    } else {
      this.cache.clear();
    }
  }

  private normalizeHost(host: string): string {
    // Remover porta se existir
    let normalized = host.split(':')[0];
    
    // Remover www. se existir
    normalized = normalized.replace(/^www\./, '');
    
    // Converter para minúsculas
    normalized = normalized.toLowerCase();
    
    return normalized;
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}
