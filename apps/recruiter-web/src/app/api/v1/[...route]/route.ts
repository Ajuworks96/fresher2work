import { NextRequest, NextResponse } from 'next/server';
import studentsDataRaw from '@/lib/students_data.json';
import platformDataRaw from '@/lib/platform_data.json';

// In-memory state persisted per serverless container
let studentsList: any[] = [...(studentsDataRaw as any[])];
const platformData = platformDataRaw as any;
const shortlistsStore: any[] = [];

// Helper to extract bearer token
function getAuthUser(req: NextRequest): { id: string; email: string; role: string } | null {
  const authHeader = req.headers.get('authorization') || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  if (token.includes('admin')) {
    return { id: 'superadmin-user-001', email: 'admin@freshertowork.com', role: 'ADMIN' };
  }
  return { id: 'recruiter-arjun-01', email: 'arjun@velvetbyte.com', role: 'RECRUITER' };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ route: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.route ? resolvedParams.route.join('/') : '';
  const authUser = getAuthUser(req);

  // 1. Admin Analytics
  if (path === 'admin/analytics') {
    return NextResponse.json(platformData.analytics || {
      totalCandidates: studentsList.length,
      verifiedCandidates: studentsList.filter((s) => s.verificationStatus === 'VERIFIED').length,
      placedCount: studentsList.filter((s) => s.isHired).length,
      totalRevenue: 495000,
      activeRecruiters: platformData.recruiters?.length || 1,
    });
  }

  // 2. Admin Students
  if (path === 'admin/students') {
    return NextResponse.json({ students: studentsList });
  }

  // 3. Admin Companies
  if (path === 'admin/companies') {
    return NextResponse.json({ companies: platformData.companies || [] });
  }

  // 4. Admin Recruiters
  if (path === 'admin/recruiters') {
    return NextResponse.json({ recruiters: platformData.recruiters || [] });
  }

  // 5. Admin Payments
  if (path === 'admin/payments') {
    return NextResponse.json({ payments: platformData.payments || [] });
  }

  // 6. Discovery Talents List
  if (path === 'discovery/talents') {
    return NextResponse.json({
      talents: studentsList,
      total: studentsList.length,
      page: 1,
      limit: 50,
      totalPages: 1,
    });
  }

  // 7. Single Talent Detail: discovery/talents/:id
  if (path.startsWith('discovery/talents/')) {
    const talentId = path.replace('discovery/talents/', '');
    const student = studentsList.find((s) => s.id === talentId);
    if (!student) {
      return NextResponse.json({ error: 'Talent not found' }, { status: 404 });
    }

    // Exclusivity Check: If placed and caller is a different recruiter, lock it!
    if (student.isHired || student.placement) {
      const isSuperAdmin = authUser?.role === 'ADMIN';
      const hiringCompanyId = platformData.companies?.[0]?.id || '8773a829-1f5d-46b9-b07d-4fad13b341be';
      const hiringRecruiterEmail = platformData.recruiters?.[0]?.businessEmail || 'arjun@velvetbyte.com';
      const isHiringOrg =
        authUser &&
        (student.placement?.recruiterId === authUser.id ||
          student.placement?.company?.id === hiringCompanyId ||
          authUser.email === hiringRecruiterEmail);

      if (!isSuperAdmin && !isHiringOrg) {
        return NextResponse.json(
          {
            error:
              'Candidate profile is locked. This candidate has been placed and hired. Full profile is exclusively accessible to the hiring organization and Super Admin.',
            isLocked: true,
            placedAt: student.placement?.company?.name || 'Partner Organization',
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(student);
  }

  if (path === 'recruiters/profile') {
    // Serve from platform data if available, otherwise use default
    const recruiterData = platformData.recruiters?.[0];
    if (recruiterData) {
      return NextResponse.json(recruiterData);
    }
    return NextResponse.json({
      id: '246522b1-8f89-4eea-b4be-df4ab51b4469',
      fullName: 'Arjun P',
      email: 'arjun@velvetbyte.com',
      designation: 'Head of Human Resources',
      companyId: '8773a829-1f5d-46b9-b07d-4fad13b341be',
      company: {
        id: '8773a829-1f5d-46b9-b07d-4fad13b341be',
        name: 'Velvetbyte PVT Ltd',
        industry: 'Web Development',
        location: 'Calicut',
        website: 'https://velvetbyte.com',
        verificationStatus: 'VERIFIED',
      },
    });
  }

  // 9. Recruiter Shortlists
  if (path === 'recruiters/shortlists') {
    return NextResponse.json({ shortlists: shortlistsStore });
  }

  return NextResponse.json({ error: `Route /api/v1/${path} not found` }, { status: 404 });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ route: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.route ? resolvedParams.route.join('/') : '';
  const body = await req.json().catch(() => ({}));
  const authUser = getAuthUser(req);

  // 1. Auth Login
  if (path === 'auth/login' || path === 'auth/recruiter/login') {
    const { email, password } = body;

    // Super Admin Authentication
    if (
      email?.toLowerCase() === 'admin@freshertowork.com' &&
      (password === 'Password@123' || password === 'Admin@FresherToWork2026!' || password?.length >= 6)
    ) {
      return NextResponse.json({
        token: 'ftw_super_admin_jwt_token_2026',
        user: {
          id: 'superadmin-user-001',
          email: 'admin@freshertowork.com',
          role: 'ADMIN',
          fullName: 'Super Administrator',
        },
      });
    }

    // Recruiter Authentication
    if (
      email?.toLowerCase().includes('recruiter') ||
      email?.toLowerCase().includes('velvetbyte') ||
      email?.toLowerCase().includes('arjun')
    ) {
      return NextResponse.json({
        token: 'ftw_recruiter_jwt_token_2026',
        user: {
          id: 'recruiter-arjun-01',
          email: email,
          role: 'RECRUITER',
          fullName: 'Arjun K',
        },
        recruiter: {
          id: 'recruiter-arjun-01',
          fullName: 'Arjun K',
          companyId: 'company-velvetbyte-01',
          companyName: 'Velvetbyte PVT Ltd',
        },
      });
    }

    // Generic fallback login for valid demo
    return NextResponse.json({
      token: 'ftw_authenticated_user_jwt_token',
      user: {
        id: 'user-001',
        email: email || 'user@fresher2work.com',
        role: email?.includes('admin') ? 'ADMIN' : 'RECRUITER',
        fullName: 'Authenticated User',
      },
    });
  }

  // 2. Contact Reveal: discovery/talents/:id/contact
  if (path.includes('/contact')) {
    const talentId = path.split('/')[2];
    const student = studentsList.find((s) => s.id === talentId);
    if (!student) return NextResponse.json({ error: 'Talent not found' }, { status: 404 });

    // Check exclusivity using real recruiter data
    const hiringRecruiterEmail = platformData.recruiters?.[0]?.businessEmail || 'arjun@velvetbyte.com';
    if (student.isHired && authUser?.role !== 'ADMIN' && authUser?.email !== hiringRecruiterEmail) {
      return NextResponse.json(
        { error: 'Candidate has been hired. Contact details are locked to unauthorized recruiters.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      email: student.email || student.user?.email || '',
      phone: student.phone || student.user?.phone || '',
      contactUnlocked: true,
    });
  }

  // 3. Hire Candidate: discovery/talents/:id/hire
  if (path.includes('/hire')) {
    const talentId = path.split('/')[2];
    const student = studentsList.find((s) => s.id === talentId);
    if (!student) return NextResponse.json({ error: 'Talent not found' }, { status: 404 });

    if (student.isHired) {
      return NextResponse.json({ error: 'Candidate has already been hired' }, { status: 400 });
    }

    const recruiterRecord = platformData.recruiters?.[0];
    const companyRecord = platformData.companies?.[0];

    student.isHired = true;
    student.placement = {
      id: `placement-${Date.now()}`,
      companyId: companyRecord?.id || '8773a829-1f5d-46b9-b07d-4fad13b341be',
      recruiterId: authUser?.id || recruiterRecord?.id || '246522b1-8f89-4eea-b4be-df4ab51b4469',
      roleTitle: body.roleTitle || 'Hired Role',
      packageLpa: body.packageLpa || 6.5,
      placedAt: new Date().toISOString(),
      company: {
        id: companyRecord?.id || '8773a829-1f5d-46b9-b07d-4fad13b341be',
        name: companyRecord?.name || 'Velvetbyte PVT Ltd',
      },
      recruiter: {
        id: recruiterRecord?.id || '246522b1-8f89-4eea-b4be-df4ab51b4469',
        fullName: recruiterRecord?.fullName || 'Arjun P',
      },
    };

    return NextResponse.json({
      success: true,
      message: 'Candidate hired successfully. Profile is now locked exclusively to your organization and Super Admin.',
      placement: student.placement,
    });
  }

  // 4. Recruiter Shortlist toggle
  if (path === 'recruiters/shortlists') {
    const { studentId } = body;
    const existingIdx = shortlistsStore.findIndex((s) => s.studentId === studentId);
    if (existingIdx >= 0) {
      shortlistsStore.splice(existingIdx, 1);
      return NextResponse.json({ success: true, action: 'removed' });
    } else {
      const student = studentsList.find((s) => s.id === studentId);
      shortlistsStore.push({
        id: `sl-${Date.now()}`,
        studentId,
        student,
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true, action: 'added' });
    }
  }

  return NextResponse.json({ error: `Route /api/v1/${path} not found` }, { status: 404 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ route: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.route ? resolvedParams.route.join('/') : '';
  const body = await req.json().catch(() => ({}));

  // Moderate Student: admin/students/:id/moderate
  if (path.includes('admin/students/') && path.includes('/moderate')) {
    const studentId = path.split('/')[2];
    const student = studentsList.find((s) => s.id === studentId);
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

    if (body.status) student.moderationStatus = body.status;
    if (typeof body.isActivated === 'boolean') student.isActivated = body.isActivated;
    if (body.moderationNotes !== undefined) student.moderationNotes = body.moderationNotes;

    return NextResponse.json({ success: true, student });
  }

  return NextResponse.json({ error: `Route /api/v1/${path} not found` }, { status: 404 });
}
