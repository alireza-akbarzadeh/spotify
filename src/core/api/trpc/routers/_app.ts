// New architecture routers
import { workflowsRouter } from '@/src/features/workflows/api';
import { executionRouter } from '@/src/features/executions/api';
import { playerRouter } from '@/src/features/player/services/player.service';
import { createTRPCRouter } from '../init';
import { exampleRouter } from '@/src/core/api/trpc/routers/example-router';

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  execution: executionRouter,
  example: exampleRouter,
  player: playerRouter,
});

export type AppRouter = typeof appRouter;
