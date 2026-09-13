const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Adithya Krishna (Video Editor) ---');
  const passwordHash = await bcrypt.hash('Password@123', 10);

  const adithyaUser = await prisma.user.upsert({
    where: { email: 'adithya.editor@gmail.com' },
    update: { status: 'ACTIVE', role: 'STUDENT', passwordHash },
    create: {
      email: 'adithya.editor@gmail.com',
      phone: '+91 96560 55667',
      passwordHash,
      role: 'STUDENT',
      status: 'ACTIVE',
    },
  });

  const adithyaProfile = await prisma.studentProfile.upsert({
    where: { userId: adithyaUser.id },
    update: {
      fullName: 'Adithya Krishna',
      headline: 'Commercial Video Editor & Motion Designer | Premiere Pro & After Effects | BA 2025',
      about: 'Cinematic video editor, colorist, and motion graphic artist specializing in high-energy brand commercials, product teasers, YouTube storytelling, and dynamic social media reels. Expert in DaVinci Resolve color grading, Adobe Premiere Pro pace editing, and After Effects kinetic typography.',
      city: 'Kochi',
      country: 'India',
      isActivated: true,
      activatedAt: new Date(),
      moderationStatus: 'APPROVED',
      completenessScore: 97,
      publicSlug: 'adithya-krishna',
      cvFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      cvFileName: 'Adithya_Krishna_Video_Editor_Resume.pdf',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    },
    create: {
      userId: adithyaUser.id,
      fullName: 'Adithya Krishna',
      headline: 'Commercial Video Editor & Motion Designer | Premiere Pro & After Effects | BA 2025',
      about: 'Cinematic video editor, colorist, and motion graphic artist specializing in high-energy brand commercials, product teasers, YouTube storytelling, and dynamic social media reels. Expert in DaVinci Resolve color grading, Adobe Premiere Pro pace editing, and After Effects kinetic typography.',
      city: 'Kochi',
      country: 'India',
      isActivated: true,
      activatedAt: new Date(),
      moderationStatus: 'APPROVED',
      completenessScore: 97,
      publicSlug: 'adithya-krishna',
      cvFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      cvFileName: 'Adithya_Krishna_Video_Editor_Resume.pdf',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    },
  });

  await prisma.project.deleteMany({ where: { studentId: adithyaProfile.id } });
  await prisma.project.create({
    data: {
      studentId: adithyaProfile.id,
      title: 'Pulse Energy Drink — 4K Cinematic Commercial & 3D Motion Teaser',
      role: 'Lead Video Editor, Sound Designer & Colorist',
      description: 'Fast-paced commercial spot edited for a youth energy beverage brand with custom sound design, sound foley, 3D can compositing, and cinematic teal-orange color grade in DaVinci Resolve.',
      toolsUsed: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve Studio', 'Adobe Audition', 'Blender'],
      skillsDemonstrated: ['Video Editing', 'Color Grading', 'Sound Design', 'Motion Graphics', 'Cinematography'],
      projectLink: 'https://vimeo.com/adithyakrishna/pulse-commercial',
      liveDemoUrl: 'https://vimeo.com/adithyakrishna/pulse-commercial',
      mediaUrls: [
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80',
      ],
      techStack: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Sound Design'],
      orderIndex: 0,
    },
  });

  await prisma.project.create({
    data: {
      studentId: adithyaProfile.id,
      title: 'Kochi Metro Art & Cultural Docu-Reel',
      role: 'Documentary Editor & Motion Animator',
      description: 'A 3-minute visual journey celebrating street art and local culture along the Kochi Metro stations with smooth speed-ramps and kinetic typography.',
      toolsUsed: ['Premiere Pro', 'After Effects', 'Lumetri Color'],
      skillsDemonstrated: ['Pacing & Storytelling', 'Kinetic Typography', 'Speed Ramping', 'Audio Mastering'],
      projectLink: 'https://www.behance.net/gallery/kochi-metro-docureel',
      liveDemoUrl: 'https://vimeo.com/adithyakrishna/kochi-metro-story',
      mediaUrls: [
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
      ],
      techStack: ['Premiere Pro', 'Motion Graphics', 'Kinetic Typography'],
      orderIndex: 1,
    },
  });

  await prisma.workSample.deleteMany({ where: { studentId: adithyaProfile.id } });
  await prisma.workSample.create({
    data: {
      studentId: adithyaProfile.id,
      title: 'Commercial Motion Reel 2025 (4K Showreel)',
      category: 'CONTENT',
      description: '60-second compilation of cinematic brand promos, kinetic typography, dynamic transitions, and sound-synced cuts.',
      toolsUsed: ['Premiere Pro', 'After Effects', 'Boris FX'],
      clientOrContext: "Annual Director's Showreel",
      workLink: 'https://vimeo.com/adithyakrishna/showreel2025',
      mediaUrls: ['https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80'],
      orderIndex: 0,
    },
  });

  await prisma.workSample.create({
    data: {
      studentId: adithyaProfile.id,
      title: 'Viral Instagram & TikTok Reels Package for Tech Creators',
      category: 'SOCIAL_MEDIA',
      description: 'Package of 12 vertical reels with animated subtitles, zoom micro-cuts, sound effects, and B-roll overlays achieving over 1.2M collective views.',
      toolsUsed: ['Premiere Pro', 'After Effects', 'CapCut Pro'],
      clientOrContext: 'Tech Malayalam Creator Channel',
      workLink: 'https://www.instagram.com/reel/sample-viral-tech',
      mediaUrls: ['https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80'],
      orderIndex: 1,
    },
  });

  await prisma.education.deleteMany({ where: { studentId: adithyaProfile.id } });
  await prisma.education.create({
    data: {
      studentId: adithyaProfile.id,
      institutionName: 'Amrita School of Arts and Sciences / CUSAT',
      degree: 'Bachelor of Arts (BA)',
      fieldOfStudy: 'Visual Media & Film Production',
      startYear: 2022,
      endYear: 2025,
      gradeOrCgpa: '8.6 CGPA',
    },
  });

  await prisma.studentSkill.deleteMany({ where: { studentId: adithyaProfile.id } });
  const adithyaSkills = [
    { name: 'Adobe Premiere Pro', level: 'ADVANCED', verified: true },
    { name: 'Adobe After Effects', level: 'ADVANCED', verified: true },
    { name: 'DaVinci Resolve (Color Grading)', level: 'ADVANCED', verified: true },
    { name: 'Sound Design & Audio Mixing', level: 'ADVANCED', verified: true },
    { name: 'Kinetic Typography', level: 'ADVANCED', verified: true },
    { name: 'Motion Graphics', level: 'ADVANCED', verified: true },
  ];
  for (const s of adithyaSkills) {
    await prisma.studentSkill.create({
      data: {
        studentId: adithyaProfile.id,
        skillName: s.name,
        proficiencyLevel: s.level,
        isVerified: s.verified,
      },
    });
  }

  await prisma.certificate.deleteMany({ where: { studentId: adithyaProfile.id } });
  await prisma.certificate.create({
    data: {
      studentId: adithyaProfile.id,
      name: 'Adobe Certified Professional in Video Design',
      issuingOrganization: 'Adobe Certified Associate',
      issueDate: new Date('2024-07-20'),
      credentialUrl: 'https://www.certiport.com/portal/pages/credentialverification.aspx?id=adithya-video',
    },
  });

  await prisma.careerPreference.deleteMany({ where: { studentId: adithyaProfile.id } });
  await prisma.careerPreference.create({
    data: {
      studentId: adithyaProfile.id,
      preferredRoles: ['Video Editor', 'Motion Graphics Artist', 'Content Creator', 'Colorist'],
      preferredIndustries: ['Media & Entertainment', 'Advertising Agencies', 'EdTech'],
      preferredCountries: ['India', 'United Arab Emirates'],
      workModes: ['HYBRID', 'REMOTE'],
      workMode: 'HYBRID',
      relocationWillingness: 'WILLING',
      availability: 'IMMEDIATE',
      preferredWorkTypes: ['FULL_TIME'],
      expectedSalaryMin: 550000,
      salaryCurrency: 'INR',
    },
  });

  console.log('✅ Successfully seeded Adithya Krishna');
}

main().finally(() => prisma.$disconnect());
