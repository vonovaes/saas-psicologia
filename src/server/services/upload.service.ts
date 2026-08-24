import { put } from '@vercel/blob';
import { uploadFileSchema, UploadResponseDto } from '../dtos/upload.dto';
import { AuditLogRepository } from '../repositories';

export class UploadService {
  private auditLogRepository: AuditLogRepository;
  private tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
    this.auditLogRepository = new AuditLogRepository(tenantId);
  }

  async uploadFile(file: File, fileName?: string): Promise<UploadResponseDto> {
    // Validate file metadata
    const validation = uploadFileSchema.safeParse({
      fileName: fileName || file.name,
      fileType: file.type,
      fileSize: file.size,
    });

    if (!validation.success) {
      throw new Error(validation.error.errors[0].message);
    }

    // Generate unique filename with tenant prefix
    const timestamp = Date.now();
    const uniqueFileName = `${this.tenantId}-${timestamp}-${validation.data.fileName}`;

    try {
      // Upload to Vercel Blob
      const blob = await put(uniqueFileName, file, {
        access: 'public',
      });

      // Create audit log
      await this.auditLogRepository.create({
        action: 'FILE_UPLOADED',
        resource: 'Upload',
        metadata: {
          fileName: uniqueFileName,
          originalName: file.name,
          fileSize: file.size,
          fileType: file.type,
          url: blob.url,
        },
      });

      return {
        url: blob.url,
        name: uniqueFileName,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Erro ao fazer upload do arquivo');
    }
  }

  async deleteFile(url: string): Promise<void> {
    try {
      // Note: Vercel Blob doesn't have a direct delete API in the client
      // For now, we'll just log the deletion request
      // In production, you'd need to implement server-side deletion
      
      await this.auditLogRepository.create({
        action: 'FILE_DELETE_REQUESTED',
        resource: 'Upload',
        metadata: { url },
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Erro ao deletar arquivo');
    }
  }

  // Validate file type by checking actual file signature
  async validateFileSignature(file: File): Promise<boolean> {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    
    // Check MIME type
    if (!allowedMimeTypes.includes(file.type)) {
      return false;
    }

    // For additional security, could check file signature (magic bytes)
    // This is a simplified version
    const buffer = await file.slice(0, 4).arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    
    // Check for common image signatures
    // JPEG: FF D8 FF
    // PNG: 89 50 4E 47
    // GIF: 47 49 46 38
    // WebP: 52 49 46 46
    
    const signatures = {
      'image/jpeg': [0xFF, 0xD8, 0xFF],
      'image/jpg': [0xFF, 0xD8, 0xFF],
      'image/png': [0x89, 0x50, 0x4E, 0x47],
      'image/gif': [0x47, 0x49, 0x46, 0x38],
      'image/webp': [0x52, 0x49, 0x46, 0x46],
    };

    const expectedSignature = signatures[file.type as keyof typeof signatures];
    if (!expectedSignature) return false;

    for (let i = 0; i < expectedSignature.length; i++) {
      if (uint8Array[i] !== expectedSignature[i]) {
        return false;
      }
    }

    return true;
  }
}
