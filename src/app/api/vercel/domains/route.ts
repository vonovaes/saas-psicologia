import { NextResponse } from 'next/server';
import { vercelService } from '@/server/services/vercel.service';

/**
 * POST /api/vercel/domains
 * Body: { domain: string, projectId?: string }
 * GET  /api/vercel/domains?domain=example.com&projectId=...
 * Env: VERCEL_PROJECT_ID (optional), VERCEL_TOKEN (required)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const domain = (body?.domain || '').toString().trim();
    if (!domain) return NextResponse.json({ error: 'domain is required' }, { status: 400 });

    const projectId = body?.projectId || process.env.VERCEL_PROJECT_ID;
    if (!projectId) return NextResponse.json({ error: 'projectId missing (provide in body or VERCEL_PROJECT_ID env)' }, { status: 400 });

    const result = await vercelService.addDomain(projectId, domain);

    // return raw result from Vercel so frontend can show dnsRecords
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    console.error('Error in /api/vercel/domains (POST)', err);
    return NextResponse.json({ error: err?.message || 'unknown' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const domain = (url.searchParams.get('domain') || '').toString().trim();
    if (!domain) return NextResponse.json({ error: 'domain query param is required' }, { status: 400 });

    const projectId = url.searchParams.get('projectId') || process.env.VERCEL_PROJECT_ID;
    if (!projectId) return NextResponse.json({ error: 'projectId missing (provide projectId query or VERCEL_PROJECT_ID env)' }, { status: 400 });

    const result = await vercelService.getDomain(projectId, domain);
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    console.error('Error in /api/vercel/domains (GET)', err);
    return NextResponse.json({ error: err?.message || 'unknown' }, { status: 500 });
  }
}
