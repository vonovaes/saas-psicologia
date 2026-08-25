import { TenantRepository } from '../repositories';
import { Tenant, TenantStatus } from '../lib/prisma-client';

export class TenantService {
  private tenantRepository: TenantRepository;

  constructor(tenantId: string) {
    this.tenantRepository = new TenantRepository(tenantId);
  }

  async getTenant(): Promise<Tenant | null> {
    return this.tenantRepository.findById(this.tenantRepository['tenantId']);
  }

  async getTenantByDomain(domain: string): Promise<Tenant | null> {
    return this.tenantRepository.findByDomain(domain);
  }

  async isActive(): Promise<boolean> {
    const tenant = await this.getTenant();
    return tenant?.status === TenantStatus.ACTIVE || tenant?.status === TenantStatus.TRIAL;
  }

  async isSuspended(): Promise<boolean> {
    const tenant = await this.getTenant();
    return tenant?.status === TenantStatus.SUSPENDED;
  }

  async updateStatus(status: TenantStatus): Promise<Tenant> {
    return this.tenantRepository.update(this.tenantRepository['tenantId'], { status });
  }

  async softDelete(): Promise<Tenant> {
    return this.tenantRepository.softDelete(this.tenantRepository['tenantId']);
  }
}
