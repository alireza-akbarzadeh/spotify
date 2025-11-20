import { inngest } from '@/core/inngest/client';
import { NonRetriableError } from 'inngest';

export const excecuteWorkflow = inngest.createFunction(
  { id: 'execute-workflow' },
  { event: 'workflows/execute.workflow' },
  async ({ event, step }) => {
    const { workflowId } = event.data;
    if (!workflowId) throw new NonRetriableError('workflowId is missing');
  }
);
