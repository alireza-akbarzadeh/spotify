/**
 * Shared Library
 * Simple, production-ready utilities and services
 */

// Core utilities
export { default as db } from './database';
export { logger } from './logger';
export { getOrCreateRequestId } from './request-id';
export { encrypt, decrypt } from './encryption';

// Services
export { polarClient } from './polar';
export * from './audit';
