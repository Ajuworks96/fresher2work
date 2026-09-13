import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  UserRole,
  SkillLevel,
  WorkMode,
  AvailabilityOption,
  WorkSampleCategory,
  RelocationPreference,
  WorkType,
  StudentPreferences,
  calculateCompleteness,
} from '@fresher2work/types';
import { db } from '../../database/db';
import { supabaseStorage } from '../../services/storage/supabaseStorage';
import { authenticateToken, requireRole } from '../../middleware/auth';

export const studentsRouter = Router();

/**
 * GET /api/v1/students/me — Fetch authenticated student profile
 */
studentsRouter.get(
  '/me',
  authenticateToken,
  requireRole(UserRole.STUDENT),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentByUserId(req.user!.userId);
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }

    const completeness = calculateCompleteness(student);

    res.json({
      profile: student,
      completeness,
    });
  }
);

/**
 * PUT /api/v1/students/me — Update basic profile info
 */
studentsRouter.put(
  '/me',
  authenticateToken,
  requireRole(UserRole.STUDENT),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentByUserId(req.user!.userId);
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }

    const updateSchema = z.object({
      fullName: z.string().min(2).optional(),
      headline: z.string().optional(),
      about: z.string().optional(),
      avatarUrl: z.string().url().optional().or(z.literal('')),
      githubUrl: z.string().url().optional().or(z.literal('')),
      linkedinUrl: z.string().url().optional().or(z.literal('')),
      portfolioUrl: z.string().url().optional().or(z.literal('')),
      city: z.string().optional(),
      country: z.string().optional(),
    });

    try {
      const validated = updateSchema.parse(req.body);
      const updated = await db.updateStudent(student.id, validated);
      const completeness = calculateCompleteness(updated!);

      res.json({
        message: 'Profile updated successfully',
        profile: updated,
        completeness,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.errors ? err.errors[0].message : err.message });
    }
  }
);

/**
 * POST /api/v1/students/me/projects — Add a project / proof of work
 */
studentsRouter.post(
  '/me/projects',
  authenticateToken,
  requireRole(UserRole.STUDENT),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentByUserId(req.user!.userId);
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }

    const projectSchema = z.object({
      title: z.string().min(3, 'Project title is required'),
      description: z.string().min(10, 'Provide a meaningful description of what you built'),
      role: z.string().optional(),
      toolsUsed: z.array(z.string()).default([]),
      skillsDemonstrated: z.array(z.string()).default([]),
      projectLink: z.string().url().optional().or(z.literal('')),
      liveDemoUrl: z.string().url().optional().or(z.literal('')),
      githubRepoUrl: z.string().url().optional().or(z.literal('')),
      mediaUrls: z.array(z.string().url()).default([]),
      techStack: z.array(z.string()).min(1, 'Add at least one tech stack tag'),
    });

    try {
      const validated = projectSchema.parse(req.body);
      const result = await db.addProject(student.id, validated);

      res.status(201).json({
        message: 'Project added successfully',
        project: result.project,
        profile: result.profile,
        completeness: calculateCompleteness(result.profile),
      });
    } catch (err: any) {
      res.status(400).json({ error: err.errors ? err.errors[0].message : err.message });
    }
  }
);

/**
 * PUT /api/v1/students/me/projects/:id — Update an existing project
 */
studentsRouter.put(
  '/me/projects/:id',
  authenticateToken,
  requireRole(UserRole.STUDENT),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentByUserId(req.user!.userId);
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }

    const projectSchema = z.object({
      title: z.string().min(3).optional(),
      description: z.string().min(10).optional(),
      role: z.string().optional(),
      toolsUsed: z.array(z.string()).optional(),
      skillsDemonstrated: z.array(z.string()).optional(),
      projectLink: z.string().url().optional().or(z.literal('')),
      liveDemoUrl: z.string().url().optional().or(z.literal('')),
      githubRepoUrl: z.string().url().optional().or(z.literal('')),
      mediaUrls: z.array(z.string().url()).optional(),
      techStack: z.array(z.string()).min(1).optional(),
    });

    try {
      const validated = projectSchema.parse(req.body);
      const existingProject = (student.projects || []).find((p) => p.id === req.params.id);
      if (!existingProject) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      const updated = await db.updateProject(student.id, req.params.id, validated);
      const updatedProject = (updated?.projects || []).find((p) => p.id === req.params.id);

      res.json({
        message: 'Project updated successfully',
        project: updatedProject,
        profile: updated,
        completeness: calculateCompleteness(updated!),
      });
    } catch (err: any) {
      res.status(400).json({ error: err.errors ? err.errors[0].message : err.message });
    }
  }
);

/**
 * DELETE /api/v1/students/me/projects/:id — Remove a project
 */
studentsRouter.delete(
  '/me/projects/:id',
  authenticateToken,
  requireRole(UserRole.STUDENT),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentByUserId(req.user!.userId);
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }

    const updated = await db.deleteProject(student.id, req.params.id);

    res.json({
      message: 'Project removed',
      profile: updated,
      completeness: calculateCompleteness(updated!),
    });
  }
);

/**
 * POST /api/v1/students/me/work-samples — Add a creative/professional work sample
 */
studentsRouter.post(
  '/me/work-samples',
  authenticateToken,
  requireRole(UserRole.STUDENT),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentByUserId(req.user!.userId);
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }

    const sampleSchema = z.object({
      title: z.string().min(2, 'Work sample title required'),
      category: z.nativeEnum(WorkSampleCategory).default(WorkSampleCategory.OTHER),
      description: z.string().min(5, 'Provide a short description'),
      mediaUrls: z.array(z.string().url()).default([]),
      workLink: z.string().url().optional().or(z.literal('')),
      clientOrContext: z.string().optional(),
      toolsUsed: z.array(z.string()).default([]),
    });

    try {
      const validated = sampleSchema.parse(req.body);
      const result = await db.addWorkSample(student.id, validated);

      res.status(201).json({
        message: 'Work sample added successfully',
        workSample: result.sample,
        profile: result.profile,
        completeness: calculateCompleteness(result.profile),
      });
    } catch (err: any) {
      res.status(400).json({ error: err.errors ? err.errors[0].message : err.message });
    }
  }
);

/**
 * PUT /api/v1/students/me/work-samples/:id — Edit a work sample
 */
studentsRouter.put(
  '/me/work-samples/:id',
  authenticateToken,
  requireRole(UserRole.STUDENT),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentByUserId(req.user!.userId);
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }

    const sampleSchema = z.object({
      title: z.string().min(2).optional(),
      category: z.nativeEnum(WorkSampleCategory).optional(),
      description: z.string().min(5).optional(),
      mediaUrls: z.array(z.string().url()).optional(),
      workLink: z.string().url().optional().or(z.literal('')),
      clientOrContext: z.string().optional(),
      toolsUsed: z.array(z.string()).optional(),
    });

    try {
      const validated = sampleSchema.parse(req.body);
      const sampleExists = (student.workSamples || []).some((s) => s.id === req.params.id);
      if (!sampleExists) {
        res.status(404).json({ error: 'Work sample not found' });
        return;
      }

      const updated = await db.updateWorkSample(student.id, req.params.id, validated);
      const updatedSample = (updated?.workSamples || []).find((s) => s.id === req.params.id);

      res.json({
        message: 'Work sample updated',
        workSample: updatedSample,
        profile: updated,
        completeness: calculateCompleteness(updated!),
      });
    } catch (err: any) {
      res.status(400).json({ error: err.errors ? err.errors[0].message : err.message });
    }
  }
);

/**
 * DELETE /api/v1/students/me/work-samples/:id — Remove a work sample
 */
studentsRouter.delete(
  '/me/work-samples/:id',
  authenticateToken,
  requireRole(UserRole.STUDENT),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentByUserId(req.user!.userId);
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }

    const updated = await db.deleteWorkSample(student.id, req.params.id);

    res.json({
      message: 'Work sample removed',
      profile: updated,
      completeness: calculateCompleteness(updated!),
    });
  }
);

/**
 * POST /api/v1/students/me/education — Add education
 */
studentsRouter.post(
  '/me/education',
  authenticateToken,
  requireRole(UserRole.STUDENT),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentByUserId(req.user!.userId);
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }

    const eduSchema = z.object({
      institutionName: z.string().min(2),
      degree: z.string().min(2),
      fieldOfStudy: z.string().min(2),
      startYear: z.number().int(),
      endYear: z.number().int(),
      gradeOrCgpa: z.string().optional(),
    });

    try {
      const validated = eduSchema.parse(req.body);
      const updated = await db.addEducation(student.id, validated);
      const newEdu = (updated?.education || []).slice(-1)[0];

      res.status(201).json({
        message: 'Education added successfully',
        education: newEdu,
        profile: updated,
        completeness: calculateCompleteness(updated!),
      });
    } catch (err: any) {
      res.status(400).json({ error: err.errors ? err.errors[0].message : err.message });
    }
  }
);

/**
 * DELETE /api/v1/students/me/education/:id — Remove education
 */
studentsRouter.delete(
  '/me/education/:id',
  authenticateToken,
  requireRole(UserRole.STUDENT),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentByUserId(req.user!.userId);
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }

    const updated = await db.deleteEducation(student.id, req.params.id);

    res.json({
      message: 'Education removed',
      profile: updated,
      completeness: calculateCompleteness(updated!),
    });
  }
);

/**
 * PUT /api/v1/students/me/skills — Update skills
 */
studentsRouter.put(
  '/me/skills',
  authenticateToken,
  requireRole(UserRole.STUDENT),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentByUserId(req.user!.userId);
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }

    const skillsSchema = z.array(
      z.object({
        skillName: z.string().min(1),
        proficiencyLevel: z.nativeEnum(SkillLevel).default(SkillLevel.BEGINNER),
        isVerified: z.boolean().default(false),
      })
    );

    try {
      const validated = skillsSchema.parse(req.body);
      const updated = await db.updateSkills(student.id, validated);

      res.json({
        message: 'Skills updated successfully',
        profile: updated,
        completeness: calculateCompleteness(updated!),
      });
    } catch (err: any) {
      res.status(400).json({ error: err.errors ? err.errors[0].message : err.message });
    }
  }
);

/**
 * GET /api/v1/students/me/preferences — Fetch career preferences
 */
studentsRouter.get(
  '/me/preferences',
  authenticateToken,
  requireRole(UserRole.STUDENT),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentByUserId(req.user!.userId);
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }

    res.json({
      preferences: student.preferences || {
        preferredRoles: [],
        preferredIndustries: [],
        preferredLocations: [],
        preferredCountries: ['India'],
        workModes: [WorkMode.ANY],
        workMode: WorkMode.ANY,
        relocationWillingness: RelocationPreference.WILLING,
        availability: AvailabilityOption.IMMEDIATE,
        preferredWorkTypes: [WorkType.FULL_TIME],
      },
    });
  }
);

/**
 * PUT /api/v1/students/me/preferences — Update structured job & location preferences
 */
studentsRouter.put(
  '/me/preferences',
  authenticateToken,
  requireRole(UserRole.STUDENT),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentByUserId(req.user!.userId);
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }

    const existing: Partial<StudentPreferences> = student.preferences || {
      preferredRoles: [],
      preferredIndustries: [],
      preferredLocations: [],
      preferredCountries: ['India'],
      workModes: [WorkMode.HYBRID],
      workMode: WorkMode.HYBRID,
      relocationWillingness: RelocationPreference.WILLING,
      availability: AvailabilityOption.IMMEDIATE,
      preferredWorkTypes: [WorkType.FULL_TIME],
      salaryCurrency: 'INR',
    };

    const prefSchema = z.object({
      preferredRoles: z.array(z.string().min(1)).optional(),
      preferredIndustries: z.array(z.string()).optional(),
      preferredLocations: z.array(z.string().min(1)).optional(),
      preferredCountries: z.array(z.string()).optional(),
      workModes: z.array(z.nativeEnum(WorkMode)).optional(),
      workMode: z.nativeEnum(WorkMode).optional(),
      relocationWillingness: z.nativeEnum(RelocationPreference).optional(),
      availability: z.nativeEnum(AvailabilityOption).optional(),
      availableFromDate: z.string().optional(),
      preferredWorkTypes: z.array(z.nativeEnum(WorkType)).optional(),
      expectedSalaryMin: z.number().optional(),
      salaryCurrency: z.string().optional(),
    });

    try {
      const validated = prefSchema.parse(req.body);
      const preferences = {
        preferredRoles: validated.preferredRoles !== undefined ? validated.preferredRoles : (existing.preferredRoles || []),
        preferredIndustries: validated.preferredIndustries !== undefined ? validated.preferredIndustries : (existing.preferredIndustries || []),
        preferredLocations: validated.preferredLocations !== undefined ? validated.preferredLocations : (existing.preferredLocations || []),
        preferredCountries: validated.preferredCountries !== undefined ? validated.preferredCountries : (existing.preferredCountries || ['India']),
        workModes: validated.workModes !== undefined ? validated.workModes : (existing.workModes || [WorkMode.HYBRID]),
        workMode: validated.workMode || (validated.workModes && validated.workModes[0]) || existing.workMode || WorkMode.ANY,
        relocationWillingness: validated.relocationWillingness || existing.relocationWillingness || RelocationPreference.WILLING,
        availability: validated.availability || existing.availability || AvailabilityOption.IMMEDIATE,
        availableFromDate: validated.availableFromDate || existing.availableFromDate,
        preferredWorkTypes: validated.preferredWorkTypes !== undefined ? validated.preferredWorkTypes : (existing.preferredWorkTypes || [WorkType.FULL_TIME]),
        expectedSalaryMin: validated.expectedSalaryMin !== undefined ? validated.expectedSalaryMin : existing.expectedSalaryMin,
        salaryCurrency: validated.salaryCurrency || existing.salaryCurrency || 'INR',
      };

      const updated = await db.updatePreferences(student.id, preferences);

      res.json({
        message: 'Preferences updated successfully',
        preferences: updated?.preferences,
        profile: updated,
        completeness: calculateCompleteness(updated!),
      });
    } catch (err: any) {
      res.status(400).json({ error: err.errors ? err.errors[0].message : err.message });
    }
  }
);

/**
 * POST /api/v1/students/me/certificates — Add a certificate or credential
 */
studentsRouter.post(
  '/me/certificates',
  authenticateToken,
  requireRole(UserRole.STUDENT),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentByUserId(req.user!.userId);
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }

    const certSchema = z.object({
      name: z.string().min(2, 'Certificate name required'),
      issuingOrganization: z.string().min(2, 'Issuing organization required'),
      issueDate: z.string().min(4, 'Issue date or year required'),
      credentialUrl: z.string().url().optional().or(z.literal('')),
      certificateFileUrl: z.string().url().optional().or(z.literal('')),
    });

    try {
      const validated = certSchema.parse(req.body);
      const updated = await db.addCertificate(student.id, validated);
      const newCert = (updated?.certificates || []).slice(-1)[0];

      res.status(201).json({
        message: 'Certificate added successfully',
        certificate: newCert,
        profile: updated,
        completeness: calculateCompleteness(updated!),
      });
    } catch (err: any) {
      res.status(400).json({ error: err.errors ? err.errors[0].message : err.message });
    }
  }
);

/**
 * PUT /api/v1/students/me/certificates/:id — Edit a certificate
 */
studentsRouter.put(
  '/me/certificates/:id',
  authenticateToken,
  requireRole(UserRole.STUDENT),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentByUserId(req.user!.userId);
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }

    const certSchema = z.object({
      name: z.string().min(2).optional(),
      issuingOrganization: z.string().min(2).optional(),
      issueDate: z.string().min(4).optional(),
      credentialUrl: z.string().url().optional().or(z.literal('')),
      certificateFileUrl: z.string().url().optional().or(z.literal('')),
    });

    try {
      const validated = certSchema.parse(req.body);
      const updated = await db.updateCertificate(student.id, req.params.id, validated);
      const updatedCert = (updated?.certificates || []).find((c) => c.id === req.params.id);

      res.json({
        message: 'Certificate updated',
        certificate: updatedCert,
        profile: updated,
        completeness: calculateCompleteness(updated!),
      });
    } catch (err: any) {
      res.status(400).json({ error: err.errors ? err.errors[0].message : err.message });
    }
  }
);

/**
 * DELETE /api/v1/students/me/certificates/:id — Remove a certificate
 */
studentsRouter.delete(
  '/me/certificates/:id',
  authenticateToken,
  requireRole(UserRole.STUDENT),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentByUserId(req.user!.userId);
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }

    const updated = await db.deleteCertificate(student.id, req.params.id);

    res.json({
      message: 'Certificate removed',
      profile: updated,
      completeness: calculateCompleteness(updated!),
    });
  }
);

/**
 * POST /api/v1/students/me/cv/confirm — Upload or Replace existing CV document
 */
studentsRouter.post(
  '/me/cv/confirm',
  authenticateToken,
  requireRole(UserRole.STUDENT),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentByUserId(req.user!.userId);
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }

    const { cvFileUrl, fileName, fileSize } = req.body;
    if (!cvFileUrl || typeof cvFileUrl !== 'string') {
      res.status(400).json({ error: 'Valid CV file URL required' });
      return;
    }

    const oldCvUrl = student.cvFileUrl;

    const updated = await db.updateStudent(student.id, {
      cvFileUrl,
      cvFileName: fileName || 'resume.pdf',
      cvFileSize: fileSize || undefined,
      cvUploadedAt: new Date().toISOString(),
    });

    // Clean up previous CV from storage only after successful database update
    if (oldCvUrl && oldCvUrl !== cvFileUrl && oldCvUrl.includes('/cvs/')) {
      const oldKey = oldCvUrl.split('/cvs/')[1] ? `cvs/${oldCvUrl.split('/cvs/')[1]}` : undefined;
      if (oldKey) {
        supabaseStorage.deleteFile(oldKey).catch(() => {});
      }
    }

    res.json({
      message: 'CV uploaded and registered successfully',
      profile: updated,
      completeness: calculateCompleteness(updated!),
    });
  }
);

/**
 * DELETE /api/v1/students/me/cv — Delete/Remove uploaded CV
 */
studentsRouter.delete(
  '/me/cv',
  authenticateToken,
  requireRole(UserRole.STUDENT),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentByUserId(req.user!.userId);
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }

    const oldCvUrl = student.cvFileUrl;

    const updated = await db.updateStudent(student.id, {
      cvFileUrl: null as any,
      cvFileName: null as any,
      cvFileSize: null as any,
      cvUploadedAt: null as any,
    });

    if (oldCvUrl && oldCvUrl.includes('/cvs/')) {
      const oldKey = oldCvUrl.split('/cvs/')[1] ? `cvs/${oldCvUrl.split('/cvs/')[1]}` : undefined;
      if (oldKey) {
        supabaseStorage.deleteFile(oldKey).catch(() => {});
      }
    }

    res.json({
      message: 'CV removed from profile',
      profile: updated,
      completeness: calculateCompleteness(updated!),
    });
  }
);

/**
 * POST /api/v1/students/me/request-verification — Re-submit profile for verification after fixing issues
 */
studentsRouter.post(
  '/me/request-verification',
  authenticateToken,
  requireRole(UserRole.STUDENT),
  async (req: Request, res: Response): Promise<void> => {
    const student = await db.findStudentByUserId(req.user!.userId);
    if (!student) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }

    const updated = await db.updateStudent(student.id, {
      moderationStatus: 'PENDING_REVIEW' as any,
    });

    res.json({
      message: 'Profile re-submitted for admin verification successfully',
      profile: updated,
    });
  }
);

/**
 * GET /api/v1/students/p/:slug — Public shareable student profile (PII Protected)
 */
studentsRouter.get('/p/:slug', async (req: Request, res: Response): Promise<void> => {
  const student = await db.findStudentBySlug(req.params.slug);
  if (!student) {
    res.status(404).json({ error: 'Profile not found' });
    return;
  }

  // Mask private sensitive contact info for public unauthenticated visitors
  const sanitized = {
    ...student,
    phone: undefined, // Protected PII
    email: undefined, // Protected PII
  };

  res.json({ profile: sanitized });
});

