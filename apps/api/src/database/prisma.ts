import { PrismaClient } from '@prisma/client';
import { ENV } from '../config/env';

// Prevent multiple PrismaClient instances in development mode (hot reloading)
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  global.prismaGlobal ||
  new PrismaClient({
    log: ENV.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (ENV.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma;
}
