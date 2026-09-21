import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '@/server/lib/prisma';
import { sendEmail } from '@/server/lib/email';
import { RateLimiter } from '@/server/lib/rate-limit';
import { validatePublicRequest, addCSRFHeaders } from '@/server/lib/csrf-public';

const forgotRateLimiter = new RateLimiter(10 * 60 * 1000, 5); // 5 por IP a cada 10min

const forgotSchema = z.object({
  email: z.string().email('Email inválido').max(255).transform((v) => v.toLowerCase().trim()),
});

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hora

/**
 * POST /api/auth/forgot-password — Solicita recuperação de senha.
 * Resposta sempre genérica para não revelar se o email existe.
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
    const rateLimit = forgotRateLimiter.check(ip);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Aguarde alguns minutos.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = forgotSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const { email } = parsed.data;

    const user = await prisma.user.findFirst({
      where: { email, deletedAt: null },
    });

    if (user) {
      // Invalida tokens anteriores do mesmo email
      await prisma.passwordResetToken.updateMany({
        where: { email, usedAt: null },
        data: { usedAt: new Date() },
      });

      const token = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

      await prisma.passwordResetToken.create({
        data: {
          email,
          tokenHash,
          expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
        },
      });

      const baseUrl = process.env.APP_URL || request.nextUrl.origin;
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;

      try {
        await sendEmail({
          to: email,
          subject: 'Recuperação de senha — Acolha',
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h2>Recuperação de senha</h2>
              <p>Recebemos uma solicitação para redefinir a senha da sua conta no Acolha.</p>
              <p>
                <a href="${resetUrl}"
                   style="display: inline-block; padding: 12px 24px; background: #2e6b57; color: #fff; text-decoration: none; border-radius: 8px;">
                  Redefinir senha
                </a>
              </p>
              <p style="color: #666; font-size: 14px;">
                Este link expira em 1 hora. Se você não solicitou, ignore este email.
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Error sending reset email:', emailError);
        // Não expõe falha de envio — resposta genérica
      }
    }

    const response = NextResponse.json({
      message: 'Se o email estiver cadastrado, você receberá um link de recuperação.',
    });
    return addCSRFHeaders(response);
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar solicitação. Tente novamente.' },
      { status: 500 }
    );
  }
}
