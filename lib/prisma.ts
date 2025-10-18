import { PrismaClient } from '@prisma/client';

// Global singleton to prevent multiple Prisma instances
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Optimized Prisma Client for serverless with aggressive connection pooling
const createPrismaClient = () => {
  // Build DATABASE_URL with connection pooling parameters for serverless
  const databaseUrl = process.env.DATABASE_URL || '';

  // Add connection pooling parameters if not already present
  let pooledUrl = databaseUrl;
  if (process.env.NODE_ENV === 'production' && !databaseUrl.includes('connection_limit')) {
    const separator = databaseUrl.includes('?') ? '&' : '?';
    // CRITICAL: ULTRA-AGGRESSIVE pooling to prevent "Too many connections" error
    // connection_limit=1: Max 1 connection per serverless instance (down from 5)
    // pool_timeout=5: Release idle connections after 5 seconds (down from 10)
    // connect_timeout=10: Timeout for new connections
    // This trades per-function performance for system-wide stability in serverless
    pooledUrl = `${databaseUrl}${separator}connection_limit=1&pool_timeout=5&connect_timeout=10`;
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

// CRITICAL: Explicit connection cleanup for serverless
// Ensures connections are released when serverless function terminates
if (process.env.NODE_ENV === 'production') {
  // Graceful shutdown handlers
  process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

  // Vercel serverless cleanup (called when function is about to be killed)
  if (typeof window === 'undefined' && process.env.VERCEL) {
    process.on('beforeExit', async () => {
      await prisma.$disconnect();
    });
  }
}