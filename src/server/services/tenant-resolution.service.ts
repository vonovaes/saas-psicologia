import { TenantRepository } from '../repositories';
import { Tenant, Domain } from '../lib/prisma-client';
import { prisma } from '../lib/prisma';

interface TenantResolutionResult {
  tenant: Tenant;
  domain: Domain | null;
  isActive: boolean;
}

// Cache compartilhado entre instâncias: qualquer rota pode invalidar
// e a invalidação vale para o processo inteiro.
const resolutionCache = new Map<string, { result: TenantResolutionResult; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export class TenantResolutionService {
  private tenantRepository: TenantRepository;

  constructor() {
    this.tenantRepository = new TenantRepository('system');
  }

  async resolveByHost(host: string): Promise<TenantResolutionResult | null> {
    // Normalizar host (remover www, portas, etc.)
    const normalizedHost = this.normalizeHost(host);

    // Verificar cache
    const cached = resolutionCache.get(normalizedHost);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.result;
    }

    // Buscar domínio no banco diretamente (sem filtros de tenant),
    // ignorando domínios removidos (soft delete)
    const domain = await prisma.domain.findFirst({
      where: { domain: normalizedHost, deletedAt: null },
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
    resolutionCache.set(normalizedHost, {
      result,
      expiresAt: Date.now() + CACHE_TTL,
    });

    return result;
  }

  async resolveByTenantId(tenantId: string): Promise<Tenant | null> {
    // Verificar cache por tenantId
    const cacheKey = `tenant:${tenantId}`;
    const cached = resolutionCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.result.tenant;
    }

    // Buscar tenant no banco
    const tenant = await this.tenantRepository.findById(tenantId);
    if (!tenant) {
      return null;
    }

    // Salvar no cache
    resolutionCache.set(cacheKey, {
      result: { tenant, domain: null, isActive: tenant.status === 'ACTIVE' || tenant.status === 'TRIAL' },
      expiresAt: Date.now() + CACHE_TTL,
    });

    return tenant;
  }

  invalidateCache(host?: string): void {
    if (host) {
      const normalizedHost = this.normalizeHost(host);
      resolutionCache.delete(normalizedHost);
    } else {
      resolutionCache.clear();
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
      size: resolutionCache.size,
      keys: Array.from(resolutionCache.keys()),
    };
  }
}
