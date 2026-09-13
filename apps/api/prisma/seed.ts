import { PrismaClient, UserRole, UserStatus, ModerationStatus, SkillLevel, WorkMode, AvailabilityOption, RelocationPreference, WorkType, WorkSampleCategory, CompanyVerificationStatus, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FresherToWork seed...');

  const passwordHash = await bcrypt.hash('password', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  await prisma.education.updateMany({
    where: { degree: { contains: 'B.Tech', mode: 'insensitive' } },
    data: { degree: 'B.Tech' },
  });

  // 1. Admin User
  await prisma.user.upsert({
    where: { email: 'admin@freshertowork.com' },
    update: { passwordHash: adminPasswordHash },
    create: {
      id: 'admin-user-1',
      email: 'admin@freshertowork.com',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  // 2. Company
  const company = await prisma.company.upsert({
    where: { id: 'company-razorscale' },
    update: {
      name: 'RazorScale Technologies',
      location: 'Bengaluru / Remote',
      industry: 'Technology & Digital Services',
      verificationStatus: CompanyVerificationStatus.VERIFIED,
    },
    create: {
      id: 'company-razorscale',
      name: 'RazorScale Technologies',
      website: 'https://razorscale.tech',
      location: 'Bengaluru / Remote',
      industry: 'Technology & Digital Services',
      verificationStatus: CompanyVerificationStatus.VERIFIED,
      verifiedAt: new Date(),
    },
  });

  // 3. Recruiter Users
  const recruiterUser1 = await prisma.user.upsert({
    where: { email: 'anjali.m@razorscale.io' },
    update: { passwordHash },
    create: {
      id: 'user-recruiter-anjali',
      email: 'anjali.m@razorscale.io',
      phone: '+91 98765 00001',
      passwordHash,
      role: UserRole.RECRUITER,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.recruiterProfile.upsert({
    where: { userId: recruiterUser1.id },
    update: { companyId: company.id },
    create: {
      id: 'recruiter-anjali',
      userId: recruiterUser1.id,
      companyId: company.id,
      fullName: 'Anjali Menon',
      designation: 'Lead Talent Partner',
      businessEmail: 'anjali.m@razorscale.io',
      linkedinUrl: 'https://linkedin.com/in/anjalimenon-demo',
    },
  });

  const recruiterUser2 = await prisma.user.upsert({
    where: { email: 'recruiter@freshertowork.com' },
    update: { passwordHash },
    create: {
      id: 'user-recruiter-vikram',
      email: 'recruiter@freshertowork.com',
      phone: '+91 98765 00002',
      passwordHash,
      role: UserRole.RECRUITER,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.recruiterProfile.upsert({
    where: { userId: recruiterUser2.id },
    update: { companyId: company.id },
    create: {
      id: 'recruiter-vikram',
      userId: recruiterUser2.id,
      companyId: company.id,
      fullName: 'Vikram Mehta',
      designation: 'Talent Acquisition Manager',
      businessEmail: 'recruiter@freshertowork.com',
    },
  });

  // 4. Students
  // Student 1: Rohan Sharma (student-1)
  const u1 = await prisma.user.upsert({
    where: { email: 'rohan.sharma@example.com' },
    update: { passwordHash },
    create: {
      id: 'user-rohan-sharma',
      email: 'rohan.sharma@example.com',
      phone: '+91 98765 11111',
      passwordHash,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
    },
  });

  const s1 = await prisma.studentProfile.upsert({
    where: { id: 'student-1' },
    update: {
      userId: u1.id,
      fullName: 'Rohan Sharma',
      headline: 'Full Stack Engineer | React, Node.js & Flutter Developer',
      about: 'Passionate 2025 engineering graduate with production experience building real-time applications.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      city: 'Bengaluru',
      country: 'India',
      publicSlug: 'rohan-sharma',
      completenessScore: 95,
      isActivated: true,
      activatedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
      moderationStatus: ModerationStatus.APPROVED,
      cvFileUrl: 'https://assets.fresher2work.com/cvs/rohan_sharma_resume.pdf',
      cvFileName: 'Rohan_Sharma_CV.pdf',
      cvFileSize: 180000,
      cvUploadedAt: new Date(),
      githubUrl: 'https://github.com/rohansharma',
      linkedinUrl: 'https://linkedin.com/in/rohansharma',
      portfolioUrl: 'https://rohansharma.dev',
    },
    create: {
      id: 'student-1',
      userId: u1.id,
      fullName: 'Rohan Sharma',
      headline: 'Full Stack Engineer | React, Node.js & Flutter Developer',
      about: 'Passionate 2025 engineering graduate with production experience building real-time applications.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      city: 'Bengaluru',
      country: 'India',
      publicSlug: 'rohan-sharma',
      completenessScore: 95,
      isActivated: true,
      activatedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
      moderationStatus: ModerationStatus.APPROVED,
      cvFileUrl: 'https://assets.fresher2work.com/cvs/rohan_sharma_resume.pdf',
      cvFileName: 'Rohan_Sharma_CV.pdf',
      cvFileSize: 180000,
      cvUploadedAt: new Date(),
      githubUrl: 'https://github.com/rohansharma',
      linkedinUrl: 'https://linkedin.com/in/rohansharma',
      portfolioUrl: 'https://rohansharma.dev',
    },
  });

  await prisma.education.deleteMany({ where: { studentId: s1.id } });
  await prisma.education.create({
    data: {
      studentId: s1.id,
      institutionName: 'PES Institute of Technology',
      degree: 'B.Tech',
      fieldOfStudy: 'Computer Science & Engineering',
      startYear: 2021,
      endYear: 2025,
      gradeOrCgpa: '8.8 CGPA',
    },
  });

  await prisma.studentSkill.deleteMany({ where: { studentId: s1.id } });
  await prisma.studentSkill.createMany({
    data: [
      { studentId: s1.id, skillName: 'React', proficiencyLevel: SkillLevel.ADVANCED, isVerified: true },
      { studentId: s1.id, skillName: 'TypeScript', proficiencyLevel: SkillLevel.ADVANCED, isVerified: true },
      { studentId: s1.id, skillName: 'Flutter', proficiencyLevel: SkillLevel.INTERMEDIATE, isVerified: true },
      { studentId: s1.id, skillName: 'Node.js', proficiencyLevel: SkillLevel.INTERMEDIATE, isVerified: true },
      { studentId: s1.id, skillName: 'PostgreSQL', proficiencyLevel: SkillLevel.INTERMEDIATE, isVerified: false },
    ],
  });

  await prisma.project.deleteMany({ where: { studentId: s1.id } });
  await prisma.project.create({
    data: {
      studentId: s1.id,
      title: 'Real-time Pulse Collaborative Editor',
      description: 'Built collaborative whiteboard with WebSocket synchronization and CRDT conflict resolution.',
      techStack: ['React', 'TypeScript', 'Node.js', 'Socket.io'],
      toolsUsed: ['VS Code', 'Docker'],
      liveDemoUrl: 'https://pulse-editor-demo.vercel.app',
      githubRepoUrl: 'https://github.com/rohansharma/pulse',
    },
  });

  await prisma.careerPreference.upsert({
    where: { studentId: s1.id },
    update: {
      preferredRoles: ['Full Stack Developer', 'Frontend Engineer', 'Software Engineer'],
      preferredLocations: ['Bengaluru', 'Kochi', 'Remote'],
      preferredCountries: ['India', 'United Arab Emirates'],
      workModes: [WorkMode.REMOTE, WorkMode.HYBRID],
      workMode: WorkMode.REMOTE,
      relocationWillingness: RelocationPreference.WILLING,
      availability: AvailabilityOption.IMMEDIATE,
    },
    create: {
      studentId: s1.id,
      preferredRoles: ['Full Stack Developer', 'Frontend Engineer', 'Software Engineer'],
      preferredLocations: ['Bengaluru', 'Kochi', 'Remote'],
      preferredCountries: ['India', 'United Arab Emirates'],
      workModes: [WorkMode.REMOTE, WorkMode.HYBRID],
      workMode: WorkMode.REMOTE,
      relocationWillingness: RelocationPreference.WILLING,
      availability: AvailabilityOption.IMMEDIATE,
    },
  });

  await prisma.profileActivation.upsert({
    where: { studentId: s1.id },
    update: { isActivated: true },
    create: { studentId: s1.id, isActivated: true, activatedAt: new Date() },
  });

  // Student 2: Pooja Nair (student-2, AI Engineer, DeepLearning.AI, MedVision)
  const u2 = await prisma.user.upsert({
    where: { email: 'pooja.nair@example.com' },
    update: { passwordHash },
    create: {
      id: 'user-pooja-nair',
      email: 'pooja.nair@example.com',
      phone: '+91 98765 22223',
      passwordHash,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
    },
  });

  const s2 = await prisma.studentProfile.upsert({
    where: { id: 'student-2' },
    update: {
      userId: u2.id,
      fullName: 'Pooja Nair',
      headline: 'AI Engineer & Computer Vision Researcher',
      about: 'Building deep learning solutions for medical image diagnostics with PyTorch.',
      completenessScore: 92,
      isActivated: true,
      activatedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000),
      moderationStatus: ModerationStatus.APPROVED,
      cvFileUrl: 'https://assets.fresher2work.com/cvs/pooja_nair_cv.pdf',
      publicSlug: 'pooja-nair-ai',
    },
    create: {
      id: 'student-2',
      userId: u2.id,
      fullName: 'Pooja Nair',
      headline: 'AI Engineer & Computer Vision Researcher',
      about: 'Building deep learning solutions for medical image diagnostics with PyTorch.',
      completenessScore: 92,
      isActivated: true,
      activatedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000),
      moderationStatus: ModerationStatus.APPROVED,
      cvFileUrl: 'https://assets.fresher2work.com/cvs/pooja_nair_cv.pdf',
      publicSlug: 'pooja-nair-ai',
    },
  });

  await prisma.education.deleteMany({ where: { studentId: s2.id } });
  await prisma.education.create({
    data: {
      studentId: s2.id,
      institutionName: 'IIT Madras',
      degree: 'B.Tech',
      fieldOfStudy: 'Electrical Engineering',
      startYear: 2021,
      endYear: 2025,
    },
  });

  await prisma.studentSkill.deleteMany({ where: { studentId: s2.id } });
  await prisma.studentSkill.createMany({
    data: [
      { studentId: s2.id, skillName: 'Python', proficiencyLevel: SkillLevel.ADVANCED, isVerified: true },
      { studentId: s2.id, skillName: 'PyTorch', proficiencyLevel: SkillLevel.ADVANCED, isVerified: true },
      { studentId: s2.id, skillName: 'Computer Vision', proficiencyLevel: SkillLevel.INTERMEDIATE, isVerified: true },
    ],
  });

  await prisma.project.deleteMany({ where: { studentId: s2.id } });
  await prisma.project.create({
    data: {
      studentId: s2.id,
      title: 'MedVision Radiology AI Detection',
      description: 'End-to-end deep learning pipeline for automated X-ray anomaly detection.',
      techStack: ['Python', 'PyTorch', 'FastAPI', 'Docker'],
      liveDemoUrl: 'https://medvision-demo.app',
    },
  });

  await prisma.certificate.deleteMany({ where: { studentId: s2.id } });
  await prisma.certificate.create({
    data: {
      studentId: s2.id,
      name: 'Deep Learning Specialization',
      issuingOrganization: 'DeepLearning.AI',
      issueDate: new Date('2024-06-15'),
      isVerified: true,
    },
  });

  await prisma.careerPreference.upsert({
    where: { studentId: s2.id },
    update: {
      preferredRoles: ['AI Engineer', 'Machine Learning Engineer', 'Data Scientist'],
      preferredLocations: ['Bengaluru', 'Remote', 'Hyderabad'],
      preferredCountries: ['India'],
      workModes: [WorkMode.REMOTE, WorkMode.HYBRID],
      workMode: WorkMode.REMOTE,
      availability: AvailabilityOption.IMMEDIATE,
    },
    create: {
      studentId: s2.id,
      preferredRoles: ['AI Engineer', 'Machine Learning Engineer', 'Data Scientist'],
      preferredLocations: ['Bengaluru', 'Remote', 'Hyderabad'],
      preferredCountries: ['India'],
      workModes: [WorkMode.REMOTE, WorkMode.HYBRID],
      workMode: WorkMode.REMOTE,
      availability: AvailabilityOption.IMMEDIATE,
    },
  });

  await prisma.profileActivation.upsert({
    where: { studentId: s2.id },
    update: { isActivated: true },
    create: { studentId: s2.id, isActivated: true, activatedAt: new Date() },
  });

  // Student 3: Meera Krishnan (student-3, UI/UX Designer, National Institute of Design, SaaS Analytics Dashboard)
  const u3 = await prisma.user.upsert({
    where: { email: 'meera.krishnan@example.com' },
    update: { passwordHash },
    create: {
      id: 'user-meera-krishnan',
      email: 'meera.krishnan@example.com',
      phone: '+91 98765 33333',
      passwordHash,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
    },
  });

  const s3 = await prisma.studentProfile.upsert({
    where: { id: 'student-3' },
    update: {
      userId: u3.id,
      fullName: 'Meera Krishnan',
      headline: 'UI/UX Designer & Product Interaction Specialist',
      about: 'Designing modern, delightful digital experiences for complex SaaS platforms.',
      completenessScore: 90,
      isActivated: true,
      activatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      moderationStatus: ModerationStatus.APPROVED,
      cvFileUrl: 'https://assets.fresher2work.com/cvs/meera_krishnan_cv.pdf',
      publicSlug: 'meera-krishnan-design',
    },
    create: {
      id: 'student-3',
      userId: u3.id,
      fullName: 'Meera Krishnan',
      headline: 'UI/UX Designer & Product Interaction Specialist',
      about: 'Designing modern, delightful digital experiences for complex SaaS platforms.',
      completenessScore: 90,
      isActivated: true,
      activatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      moderationStatus: ModerationStatus.APPROVED,
      cvFileUrl: 'https://assets.fresher2work.com/cvs/meera_krishnan_cv.pdf',
      publicSlug: 'meera-krishnan-design',
    },
  });

  await prisma.education.deleteMany({ where: { studentId: s3.id } });
  await prisma.education.create({
    data: {
      studentId: s3.id,
      institutionName: 'National Institute of Design',
      degree: 'B.Des',
      fieldOfStudy: 'Interaction Design',
      startYear: 2021,
      endYear: 2025,
    },
  });

  await prisma.studentSkill.deleteMany({ where: { studentId: s3.id } });
  await prisma.studentSkill.createMany({
    data: [
      { studentId: s3.id, skillName: 'Figma', proficiencyLevel: SkillLevel.ADVANCED, isVerified: true },
      { studentId: s3.id, skillName: 'UI Design', proficiencyLevel: SkillLevel.ADVANCED, isVerified: true },
      { studentId: s3.id, skillName: 'Interaction Design', proficiencyLevel: SkillLevel.ADVANCED, isVerified: true },
    ],
  });

  await prisma.workSample.deleteMany({ where: { studentId: s3.id } });
  await prisma.workSample.create({
    data: {
      studentId: s3.id,
      title: 'SaaS Analytics Dashboard',
      category: WorkSampleCategory.WEBSITE,
      description: 'Comprehensive design system and interface for cloud metrics management.',
      workLink: 'https://www.figma.com/community/file/demo-saas-dashboard',
      toolsUsed: ['Figma', 'Protopie'],
    },
  });

  await prisma.careerPreference.upsert({
    where: { studentId: s3.id },
    update: {
      preferredRoles: ['UI/UX Designer', 'Product Designer'],
      preferredLocations: ['Bengaluru', 'Kochi', 'Remote'],
      preferredCountries: ['India'],
      workModes: [WorkMode.REMOTE, WorkMode.HYBRID],
      workMode: WorkMode.REMOTE,
      availability: AvailabilityOption.IMMEDIATE,
    },
    create: {
      studentId: s3.id,
      preferredRoles: ['UI/UX Designer', 'Product Designer'],
      preferredLocations: ['Bengaluru', 'Kochi', 'Remote'],
      preferredCountries: ['India'],
      workModes: [WorkMode.REMOTE, WorkMode.HYBRID],
      workMode: WorkMode.REMOTE,
      availability: AvailabilityOption.IMMEDIATE,
    },
  });

  await prisma.profileActivation.upsert({
    where: { studentId: s3.id },
    update: { isActivated: true },
    create: { studentId: s3.id, isActivated: true, activatedAt: new Date() },
  });

  // Student 4: Farhan Tariq (student-4, Marketing & Advertising, United Arab Emirates, Dubai)
  const u4 = await prisma.user.upsert({
    where: { email: 'farhan.tariq@example.com' },
    update: { passwordHash },
    create: {
      id: 'user-farhan-tariq',
      email: 'farhan.tariq@example.com',
      phone: '+971 50 123 4567',
      passwordHash,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
    },
  });

  const s4 = await prisma.studentProfile.upsert({
    where: { id: 'student-4' },
    update: {
      userId: u4.id,
      fullName: 'Farhan Tariq',
      headline: 'Growth Marketing & Digital Strategy Specialist',
      about: 'Performance marketing professional specialized in scalable acquisition campaigns across MENA.',
      completenessScore: 90,
      isActivated: true,
      activatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
      moderationStatus: ModerationStatus.APPROVED,
      cvFileUrl: 'https://assets.fresher2work.com/cvs/farhan_tariq_cv.pdf',
      city: 'Dubai',
      country: 'United Arab Emirates',
      publicSlug: 'farhan-tariq-marketing',
    },
    create: {
      id: 'student-4',
      userId: u4.id,
      fullName: 'Farhan Tariq',
      headline: 'Growth Marketing & Digital Strategy Specialist',
      about: 'Performance marketing professional specialized in scalable acquisition campaigns across MENA.',
      completenessScore: 90,
      isActivated: true,
      activatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
      moderationStatus: ModerationStatus.APPROVED,
      cvFileUrl: 'https://assets.fresher2work.com/cvs/farhan_tariq_cv.pdf',
      city: 'Dubai',
      country: 'United Arab Emirates',
      publicSlug: 'farhan-tariq-marketing',
    },
  });

  await prisma.education.deleteMany({ where: { studentId: s4.id } });
  await prisma.education.create({
    data: {
      studentId: s4.id,
      institutionName: 'Middlesex University Dubai',
      degree: 'BBA',
      fieldOfStudy: 'Digital Marketing',
      startYear: 2021,
      endYear: 2024,
    },
  });

  await prisma.studentSkill.deleteMany({ where: { studentId: s4.id } });
  await prisma.studentSkill.createMany({
    data: [
      { studentId: s4.id, skillName: 'Growth Marketing', proficiencyLevel: SkillLevel.ADVANCED, isVerified: true },
      { studentId: s4.id, skillName: 'Google Ads', proficiencyLevel: SkillLevel.ADVANCED, isVerified: true },
    ],
  });

  await prisma.careerPreference.upsert({
    where: { studentId: s4.id },
    update: {
      preferredRoles: ['Marketing Specialist', 'Growth Lead'],
      preferredIndustries: ['Marketing & Advertising', 'E-Commerce'],
      preferredLocations: ['Dubai', 'Abu Dhabi', 'Remote'],
      preferredCountries: ['United Arab Emirates'],
      workModes: [WorkMode.REMOTE, WorkMode.ON_SITE],
      workMode: WorkMode.REMOTE,
      availability: AvailabilityOption.IMMEDIATE,
    },
    create: {
      studentId: s4.id,
      preferredRoles: ['Marketing Specialist', 'Growth Lead'],
      preferredIndustries: ['Marketing & Advertising', 'E-Commerce'],
      preferredLocations: ['Dubai', 'Abu Dhabi', 'Remote'],
      preferredCountries: ['United Arab Emirates'],
      workModes: [WorkMode.REMOTE, WorkMode.ON_SITE],
      workMode: WorkMode.REMOTE,
      availability: AvailabilityOption.IMMEDIATE,
    },
  });

  await prisma.profileActivation.upsert({
    where: { studentId: s4.id },
    update: { isActivated: true },
    create: { studentId: s4.id, isActivated: true, activatedAt: new Date() },
  });

  // Student 5: student-unactivated
  const uUnact = await prisma.user.upsert({
    where: { email: 'unactivated@example.com' },
    update: { passwordHash },
    create: {
      id: 'user-unactivated',
      email: 'unactivated@example.com',
      passwordHash,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.studentProfile.upsert({
    where: { id: 'student-unactivated' },
    update: {
      userId: uUnact.id,
      fullName: 'Unactivated Student',
      isActivated: false,
      moderationStatus: ModerationStatus.APPROVED,
    },
    create: {
      id: 'student-unactivated',
      userId: uUnact.id,
      fullName: 'Unactivated Student',
      headline: 'Fresher Student',
      about: 'Student profile that has not completed activation payment.',
      publicSlug: 'unactivated-student',
      completenessScore: 80,
      isActivated: false,
      moderationStatus: ModerationStatus.APPROVED,
    },
  });

  // Student 6: student-pending-moderation
  const uPend = await prisma.user.upsert({
    where: { email: 'pending@example.com' },
    update: { passwordHash },
    create: {
      id: 'user-pending',
      email: 'pending@example.com',
      passwordHash,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.studentProfile.upsert({
    where: { id: 'student-pending-moderation' },
    update: {
      userId: uPend.id,
      fullName: 'Pending Moderation Student',
      isActivated: true,
      moderationStatus: ModerationStatus.PENDING_REVIEW,
    },
    create: {
      id: 'student-pending-moderation',
      userId: uPend.id,
      fullName: 'Pending Moderation Student',
      headline: 'Candidate in review',
      about: 'Profile currently pending administrator moderation.',
      publicSlug: 'pending-student',
      completenessScore: 85,
      isActivated: true,
      moderationStatus: ModerationStatus.PENDING_REVIEW,
    },
  });

  console.log('✅ Seed completed successfully with verified candidates & test accounts!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
