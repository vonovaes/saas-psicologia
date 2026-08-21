import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('E-mail inválido'),
  passwordHash: z.string().min(1, 'Hash da senha é obrigatório'),
  role: z.enum(['OWNER', 'ADMIN']).optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  passwordHash: z.string().min(1).optional(),
  role: z.enum(['OWNER', 'ADMIN']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
