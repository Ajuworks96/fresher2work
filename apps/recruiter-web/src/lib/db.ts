import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const SUPABASE_DB_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres.sxsiarjhqgvzsqmwscap:FresherToWork%402026@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres?sslmode=require&connection_limit=3&connect_timeout=15&pgbouncer=true';

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: SUPABASE_DB_URL,
      },
    },
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
