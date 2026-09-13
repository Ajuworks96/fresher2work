import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { ENV } from '../../config/env';
import { authenticateToken } from '../../middleware/auth';
import { supabaseStorage } from '../../services/storage/supabaseStorage';
import { db } from '../../database/db';
import { UserRole } from '@fresher2work/types';

export const storageRouter = Router();

const PresignedSchema = z.object({
  fileName: z.string().min(1, 'Filename required'),
  fileType: z.string().min(1, 'File type required'),
  fileSize: z.number().positive('File size must be positive'),
  category: z.enum(['CV', 'AVATAR', 'PROJECT_MEDIA', 'WORK_SAMPLE', 'CERTIFICATE']),
});

/**
 * POST /api/v1/storage/presigned-upload
 * Generates Supabase Storage signed upload URL with strict validation
 */
storageRouter.post('/presigned-upload', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileName, fileType, fileSize, category } = PresignedSchema.parse(req.body);

    // Extension validation to prevent executables, scripts, and HTML
    const ext = (fileName.split('.').pop() || '').toLowerCase();
    const disallowedExtensions = ['exe', 'sh', 'bat', 'cmd', 'js', 'ts', 'html', 'htm', 'php', 'py', 'svg'];
    if (disallowedExtensions.includes(ext)) {
      res.status(400).json({ error: `File type .${ext} is not permitted for security reasons.` });
      return;
    }

    // Strict CV Validation: ONLY PDF allowed, Max 10MB
    if (category === 'CV') {
      if (fileType !== 'application/pdf' || ext !== 'pdf') {
        res.status(400).json({ error: 'CV must be an existing PDF document. Other formats are not accepted.' });
        return;
      }
      if (fileSize > 10 * 1024 * 1024) {
        res.status(400).json({ error: 'CV file size exceeds 10MB limit. Please upload an optimized PDF.' });
        return;
      }
    }

    // Avatar validation: Images only, max 5MB
    if (category === 'AVATAR') {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      const validImageExts = ['jpg', 'jpeg', 'png', 'webp'];
      if (!validImageTypes.includes(fileType) && !validImageExts.includes(ext)) {
        res.status(400).json({ error: 'Avatar must be a valid image (JPEG, PNG, or WebP).' });
        return;
      }
      if (fileSize > 5 * 1024 * 1024) {
        res.status(400).json({ error: 'Avatar image size exceeds 5MB limit.' });
        return;
      }
    }

    // Project & Work Sample Media validation: Max 10MB
    if (['PROJECT_MEDIA', 'WORK_SAMPLE', 'CERTIFICATE'].includes(category)) {
      const allowedMedia = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'application/pdf',
      ];
      const allowedMediaExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf'];
      if (!allowedMedia.includes(fileType) && !allowedMediaExts.includes(ext)) {
        res.status(400).json({ error: 'File must be an image (PNG, JPEG, WebP, GIF) or PDF document.' });
        return;
      }
      if (fileSize > 10 * 1024 * 1024) {
        res.status(400).json({ error: 'Media file size exceeds 10MB limit.' });
        return;
      }
    }

    // Deterministic user-scoped path
    const cleanFileName = supabaseStorage.sanitizeFileName(fileName);
    const key = `${category.toLowerCase()}s/${req.user!.userId}/${Date.now()}-${cleanFileName}`;

    const uploadResult = await supabaseStorage.createSignedUploadUrl(key, fileType, 300);

    res.json({
      uploadUrl: uploadResult.uploadUrl,
      fileKey: uploadResult.fileKey,
      publicUrl: uploadResult.publicUrl,
      signedToken: uploadResult.signedToken,
      headers: uploadResult.headers,
      expiresInSeconds: uploadResult.expiresInSeconds,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.errors ? err.errors[0].message : err.message });
  }
});

/**
 * GET /api/v1/storage/signed-url
 * Generates a temporary signed download URL for private files
 * Access control:
 * - Student owner can view their own files
 * - Recruiters can view active candidate files
 * - Admins can view any file
 */
storageRouter.get('/signed-url', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const fileKey = req.query.fileKey as string;
  if (!fileKey || typeof fileKey !== 'string') {
    res.status(400).json({ error: 'fileKey query parameter is required' });
    return;
  }

  // Path traversal prevention
  if (fileKey.includes('..') || fileKey.startsWith('/')) {
    res.status(400).json({ error: 'Invalid file key' });
    return;
  }

  const userId = req.user!.userId;
  const userRole = req.user!.role;

  // Authorization check:
  // 1. If fileKey belongs to current user
  if (fileKey.includes(`/${userId}/`)) {
    const signed = await supabaseStorage.createSignedReadUrl(fileKey, 900);
    res.json({ signedUrl: signed.signedUrl, expiresInSeconds: signed.expiresInSeconds });
    return;
  }

  // 2. If recruiter is requesting candidate file
  if (userRole === UserRole.RECRUITER) {
    // Check if fileKey belongs to an active, moderated candidate
    const student = await db.findStudentByFileKey(fileKey);
    if (!student || !student.isActivated || student.moderationStatus !== 'APPROVED') {
      res.status(404).json({ error: 'File not found or candidate not accessible' });
      return;
    }

    const signed = await supabaseStorage.createSignedReadUrl(fileKey, 900);
    res.json({ signedUrl: signed.signedUrl, expiresInSeconds: signed.expiresInSeconds });
    return;
  }

  // 3. Admin access
  if (userRole === UserRole.ADMIN) {
    const signed = await supabaseStorage.createSignedReadUrl(fileKey, 900);
    res.json({ signedUrl: signed.signedUrl, expiresInSeconds: signed.expiresInSeconds });
    return;
  }

  res.status(403).json({ error: 'Unauthorized to access this file' });
});
