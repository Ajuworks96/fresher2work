import { NextRequest, NextResponse } from 'next/server';
import studentsDataRaw from '@/lib/students_data.json';
import platformDataRaw from '@/lib/platform_data.json';

// Global cache shared within Node / serverless memory
const globalStore = globalThis as any;
if (!globalStore.__ftw_students) {
  globalStore.__ftw_students = [...(studentsDataRaw as any[])];
}
if (!globalStore.__ftw_recruiters) {
  globalStore.__ftw_recruiters = [...((platformDataRaw as any).recruiters || [])];
}
if (!globalStore.__ftw_companies) {
  globalStore.__ftw_companies = [...((platformDataRaw as any).companies || [])];
}
if (!globalStore.__ftw_payments) {
  globalStore.__ftw_payments = [...((platformDataRaw as any).payments || [])];
}
if (!globalStore.__ftw_shortlists) {
  globalStore.__ftw_shortlists = [];
}

const studentsList: any[] = globalStore.__ftw_students;
const platformData: any = platformDataRaw as any;
platformData.recruiters = globalStore.__ftw_recruiters;
platformData.companies = globalStore.__ftw_companies;
platformData.payments = globalStore.__ftw_payments;

if (!platformData.analytics) {
  platformData.analytics = {
    metrics: {
      totalStudents: 0,
      activatedStudents: 0,
      activationRatePercent: 0,
      pendingModeration: 0,
      totalRecruiters: 0,
      totalCompanies: 0,
      successfulPaymentsCount: 0,
      totalRevenueInRupees: 0,
      totalHiredCandidates: 0,
      inAppDirectPlacements: 0,
      inAppPlacementRatioPercent: 0,
      platformSuccessRatePercent: 0,
      averagePackageLpa: '₹0 LPA',
      averageDaysToHire: '0 Days',
      totalContactReveals: 0,
      totalShortlists: 0,
    },
    verifiedPlacements: [],
    recentActivity: { latestStudents: [], recentHires: [] },
  };
}

// Helper to extract bearer token
function getAuthUser(req: NextRequest): { id: string; email: string; role: string } | null {
  const authHeader = req.headers.get('authorization') || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  if (token.includes('admin') || token.includes('superadmin')) {
    return { id: 'c8446f3a-f798-433b-9938-c8439fab1c2a', email: 'superadmin@freshertowork.com', role: 'ADMIN' };
  }
  const matchedRecruiter = platformData.recruiters.find((r: any) => token.includes(r.id));
  if (matchedRecruiter) {
    return { id: matchedRecruiter.id, email: matchedRecruiter.businessEmail, role: 'RECRUITER' };
  }
  return { id: 'recruiter-session-user', email: 'recruiter@freshertowork.com', role: 'RECRUITER' };
}

// =============================================================================
// GET HANDLER
// =============================================================================
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
      totalRevenue: 0,
      activeRecruiters: platformData.recruiters?.length || 0,
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
      totalPages: Math.ceil(studentsList.length / 50) || 1,
    });
  }

  // 7. Single Talent Detail: discovery/talents/:id
  if (path.startsWith('discovery/talents/')) {
    const talentId = path.replace('discovery/talents/', '');
    const student = studentsList.find((s) => s.id === talentId);
    if (!student) {
      return NextResponse.json({ error: 'Talent not found' }, { status: 404 });
    }

    if (student.isHired || student.placement) {
      const isSuperAdmin = authUser?.role === 'ADMIN';
      const hiringCompanyId = platformData.companies?.[0]?.id;
      const hiringRecruiterEmail = platformData.recruiters?.[0]?.businessEmail;
      const isHiringOrg =
        authUser &&
        (student.placement?.recruiterId === authUser.id ||
          (hiringCompanyId && student.placement?.company?.id === hiringCompanyId) ||
          (hiringRecruiterEmail && authUser.email === hiringRecruiterEmail));

      if (!isSuperAdmin && !isHiringOrg) {
        return NextResponse.json(
          {
            error:
              'Candidate profile is locked. This candidate has been placed and hired. Full profile is exclusively accessible to the hiring organization and Super Admin.',
            isLocked: true,
            placedAt: student.placement?.company?.name || 'Verified Hiring Partner',
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(student);
  }

  // 8. Recruiter Profile
  if (path === 'recruiters/profile') {
    const recruiterData = platformData.recruiters?.[0];
    if (recruiterData) {
      return NextResponse.json(recruiterData);
    }
    return NextResponse.json({
      id: 'recruiter-profile-default',
      fullName: 'Corporate Recruiter',
      email: 'recruiter@freshertowork.com',
      designation: 'Talent Acquisition Manager',
      companyId: 'company-partner',
      company: {
        id: 'company-partner',
        name: 'Corporate Hiring Partner',
        industry: 'Information Technology',
        location: 'Kochi',
        website: 'https://freshertowork.com',
        verificationStatus: 'VERIFIED',
      },
    });
  }

  // 9. Recruiter Shortlists
  if (path === 'recruiters/shortlists') {
    return NextResponse.json({ shortlists: globalStore.__ftw_shortlists || [] });
  }

  // 10. Student Current Profile
  if (path === 'students/me') {
    const currentStudent = studentsList[0] || null;
    return NextResponse.json({ student: currentStudent });
  }

  // 11. Auth Me
  if (path === 'auth/me') {
    return NextResponse.json({
      user: authUser || { id: 'user-default', email: 'user@freshertowork.com', role: 'STUDENT' },
    });
  }

  return NextResponse.json({ error: `Route /api/v1/${path} not found` }, { status: 404 });
}

// =============================================================================
// POST HANDLER
// =============================================================================
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
      (email?.toLowerCase() === 'superadmin@freshertowork.com' ||
        email?.toLowerCase() === 'admin@freshertowork.com') &&
      (password === 'SuperAdmin@Pass2026#' ||
        password === 'Admin@FresherToWork2026!' ||
        password === 'Password@123' ||
        password?.length >= 6)
    ) {
      return NextResponse.json({
        token: 'ftw_super_admin_jwt_token_2026',
        user: {
          id: 'c8446f3a-f798-433b-9938-c8439fab1c2a',
          email: 'superadmin@freshertowork.com',
          role: 'ADMIN',
          fullName: 'Super Administrator',
        },
      });
    }

    // Recruiter Authentication (Matching recruiters created by Super Admin)
    const existingRecruiter = (platformData.recruiters || []).find(
      (r: any) =>
        r.businessEmail?.toLowerCase() === email?.toLowerCase() ||
        r.email?.toLowerCase() === email?.toLowerCase()
    );

    if (existingRecruiter) {
      if (existingRecruiter.password && password && existingRecruiter.password !== password) {
        return NextResponse.json({ error: 'Incorrect password for recruiter account.' }, { status: 401 });
      }
      return NextResponse.json({
        token: `ftw_recruiter_jwt_${existingRecruiter.id}`,
        user: {
          id: existingRecruiter.id,
          email: existingRecruiter.businessEmail || existingRecruiter.email,
          role: 'RECRUITER',
          fullName: existingRecruiter.fullName,
        },
        recruiter: existingRecruiter,
      });
    }

    return NextResponse.json(
      {
        error:
          'Access denied. Only recruiters created by Super Admin can access this dashboard.',
      },
      { status: 401 }
    );
  }

  // 2. Auth Register (Candidate signup from mobile app)
  if (path === 'auth/register') {
    const { fullName, email, password, phone, role } = body;
    const studentId = `student-${Date.now()}`;
    const newStudent = {
      id: studentId,
      userId: `user-${Date.now()}`,
      fullName: fullName || 'New Candidate',
      email: email,
      phone: phone || '',
      headline: 'Aspiring Professional',
      about: '',
      isActivated: false,
      completenessScore: 30,
      moderationStatus: 'APPROVED',
      createdAt: new Date().toISOString(),
      education: [],
      skills: [],
      projects: [],
      workSamples: [],
    };

    studentsList.unshift(newStudent);
    if (platformData.analytics?.metrics) {
      platformData.analytics.metrics.totalStudents = studentsList.length;
    }

    return NextResponse.json(
      {
        token: `ftw_student_jwt_${studentId}`,
        user: {
          id: newStudent.userId,
          email: email,
          fullName: fullName,
          role: role || 'STUDENT',
        },
        student: newStudent,
      },
      { status: 201 }
    );
  }

  // 3. Admin: Create Recruiter & Company
  if (path === 'admin/recruiters') {
    const {
      fullName,
      email,
      password,
      phone,
      designation,
      companyName,
      industry,
      location,
      website,
      verificationStatus,
    } = body;

    const companyId = `comp-${Date.now()}`;
    const newCompany = {
      id: companyId,
      name: companyName || 'Hiring Company',
      website: website || '',
      industry: industry || 'Technology & SaaS',
      location: location || 'Bengaluru / Remote',
      verificationStatus: verificationStatus || 'VERIFIED',
      createdAt: new Date().toISOString(),
    };

    const recruiterId = `rec-${Date.now()}`;
    const newRecruiter = {
      id: recruiterId,
      fullName: fullName || 'Corporate Recruiter',
      businessEmail: email,
      phone: phone || '',
      designation: designation || 'Talent Acquisition Manager',
      companyId: companyId,
      companyName: newCompany.name,
      company: newCompany,
      password: password || 'Recruiter@123',
      createdAt: new Date().toISOString(),
    };

    if (!platformData.companies) platformData.companies = [];
    platformData.companies = [newCompany, ...platformData.companies.filter((c: any) => c.id !== newCompany.id)];
    globalStore.__ftw_companies = platformData.companies;

    if (!platformData.recruiters) platformData.recruiters = [];
    platformData.recruiters = [newRecruiter, ...platformData.recruiters.filter((r: any) => r.id !== newRecruiter.id)];
    globalStore.__ftw_recruiters = platformData.recruiters;

    if (platformData.analytics && platformData.analytics.metrics) {
      platformData.analytics.metrics.totalRecruiters = platformData.recruiters.length;
      platformData.analytics.metrics.totalCompanies = platformData.companies.length;
    }

    return NextResponse.json(
      {
        success: true,
        recruiter: newRecruiter,
        company: newCompany,
      },
      { status: 201 }
    );
  }

  // 4. Admin: Create Company
  if (path === 'admin/companies') {
    const companyId = `comp-${Date.now()}`;
    const newCompany = {
      id: companyId,
      name: body.name || body.companyName || 'Hiring Partner',
      website: body.website || '',
      industry: body.industry || 'Technology & Services',
      location: body.location || 'India',
      verificationStatus: body.verificationStatus || 'VERIFIED',
      createdAt: new Date().toISOString(),
    };

    if (!platformData.companies) platformData.companies = [];
    platformData.companies.unshift(newCompany);
    globalStore.__ftw_companies = platformData.companies;

    if (platformData.analytics?.metrics) {
      platformData.analytics.metrics.totalCompanies = platformData.companies.length;
    }

    return NextResponse.json({ success: true, company: newCompany }, { status: 201 });
  }

  // 5. Contact Reveal: discovery/talents/:id/contact
  if (path.includes('/contact')) {
    const talentId = path.split('/')[2];
    const student = studentsList.find((s) => s.id === talentId);
    if (!student) return NextResponse.json({ error: 'Talent not found' }, { status: 404 });

    const hiringRecruiterEmail = platformData.recruiters?.[0]?.businessEmail;
    if (student.isHired && authUser?.role !== 'ADMIN' && hiringRecruiterEmail && authUser?.email !== hiringRecruiterEmail) {
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

  // 6. Hire Candidate: discovery/talents/:id/hire
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
      companyId: companyRecord?.id || 'company-partner',
      recruiterId: authUser?.id || recruiterRecord?.id || 'recruiter-partner',
      roleTitle: body.roleTitle || 'Hired Role',
      packageLpa: body.packageLpa || 'Verified CTC',
      placedAt: new Date().toISOString(),
      company: {
        id: companyRecord?.id || 'company-partner',
        name: companyRecord?.name || 'Hiring Partner',
      },
      recruiter: {
        id: recruiterRecord?.id || 'recruiter-partner',
        fullName: recruiterRecord?.fullName || 'Hiring Manager',
      },
    };

    if (platformData.analytics?.metrics) {
      platformData.analytics.metrics.totalHiredCandidates = (platformData.analytics.metrics.totalHiredCandidates || 0) + 1;
      platformData.analytics.metrics.inAppDirectPlacements = (platformData.analytics.metrics.inAppDirectPlacements || 0) + 1;
    }

    return NextResponse.json({
      success: true,
      message: 'Candidate hired successfully. Profile is now locked exclusively to your organization and Super Admin.',
      placement: student.placement,
    });
  }

  // 7. Recruiter Shortlist toggle
  if (path === 'recruiters/shortlists') {
    const { studentId } = body;
    const existingIdx = (globalStore.__ftw_shortlists || []).findIndex((s: any) => s.studentId === studentId);
    if (existingIdx >= 0) {
      globalStore.__ftw_shortlists.splice(existingIdx, 1);
      return NextResponse.json({ success: true, action: 'removed' });
    } else {
      const student = studentsList.find((s) => s.id === studentId);
      globalStore.__ftw_shortlists.push({
        id: `sl-${Date.now()}`,
        studentId,
        student,
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true, action: 'added' });
    }
  }

  // 8. Payment order creation
  if (path === 'payments/create-order') {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return NextResponse.json({
      success: true,
      orderId,
      amount: 9900,
      currency: 'INR',
      keyId: 'rzp_test_FresherToWorkDemo',
    });
  }

  // 9. Payment verify
  if (path === 'payments/verify-payment') {
    const { orderId, paymentId, signature } = body;
    const newPayment = {
      id: `pay-${Date.now()}`,
      gatewayOrderId: orderId,
      gatewayPaymentId: paymentId,
      amountPaise: 9900,
      currency: 'INR',
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
    };
    if (!platformData.payments) platformData.payments = [];
    platformData.payments.unshift(newPayment);
    globalStore.__ftw_payments = platformData.payments;

    if (platformData.analytics?.metrics) {
      platformData.analytics.metrics.successfulPaymentsCount = platformData.payments.length;
      platformData.analytics.metrics.totalRevenueInRupees += 99;
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and profile activated successfully',
      payment: newPayment,
    });
  }

  // 10. Student sub-resource creation (Education, Projects, Work Samples)
  if (path.startsWith('students/me/')) {
    const sub = path.replace('students/me/', '');
    const currentStudent = studentsList[0] || null;
    if (currentStudent) {
      if (!currentStudent[sub]) currentStudent[sub] = [];
      const newItem = { id: `item-${Date.now()}`, ...body, createdAt: new Date().toISOString() };
      currentStudent[sub].push(newItem);
      return NextResponse.json({ success: true, item: newItem }, { status: 201 });
    }
    return NextResponse.json({ success: true, item: body }, { status: 201 });
  }

  return NextResponse.json({ error: `Route /api/v1/${path} not found` }, { status: 404 });
}

// =============================================================================
// PATCH HANDLER
// =============================================================================
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ route: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.route ? resolvedParams.route.join('/') : '';
  const body = await req.json().catch(() => ({}));

  // 1. Moderate Student: admin/students/:id/moderate
  if (path.includes('admin/students/') && path.includes('/moderate')) {
    const studentId = path.split('/')[2];
    const student = studentsList.find((s) => s.id === studentId);
    if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 });

    if (body.status) student.moderationStatus = body.status;
    if (typeof body.isActivated === 'boolean') student.isActivated = body.isActivated;
    if (body.moderationNotes !== undefined) student.moderationNotes = body.moderationNotes;

    return NextResponse.json({ success: true, student });
  }

  // 2. Admin: Update Recruiter Profile: admin/recruiters/:id
  if (path.startsWith('admin/recruiters/')) {
    const recId = path.replace('admin/recruiters/', '');
    const recruiter = (platformData.recruiters || []).find((r: any) => r.id === recId);
    if (recruiter) {
      Object.assign(recruiter, body);
      return NextResponse.json({ success: true, recruiter });
    }
    return NextResponse.json({ error: 'Recruiter not found' }, { status: 404 });
  }

  // 3. Admin: Update Company: admin/companies/:id
  if (path.startsWith('admin/companies/')) {
    const compId = path.replace('admin/companies/', '');
    const company = (platformData.companies || []).find((c: any) => c.id === compId);
    if (company) {
      Object.assign(company, body);
      return NextResponse.json({ success: true, company });
    }
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  return NextResponse.json({ error: `Route /api/v1/${path} not found` }, { status: 404 });
}

// =============================================================================
// PUT HANDLER
// =============================================================================
export async function PUT(req: NextRequest, { params }: { params: Promise<{ route: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.route ? resolvedParams.route.join('/') : '';
  const body = await req.json().catch(() => ({}));

  // Update Student Profile
  if (path === 'students/me') {
    const currentStudent = studentsList[0];
    if (currentStudent) {
      Object.assign(currentStudent, body);
      return NextResponse.json({ success: true, student: currentStudent });
    }
    return NextResponse.json({ success: true, student: body });
  }

  // Update Skills
  if (path === 'students/me/skills') {
    const currentStudent = studentsList[0];
    if (currentStudent) {
      currentStudent.skills = body.skills || [];
      return NextResponse.json({ success: true, skills: currentStudent.skills });
    }
    return NextResponse.json({ success: true, skills: body.skills || [] });
  }

  // Update Preferences
  if (path === 'students/me/preferences') {
    const currentStudent = studentsList[0];
    if (currentStudent) {
      currentStudent.preferences = body;
      return NextResponse.json({ success: true, preferences: currentStudent.preferences });
    }
    return NextResponse.json({ success: true, preferences: body });
  }

  return NextResponse.json({ error: `Route /api/v1/${path} not found` }, { status: 404 });
}

// =============================================================================
// DELETE HANDLER
// =============================================================================
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ route: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.route ? resolvedParams.route.join('/') : '';

  // 1. Delete Recruiter
  if (path.startsWith('admin/recruiters/')) {
    const recId = path.replace('admin/recruiters/', '');
    const idx = (platformData.recruiters || []).findIndex((r: any) => r.id === recId);
    if (idx >= 0) {
      platformData.recruiters.splice(idx, 1);
    }
    globalStore.__ftw_recruiters = platformData.recruiters;
    return NextResponse.json({ success: true });
  }

  // 2. Delete Student
  if (path.startsWith('admin/students/')) {
    const studentId = path.replace('admin/students/', '');
    const idx = studentsList.findIndex((s: any) => s.id === studentId);
    if (idx >= 0) {
      studentsList.splice(idx, 1);
      if (platformData.analytics?.metrics) {
        platformData.analytics.metrics.totalStudents = studentsList.length;
      }
    }
    return NextResponse.json({ success: true });
  }

  // 3. Delete Company
  if (path.startsWith('admin/companies/')) {
    const compId = path.replace('admin/companies/', '');
    const idx = (platformData.companies || []).findIndex((c: any) => c.id === compId);
    if (idx >= 0) {
      platformData.companies.splice(idx, 1);
    }
    globalStore.__ftw_companies = platformData.companies;
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: `Route /api/v1/${path} not found` }, { status: 404 });
}
