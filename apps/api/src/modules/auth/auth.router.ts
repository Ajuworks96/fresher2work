import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { UserRole, UserStatus } from '@fresher2work/types';
import { db } from '../../database/db';
import { ENV } from '../../config/env';
import { authenticateToken } from '../../middleware/auth';
import { rateLimiter } from '../../middleware/rateLimiter';

export const authRouter = Router();

const authRateLimiter = rateLimiter(15 * 60 * 1000, 50);

const RegisterSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(UserRole).default(UserRole.STUDENT),
  companyName: z.string().optional(),
  designation: z.string().optional(),
});

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password required'),
});

const SendOtpSchema = z.object({
  phone: z.string().min(10, 'Valid 10-digit phone number required'),
});

const VerifyOtpSchema = z.object({
  phone: z.string().min(10),
  otp: z.string().length(6),
  fullName: z.string().optional(),
});

// Mock in-memory OTP store (In production: Redis with 5 min TTL)
const OTP_STORE = new Map<string, string>();

/**
 * POST /api/v1/auth/register
 */
authRouter.post('/register', authRateLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const data = RegisterSchema.parse(req.body);

    // Security check: Administrator accounts cannot be self-registered publicly
    if (data.role === UserRole.ADMIN) {
      res.status(403).json({ error: 'Administrator accounts cannot be created via public registration' });
      return;
    }

    const existingUser = await db.findUserByEmail(data.email);
    if (existingUser) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await db.createUser({
      email: data.email,
      phone: data.phone,
      passwordHash,
      role: data.role,
      status: UserStatus.ACTIVE,
    });

    let studentProfile;
    let recruiterProfile;

    if (data.role === UserRole.STUDENT) {
      studentProfile = await db.createStudent({
        userId: user.id,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || '',
      });
    } else if (data.role === UserRole.RECRUITER) {
      recruiterProfile = await db.createRecruiter({
        userId: user.id,
        fullName: data.fullName,
        businessEmail: data.email,
        designation: data.designation,
        companyName: data.companyName,
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        studentId: studentProfile?.id,
        recruiterId: recruiterProfile?.id,
      },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        student: studentProfile,
        recruiter: recruiterProfile,
      },
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

/**
 * POST /api/v1/auth/login
 */
authRouter.post('/login', authRateLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    const user = await db.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    if (user.passwordHash) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }
    }

    const studentProfile = user.role === UserRole.STUDENT ? await db.findStudentByUserId(user.id) : undefined;
    const recruiterProfile = user.role === UserRole.RECRUITER ? await db.findRecruiterByUserId(user.id) : undefined;

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        studentId: studentProfile?.id,
        recruiterId: recruiterProfile?.id,
      },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        student: studentProfile,
        recruiter: recruiterProfile,
      },
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

/**
 * POST /api/v1/auth/send-otp (For Mobile Phone Login)
 */
authRouter.post('/send-otp', authRateLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = SendOtpSchema.parse(req.body);
    const mockOtp = '123456'; // Default sandbox OTP for easy testing
    OTP_STORE.set(phone, mockOtp);

    res.json({
      success: true,
      message: 'OTP sent successfully to ' + phone,
      debugOtp: mockOtp, // In test sandbox
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to send OTP' });
  }
});

/**
 * POST /api/v1/auth/verify-otp
 */
authRouter.post('/verify-otp', authRateLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, otp, fullName } = VerifyOtpSchema.parse(req.body);
    const storedOtp = OTP_STORE.get(phone);

    if (otp !== '123456' && otp !== storedOtp) {
      res.status(400).json({ error: 'Invalid or expired OTP' });
      return;
    }

    OTP_STORE.delete(phone);

    let user = await db.findUserByPhone(phone);
    let studentProfile;

    if (!user) {
      user = await db.createUser({
        email: `${phone.replace(/\D/g, '')}@student.freshertowork.com`,
        phone,
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
      });

      studentProfile = await db.createStudent({
        userId: user.id,
        fullName: fullName || 'Fresher Candidate',
        email: user.email,
        phone,
      });
    } else {
      studentProfile = await db.findStudentByUserId(user.id);
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        studentId: studentProfile?.id,
      },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Phone verified successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        student: studentProfile,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Verification failed' });
  }
});

/**
 * GET /api/v1/auth/me
 */
authRouter.get('/me', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const user = await db.findUserById(req.user!.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const student = user.role === UserRole.STUDENT ? await db.findStudentByUserId(user.id) : undefined;
  const recruiter = user.role === UserRole.RECRUITER ? await db.findRecruiterByUserId(user.id) : undefined;

  res.json({
    user: {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      student,
      recruiter,
    },
  });
});
