import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/lib/auth';
import { UploadService } from '@/server/services/upload.service';
import { leadRateLimiter } from '@/server/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rate limiting check
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown';
    
    const rateLimit = leadRateLimiter.check(ip);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          error: 'Too many requests',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          }
        }
      );
    }

    const tenantId = session.user.tenantId;
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const uploadService = new UploadService(tenantId);

    // Validate file signature (magic bytes)
    const isValidSignature = await uploadService.validateFileSignature(file);
    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'File type does not match the actual file content' },
        { status: 400 }
      );
    }

    // Upload file
    const result = await uploadService.uploadFile(file, fileName || undefined);

    return NextResponse.json(
      { file: result },
      { 
        status: 201,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
        }
      }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
