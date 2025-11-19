import { describe, it, expect, vi } from 'vitest';
import {
  getCurrentSession,
  isAuthenticated,
  getCurrentUserId,
  requireAuth,
} from '../../../src/features/auth';

// Mock auth
vi.mock('@/core/auth/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

// Mock headers
vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

// Mock logger
vi.mock('@/shared/infrastructure/logger/pino.logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

import { auth } from '@/core/auth/auth';

describe('Session Service', () => {
  describe('getCurrentSession', () => {
    it('should return session data when authenticated', async () => {
      const mockSession = {
        session: {
          id: 'session-123',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          userId: 'user-123',
          expiresAt: new Date('2025-12-31'),
          token: 'token-123',
        },
        user: {
          id: 'user-123',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          email: 'test@example.com',
          emailVerified: true,
          name: 'Test User',
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

      const result = await getCurrentSession();

      expect(result).toEqual({
        userId: 'user-123',
        sessionId: 'session-123',
        expiresAt: new Date('2025-12-31'),
      });
    });

    it('should return null when not authenticated', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const result = await getCurrentSession();

      expect(result).toBeNull();
    });

    it('should throw error on auth failure', async () => {
      vi.mocked(auth.api.getSession).mockRejectedValue(new Error('Auth error'));

      await expect(getCurrentSession()).rejects.toThrow('Auth error');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when session exists', async () => {
      const mockSession = {
        session: {
          id: 'session-123',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'user-123',
          expiresAt: new Date(),
          token: 'token-123',
        },
        user: {
          id: 'user-123',
          createdAt: new Date(),
          updatedAt: new Date(),
          email: 'test@example.com',
          emailVerified: true,
          name: 'Test User',
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

      const result = await isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when no session', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const result = await isAuthenticated();

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      vi.mocked(auth.api.getSession).mockRejectedValue(new Error('Error'));

      const result = await isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('getCurrentUserId', () => {
    it('should return user ID when authenticated', async () => {
      const mockSession = {
        session: {
          id: 'session-123',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'user-123',
          expiresAt: new Date(),
          token: 'token-123',
        },
        user: {
          id: 'user-123',
          createdAt: new Date(),
          updatedAt: new Date(),
          email: 'test@example.com',
          emailVerified: true,
          name: 'Test User',
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

      const result = await getCurrentUserId();

      expect(result).toBe('user-123');
    });

    it('should return null when not authenticated', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const result = await getCurrentUserId();

      expect(result).toBeNull();
    });
  });

  describe('requireAuth', () => {
    it('should return session when authenticated', async () => {
      const mockSession = {
        session: {
          id: 'session-123',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          userId: 'user-123',
          expiresAt: new Date('2025-12-31'),
          token: 'token-123',
        },
        user: {
          id: 'user-123',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          email: 'test@example.com',
          emailVerified: true,
          name: 'Test User',
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

      const result = await requireAuth();

      expect(result).toEqual({
        userId: 'user-123',
        sessionId: 'session-123',
        expiresAt: new Date('2025-12-31'),
      });
    });

    it('should throw error when not authenticated', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      await expect(requireAuth()).rejects.toThrow('Unauthorized');
    });
  });
});
