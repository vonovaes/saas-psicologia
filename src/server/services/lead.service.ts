import { LeadRepository, AuditLogRepository } from '../repositories';
import { Lead, LeadSource } from '../lib/prisma-client';

export class LeadService {
  private leadRepository: LeadRepository;
  private auditLogRepository: AuditLogRepository;

  constructor(tenantId: string) {
    this.leadRepository = new LeadRepository(tenantId);
    this.auditLogRepository = new AuditLogRepository(tenantId);
  }

  async getLeadById(id: string): Promise<Lead | null> {
    return this.leadRepository.findById(id);
  }

  async createLead(data: {
    name: string;
    phone: string;
    message?: string;
    source?: LeadSource;
    consentedAt: Date;
  }): Promise<Lead> {
    const lead = await this.leadRepository.create(data);

    await this.auditLogRepository.create({
      action: 'LEAD_CREATED',
      resource: 'Lead',
      metadata: {
        leadId: lead.id,
        name: lead.name,
        phone: lead.phone,
        source: lead.source,
      },
    });

    return lead;
  }

  async softDeleteLead(id: string): Promise<Lead> {
    const lead = await this.leadRepository.softDelete(id);

    await this.auditLogRepository.create({
      action: 'LEAD_DELETED',
      resource: 'Lead',
      metadata: { leadId: id, name: lead.name },
    });

    return lead;
  }

  async listLeads(options?: {
    limit?: number;
    offset?: number;
    source?: LeadSource;
  }): Promise<Lead[]> {
    return this.leadRepository.listAll(options);
  }

  async countLeads(options?: { source?: LeadSource }): Promise<number> {
    return this.leadRepository.count(options);
  }

  async getRecentLeads(limit: number = 10): Promise<Lead[]> {
    return this.leadRepository.listAll({ limit });
  }

  async getLeadsByDateRange(startDate?: Date, endDate?: Date): Promise<Lead[]> {
    return this.leadRepository.findByDateRange(startDate, endDate);
  }
}
