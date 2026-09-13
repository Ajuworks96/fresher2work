const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Multi-Domain Creative Candidates (UI/UX, Marketing, Video) ---');
  const passwordHash = await bcrypt.hash('Password@123', 10);

  // 1. Devika Nair (UI/UX & Product Designer)
  const devikaUser = await prisma.user.upsert({
    where: { email: 'devika.design@gmail.com' },
    update: { status: 'ACTIVE', role: 'STUDENT', passwordHash },
    create: {
      email: 'devika.design@gmail.com',
      phone: '+91 98460 11223',
      passwordHash,
      role: 'STUDENT',
      status: 'ACTIVE',
    },
  });

  const devikaProfile = await prisma.studentProfile.upsert({
    where: { userId: devikaUser.id },
    update: {
      fullName: 'Devika Nair',
      headline: 'UI/UX & Product Designer | Design Systems & Mobile Prototyping | B.Des 2025',
      about: 'Passionate product designer crafting intuitive, accessible digital experiences with Figma, interactive prototyping, user research, and comprehensive design systems. Designed end-to-end mobile banking and telehealth flows with 40+ user-tested screens.',
      city: 'Kochi',
      country: 'India',
      isActivated: true,
      activatedAt: new Date(),
      moderationStatus: 'APPROVED',
      completenessScore: 98,
      publicSlug: 'devika-nair',
      cvFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      cvFileName: 'Devika_Nair_Product_Designer_Resume.pdf',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    },
    create: {
      userId: devikaUser.id,
      fullName: 'Devika Nair',
      headline: 'UI/UX & Product Designer | Design Systems & Mobile Prototyping | B.Des 2025',
      about: 'Passionate product designer crafting intuitive, accessible digital experiences with Figma, interactive prototyping, user research, and comprehensive design systems. Designed end-to-end mobile banking and telehealth flows with 40+ user-tested screens.',
      city: 'Kochi',
      country: 'India',
      isActivated: true,
      activatedAt: new Date(),
      moderationStatus: 'APPROVED',
      completenessScore: 98,
      publicSlug: 'devika-nair',
      cvFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      cvFileName: 'Devika_Nair_Product_Designer_Resume.pdf',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    },
  });

  // Projects for Devika
  await prisma.project.deleteMany({ where: { studentId: devikaProfile.id } });
  await prisma.project.create({
    data: {
      studentId: devikaProfile.id,
      title: 'FinPay — Next-Gen Neobanking Mobile App Experience',
      role: 'Lead Product Designer',
      description: 'Complete end-to-end UX case study, user journey mapping, accessibility-compliant design system, and micro-interaction prototypes for UPI payments, multi-currency wallets, and investment analytics.',
      toolsUsed: ['Figma', 'Miro', 'Protopie', 'Adobe Illustrator', 'Design Tokens'],
      skillsDemonstrated: ['User Interface (UI)', 'User Experience (UX)', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing'],
      projectLink: 'https://www.behance.net/gallery/finpay-ux-case-study',
      liveDemoUrl: 'https://www.figma.com/proto/finpay-neobank-flow',
      mediaUrls: [
        'https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
      ],
      techStack: ['Figma', 'Protopie', 'Design System', 'Miro', 'Mobile UI'],
      orderIndex: 0,
    },
  });

  await prisma.project.create({
    data: {
      studentId: devikaProfile.id,
      title: 'Aura — Meditative Wellness & Habit Tracker',
      role: 'UI/UX Researcher & Visual Designer',
      description: 'Calming, minimalist iOS mindfulness application featuring dark-mode haptic breathing exercises, weekly habit rings, and personalized audio meditations.',
      toolsUsed: ['Figma', 'Principle', 'Spline 3D', 'Adobe Photoshop'],
      skillsDemonstrated: ['Mobile UI Design', 'Visual Hierarchy', 'Micro-interactions', 'Design Research'],
      projectLink: 'https://dribbble.com/shots/aura-wellness-app',
      liveDemoUrl: 'https://www.figma.com/proto/aura-mindfulness-ui',
      mediaUrls: [
        'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=800&auto=format&fit=crop&q=80',
      ],
      techStack: ['Figma', 'Dark Mode UI', 'Spline 3D', 'iOS Design'],
      orderIndex: 1,
    },
  });

  // Work samples for Devika
  await prisma.workSample.deleteMany({ where: { studentId: devikaProfile.id } });
  await prisma.workSample.create({
    data: {
      studentId: devikaProfile.id,
      title: 'FinPay Enterprise Design System & Component Library',
      category: 'GRAPHIC_DESIGN',
      description: 'Comprehensive Figma design library with 120+ atomic components, color variables, accessible typography scales, and interactive states.',
      toolsUsed: ['Figma Variables', 'Auto-Layout', 'WCAG 2.1'],
      clientOrContext: 'FinPay Neobank Design System Spec',
      workLink: 'https://www.figma.com/community/file/finpay-ds-kit',
      mediaUrls: ['https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'],
      orderIndex: 0,
    },
  });
  await prisma.workSample.create({
    data: {
      studentId: devikaProfile.id,
      title: 'Kalyan Heritage Branding & Packaging Identity',
      category: 'BRANDING',
      description: 'Traditional-modern fusion visual identity, vector logo mark, bespoke typography, and retail packaging mockups for an artisanal spice brand.',
      toolsUsed: ['Adobe Illustrator', 'Photoshop 3D', 'Typography'],
      clientOrContext: 'Kalyan Spices Kerala',
      workLink: 'https://www.behance.net/gallery/kalyan-heritage-branding',
      mediaUrls: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'],
      orderIndex: 1,
    },
  });

  // Education for Devika
  await prisma.education.deleteMany({ where: { studentId: devikaProfile.id } });
  await prisma.education.create({
    data: {
      studentId: devikaProfile.id,
      institutionName: 'National Institute of Design (NID) / CUSAT',
      degree: 'Bachelor of Design (B.Des)',
      fieldOfStudy: 'Communication Design & UI/UX',
      startYear: 2021,
      endYear: 2025,
      gradeOrCgpa: '8.8 CGPA',
    },
  });

  // Skills for Devika
  await prisma.studentSkill.deleteMany({ where: { studentId: devikaProfile.id } });
  const devikaSkills = [
    { name: 'Figma', level: 'ADVANCED', verified: true },
    { name: 'UI/UX Design', level: 'ADVANCED', verified: true },
    { name: 'Design Systems', level: 'ADVANCED', verified: true },
    { name: 'Wireframing & Prototyping', level: 'ADVANCED', verified: true },
    { name: 'Adobe Illustrator', level: 'ADVANCED', verified: true },
    { name: 'User Research', level: 'INTERMEDIATE', verified: true },
  ];
  for (const s of devikaSkills) {
    await prisma.studentSkill.create({
      data: {
        studentId: devikaProfile.id,
        skillName: s.name,
        proficiencyLevel: s.level,
        isVerified: s.verified,
      },
    });
  }

  // Certificates for Devika
  await prisma.certificate.deleteMany({ where: { studentId: devikaProfile.id } });
  await prisma.certificate.create({
    data: {
      studentId: devikaProfile.id,
      name: 'Google UX Design Professional Certificate',
      issuingOrganization: 'Google / Coursera',
      issueDate: new Date('2024-08-15'),
      credentialUrl: 'https://coursera.org/verify/professional-cert/google-ux-devika',
    },
  });

  // Career Preferences for Devika
  await prisma.careerPreference.deleteMany({ where: { studentId: devikaProfile.id } });
  await prisma.careerPreference.create({
    data: {
      studentId: devikaProfile.id,
      preferredRoles: ['UI/UX Designer', 'Product Designer', 'Interaction Designer'],
      preferredIndustries: ['Technology', 'Fintech', 'Digital Products'],
      preferredCountries: ['India', 'United Arab Emirates'],
      workModes: ['REMOTE', 'HYBRID'],
      workMode: 'REMOTE',
      relocationWillingness: 'WILLING',
      availability: 'IMMEDIATE',
      preferredWorkTypes: ['FULL_TIME'],
      expectedSalaryMin: 600000,
      salaryCurrency: 'INR',
    },
  });

  // 2. Kavya Ramesh (Digital Marketing & Performance Growth)
  const kavyaUser = await prisma.user.upsert({
    where: { email: 'kavya.marketing@gmail.com' },
    update: { status: 'ACTIVE', role: 'STUDENT', passwordHash },
    create: {
      email: 'kavya.marketing@gmail.com',
      phone: '+91 97450 33445',
      passwordHash,
      role: 'STUDENT',
      status: 'ACTIVE',
    },
  });

  const kavyaProfile = await prisma.studentProfile.upsert({
    where: { userId: kavyaUser.id },
    update: {
      fullName: 'Kavya Ramesh',
      headline: 'Performance Marketer & Growth Strategist | Google Ads, Meta Ads & SEO | BBA 2025',
      about: 'Data-driven digital marketing and growth specialist with hands-on expertise in performance advertising (Meta & Google Ads), SEO audits, keyword ranking, and conversion rate optimization (CRO). Generated ₹18L+ revenue across D2C and SaaS pilot campaigns with an average 4.2x ROAS.',
      city: 'Kozhikode',
      country: 'India',
      isActivated: true,
      activatedAt: new Date(),
      moderationStatus: 'APPROVED',
      completenessScore: 96,
      publicSlug: 'kavya-ramesh',
      cvFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      cvFileName: 'Kavya_Ramesh_Digital_Marketing_Resume.pdf',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    },
    create: {
      userId: kavyaUser.id,
      fullName: 'Kavya Ramesh',
      headline: 'Performance Marketer & Growth Strategist | Google Ads, Meta Ads & SEO | BBA 2025',
      about: 'Data-driven digital marketing and growth specialist with hands-on expertise in performance advertising (Meta & Google Ads), SEO audits, keyword ranking, and conversion rate optimization (CRO). Generated ₹18L+ revenue across D2C and SaaS pilot campaigns with an average 4.2x ROAS.',
      city: 'Kozhikode',
      country: 'India',
      isActivated: true,
      activatedAt: new Date(),
      moderationStatus: 'APPROVED',
      completenessScore: 96,
      publicSlug: 'kavya-ramesh',
      cvFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      cvFileName: 'Kavya_Ramesh_Digital_Marketing_Resume.pdf',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    },
  });

  // Projects for Kavya
  await prisma.project.deleteMany({ where: { studentId: kavyaProfile.id } });
  await prisma.project.create({
    data: {
      studentId: kavyaProfile.id,
      title: 'EcoRoots D2C Paid Ads & Multi-Channel Scaling Campaign',
      role: 'Performance Marketing Lead',
      description: 'Executed multi-funnel Meta and Google Performance Max campaigns for an organic skincare D2C brand, achieving ₹12.4 Lakhs revenue, 4.2x blended ROAS, and 38% reduction in Customer Acquisition Cost (CAC).',
      toolsUsed: ['Meta Ads Manager', 'Google Ads', 'Google Analytics 4', 'Shopify Analytics', 'Looker Studio'],
      skillsDemonstrated: ['Paid Advertising', 'ROAS Optimization', 'Audience Segmentation', 'Funnel Strategy', 'A/B Testing'],
      projectLink: 'https://kavyaramesh.notion.site/ecoroots-case-study',
      liveDemoUrl: 'https://lookerstudio.google.com/reporting/ecoroots-perf-dashboard',
      mediaUrls: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      ],
      techStack: ['Google Ads', 'Meta Ads', 'GA4', 'Looker Studio', 'CRO'],
      orderIndex: 0,
    },
  });

  await prisma.project.create({
    data: {
      studentId: kavyaProfile.id,
      title: 'SaaSify — B2B SEO & Organic Traffic Growth Strategy',
      role: 'SEO & Content Strategist',
      description: 'Conducted technical SEO audit, high-intent keyword mapping, and programmatic content strategy resulting in +240% organic impressions and 18 First-Page Google rankings within 4 months.',
      toolsUsed: ['Semrush', 'Ahrefs', 'Google Search Console', 'Screaming Frog', 'Canva'],
      skillsDemonstrated: ['Technical SEO', 'Keyword Research', 'Content Marketing', 'Backlink Outreach'],
      projectLink: 'https://kavyaramesh.notion.site/saasify-seo-strategy',
      liveDemoUrl: 'https://search.google.com/search-console/demo-report',
      mediaUrls: [
        'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&auto=format&fit=crop&q=80',
      ],
      techStack: ['SEO', 'Semrush', 'Ahrefs', 'Search Console', 'Content Marketing'],
      orderIndex: 1,
    },
  });

  // Work samples for Kavya
  await prisma.workSample.deleteMany({ where: { studentId: kavyaProfile.id } });
  await prisma.workSample.create({
    data: {
      studentId: kavyaProfile.id,
      title: 'High-Converting Meta Ad Creatives & Video Hook Scripts',
      category: 'CAMPAIGN',
      description: 'Developed 15 high-converting static & UGC video hooks for Facebook and Instagram feeds resulting in a 3.4% click-through rate (CTR).',
      toolsUsed: ['Canva Pro', 'CapCut', 'Meta Creative Hub'],
      clientOrContext: 'EcoRoots Summer Skincare Launch',
      workLink: 'https://www.canva.com/design/ecoroots-ad-creatives-preview',
      mediaUrls: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80'],
      orderIndex: 0,
    },
  });

  // Education for Kavya
  await prisma.education.deleteMany({ where: { studentId: kavyaProfile.id } });
  await prisma.education.create({
    data: {
      studentId: kavyaProfile.id,
      institutionName: 'Farook Institute of Management Studies / Calicut University',
      degree: 'Bachelor of Business Administration (BBA)',
      fieldOfStudy: 'Marketing & Business Analytics',
      startYear: 2022,
      endYear: 2025,
      gradeOrCgpa: '8.5 CGPA',
    },
  });

  // Skills for Kavya
  await prisma.studentSkill.deleteMany({ where: { studentId: kavyaProfile.id } });
  const kavyaSkills = [
    { name: 'Google Ads (PMax & Search)', level: 'ADVANCED', verified: true },
    { name: 'Meta Ads Manager', level: 'ADVANCED', verified: true },
    { name: 'Search Engine Optimization (SEO)', level: 'ADVANCED', verified: true },
    { name: 'Google Analytics 4 (GA4)', level: 'ADVANCED', verified: true },
    { name: 'Conversion Rate Optimization', level: 'ADVANCED', verified: true },
    { name: 'Semrush & Keyword Research', level: 'ADVANCED', verified: true },
  ];
  for (const s of kavyaSkills) {
    await prisma.studentSkill.create({
      data: {
        studentId: kavyaProfile.id,
        skillName: s.name,
        proficiencyLevel: s.level,
        isVerified: s.verified,
      },
    });
  }

  // Certificates for Kavya
  await prisma.certificate.deleteMany({ where: { studentId: kavyaProfile.id } });
  await prisma.certificate.create({
    data: {
      studentId: kavyaProfile.id,
      name: 'Google Ads Search & Display Certification',
      issuingOrganization: 'Google Skillshop',
      issueDate: new Date('2024-09-10'),
      credentialUrl: 'https://skillshop.credential.net/google-ads-kavya',
    },
  });

  // Career Preferences for Kavya
  await prisma.careerPreference.deleteMany({ where: { studentId: kavyaProfile.id } });
  await prisma.careerPreference.create({
    data: {
      studentId: kavyaProfile.id,
      preferredRoles: ['Digital Marketing Specialist', 'Performance Marketer', 'Growth Associate', 'SEO Specialist'],
      preferredIndustries: ['E-Commerce', 'Digital Agencies', 'SaaS'],
      preferredCountries: ['India', 'United Arab Emirates'],
      workModes: ['HYBRID', 'ON_SITE', 'REMOTE'],
      workMode: 'HYBRID',
      relocationWillingness: 'WILLING',
      availability: 'IMMEDIATE',
      preferredWorkTypes: ['FULL_TIME'],
      expectedSalaryMin: 500000,
      salaryCurrency: 'INR',
    },
  });

  // 3. Adithya Krishna (Commercial Video Editor & Motion Designer)
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

  // Projects for Adithya
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

  // Work samples for Adithya
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

  // Education for Adithya
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

  // Skills for Adithya
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

  // Certificates for Adithya
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

  // Career Preferences for Adithya
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

  console.log('✅ Successfully seeded multi-domain creative candidates: Devika (UI/UX), Kavya (Marketing), Adithya (Video Editor)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
