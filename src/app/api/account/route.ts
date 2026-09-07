import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { auth } from '@/server/lib/auth';
import { prisma } from '@/server/lib/prisma';
import { slugify } from '@/lib/slug';

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  slug: z
    .string()
    .max(60)
    .optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, 'Nova senha deve ter no mínimo 8 caracteres').optional(),
}).refine(
  (d) => !d.newPassword || !!d.currentPassword,
  { message: 'Senha atual é obrigatória para definir nova senha' }
);

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        tenant: { select: { name: true, slug: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, slug, currentPassword, newPassword } = parsed.data;
    const data: { name?: string; passwordHash?: string } = {};

    // Troca do slug da URL pública (/p/[slug])
    if (slug !== undefined) {
      const normalized = slugify(slug);
      if (normalized.length < 3) {
        return NextResponse.json(
          { error: 'Endereço inválido — use pelo menos 3 letras ou números' },
          { status: 400 }
        );
      }
      const conflict = await prisma.tenant.findFirst({
        where: { slug: normalized, id: { not: session.user.tenantId } },
      });
      if (conflict) {
        return NextResponse.json(
          { error: 'Este endereço já está em uso por outro profissional' },
          { status: 409 }
        );
      }
      await prisma.tenant.update({
        where: { id: session.user.tenantId },
        data: { slug: normalized },
      });
    }

    if (name !== undefined) {
      data.name = name;
    }

    if (newPassword) {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      const valid = await bcrypt.compare(currentPassword!, user.passwordHash);
      if (!valid) {
        return NextResponse.json(
          { error: 'Senha atual incorreta' },
          { status: 400 }
        );
      }
      data.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    if (Object.keys(data).length === 0 && slug === undefined) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const updated = Object.keys(data).length
      ? await prisma.user.update({
          where: { id: session.user.id },
          data,
          select: { id: true, email: true, name: true, role: true },
        })
      : await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { id: true, email: true, name: true, role: true },
        });

    await prisma.auditLog.create({
      data: {
        tenantId: session.user.tenantId,
        userId: session.user.id,
        action: 'ACCOUNT_UPDATED',
        resource: 'User',
        metadata: { updatedFields: Object.keys(data) },
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
