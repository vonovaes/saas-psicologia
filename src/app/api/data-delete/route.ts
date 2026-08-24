import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/server/lib/auth';
import { DataDeletionService } from '@/server/services/data-deletion.service';

const schema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('lead'), leadId: z.string().cuid(), confirmation: z.literal('DELETE_LEAD') }),
  z.object({ action: z.literal('account'), confirmation: z.literal('ENCERRAR_MINHA_CONTA') }),
]);

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.tenantId || !session.user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid confirmation or request' }, { status: 400 });
  try {
    const service = new DataDeletionService(session.user.tenantId);
    const result = parsed.data.action === 'lead' ? await service.anonymizeLead(parsed.data.leadId, session.user.id) : await service.closeTenantAccount(session.user.id);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: message === 'Lead not found' ? 404 : message.includes('Only the account owner') ? 403 : 500 });
  }
}
