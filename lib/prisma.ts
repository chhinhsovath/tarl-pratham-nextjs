import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

// DEVELOPMENT: Always create fresh instance to avoid cached schema issues
// PRODUCTION: Use singleton for connection pooling
export const prisma =
  process.env.NODE_ENV === 'production'
    ? (globalForPrisma.prisma ||
        new PrismaClient({
          log: ['error'],
        }))
    : new PrismaClient({
        log: ['query', 'error', 'warn'],
      });

// Only cache in production
if (process.env.NODE_ENV === 'production' && !globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}