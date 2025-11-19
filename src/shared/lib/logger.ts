/**
 * Logger
 * Pino-based structured logging
 */

import { logger as pinoLogger } from '../infrastructure/logger/pino.logger';

export const logger = pinoLogger;
