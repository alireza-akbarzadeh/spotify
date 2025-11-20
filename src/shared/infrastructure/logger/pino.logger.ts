/**
 * Pino Logger Configuration
 *
 * Structured logging with Pino for production-grade logging
 * Supports development and production environments with different output formats
 */

import pino from 'pino';
import { env } from '@/config/env';

/**
 * Create logger instance with environment-specific configuration
 * Using browser-compatible configuration for Next.js server components
 */
export const logger = pino({
  level: env.LOG_LEVEL || 'info',

  // Browser/Next.js compatible configuration
  browser: {
    asObject: true,
  },

  // Base fields included in every log
  base: {
    env: env.NODE_ENV,
    service: 'spotify-app',
  },

  // Production configuration - JSON output for log aggregation
  ...(env.NODE_ENV === 'production' && {
    formatters: {
      level: (label: string) => {
        return { level: label.toUpperCase() };
      },
    },
  }),

  // Redact sensitive information
  redact: {
    paths: [
      'password',
      'token',
      'accessToken',
      'refreshToken',
      'apiKey',
      'secret',
      'authorization',
      'cookie',
      'session',
      'req.headers.authorization',
      'req.headers.cookie',
    ],
    remove: true,
  },
}); /**
 * Create child logger with additional context
 */
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}

/**
 * Type-safe logging methods
 */
export type Logger = typeof logger;

/**
 * Example usage:
 *
 * import { logger } from '@/lib/logger';
 *
 * logger.info('User logged in', { userId: '123', email: 'user@example.com' });
 * logger.error({ err: error }, 'Failed to process request');
 * logger.debug({ data }, 'Processing data');
 * logger.warn('Rate limit approaching', { current: 90, max: 100 });
 *
 * // Create contextual logger
 * const reqLogger = createLogger({ requestId: '123', userId: 'abc' });
 * reqLogger.info('Processing request');
 */
