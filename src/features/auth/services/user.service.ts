/**
 * User Service
 * Simple, production-ready user management with direct Prisma access
 */

import { db as prisma, logger } from '@/shared/lib';
import type { UserProfile, UpdateUserInput } from '../types';

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      logger.warn({ userId }, 'User not found');
      return null;
    }

    return user;
  } catch (error) {
    logger.error(
      {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      'Failed to get user profile'
    );
    throw error;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
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

    return user;
  } catch (error) {
    logger.error(
      {
        email,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      'Failed to get user by email'
    );
    throw error;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: UpdateUserInput
): Promise<UserProfile> {
  try {
    // Validate email if being updated
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new Error('Email already in use');
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Invalid email format');
      }
    }

    // Validate name if provided
    if (data.name !== undefined && data.name !== null) {
      if (data.name.length < 2) {
        throw new Error('Name must be at least 2 characters');
      }
      if (data.name.length > 100) {
        throw new Error('Name cannot exceed 100 characters');
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.image !== undefined && { image: data.image }),
      },
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

    logger.info({ userId }, 'User profile updated');
    return user;
  } catch (error) {
    logger.error(
      {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      'Failed to update user profile'
    );
    throw error;
  }
}

/**
 * Verify user email
 */
export async function verifyUserEmail(userId: string): Promise<UserProfile> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
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

    logger.info({ userId }, 'User email verified');
    return user;
  } catch (error) {
    logger.error(
      {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      'Failed to verify user email'
    );
    throw error;
  }
}

/**
 * Delete user
 */
export async function deleteUser(userId: string): Promise<void> {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    logger.info({ userId }, 'User deleted');
  } catch (error) {
    logger.error(
      {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      'Failed to delete user'
    );
    throw error;
  }
}

/**
 * Check if user has complete profile
 */
export function hasCompleteProfile(user: UserProfile): boolean {
  return !!(user.email && user.name && user.emailVerified);
}
