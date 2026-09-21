import { FaqRepository, AuditLogRepository } from '../repositories';
import { Faq } from '../lib/prisma-client';

export class FaqService {
  private faqRepository: FaqRepository;
  private auditLogRepository: AuditLogRepository;

  constructor(tenantId: string) {
    this.faqRepository = new FaqRepository(tenantId);
    this.auditLogRepository = new AuditLogRepository(tenantId);
  }

  async getAllFaqs(): Promise<Faq[]> {
    return this.faqRepository.listAll();
  }

  /**
   * Substitui a lista inteira de FAQs do tenant (publish do editor).
   */
  async replaceFaqs(items: { question: string; answer: string }[]): Promise<Faq[]> {
    const faqs = await this.faqRepository.replaceAll(items);

    await this.auditLogRepository.create({
      action: 'FAQS_REPLACED',
      resource: 'Faq',
      metadata: { count: items.length },
    });

    return faqs;
  }
}
