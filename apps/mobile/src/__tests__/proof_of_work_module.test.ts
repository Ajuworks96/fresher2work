import request from 'supertest';
import app from '../../../api/src/server';
import {
  UserRole,
  WorkSampleCategory,
  StudentProfile,
} from '@fresher2work/types';

async function runProofOfWorkModuleTests() {
  console.log('🧪 Starting FresherToWork Professional Proof-of-Work Module Test Suite...\n');

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
    // Setup: Register a dedicated test student
    // -------------------------------------------------------------
    const studentEmail = `pow_student_${Date.now()}@university.edu`;
    const studentPhone = `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        fullName: 'Nikhil Varma',
        email: studentEmail,
        phone: studentPhone,
        password: 'Passcode2026!',
        role: UserRole.STUDENT,
      });

    assert(regRes.status === 201 && regRes.body.token, '1. Student Account initialized with JWT token');
    const token = regRes.body.token;

    // -------------------------------------------------------------
    // 1. CV Storage Presigned Upload & Strict PDF Validation
    // -------------------------------------------------------------
    // 1a. Non-PDF CV should be rejected
    const invalidCvUploadRes = await request(app)
      .post('/api/v1/storage/presigned-upload')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fileName: 'resume.docx',
        fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        fileSize: 500000,
        category: 'CV',
      });
    assert(invalidCvUploadRes.status === 400, '1a. Non-PDF CV upload rejected by storage validation');

    // 1b. Oversized CV (>10MB) should be rejected
    const oversizedCvRes = await request(app)
      .post('/api/v1/storage/presigned-upload')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fileName: 'heavy_resume.pdf',
        fileType: 'application/pdf',
        fileSize: 15 * 1024 * 1024, // 15MB
        category: 'CV',
      });
    assert(oversizedCvRes.status === 400, '1b. Oversized CV (>10MB) rejected by storage validation');

    // 1c. Valid PDF CV generates presigned upload URL
    const validCvUploadRes = await request(app)
      .post('/api/v1/storage/presigned-upload')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fileName: 'Nikhil_Varma_CV_2026.pdf',
        fileType: 'application/pdf',
        fileSize: 1.2 * 1024 * 1024,
        category: 'CV',
      });
    assert(validCvUploadRes.status === 200, '1c. Valid PDF CV receives presigned upload URL');
    assert(Boolean(validCvUploadRes.body.uploadUrl), 'Presigned upload URL generated');
    assert(Boolean(validCvUploadRes.body.publicUrl), 'Public asset URL generated');

    const cvUrl = validCvUploadRes.body.publicUrl;

    // -------------------------------------------------------------
    // 2. CV Confirmation, Replacement, and Deletion
    // -------------------------------------------------------------
    // 2a. Confirm CV attachment
    const confirmCvRes = await request(app)
      .post('/api/v1/students/me/cv/confirm')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cvFileUrl: cvUrl,
        fileName: 'Nikhil_Varma_CV_2026.pdf',
        fileSize: 1258291,
      });
    assert(confirmCvRes.status === 200, '2a. CV attached to profile');
    assert(confirmCvRes.body.profile.cvFileUrl === cvUrl, 'Stored CV URL matches uploaded URL');
    assert(confirmCvRes.body.profile.cvFileName === 'Nikhil_Varma_CV_2026.pdf', 'CV filename stored');

    // 2b. Replace CV with a new version
    const updatedCvUrl = 'https://assets.fresher2work.com/cvs/nikhil_varma_v2.pdf';
    const replaceCvRes = await request(app)
      .post('/api/v1/students/me/cv/confirm')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cvFileUrl: updatedCvUrl,
        fileName: 'Nikhil_Varma_CV_v2.pdf',
      });
    assert(replaceCvRes.status === 200, '2b. CV replaced with newer version');
    assert(replaceCvRes.body.profile.cvFileUrl === updatedCvUrl, 'Replaced CV URL matches new document');

    // 2c. Delete CV
    const deleteCvRes = await request(app)
      .delete('/api/v1/students/me/cv')
      .set('Authorization', `Bearer ${token}`);
    assert(deleteCvRes.status === 200, '2c. CV deleted from profile');
    assert(deleteCvRes.body.profile.cvFileUrl === undefined, 'CV URL is cleared upon deletion');

    // Re-attach CV for portfolio completeness tests
    await request(app)
      .post('/api/v1/students/me/cv/confirm')
      .set('Authorization', `Bearer ${token}`)
      .send({ cvFileUrl: updatedCvUrl, fileName: 'Nikhil_Varma_CV.pdf' });

    // -------------------------------------------------------------
    // 3. Projects: Create, Edit, Delete with Role, Tools, and Skills
    // -------------------------------------------------------------
    const newProjectPayload = {
      title: 'RealTime Chat & Canvas Collaboration',
      description: 'Distributed real-time drawing canvas and chat with CRDT state synchronization and WebSockets.',
      role: 'Lead Full-Stack Developer',
      toolsUsed: ['Figma', 'VS Code', 'Docker', 'Postman'],
      skillsDemonstrated: ['WebSockets', 'State Synchronization', 'Responsive Canvas', 'Redis PubSub'],
      projectLink: 'https://canvascollab.app',
      liveDemoUrl: 'https://canvascollab.app',
      githubRepoUrl: 'https://github.com/nikhil/canvascollab',
      techStack: ['React', 'TypeScript', 'Node.js', 'Socket.io', 'Redis'],
      mediaUrls: [],
    };

    const addProjRes = await request(app)
      .post('/api/v1/students/me/projects')
      .set('Authorization', `Bearer ${token}`)
      .send(newProjectPayload);

    assert(addProjRes.status === 201, '3a. Project created with role, tools, skills, and links');
    const projId = addProjRes.body.project.id;
    assert(addProjRes.body.project.role === 'Lead Full-Stack Developer', 'Project role preserved');
    assert(addProjRes.body.project.toolsUsed.includes('Docker'), 'Tools used preserved');
    assert(addProjRes.body.project.skillsDemonstrated.includes('WebSockets'), 'Skills demonstrated preserved');

    // 3b. Edit Project
    const editProjRes = await request(app)
      .put(`/api/v1/students/me/projects/${projId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'RealTime Collaborative Canvas & Whiteboard v2',
        role: 'Principal Architect & Solo Developer',
        toolsUsed: ['Figma', 'Docker', 'Grafana'],
      });
    assert(editProjRes.status === 200, '3b. Project successfully edited');
    assert(editProjRes.body.project.title === 'RealTime Collaborative Canvas & Whiteboard v2', 'Edited title saved');
    assert(editProjRes.body.project.role === 'Principal Architect & Solo Developer', 'Edited role saved');

    // 3c. Delete Project
    const delProjRes = await request(app)
      .delete(`/api/v1/students/me/projects/${projId}`)
      .set('Authorization', `Bearer ${token}`);
    assert(delProjRes.status === 200, '3c. Project deleted');
    assert(!delProjRes.body.profile.projects.some((p: any) => p.id === projId), 'Deleted project no longer in list');

    // Re-add 2 projects for full portfolio verification
    await request(app)
      .post('/api/v1/students/me/projects')
      .set('Authorization', `Bearer ${token}`)
      .send(newProjectPayload);

    await request(app)
      .post('/api/v1/students/me/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Microservices Billing Engine',
        description: 'Automated invoice generation and payment webhook handler.',
        role: 'Backend Developer',
        toolsUsed: ['PostgreSQL', 'Docker'],
        skillsDemonstrated: ['Idempotent APIs', 'Database Indexing'],
        techStack: ['Node.js', 'Express', 'PostgreSQL'],
        mediaUrls: [],
      });

    // -------------------------------------------------------------
    // 4. Creative Work Samples: Create, Edit, Delete
    // -------------------------------------------------------------
    const samplePayload = {
      title: 'SaaS Design System & Landing Page Creatives',
      category: WorkSampleCategory.GRAPHIC_DESIGN,
      description: 'Complete UI component library and visual branding identity built for a university startup.',
      clientOrContext: 'University Incubator Venture',
      toolsUsed: ['Figma', 'Adobe Illustrator', 'Photoshop'],
      workLink: 'https://behance.net/gallery/saas-design-system',
      mediaUrls: ['https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800'],
    };

    const addSampleRes = await request(app)
      .post('/api/v1/students/me/work-samples')
      .set('Authorization', `Bearer ${token}`)
      .send(samplePayload);

    assert(addSampleRes.status === 201, '4a. Work Sample created with creative category, tools, and link');
    const sampleId = addSampleRes.body.workSample.id;
    assert(addSampleRes.body.workSample.category === WorkSampleCategory.GRAPHIC_DESIGN, 'Category preserved');
    assert(addSampleRes.body.workSample.toolsUsed.includes('Figma'), 'Tools preserved');

    // 4b. Edit Work Sample
    const editSampleRes = await request(app)
      .put(`/api/v1/students/me/work-samples/${sampleId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'SaaS Design System & Visual Identity (Complete Showcase)',
        category: WorkSampleCategory.BRANDING,
      });
    assert(editSampleRes.status === 200, '4b. Work sample edited');
    assert(editSampleRes.body.workSample.title === 'SaaS Design System & Visual Identity (Complete Showcase)', 'Sample title updated');
    assert(editSampleRes.body.workSample.category === WorkSampleCategory.BRANDING, 'Sample category updated to BRANDING');

    // 4c. Delete Work Sample
    const delSampleRes = await request(app)
      .delete(`/api/v1/students/me/work-samples/${sampleId}`)
      .set('Authorization', `Bearer ${token}`);
    assert(delSampleRes.status === 200, '4c. Work sample deleted');
    assert(!delSampleRes.body.profile.workSamples?.some((s: any) => s.id === sampleId), 'Deleted sample removed');

    // Re-add sample for full showcase
    await request(app)
      .post('/api/v1/students/me/work-samples')
      .set('Authorization', `Bearer ${token}`)
      .send(samplePayload);

    // -------------------------------------------------------------
    // 5. Certificates: Create, Edit, Delete
    // -------------------------------------------------------------
    const certPayload = {
      name: 'Google Cloud Certified Associate Cloud Engineer',
      issuingOrganization: 'Google Cloud',
      issueDate: '2025',
      credentialUrl: 'https://google.com/credential/gcp-ace-12345',
    };

    const addCertRes = await request(app)
      .post('/api/v1/students/me/certificates')
      .set('Authorization', `Bearer ${token}`)
      .send(certPayload);

    assert(addCertRes.status === 201, '5a. Certificate created');
    const certId = addCertRes.body.certificate.id;

    // 5b. Edit Certificate
    const editCertRes = await request(app)
      .put(`/api/v1/students/me/certificates/${certId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Google Cloud Certified Professional Cloud Developer',
      });
    assert(editCertRes.status === 200, '5b. Certificate edited');
    assert(editCertRes.body.certificate.name === 'Google Cloud Certified Professional Cloud Developer', 'Edited certificate name saved');

    // -------------------------------------------------------------
    // 6. Access Control & Public Protection
    // -------------------------------------------------------------
    // Student can view their own profile with full data
    const myProfileRes = await request(app)
      .get('/api/v1/students/me')
      .set('Authorization', `Bearer ${token}`);
    assert(myProfileRes.status === 200, '6a. Student can access their own proof of work');
    assert(myProfileRes.body.profile.cvFileUrl !== undefined, 'CV URL visible to profile owner');

    // Public visitor via slug gets masked PII
    const slug = myProfileRes.body.profile.publicSlug;
    const publicProfileRes = await request(app).get(`/api/v1/students/p/${slug}`);
    assert(publicProfileRes.status === 200, '6b. Public profile loads via slug');
    assert(publicProfileRes.body.profile.phone === undefined, 'Public request: Phone number is hidden');
    assert(publicProfileRes.body.profile.email === undefined, 'Public request: Email address is hidden');

    console.log(`\n========================================`);
    console.log(`Test Results: ${passed} passed, ${failed} failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Proof of Work Test Execution Error:', err);
    process.exit(1);
  }
}

runProofOfWorkModuleTests();
