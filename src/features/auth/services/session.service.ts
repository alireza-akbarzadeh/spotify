/**
 * Session Service
 * Simple, production-ready session management with better-auth
 */

import { auth } from '@/core/auth/auth';
import { headers } from 'next/headers';
import { logger } from '@/shared/lib';
import type { SessionData } from '../types';

/**
 * Get current session
 */
export async function getCurrentSession(): Promise<SessionData | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.session || !session.user) {
      return null;
    }

    return {
      userId: session.user.id,
      sessionId: session.session.id,
      expiresAt: new Date(session.session.expiresAt),
    };
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      'Failed to get current session'
    );
    throw error;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await getCurrentSession();
    return session !== null;
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      'Failed to check authentication'
    );
    return false;
  }
}

/**
 * Get current user ID from session
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getCurrentSession();
  return session?.userId ?? null;
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    logger.info('User signed out');
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      'Failed to sign out'
    );
    throw error;
  }
}

/**
 * Require authentication (throws if not authenticated)
 */
export async function requireAuth(): Promise<SessionData> {
  const session = await getCurrentSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  return session;
}
