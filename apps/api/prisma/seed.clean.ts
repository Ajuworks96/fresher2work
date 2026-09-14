import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Starting FresherToWork Production Clean Database Reset...');

  // 1. Delete all dummy/test candidates, recruiters, payments, and work samples
  console.log('🗑️ Cleaning out dummy candidates, work samples, payments, and recruiter records...');
  await prisma.auditLog.deleteMany({});
  await prisma.profileView.deleteMany({});
  await prisma.recruiterSavedCandidate.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.profileActivation.deleteMany({});
  await prisma.cvFile.deleteMany({});
  await prisma.careerPreference.deleteMany({});
  await prisma.preferredLocation.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.workSample.deleteMany({});
  await prisma.projectMedia.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.studentSkill.deleteMany({});
  await prisma.education.deleteMany({});
  await prisma.studentProfile.deleteMany({});
  await prisma.recruiterProfile.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✅ All dummy test data successfully wiped.');

  // 2. Provision Official Superadmin Account
  console.log('🔑 Provisioning Official Platform Superadmin Account...');
  const superadminEmail = 'superadmin@freshertowork.com';
  const superadminPassword = 'SuperAdmin@Pass2026#';
  const adminPasswordHash = await bcrypt.hash(superadminPassword, 10);

  const superadmin = await prisma.user.create({
    data: {
      id: 'c8446f3a-f798-433b-9938-c8439fab1c2a',
      email: superadminEmail,
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  console.log('====================================================');
  console.log('🎉 Clean Production Database Initialization Complete!');
  console.log('====================================================');
  console.log(`Role:             Platform Superadmin / Administrator`);
  console.log(`Email:            ${superadmin.email}`);
  console.log(`Password:         ${superadminPassword}`);
  console.log(`User ID:          ${superadmin.id}`);
  console.log('====================================================');
}

main()
  .catch((e) => {
    console.error('❌ Error during clean seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
