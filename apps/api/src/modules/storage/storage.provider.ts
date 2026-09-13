import { ENV } from '../../config/env';

export interface PresignedUploadResult {
  uploadUrl: string;
  fileKey: string;
  publicUrl: string;
  headers: Record<string, string>;
  expiresInSeconds: number;
}

export interface StorageProvider {
  generatePresignedUploadUrl(params: {
    userId: string;
    fileName: string;
    fileType: string;
    category: 'CV' | 'AVATAR' | 'PROJECT_MEDIA';
  }): Promise<PresignedUploadResult>;

  deleteFile(fileKey: string): Promise<boolean>;
}

export class S3CompatibleStorageProvider implements StorageProvider {
  constructor(
    private bucket: string = ENV.STORAGE_BUCKET,
    private publicBaseUrl: string = ENV.STORAGE_PUBLIC_URL
  ) {}

  async generatePresignedUploadUrl(params: {
    userId: string;
    fileName: string;
    fileType: string;
    category: 'CV' | 'AVATAR' | 'PROJECT_MEDIA';
  }): Promise<PresignedUploadResult> {
    const cleanName = params.fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileKey = `${params.category.toLowerCase()}s/${params.userId}/${Date.now()}-${cleanName}`;
    
    // S3/R2 direct PUT endpoint
    const uploadUrl = `https://${this.bucket}.s3.amazonaws.com/${fileKey}`;
    const publicUrl = `${this.publicBaseUrl}/${fileKey}`;

    return {
      uploadUrl,
      fileKey,
      publicUrl,
      headers: {
        'Content-Type': params.fileType,
      },
      expiresInSeconds: 300,
    };
  }

  async deleteFile(fileKey: string): Promise<boolean> {
    // In production: S3.deleteObject({ Bucket: this.bucket, Key: fileKey })
    return true;
  }
}

export const storageProvider: StorageProvider = new S3CompatibleStorageProvider();
