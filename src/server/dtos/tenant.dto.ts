import { z } from 'zod';

export const createTenantSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  crp: z.string().min(1, 'CRP é obrigatório'),
  contactEmail: z.string().email('E-mail inválido'),
  plan: z.string().optional(),
});

export const updateTenantSchema = z.object({
  name: z.string().min(2).optional(),
  crp: z.string().min(1).optional(),
  contactEmail: z.string().email().optional(),
  status: z.enum(['TRIAL', 'ACTIVE', 'SUSPENDED']).optional(),
  plan: z.string().optional(),
});

export type CreateTenantDto = z.infer<typeof createTenantSchema>;
export type UpdateTenantDto = z.infer<typeof updateTenantSchema>;
