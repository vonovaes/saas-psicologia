import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/lib/auth';
import { FaqService } from '@/server/services/faq.service';
import { replaceFaqsSchema } from '@/server/dtos/faq.dto';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const faqService = new FaqService(session.user.tenantId);
    const faqs = await faqService.getAllFaqs();

    return NextResponse.json({ faqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/faq
 * Substitui a lista inteira de FAQs do tenant.
 * Chamado pelo editor ao publicar quando contentEdits['faqs'] existe.
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = replaceFaqsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const faqService = new FaqService(session.user.tenantId);
    const faqs = await faqService.replaceFaqs(parsed.data.faqs);

    return NextResponse.json({ faqs });
  } catch (error) {
    console.error('Error replacing FAQs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
