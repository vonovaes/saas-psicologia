import { DomainRepository, AuditLogRepository } from '../repositories';
import { Domain, DomainDnsStatus, DomainSslStatus } from '../lib/prisma-client';

export class DomainService {
  private domainRepository: DomainRepository;
  private auditLogRepository: AuditLogRepository;

  constructor(tenantId: string) {
    this.domainRepository = new DomainRepository(tenantId);
    this.auditLogRepository = new AuditLogRepository(tenantId);
  }

  async getDomainById(id: string): Promise<Domain | null> {
    return this.domainRepository.findById(id);
  }

  async getDomainByDomain(domain: string): Promise<Domain | null> {
    return this.domainRepository.findByDomain(domain);
  }

  async getPrimaryDomain(): Promise<Domain | null> {
    return this.domainRepository.findPrimary();
  }

  async createDomain(data: {
    domain: string;
    isPrimary?: boolean;
  }): Promise<Domain> {
    const domain = await this.domainRepository.create(data);

    await this.auditLogRepository.create({
      action: 'DOMAIN_CREATED',
      resource: 'Domain',
      metadata: { domain: domain.domain, isPrimary: domain.isPrimary },
    });

    return domain;
  }

  async updateDomain(id: string, data: Partial<Domain>): Promise<Domain> {
    const domain = await this.domainRepository.update(id, data);

    await this.auditLogRepository.create({
      action: 'DOMAIN_UPDATED',
      resource: 'Domain',
      metadata: { domainId: id, changes: data },
    });

    return domain;
  }

  async updateDnsStatus(id: string, status: DomainDnsStatus): Promise<Domain> {
    const domain = await this.domainRepository.updateDnsStatus(id, status);

    await this.auditLogRepository.create({
      action: 'DOMAIN_DNS_STATUS_UPDATED',
      resource: 'Domain',
      metadata: { domainId: id, status },
    });

    return domain;
  }

  async updateSslStatus(id: string, status: DomainSslStatus): Promise<Domain> {
    const domain = await this.domainRepository.updateSslStatus(id, status);

    await this.auditLogRepository.create({
      action: 'DOMAIN_SSL_STATUS_UPDATED',
      resource: 'Domain',
      metadata: { domainId: id, status },
    });

    return domain;
  }

  async setPrimaryDomain(id: string): Promise<Domain> {
    const domain = await this.domainRepository.setPrimary(id);

    await this.auditLogRepository.create({
      action: 'DOMAIN_SET_PRIMARY',
      resource: 'Domain',
      metadata: { domainId: id },
    });

    return domain;
  }

  async softDeleteDomain(id: string): Promise<Domain> {
    const domain = await this.domainRepository.softDelete(id);

    await this.auditLogRepository.create({
      action: 'DOMAIN_DELETED',
      resource: 'Domain',
      metadata: { domain: domain.domain },
    });

    return domain;
  }

  async listDomains(): Promise<Domain[]> {
    return this.domainRepository.listAll();
  }

  async isDomainActive(domain: string): Promise<boolean> {
    const domainRecord = await this.getDomainByDomain(domain);
    return (
      domainRecord?.dnsStatus === DomainDnsStatus.VERIFIED &&
      domainRecord?.sslStatus === DomainSslStatus.ACTIVE
    );
  }
}
