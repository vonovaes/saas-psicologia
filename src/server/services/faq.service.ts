import { FaqRepository, AuditLogRepository } from '../repositories';
import { Faq } from '../lib/prisma-client';

export class FaqService {
  private faqRepository: FaqRepository;
  private auditLogRepository: AuditLogRepository;

  constructor(tenantId: string) {
    this.faqRepository = new FaqRepository(tenantId);
    this.auditLogRepository = new AuditLogRepository(tenantId);
  }

  async getFaqById(id: string): Promise<Faq | null> {
    return this.faqRepository.findById(id);
  }

  async createFaq(data: {
    question: string;
    answer: string;
    position?: number;
  }): Promise<Faq> {
    const position = data.position ?? (await this.faqRepository.getNextPosition());
    const faq = await this.faqRepository.create({
      ...data,
      position,
    });

    await this.auditLogRepository.create({
      action: 'FAQ_CREATED',
      resource: 'Faq',
      metadata: { faqId: faq.id, question: faq.question },
    });

    return faq;
  }

  async updateFaq(id: string, data: Partial<Faq>): Promise<Faq> {
    const faq = await this.faqRepository.update(id, data);

    await this.auditLogRepository.create({
      action: 'FAQ_UPDATED',
      resource: 'Faq',
      metadata: { faqId: id, changes: data },
    });

    return faq;
  }

  async softDeleteFaq(id: string): Promise<Faq> {
    const faq = await this.faqRepository.softDelete(id);

    await this.auditLogRepository.create({
      action: 'FAQ_DELETED',
      resource: 'Faq',
      metadata: { faqId: id, question: faq.question },
    });

    return faq;
  }

  async listFaqs(): Promise<Faq[]> {
    return this.faqRepository.listAll();
  }

  async reorderFaqs(updates: { id: string; position: number }[]): Promise<void> {
    await this.faqRepository.updatePositions(updates);

    await this.auditLogRepository.create({
      action: 'FAQS_REORDERED',
      resource: 'Faq',
      metadata: { count: updates.length },
    });
  }

  async updateFaqPosition(id: string, newPosition: number): Promise<Faq> {
    const faq = await this.faqRepository.update(id, { position: newPosition });

    await this.auditLogRepository.create({
      action: 'FAQ_POSITION_UPDATED',
      resource: 'Faq',
      metadata: { faqId: id, newPosition },
    });

    return faq;
  }
}
