import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/server/lib/prisma';
import { RateLimiter } from '@/server/lib/rate-limit';
import { validatePublicRequest, addCSRFHeaders } from '@/server/lib/csrf-public';
import { DEFAULT_THEME } from '@/landing/themes/tokens';
import { generateUniqueSlug } from '@/lib/slug';

const signupRateLimiter = new RateLimiter(10 * 60 * 1000, 5); // 5 cadastros por IP a cada 10min

const signupSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  crp: z.string().min(3, 'CRP inválido').max(20),
  email: z.string().email('Email inválido').max(255).transform((v) => v.toLowerCase().trim()),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(100)
    .regex(/[A-Z]/, 'Senha precisa de uma letra maiúscula')
    .regex(/[a-z]/, 'Senha precisa de uma letra minúscula')
    .regex(/[0-9]/, 'Senha precisa de um número'),
  lgpdConsent: z.boolean().refine((v) => v === true, {
    message: 'É necessário aceitar os termos',
  }),
});

/**
 * POST /api/signup — Cadastro público de nova conta.
 * Cria Tenant (TRIAL) + User OWNER + Settings/Profile/Theme padrão
 * em uma única transação.
 */
export async function POST(request: NextRequest) {
  try {
    if (!validatePublicRequest(request)) {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
    }

    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const rateLimit = signupRateLimiter.check(ip);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Aguarde alguns minutos.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, crp, email, password } = parsed.data;

    // Email é único globalmente (login busca por email sem tenant)
    const existing = await prisma.user.findFirst({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Este email já possui uma conta. Faça login.' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Slug único para a URL pública /p/[slug]
    const slug = await generateUniqueSlug(name, async (s) => {
      const found = await prisma.tenant.findUnique({ where: { slug: s } });
      return !!found;
    });

    const tenant = await prisma.$transaction(async (tx) => {
      const created = await tx.tenant.create({
        data: {
          name,
          slug,
          crp,
          contactEmail: email,
          status: 'TRIAL',
        },
      });

      await tx.user.create({
        data: {
          tenantId: created.id,
          email,
          name,
          passwordHash,
          role: 'OWNER',
        },
      });

      await tx.tenantSettings.create({
        data: { tenantId: created.id },
      });

      await tx.tenantProfile.create({
        data: {
          tenantId: created.id,
          displayName: name,
          specialties: [],
          city: '',
          description: '',
        },
      });

      await tx.tenantTheme.create({
        data: {
          tenantId: created.id,
          templateId: DEFAULT_THEME.templateId,
          tokens: DEFAULT_THEME.tokens,
          sections: DEFAULT_THEME.sections,
          publishedAt: null,
        },
      });

      await tx.auditLog.create({
        data: {
          tenantId: created.id,
          action: 'TENANT_SIGNUP',
          resource: 'Tenant',
          metadata: { email, name },
        },
      });

      return created;
    });

    const response = NextResponse.json(
      { success: true, tenantId: tenant.id, slug },
      { status: 201 }
    );
    return addCSRFHeaders(response);
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar conta. Tente novamente.' },
      { status: 500 }
    );
  }
}
