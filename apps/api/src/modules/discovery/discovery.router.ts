import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  UserRole,
  WorkMode,
  AvailabilityOption,
  ContactChannel,
  TalentSortOption,
  ModerationStatus,
} from '@fresher2work/types';
import { db } from '../../database/db';
import { authenticateToken, requireRole } from '../../middleware/auth';

export const discoveryRouter = Router();

/**
 * GET /api/v1/discovery/talents
 * Search, filter, and paginate active student profiles
 */
discoveryRouter.get(
  '/talents',
  authenticateToken,
  requireRole(UserRole.RECRUITER, UserRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const q = req.query.q as string | undefined;
      const skills = req.query.skills ? (Array.isArray(req.query.skills) ? req.query.skills : [req.query.skills]) as string[] : undefined;
      const roles = req.query.roles ? (Array.isArray(req.query.roles) ? req.query.roles : [req.query.roles]) as string[] : undefined;
      const locations = req.query.locations ? (Array.isArray(req.query.locations) ? req.query.locations : [req.query.locations]) as string[] : undefined;
      const countries = req.query.countries ? (Array.isArray(req.query.countries) ? req.query.countries : [req.query.countries]) as string[] : undefined;
      const workMode = req.query.workMode ? (Array.isArray(req.query.workMode) ? req.query.workMode : [req.query.workMode]) as WorkMode[] : undefined;
      const availability = req.query.availability ? (Array.isArray(req.query.availability) ? req.query.availability : [req.query.availability]) as AvailabilityOption[] : undefined;
      const education = req.query.education ? (Array.isArray(req.query.education) ? req.query.education : [req.query.education]) as string[] : undefined;
      const minCompleteness = req.query.minCompleteness ? parseInt(req.query.minCompleteness as string, 10) : undefined;
      const categories = req.query.categories ? (Array.isArray(req.query.categories) ? req.query.categories : [req.query.categories]) as string[] : undefined;
      const hasCvOnly = req.query.hasCvOnly === 'true';
      const hasProjectsOnly = req.query.hasProjectsOnly === 'true';
      const hasWorkSamplesOnly = req.query.hasWorkSamplesOnly === 'true';
      const hasCertificatesOnly = req.query.hasCertificatesOnly === 'true';
      const sort = (req.query.sort as TalentSortOption) || 'RELEVANCE';
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 12;

      const result = await db.searchTalents({
        q,
        skills,
        roles,
        locations,
        countries,
        workMode,
        availability,
        education,
        minCompleteness,
        categories,
        hasCvOnly,
        hasProjectsOnly,
        hasWorkSamplesOnly,
        hasCertificatesOnly,
        sort,
        page,
        limit,
      });

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to search talents: ' + err.message });
    }
  }
);

/**
 * GET /api/v1/discovery/talents/:id
 * Deep-dive candidate profile
 */
discoveryRouter.get(
  '/talents/:id',
  authenticateToken,
  requireRole(UserRole.RECRUITER, UserRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentById(req.params.id);
    if (!student) {
      res.status(404).json({ error: 'Candidate profile not found' });
      return;
    }

    // Security: Recruiters can only inspect active & approved candidates
    if (req.user!.role === UserRole.RECRUITER && (!student.isActivated || student.moderationStatus !== ModerationStatus.APPROVED)) {
      res.status(404).json({ error: 'Candidate profile is not available for discovery' });
      return;
    }

    // Security: Hired Candidate Access Control
    // If a candidate has been hired, ONLY the hiring recruiter/company and Super Admin can open their profile
    if (student.isHired || student.placement) {
      if (req.user!.role === UserRole.RECRUITER) {
        let recruiter;
        if (req.user!.recruiterId) {
          recruiter = await db.findRecruiterById(req.user!.recruiterId);
        }
        if (!recruiter) {
          recruiter = await db.findRecruiterByUserId(req.user!.userId);
        }

        const isHiringRecruiter =
          recruiter &&
          (student.placement?.recruiterId === recruiter.id ||
            student.placement?.companyId === recruiter.companyId);

        if (!isHiringRecruiter) {
          res.status(403).json({
            error:
              'Candidate profile is locked. This candidate has been placed and hired. Full profile is exclusively accessible to the hiring organization and Super Admin.',
            isHired: true,
            isLocked: true,
            companyName: student.placement?.companyName || student.placement?.company?.name || 'Partner Company',
          });
          return;
        }
      }
    }

    res.json({ candidate: student });
  }
);

/**
 * POST /api/v1/discovery/talents/:id/contact
 * Reveal and log recruiter contact event
 */
discoveryRouter.post(
  '/talents/:id/contact',
  authenticateToken,
  requireRole(UserRole.RECRUITER),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentById(req.params.id);
    if (!student || !student.isActivated || student.moderationStatus !== ModerationStatus.APPROVED) {
      res.status(404).json({ error: 'Candidate not found or not available for contact' });
      return;
    }

    // Security: Hired candidates cannot have contact revealed to other recruiters
    if (student.isHired || student.placement) {
      let recruiter;
      if (req.user!.recruiterId) {
        recruiter = await db.findRecruiterById(req.user!.recruiterId);
      }
      if (!recruiter) {
        recruiter = await db.findRecruiterByUserId(req.user!.userId);
      }

      const isHiringRecruiter =
        recruiter &&
        (student.placement?.recruiterId === recruiter.id ||
          student.placement?.companyId === recruiter.companyId);

      if (!isHiringRecruiter) {
        res.status(403).json({
          error: 'This candidate has already been hired. Contact details are locked.',
          isHired: true,
          isLocked: true,
        });
        return;
      }
    }

    const { channel = ContactChannel.EMAIL } = req.body;
    let recruiterId = req.user!.recruiterId;
    if (!recruiterId) {
      const recruiter = await db.findRecruiterByUserId(req.user!.userId);
      recruiterId = recruiter?.id || 'rec-1';
    }

    const event = await db.logContactEvent(recruiterId, student.id, channel as ContactChannel);

    res.json({
      message: 'Contact intent recorded',
      contactInfo: {
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
        linkedinUrl: student.linkedinUrl,
        portfolioUrl: student.portfolioUrl,
      },
      eventId: event.id,
    });
  }
);

/**
 * POST /api/v1/discovery/talents/:id/shortlist
 * Save candidate to recruiter shortlist
 */
discoveryRouter.post(
  '/talents/:id/shortlist',
  authenticateToken,
  requireRole(UserRole.RECRUITER),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentById(req.params.id);
    if (!student || !student.isActivated || student.moderationStatus !== ModerationStatus.APPROVED) {
      res.status(404).json({ error: 'Candidate not found or not available' });
      return;
    }

    let recruiterId = req.user!.recruiterId;
    if (!recruiterId) {
      const recruiter = await db.findRecruiterByUserId(req.user!.userId);
      recruiterId = recruiter?.id || 'rec-1';
    }

    const { note } = req.body;
    const shortlist = await db.addShortlist(recruiterId, student.id, note);

    res.json({
      message: 'Candidate saved to shortlist',
      shortlist,
    });
  }
);

/**
 * DELETE /api/v1/discovery/talents/:id/shortlist
 */
discoveryRouter.delete(
  '/talents/:id/shortlist',
  authenticateToken,
  requireRole(UserRole.RECRUITER),
  async (req: Request, res: Response): Promise<void> => {
    let recruiterId = req.user!.recruiterId;
    if (!recruiterId) {
      const recruiter = await db.findRecruiterByUserId(req.user!.userId);
      recruiterId = recruiter?.id || 'rec-1';
    }

    const removed = await db.removeShortlist(recruiterId, req.params.id);

    res.json({
      success: removed,
      message: removed ? 'Removed from shortlist' : 'Candidate was not in shortlist',
    });
  }
);

/**
 * GET /api/v1/discovery/shortlists
 */
discoveryRouter.get(
  '/shortlists',
  authenticateToken,
  requireRole(UserRole.RECRUITER),
  async (req: Request, res: Response): Promise<void> => {
    let recruiterId = req.user!.recruiterId;
    if (!recruiterId) {
      const recruiter = await db.findRecruiterByUserId(req.user!.userId);
      recruiterId = recruiter?.id || 'rec-1';
    }

    const shortlists = await db.getShortlistsByRecruiter(recruiterId);

    res.json({ shortlists });
  }
);

/**
 * GET /api/v1/discovery/company
 */
discoveryRouter.get(
  '/company',
  authenticateToken,
  requireRole(UserRole.RECRUITER, UserRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    let company;
    if (req.user!.recruiterId) {
      const recruiter = await db.findRecruiterById(req.user!.recruiterId);
      if (recruiter?.companyId) {
        company = await db.findCompanyById(recruiter.companyId);
      }
    } else {
      const recruiter = await db.findRecruiterByUserId(req.user!.userId);
      if (recruiter?.companyId) {
        company = await db.findCompanyById(recruiter.companyId);
      }
    }

    if (!company) {
      const allCompanies = await db.getAllCompanies();
      company = allCompanies[0] || null;
    }

    res.json({ company });
  }
);

/**
 * PUT /api/v1/discovery/company
 */
discoveryRouter.put(
  '/company',
  authenticateToken,
  requireRole(UserRole.RECRUITER, UserRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    let recruiter;
    if (req.user!.recruiterId) {
      recruiter = await db.findRecruiterById(req.user!.recruiterId);
    } else {
      recruiter = await db.findRecruiterByUserId(req.user!.userId);
    }

    let companyId = recruiter?.companyId;
    if (!companyId) {
      const allCompanies = await db.getAllCompanies();
      companyId = allCompanies[0]?.id;
    }

    if (!companyId) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }

    const updated = await db.updateCompany(companyId, req.body);
    res.json({ message: 'Company updated', company: updated });
  }
);

/**
 * GET /api/v1/discovery/recruiter/me
 */
discoveryRouter.get(
  '/recruiter/me',
  authenticateToken,
  requireRole(UserRole.RECRUITER, UserRole.ADMIN),
  async (req: Request, res: Response): Promise<void> => {
    let recruiter;
    if (req.user!.recruiterId) {
      recruiter = await db.findRecruiterById(req.user!.recruiterId);
    }
    if (!recruiter) {
      recruiter = await db.findRecruiterByUserId(req.user!.userId);
    }

    res.json({ recruiter });
  }
);

/**
 * PUT /api/v1/discovery/recruiter/me
 */
discoveryRouter.put(
  '/recruiter/me',
  authenticateToken,
  requireRole(UserRole.RECRUITER),
  async (req: Request, res: Response): Promise<void> => {
    let recruiter;
    if (req.user!.recruiterId) {
      recruiter = await db.findRecruiterById(req.user!.recruiterId);
    }
    if (!recruiter) {
      recruiter = await db.findRecruiterByUserId(req.user!.userId);
    }

    if (!recruiter) {
      res.status(404).json({ error: 'Recruiter profile not found' });
      return;
    }

    const updated = await db.updateRecruiter(recruiter.id, req.body);
    res.json({ message: 'Profile updated', recruiter: updated });
  }
);

/**
 * POST /api/v1/discovery/talents/:id/hire
 * Record candidate placement / mark candidate as hired by recruiter's company
 */
discoveryRouter.post(
  '/talents/:id/hire',
  authenticateToken,
  requireRole(UserRole.RECRUITER),
  async (req: Request, res: Response): Promise<void> => {
    const HireSchema = z.object({
      roleTitle: z.string().min(2, 'Job role title is required'),
      packageLpa: z.string().optional(),
      notes: z.string().optional(),
    });

    try {
      const data = HireSchema.parse(req.body);
      const studentId = req.params.id;

      let recruiter;
      if (req.user!.recruiterId) {
        recruiter = await db.findRecruiterById(req.user!.recruiterId);
      }
      if (!recruiter) {
        recruiter = await db.findRecruiterByUserId(req.user!.userId);
      }

      if (!recruiter) {
        res.status(403).json({ error: 'Recruiter profile not found for this account' });
        return;
      }

      if (!recruiter.companyId) {
        res.status(400).json({ error: 'Recruiter must be linked to an approved company to hire talent' });
        return;
      }

      const existingStudent = await db.findStudentById(studentId);
      if (!existingStudent) {
        res.status(404).json({ error: 'Candidate profile not found' });
        return;
      }

      if (existingStudent.isHired || existingStudent.placement) {
        res.status(400).json({ error: 'This candidate has already been hired and placed.' });
        return;
      }

      const result = await db.hireCandidate(
        studentId,
        recruiter.id,
        recruiter.companyId,
        data
      );

      res.status(201).json({
        message: 'Candidate hired successfully and marked as placed across platform',
        placement: result.placement,
        student: result.student,
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.errors[0].message });
        return;
      }
      res.status(400).json({ error: err.message || 'Failed to record candidate hire' });
    }
  }
);
