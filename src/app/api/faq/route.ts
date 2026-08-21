import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/lib/auth';
import { FaqService } from '@/server/services/faq.service';
import { createFaqSchema, updateFaqSchema, reorderFaqsSchema } from '@/server/dtos/faq.dto';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const tenantId = session.user.tenantId;
    const faqService = new FaqService(tenantId);

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

    // Validar dados de criação
    const validatedData = createFaqSchema.parse(body);

    const faqService = new FaqService(tenantId);
    const faq = await faqService.createFaq(validatedData);

    return NextResponse.json({ faq }, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    if (body.reorder) {
      // Handle reordering
      const validatedData = reorderFaqsSchema.parse(body);
      const faqService = new FaqService(tenantId);
      await faqService.reorderFaqs(validatedData.updates);
      
      return NextResponse.json({ success: true });
    }

    // Handle update
    const { id, ...updateData } = body;
    const validatedData = updateFaqSchema.parse(updateData);

    const faqService = new FaqService(tenantId);
    const faq = await faqService.updateFaq(id, validatedData);

    return NextResponse.json({ faq });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const tenantId = session.user.tenantId;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'FAQ ID is required' },
        { status: 400 }
      );
    }

    const faqService = new FaqService(tenantId);
    await faqService.deleteFaq(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
