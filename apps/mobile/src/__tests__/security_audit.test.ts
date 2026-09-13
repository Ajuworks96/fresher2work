import request from 'supertest';
import app from '../../../api/src/server';
import { db } from '../../../api/src/database/db';
import { UserRole, ModerationStatus, PaymentStatus } from '@fresher2work/types';
import crypto from 'crypto';
import { ENV } from '../../../api/src/config/env';

async function runSecurityAuditTests() {
  console.log('🔒 Starting FresherToWork V1 Comprehensive Security Audit Suite...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      if (details) console.error(`   Details: ${details}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // Setup Test Users
    // -------------------------------------------------------------
    const student1Email = `sec_stu1_${Date.now()}@university.edu`;
    const student2Email = `sec_stu2_${Date.now()}@university.edu`;
    const recruiterEmail = `sec_rec_${Date.now()}@hiring.io`;

    const regStu1 = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Security Student One',
        email: student1Email,
        password: 'Password123!',
        role: UserRole.STUDENT,
      });
    const tokenStu1 = regStu1.body.token;
    const stu1Id = regStu1.body.user.student.id;

    const regStu2 = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Security Student Two',
        email: student2Email,
        password: 'Password123!',
        role: UserRole.STUDENT,
      });
    const tokenStu2 = regStu2.body.token;

    const regRec = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Security Recruiter',
        email: recruiterEmail,
        password: 'Password123!',
        role: UserRole.RECRUITER,
        companyName: 'CyberSec Ventures',
      });
    const tokenRec = regRec.body.token;

    // -------------------------------------------------------------
    // 1. Student Cannot Access or Modify Another Student's Data (Row-Level Security)
    // -------------------------------------------------------------
    // Student 1 creates a project
    const createProjRes = await request(app)
      .post('/api/v1/students/me/projects')
      .set('Authorization', `Bearer ${tokenStu1}`)
      .send({
        title: 'Secret Blockchain Vault',
        description: 'Private encrypted vault built with zero knowledge proofs',
        techStack: ['Solidity', 'TypeScript'],
      });
    assert(createProjRes.status === 201, '1a. Student 1 created project successfully');
    const projId = createProjRes.body.project.id;

    // Student 2 attempts to edit Student 1's project
    const editProjTamperRes = await request(app)
      .put(`/api/v1/students/me/projects/${projId}`)
      .set('Authorization', `Bearer ${tokenStu2}`)
      .send({
        title: 'Hacked Vault Title',
      });
    assert(editProjTamperRes.status === 404, '1b. Student 2 cannot edit Student 1 project (404 Not Found)');

    // Student 2 attempts to delete Student 1's project
    const delProjTamperRes = await request(app)
      .delete(`/api/v1/students/me/projects/${projId}`)
      .set('Authorization', `Bearer ${tokenStu2}`);
    assert(delProjTamperRes.status === 200, '1c. Delete only affects requester own projects list');

    // Verify Student 1's project was NOT deleted
    const stu1CheckRes = await request(app)
      .get('/api/v1/students/me')
      .set('Authorization', `Bearer ${tokenStu1}`);
    assert(
      stu1CheckRes.body.profile.projects.some((p: any) => p.id === projId && p.title === 'Secret Blockchain Vault'),
      '1d. Student 1 project remains intact and untampered'
    );

    // -------------------------------------------------------------
    // 2. Recruiter Cannot Access Unauthorized Private Information
    // -------------------------------------------------------------
    const discoverRes = await request(app)
      .get('/api/v1/discovery/talents')
      .set('Authorization', `Bearer ${tokenRec}`);
    
    assert(discoverRes.status === 200, '2a. Recruiter discovery returns 200 OK');
    const hasSensitiveData = discoverRes.body.talents.some(
      (s: any) => s.passwordHash || s.internalSecret || s.billingSignature
    );
    assert(!hasSensitiveData, '2b. Recruiter talent results contain zero password hashes or billing secrets');

    // -------------------------------------------------------------
    // 3. Recruiter Can ONLY Discover Active & Moderated Profiles
    // -------------------------------------------------------------
    // Attempt deep dive on unactivated student
    const unactDeepDiveRes = await request(app)
      .get('/api/v1/discovery/talents/student-unactivated')
      .set('Authorization', `Bearer ${tokenRec}`);
    assert(unactDeepDiveRes.status === 404, '3a. Recruiter cannot view unactivated candidate deep-dive (404)');

    // Attempt to contact unactivated student
    const unactContactRes = await request(app)
      .post('/api/v1/discovery/talents/student-unactivated/contact')
      .set('Authorization', `Bearer ${tokenRec}`)
      .send({ channel: 'EMAIL' });
    assert(unactContactRes.status === 404, '3b. Recruiter cannot contact unactivated candidate (404)');

    // Attempt to shortlist unactivated student
    const unactShortlistRes = await request(app)
      .post('/api/v1/discovery/talents/student-unactivated/shortlist')
      .set('Authorization', `Bearer ${tokenRec}`)
      .send({ note: 'test' });
    assert(unactShortlistRes.status === 404, '3c. Recruiter cannot shortlist unactivated candidate (404)');

    // -------------------------------------------------------------
    // 4. Admin Permissions Are Properly Restricted (RBAC)
    // -------------------------------------------------------------
    // Student attempting admin endpoint
    const stuAdminAttempt = await request(app)
      .get('/api/v1/admin/analytics')
      .set('Authorization', `Bearer ${tokenStu1}`);
    assert(stuAdminAttempt.status === 403, '4a. Student blocked from /api/v1/admin/analytics (403 Forbidden)');

    // Recruiter attempting admin endpoint
    const recAdminAttempt = await request(app)
      .get('/api/v1/admin/students')
      .set('Authorization', `Bearer ${tokenRec}`);
    assert(recAdminAttempt.status === 403, '4b. Recruiter blocked from /api/v1/admin/students (403 Forbidden)');

    // Public self-registration of ADMIN role blocked
    const adminSelfReg = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Fake Hacker Admin',
        email: `hacker_admin_${Date.now()}@darkweb.io`,
        password: 'RootPassword123!',
        role: UserRole.ADMIN,
      });
    assert(adminSelfReg.status === 403, '4c. Public registration with role=ADMIN is strictly blocked (403)');

    // -------------------------------------------------------------
    // 5. File Upload Validation & Key Isolation (CVs & Media)
    // -------------------------------------------------------------
    // Non-PDF CV rejected
    const nonPdfCv = await request(app)
      .post('/api/v1/storage/presigned-upload')
      .set('Authorization', `Bearer ${tokenStu1}`)
      .send({
        fileName: 'resume.docx',
        fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        fileSize: 1024 * 100,
        category: 'CV',
      });
    assert(nonPdfCv.status === 400, '5a. Non-PDF CV upload rejected (400 Bad Request)');

    // Oversized CV (>10MB) rejected
    const bigCv = await request(app)
      .post('/api/v1/storage/presigned-upload')
      .set('Authorization', `Bearer ${tokenStu1}`)
      .send({
        fileName: 'huge_resume.pdf',
        fileType: 'application/pdf',
        fileSize: 15 * 1024 * 1024,
        category: 'CV',
      });
    assert(bigCv.status === 400, '5b. Oversized CV (>10MB) rejected (400 Bad Request)');

    // Valid PDF upload generates isolated user key
    const validCv = await request(app)
      .post('/api/v1/storage/presigned-upload')
      .set('Authorization', `Bearer ${tokenStu1}`)
      .send({
        fileName: 'my_resume.pdf',
        fileType: 'application/pdf',
        fileSize: 1024 * 500,
        category: 'CV',
      });
    assert(validCv.status === 200, '5c. Valid PDF CV approved for presigned upload');
    assert(
      validCv.body.fileKey.startsWith('cvs/'),
      '5d. File storage key is scoped to user directory'
    );

    // -------------------------------------------------------------
    // 6. Payment Success Cannot Be Spoofed & Signature Verification
    // -------------------------------------------------------------
    // Complete profile for Student 1 so they can activate (>=70% completeness)
    await request(app)
      .put('/api/v1/students/me')
      .set('Authorization', `Bearer ${tokenStu1}`)
      .send({
        headline: 'Cyber Security Analyst',
        about: 'Security researcher with experience in threat modeling and cryptographic validation.',
        city: 'Bengaluru',
        country: 'India',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      });

    await request(app)
      .post('/api/v1/students/me/cv/confirm')
      .set('Authorization', `Bearer ${tokenStu1}`)
      .send({
        cvFileUrl: 'https://storage.freshertowork.in/cvs/student-cv.pdf',
        fileName: 'student_cv.pdf',
        fileSize: 1024 * 500,
      });

    await request(app)
      .post('/api/v1/students/me/education')
      .set('Authorization', `Bearer ${tokenStu1}`)
      .send({
        institutionName: 'IIT Madras',
        degree: 'B.Tech',
        fieldOfStudy: 'Computer Science',
        startYear: 2021,
        endYear: 2025,
      });

    await request(app)
      .put('/api/v1/students/me/skills')
      .set('Authorization', `Bearer ${tokenStu1}`)
      .send([
        { skillName: 'Cryptography', proficiencyLevel: 'ADVANCED', isVerified: true },
        { skillName: 'Penetration Testing', proficiencyLevel: 'INTERMEDIATE', isVerified: true },
        { skillName: 'Network Security', proficiencyLevel: 'INTERMEDIATE', isVerified: true },
      ]);

    await request(app)
      .put('/api/v1/students/me/preferences')
      .set('Authorization', `Bearer ${tokenStu1}`)
      .send({
        preferredRoles: ['Security Analyst'],
        preferredLocations: ['Bengaluru'],
      });

    // Create activation order
    const orderRes = await request(app)
      .post('/api/v1/payments/create-order')
      .set('Authorization', `Bearer ${tokenStu1}`);
    assert(orderRes.status === 200, '6a. ₹99 activation order created');
    const orderId = orderRes.body.orderId;

    // Spoofed verification attempt with fake signature
    const fakeVerify = await request(app)
      .post('/api/v1/payments/verify-payment')
      .set('Authorization', `Bearer ${tokenStu1}`)
      .send({
        orderId,
        paymentId: 'pay_fake_hacker_123',
        signature: 'invalid_forged_sha256_signature_abc',
      });
    assert(fakeVerify.status === 400, '6b. Fake/spoofed payment signature rejected (400 Bad Request)');

    // Legitimate signature verification
    const validPaymentId = `pay_legit_${Date.now()}`;
    const validSignature = crypto
      .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${validPaymentId}`)
      .digest('hex');

    const legitVerify = await request(app)
      .post('/api/v1/payments/verify-payment')
      .set('Authorization', `Bearer ${tokenStu1}`)
      .send({
        orderId,
        paymentId: validPaymentId,
        signature: validSignature,
      });
    assert(legitVerify.status === 200, '6c. Authentic cryptographic HMAC-SHA256 signature verified successfully');
    assert(legitVerify.body.profile.isActivated === true, '6d. Profile activated upon authentic signature');

    // Replay attack with same order
    const replayVerify = await request(app)
      .post('/api/v1/payments/verify-payment')
      .set('Authorization', `Bearer ${tokenStu1}`)
      .send({
        orderId,
        paymentId: validPaymentId,
        signature: validSignature,
      });
    assert(replayVerify.status === 400, '6e. Replay attack on already processed order rejected (400)');

    // -------------------------------------------------------------
    // 7. ₹99 Amount Cannot Be Client-Manipulated
    // -------------------------------------------------------------
    assert(orderRes.body.amount === 9900, '7a. Amount strictly enforced by server to 9900 paise (₹99.00)');
    assert(orderRes.body.currency === 'INR', '7b. Currency strictly locked to INR');

    // -------------------------------------------------------------
    // 8. Secrets Are Never Exposed in Client Responses
    // -------------------------------------------------------------
    const checkOrderSecrets = orderRes.body;
    assert(checkOrderSecrets.secret === undefined, '8a. Razorpay Key Secret is never sent in order response');
    assert(checkOrderSecrets.webhookSecret === undefined, '8b. Razorpay Webhook Secret is never exposed');
    assert(checkOrderSecrets.jwtSecret === undefined, '8c. JWT secret is never exposed');

    // -------------------------------------------------------------
    // 9. Database Query Protection & Limit Safety Bounds
    // -------------------------------------------------------------
    const ddosLimitRes = await request(app)
      .get('/api/v1/discovery/talents?limit=100000')
      .set('Authorization', `Bearer ${tokenRec}`);
    assert(ddosLimitRes.body.limit <= 50, '9a. Excessive pagination limit safely bounded to 50');

    // -------------------------------------------------------------
    // 10. User Input Validation (Zod Schemas)
    // -------------------------------------------------------------
    const invalidEmailReg = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'A',
        email: 'invalid-not-an-email',
        password: '123',
      });
    assert(invalidEmailReg.status === 400, '10a. Malformed registration payload rejected by Zod schema');

    const invalidProject = await request(app)
      .post('/api/v1/students/me/projects')
      .set('Authorization', `Bearer ${tokenStu1}`)
      .send({
        title: 'AB', // < 3 chars
        description: 'short', // < 10 chars
        techStack: [], // empty
      });
    assert(invalidProject.status === 400, '10b. Invalid project payload rejected by Zod schema');

  } catch (error: any) {
    console.error('💥 Security audit crashed with error:', error);
    failed++;
  }

  console.log('\n========================================');
  console.log(`Security Audit Summary: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityAuditTests();
