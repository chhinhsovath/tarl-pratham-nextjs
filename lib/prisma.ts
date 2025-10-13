import { PrismaClient } from '@prisma/client';

// Global singleton to prevent multiple Prisma instances
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Optimized Prisma Client for serverless with connection pooling
const createPrismaClient = () => {
  // Build DATABASE_URL with connection pooling parameters for serverless
  const databaseUrl = process.env.DATABASE_URL || '';

  // Add connection pooling parameters if not already present
  let pooledUrl = databaseUrl;
  if (process.env.NODE_ENV === 'production' && !databaseUrl.includes('connection_limit')) {
    const separator = databaseUrl.includes('?') ? '&' : '?';
    pooledUrl = `${databaseUrl}${separator}connection_limit=2&pool_timeout=20`;
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
    datasources: {
      db: {
        url: pooledUrl,
      },
    },
  });
};

// Singleton pattern: reuse same instance across serverless function invocations
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// In development, store in global to survive HMR (Hot Module Replacement)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}