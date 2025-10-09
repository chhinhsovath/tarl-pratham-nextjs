import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

// Create PrismaClient with Supabase pgBouncer configuration
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
    // Supabase pgBouncer (port 6543) handles connection pooling
    // Ensure DATABASE_URL includes: pgbouncer=true&connection_limit=5&pool_timeout=10
  });
};

// Use singleton pattern in both development and production to prevent connection leaks
export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
} else if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}