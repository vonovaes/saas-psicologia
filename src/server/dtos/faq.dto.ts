import { z } from 'zod';

export const replaceFaqsSchema = z.object({
  faqs: z
    .array(
      z.object({
        question: z.string().trim().min(1, 'Pergunta é obrigatória'),
        answer: z.string().trim().min(1, 'Resposta é obrigatória'),
      })
    )
    .max(50),
});

export type ReplaceFaqsDto = z.infer<typeof replaceFaqsSchema>;
