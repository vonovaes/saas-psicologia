import { z } from 'zod';

export const createDomainSchema = z.object({
  domain: z.string().min(1, 'Domínio é obrigatório'),
  isPrimary: z.boolean().optional(),
});

export const updateDomainSchema = z.object({
  domain: z.string().min(1).optional(),
  dnsStatus: z.enum(['PENDING', 'VERIFIED', 'ERROR']).optional(),
  sslStatus: z.enum(['PENDING', 'ACTIVE', 'ERROR']).optional(),
  isPrimary: z.boolean().optional(),
});

export type CreateDomainDto = z.infer<typeof createDomainSchema>;
export type UpdateDomainDto = z.infer<typeof updateDomainSchema>;
