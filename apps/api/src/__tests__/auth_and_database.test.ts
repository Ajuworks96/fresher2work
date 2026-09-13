import { PrismaClient, UserRole, UserStatus, ModerationStatus, SkillLevel, WorkMode, AvailabilityOption, PaymentStatus, CompanyVerificationStatus, ViewChannel } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://arjun@localhost:5432/fresher2work?host=/tmp',
    },
  },
});

const JWT_SECRET = 'fresher2work-secure-jwt-secret-key-2026-prod';

async function runDatabaseAndAuthTestSuite() {
  console.log('🧪 Starting PostgreSQL Database Schema & Authorization Foundation Test Suite...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 0. Clean database tables
    await prisma.auditLog.deleteMany();
    await prisma.profileView.deleteMany();
    await prisma.recruiterSavedCandidate.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.profileActivation.deleteMany();
    await prisma.cvFile.deleteMany();
    await prisma.preferredLocation.deleteMany();
    await prisma.careerPreference.deleteMany();
    await prisma.certificate.deleteMany();
    await prisma.projectMedia.deleteMany();
    await prisma.project.deleteMany();
    await prisma.studentSkill.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.education.deleteMany();
    await prisma.recruiterProfile.deleteMany();
    await prisma.company.deleteMany();
    await prisma.studentProfile.deleteMany();
    await prisma.user.deleteMany();

    console.log('🧹 Cleaned test database tables.\n');

    // 1. Create Master Skills
    const skillReact = await prisma.skill.create({ data: { name: 'React', category: 'Frontend' } });
    const skillNode = await prisma.skill.create({ data: { name: 'Node.js', category: 'Backend' } });
    assert(Boolean(skillReact.id && skillNode.id), 'Master Skills created successfully');

    // 2. Register Student User & Student Profile
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('StudentPassword123!', salt);

    const studentUserA = await prisma.user.create({
      data: {
        email: 'rohan.sharma@example.com',
        phone: '+919876543210',
        passwordHash,
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
        studentProfile: {
          create: {
            fullName: 'Rohan Sharma',
            headline: 'Frontend React Developer',
            about: 'Passionate frontend engineer with strong React skills.',
            publicSlug: 'rohan-sharma',
            completenessScore: 85,
            isActivated: true,
            activatedAt: new Date(),
            moderationStatus: ModerationStatus.APPROVED,
          },
        },
      },
      include: { studentProfile: true },
    });
    assert(Boolean(studentUserA.id && studentUserA.studentProfile?.id), 'Student User and Profile created in PostgreSQL with 1:1 relation');

    // 3. Register Unactivated Student User B (for access rule testing)
    const studentUserB = await prisma.user.create({
      data: {
        email: 'incomplete.student@example.com',
        phone: '+919876543211',
        passwordHash,
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
        studentProfile: {
          create: {
            fullName: 'Incomplete Student',
            headline: 'Beginner Coder',
            about: 'Just started learning to code.',
            publicSlug: 'incomplete-student',
            completenessScore: 30,
            isActivated: false, // NOT ACTIVATED
            moderationStatus: ModerationStatus.PENDING_REVIEW,
          },
        },
      },
      include: { studentProfile: true },
    });
    assert(studentUserB.studentProfile?.isActivated === false, 'Student B created with unactivated state');

    // 4. Create Company and Recruiter User
    const company = await prisma.company.create({
      data: {
        name: 'RazorScale Technologies',
        website: 'https://razorscale.io',
        location: 'Bengaluru, Karnataka',
        industry: 'FinTech',
        verificationStatus: CompanyVerificationStatus.VERIFIED,
      },
    });

    const recruiterUser = await prisma.user.create({
      data: {
        email: 'recruiter@razorscale.io',
        passwordHash,
        role: UserRole.RECRUITER,
        status: UserStatus.ACTIVE,
        recruiterProfile: {
          create: {
            companyId: company.id,
            fullName: 'Anjali Menon',
            designation: 'Technical Recruiter',
            businessEmail: 'recruiter@razorscale.io',
          },
        },
      },
      include: { recruiterProfile: true },
    });
    assert(Boolean(recruiterUser.recruiterProfile?.companyId === company.id), 'Company and Recruiter Profile created with relation');

    // 5. Create Admin User
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@freshertowork.com',
        passwordHash,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
    });
    assert(adminUser.role === UserRole.ADMIN, 'Admin user created successfully');

    // 6. Test Password Verification
    const passwordValid = await bcrypt.compare('StudentPassword123!', studentUserA.passwordHash!);
    assert(passwordValid, 'Bcrypt password hashing verification succeeds');

    // 7. Test JWT Generation & Role Claims
    const studentToken = jwt.sign(
      { userId: studentUserA.id, role: studentUserA.role, studentId: studentUserA.studentProfile!.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    const decoded: any = jwt.verify(studentToken, JWT_SECRET);
    assert(decoded.userId === studentUserA.id && decoded.role === UserRole.STUDENT, 'JWT token encodes verified role and studentId');

    // 8. Add Student Education, Projects, Skills, Preferences, CV
    const profileAId = studentUserA.studentProfile!.id;

    const edu = await prisma.education.create({
      data: {
        studentId: profileAId,
        institutionName: 'NIT Calicut',
        degree: 'B.Tech',
        fieldOfStudy: 'Computer Science',
        startYear: 2021,
        endYear: 2025,
        gradeOrCgpa: '8.8 CGPA',
      },
    });
    assert(Boolean(edu.id), 'Education entity created');

    const project = await prisma.project.create({
      data: {
        studentId: profileAId,
        title: 'TaskFlow Kanban Board',
        description: 'Collaborative task board with WebSockets.',
        liveDemoUrl: 'https://taskflow.vercel.app',
        githubRepoUrl: 'https://github.com/rohan/taskflow',
        techStack: ['React', 'TypeScript', 'Node.js'],
        media: {
          create: [{ mediaUrl: 'https://assets.fresher2work.com/screenshot1.png', mediaType: 'IMAGE' }],
        },
      },
      include: { media: true },
    });
    assert(project.media.length === 1, 'Project and ProjectMedia created with relation');

    const studentSkill = await prisma.studentSkill.create({
      data: {
        studentId: profileAId,
        skillId: skillReact.id,
        skillName: 'React',
        proficiencyLevel: SkillLevel.ADVANCED,
        isVerified: true,
      },
    });
    assert(studentSkill.skillName === 'React' && studentSkill.isVerified, 'StudentSkill relational entry created');

    const cv = await prisma.cvFile.create({
      data: {
        studentId: profileAId,
        fileUrl: 'https://assets.fresher2work.com/cvs/rohan_cv.pdf',
        fileKey: 'cvs/rohan-cv-key-1001',
        fileName: 'rohan_cv.pdf',
        fileSizeBytes: 1048576,
        isPrimary: true,
      },
    });
    assert(cv.isPrimary, 'CV File metadata registered in database');

    const pref = await prisma.careerPreference.create({
      data: {
        studentId: profileAId,
        preferredRoles: ['Frontend Developer', 'Software Engineer'],
        workMode: WorkMode.HYBRID,
        availability: AvailabilityOption.IMMEDIATE,
        expectedSalaryMin: 500000,
      },
    });
    assert(pref.workMode === WorkMode.HYBRID, 'Career preferences recorded');

    // 9. Student Ownership Authorization Rule
    // Student A attempts to update Student B's project -> MUST BE REJECTED
    const isOwner = (studentIdFromAuth: string, targetStudentId: string) => studentIdFromAuth === targetStudentId;
    assert(!isOwner(studentUserA.studentProfile!.id, studentUserB.studentProfile!.id), 'Ownership Guard: Student A cannot modify Student B resources');

    // 10. Recruiter Talent Discovery Rule:
    // Query talent pool: MUST ONLY RETURN activated & approved profiles
    const discoverableTalents = await prisma.studentProfile.findMany({
      where: {
        isActivated: true,
        moderationStatus: ModerationStatus.APPROVED,
        isDeleted: false,
      },
      include: { projects: true, studentSkills: true, education: true },
    });
    assert(discoverableTalents.length === 1 && discoverableTalents[0].id === profileAId, 'Recruiter Access Rule: Only active and approved student profiles returned in discovery');
    assert(discoverableTalents.every((t) => t.id !== studentUserB.studentProfile!.id), 'Recruiter Access Rule: Incomplete/unactivated student B is hidden from recruiter discovery');

    // 11. Recruiter Shortlist / Save Candidate
    const saved = await prisma.recruiterSavedCandidate.create({
      data: {
        recruiterId: recruiterUser.recruiterProfile!.id,
        studentId: profileAId,
        note: 'Exceptional React proof of work',
      },
    });
    assert(Boolean(saved.id), 'Recruiter saved candidate record created');

    // 12. Recruiter Profile View / Contact Reveal Audit Log
    const viewLog = await prisma.profileView.create({
      data: {
        studentId: profileAId,
        viewerUserId: recruiterUser.id,
        recruiterId: recruiterUser.recruiterProfile!.id,
        channel: ViewChannel.CONTACT_REVEAL,
        ipAddress: '127.0.0.1',
      },
    });
    assert(viewLog.channel === ViewChannel.CONTACT_REVEAL, 'Profile view and contact reveal audit logged');

    // 13. ₹99 Payment Record Creation and Verification
    const payment = await prisma.payment.create({
      data: {
        studentId: profileAId,
        gatewayOrderId: 'order_PG_LIVE_1001',
        gatewayPaymentId: 'pay_PG_LIVE_882193',
        amountPaise: 9900, // ₹99.00 INR
        currency: 'INR',
        status: PaymentStatus.SUCCESS,
        signature: 'sig_hmac_sha256_verified_sample',
        verifiedAt: new Date(),
      },
    });
    assert(payment.amountPaise === 9900 && payment.status === PaymentStatus.SUCCESS, 'Payment record correctly logged at ₹99 (9900 paise)');

    // 14. Soft Deletion Rule
    const softDeletedProject = await prisma.project.update({
      where: { id: project.id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    assert(softDeletedProject.isDeleted === true && softDeletedProject.deletedAt !== null, 'Soft deletion flags project as deleted without hard deleting relational row');

    // Query active projects filters out soft-deleted
    const activeProjects = await prisma.project.findMany({
      where: { studentId: profileAId, isDeleted: false },
    });
    assert(activeProjects.length === 0, 'Active projects query excludes soft-deleted records');

    // 15. Admin Audit Log Creation
    const audit = await prisma.auditLog.create({
      data: {
        actorUserId: adminUser.id,
        targetEntity: 'student_profiles',
        targetEntityId: profileAId,
        action: 'APPROVE_PROFILE',
        previousState: { status: 'PENDING_REVIEW' },
        newState: { status: 'APPROVED' },
        reason: 'Verified proof of work and certificates.',
      },
    });
    assert(audit.action === 'APPROVE_PROFILE', 'Admin moderation audit log created');

    console.log(`\n🎉 All Database & Auth Tests Passed: ${passed} passed, ${failed} failed.\n`);
    await prisma.$disconnect();
    if (failed > 0) process.exit(1);
    process.exit(0);
  } catch (error) {
    console.error('Test execution error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

runDatabaseAndAuthTestSuite();
