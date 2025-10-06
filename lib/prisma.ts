import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

// Create PrismaClient with connection pooling configuration
const createPrismaClient = () => {
  // Add connection pooling parameters to DATABASE_URL if not already present
  const databaseUrl = process.env.DATABASE_URL || '';
  const hasPooling = databaseUrl.includes('connection_limit') || databaseUrl.includes('pool_timeout');

  const urlWithPooling = hasPooling
    ? databaseUrl
    : `${databaseUrl}${databaseUrl.includes('?') ? '&' : '?'}connection_limit=5&pool_timeout=10`;

  return new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['error', 'warn'],
    datasources: {
      db: {
        url: urlWithPooling,
      },
    },
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