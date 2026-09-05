import { z } from 'zod';

// ─── Design Tokens ──────────────────────────────────────────────

export const colorTokensSchema = z.object({
  primary: z.string(),
  accent: z.string(),
  surface: z.string(),
  background: z.string(),
  text: z.string(),
  textMuted: z.string(),
});

export const typographyTokensSchema = z.object({
  headingFont: z.enum(['sans', 'serif', 'display']),
  headingWeight: z.enum(['light', 'normal', 'bold']),
  scale: z.enum(['compact', 'normal', 'spacious']),
});

export const shapeTokensSchema = z.object({
  radius: z.enum(['none', 'sm', 'md', 'lg', 'full']),
  cardStyle: z.enum(['flat', 'bordered', 'glass', 'elevated']),
});

export const themeTokensSchema = z.object({
  colors: colorTokensSchema,
  typography: typographyTokensSchema,
  shape: shapeTokensSchema,
});

export type ColorTokens = z.infer<typeof colorTokensSchema>;
export type TypographyTokens = z.infer<typeof typographyTokensSchema>;
export type ShapeTokens = z.infer<typeof shapeTokensSchema>;
export type ThemeTokens = z.infer<typeof themeTokensSchema>;

// ─── Seções da página ───────────────────────────────────────────

export const SECTION_TYPES = [
  'hero',
  'about',
  'specialties',
  'testimonials',
  'faq',
  'map',
  'contact',
] as const;

export const sectionConfigSchema = z.object({
  type: z.enum(SECTION_TYPES),
  variant: z.string(),
  visible: z.boolean().default(true),
  order: z.number().int(),
  overrides: z.record(z.string(), z.any()).default({}),
});

export type SectionType = (typeof SECTION_TYPES)[number];
export type SectionConfig = z.infer<typeof sectionConfigSchema>;

// ─── Tema completo ──────────────────────────────────────────────

export const tenantThemeSchema = z.object({
  templateId: z.string().min(1),
  tokens: themeTokensSchema,
  sections: z.array(sectionConfigSchema),
});

export type TenantThemeData = z.infer<typeof tenantThemeSchema>;

// ─── Draft / Payloads de API ────────────────────────────────────

export const themeDraftSchema = z.object({
  templateId: z.string().min(1).optional(),
  tokens: themeTokensSchema.partial().optional(),
  sections: z.array(sectionConfigSchema).optional(),
  contentEdits: z.record(z.string(), z.any()).optional(),
});

export type ThemeDraft = z.infer<typeof themeDraftSchema>;

// ─── Defaults (template "Noite" = visual atual) ─────────────────

export const DEFAULT_TOKENS: ThemeTokens = {
  colors: {
    primary: '#f59e0b',
    accent: '#f59e0b',
    surface: '#1a1b1e',
    background: '#0a0b0c',
    text: '#ffffff',
    textMuted: '#9ca3af',
  },
  typography: {
    headingFont: 'sans',
    headingWeight: 'light',
    scale: 'normal',
  },
  shape: {
    radius: 'lg',
    cardStyle: 'glass',
  },
};

export const DEFAULT_SECTIONS: SectionConfig[] = [
  { type: 'hero', variant: 'split', visible: true, order: 0, overrides: {} },
  { type: 'about', variant: 'default', visible: true, order: 1, overrides: {} },
  { type: 'specialties', variant: 'cards', visible: true, order: 2, overrides: {} },
  { type: 'faq', variant: 'accordion', visible: true, order: 3, overrides: {} },
  { type: 'contact', variant: 'form', visible: true, order: 4, overrides: {} },
];

export const DEFAULT_THEME: TenantThemeData = {
  templateId: 'noite',
  tokens: DEFAULT_TOKENS,
  sections: DEFAULT_SECTIONS,
};

// ─── Mapeamento tokens → CSS variables ──────────────────────────

/**
 * Converte ThemeTokens em CSS custom properties para injetar
 * no escopo .tenant-site (ver globals.css).
 */
export function tokensToCssVars(tokens: ThemeTokens): Record<string, string> {
  const radiusMap: Record<ShapeTokens['radius'], string> = {
    none: '0',
    sm: '0.375rem',
    md: '0.75rem',
    lg: '1rem',
    full: '9999px',
  };

  return {
    '--site-primary': tokens.colors.primary,
    '--site-accent': tokens.colors.accent,
    '--site-surface': tokens.colors.surface,
    '--site-bg': tokens.colors.background,
    '--site-text': tokens.colors.text,
    '--site-text-muted': tokens.colors.textMuted,
    '--site-radius': radiusMap[tokens.shape.radius],
  };
}
