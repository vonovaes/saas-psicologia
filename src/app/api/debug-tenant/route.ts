import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  const headersList = await headers();
  
  return NextResponse.json({
    headers: {
      'x-tenant-id': headersList.get('x-tenant-id'),
      'x-tenant-status': headersList.get('x-tenant-status'),
      'x-domain-id': headersList.get('x-domain-id'),
      'x-host': headersList.get('x-host'),
      'x-protected-route': headersList.get('x-protected-route'),
    },
    host: request.nextUrl.host,
    pathname: request.nextUrl.pathname,
  });
}
