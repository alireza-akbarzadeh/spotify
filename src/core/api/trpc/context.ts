import { db as prisma } from '@/shared/lib';

export type TRPCContext = {
  db: typeof prisma;
  requestId: string;
  userId?: string;
  isAuthenticated: boolean;
};
