import { z } from 'zod';

export const createTenantSettingsSchema = z.object({
  whatsappNumber: z.string().optional(),
  instagramHandle: z.string().optional(),
  googleMapsEmbedUrl: z.string().url().optional().or(z.literal('')),
  googleTagManagerId: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  googleAdsId: z.string().optional(),
  metaPixelId: z.string().optional(),
});

export const updateTenantSettingsSchema = z.object({
  whatsappNumber: z.string().optional(),
  instagramHandle: z.string().optional(),
  googleMapsEmbedUrl: z.string().url().optional().or(z.literal('')),
  googleTagManagerId: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  googleAdsId: z.string().optional(),
  metaPixelId: z.string().optional(),
});

export const updateAnalyticsIdsSchema = z.object({
  googleTagManagerId: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  googleAdsId: z.string().optional(),
  metaPixelId: z.string().optional(),
});

export const updateContactInfoSchema = z.object({
  whatsappNumber: z.string().optional(),
  instagramHandle: z.string().optional(),
});

export const updateLocationInfoSchema = z.object({
  googleMapsEmbedUrl: z.string().url().optional().or(z.literal('')),
});

export type CreateTenantSettingsDto = z.infer<typeof createTenantSettingsSchema>;
export type UpdateTenantSettingsDto = z.infer<typeof updateTenantSettingsSchema>;
export type UpdateAnalyticsIdsDto = z.infer<typeof updateAnalyticsIdsSchema>;
export type UpdateContactInfoDto = z.infer<typeof updateContactInfoSchema>;
export type UpdateLocationInfoDto = z.infer<typeof updateLocationInfoSchema>;
