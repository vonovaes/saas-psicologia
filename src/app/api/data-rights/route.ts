import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/lib/auth';
import { AuditLogRepository } from '@/server/repositories';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const tenantId = session.user.tenantId;
    const body = await request.json();
    const { requestType, message } = body;

    // Log the request for now - in production, this would send an email or store in database
    console.log('Data Rights Request:', {
      tenantId,
      userId: session.user.id,
      email: session.user.email,
      requestType,
      message,
      timestamp: new Date().toISOString(),
    });

    // Create audit log
    const auditLogRepository = new AuditLogRepository(tenantId);
    await auditLogRepository.create({
      action: 'DATA_RIGHTS_REQUEST',
      resource: 'User',
      metadata: {
        userId: session.user.id,
        requestType,
        message,
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Solicitação recebida com sucesso. Responderemos em até 15 dias úteis.'
    });
  } catch (error) {
    console.error('Error processing data rights request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
