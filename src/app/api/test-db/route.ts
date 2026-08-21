import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../server/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Buscar todos os domínios
    const domains = await prisma.domain.findMany();
    
    // Buscar todos os tenants
    const tenants = await prisma.tenant.findMany();
    
    // Buscar todos os usuários
    const users = await prisma.user.findMany();

    return NextResponse.json({
      domains: domains.map(d => ({
        id: d.id,
        domain: d.domain,
        tenantId: d.tenantId,
        dnsStatus: d.dnsStatus,
        sslStatus: d.sslStatus,
      })),
      tenants: tenants.map(t => ({
        id: t.id,
        name: t.name,
        status: t.status,
      })),
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        tenantId: u.tenantId,
        role: u.role,
      })),
    });
  } catch (error) {
    console.error('Test DB error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
