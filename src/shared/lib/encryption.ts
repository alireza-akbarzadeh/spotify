/**
 * Encryption Utilities
 */

import { encrypt as encryptFn, decrypt as decryptFn } from '../infrastructure/encryption';

export const encrypt = encryptFn;
export const decrypt = decryptFn;
