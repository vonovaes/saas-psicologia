import { z } from 'zod';

export const createTenantProfileSchema = z.object({
  displayName: z.string().min(2, 'Nome exibido deve ter no mínimo 2 caracteres'),
  specialties: z.array(z.string()).min(1, 'Pelo menos uma especialidade é obrigatória'),
  city: z.string().min(2, 'Cidade deve ter no mínimo 2 caracteres'),
  description: z.string().min(20, 'Descrição deve ter no mínimo 20 caracteres'),
  address: z.string().optional(),
  profileImageUrl: z.string().url().optional().or(z.literal('')),
  attendanceType: z.string().optional(),
});

export const updateTenantProfileSchema = z.object({
  displayName: z.string().min(2).optional(),
  specialties: z.array(z.string()).min(1).optional(),
  city: z.string().min(2).optional(),
  description: z.string().min(20).optional(),
  address: z.string().optional(),
  profileImageUrl: z.string().url().optional().or(z.literal('')),
  attendanceType: z.string().optional(),
});

export type CreateTenantProfileDto = z.infer<typeof createTenantProfileSchema>;
export type UpdateTenantProfileDto = z.infer<typeof updateTenantProfileSchema>;
