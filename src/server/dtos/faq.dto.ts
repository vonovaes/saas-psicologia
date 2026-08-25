import { z } from 'zod';

export const createFaqSchema = z.object({
  question: z.string().min(5, 'Pergunta deve ter no mínimo 5 caracteres'),
  answer: z.string().min(10, 'Resposta deve ter no mínimo 10 caracteres'),
  position: z.number().int().positive().optional(),
});

export const updateFaqSchema = z.object({
  question: z.string().min(5).optional(),
  answer: z.string().min(10).optional(),
  position: z.number().int().positive().optional(),
});

export const reorderFaqsSchema = z.object({
  updates: z.array(
    z.object({
      id: z.string(),
      position: z.number().int().positive(),
    })
  ),
});

export type CreateFaqDto = z.infer<typeof createFaqSchema>;
export type UpdateFaqDto = z.infer<typeof updateFaqSchema>;
export type ReorderFaqsDto = z.infer<typeof reorderFaqsSchema>;
