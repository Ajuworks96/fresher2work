import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  UserRole,
  ModerationStatus,
  CompanyVerificationStatus,
} from '@fresher2work/types';
import { db } from '../../database/db';
import { authenticateToken, requireRole } from '../../middleware/auth';

export const adminRouter = Router();

/**
 * GET /api/v1/admin/analytics
 */
adminRouter.get(
  '/analytics',
  authenticateToken,
  requireRole(UserRole.ADMIN),
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const analytics = await db.getAnalytics();
      res.json(analytics);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve analytics: ' + err.message });
    }
  }
);

/**
 * GET /api/v1/admin/students
 */
adminRouter.get(
  '/students',
  authenticateToken,
  requireRole(UserRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const status = req.query.status as ModerationStatus | undefined;
      const students = await db.getAllStudents(status);
      res.json({ students });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve students: ' + err.message });
    }
  }
);

/**
 * PATCH /api/v1/admin/students/:id/moderate
 */
adminRouter.patch(
  '/students/:id/moderate',
  authenticateToken,
  requireRole(UserRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { status, isActivated, moderationNotes } = req.body;
      const student = await db.findStudentById(req.params.id);
      if (!student) {
        res.status(404).json({ error: 'Student not found' });
        return;
      }

      const updates: any = {};
      if (status) updates.moderationStatus = status as ModerationStatus;
      if (typeof isActivated === 'boolean') updates.isActivated = isActivated;
      if (moderationNotes !== undefined) updates.moderationNotes = moderationNotes;

      const updated = await db.updateStudent(student.id, updates);
      res.json({ message: 'Student status updated', profile: updated });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to moderate student: ' + err.message });
    }
  }
);

/**
 * GET /api/v1/admin/students/:id
 */
adminRouter.get(
  '/students/:id',
  authenticateToken,
  requireRole(UserRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const student = await db.findStudentById(req.params.id);
      if (!student) {
        res.status(404).json({ error: 'Student not found' });
        return;
      }
      res.json({ student });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve student: ' + err.message });
    }
  }
);

/**
 * PATCH /api/v1/admin/students/:id
 * Edit student profile & user account by Admin
 */
adminRouter.patch(
  '/students/:id',
  authenticateToken,
  requireRole(UserRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const student = await db.findStudentById(req.params.id);
      if (!student) {
        res.status(404).json({ error: 'Student not found' });
        return;
      }

      const updated = await db.updateStudentByAdmin(req.params.id, req.body);
      res.json({ message: 'Student profile updated successfully', profile: updated });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update student: ' + err.message });
    }
  }
);

/**
 * DELETE /api/v1/admin/students/:id
 * Permanently deactivate or delete student profile & account
 */
adminRouter.delete(
  '/students/:id',
  authenticateToken,
  requireRole(UserRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const student = await db.findStudentById(req.params.id);
      if (!student) {
        res.status(404).json({ error: 'Student not found' });
        return;
      }

      await db.deleteStudentByAdmin(req.params.id);
      res.json({ message: 'Student account deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete student: ' + err.message });
    }
  }
);

/**
 * GET /api/v1/admin/placements
 * Verified direct in-app placements & hiring telemetry
 */
adminRouter.get(
  '/placements',
  authenticateToken,
  requireRole(UserRole.ADMIN),
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const analytics = await db.getAnalytics();
      res.json({
        placements: analytics.verifiedPlacements,
        metrics: {
          totalHiredCandidates: analytics.metrics.totalHiredCandidates,
          inAppDirectPlacements: analytics.metrics.inAppDirectPlacements,
          inAppPlacementRatioPercent: analytics.metrics.inAppPlacementRatioPercent,
          platformSuccessRatePercent: analytics.metrics.platformSuccessRatePercent,
          averagePackageLpa: analytics.metrics.averagePackageLpa,
          averageDaysToHire: analytics.metrics.averageDaysToHire,
          totalContactReveals: analytics.metrics.totalContactReveals,
          totalShortlists: analytics.metrics.totalShortlists,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve placements: ' + err.message });
    }
  }
);

/**
 * GET /api/v1/admin/companies
 */
adminRouter.get(
  '/companies',
  authenticateToken,
  requireRole(UserRole.ADMIN),
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const companies = await db.getAllCompanies();
      res.json({ companies });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve companies: ' + err.message });
    }
  }
);

/**
 * PATCH /api/v1/admin/companies/:id/verify
 */
adminRouter.patch(
  '/companies/:id/verify',
  authenticateToken,
  requireRole(UserRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.body;
      const company = await db.findCompanyById(req.params.id);
      if (!company) {
        res.status(404).json({ error: 'Company not found' });
        return;
      }

      const updated = await db.updateCompany(company.id, {
        verificationStatus: status as CompanyVerificationStatus,
      });

      res.json({ message: 'Company status updated', company: updated });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update company: ' + err.message });
    }
  }
);

/**
 * GET /api/v1/admin/recruiters
 */
adminRouter.get(
  '/recruiters',
  authenticateToken,
  requireRole(UserRole.ADMIN),
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const recruiters = await db.getAllRecruiters();
      res.json({ recruiters });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve recruiters: ' + err.message });
    }
  }
);

/**
 * POST /api/v1/admin/recruiters
 * Create a new recruiter and associated company directly from Super Admin
 */
adminRouter.post(
  '/recruiters',
  authenticateToken,
  requireRole(UserRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    const CreateRecruiterSchema = z.object({
      fullName: z.string().min(2, 'Full name is required'),
      email: z.string().email('Valid email is required'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      phone: z.string().optional(),
      designation: z.string().min(2, 'Designation is required'),
      companyName: z.string().min(2, 'Company name is required'),
      industry: z.string().optional(),
      location: z.string().optional(),
      website: z.string().optional(),
      verificationStatus: z.nativeEnum(CompanyVerificationStatus).optional(),
    });

    try {
      const data = CreateRecruiterSchema.parse(req.body);
      const bcrypt = require('bcryptjs');
      const passwordHash = await bcrypt.hash(data.password, 10);

      const created = await db.createRecruiterByAdmin({
        ...data,
        passwordHash,
      });

      res.status(201).json({
        message: 'Recruiter and company created successfully',
        recruiter: created.recruiter,
        company: created.company,
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.errors[0].message });
        return;
      }
      res.status(500).json({ error: 'Failed to create recruiter: ' + err.message });
    }
  }
);

/**
 * PATCH /api/v1/admin/recruiters/:id
 * Edit recruiter profile & company details by Admin
 */
adminRouter.patch(
  '/recruiters/:id',
  authenticateToken,
  requireRole(UserRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const updated = await db.updateRecruiterByAdmin(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Recruiter not found' });
        return;
      }
      res.json({ message: 'Recruiter profile updated successfully', recruiter: updated });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update recruiter: ' + err.message });
    }
  }
);

/**
 * DELETE /api/v1/admin/recruiters/:id
 * Permanently delete or suspend recruiter account by Admin
 */
adminRouter.delete(
  '/recruiters/:id',
  authenticateToken,
  requireRole(UserRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const deleted = await db.deleteRecruiterByAdmin(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Recruiter not found' });
        return;
      }
      res.json({ message: 'Recruiter account deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete recruiter: ' + err.message });
    }
  }
);

/**
 * PATCH /api/v1/admin/companies/:id
 * Edit/correct company details
 */
adminRouter.patch(
  '/companies/:id',
  authenticateToken,
  requireRole(UserRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, website, location, industry, verificationStatus } = req.body;
      const updated = await db.updateCompany(req.params.id, {
        name,
        website,
        location,
        industry,
        verificationStatus: verificationStatus as CompanyVerificationStatus,
      });
      res.json({ message: 'Company details updated', company: updated });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update company: ' + err.message });
    }
  }
);

/**
 * GET /api/v1/admin/payments
 */
adminRouter.get(
  '/payments',
  authenticateToken,
  requireRole(UserRole.ADMIN),
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const payments = await db.getAllPayments();
      res.json({ payments });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve payments: ' + err.message });
    }
  }
);
