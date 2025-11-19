import 'server-only';
import { headers } from 'next/headers';
import { db as prisma, getOrCreateRequestId, logger } from '@/shared/lib';
import type { TRPCContext } from './context';

export const createTRPCContext = async (): Promise<TRPCContext> => {
  const headersList = await headers();
  const requestId = getOrCreateRequestId(headersList);

  logger.debug({ requestId }, 'tRPC context created');

  return {
    db: prisma,
    requestId,
    isAuthenticated: false,
  };
};

// Re-export from procedures for server-side use
export {
  createTRPCRouter,
  createCallerFactory,
  publicProcedure,
  protectedProcedure,
  premiumProcedure,
} from './procedures';
