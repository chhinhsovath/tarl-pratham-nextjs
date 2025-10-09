import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
  isConnecting: boolean;
};

// Create PrismaClient with Supabase pgBouncer configuration
const createPrismaClient = () => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
    // Supabase pgBouncer (port 6543) handles connection pooling
    // Ensure DATABASE_URL includes: pgbouncer=true&connection_limit=5&pool_timeout=10&statement_cache_size=0
  });

  return client;
};

// Use singleton pattern in both development and production to prevent connection leaks
export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
} else if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}

// Ensure connection is established for serverless environments
export async function connectPrisma() {
  if (globalForPrisma.isConnecting) {
    // Wait for existing connection attempt
    await new Promise(resolve => setTimeout(resolve, 100));
    return prisma;
  }

  try {
    globalForPrisma.isConnecting = true;
    // Test connection with a simple query
    await prisma.$queryRaw`SELECT 1`;
    return prisma;
  } catch (error) {
    console.error('Prisma connection error:', error);
    throw error;
  } finally {
    globalForPrisma.isConnecting = false;
  }
}

// Graceful shutdown
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}