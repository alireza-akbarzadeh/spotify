/**
 * Shared Library
 * Simple, production-ready utilities and services
 */

// Core utilities
export { default as db } from './database';
export { logger } from './logger';
export { getOrCreateRequestId } from './request-id';

// Services
export { polarClient } from './polar';
