import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/lib/auth';
import { TenantThemeService } from '@/server/services/tenant-theme.service';
import { themeDraftSchema, tenantThemeSchema } from '@/landing/themes/tokens';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const themeService = new TenantThemeService(session.user.tenantId);
    const [theme, draft] = await Promise.all([
      themeService.getTheme(),
      themeService.getDraft(),
    ]);

    return NextResponse.json({ theme, draft });
  } catch (error) {
    console.error('Error fetching theme:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/theme
 * - action: "draft"    → salva rascunho (não publica)
 * - action: "update"   → atualiza tema publicado diretamente
 * - action: "publish"  → publica draft (ou dados enviados) e limpa rascunho
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const themeService = new TenantThemeService(session.user.tenantId);
    const body = await request.json();
    const action = body.action ?? 'draft';

    if (action === 'draft') {
      const parsed = themeDraftSchema.safeParse(body.draft);
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Invalid draft payload', details: parsed.error.flatten() },
          { status: 400 }
        );
      }
      const theme = await themeService.saveDraft(parsed.data);
      return NextResponse.json({ success: true, theme });
    }

    if (action === 'update') {
      const parsed = tenantThemeSchema.partial().safeParse(body.theme);
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Invalid theme payload', details: parsed.error.flatten() },
          { status: 400 }
        );
      }
      const theme = await themeService.updateTheme(parsed.data);
      return NextResponse.json({ success: true, theme });
    }

    if (action === 'publish') {
      let themeData;
      if (body.theme) {
        const parsed = tenantThemeSchema.partial().safeParse(body.theme);
        if (!parsed.success) {
          return NextResponse.json(
            { error: 'Invalid theme payload', details: parsed.error.flatten() },
            { status: 400 }
          );
        }
        themeData = parsed.data;
      }
      const theme = await themeService.publish(themeData);
      return NextResponse.json({ success: true, theme });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
