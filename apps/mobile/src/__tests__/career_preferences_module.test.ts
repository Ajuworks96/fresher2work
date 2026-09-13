import request from 'supertest';
import app from '../../../api/src/server';
import { db } from '../../../api/src/database/db';
import {
  UserRole,
  WorkMode,
  RelocationPreference,
  AvailabilityOption,
  WorkType,
  StudentPreferences,
} from '@fresher2work/types';

async function runCareerPreferencesModuleTests() {
  console.log('🧪 Starting FresherToWork Student Career Preference System Test Suite...\n');

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
    // Setup: Register a dedicated test fresher student
    // -------------------------------------------------------------
    const studentName = `Aisha Rahman ${Date.now()}`;
    const studentEmail = `career_pref_${Date.now()}@university.edu`;
    const studentPhone = `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: studentName,
        email: studentEmail,
        phone: studentPhone,
        password: 'Passcode2026!',
        role: UserRole.STUDENT,
      });

    assert(regRes.status === 201 && regRes.body.token, '1. Student Account initialized with JWT token');
    const token = regRes.body.token;

    // -------------------------------------------------------------
    // 2. Fetch Initial Career Preferences
    // -------------------------------------------------------------
    const initialPrefRes = await request(app)
      .get('/api/v1/students/me/preferences')
      .set('Authorization', `Bearer ${token}`);

    assert(initialPrefRes.status === 200, '2a. GET /api/v1/students/me/preferences returns 200 OK');
    assert(initialPrefRes.body.preferences !== undefined, '2b. Initial preferences object returned');

    // -------------------------------------------------------------
    // 3. Update Multiple Target Job Roles
    // Examples: Digital Marketing Executive, Social Media Executive, SEO Executive, Graphic Designer, Content Creator
    // -------------------------------------------------------------
    const targetRoles = [
      'Digital Marketing Executive',
      'Social Media Executive',
      'SEO Executive',
      'Graphic Designer',
      'Content Creator',
    ];

    const rolesUpdateRes = await request(app)
      .put('/api/v1/students/me/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({
        preferredRoles: targetRoles,
      });

    assert(rolesUpdateRes.status === 200, '3a. PUT /me/preferences with multiple job roles returns 200 OK');
    assert(
      Array.isArray(rolesUpdateRes.body.preferences.preferredRoles) &&
      rolesUpdateRes.body.preferences.preferredRoles.length === 5,
      '3b. Multiple job roles stored as structured array (not single text string)'
    );
    assert(
      rolesUpdateRes.body.preferences.preferredRoles.includes('Digital Marketing Executive') &&
      rolesUpdateRes.body.preferences.preferredRoles.includes('Graphic Designer'),
      '3c. Structured roles contain expected job titles'
    );

    // -------------------------------------------------------------
    // 4. Update Target Industries / Categories
    // -------------------------------------------------------------
    const targetIndustries = [
      'Marketing & Advertising',
      'IT & Software',
      'Design & Creative Media',
      'E-Commerce',
      'FinTech',
    ];

    const indUpdateRes = await request(app)
      .put('/api/v1/students/me/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({
        preferredIndustries: targetIndustries,
      });

    assert(indUpdateRes.status === 200, '4a. PUT /me/preferences with multiple industries returns 200 OK');
    assert(
      Array.isArray(indUpdateRes.body.preferences.preferredIndustries) &&
      indUpdateRes.body.preferences.preferredIndustries.length === 5,
      '4b. Multiple industries stored as structured array'
    );
    assert(
      indUpdateRes.body.preferences.preferredIndustries.includes('Marketing & Advertising') &&
      indUpdateRes.body.preferences.preferredIndustries.includes('FinTech'),
      '4c. Structured industries contain expected sectors'
    );

    // -------------------------------------------------------------
    // 5. Update Locations and Countries
    // Locations: Kozhikode, Kochi, Bengaluru, Dubai, UAE, Remote, Anywhere
    // Countries: India, United Arab Emirates, Saudi Arabia
    // -------------------------------------------------------------
    const targetLocations = [
      'Kozhikode',
      'Kochi',
      'Bengaluru',
      'Dubai',
      'UAE',
      'Remote',
      'Anywhere',
    ];
    const targetCountries = [
      'India',
      'United Arab Emirates',
      'Saudi Arabia',
    ];

    const locUpdateRes = await request(app)
      .put('/api/v1/students/me/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({
        preferredLocations: targetLocations,
        preferredCountries: targetCountries,
      });

    assert(locUpdateRes.status === 200, '5a. PUT /me/preferences with multiple locations & countries returns 200 OK');
    assert(
      Array.isArray(locUpdateRes.body.preferences.preferredLocations) &&
      locUpdateRes.body.preferences.preferredLocations.length === 7,
      '5b. Locations stored as structured array including Kozhikode, Kochi, Bengaluru, Dubai, UAE, Remote, Anywhere'
    );
    assert(
      Array.isArray(locUpdateRes.body.preferences.preferredCountries) &&
      locUpdateRes.body.preferences.preferredCountries.length === 3,
      '5c. Countries stored as structured array (India, UAE, Saudi Arabia)'
    );

    // -------------------------------------------------------------
    // 6. Update Work Modes (Multi-Mode Selection: Remote, Hybrid, On-Site)
    // -------------------------------------------------------------
    const workModesUpdateRes = await request(app)
      .put('/api/v1/students/me/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({
        workModes: [WorkMode.REMOTE, WorkMode.HYBRID],
        workMode: WorkMode.HYBRID,
      });

    assert(workModesUpdateRes.status === 200, '6a. PUT /me/preferences with multi-select work modes returns 200 OK');
    assert(
      Array.isArray(workModesUpdateRes.body.preferences.workModes) &&
      workModesUpdateRes.body.preferences.workModes.includes(WorkMode.REMOTE) &&
      workModesUpdateRes.body.preferences.workModes.includes(WorkMode.HYBRID),
      '6b. Structured workModes contains both REMOTE and HYBRID preferences'
    );

    // -------------------------------------------------------------
    // 7. Update Relocation Willingness
    // -------------------------------------------------------------
    const relocUpdateRes = await request(app)
      .put('/api/v1/students/me/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({
        relocationWillingness: RelocationPreference.WILLING,
      });

    assert(relocUpdateRes.status === 200, '7a. PUT /me/preferences relocation preference WILLING returns 200 OK');
    assert(
      relocUpdateRes.body.preferences.relocationWillingness === RelocationPreference.WILLING,
      '7b. Relocation willingness stored as WILLING'
    );

    // Test DOMESTIC_ONLY and NOT_WILLING values
    const domesticRelocRes = await request(app)
      .put('/api/v1/students/me/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({
        relocationWillingness: RelocationPreference.DOMESTIC_ONLY,
      });
    assert(
      domesticRelocRes.body.preferences.relocationWillingness === RelocationPreference.DOMESTIC_ONLY,
      '7c. Relocation willingness updated to DOMESTIC_ONLY'
    );

    // -------------------------------------------------------------
    // 8. Update Availability (Immediate, Within 15 Days, Within 30 Days, Within 60 Days)
    // -------------------------------------------------------------
    const availRes1 = await request(app)
      .put('/api/v1/students/me/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({
        availability: AvailabilityOption.IMMEDIATE,
      });
    assert(
      availRes1.body.preferences.availability === AvailabilityOption.IMMEDIATE,
      '8a. Availability updated to IMMEDIATE'
    );

    const availRes2 = await request(app)
      .put('/api/v1/students/me/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({
        availability: AvailabilityOption.WITHIN_15_DAYS,
      });
    assert(
      availRes2.body.preferences.availability === AvailabilityOption.WITHIN_15_DAYS,
      '8b. Availability updated to WITHIN_15_DAYS'
    );

    // -------------------------------------------------------------
    // 9. Update Preferred Work Types (Full-Time, Internship, Contract, Part-Time, Freelance)
    // -------------------------------------------------------------
    const workTypesRes = await request(app)
      .put('/api/v1/students/me/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({
        preferredWorkTypes: [WorkType.FULL_TIME, WorkType.INTERNSHIP, WorkType.CONTRACT],
        expectedSalaryMin: 450000,
        salaryCurrency: 'INR',
      });

    assert(workTypesRes.status === 200, '9a. Preferred work types saved successfully');
    assert(
      Array.isArray(workTypesRes.body.preferences.preferredWorkTypes) &&
      workTypesRes.body.preferences.preferredWorkTypes.length === 3 &&
      workTypesRes.body.preferences.preferredWorkTypes.includes(WorkType.FULL_TIME) &&
      workTypesRes.body.preferences.preferredWorkTypes.includes(WorkType.INTERNSHIP),
      '9b. Structured preferredWorkTypes contains FULL_TIME, INTERNSHIP, CONTRACT'
    );
    assert(
      workTypesRes.body.preferences.expectedSalaryMin === 450000 &&
      workTypesRes.body.preferences.salaryCurrency === 'INR',
      '9c. Minimum salary expectation and currency structured properly'
    );

    // -------------------------------------------------------------
    // 10. Complete Multi-Attribute Preference Update Payload
    // -------------------------------------------------------------
    const fullPrefPayload: Partial<StudentPreferences> = {
      preferredRoles: [
        'Digital Marketing Executive',
        'Social Media Executive',
        'SEO Executive',
        'Graphic Designer',
        'Content Creator',
      ],
      preferredIndustries: [
        'Marketing & Advertising',
        'Design & Creative Media',
        'E-Commerce',
      ],
      preferredLocations: [
        'Kozhikode',
        'Kochi',
        'Bengaluru',
        'Dubai',
        'UAE',
        'Remote',
        'Anywhere',
      ],
      preferredCountries: ['India', 'United Arab Emirates'],
      workModes: [WorkMode.REMOTE, WorkMode.HYBRID],
      workMode: WorkMode.REMOTE,
      relocationWillingness: RelocationPreference.WILLING,
      availability: AvailabilityOption.IMMEDIATE,
      preferredWorkTypes: [WorkType.FULL_TIME, WorkType.INTERNSHIP],
      expectedSalaryMin: 360000,
      salaryCurrency: 'INR',
    };

    const fullSaveRes = await request(app)
      .put('/api/v1/students/me/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send(fullPrefPayload);

    assert(fullSaveRes.status === 200, '10a. Complete multi-attribute preference payload saved');
    assert(
      fullSaveRes.body.profile.preferences.preferredRoles.length === 5,
      '10b. Profile object in response has synchronized structured preferences'
    );

    // -------------------------------------------------------------
    // 11. Recruiter Talent Discovery Search Integration
    // Setup recruiter and search candidate using structured preferences
    // -------------------------------------------------------------
    const recruiterEmail = `recruiter_pref_${Date.now()}@growthagency.com`;
    const recPhone = `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const recRegRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Sarah Jenkins (Recruiter)',
        email: recruiterEmail,
        phone: recPhone,
        password: 'Passcode2026!',
        role: UserRole.RECRUITER,
      });
    const recruiterToken = recRegRes.body.token;

    // Activate candidate's profile for discovery search
    const myProfile = await request(app)
      .get('/api/v1/students/me')
      .set('Authorization', `Bearer ${token}`);
    await db.updateStudent(myProfile.body.profile.id, { isActivated: true });

    // 11a. Recruiter Search by Query: "Digital Marketing Executive"
    const searchByRoleRes = await request(app)
      .get('/api/v1/discovery/talents?q=Digital Marketing Executive&limit=50')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      searchByRoleRes.status === 200 &&
      searchByRoleRes.body.talents.some((t: any) => t.fullName === studentName),
      '11a. Recruiter discovered candidate searching for role "Digital Marketing Executive"'
    );

    // 11b. Recruiter Search by Role Filter: "SEO Executive"
    const searchBySeoRes = await request(app)
      .get('/api/v1/discovery/talents?roles=SEO Executive&limit=50')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      searchBySeoRes.status === 200 &&
      searchBySeoRes.body.talents.some((t: any) => t.fullName === studentName),
      '11b. Recruiter discovered candidate searching for role "SEO Executive"'
    );

    // 11c. Recruiter Search by Location: "Dubai"
    const searchByDubaiRes = await request(app)
      .get('/api/v1/discovery/talents?locations=Dubai&limit=50')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      searchByDubaiRes.status === 200 &&
      searchByDubaiRes.body.talents.some((t: any) => t.fullName === studentName),
      '11c. Recruiter discovered candidate filtering by location "Dubai"'
    );

    // 11d. Recruiter Search by Location: "Kozhikode"
    const searchByKozhikodeRes = await request(app)
      .get('/api/v1/discovery/talents?locations=Kozhikode&limit=50')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      searchByKozhikodeRes.status === 200 &&
      searchByKozhikodeRes.body.talents.some((t: any) => t.fullName === studentName),
      '11d. Recruiter discovered candidate filtering by location "Kozhikode"'
    );

    // 11e. Recruiter Search by Location: "Kochi"
    const searchByKochiRes = await request(app)
      .get('/api/v1/discovery/talents?locations=Kochi&limit=50')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      searchByKochiRes.status === 200 &&
      searchByKochiRes.body.talents.some((t: any) => t.fullName === studentName),
      '11e. Recruiter discovered candidate filtering by location "Kochi"'
    );

    // 11f. Recruiter Search by Work Mode: "REMOTE"
    const searchByRemoteModeRes = await request(app)
      .get('/api/v1/discovery/talents?workMode=REMOTE&limit=50')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      searchByRemoteModeRes.status === 200 &&
      searchByRemoteModeRes.body.talents.some((t: any) => t.fullName === studentName),
      '11f. Recruiter discovered candidate filtering by workMode "REMOTE"'
    );

    // 11g. Recruiter Search by Work Mode: "HYBRID"
    const searchByHybridModeRes = await request(app)
      .get('/api/v1/discovery/talents?workMode=HYBRID&limit=50')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      searchByHybridModeRes.status === 200 &&
      searchByHybridModeRes.body.talents.some((t: any) => t.fullName === studentName),
      '11g. Recruiter discovered candidate filtering by workMode "HYBRID"'
    );

    // 11h. Negative Filter Match: Unrelated role "Robotics Hardware Architect"
    const searchUnrelatedRes = await request(app)
      .get('/api/v1/discovery/talents?q=Robotics Hardware Architect&limit=50')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      searchUnrelatedRes.status === 200 &&
      !searchUnrelatedRes.body.talents.some((t: any) => t.fullName === studentName),
      '11h. Recruiter search for unrelated query correctly excludes candidate'
    );

    // -------------------------------------------------------------
    // Summary
    // -------------------------------------------------------------
    console.log(`\n========================================`);
    console.log(`Career Preferences Test Summary: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Test execution error:', error);
    process.exit(1);
  }
}

runCareerPreferencesModuleTests();
