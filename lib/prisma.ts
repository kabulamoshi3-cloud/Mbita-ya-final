import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Use POSTGRES_PRISMA_URL for Vercel/Neon pooling, fallback to others
let databaseUrl = 
  process.env.POSTGRES_PRISMA_URL || 
  process.env.POSTGRES_URL || 
  process.env.DATABASE_URL;

// Add connection pooling parameters to prevent "too many connections" error
// Render free PostgreSQL has limited connection slots
if (databaseUrl && !databaseUrl.includes('connection_limit')) {
  const separator = databaseUrl.includes('?') ? '&' : '?';
  databaseUrl = `${databaseUrl}${separator}connection_limit=5&pool_timeout=10`;
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ 
    log: ['error'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
