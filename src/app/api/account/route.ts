import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { auth } from '@/server/lib/auth';
import { prisma } from '@/server/lib/prisma';

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
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

    const { name, currentPassword, newPassword } = parsed.data;
    const data: { name?: string; passwordHash?: string } = {};

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

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data,
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
