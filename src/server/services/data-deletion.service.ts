import { prisma } from '../lib/prisma';
import { UserRole } from '../lib/prisma-client';

export class DataDeletionService {
  constructor(private readonly tenantId: string) {}

  async anonymizeLead(leadId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const lead = await tx.lead.findFirst({ where: { id: leadId, tenantId: this.tenantId, deletedAt: null } });
      if (!lead) throw new Error('Lead not found');
      await tx.lead.update({ where: { id: lead.id }, data: { name: 'Dados removidos', phone: '00000000000', message: null, deletedAt: new Date() } });
      await tx.auditLog.create({ data: { tenantId: this.tenantId, userId, action: 'LEAD_DATA_ANONYMIZED', resource: 'Lead', metadata: { leadId } } });
      return { leadId };
    });
  }

  async closeTenantAccount(userId: string) {
    return prisma.$transaction(async (tx) => {
      const owner = await tx.user.findFirst({ where: { id: userId, tenantId: this.tenantId, deletedAt: null } });
      if (!owner || owner.role !== UserRole.OWNER) throw new Error('Only the account owner can close the tenant account');
      const now = new Date();
      const [leads, users, domains, faqs] = await Promise.all([
        tx.lead.updateMany({ where: { tenantId: this.tenantId, deletedAt: null }, data: { name: 'Dados removidos', phone: '00000000000', message: null, deletedAt: now } }),
        tx.user.updateMany({ where: { tenantId: this.tenantId, deletedAt: null }, data: { deletedAt: now, passwordHash: 'ACCOUNT_CLOSED' } }),
        tx.domain.updateMany({ where: { tenantId: this.tenantId, deletedAt: null }, data: { deletedAt: now, isPrimary: false } }),
        tx.faq.updateMany({ where: { tenantId: this.tenantId, deletedAt: null }, data: { deletedAt: now } }),
      ]);
      await tx.user.update({ where: { id: owner.id }, data: { email: `closed-${owner.id}@invalid.local` } });
      await tx.tenantProfile.updateMany({ where: { tenantId: this.tenantId, deletedAt: null }, data: { displayName: 'Perfil removido', specialties: [], approaches: [], city: 'Removido', description: 'Conteúdo removido', address: null, profileImageUrl: null, attendanceType: null, deletedAt: now } });
      await tx.tenantSettings.updateMany({ where: { tenantId: this.tenantId }, data: { whatsappNumber: null, instagramHandle: null, googleMapsEmbedUrl: null, googleTagManagerId: null, googleAnalyticsId: null, googleAdsId: null, metaPixelId: null } });
      await tx.tenant.update({ where: { id: this.tenantId }, data: { status: 'SUSPENDED', deletedAt: now, name: 'Conta encerrada', crp: 'REMOVIDO', contactEmail: `closed-${this.tenantId}@invalid.local` } });
      await tx.auditLog.create({ data: { tenantId: this.tenantId, userId: owner.id, action: 'TENANT_ACCOUNT_CLOSED', resource: 'Tenant', metadata: { leads: leads.count, users: users.count, domains: domains.count, faqs: faqs.count } } });
      return { leads: leads.count, users: users.count, domains: domains.count, faqs: faqs.count };
    });
  }
}
