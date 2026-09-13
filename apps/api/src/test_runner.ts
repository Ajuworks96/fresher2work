import request from 'supertest';
import app from './server';
import { UserRole } from '@fresher2work/types';

async function runApiVerification() {
  console.log('🧪 Starting FresherToWork API & Core Architecture Verification...\n');

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
    // 1. Health check
    const healthRes = await request(app).get('/health');
    assert(healthRes.status === 200 && healthRes.body.status === 'healthy', 'Health Check API returns healthy status');

    // 2. Student Registration
    const studentEmail = `student_${Date.now()}@test.com`;
    const regRes = await request(app).post('/api/v1/auth/register').send({
      fullName: 'Aarav Patel',
      email: studentEmail,
      phone: `+91 91${Math.floor(10000000 + Math.random() * 90000000)}`,
      password: 'SecurePassword123!',
      role: UserRole.STUDENT,
    });
    assert(regRes.status === 201 && regRes.body.token, 'Student registration succeeds with JWT token');
    const studentToken = regRes.body.token;

    // 3. Get Student Profile & Completeness
    const profRes = await request(app)
      .get('/api/v1/students/me')
      .set('Authorization', `Bearer ${studentToken}`);
    assert(profRes.status === 200 && profRes.body.profile.fullName === 'Aarav Patel', 'Student fetch profile returns correct name');
    assert(profRes.body.completeness.score < 70, 'Initial incomplete profile has score < 70%');

    // 4. Update Profile Basic Info
    const updateRes = await request(app)
      .put('/api/v1/students/me')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        headline: 'Frontend Engineer | React & Next.js',
        about: 'Enthusiastic web developer specializing in performant React UIs and modern TypeScript architectures.',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
        githubUrl: 'https://github.com/aaravpatel',
      });
    assert(updateRes.status === 200, 'Student profile update succeeds');

    // 5. Add Education
    const eduRes = await request(app)
      .post('/api/v1/students/me/education')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        institutionName: 'Indian Institute of Technology (IIT), Madras',
        degree: 'B.Tech',
        fieldOfStudy: 'Computer Science',
        startYear: 2021,
        endYear: 2025,
        gradeOrCgpa: '9.2 CGPA',
      });
    assert(eduRes.status === 201, 'Student education addition succeeds');

    // 6. Add Project (Proof of Work)
    const projRes = await request(app)
      .post('/api/v1/students/me/projects')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        title: 'DevPulse — Real-Time Developer Activity Dashboard',
        description: 'Engineered a dashboard aggregating GitHub commits, deployment webhooks, and team velocity metrics.',
        liveDemoUrl: 'https://devpulse-demo.vercel.app',
        githubRepoUrl: 'https://github.com/aaravpatel/devpulse',
        mediaUrls: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'],
        techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      });
    assert(projRes.status === 201 && projRes.body.project.title === 'DevPulse — Real-Time Developer Activity Dashboard', 'Project / Proof of Work creation succeeds');

    // 7. Add Skills
    const skillsRes = await request(app)
      .put('/api/v1/students/me/skills')
      .set('Authorization', `Bearer ${studentToken}`)
      .send([
        { skillName: 'React', proficiencyLevel: 'ADVANCED', isVerified: true },
        { skillName: 'TypeScript', proficiencyLevel: 'ADVANCED', isVerified: true },
        { skillName: 'Next.js', proficiencyLevel: 'INTERMEDIATE', isVerified: true },
        { skillName: 'Node.js', proficiencyLevel: 'INTERMEDIATE', isVerified: false },
      ]);
    assert(skillsRes.status === 200, 'Student skills update succeeds');

    // 8. Confirm CV Upload
    const cvRes = await request(app)
      .post('/api/v1/students/me/cv/confirm')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        cvFileUrl: 'https://assets.fresher2work.com/cvs/aarav_patel_cv.pdf',
      });
    assert(cvRes.status === 200, 'Student CV registration succeeds');

    // 9. Update Preferences
    const prefRes = await request(app)
      .put('/api/v1/students/me/preferences')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        preferredRoles: ['Frontend Developer', 'Software Engineer'],
        preferredLocations: ['Bengaluru', 'Hyderabad', 'Remote'],
        workMode: 'HYBRID',
        availability: 'IMMEDIATE',
        expectedSalaryMin: 600000,
      });
    assert(prefRes.status === 200 && prefRes.body.completeness.score >= 70, 'Preferences updated and profile reaches >= 70% completeness');

    // 10. Generate S3/R2 Presigned Upload URL
    const uploadRes = await request(app)
      .post('/api/v1/storage/presigned-upload')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        fileName: 'resume.pdf',
        fileType: 'application/pdf',
        fileSize: 1048576,
        category: 'CV',
      });
    assert(uploadRes.status === 200 && uploadRes.body.uploadUrl, 'S3/R2 presigned upload URL generated successfully');

    // 11. Create ₹99 Payment Order
    const orderRes = await request(app)
      .post('/api/v1/payments/create-order')
      .set('Authorization', `Bearer ${studentToken}`);
    assert(orderRes.status === 200 && orderRes.body.amount === 9900 && orderRes.body.currency === 'INR', '₹99 (9900 paise) activation order created');
    const orderId = orderRes.body.orderId;

    // 12. Verify Payment & Activate Student Profile
    const verifyPayRes = await request(app)
      .post('/api/v1/payments/verify-payment')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        orderId,
        paymentId: `pay_${Date.now()}`,
        signature: 'sig_mock_verified_signature_123',
      });
    assert(verifyPayRes.status === 200 && verifyPayRes.body.profile.isActivated === true, 'Payment verified and student profile is activated');

    // 13. Public Profile Share Link
    const studentSlug = verifyPayRes.body.profile.publicSlug;
    const publicRes = await request(app).get(`/api/v1/students/p/${studentSlug}`);
    assert(publicRes.status === 200 && publicRes.body.profile.fullName === 'Aarav Patel', 'Public shareable student profile URL accessible');
    assert(publicRes.body.profile.phone === undefined, 'Public profile masks sensitive PII phone number');

    // 14. Recruiter Login & Discovery Search
    let recLoginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'anjali.m@razorscale.io',
      password: 'password',
    });

    if (recLoginRes.status !== 200) {
      await request(app).post('/api/v1/auth/register').send({
        email: 'anjali.m@razorscale.io',
        password: 'password',
        role: 'RECRUITER',
        fullName: 'Anjali Menon',
      });
      recLoginRes = await request(app).post('/api/v1/auth/login').send({
        email: 'anjali.m@razorscale.io',
        password: 'password',
      });
    }
    const recruiterToken = recLoginRes.body.token;

    const talentSearchRes = await request(app)
      .get('/api/v1/discovery/talents?q=React&skills=React')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(talentSearchRes.status === 200 && talentSearchRes.body.talents && talentSearchRes.body.talents.length > 0, 'Recruiter faceted talent discovery search returns matching candidates');

    // 15. Shortlist Candidate
    const candidateId = talentSearchRes.body.talents[0].id;
    const shortlistRes = await request(app)
      .post(`/api/v1/discovery/talents/${candidateId}/shortlist`)
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({ note: 'Strong React & full-stack proof of work' });
    assert(shortlistRes.status === 200, 'Recruiter successfully shortlists candidate');

    // 16. Contact Candidate Reveal
    const contactRes = await request(app)
      .post(`/api/v1/discovery/talents/${candidateId}/contact`)
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({ channel: 'EMAIL' });
    assert(contactRes.status === 200 && contactRes.body.contactInfo.email, 'Recruiter contact intent logged and contact info revealed');

    // 17. Admin Analytics & Moderation
    let adminLoginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@freshertowork.com',
      password: 'Admin@FresherToWork2026!',
    });
    if (adminLoginRes.status !== 200) {
      adminLoginRes = await request(app).post('/api/v1/auth/login').send({
        email: 'admin@freshertowork.com',
        password: 'admin123',
      });
    }
    const adminToken = adminLoginRes.body.token;

    const analyticsRes = await request(app)
      .get('/api/v1/admin/analytics')
      .set('Authorization', `Bearer ${adminToken}`);
    assert(analyticsRes.status === 200 && analyticsRes.body.metrics, 'Admin analytics KPIs returned accurately');

    console.log(`\n🎉 Verification Complete: ${passed} passed, ${failed} failed.`);
    if (failed > 0) process.exit(1);
    process.exit(0);
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

runApiVerification();
