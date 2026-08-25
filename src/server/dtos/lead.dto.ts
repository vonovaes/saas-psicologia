import { z } from 'zod';

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  phone: z.string().min(10, 'Telefone deve ter no mínimo 10 caracteres'),
  message: z.string().optional(),
  source: z.enum(['FORMULARIO']).optional(),
  consentedAt: z.string().datetime().optional().default(() => new Date().toISOString()),
});

export type CreateLeadDto = z.infer<typeof createLeadSchema>;
