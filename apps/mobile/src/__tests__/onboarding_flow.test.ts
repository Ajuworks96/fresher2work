import request from 'supertest';
import app from '../../../api/src/server';
import { UserRole, SkillLevel, WorkMode, AvailabilityOption } from '@fresher2work/types';

async function testStudentOnboardingFlow() {
  console.log('🧪 Starting Student Mobile App Onboarding Flow Automated Verification...\n');

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
    // -------------------------------------------------------------
    // Step 1: Welcome & Account Registration
    // -------------------------------------------------------------
    const studentEmail = `onboarding_student_${Date.now()}@college.edu`;
    const studentPhone = `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Devika Krishnan',
        email: studentEmail,
        phone: studentPhone,
        password: 'Passcode2026!',
        role: UserRole.STUDENT,
      });
    assert(regRes.status === 201 && regRes.body.token, 'Step 1 & 2: Student Account created with auth token');
    const token = regRes.body.token;

    // -------------------------------------------------------------
    // Step 3: Basic Information (Headline & Bio)
    // -------------------------------------------------------------
    const basicRes = await request(app)
      .put('/api/v1/students/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        headline: 'Aspiring Full Stack Engineer | React & Node.js Enthusiast',
        about: 'Computer science fresher with hands-on experience building web applications, APIs, and responsive frontends.',
        githubUrl: 'https://github.com/devika-krishnan',
        linkedinUrl: 'https://linkedin.com/in/devika-krishnan',
        portfolioUrl: 'https://devika.dev',
      });
    assert(basicRes.status === 200 && basicRes.body.profile.headline.includes('Aspiring Full Stack'), 'Step 3: Basic info (Headline, Bio, Links) saved to backend');

    // -------------------------------------------------------------
    // Step 4: Profile Photo
    // -------------------------------------------------------------
    const avatarRes = await request(app)
      .put('/api/v1/students/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      });
    assert(avatarRes.status === 200 && avatarRes.body.profile.avatarUrl, 'Step 4: Profile photo URL saved');

    // -------------------------------------------------------------
    // Step 5: Education
    // -------------------------------------------------------------
    const eduRes = await request(app)
      .post('/api/v1/students/me/education')
      .set('Authorization', `Bearer ${token}`)
      .send({
        institutionName: 'Model Engineering College, Kochi',
        degree: 'B.Tech',
        fieldOfStudy: 'Computer Science & Engineering',
        startYear: 2021,
        endYear: 2025,
        gradeOrCgpa: '8.9 CGPA',
      });
    assert(eduRes.status === 201 && eduRes.body.education.institutionName === 'Model Engineering College, Kochi', 'Step 5: Education details saved to database');

    // -------------------------------------------------------------
    // Step 6: Skills & Proficiency Levels
    // -------------------------------------------------------------
    const skillsRes = await request(app)
      .put('/api/v1/students/me/skills')
      .set('Authorization', `Bearer ${token}`)
      .send([
        { skillName: 'React', proficiencyLevel: SkillLevel.ADVANCED, isVerified: false },
        { skillName: 'JavaScript', proficiencyLevel: SkillLevel.ADVANCED, isVerified: false },
        { skillName: 'Node.js', proficiencyLevel: SkillLevel.INTERMEDIATE, isVerified: false },
        { skillName: 'Python', proficiencyLevel: SkillLevel.BEGINNER, isVerified: false },
      ]);
    assert(skillsRes.status === 200 && skillsRes.body.profile.skills.length === 4, 'Step 6: Skills array with proficiency ratings saved');

    // -------------------------------------------------------------
    // Step 7, 8, 9: Career Preferences, Roles, Locations, Mode & Availability
    // -------------------------------------------------------------
    const prefRes = await request(app)
      .put('/api/v1/students/me/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({
        preferredRoles: ['Frontend Developer', 'Full Stack Developer', 'Software Engineer'],
        preferredLocations: ['Bengaluru', 'Kochi', 'Remote (All India)'],
        workMode: WorkMode.HYBRID,
        availability: AvailabilityOption.IMMEDIATE,
        expectedSalaryMin: 450000,
      });
    assert(prefRes.status === 200 && prefRes.body.profile.preferences.workMode === WorkMode.HYBRID, 'Steps 7-9: Preferred roles, locations, work mode and availability saved');

    // -------------------------------------------------------------
    // Step 10: Profile Review & Completeness Score
    // -------------------------------------------------------------
    const reviewRes = await request(app)
      .get('/api/v1/students/me')
      .set('Authorization', `Bearer ${token}`);
    assert(reviewRes.status === 200, 'Step 10: Profile review fetch succeeded');
    assert(reviewRes.body.completeness.score >= 65, `Step 10: Onboarding profile completeness score reached ${reviewRes.body.completeness.score}%`);
    assert(reviewRes.body.profile.fullName === 'Devika Krishnan', 'Step 10: Candidate full name confirmed in final profile review');

    console.log(`\n🎉 Onboarding Flow Verification Complete: ${passed} passed, ${failed} failed.\n`);
    if (failed > 0) process.exit(1);
    process.exit(0);
  } catch (error) {
    console.error('Onboarding test failed:', error);
    process.exit(1);
  }
}

testStudentOnboardingFlow();
