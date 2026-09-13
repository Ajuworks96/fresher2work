import request from 'supertest';
import app from '../../../api/src/server';
import {
  UserRole,
  SkillLevel,
  WorkMode,
  AvailabilityOption,
  calculateCompleteness,
  StudentProfile,
} from '@fresher2work/types';

async function runStudentProfileModuleTests() {
  console.log('🧪 Starting FresherToWork Student Profile Module Test Suite...\n');

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
    // 1. Student Registration & Initial Profile
    // -------------------------------------------------------------
    const studentEmail = `profile_test_student_${Date.now()}@college.edu`;
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

    assert(regRes.status === 201 && regRes.body.token, '1. Student registered and received JWT token');
    const token = regRes.body.token;

    // -------------------------------------------------------------
    // 2. Fetch Initial Profile & Completeness
    // -------------------------------------------------------------
    const initialProfileRes = await request(app)
      .get('/api/v1/students/me')
      .set('Authorization', `Bearer ${token}`);

    assert(initialProfileRes.status === 200, '2. Fetched initial student profile from API');
    const { profile: initProf, completeness: initComp } = initialProfileRes.body;
    assert(initComp.score < 70, `Initial incomplete score (${initComp.score}%) is < 70%`);
    assert(initComp.canActivate === false, 'Cannot activate with incomplete profile');
    assert(initComp.missingSteps.length > 0, 'Missing actionable steps are generated dynamically');

    // -------------------------------------------------------------
    // 3. Edit Profile Basic Info (Photo, Headline, About, Links)
    // -------------------------------------------------------------
    const editRes = await request(app)
      .put('/api/v1/students/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        headline: 'Full-Stack Developer | React, TypeScript & Node.js',
        about: 'Computer Science student (2025) with a strong foundation in data structures and building full-stack applications.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        githubUrl: 'https://github.com/devika-dev',
        linkedinUrl: 'https://linkedin.com/in/devikakrishnan',
        portfolioUrl: 'https://devikakrishnan.me',
      });

    assert(editRes.status === 200, '3. Basic profile info updated (Name, Headline, About, Avatar, Links)');
    assert(editRes.body.profile.headline === 'Full-Stack Developer | React, TypeScript & Node.js', 'Headline saved');
    assert(editRes.body.profile.avatarUrl === 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', 'Avatar saved');

    // -------------------------------------------------------------
    // 4. Add Education
    // -------------------------------------------------------------
    const eduRes = await request(app)
      .post('/api/v1/students/me/education')
      .set('Authorization', `Bearer ${token}`)
      .send({
        institutionName: 'National Institute of Technology, Calicut',
        degree: 'B.Tech',
        fieldOfStudy: 'Computer Science & Engineering',
        startYear: 2021,
        endYear: 2025,
        gradeOrCgpa: '8.9 CGPA',
      });

    assert(eduRes.status === 201, '4. Education details added');
    assert(eduRes.body.education.institutionName === 'National Institute of Technology, Calicut', 'Institution saved');

    // -------------------------------------------------------------
    // 5. Add Skills with Proficiency Ratings
    // -------------------------------------------------------------
    const skillsRes = await request(app)
      .put('/api/v1/students/me/skills')
      .set('Authorization', `Bearer ${token}`)
      .send([
        { skillName: 'React', proficiencyLevel: SkillLevel.ADVANCED, isVerified: true },
        { skillName: 'TypeScript', proficiencyLevel: SkillLevel.ADVANCED, isVerified: true },
        { skillName: 'Node.js', proficiencyLevel: SkillLevel.INTERMEDIATE, isVerified: false },
        { skillName: 'PostgreSQL', proficiencyLevel: SkillLevel.INTERMEDIATE, isVerified: false },
      ]);

    assert(skillsRes.status === 200, '5. Skills added (4 skills with ratings)');
    assert(skillsRes.body.profile.skills.length === 4, '4 skills verified in profile');

    // -------------------------------------------------------------
    // 6. Add Proof of Work / Projects (2 Projects)
    // -------------------------------------------------------------
    const proj1Res = await request(app)
      .post('/api/v1/students/me/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TaskFlow — Real-Time Collaborative Kanban Board',
        description: 'Built a drag-and-drop workflow management tool with optimistic updates and live cursor presence.',
        techStack: ['React', 'TypeScript', 'TailwindCSS', 'WebSockets'],
        liveDemoUrl: 'https://taskflow-demo.vercel.app',
        githubRepoUrl: 'https://github.com/devika-dev/taskflow',
        mediaUrls: [],
      });
    assert(proj1Res.status === 201, '6a. Project 1 (TaskFlow) added to portfolio');

    const proj2Res = await request(app)
      .post('/api/v1/students/me/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'DocuSigner — Automated PDF Generation & Signing Suite',
        description: 'Node.js microservice for generating templated PDF reports with cryptographic signatures.',
        techStack: ['Node.js', 'Express', 'PDFKit', 'PostgreSQL'],
        liveDemoUrl: 'https://docusigner.dev',
        githubRepoUrl: 'https://github.com/devika-dev/docusigner',
        mediaUrls: [],
      });
    assert(proj2Res.status === 201, '6b. Project 2 (DocuSigner) added to portfolio');

    // -------------------------------------------------------------
    // 7. Add Certificates & Credentials
    // -------------------------------------------------------------
    const certRes = await request(app)
      .post('/api/v1/students/me/certificates')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'AWS Certified Cloud Practitioner',
        issuingOrganization: 'Amazon Web Services',
        issueDate: '2025',
        credentialUrl: 'https://aws.amazon.com/verify/cert-12345',
      });
    assert(certRes.status === 201, '7. Certificate added to profile');

    // -------------------------------------------------------------
    // 8. Confirm CV Document (PDF)
    // -------------------------------------------------------------
    const cvRes = await request(app)
      .post('/api/v1/students/me/cv/confirm')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cvFileUrl: 'https://assets.fresher2work.com/resumes/devika_krishnan_cv.pdf',
      });
    assert(cvRes.status === 200, '8. CV PDF confirmed & attached');

    // -------------------------------------------------------------
    // 9. Update Career Preferences & Locations
    // -------------------------------------------------------------
    const prefRes = await request(app)
      .put('/api/v1/students/me/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({
        preferredRoles: ['Full-Stack Developer', 'Frontend Engineer'],
        preferredLocations: ['Bengaluru', 'Kochi', 'Remote'],
        workMode: WorkMode.HYBRID,
        availability: AvailabilityOption.IMMEDIATE,
        expectedSalaryMin: 600000,
      });
    assert(prefRes.status === 200, '9. Career preferences and locations updated');

    // -------------------------------------------------------------
    // 10. Fetch Complete Profile & Verify 100% Dynamic Completeness
    // -------------------------------------------------------------
    const fullProfileRes = await request(app)
      .get('/api/v1/students/me')
      .set('Authorization', `Bearer ${token}`);

    assert(fullProfileRes.status === 200, '10. Fetched fully completed profile');
    const { profile: fullProf, completeness: fullComp } = fullProfileRes.body;

    // Verify all 15 profile sections
    assert(Boolean(fullProf.avatarUrl), 'Section 1: Profile photo');
    assert(Boolean(fullProf.fullName), 'Section 2: Name');
    assert(Boolean(fullProf.headline), 'Section 3: Professional headline');
    assert(Boolean(fullProf.about), 'Section 4: About summary');
    assert(fullProf.preferences.preferredLocations.length > 0, 'Section 5: Location preferences');
    assert(fullProf.education.length > 0, 'Section 6: Education');
    assert(fullProf.skills.length >= 3, 'Section 7: Skills (≥3)');
    assert(fullProf.certificates.length >= 1, 'Section 8: Certificates');
    assert(fullProf.projects.length >= 2, 'Section 9: Projects');
    assert(fullProf.projects.some((p: any) => p.liveDemoUrl && p.githubRepoUrl), 'Section 10: Work samples / links');
    assert(Boolean(fullProf.cvFileUrl), 'Section 11: CV PDF');
    assert(fullProf.preferences.preferredRoles.length > 0, 'Section 12: Preferred roles');
    assert(fullProf.preferences.preferredLocations.length > 0, 'Section 13: Preferred locations');
    assert(Boolean(fullProf.preferences.workMode), 'Section 14: Work mode');
    assert(Boolean(fullProf.preferences.availability), 'Section 15: Availability');

    assert(fullComp.score === 100, `Profile completeness score is 100% (Got: ${fullComp.score}%)`);
    assert(fullComp.canActivate === true, 'Profile marked as canActivate = true');
    assert(fullComp.missingSteps.length === 0, 'Zero missing steps for 100% complete profile');

    // -------------------------------------------------------------
    // 11. Public Profile Preview & PII Protection
    // -------------------------------------------------------------
    const slug = fullProf.publicSlug;
    const publicRes = await request(app).get(`/api/v1/students/p/${slug}`);
    assert(publicRes.status === 200, '11a. Public profile loaded via slug');
    assert(publicRes.body.profile.fullName === 'Devika Krishnan', 'Public profile returns candidate name');
    assert(publicRes.body.profile.phone === undefined, '11b. Sensitive Phone is masked in public preview');
    assert(publicRes.body.profile.email === undefined, '11c. Sensitive Email is masked in public preview');

    console.log(`\n========================================`);
    console.log(`Test Results: ${passed} passed, ${failed} failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test Execution Error:', err);
    process.exit(1);
  }
}

runStudentProfileModuleTests();
