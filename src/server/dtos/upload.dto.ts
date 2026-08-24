import { z } from 'zod';

// Allowed file types for upload
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const uploadFileSchema = z.object({
  fileName: z.string().min(1, 'Nome do arquivo é obrigatório'),
  fileType: z.enum(ALLOWED_MIME_TYPES, {
    errorMap: () => ({ message: 'Tipo de arquivo não permitido. Apenas imagens (JPEG, PNG, WebP, GIF)' }),
  }),
  fileSize: z.number()
    .max(MAX_FILE_SIZE, `Tamanho do arquivo excede o limite de ${MAX_FILE_SIZE / 1024 / 1024}MB`)
    .min(1, 'Arquivo vazio não é permitido'),
});

export type UploadFileDto = z.infer<typeof uploadFileSchema>;

// Upload response schema
export const uploadResponseSchema = z.object({
  url: z.string().url(),
  name: z.string(),
  size: z.number(),
  uploadedAt: z.string().datetime(),
});

export type UploadResponseDto = z.infer<typeof uploadResponseSchema>;
