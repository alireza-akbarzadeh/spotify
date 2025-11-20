/**
 * Request ID Management for Upstash Rate Limiting
 *
 * Generates unique request identifiers for rate limiting with Upstash Redis
 * Used to track and limit API requests per user/IP with distributed rate limiting
 */

import { createId } from '@paralleldrive/cuid2';
import { AsyncLocalStorage } from 'async_hooks';

/**
 * AsyncLocalStorage instance for storing request context
 * Used by Upstash rate limiting to track requests across async operations
 */
const requestContext = new AsyncLocalStorage<Map<string, string>>();

/**
 * Get the current request ID from async context
 * Returns undefined if no request ID is set
 *
 * Used by rate limiter to identify the current request
 */
export function getRequestId(): string | undefined {
  const store = requestContext.getStore();
  return store?.get('requestId');
}

/**
 * Get or create a request ID for rate limiting
 * If a request ID exists in context, returns it
 * Otherwise generates a new CUID2 for tracking in Upstash Redis
 *
 * This ID is used as part of the rate limit key in Redis
 */
export function getOrCreateRequestId(): string {
  let requestId = getRequestId();

  if (!requestId) {
    requestId = createId();
    setRequestId(requestId);
  }

  return requestId;
}

/**
 * Set the request ID in async context
 * Used by middleware to propagate request ID to rate limiter
 */
export function setRequestId(requestId: string): void {
  const store = requestContext.getStore();
  if (store) {
    store.set('requestId', requestId);
  }
}

/**
 * Run a function with a request ID in async context
 * Creates a new async context with the given request ID
 *
 * Essential for Upstash rate limiting to work correctly across async boundaries
 *
 * @param requestId - The request ID to use for rate limiting, or generates a new one
 * @param fn - The function to run within the request context
 */
export function runWithRequestId<T>(requestId: string | undefined, fn: () => T): T {
  const id = requestId || createId();
  const store = new Map<string, string>();
  store.set('requestId', id);

  return requestContext.run(store, fn);
}

/**
 * Extract request ID from headers for rate limiting
 * Supports common request ID headers used in distributed systems
 *
 * The extracted ID is used to:
 * - Track requests in Upstash Redis
 * - Correlate rate limit violations
 * - Debug rate limiting issues
 *
 * Headers checked (in order):
 * - x-request-id: Standard request tracking header
 * - x-correlation-id: Distributed tracing header
 * - x-trace-id: APM/tracing header
 */
export function extractRequestId(
  headers: Headers | Record<string, string | string[] | undefined>
): string {
  // Handle Headers object (Web API)
  if (headers instanceof Headers) {
    return (
      headers.get('x-request-id') ||
      headers.get('x-correlation-id') ||
      headers.get('x-trace-id') ||
      createId()
    );
  }

  // Handle plain object (Node.js)
  const requestId = headers['x-request-id'] || headers['x-correlation-id'] || headers['x-trace-id'];

  if (Array.isArray(requestId)) {
    return requestId[0] || createId();
  }

  return requestId || createId();
}

/**
 * Generate a rate limit key for Upstash Redis
 * Combines identifier (user ID, IP, etc.) with request ID for unique tracking
 *
 * @param identifier - User ID, IP address, or other identifying string
 * @param prefix - Optional prefix for the key (default: 'ratelimit')
 * @returns Redis key for rate limiting
 */
export function getRateLimitKey(identifier: string, prefix: string = 'ratelimit'): string {
  const requestId = getOrCreateRequestId();
  return `${prefix}:${identifier}:${requestId}`;
}

/**
 * Example usage with Upstash Rate Limiting:
 *
 * // In API middleware:
 * import { Ratelimit } from '@upstash/ratelimit';
 * import { Redis } from '@upstash/redis';
 * import { extractRequestId, runWithRequestId, getRateLimitKey } from './request-id';
 *
 * const redis = new Redis({
 *   url: process.env.UPSTASH_REDIS_REST_URL,
 *   token: process.env.UPSTASH_REDIS_REST_TOKEN,
 * });
 *
 * const ratelimit = new Ratelimit({
 *   redis,
 *   limiter: Ratelimit.slidingWindow(10, '10 s'),
 * });
 *
 * // Extract or generate request ID
 * const requestId = extractRequestId(request.headers);
 *
 * return runWithRequestId(requestId, async () => {
 *   // Get identifier (user ID or IP)
 *   const identifier = request.userId || request.ip;
 *
 *   // Check rate limit with Upstash
 *   const { success, limit, remaining } = await ratelimit.limit(identifier);
 *
 *   if (!success) {
 *     return Response.json(
 *       { error: 'Rate limit exceeded' },
 *       {
 *         status: 429,
 *         headers: {
 *           'X-RateLimit-Limit': limit.toString(),
 *           'X-RateLimit-Remaining': remaining.toString(),
 *           'X-Request-ID': requestId,
 *         }
 *       }
 *     );
 *   }
 *
 *   return handleRequest();
 * });
 */
