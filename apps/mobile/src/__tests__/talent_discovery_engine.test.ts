import request from 'supertest';
import app from '../../../api/src/server';
import { db } from '../../../api/src/database/db';
import {
  UserRole,
  WorkMode,
  AvailabilityOption,
  ModerationStatus,
  SkillLevel,
} from '@fresher2work/types';

async function runTalentDiscoveryEngineTests() {
  console.log('🧪 Starting FresherToWork Talent Discovery Engine Test Suite...\n');

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
    // Setup: Recruiter Authentication
    // -------------------------------------------------------------
    const recruiterLoginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'anjali.m@razorscale.io',
        password: 'password',
      });

    assert(recruiterLoginRes.status === 200, '1a. Recruiter login successful');
    assert(Boolean(recruiterLoginRes.body.token), '1b. Recruiter JWT token generated');
    const recruiterToken = recruiterLoginRes.body.token;

    // -------------------------------------------------------------
    // 2. Discovery Access Rules & Privacy
    // -------------------------------------------------------------
    const allTalentsRes = await request(app)
      .get('/api/v1/discovery/talents')
      .set('Authorization', `Bearer ${recruiterToken}`);

    if (allTalentsRes.status !== 200) {
      console.error('DEBUG allTalentsRes error:', allTalentsRes.status, allTalentsRes.body);
    }

    assert(allTalentsRes.status === 200, '2a. GET /api/v1/discovery/talents returns 200 OK');
    assert(Boolean(allTalentsRes.body.talents && allTalentsRes.body.talents.length > 0), '2b. Active talent pool populated');
    
    // Check that unactivated student is NOT discoverable
    const unactivatedFound = allTalentsRes.body.talents.some((s: any) => s.id === 'student-unactivated' || !s.isActivated);
    assert(!unactivatedFound, '2c. Unactivated profiles (unpaid) are strictly excluded from talent discovery');

    // Check that pending moderation student is NOT discoverable
    const pendingFound = allTalentsRes.body.talents.some((s: any) => s.id === 'student-pending-moderation' || s.moderationStatus !== ModerationStatus.APPROVED);
    assert(!pendingFound, '2d. Unapproved / pending moderation profiles are excluded from discovery');

    // Verify no password hashes or internal secrets are exposed
    const leakedSecrets = allTalentsRes.body.talents.some((s: any) => s.passwordHash || s.internalSecret);
    assert(!leakedSecrets, '2e. No sensitive private data (passwords, billing keys) exposed');

    // -------------------------------------------------------------
    // 3. Multi-Field Search Strategy
    // -------------------------------------------------------------
    // 3a. Search by Name
    const searchNameRes = await request(app)
      .get('/api/v1/discovery/talents?q=Rohan')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      searchNameRes.body.talents.length > 0 && searchNameRes.body.talents.every((s: any) => s.fullName.toLowerCase().includes('rohan')),
      '3a. Search by Candidate Name matches correctly ("Rohan")'
    );

    // 3b. Search by Skill
    const searchSkillRes = await request(app)
      .get('/api/v1/discovery/talents?q=Flutter')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      searchSkillRes.body.talents.some((s: any) => s.skills.some((sk: any) => sk.skillName === 'Flutter')),
      '3b. Search by Skill keyword matches correctly ("Flutter")'
    );

    // 3c. Search by Preferred Role
    const searchRoleRes = await request(app)
      .get('/api/v1/discovery/talents?q=AI%20Engineer')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      searchRoleRes.body.talents.some((s: any) => s.fullName === 'Pooja Nair'),
      '3c. Search by Preferred Role keyword matches ("AI Engineer")'
    );

    // 3d. Search by Location
    const searchLocRes = await request(app)
      .get('/api/v1/discovery/talents?q=Dubai')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      searchLocRes.body.talents.some((s: any) => s.fullName === 'Farhan Tariq'),
      '3d. Search by Location/Country keyword matches ("Dubai")'
    );

    // 3e. Search by Project / Proof of Work Title
    const searchProjRes = await request(app)
      .get('/api/v1/discovery/talents?q=MedVision')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      searchProjRes.body.talents.some((s: any) => s.fullName === 'Pooja Nair'),
      '3e. Search by Project Proof-of-Work title matches ("MedVision")'
    );

    // 3f. Search by Creative Work Sample Title
    const searchSampleRes = await request(app)
      .get('/api/v1/discovery/talents?q=SaaS%20Analytics%20Dashboard')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      searchSampleRes.body.talents.some((s: any) => s.fullName === 'Meera Krishnan'),
      '3f. Search by Creative Work Sample title matches ("SaaS Analytics Dashboard")'
    );

    // 3g. Search by Education Institution
    const searchEduRes = await request(app)
      .get('/api/v1/discovery/talents?q=National%20Institute%20of%20Design')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      searchEduRes.body.talents.some((s: any) => s.fullName === 'Meera Krishnan'),
      '3g. Search by Education Institution matches ("National Institute of Design")'
    );

    // 3h. Search by Certificate Organization
    const searchCertRes = await request(app)
      .get('/api/v1/discovery/talents?q=DeepLearning.AI')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      searchCertRes.body.talents.some((s: any) => s.fullName === 'Pooja Nair'),
      '3h. Search by Certificate Issuing Organization matches ("DeepLearning.AI")'
    );

    // -------------------------------------------------------------
    // 4. Structured Multi-Criteria Filters
    // -------------------------------------------------------------
    // 4a. Filter by Skill
    const filterSkillsRes = await request(app)
      .get('/api/v1/discovery/talents?skills=React')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      filterSkillsRes.body.talents.length > 0 &&
      filterSkillsRes.body.talents.every((s: any) => s.skills.some((sk: any) => sk.skillName.toLowerCase() === 'react')),
      '4a. Filter by Skill ("React") returns matching profiles'
    );

    // 4b. Filter by Role
    const filterRoleRes = await request(app)
      .get('/api/v1/discovery/talents?roles=UI%2FUX%20Designer')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      filterRoleRes.body.talents.some((s: any) => s.fullName === 'Meera Krishnan'),
      '4b. Filter by Role ("UI/UX Designer") returns matching designer profiles'
    );

    // 4c. Filter by Location & Country
    const filterLocRes = await request(app)
      .get('/api/v1/discovery/talents?locations=Kochi')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      filterLocRes.body.talents.length > 0,
      '4c. Filter by Location ("Kochi") returns candidates open to Kochi/Remote'
    );

    const filterCountryRes = await request(app)
      .get('/api/v1/discovery/talents?countries=United%20Arab%20Emirates')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      filterCountryRes.body.talents.some((s: any) => s.preferences?.preferredCountries.includes('United Arab Emirates')),
      '4d. Filter by Country ("United Arab Emirates") returns candidates'
    );

    // 4e. Filter by Work Mode (Remote / Hybrid / On-Site)
    const filterRemoteRes = await request(app)
      .get('/api/v1/discovery/talents?workMode=REMOTE')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      filterRemoteRes.body.talents.length > 0 &&
      filterRemoteRes.body.talents.every((s: any) =>
        s.preferences?.workModes?.includes(WorkMode.REMOTE) ||
        s.preferences?.workModes?.includes(WorkMode.ANY) ||
        s.preferences?.workMode === WorkMode.REMOTE ||
        s.preferences?.workMode === WorkMode.ANY
      ),
      '4e. Filter by Work Mode ("REMOTE") filters accurately'
    );

    // 4f. Filter by Availability
    const filterAvailRes = await request(app)
      .get('/api/v1/discovery/talents?availability=IMMEDIATE')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      filterAvailRes.body.talents.every((s: any) => s.preferences?.availability === AvailabilityOption.IMMEDIATE),
      '4f. Filter by Availability ("IMMEDIATE") returns immediate joiners'
    );

    // 4g. Filter by Education
    const filterEduRes = await request(app)
      .get('/api/v1/discovery/talents?education=B.Tech')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      filterEduRes.body.talents.every((s: any) => s.education.some((e: any) => e.degree === 'B.Tech')),
      '4g. Filter by Education Degree ("B.Tech") returns engineering graduates'
    );

    // 4h. Filter by Minimum Completeness Score
    const filterCompRes = await request(app)
      .get('/api/v1/discovery/talents?minCompleteness=90')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      filterCompRes.body.talents.every((s: any) => s.completenessScore >= 90),
      '4h. Filter by Minimum Completeness (>=90%) filters high-quality profiles'
    );

    // 4i. Filter by Category / Industry
    const filterCatRes = await request(app)
      .get('/api/v1/discovery/talents?categories=Marketing%20%26%20Advertising')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      filterCatRes.body.talents.some((s: any) => s.fullName === 'Farhan Tariq'),
      '4i. Filter by Industry / Category ("Marketing & Advertising")'
    );

    // 4j. Proof of Work Toggles
    const filterCvRes = await request(app)
      .get('/api/v1/discovery/talents?hasCvOnly=true')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      filterCvRes.body.talents.every((s: any) => Boolean(s.cvFileUrl)),
      '4j. Toggle "hasCvOnly=true" strictly returns candidates with uploaded CV'
    );

    const filterProjRes = await request(app)
      .get('/api/v1/discovery/talents?hasProjectsOnly=true')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      filterProjRes.body.talents.every((s: any) => s.projects && s.projects.length > 0),
      '4k. Toggle "hasProjectsOnly=true" returns candidates with verified projects'
    );

    const filterWsRes = await request(app)
      .get('/api/v1/discovery/talents?hasWorkSamplesOnly=true')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      filterWsRes.body.talents.every((s: any) => s.workSamples && s.workSamples.length > 0),
      '4l. Toggle "hasWorkSamplesOnly=true" returns candidates with creative work samples'
    );

    const filterCertRes = await request(app)
      .get('/api/v1/discovery/talents?hasCertificatesOnly=true')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      filterCertRes.body.talents.every((s: any) => s.certificates && s.certificates.length > 0),
      '4m. Toggle "hasCertificatesOnly=true" returns candidates with certificates'
    );

    // -------------------------------------------------------------
    // 5. Explainable Deterministic Ranking & Sorting
    // -------------------------------------------------------------
    // 5a. Profile Completeness Sorting
    const sortCompRes = await request(app)
      .get('/api/v1/discovery/talents?sort=COMPLETENESS')
      .set('Authorization', `Bearer ${recruiterToken}`);
    const compTalents = sortCompRes.body.talents;
    let compSorted = true;
    for (let i = 0; i < compTalents.length - 1; i++) {
      if (compTalents[i].completenessScore < compTalents[i + 1].completenessScore) {
        compSorted = false;
        break;
      }
    }
    assert(compSorted, '5a. Sorting by COMPLETENESS orders profiles highest to lowest score');

    // 5b. Most Recent Sorting
    const sortRecentRes = await request(app)
      .get('/api/v1/discovery/talents?sort=MOST_RECENT')
      .set('Authorization', `Bearer ${recruiterToken}`);
    const recentTalents = sortRecentRes.body.talents;
    let recentSorted = true;
    for (let i = 0; i < recentTalents.length - 1; i++) {
      const timeA = new Date(recentTalents[i].activatedAt || recentTalents[i].createdAt).getTime();
      const timeB = new Date(recentTalents[i + 1].activatedAt || recentTalents[i + 1].createdAt).getTime();
      if (timeA < timeB) {
        recentSorted = false;
        break;
      }
    }
    assert(recentSorted, '5b. Sorting by MOST_RECENT orders by most recent activation timestamp');

    // 5c. Projects Count Sorting
    const sortProjCountRes = await request(app)
      .get('/api/v1/discovery/talents?sort=PROJECTS_COUNT')
      .set('Authorization', `Bearer ${recruiterToken}`);
    const projCountTalents = sortProjCountRes.body.talents;
    let projCountSorted = true;
    for (let i = 0; i < projCountTalents.length - 1; i++) {
      const countA = (projCountTalents[i].projects?.length || 0) + (projCountTalents[i].workSamples?.length || 0);
      const countB = (projCountTalents[i + 1].projects?.length || 0) + (projCountTalents[i + 1].workSamples?.length || 0);
      if (countA < countB) {
        projCountSorted = false;
        break;
      }
    }
    assert(projCountSorted, '5c. Sorting by PROJECTS_COUNT orders by total proof-of-work count');

    // 5d. Relevance Ranking (Explainable proof-of-work score)
    const sortRelevanceRes = await request(app)
      .get('/api/v1/discovery/talents?sort=RELEVANCE')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      sortRelevanceRes.body.talents.length > 0 && sortRelevanceRes.body.talents[0].completenessScore >= 85,
      '5d. Default RELEVANCE ranking transparently prioritizes proof-of-work & completeness'
    );

    // -------------------------------------------------------------
    // 6. Pagination & Limit Safety Bounds
    // -------------------------------------------------------------
    const p1Res = await request(app)
      .get('/api/v1/discovery/talents?page=1&limit=2')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(p1Res.body.page === 1, '6a. Page 1 returns correct page number');
    assert(p1Res.body.limit === 2, '6b. Page 1 respects requested limit');
    assert(p1Res.body.talents.length <= 2, '6c. Page 1 length capped to limit');
    assert(p1Res.body.hasMore === true, '6d. hasMore indicates next page availability');

    const p2Res = await request(app)
      .get('/api/v1/discovery/talents?page=2&limit=2')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(p2Res.body.page === 2, '6e. Page 2 returns next page');
    assert(p2Res.body.talents[0]?.id !== p1Res.body.talents[0]?.id, '6f. Page 2 returns distinct candidates');

    const cappedRes = await request(app)
      .get('/api/v1/discovery/talents?limit=500')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(cappedRes.body.limit === 50, '6g. Large pagination requests safely capped at 50 to prevent memory blowup');

    // -------------------------------------------------------------
    // 7. Dynamic Facet Counts
    // -------------------------------------------------------------
    const facets = allTalentsRes.body.facetCounts;
    assert(Boolean(facets.skills && facets.skills.length > 0), '7a. Skill facets computed with counts');
    assert(Boolean(facets.locations && facets.locations.length > 0), '7b. Location facets computed with counts');
    assert(Boolean(facets.workModes && facets.workModes.length > 0), '7c. WorkMode facets computed with counts');
    assert(Boolean(facets.roles && facets.roles.length > 0), '7d. Role facets computed with counts');
    assert(Boolean(facets.education && facets.education.length > 0), '7e. Education facets computed with counts');

    // -------------------------------------------------------------
    // 8. Candidate Profile Deep Dive & CV Access
    // -------------------------------------------------------------
    const candidateId = 'student-1';
    const deepDiveRes = await request(app)
      .get(`/api/v1/discovery/talents/${candidateId}`)
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(deepDiveRes.status === 200, '8a. Candidate deep dive profile returned 200 OK');
    assert(deepDiveRes.body.candidate.fullName === 'Rohan Sharma', '8b. Candidate name matches');
    assert(Boolean(deepDiveRes.body.candidate.cvFileUrl), '8c. Candidate verified PDF CV URL accessible');
    assert(deepDiveRes.body.candidate.projects.length > 0, '8d. Proof of work projects accessible with live demo links');

    // -------------------------------------------------------------
    // 9. Candidate Contact Intent Reveal & Logging
    // -------------------------------------------------------------
    const contactRes = await request(app)
      .post(`/api/v1/discovery/talents/${candidateId}/contact`)
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({ channel: 'EMAIL' });
    assert(contactRes.status === 200, '9a. POST /talents/:id/contact returns 200 OK');
    assert(Boolean(contactRes.body.contactInfo?.email), '9b. Candidate verified email revealed');
    assert(Boolean(contactRes.body.eventId), '9c. Recruiter contact intent event logged');

    // -------------------------------------------------------------
    // 10. Shortlists Management
    // -------------------------------------------------------------
    const shortlistRes = await request(app)
      .post(`/api/v1/discovery/talents/${candidateId}/shortlist`)
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({ note: 'Promising frontend developer with clean React code' });
    assert(shortlistRes.status === 200, '10a. Candidate added to shortlist with recruiter note');

    const getShortlistsRes = await request(app)
      .get('/api/v1/discovery/shortlists')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(
      getShortlistsRes.body.shortlists.some((sl: any) => sl.studentId === candidateId && sl.note?.includes('Promising')),
      '10b. Saved shortlists retrieved successfully'
    );

    const removeSlRes = await request(app)
      .delete(`/api/v1/discovery/talents/${candidateId}/shortlist`)
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(removeSlRes.status === 200 && removeSlRes.body.success === true, '10c. Candidate removed from shortlist');

    // -------------------------------------------------------------
    // 11. Company & Recruiter Profile Management
    // -------------------------------------------------------------
    const getCompRes = await request(app)
      .get('/api/v1/discovery/company')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(getCompRes.status === 200 && Boolean(getCompRes.body.company.name), '11a. Company profile retrieved');

    const updateCompRes = await request(app)
      .put('/api/v1/discovery/company')
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({ industry: 'Enterprise SaaS & Cloud' });
    assert(updateCompRes.status === 200 && updateCompRes.body.company.industry === 'Enterprise SaaS & Cloud', '11b. Company profile updated');

    const getRecRes = await request(app)
      .get('/api/v1/discovery/recruiter/me')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(getRecRes.status === 200 && Boolean(getRecRes.body.recruiter.fullName), '11c. Recruiter profile retrieved');

    // -------------------------------------------------------------
    // 12. Strict Scope Verification (NOT a Job Portal)
    // -------------------------------------------------------------
    const jobPostRes = await request(app)
      .post('/api/v1/jobs')
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({ title: 'Software Engineer' });
    assert(jobPostRes.status === 404, '12a. /api/v1/jobs does NOT exist (Strictly NOT a job portal)');

    const jobApplyRes = await request(app)
      .post('/api/v1/jobs/apply')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(jobApplyRes.status === 404, '12b. /api/v1/jobs/apply does NOT exist (No job applications)');

    const jobFeedRes = await request(app)
      .get('/api/v1/jobs')
      .set('Authorization', `Bearer ${recruiterToken}`);
    assert(jobFeedRes.status === 404, '12c. /api/v1/jobs feed does NOT exist (Talent Discovery Platform only)');

  } catch (error: any) {
    console.error('💥 Test suite crashed with error:', error);
    failed++;
  }

  console.log('\n========================================');
  console.log(`Talent Discovery Engine Summary: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTalentDiscoveryEngineTests();
