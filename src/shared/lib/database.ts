/**
 * Prisma Database Client
 * Singleton instance with query logging and performance monitoring
 */

import { PrismaClient } from '@/prisma/generated';
import { logger } from './logger';
import { isDevelopment } from '@/core/config/env';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'warn' },
    ],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Query logging and performance monitoring
if (isDevelopment) {
  prisma.$on('query' as never, (e: { query: string; duration: number; params: string }) => {
    if (e.duration > 1000) {
      logger.warn(
        { query: e.query, params: e.params, duration: e.duration },
        'Slow query detected'
      );
    } else {
      logger.debug({ query: e.query, duration: e.duration }, 'Database query');
    }
  });

  prisma.$on('error' as never, (e: { message: string; target: string }) => {
    logger.error({ message: e.message, target: e.target }, 'Database error');
  });

  prisma.$on('warn' as never, (e: { message: string; target: string }) => {
    logger.warn({ message: e.message, target: e.target }, 'Database warning');
  });
}

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}

export default prisma;
