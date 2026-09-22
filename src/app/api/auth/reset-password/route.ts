import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '@/server/lib/prisma';
import { RateLimiter } from '@/server/lib/rate-limit';
import { validatePublicRequest, addCSRFHeaders } from '@/server/lib/csrf-public';

const resetRateLimiter = new RateLimiter(10 * 60 * 1000, 10); // 10 por IP a cada 10min

const resetSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(100)
    .regex(/[A-Z]/, 'Senha precisa de uma letra maiúscula')
    .regex(/[a-z]/, 'Senha precisa de uma letra minúscula')
    .regex(/[0-9]/, 'Senha precisa de um número'),
});

/**
 * POST /api/auth/reset-password — Redefine a senha usando o token enviado por email.
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
    const rateLimit = resetRateLimiter.check(ip);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Aguarde alguns minutos.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = resetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (
      !resetToken ||
      resetToken.usedAt !== null ||
      resetToken.expiresAt < new Date()
    ) {
      return NextResponse.json(
        { error: 'Link inválido ou expirado. Solicite uma nova recuperação.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { email: resetToken.email, deletedAt: null },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Link inválido ou expirado. Solicite uma nova recuperação.' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
      prisma.auditLog.create({
        data: {
          tenantId: user.tenantId,
          userId: user.id,
          action: 'PASSWORD_RESET',
          resource: 'User',
          metadata: { email: user.email },
        },
      }),
    ]);

    const response = NextResponse.json({
      message: 'Senha redefinida com sucesso. Faça login com a nova senha.',
    });
    return addCSRFHeaders(response);
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Erro ao redefinir senha. Tente novamente.' },
      { status: 500 }
    );
  }
}
