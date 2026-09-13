import request from 'supertest';
import app from '../../../api/src/server';
import { db } from '../../../api/src/database/db';
import {
  UserRole,
  SkillLevel,
  WorkMode,
  PaymentStatus,
} from '@fresher2work/types';

async function runHomeDashboardModuleTests() {
  console.log('🧪 Starting FresherToWork Student Home Dashboard Test Suite...\n');

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
    // Setup: Register a fresher student
    // -------------------------------------------------------------
    const studentEmail = `home_dash_${Date.now()}@university.edu`;
    const studentPhone = `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Ananya Nambiar',
        email: studentEmail,
        phone: studentPhone,
        password: 'Passcode2026!',
        role: UserRole.STUDENT,
      });

    assert(regRes.status === 201 && regRes.body.token, '1. Student account registered with JWT');
    const token = regRes.body.token;

    // -------------------------------------------------------------
    // 2. Initial Dashboard State (Incomplete Profile)
    // -------------------------------------------------------------
    const initialDashRes = await request(app)
      .get('/api/v1/students/me')
      .set('Authorization', `Bearer ${token}`);

    assert(initialDashRes.status === 200, '2a. GET /api/v1/students/me returns 200 OK');
    const initialProfile = initialDashRes.body.profile;
    const initialCompleteness = initialDashRes.body.completeness;

    assert(initialProfile.fullName === 'Ananya Nambiar', '2b. Personalized name available for greeting');
    assert(initialProfile.isActivated === false, '2c. Activation status is unactivated initially');
    assert(initialCompleteness.score < 70, '2d. Initial completeness score is low (<70%)');
    assert(
      Array.isArray(initialCompleteness.missingSteps) && initialCompleteness.missingSteps.length > 0,
      '2e. Dynamic profile completion suggestions are provided'
    );
    assert(
      (!initialProfile.projects || initialProfile.projects.length === 0) &&
      (!initialProfile.skills || initialProfile.skills.length === 0) &&
      (!initialProfile.cvFileUrl),
      '2f. Proof of work counters initially 0 (Clean empty states)'
    );

    // -------------------------------------------------------------
    // 3. Progressively Enrich Identity & Proof of Work
    // -------------------------------------------------------------
    console.log('--- Step 3a: Updating Bio & Photo...');
    const bioRes = await request(app)
      .put('/api/v1/students/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        headline: 'UI/UX Designer & Brand Strategist',
        about: 'Creating intuitive digital product experiences, design systems, and visual brand identities.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      });
    console.log('Bio status:', bioRes.status, bioRes.body?.error || 'OK');

    console.log('--- Step 3b: Adding Education...');
    const eduRes = await request(app)
      .post('/api/v1/students/me/education')
      .set('Authorization', `Bearer ${token}`)
      .send({
        institutionName: 'National Institute of Design (NID)',
        degree: 'B.Des',
        fieldOfStudy: 'Interaction Design',
        startYear: 2021,
        endYear: 2025,
      });
    console.log('Edu status:', eduRes.status, eduRes.body?.error || 'OK');

    console.log('--- Step 3c: Adding Skills...');
    const skillsRes = await request(app)
      .put('/api/v1/students/me/skills')
      .set('Authorization', `Bearer ${token}`)
      .send([
        { skillName: 'Figma', proficiencyLevel: SkillLevel.ADVANCED },
        { skillName: 'Design Systems', proficiencyLevel: SkillLevel.ADVANCED },
        { skillName: 'User Research', proficiencyLevel: SkillLevel.INTERMEDIATE },
        { skillName: 'Prototyping', proficiencyLevel: SkillLevel.ADVANCED },
      ]);
    console.log('Skills status:', skillsRes.status, skillsRes.body?.error || 'OK');

    console.log('--- Step 3d: Adding Projects & Work Samples...');
    const projRes = await request(app)
      .post('/api/v1/students/me/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'FinEase — Mobile Banking Redesign',
        description: 'Comprehensive design system and high-fidelity prototypes for inclusive mobile banking.',
        role: 'Lead UI/UX Designer',
        toolsUsed: ['Figma', 'Principle'],
        skillsDemonstrated: ['Information Architecture', 'Interaction Design'],
        techStack: ['Figma', 'Design Systems'],
      });
    console.log('Proj status:', projRes.status, projRes.body?.error || 'OK');

    const sampleRes = await request(app)
      .post('/api/v1/students/me/work-samples')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Brand Identity & Visual Guidelines for EcoBrew',
        category: 'BRANDING',
        description: 'Visual identity, iconography set, and packaging guidelines.',
        toolsUsed: ['Adobe Illustrator', 'Photoshop'],
        mediaUrls: ['https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800'],
      });
    console.log('Sample status:', sampleRes.status, sampleRes.body?.error || 'OK');

    console.log('--- Step 3e: Attaching CV...');
    const cvRes = await request(app)
      .post('/api/v1/students/me/cv/confirm')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cvFileUrl: 'https://storage.freshertowork.com/cv/ananya_cv.pdf',
        fileName: 'Ananya_Nambiar_CV.pdf',
        fileSize: 420000,
      });
    console.log('CV status:', cvRes.status, cvRes.body?.error || 'OK');

    console.log('--- Step 3f: Adding Certificate...');
    const certRes = await request(app)
      .post('/api/v1/students/me/certificates')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Google UX Design Professional Certificate',
        issuingOrganization: 'Coursera / Google',
        issueDate: '2025',
        credentialUrl: 'https://coursera.org/verify/google-ux/ananya',
      });
    console.log('Cert status:', certRes.status, certRes.body?.error || 'OK');

    console.log('--- Step 3g: Setting Career Preferences...');
    const prefRes = await request(app)
      .put('/api/v1/students/me/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({
        preferredRoles: ['UI/UX Designer', 'Product Designer'],
        preferredIndustries: ['Design & Creative Media', 'FinTech'],
        preferredLocations: ['Kochi', 'Bengaluru', 'Remote'],
        workModes: [WorkMode.REMOTE, WorkMode.HYBRID],
      });
    console.log('Pref status:', prefRes.status, prefRes.body?.error || 'OK');

    // -------------------------------------------------------------
    // 4. Fetch Enriched Dashboard State
    // -------------------------------------------------------------
    console.log('--- Step 4: Fetching Updated Profile...');
    const updatedDashRes = await request(app)
      .get('/api/v1/students/me')
      .set('Authorization', `Bearer ${token}`);

    assert(updatedDashRes.status === 200, '4a. Enriched dashboard data fetched');
    const updatedProfile = updatedDashRes.body.profile;
    const updatedCompleteness = updatedDashRes.body.completeness;

    assert(updatedProfile.headline === 'UI/UX Designer & Brand Strategist', '4b. Updated headline on dashboard');
    assert(updatedProfile.avatarUrl !== undefined, '4c. Profile avatar available for dashboard header');
    assert(updatedProfile.skills.length === 4, '4d. Skills count is 4');
    assert(updatedProfile.projects.length === 1, '4e. Projects count is 1');
    assert(updatedProfile.workSamples.length === 1, '4f. Work samples count is 1 (Total proof items: 2)');
    assert(updatedProfile.certificates.length === 1, '4g. Certificates count is 1');
    assert(updatedProfile.cvFileUrl !== undefined && updatedProfile.cvFileName === 'Ananya_Nambiar_CV.pdf', '4h. CV status is uploaded with filename');
    assert(updatedProfile.preferences.preferredRoles.length === 2, '4i. Preferred roles configured');
    assert(updatedCompleteness.score >= 90, '4j. Completeness score exceeds 90%');
    assert(updatedCompleteness.canActivate === true, '4k. Dashboard indicates profile is ready for ₹99 activation');

    // -------------------------------------------------------------
    // 5. Activate Profile (₹99 Verification)
    // -------------------------------------------------------------
    await db.updateStudent(updatedProfile.id, {
      isActivated: true,
      activatedAt: new Date().toISOString(),
    });

    const activeDashRes = await request(app)
      .get('/api/v1/students/me')
      .set('Authorization', `Bearer ${token}`);

    assert(activeDashRes.body.profile.isActivated === true, '5a. Dashboard reflects live active talent status');
    assert(
      activeDashRes.body.profile.publicSlug &&
      activeDashRes.body.profile.publicSlug.startsWith('ananya-nambiar'),
      '5b. Public slug available for share card (freshertowork.com/p/ananya-nambiar-...)'
    );

    // -------------------------------------------------------------
    // 6. Non-Job-Portal Scope Verification
    // Ensure zero job vacancy feeds, job listings, or apply endpoints exist
    // -------------------------------------------------------------
    const jobListingsRes = await request(app).get('/api/v1/jobs');
    assert(jobListingsRes.status === 404, '6a. /api/v1/jobs does not exist (Strictly NOT a job portal)');

    const jobApplyRes = await request(app).post('/api/v1/jobs/apply');
    assert(jobApplyRes.status === 404, '6b. /api/v1/jobs/apply does not exist (No job applications)');

    // -------------------------------------------------------------
    // Summary
    // -------------------------------------------------------------
    console.log(`\n========================================`);
    console.log(`Student Home Dashboard Test Summary: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Test execution error:', error);
    process.exit(1);
  }
}

runHomeDashboardModuleTests();
