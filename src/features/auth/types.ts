/**
 * Auth Types
 * Simple, production-ready type definitions for authentication
 */

export interface UserProfile {
  id: string;
  email: string | null;
  name: string | null;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  image?: string;
}

export interface SessionData {
  userId: string;
  sessionId: string;
  expiresAt: Date;
}
