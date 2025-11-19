/**
 * Request ID Utilities
 * Generate and manage request IDs for tracing
 */

import { getOrCreateRequestId as getOrCreate } from '../infrastructure/request-id';

export const getOrCreateRequestId = getOrCreate;
