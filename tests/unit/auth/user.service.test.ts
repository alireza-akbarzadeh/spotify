import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getUserProfile,
  updateUserProfile,
  verifyUserEmail,
  hasCompleteProfile,
} from '../../../src/features/auth';
import type { UserProfile } from '../../../src/features/auth';

// Mock Prisma
vi.mock('@/shared/lib', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

import { db as prisma } from '@/shared/lib';

describe('User Service', () => {
  const mockUser: UserProfile = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    emailVerified: true,
    image: 'https://example.com/avatar.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should return user profile when user exists', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await getUserProfile('user-123');

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        select: {
          id: true,
          email: true,
          name: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    it('should return null when user does not exist', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await getUserProfile('non-existent');

      expect(result).toBeNull();
    });

    it('should throw error on database failure', async () => {
      vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error('Database error'));

      await expect(getUserProfile('user-123')).rejects.toThrow('Database error');
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile with valid data', async () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      vi.mocked(prisma.user.findFirst).mockResolvedValue(null); // No duplicate email
      vi.mocked(prisma.user.update).mockResolvedValue(updatedUser);

      const result = await updateUserProfile('user-123', { name: 'Updated Name' });

      expect(result.name).toBe('Updated Name');
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('should fail when email already exists', async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser);

      await expect(
        updateUserProfile('user-123', { email: 'existing@example.com' })
      ).rejects.toThrow('Email already in use');
    });

    it('should fail with invalid email format', async () => {
      await expect(updateUserProfile('user-123', { email: 'invalid-email' })).rejects.toThrow(
        'Invalid email format'
      );
    });

    it('should fail with name too short', async () => {
      await expect(updateUserProfile('user-123', { name: 'a' })).rejects.toThrow(
        'Name must be at least 2 characters'
      );
    });

    it('should fail with name too long', async () => {
      const longName = 'a'.repeat(101);
      await expect(updateUserProfile('user-123', { name: longName })).rejects.toThrow(
        'Name cannot exceed 100 characters'
      );
    });
  });

  describe('verifyUserEmail', () => {
    it('should mark email as verified', async () => {
      const verifiedUser = { ...mockUser, emailVerified: true };
      vi.mocked(prisma.user.update).mockResolvedValue(verifiedUser);

      const result = await verifyUserEmail('user-123');

      expect(result.emailVerified).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { emailVerified: true },
        select: expect.any(Object),
      });
    });
  });

  describe('hasCompleteProfile', () => {
    it('should return true when profile is complete', () => {
      const result = hasCompleteProfile(mockUser);
      expect(result).toBe(true);
    });

    it('should return false when email is not verified', () => {
      const incompleteUser = { ...mockUser, emailVerified: false };
      const result = hasCompleteProfile(incompleteUser);
      expect(result).toBe(false);
    });

    it('should return false when name is missing', () => {
      const incompleteUser = { ...mockUser, name: null };
      const result = hasCompleteProfile(incompleteUser);
      expect(result).toBe(false);
    });

    it('should return false when email is missing', () => {
      const incompleteUser = { ...mockUser, email: null };
      const result = hasCompleteProfile(incompleteUser);
      expect(result).toBe(false);
    });
  });
});
