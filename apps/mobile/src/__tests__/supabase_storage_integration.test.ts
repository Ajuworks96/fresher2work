import request from 'supertest';
import app from '../../../api/src/server';
import { db } from '../../../api/src/database/db';
import { supabaseStorage } from '../../../api/src/services/storage/supabaseStorage';
import {
  UserRole,
  SkillLevel,
  WorkMode,
  WorkSampleCategory,
} from '@fresher2work/types';

async function runSupabaseStorageTests() {
  console.log('🧪 Starting FresherToWork Real Supabase Storage Integration Test Suite...\n');

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
    // Setup: Create Student A, Student B, and a Recruiter
    // -------------------------------------------------------------
    const studentAEmail = `storage_stu_a_${Date.now()}@college.edu`;
    const studentAPhone = `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const regResA = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Abhinav Krishnan',
        email: studentAEmail,
        phone: studentAPhone,
        password: 'Passcode2026!',
        role: UserRole.STUDENT,
      });
    const tokenA = regResA.body.token;
    const userIdA = regResA.body.user.id;

    const studentBEmail = `storage_stu_b_${Date.now()}@college.edu`;
    const studentBPhone = `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const regResB = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Diya Menon',
        email: studentBEmail,
        phone: studentBPhone,
        password: 'Passcode2026!',
        role: UserRole.STUDENT,
      });
    const tokenB = regResB.body.token;
    const userIdB = regResB.body.user.id;

    const recruiterEmail = `storage_rec_${Date.now()}@hiring.com`;
    const recruiterPhone = `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const recRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Rahul Sharma',
        email: recruiterEmail,
        phone: recruiterPhone,
        password: 'Passcode2026!',
        role: UserRole.RECRUITER,
      });
    const recruiterToken = recRes.body.token;

    // -------------------------------------------------------------
    // 1. Valid CV Upload Presigning (PDF, DOC, DOCX)
    // -------------------------------------------------------------
    const validPdfCv = await request(app)
      .post('/api/v1/storage/presigned-upload')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        fileName: 'Abhinav_Krishnan_CV.pdf',
        fileType: 'application/pdf',
        fileSize: 1024 * 500, // 500KB
        category: 'CV',
      });

    assert(validPdfCv.status === 200, '1a. Valid PDF CV upload request approved (200 OK)');
    assert(typeof validPdfCv.body.uploadUrl === 'string' && validPdfCv.body.uploadUrl.length > 0, '1b. Signed upload URL generated');
    assert(validPdfCv.body.fileKey.startsWith(`cvs/${userIdA}/`), '1c. File key deterministically scoped to student ID');

    const validPdfCv2 = await request(app)
      .post('/api/v1/storage/presigned-upload')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        fileName: 'Abhinav_Updated_CV_2026.pdf',
        fileType: 'application/pdf',
        fileSize: 1024 * 300,
        category: 'CV',
      });
    assert(validPdfCv2.status === 200, '1d. Valid updated PDF CV upload request approved (200 OK)');

    // -------------------------------------------------------------
    // 2. Invalid CV Type & Dangerous Executable Rejection
    // -------------------------------------------------------------
    const invalidDocx = await request(app)
      .post('/api/v1/storage/presigned-upload')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        fileName: 'Resume_2026.docx',
        fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        fileSize: 1024 * 300,
        category: 'CV',
      });
    assert(invalidDocx.status === 400, '2a. Non-PDF (.docx) CV rejected with 400 Bad Request');

    const invalidExe = await request(app)
      .post('/api/v1/storage/presigned-upload')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        fileName: 'malicious_script.exe',
        fileType: 'application/x-msdownload',
        fileSize: 1024 * 100,
        category: 'CV',
      });
    assert(invalidExe.status === 400, '2b. Dangerous .exe file rejected with 400 Bad Request');

    const invalidSvg = await request(app)
      .post('/api/v1/storage/presigned-upload')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        fileName: 'vector_resume.svg',
        fileType: 'image/svg+xml',
        fileSize: 1024 * 50,
        category: 'CV',
      });
    assert(invalidSvg.status === 400, '2c. Potentially unsafe SVG rejected with 400 Bad Request');

    const invalidHtml = await request(app)
      .post('/api/v1/storage/presigned-upload')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        fileName: 'cv_page.html',
        fileType: 'text/html',
        fileSize: 1024 * 20,
        category: 'CV',
      });
    assert(invalidHtml.status === 400, '2d. HTML file upload rejected with 400 Bad Request');

    // -------------------------------------------------------------
    // 3. Oversized CV Rejection (>10MB)
    // -------------------------------------------------------------
    const bigCv = await request(app)
      .post('/api/v1/storage/presigned-upload')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        fileName: 'giant_cv.pdf',
        fileType: 'application/pdf',
        fileSize: 12 * 1024 * 1024, // 12MB
        category: 'CV',
      });
    assert(bigCv.status === 400, '3. Oversized CV (>10MB) rejected with 400 Bad Request');

    // -------------------------------------------------------------
    // 4. Unauthorized CV Upload (No Auth Token)
    // -------------------------------------------------------------
    const unauthUpload = await request(app)
      .post('/api/v1/storage/presigned-upload')
      .send({
        fileName: 'cv.pdf',
        fileType: 'application/pdf',
        fileSize: 1024 * 100,
        category: 'CV',
      });
    assert(unauthUpload.status === 401, '4. Unauthenticated presigned upload rejected (401 Unauthorized)');

    // -------------------------------------------------------------
    // 5. Work Sample Upload Validation (Images & PDFs ≤ 10MB)
    // -------------------------------------------------------------
    const validWorkSampleImage = await request(app)
      .post('/api/v1/storage/presigned-upload')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        fileName: 'dashboard_mockup.png',
        fileType: 'image/png',
        fileSize: 1024 * 800,
        category: 'WORK_SAMPLE',
      });
    assert(validWorkSampleImage.status === 200, '5a. Work sample PNG image upload approved');
    assert(validWorkSampleImage.body.fileKey.startsWith(`work_samples/${userIdA}/`), '5b. Work sample key scoped to student ID');

    const oversizedWorkSample = await request(app)
      .post('/api/v1/storage/presigned-upload')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        fileName: 'huge_portfolio.pdf',
        fileType: 'application/pdf',
        fileSize: 15 * 1024 * 1024,
        category: 'WORK_SAMPLE',
      });
    assert(oversizedWorkSample.status === 400, '5c. Oversized work sample (>10MB) rejected');

    // -------------------------------------------------------------
    // 6. CV Attachment, Metadata Persistence & Replacement
    // -------------------------------------------------------------
    const cvUrl1 = validPdfCv.body.publicUrl;
    const confirmCv1 = await request(app)
      .post('/api/v1/students/me/cv/confirm')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        cvFileUrl: cvUrl1,
        fileName: 'Abhinav_Krishnan_CV.pdf',
        fileSize: 1024 * 500,
      });

    assert(confirmCv1.status === 200, '6a. POST /me/cv/confirm registers CV in database');
    assert(confirmCv1.body.profile.cvFileUrl === cvUrl1, '6b. Stored CV URL matches uploaded document');
    assert(confirmCv1.body.profile.cvFileName === 'Abhinav_Krishnan_CV.pdf', '6c. CV original filename recorded');

    // Replace CV with new version
    const cvUrl2 = validPdfCv2.body.publicUrl;
    const confirmCv2 = await request(app)
      .post('/api/v1/students/me/cv/confirm')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        cvFileUrl: cvUrl2,
        fileName: 'Abhinav_Updated_CV_2026.pdf',
        fileSize: 1024 * 300,
      });

    assert(confirmCv2.status === 200, '6d. CV replaced successfully');
    assert(confirmCv2.body.profile.cvFileUrl === cvUrl2, '6e. Updated profile points to new CV URL');

    // Delete CV
    const deleteCv = await request(app)
      .delete('/api/v1/students/me/cv')
      .set('Authorization', `Bearer ${tokenA}`);
    assert(deleteCv.status === 200, '6f. DELETE /me/cv clears CV from profile');
    assert(deleteCv.body.profile.cvFileUrl === undefined, '6g. cvFileUrl cleared after deletion');

    // Re-attach CV1 for subsequent access control tests
    await request(app)
      .post('/api/v1/students/me/cv/confirm')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        cvFileUrl: cvUrl1,
        fileName: 'Abhinav_Krishnan_CV.pdf',
        fileSize: 1024 * 500,
      });

    // -------------------------------------------------------------
    // 7. Work Sample Creation, Modification & Ownership Isolation
    // -------------------------------------------------------------
    const createSampleRes = await request(app)
      .post('/api/v1/students/me/work-samples')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        title: 'FinTech App Design System',
        category: WorkSampleCategory.BRANDING,
        description: 'Comprehensive design system token architecture and interactive component kit.',
        mediaUrls: [validWorkSampleImage.body.publicUrl],
        toolsUsed: ['Figma', 'Storybook'],
      });

    assert(createSampleRes.status === 201, '7a. Work sample created with storage media URL');
    const sampleId = createSampleRes.body.workSample.id;

    // Student B attempts to edit Student A's work sample (Unauthorized IDOR)
    const crossEditRes = await request(app)
      .put(`/api/v1/students/me/work-samples/${sampleId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({
        title: 'Hacked Title Attempt',
      });
    // Should return 404 or profile without modifying Student A's work sample
    const studentAProfile = await request(app)
      .get('/api/v1/students/me')
      .set('Authorization', `Bearer ${tokenA}`);
    const sampleAfterAttempt = studentAProfile.body.profile.workSamples.find((w: any) => w.id === sampleId);
    assert(sampleAfterAttempt.title === 'FinTech App Design System', '7b. Cross-student work sample tampering prevented');

    // -------------------------------------------------------------
    // 8. Signed URL Generation & Authorization Rules
    // -------------------------------------------------------------
    const fileKeyA = validPdfCv.body.fileKey;

    // Student A generates signed URL for their own file
    const signedUrlOwner = await request(app)
      .get(`/api/v1/storage/signed-url?fileKey=${encodeURIComponent(fileKeyA)}`)
      .set('Authorization', `Bearer ${tokenA}`);
    assert(signedUrlOwner.status === 200, '8a. Student owner can generate signed URL for their own file');
    assert(typeof signedUrlOwner.body.signedUrl === 'string' && signedUrlOwner.body.signedUrl.length > 0, '8b. Signed URL generated');
    assert(signedUrlOwner.body.expiresInSeconds === 900, '8c. Signed URL has 15-minute expiration');

    // Student B attempts to get signed URL for Student A's private file
    const signedUrlStudentB = await request(app)
      .get(`/api/v1/storage/signed-url?fileKey=${encodeURIComponent(fileKeyA)}`)
      .set('Authorization', `Bearer ${tokenB}`);
    assert(signedUrlStudentB.status === 403, '8d. Student B blocked from accessing Student A private file (403 Forbidden)');

    // Recruiter attempts to access unactivated candidate file
    const unactivatedRecruiterAccess = await request(app)
      .get(`/api/v1/storage/signed-url?fileKey=${encodeURIComponent(fileKeyA)}`)
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(unactivatedRecruiterAccess.status === 404, '8e. Recruiter cannot access file of unactivated candidate (404 Not Found)');

    // Activate Student A profile
    await db.updateStudent(studentAProfile.body.profile.id, {
      isActivated: true,
      activatedAt: new Date().toISOString(),
    });

    // Recruiter requests signed URL for activated candidate file
    const activatedRecruiterAccess = await request(app)
      .get(`/api/v1/storage/signed-url?fileKey=${encodeURIComponent(fileKeyA)}`)
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(activatedRecruiterAccess.status === 200, '8f. Recruiter can generate signed URL for activated candidate file');
    assert(typeof activatedRecruiterAccess.body.signedUrl === 'string', '8g. Recruiter receives valid temporary signed URL');

    // -------------------------------------------------------------
    // 9. Path Traversal & Filename Sanitization Security
    // -------------------------------------------------------------
    const pathTraversalReq = await request(app)
      .get(`/api/v1/storage/signed-url?fileKey=${encodeURIComponent('../../etc/passwd')}`)
      .set('Authorization', `Bearer ${tokenA}`);
    assert(pathTraversalReq.status === 400, '9a. Path traversal attempt rejected with 400 Bad Request');

    const sanitizedName = supabaseStorage.sanitizeFileName('../../malicious..///file.pdf');
    assert(!sanitizedName.includes('..') && !sanitizedName.includes('/'), '9b. Filename sanitized without directory traversal');

    // -------------------------------------------------------------
    // Summary
    // -------------------------------------------------------------
    console.log(`\n========================================`);
    console.log(`Supabase Storage Integration Test Summary: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Test suite crashed with error:', error);
    process.exit(1);
  }
}

runSupabaseStorageTests();
