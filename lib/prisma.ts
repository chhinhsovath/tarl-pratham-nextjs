import { PrismaClient } from '@prisma/client';

// Global singleton to prevent multiple Prisma instances
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Optimized Prisma Client for serverless
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
  });
};

// Singleton pattern: reuse same instance across serverless function invocations
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// In development, store in global to survive HMR (Hot Module Replacement)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}